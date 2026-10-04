import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { createHash } from 'node:crypto';
import {
  mkdtemp,
  mkdir,
  readFile,
  rename,
  rm,
  writeFile,
} from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { promisify } from 'node:util';
import { packageCpanelRelease } from './package-cpanel-release.mjs';
import { mergeLegacyHtaccess } from './cpanel-routing.mjs';
import { readableHtaccess } from './readable-htaccess.mjs';
import {
  pageMetadata,
  sitemapEntries,
  sitemapFromRenderedPages,
} from './sitemap-hreflang.mjs';

const run = promisify(execFile);
const root = resolve(import.meta.dirname, '..');
const hash = (bytes) => createHash('sha256').update(bytes).digest('hex');
const baseName = 'dentvitalis-web-production-candidate-20261004-ready-v7.zip';
const baseSha =
  '5d8e37c1af782ecf417ec2633422edd0803cc8aa57d6c9dff2dcd5a9fe250669';
const outputName =
  'dentvitalis-web-production-candidate-20261004-galleria-v8.zip';
const from = '/domande-e-risposte';
const to = '/galleria';
// Only known random ARIA identifiers differ between otherwise identical builds.
const stableHtml = (html) => {
  const ids = new Map();
  return html.replace(
    /(?:navigation|inquiry-heading|inquiry|whatsapp)-[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}/g,
    (id) => {
      if (!ids.has(id)) ids.set(id, `generated-aria-id-${ids.size}`);
      return ids.get(id);
    },
  );
};
const handoff = resolve(root, 'docs/seo/handoff-galleria-v8-20261004');
const temporary = await mkdtemp(join(tmpdir(), 'dentvitalis-galleria-v8-'));
try {
  assert.equal(
    hash(await readFile(resolve(root, '.astro/releases', baseName))),
    baseSha,
  );
  await run('unzip', [
    '-q',
    resolve(root, '.astro/releases', baseName),
    '-d',
    temporary,
  ]);
  const manifestBytes = await readFile(
    join(temporary, 'release-manifest.json'),
  );
  const manifest = JSON.parse(manifestBytes);
  assert.equal(manifest.fileCount, 691);
  const changes = [];
  let unchanged = 0;
  // Exact URL-only edits to the accepted package: retain every asset, visible
  // text, form, tracking and WhatsApp byte outside this approved path change.
  for (const file of manifest.files) {
    const old = await readFile(join(temporary, file.path));
    assert.equal(old.length, file.bytes, file.path);
    assert.equal(hash(old), file.sha256, file.path);
    const oldPath = file.path;
    let bytes = old;
    if (
      /\.html$/.test(file.path) ||
      [
        'page-routes.json',
        '_redirects',
        'sitemap.xml',
        'sitemap-0.xml',
      ].includes(file.path)
    ) {
      bytes = Buffer.from(old.toString().replaceAll(from, to));
    }
    if (file.path === '_pages/domande-e-risposte.html') {
      file.path = '_pages/galleria.html';
      await rename(join(temporary, oldPath), join(temporary, file.path));
    }
    if (file.path === '_redirects') {
      bytes = Buffer.from(
        `# Owner-approved Italian gallery rename; matches the Apache 301.\n${from} ${to} 301\n${from}/ ${to} 301\n` +
          bytes.toString(),
      );
    }
    if (file.path === '.htaccess') {
      const equivalents = JSON.parse(
        await readFile(
          resolve(root, 'data/seo/handoff-equivalent-redirects-20261004.json'),
          'utf8',
        ),
      );
      assert.equal(equivalents.status, 'owner-and-seo-approved-for-candidate');
      const documents = JSON.parse(
        await readFile(resolve(root, 'dist/page-routes.json'), 'utf8'),
      );
      bytes = Buffer.from(
        readableHtaccess(
          mergeLegacyHtaccess(
            await readFile(
              resolve(root, 'docs/seo/handoff-simple-20261004/.htaccess'),
            ),
            documents,
            {
              requireApprovedTargets: true,
              compactStaticRouting: true,
              reviewRedirects: equivalents.redirects,
            },
          ),
          { seoApproved: true },
        ),
      );
    }
    if (!bytes.equals(old) || file.path !== oldPath) {
      changes.push({
        path: file.path,
        previousPath: oldPath,
        beforeSha256: file.sha256,
        afterSha256: hash(bytes),
      });
      await writeFile(join(temporary, file.path), bytes);
    } else unchanged++;
    Object.assign(file, { bytes: bytes.length, sha256: hash(bytes) });
  }
  manifest.files.sort((a, b) => a.path.localeCompare(b.path, 'en'));
  const documents = JSON.parse(
    await readFile(join(temporary, 'page-routes.json'), 'utf8'),
  );
  assert.deepEqual(
    documents,
    JSON.parse(await readFile(resolve(root, 'dist/page-routes.json'), 'utf8')),
  );
  assert.ok(documents[to] && !documents[from]);
  const sitemap = await readFile(join(temporary, 'sitemap.xml'), 'utf8');
  const entries = sitemapEntries(sitemap);
  assert.equal(entries.length, 136);
  assert.equal(
    entries.reduce((n, entry) => n + entry.alternates.length, 0),
    676,
  );
  assert.ok(!sitemap.includes('x-default') && !sitemap.includes(from));
  const rendered = await sitemapFromRenderedPages(
    temporary,
    entries.map((entry) => entry.url),
    documents,
  );
  assert.equal(rendered.xml, sitemap);
  assert.equal(
    await readFile(join(temporary, 'sitemap-0.xml'), 'utf8'),
    sitemap,
  );
  // Independently compare all packaged metadata with a fresh source build.
  for (const file of manifest.files.filter((entry) =>
    entry.path.endsWith('.html'),
  )) {
    const html = await readFile(join(temporary, file.path), 'utf8');
    assert.ok(!html.includes(from), file.path);
    const fresh = await readFile(resolve(root, 'dist', file.path), 'utf8');
    assert.ok(
      stableHtml(html) === stableHtml(fresh),
      `Unexpected rebuilt HTML difference: ${file.path}`,
    );
    assert.deepEqual(pageMetadata(html), pageMetadata(fresh), file.path);
  }
  await mkdir(handoff, { recursive: true });
  for (const name of ['.htaccess', 'sitemap.xml']) {
    const bytes = await readFile(join(temporary, name));
    // Preview mode provides the actual candidate for Apache tests before commit.
    await writeFile(join(handoff, name), bytes);
  }
  if (process.argv.includes('--prepare-review')) {
    console.log(
      'Prepared final v8 htaccess/sitemap for pre-package Apache verification; no archive created.',
    );
  } else {
    const { stdout: dirty } = await run(
      'git',
      ['status', '--porcelain', '--untracked-files=no'],
      { cwd: root },
    );
    assert.equal(
      dirty.trim(),
      '',
      'Commit source and tested handoff before recording release provenance',
    );
    const { stdout: head } = await run('git', ['rev-parse', 'HEAD'], {
      cwd: root,
    });
    Object.assign(manifest, {
      gitCommit: head.trim(),
      previousContentGitCommit: manifest.contentGitCommit,
      contentGitCommit: head.trim(),
      htaccessRevisionGitCommit: head.trim(),
      generatedAt: new Date().toISOString(),
      revision: '20261004-galleria-v8',
      supersedesArchive: baseName,
      comparedAgainst: {
        archiveName: baseName,
        sha256: baseSha,
        manifestSha256: hash(manifestBytes),
      },
      changedFiles: changes,
      scope:
        'Approved Italian gallery URL and consumers; approved readable SEO rules; assets, forms, WhatsApp, backend requirements and visible text preserved',
      approval: {
        seoMaster: 'owner-confirms-approved-2026-10-04',
        ownerPublicActivation:
          'owner-requests-migration-after-verified-package',
        reviewRedirects: 'eight-approved-plus-Italian-gallery-301',
      },
      publicActivationApproved: true,
      totalBytes: manifest.files.reduce((n, file) => n + file.bytes, 0),
    });
    await writeFile(
      join(temporary, 'release-manifest.json'),
      JSON.stringify(manifest, null, 2) + '\n',
    );
    const receipt = {
      ...(await packageCpanelRelease(
        temporary,
        resolve(root, '.astro/releases', outputName),
      )),
      revision: manifest.revision,
      packageGitCommit: head.trim(),
      immutableBaseArchive: manifest.comparedAgainst,
      changedFiles: changes,
      unchangedPayloadFiles: unchanged,
      verifiedBaseHashes: 691,
      sitemapUrls: 136,
      hreflangLinks: 676,
      sitemapXDefaultLinks: 0,
      approval: manifest.approval,
      serverChanged: false,
      backendChanged: false,
      realPostPerformed: false,
      intendedPrivateStage: '/home2/dentvita/releases/20261004-galleria-v8/',
      existingPrivateNextRoot:
        '/home2/dentvita/public_html-next-20261004-localized-v3/',
    };
    await writeFile(
      resolve(root, 'data/seo/cpanel-galleria-v8-release-20261004.json'),
      JSON.stringify(receipt, null, 2) + '\n',
      { flag: 'wx' },
    );
    await run(
      'zip',
      [
        '-q',
        '-X',
        resolve(
          root,
          '.astro/reports/DentVitalis-SEO-galleria-v8-20261004.zip',
        ),
        '.htaccess',
        'sitemap.xml',
        'NAPOMENA-ZA-WEBMASTER-I-SEO.txt',
      ],
      { cwd: handoff },
    );
    console.log(
      JSON.stringify(
        {
          archive: outputName,
          ...receipt,
          changedFiles: changes.map((file) => file.path),
        },
        null,
        2,
      ),
    );
  }
} finally {
  await rm(temporary, { recursive: true, force: true });
}
