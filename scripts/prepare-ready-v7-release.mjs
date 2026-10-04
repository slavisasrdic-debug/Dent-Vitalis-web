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
const baseName = 'dentvitalis-web-production-candidate-20261004-sitemap-v6.zip';
const baseSha =
  'b36f33047593dd55e76b4e85a1d77cea1dce826c77d20d79f9acfb29079f1462';
const base = resolve(root, '.astro/releases', baseName);
const outputName = 'dentvitalis-web-production-candidate-20261004-ready-v7.zip';
const { stdout: dirty } = await run(
  'git',
  ['status', '--porcelain', '--untracked-files=no'],
  { cwd: root },
);
assert.equal(
  dirty.trim(),
  '',
  'Commit source before recording release provenance',
);
const { stdout: head } = await run('git', ['rev-parse', 'HEAD'], { cwd: root });
const { stdout: routingCommit } = await run(
  'git',
  [
    'log',
    '-1',
    '--format=%H',
    '--',
    'docs/seo/handoff-readable-20261004/.htaccess',
  ],
  { cwd: root },
);
assert.equal(
  hash(await readFile(base)),
  baseSha,
  'Immutable v6 archive changed',
);
await run('unzip', ['-tq', base]);
const temporary = await mkdtemp(join(tmpdir(), 'dentvitalis-ready-v7-'));
try {
  await run('unzip', ['-q', base, '-d', temporary]);
  const baseManifestBytes = await readFile(
    join(temporary, 'release-manifest.json'),
  );
  const manifest = JSON.parse(baseManifestBytes);
  assert.equal(manifest.fileCount, 691);
  assert.equal(manifest.files.length, 691);
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
  const rules = await readFile(
    resolve(root, 'docs/seo/handoff-readable-20261004/.htaccess'),
  );
  const review = JSON.parse(
    await readFile(
      resolve(root, 'data/seo/htaccess-attachment-review-20261004.json'),
      'utf8',
    ),
  );
  assert.equal(hash(rules), review.outputSha256);
  const sitemap = await readFile(join(temporary, 'sitemap.xml'), 'utf8');
  assert.equal(
    sitemap,
    await readFile(join(temporary, 'sitemap-0.xml'), 'utf8'),
  );
  assert.equal(
    sitemap,
    await readFile(
      resolve(root, 'docs/seo/handoff-simple-20261004/sitemap-novi.xml'),
      'utf8',
    ),
  );
  const documents = JSON.parse(
    await readFile(join(temporary, 'page-routes.json'), 'utf8'),
  );
  const entries = sitemapEntries(sitemap);
  const { xml } = await sitemapFromRenderedPages(
    temporary,
    entries.map((entry) => entry.url),
    documents,
  );
  assert.equal(
    xml,
    sitemap,
    'Sitemap must still match the actual packaged HTML language pairs',
  );
  assert.equal(entries.length, 136);
  assert.equal(
    entries.reduce((sum, entry) => sum + entry.alternates.length, 0),
    676,
  );
  assert.ok(!sitemap.includes('x-default'));
  const htaccessFile = manifest.files.find((file) => file.path === '.htaccess');
  assert.notEqual(hash(rules), htaccessFile.sha256);
  const change = {
    path: '.htaccess',
    beforeSha256: htaccessFile.sha256,
    afterSha256: hash(rules),
  };
  Object.assign(htaccessFile, { bytes: rules.length, sha256: hash(rules) });
  await writeFile(join(temporary, '.htaccess'), rules);
  Object.assign(manifest, {
    gitCommit: head.trim(),
    htaccessRevisionGitCommit: routingCommit.trim(),
    generatedAt: new Date().toISOString(),
    revision: '20261004-ready-v7',
    supersedesArchive: baseName,
    comparedAgainst: {
      archiveName: baseName,
      sha256: baseSha,
      manifestSha256: hash(baseManifestBytes),
    },
    changedFiles: [change],
    scope:
      'Readable reviewed htaccess and regenerated manifest only; accepted sitemap, all HTML, WhatsApp, assets and backend requirements unchanged',
    approval: {
      seoMaster: 'pending',
      ownerPublicActivation: 'pending',
      reviewRedirects: 'eight-rules-in-section-5-awaiting-confirmation',
    },
    publicActivationApproved: false,
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
    status:
      'verified-local-upload-candidate-awaiting-seo-confirmation-not-uploaded-not-activated',
    revision: manifest.revision,
    packageGitCommit: head.trim(),
    contentGitCommit: manifest.contentGitCommit,
    htaccessRevisionGitCommit: routingCommit.trim(),
    immutableBaseArchive: manifest.comparedAgainst,
    all691BasePayloadHashesVerified: true,
    changedFiles: ['.htaccess', 'release-manifest.json'],
    unchangedPayloadFiles: 690,
    sitemapUrls: 136,
    hreflangLinks: 676,
    sitemapXDefaultLinks: 0,
    htmlAndWhatsAppUnchanged: true,
    htaccessIdenticalToSeoReview: true,
    seoApproval: 'pending',
    pendingItalianGalleryUrlDecision:
      '/domande-e-risposte retained; /galleria still requires confirmation',
    publicActivationApproved: false,
    existingArchivesOverwritten: false,
    serverChanged: false,
    backendChanged: false,
    realPostPerformed: false,
    intendedPrivateStage: '/home2/dentvita/releases/20261004-ready-v7/',
    existingPrivateNextRoot:
      '/home2/dentvita/public_html-next-20261004-localized-v3/',
    privateNextRootFilesToReplaceAfterSeparateApproval: [
      '_pages/',
      'index.html',
      '.htaccess',
      'sitemap.xml',
      'sitemap-0.xml',
      'release-manifest.json',
    ],
  };
  await writeFile(
    resolve(root, 'data/seo/cpanel-ready-v7-release-20261004.json'),
    JSON.stringify(receipt, null, 2) + '\n',
    { flag: 'wx' },
  );
  console.log(JSON.stringify(receipt, null, 2));
} finally {
  // Only the validated temporary extraction created by this call is removed.
  await rm(temporary, { recursive: true, force: true });
}
