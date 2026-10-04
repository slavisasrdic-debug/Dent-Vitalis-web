import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import {
  chmod,
  mkdtemp,
  mkdir,
  readFile,
  rm,
  writeFile,
} from 'node:fs/promises';
import http from 'node:http';
import https from 'node:https';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import test from 'node:test';
import { promisify } from 'node:util';
import {
  approvedContentRedirects,
  canonicalHostRules,
  mergeLegacyHtaccess,
} from './cpanel-routing.mjs';
import decisions from '../data/seo/cpanel-redirect-decisions.json' with { type: 'json' };
import { retiredThankYouRoutes } from '../src/content/thank-you-routes.ts';

const run = promisify(execFile);
const root = resolve(import.meta.dirname, '..');
const legacy = Buffer.from(
  '# Legacy routing fixture, not the actual server configuration\r\n' +
    'RewriteEngine On\r\n' +
    'RewriteRule ^(send|gct)$ /legacy-fixture.txt [L]\r\n',
);

test('compact routing keeps approved redirects and uses file-checked rules without enumerating pages', () => {
  const rules = canonicalHostRules(
    { '/hr/smjestaj': '/_pages/hr/smjestaj.html' },
    { compactStaticRouting: true },
  );
  assert.ok(!rules.includes('RewriteRule ^hr/smjestaj$'));
  assert.match(rules, /RewriteCond %\{DOCUMENT_ROOT\}\/_pages\/\$1\.html -f/);
  assert.ok(rules.includes('RewriteRule ^([a-z0-9/-]+)$ _pages/$1.html [END]'));
  assert.ok(rules.includes('RewriteRule ^([a-z0-9/-]+)/$ /$1 [R=308,L,NE]'));
  assert.ok(rules.includes('DirectorySlash Off'));
  assert.ok(rules.includes('private, no-store, max-age=0'));
  for (const { from, to } of approvedContentRedirects)
    assert.ok(
      rules.includes(`RewriteRule ^${from.slice(1)}/?$ ${to} [R=301,L,NE]`),
    );
  const merged = mergeLegacyHtaccess(
    legacy,
    {},
    { compactStaticRouting: true },
  );
  assert.deepEqual(
    mergeLegacyHtaccess(merged, {}, { compactStaticRouting: true }),
    merged,
  );
});

test('production origin is the only redirect destination; preview is not matched', () => {
  const rules = canonicalHostRules();
  assert.match(rules, /https:\/\/www\.dentvitalis\.com%1/);
  assert.match(rules, /RewriteCond %\{THE_REQUEST\}/);
  assert.match(rules, /\[R=308,L,NE\]/);
  assert.ok(
    !rules
      .split('\n')
      .filter((line) => !line.startsWith('#'))
      .join('\n')
      .includes('X-Forwarded-Proto'),
  );
  assert.ok(!rules.includes('QSD'));
  const hostCondition = rules
    .split('\n')
    .find((line) => line.includes('(?:www'));
  const regex = new RegExp(hostCondition.split(' ')[2], 'i');
  for (const host of [
    'dentvitalis.com',
    'www.dentvitalis.com',
    'DENTVITALIS.COM:443',
  ])
    assert.ok(regex.test(host));
  for (const host of [
    'dent-vitalis-web.pages.dev',
    'www.dent-vitalis-web.pages.dev',
    'localhost:4321',
    'dentvitalis.com.evil.example',
    'evil.example',
  ])
    assert.ok(!regex.test(host));
});

test('existing PHP/server directives retain their exact bytes', () => {
  const original = Buffer.from(legacy);
  const merged = mergeLegacyHtaccess(legacy);
  assert.deepEqual(
    merged.subarray(Buffer.byteLength(canonicalHostRules())),
    legacy,
  );
  assert.deepEqual(legacy, original);
  assert.deepEqual(mergeLegacyHtaccess(merged), merged);
});

