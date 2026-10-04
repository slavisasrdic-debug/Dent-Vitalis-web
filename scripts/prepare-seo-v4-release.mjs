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
const sourceName =
  'dentvitalis-web-production-candidate-20261004-localized-v3.zip';
const sourceSha =
  'ada0eed003483020c5b2d632a83f16f497aab0ae2a5dd6fdac667d75588200b1';
const outputName = 'dentvitalis-web-production-candidate-20261004-seo-v4.zip';
const output = resolve(root, '.astro/releases', outputName);
const source = resolve(root, '.astro/releases', sourceName);
const handoff = resolve(root, 'docs/seo/handoff-simple-20261004');

// Package-only revision of accepted v3: no rebuild, backend, hosting or POSTs.
const { stdout: dirty } = await run(
  'git',
  ['status', '--porcelain', '--untracked-files=no'],
  { cwd: root },
);
assert.equal(
  dirty.trim(),
  '',
  'Commit tracked changes before preparing release provenance',
);
const { stdout: head } = await run('git', ['rev-parse', 'HEAD'], { cwd: root });
const { stdout: seoHead } = await run(
  'git',
  ['log', '-1', '--format=%H', '--', 'docs/seo/handoff-simple-20261004'],
  { cwd: root },
);
const sourceBytes = await readFile(source);
assert.equal(
  hash(sourceBytes),
  sourceSha,
  'Accepted v3 ZIP changed; stop rather than rebuild or substitute it',
);
await run('unzip', ['-tq', source]);
const temporary = await mkdtemp(join(tmpdir(), 'dentvitalis-seo-v4-'));
try {
  await run('unzip', ['-q', source, '-d', temporary]);
  const originalBytes = await readFile(
    join(temporary, 'release-manifest.json'),
  );
  const original = JSON.parse(originalBytes);
  assert.equal(original.gitCommit, '935e5bb7c43def0d73a33fe3fc744a405acc1f8d');
  assert.equal(original.fileCount, 691);
  assert.equal(original.files.length, 691);
  for (const file of original.files) {
    assert.ok(
      !file.path
        .split('/')
        .some((part) => !part || part === '.' || part === '..'),
    );
    const bytes = await readFile(join(temporary, file.path));
    assert.equal(bytes.length, file.bytes, file.path);
    assert.equal(hash(bytes), file.sha256, file.path);
  }
  const report = JSON.parse(
    await readFile(join(handoff, 'report.json'), 'utf8'),
  );
  const htaccess = await readFile(join(handoff, '.htaccess'));
  const sitemap = await readFile(join(handoff, 'sitemap-novi.xml'));
  assert.equal(hash(htaccess), report.htaccess.sha256);
  assert.equal(hash(sitemap), report.newSitemap.sha256);
  const routes = JSON.parse(
    await readFile(join(temporary, 'page-routes.json'), 'utf8'),
  );
  const { xml, pages } = await sitemapFromRenderedPages(
    temporary,
    sitemapEntries(sitemap.toString()).map((entry) => entry.url),
    routes,
  );
  assert.equal(
    xml,
    sitemap.toString(),
    'Handoff sitemap must match the exact v3 HTML language pairs',
  );
  assert.equal(pages.length, 136);
  const changes = new Map([
    ['.htaccess', htaccess],
    ['sitemap.xml', sitemap],
    ['sitemap-0.xml', sitemap],
  ]);
  const changedFiles = [];
  const files = original.files.map((file) => {
    const replacement = changes.get(file.path);
    if (!replacement) return file;
    assert.notEqual(
      hash(replacement),
      file.sha256,
      'Revision unexpectedly unchanged',
    );
    const updated = {
      path: file.path,
      bytes: replacement.length,
      sha256: hash(replacement),
    };
    changedFiles.push({
      path: file.path,
      beforeSha256: file.sha256,
      afterSha256: updated.sha256,
    });
    return updated;
  });
  assert.equal(changedFiles.length, changes.size);
  for (const [path, bytes] of changes)
    await writeFile(join(temporary, path), bytes);
  const manifest = {
    ...original,
    generatedAt: new Date().toISOString(),
    gitCommit: head.trim(),
    contentGitCommit: original.gitCommit,
    seoRevisionGitCommit: seoHead.trim(),
    derivedFrom: {
      archiveName: sourceName,
      sha256: sourceSha,
      manifestSha256: hash(originalBytes),
    },
    revision: '20261004-seo-v4',
    changedFiles,
    scope:
      'Only htaccess, root/part sitemap and regenerated integrity manifest; all HTML/assets/backend prerequisites unchanged',
    publicActivationApproved: false,
    files,
    totalBytes: files.reduce((sum, file) => sum + file.bytes, 0),
  };
  await writeFile(
    join(temporary, 'release-manifest.json'),
    JSON.stringify(manifest, null, 2) + '\n',
  );
  const packaged = await packageCpanelRelease(temporary, output);
  const receipt = {
    ...packaged,
    status:
      'verified-local-full-static-upload-candidate-not-uploaded-not-activated',
    uploadRequestedByOwnerOn: '2026-10-04',
    contentGitCommit: original.gitCommit,
    packageGitCommit: head.trim(),
    seoRevisionGitCommit: seoHead.trim(),
    immutableBaseArchive: {
      archiveName: sourceName,
      sha256: sourceSha,
      all691PayloadHashesVerified: true,
    },
    changedFiles,
    unchangedPayloadFiles: original.files.length - changes.size,
    sitemapUrls: pages.length,
    hreflangLinks: pages.reduce((sum, page) => sum + page.alternates.length, 0),
    backendChanged: false,
    sourceDistChanged: false,
    existingArchiveOverwritten: false,
    serverChanged: false,
    realPostPerformed: false,
    publicActivationApproved: false,
    intendedPrivateStage: '/home2/dentvita/releases/20261004-seo-v4/',
    existingPrivateNextRoot:
      '/home2/dentvita/public_html-next-20261004-localized-v3/',
    privateNextRootUpdateRequiresSeparateApproval: true,
    privateNextRootFilesToReplace: [...changes.keys(), 'release-manifest.json'],
    pendingProductionChecks: [
      'new-review-301-approval',
      'preserved-legacy-PHP-HTTP-check',
      'production-GTM-CookieYes-consent',
      'controlled-public-switch-and-code-only-rollback',
    ],
  };
  await writeFile(
    resolve(root, 'data/seo/cpanel-seo-v4-release-20261004.json'),
    JSON.stringify(receipt, null, 2) + '\n',
    { flag: 'wx' },
  );
  console.log(JSON.stringify(receipt, null, 2));
} finally {
  // Delete only this call's mkdtemp extraction, never dist/releases/server data.
  await rm(temporary, { recursive: true, force: true });
}
