import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { createHash } from 'node:crypto';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { promisify } from 'node:util';
import { packageCpanelRelease } from './package-cpanel-release.mjs';
import {
  sitemapEntries,
  sitemapFromRenderedPages,
} from './sitemap-hreflang.mjs';

const run = promisify(execFile);
const root = resolve(import.meta.dirname, '..');
const hash = (bytes) => createHash('sha256').update(bytes).digest('hex');
const baseName =
  'dentvitalis-web-production-candidate-20261004-whatsapp-v5.zip';
const base = resolve(root, '.astro/releases', baseName);
const outputName =
  'dentvitalis-web-production-candidate-20261004-sitemap-v6.zip';
const { stdout: dirty } = await run(
  'git',
  ['status', '--porcelain', '--untracked-files=no'],
  { cwd: root },
);
assert.equal(dirty.trim(), '', 'Commit source before recording provenance');
const { stdout: head } = await run('git', ['rev-parse', 'HEAD'], { cwd: root });
const baseSha =
  '314d95593b9ef6515317af67b662a132f2ed49c6ace4370299f31df212c3df93';
assert.equal(
  hash(await readFile(base)),
  baseSha,
  'Immutable v5 archive changed',
);
await run('unzip', ['-tq', base]);
const temporary = await mkdtemp(join(tmpdir(), 'dentvitalis-sitemap-v6-'));
try {
  await run('unzip', ['-q', base, '-d', temporary]);
  const manifest = JSON.parse(
    await readFile(join(temporary, 'release-manifest.json'), 'utf8'),
  );
  for (const file of manifest.files) {
    assert.ok(
      !file.path
        .split('/')
        .some((part) => !part || part === '.' || part === '..'),
    );
    const bytes = await readFile(join(temporary, file.path));
    assert.equal(bytes.length, file.bytes, file.path);
    assert.equal(hash(bytes), file.sha256, file.path);
  }
  const oldXml = await readFile(join(temporary, 'sitemap-0.xml'), 'utf8');
  assert.equal(await readFile(join(temporary, 'sitemap.xml'), 'utf8'), oldXml);
  const documents = JSON.parse(
    await readFile(join(temporary, 'page-routes.json'), 'utf8'),
  );
  const { xml } = await sitemapFromRenderedPages(
    temporary,
    sitemapEntries(oldXml).map((entry) => entry.url),
    documents,
  );
  assert.equal(
    xml,
    oldXml.replace(/^.*<xhtml:link\b[^\n]*hreflang="x-default"[^\n]*\n/gm, ''),
    'Only x-default XML lines may change',
  );
  assert.equal(
    xml,
    await readFile(
      resolve(root, 'docs/seo/handoff-simple-20261004/sitemap-novi.xml'),
      'utf8',
    ),
  );
  assert.ok(!xml.includes('x-default'));
  const entries = sitemapEntries(xml);
  const links = entries.reduce((sum, page) => sum + page.alternates.length, 0);
  assert.equal(entries.length, 136);
  assert.equal(links, 676);
  for (const path of ['sitemap.xml', 'sitemap-0.xml']) {
    await writeFile(join(temporary, path), xml);
    const file = manifest.files.find((file) => file.path === path);
    file.bytes = Buffer.byteLength(xml);
    file.sha256 = hash(xml);
  }
  const originalCommit = manifest.gitCommit;
  Object.assign(manifest, {
    gitCommit: head.trim(),
    contentGitCommit: originalCommit,
    generatedAt: new Date().toISOString(),
    revision: '20261004-sitemap-v6',
    supersedesArchive: baseName,
    comparedAgainst: { archiveName: baseName, sha256: baseSha },
    scope:
      'Remove all 136 x-default links from both XML urlsets only; HTML, WhatsApp, routes, htaccess, assets and backend unchanged',
    totalBytes: manifest.files.reduce((sum, file) => sum + file.bytes, 0),
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
    comparedAgainst: manifest.comparedAgainst,
    changedFiles: ['sitemap.xml', 'sitemap-0.xml', 'release-manifest.json'],
    unchangedPayloadFiles: manifest.fileCount - 2,
    allBasePayloadHashesVerified: true,
    sitemapUrls: entries.length,
    hreflangLinks: links,
    sitemapXDefaultLinks: 0,
    htmlHreflangUnchanged: true,
    pendingItalianGalleryUrlDecision:
      '/galleria proposed but not approved; current /domande-e-risposte unchanged',
    existingArchivesOverwritten: false,
    serverChanged: false,
    realPostPerformed: false,
    publicActivationApproved: false,
    intendedPrivateStage: '/home2/dentvita/releases/20261004-sitemap-v6/',
  };
  await writeFile(
    resolve(root, 'data/seo/cpanel-sitemap-v6-release-20261004.json'),
    JSON.stringify(receipt, null, 2) + '\n',
    { flag: 'wx' },
  );
  console.log(JSON.stringify(receipt, null, 2));
} finally {
  await rm(temporary, { recursive: true, force: true });
}