test('missing or ambiguous server routing fails closed', () => {
  for (const documents of [
    { '/send': '/_pages/send.html' },
    { '/form-tokens': '/_pages/form-tokens.html' },
    { '/send-sconto': '/_pages/send-sconto.html' },
    { '/hr': '/other.html' },
    { '/hr/': '/_pages/hr.html' },
  ])
    assert.throws(() => canonicalHostRules(documents), /Invalid static/);
  for (const input of [undefined, '', Buffer.alloc(0)])
    assert.throws(() => mergeLegacyHtaccess(input), /existing cPanel/);
  for (const input of [
    Buffer.from('# BEGIN DentVitalis canonical host\n'),
    Buffer.from('# END DentVitalis canonical host\n'),
    Buffer.concat([legacy, Buffer.from(canonicalHostRules())]),
    Buffer.concat([Buffer.from(canonicalHostRules().repeat(2)), legacy]),
  ])
    assert.throws(() => mergeLegacyHtaccess(input), /Ambiguous/);
  assert.throws(
    () => mergeLegacyHtaccess(Buffer.from(canonicalHostRules())),
    /missing/,
  );
});

test('only the two approved redirects are removed; other bytes and original remain intact', () => {
  const documents = {
    '/hr/iskustva-pacijenata': '/_pages/hr/iskustva-pacijenata.html',
  };
  const approved = Buffer.from(
    'Redirect 301 /hr/iskustva-pacijenata /hr/testimonials\r\n',
  );
  const unrelated = Buffer.from('Redirect 301 /old-contact /hr/kontakt\r\n');
  const original = Buffer.concat([legacy, approved, unrelated, approved]);
  const copy = Buffer.from(original);
  const merged = mergeLegacyHtaccess(original, documents);
  assert.deepEqual(
    merged.subarray(Buffer.byteLength(canonicalHostRules(documents))),
    Buffer.concat([legacy, unrelated]),
  );
  assert.deepEqual(original, copy);
  assert.deepEqual(mergeLegacyHtaccess(merged, documents), merged);
  assert.throws(
    () => mergeLegacyHtaccess(Buffer.concat([original, approved]), documents),
    /exceeds owner approval/,
  );
  for (const rule of [
    'Redirect 301 /hr/iskustva-pacijenata /different-target\n',
    'Redirect 302 /hr/iskustva-pacijenata /hr/testimonials\n',
    'Redirect 301 /hr /elsewhere\n',
    'Redirect 301 /form-tokens /somewhere\n',
  ])
    assert.throws(
      () =>
        mergeLegacyHtaccess(
          Buffer.concat([legacy, Buffer.from(rule)]),
          documents,
        ),
      /owner review required/,
    );
});

test('production package requires a backup and cannot run as a Pages build', async () => {
  const command = ['scripts/prepare-cpanel-production-release.mjs'];
  const options = { cwd: root, env: { ...process.env, CF_PAGES: '' } };
  await assert.rejects(run('node', command, options), /--legacy-htaccess/);
  await assert.rejects(
    run('node', [...command, '--legacy-htaccess', './.htaccess'], options),
    /must be absolute/,
  );
  await assert.rejects(
    run(
      'node',
      [...command, '--legacy-htaccess', join(root, 'dist/.htaccess')],
      options,
    ),
    /outside dist/,
  );
  await assert.rejects(
    run('node', [...command, '--legacy-htaccess', '/missing/.htaccess'], {
      ...options,
      env: { ...options.env, CF_PAGES: '1' },
    }),
    /must not be built inside Cloudflare/,
  );
});

test('nine approved content redirects are exact, query-preserving and require real static targets for a release', () => {
  const documents = Object.fromEntries(
    approvedContentRedirects.map(({ to }) => [to, '/_pages' + to + '.html']),
  );
  const rules = canonicalHostRules(documents, { requireApprovedTargets: true });
  assert.equal(approvedContentRedirects.length, 9);
  for (const { from, to } of approvedContentRedirects)
    assert.ok(
      rules.includes(`RewriteRule ^${from.slice(1)}/?$ ${to} [R=301,L,NE]`),
    );
  assert.ok(!rules.includes('QSD'));
  assert.throws(
    () => canonicalHostRules({}, { requireApprovedTargets: true }),
    /target is missing/,
  );
  assert.throws(
    () =>
      canonicalHostRules({
        ...documents,
        '/alloggio': '/_pages/alloggio.html',
      }),
    /conflicting approved/,
  );
  for (const route of decisions.preservedPhpPages)
    assert.ok(!approvedContentRedirects.some(({ from }) => from === route));
});

