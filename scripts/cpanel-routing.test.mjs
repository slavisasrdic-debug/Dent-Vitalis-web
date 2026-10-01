import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { chmod, mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises';
import http from 'node:http';
import https from 'node:https';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import test from 'node:test';
import { promisify } from 'node:util';
import { canonicalHostRules, mergeLegacyHtaccess } from './cpanel-routing.mjs';

const run = promisify(execFile);
const root = resolve(import.meta.dirname, '..');
const legacy = Buffer.from(
  '# Legacy routing fixture, not the actual server configuration\r\n' +
    'RewriteEngine On\r\n' +
    'RewriteRule ^(send|gct)$ /legacy-fixture.txt [L]\r\n',
);

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

test(
  'real Apache: HTTP/TLS, five languages, query/encoding, POST, legacy routing and preview',
  { skip: process.env.DENTVITALIS_TEST_APACHE !== '1', timeout: 180_000 },
  async (t) => {
    const directory = await mkdtemp(
      join(tmpdir(), 'dentvitalis-apache-routing-'),
    );
    let container;
    let verified = false;
    t.after(async () => {
      if (container) {
        if (!verified) {
          const logs = await run('docker', ['logs', container]);
          t.diagnostic(logs.stderr);
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
    await writeFile(
      join(directory, 'htdocs/legacy-fixture.txt'),
      'Legacy route retained',
    );
    await writeFile(
      join(directory, 'htdocs/.htaccess'),
      mergeLegacyHtaccess(legacy),
    );
    await chmod(join(directory, 'htdocs'), 0o755);
    for (const name of ['index.html', 'legacy-fixture.txt', '.htaccess'])
      await chmod(join(directory, 'htdocs', name), 0o644);
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
            headers: { Host: host, ...extraHeaders },
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
    // Startup retries are local and bounded; requests never leave localhost.
    for (let attempt = 0; ; attempt++) {
      try {
        await request(false, 'localhost');
        break;
      } catch (error) {
        if (attempt === 20) {
          const logs = await run('docker', ['logs', container]);
          throw new Error(`${error.message}\n${logs.stderr}`, { cause: error });
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
    for (const host of [
      'www.dentvitalis.com',
      'dent-vitalis-web.pages.dev',
      'localhost',
      'evil.example',
    ]) {
      const result = await request(true, host);
      assert.equal(result.status, 200);
      assert.equal(result.location, undefined);
    }
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
    for (const path of ['/send?campaign=test', '/gct']) {
      const result = await request(
        true,
        'www.dentvitalis.com',
        path,
        path.startsWith('/send') ? 'POST' : 'GET',
        'fixture-only',
      );
      assert.equal(result.status, 200);
      assert.equal(result.location, undefined);
      assert.match(result.text, /Legacy route retained/);
    }
    verified = true;
  },
);