test('approved aliases go directly to final targets; the wrong VR rule alone is removed', () => {
  const rules = approvedContentRedirects.flatMap(({ to, legacyAliases }) =>
    legacyAliases.flatMap((alias) =>
      Array.from({ length: alias.sourceOccurrences }, () => ({
        from: alias.from,
        old: alias.previousTo,
        to,
      })),
    ),
  );
  const unrelated = 'Redirect 301 /untouched /hr/kontakt\r\n# keep bytes\r\n';
  const input = Buffer.from(
    rules.map((r) => `Redirect 301 ${r.from} ${r.old}\r\n`).join('') +
      'Redirect 301 /vr_tour_eng.htm /\r\n' +
      unrelated +
      'Redirect 301 /vr_tour_eng.htm /en\r\n',
  );
  const copy = Buffer.from(input);
  const merged = mergeLegacyHtaccess(input);
  assert.deepEqual(input, copy);
  const tail = merged
    .subarray(Buffer.byteLength(canonicalHostRules()))
    .toString();
  assert.equal(
    tail,
    rules.map((r) => `Redirect 301 ${r.from} ${r.to}\r\n`).join('') +
      unrelated +
      'Redirect 301 /vr_tour_eng.htm /en\r\n',
  );
  assert.deepEqual(mergeLegacyHtaccess(merged), merged);
  assert.throws(
    () =>
      mergeLegacyHtaccess(
        Buffer.from('Redirect 301 /osoblje_eng.htm /unapproved\n'),
      ),
    /owner review required/,
  );
  assert.throws(
    () =>
      mergeLegacyHtaccess(Buffer.from('Redirect 302 /vr_tour_eng.htm /en\n')),
    /owner review required/,
  );
  assert.throws(
    () =>
      mergeLegacyHtaccess(
        Buffer.from('Redirect 301 /vr_tour_eng.htm /\n'.repeat(2)),
      ),
    /exceeds owner approval/,
  );
});

test(
  'real Apache: HTTP/TLS, five languages, query/encoding, POST, legacy routing and preview',
  { skip: process.env.DENTVITALIS_TEST_APACHE !== '1', timeout: 180_000 },
  async (t) => {
    const documents = JSON.parse(
      await readFile(join(root, 'dist/page-routes.json'), 'utf8'),
    );
    assert.ok(
      Object.keys(documents).length >= 140,
      'Build the full site before Apache acceptance',
    );
    const suppliedLegacy = process.env.DENTVITALIS_LEGACY_HTACCESS;
    // Test a complete handoff verbatim, not a regenerated substitute for it.
    const completeHtaccess = process.env.DENTVITALIS_COMPLETE_HTACCESS;
    assert.ok(
      !completeHtaccess || suppliedLegacy,
      'Supply the accepted legacy inventory with a complete candidate',
    );
    const compactStaticRouting =
      process.env.DENTVITALIS_COMPACT_HTACCESS === '1';
    const reviewRedirects =
      process.env.DENTVITALIS_SEO_HANDOFF === '1'
        ? JSON.parse(
            await readFile(
              join(root, 'data/seo/handoff-equivalent-redirects-20261004.json'),
              'utf8',
            ),
          ).redirects
        : [];
    const postLiveRedirects =
      process.env.DENTVITALIS_POST_LIVE_REDIRECTS === '1'
        ? JSON.parse(
            await readFile(
              join(root, 'data/seo/post-live-redirect-decisions-20261004.json'),
              'utf8',
            ),
          ).redirects
        : [];
    const postLiveRetired =
      process.env.DENTVITALIS_POST_LIVE_REDIRECTS === '1'
        ? JSON.parse(
            await readFile(
              join(root, 'data/seo/post-live-redirect-decisions-20261004.json'),
              'utf8',
            ),
          ).retiredRoutes
        : [];
    const sourceLegacy = suppliedLegacy
      ? await readFile(suppliedLegacy)
      : legacy;
    const directory = await mkdtemp(
      join(tmpdir(), 'dentvitalis-apache-routing-'),
    );
    let container;
    let verified = false;
    t.after(async () => {
      if (container) {
        if (!verified) {
          const logs = await run('docker', ['logs', container]);
          t.diagnostic((logs.stdout + logs.stderr).slice(-9000));
        }
        await run('docker', ['rm', '-f', container]);
      }
      await rm(directory, { recursive: true });
    });
    const image = 'httpd:2.4';
    const { stdout: originalConfig } = await run('docker', [
      'run',
      '--rm',
      image,
      'cat',
      '/usr/local/apache2/conf/httpd.conf',
    ]);
    await mkdir(join(directory, 'htdocs'));
    await writeFile(join(directory, 'htdocs/index.html'), 'Test page only');
    // Plain HTTP fixture, not a production PHP application or a real submission.
    await writeFile(
      join(directory, 'htdocs/index.php'),
      'Legacy route retained',
    );
    await writeFile(
      join(directory, 'htdocs/legacy-fixture.txt'),
      'Legacy route retained',
    );
    await writeFile(
      join(directory, 'htdocs/.htaccess'),
      completeHtaccess
        ? Buffer.from(
            (await readFile(completeHtaccess, 'utf8')).replace(
              /^ModPagespeed\s+off\s*$/gm,
              '# Fixture only: stock httpd has no mod_pagespeed.',
            ) +
              '\n# Fixture only: dummy PHP is text; no real submissions.\n' +
              '<Files "index.php">\nSetHandler default-handler\n</Files>\n',
          )
        : suppliedLegacy
          ? Buffer.from(
              mergeLegacyHtaccess(sourceLegacy, documents, {
                requireApprovedTargets: true,
                compactStaticRouting,
                reviewRedirects,
              })
                .toString()
                .replace(
                  /^ModPagespeed\s+off\s*$/gm,
                  '# Fixture only: stock httpd has no mod_pagespeed.',
                ) +
                '\n# Fixture only: serve the dummy PHP bootstrap as text, not actual PHP.\n' +
                '<Files "index.php">\nSetHandler default-handler\n</Files>\n',
            )
          : mergeLegacyHtaccess(sourceLegacy, documents, {
              compactStaticRouting,
            }),
    );
    await chmod(join(directory, 'htdocs'), 0o755);
    // An index regression must not pass merely because autoindex also returns 200.
    await mkdir(join(directory, 'htdocs', 'empty-index-fixture'));
    await chmod(join(directory, 'htdocs', 'empty-index-fixture'), 0o755);
    for (const name of [
      'index.html',
      'index.php',
      'legacy-fixture.txt',
      '.htaccess',
    ])
      await chmod(join(directory, 'htdocs', name), 0o644);
    for (const document of Object.values(documents)) {
      const file = join(directory, 'htdocs', document);
      await mkdir(dirname(file), { recursive: true });
      for (
        let folder = dirname(file);
        folder !== join(directory, 'htdocs');
        folder = dirname(folder)
      )
        await chmod(folder, 0o755);
      await writeFile(file, 'Confirmation fixture');
      await chmod(file, 0o644);
    }
    // Migration can leave legacy directories behind; they must not force '/'.
    for (const route of [
      '/hr/hvala',
      ...retiredThankYouRoutes,
      '/legacy-admin',
    ]) {
      const folder = join(directory, 'htdocs', route);
      await mkdir(folder, { recursive: true });
      for (
        let parent = folder;
        parent !== join(directory, 'htdocs');
        parent = dirname(parent)
      )
        await chmod(parent, 0o755);
      const file = join(folder, 'index.html');
      await writeFile(file, 'Legacy HTML must not win');
      await chmod(file, 0o644);
    }
    await run('openssl', [
      'req',
      '-x509',
      '-newkey',
      'rsa:2048',
      '-nodes',
      '-days',
      '1',
      '-keyout',
      join(directory, 'key.pem'),
      '-out',
      join(directory, 'cert.pem'),
      '-subj',
      '/CN=localhost',
    ]);
    const config = originalConfig
      .replace('#LoadModule rewrite_module', 'LoadModule rewrite_module')
      .replace('#LoadModule ssl_module', 'LoadModule ssl_module')
      .replace('#LoadModule headers_module', 'LoadModule headers_module')
      .replace('#LoadModule expires_module', 'LoadModule expires_module')
      .replace(
        '#LoadModule socache_shmcb_module',
        'LoadModule socache_shmcb_module',
      )
      .replaceAll('AllowOverride None', 'AllowOverride All');
    await writeFile(
      join(directory, 'httpd.conf'),
      config +
        '\nServerName localhost\nListen 443\n' +
        '<VirtualHost *:443>\nSSLEngine on\n' +
        'SSLCertificateFile /routing-test/cert.pem\n' +
        'SSLCertificateKeyFile /routing-test/key.pem\n</VirtualHost>\n',
    );
    ({ stdout: container } = await run('docker', [
      'run',
      '--detach',
      '--rm',
      '-p',
      '127.0.0.1::80',
      '-p',
      '127.0.0.1::443',
      '-v',
      `${directory}:/routing-test:ro`,
      '-v',
      `${directory}/httpd.conf:/usr/local/apache2/conf/httpd.conf:ro`,
      '-v',
      `${directory}/htdocs:/usr/local/apache2/htdocs:ro`,
      image,
    ]));
    container = container.trim();
    const { stdout: details } = await run('docker', ['inspect', container]);
    const ports = JSON.parse(details)[0].NetworkSettings.Ports;

    function request(
      tls,
      host,
      path = '/',
      method = 'GET',
      body,
      extraHeaders = {},
    ) {
      return new Promise((accept, reject) => {
        const req = (tls ? https : http).request(
          {
            hostname: '127.0.0.1',
            port: Number(ports[tls ? '443/tcp' : '80/tcp'][0].HostPort),
            path,
            method,
            headers: {
              Host: host,
              ...(body === undefined
                ? {}
                : { 'Content-Length': Buffer.byteLength(body) }),
              ...extraHeaders,
            },
            rejectUnauthorized: false, // One-day self-signed local fixture only.
          },
          (res) => {
            let text = '';
            res.setEncoding('utf8');
            res.on('data', (chunk) => {
              text += chunk;
            });
            res.on('end', () =>
              accept({
                status: res.statusCode,
                location: res.headers.location,
                cacheControl: res.headers['cache-control'],
                text,
              }),
            );
          },
        );
        req.setTimeout(4000, () =>
          req.destroy(new Error('Apache fixture timeout')),
        );
        req.on('error', reject);
        req.end(body);
      });
    }
    // Wait for worker readiness, not just the running parent process. Cold
    // Docker/TLS starts can outlive the old two-second retry window.
    // Retries are local and bounded; requests never leave localhost.
    const startupDeadline = Date.now() + 15_000;
    for (;;) {
      try {
        await request(false, 'localhost');
        break;
      } catch (error) {
        if (Date.now() >= startupDeadline) {
          const logs = await run('docker', ['logs', container]);
          const syntax = await run('docker', [
            'exec',
            container,
            'httpd',
            '-t',
          ]).catch((error) => error);
          const processes = await run('docker', ['top', container]);
          throw new Error(
            `${error.message}\n${logs.stdout}${logs.stderr}\n${syntax.stdout}${syntax.stderr}\n${processes.stdout}`,
            { cause: error },
          );
        }
        await new Promise((accept) => setTimeout(accept, 100));
      }
    }

    for (const tls of [false, true])
      for (const host of ['dentvitalis.com', 'www.dentvitalis.com']) {
        if (tls && host.startsWith('www.')) continue;
        for (const lang of ['', 'hr/', 'de/', 'en/', 'si/']) {
          const path = `/${lang}?utm_source=a%2Bb&item=1&item=2`;
          const result = await request(tls, host, path);
          assert.equal(result.status, 308);
          assert.equal(result.location, 'https://www.dentvitalis.com' + path);
        }
      }
    for (const path of ['/a%20b/%C4%8D%23x?q=a%26b', '/hr/?gclid=A%2FB%3D']) {
      const result = await request(true, 'dentvitalis.com', path);
      assert.equal(result.status, 308);
      assert.equal(result.location, 'https://www.dentvitalis.com' + path);
    }
    // The original server rules also redirect unrelated hosts; only our owned
    // block promises not to match preview hosts. Pages never receives this file.
    for (const host of suppliedLegacy
      ? ['www.dentvitalis.com']
      : [
          'www.dentvitalis.com',
          'dent-vitalis-web.pages.dev',
          'localhost',
          'evil.example',
        ]) {
      const result = await request(true, host);
      assert.equal(result.status, 200, JSON.stringify({ host, result }));
      assert.equal(result.location, undefined);
      assert.equal(
        result.text,
        'Test page only',
        'Root must serve index.html, never a directory listing or PHP fallback',
      );
    }
    const explicitIndex = await request(
      true,
      'www.dentvitalis.com',
      '/index.html?dv_index_check=fixture',
    );
    assert.equal(explicitIndex.status, 200);
    assert.equal(explicitIndex.text, 'Test page only');
    const emptyDirectory = await request(
      true,
      'www.dentvitalis.com',
      '/empty-index-fixture/',
    );
    assert.equal(
      emptyDirectory.status,
      403,
      'Options -Indexes must forbid directory listing',
    );
    assert.ok(!emptyDirectory.text.includes('Index of /empty-index-fixture'));
    for (const path of [
      '/send?campaign=test',
      '/gct',
      '/form-tokens',
      '/send-sconto',
    ]) {
      const result = await request(
        true,
        'www.dentvitalis.com',
        path,
        path.startsWith('/send') ? 'POST' : 'GET',
        path.startsWith('/send') ? 'fixture-only' : undefined,
      );
      assert.equal(result.status, 200);
      assert.equal(result.location, undefined);
      assert.match(result.text, /Legacy route retained/);
      assert.equal(result.cacheControl, 'private, no-store, max-age=0');
    }
    for (const route of Object.keys(documents)) {
      const result = await request(
        true,
        'www.dentvitalis.com',
        route + '?utm_source=fixture',
      );
      assert.equal(result.status, 200, JSON.stringify({ route, result }));
      assert.equal(result.location, undefined);
      assert.match(result.text, /Confirmation fixture/);
      const alias = await request(
        true,
        'www.dentvitalis.com',
        route + '/?utm_source=a%2Bb&item=1&item=2',
      );
      assert.equal(alias.status, 308, route);
      assert.equal(new URL(alias.location).pathname, route);
      assert.equal(
        new URL(alias.location).search,
        '?utm_source=a%2Bb&item=1&item=2',
      );
    }
    for (const route of [...retiredThankYouRoutes, ...postLiveRetired]) {
      const result = await request(
        true,
        'www.dentvitalis.com',
        route + '?utm_source=fixture',
      );
      assert.equal(result.status, 410);
      assert.equal(result.location, undefined);
      const alias = await request(true, 'www.dentvitalis.com', route + '/');
      assert.equal(alias.status, 410);
    }
    // These are localhost HTTP fixtures only, not cPanel GETs or real form submissions.
    const redirects = approvedContentRedirects.flatMap(
      ({ from, to, legacyAliases }) => [
        { from, to },
        ...(suppliedLegacy
          ? legacyAliases.map((alias) => ({ from: alias.from, to }))
          : []),
      ],
    );
    if (suppliedLegacy) redirects.push(decisions.vrTour);
    redirects.push(...reviewRedirects);
    redirects.push(...postLiveRedirects);
    for (const { from, to } of redirects) {
      const query = '?dv_migration_check=a%2Bb&item=1&item=2';
      const redirected = await request(
        true,
        'www.dentvitalis.com',
        from + query,
      );
      assert.equal(redirected.status, 301, from);
      assert.equal(new URL(redirected.location).pathname, to, from);
      assert.equal(new URL(redirected.location).search, query, from);
      const final = await request(true, 'www.dentvitalis.com', to + query);
      assert.equal(final.status, 200, to);
      assert.equal(final.location, undefined, to);
      assert.match(final.text, /Confirmation fixture/);
    }
    for (const { from, to } of [
      ...approvedContentRedirects,
      ...reviewRedirects,
      ...postLiveRedirects,
    ]) {
      const result = await request(
        true,
        'www.dentvitalis.com',
        from + '/?dv_migration_check=slash',
      );
      assert.equal(result.status, 301, from);
      assert.equal(new URL(result.location).pathname, to);
    }
    if (suppliedLegacy)
      for (const route of decisions.preservedPhpPages) {
        const result = await request(true, 'www.dentvitalis.com', route);
        assert.equal(result.status, 200, route);
        assert.equal(result.location, undefined, route);
        assert.match(result.text, /Legacy route retained/);
      }
    // Check every retained legacy line too, including duplicate sources and
    // the old /sl prefix. Canonical slash normalization is allowed, loops are not.
    if (suppliedLegacy) {
      const merged = mergeLegacyHtaccess(sourceLegacy, documents, {
        requireApprovedTargets: true,
        compactStaticRouting,
        reviewRedirects,
      }).toString();
      const retained = [
        ...merged.matchAll(/^Redirect\s+301\s+(\S+)\s+(\S+)\s*$/gm),
      ];
      assert.equal(retained.length, 64);
      for (const [, from, to] of retained) {
        const query = '?dv_migration_check=legacy%2Bline&item=1&item=2';
        let path = from + query;
        const visited = new Set();
        for (let hop = 0; hop < 5; hop++) {
          assert.ok(!visited.has(path), `Legacy redirect loop: ${from}`);
          visited.add(path);
          const response = await request(true, 'www.dentvitalis.com', path);
          if (response.status === 200) {
            assert.ok(hop > 0, `Legacy source did not redirect: ${from}`);
            const finalPath = new URL(path, 'https://www.dentvitalis.com')
              .pathname;
            assert.equal(
              finalPath,
              to === '/' ? '/' : to.replace(/\/+$/, ''),
              from,
            );
            break;
          }
          assert.ok(
            [301, 308].includes(response.status),
            `${from}: unexpected ${response.status}`,
          );
          const next = new URL(response.location);
          assert.equal(next.origin, 'https://www.dentvitalis.com');
          assert.equal(next.search, query, from);
          path = next.pathname + next.search;
          assert.ok(hop < 4, `Excessive legacy redirect chain: ${from}`);
        }
      }
    }
    const legacyDirectory = await request(
      true,
      'www.dentvitalis.com',
      '/legacy-admin',
    );
    assert.equal(legacyDirectory.status, 301);
    assert.equal(new URL(legacyDirectory.location).pathname, '/legacy-admin/');
    const spoof = await request(
      false,
      'www.dentvitalis.com',
      '/',
      'GET',
      undefined,
      {
        'X-Forwarded-Proto': 'https',
      },
    );
    assert.equal(spoof.status, 308);
    const post = await request(
      false,
      'dentvitalis.com',
      '/send?campaign=test',
      'POST',
      'fixture-only',
    );
    assert.equal(post.status, 308);
    assert.equal(
      post.location,
      'https://www.dentvitalis.com/send?campaign=test',
    );
    verified = true;
  },
);
