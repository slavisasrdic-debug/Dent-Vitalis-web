import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { promisify } from 'node:util';
import { packageCpanelRelease } from './package-cpanel-release.mjs';
import {
  pageMetadata,
  sitemapEntries,
  sitemapFromRenderedPages,
} from './sitemap-hreflang.mjs';

const run = promisify(execFile);
const root = resolve(import.meta.dirname, '..');
const dist = resolve(root, 'dist');
const hash = (bytes) => createHash('sha256').update(bytes).digest('hex');
const baseName = 'dentvitalis-web-production-candidate-20261004-seo-v4.zip';
const basePath = resolve(root, '.astro/releases', baseName);
const outputName =
  'dentvitalis-web-production-candidate-20261004-whatsapp-v5.zip';
const output = resolve(root, '.astro/releases', outputName);
const handoff = resolve(root, 'docs/seo/handoff-simple-20261004');
const { stdout: dirty } = await run(
  'git',
  ['status', '--porcelain', '--untracked-files=no'],
  { cwd: root },
);
assert.equal(
  dirty.trim(),
  '',
  'Commit verified source before preparing provenance',
);
const baseReceipt = JSON.parse(
  await readFile(
    resolve(root, 'data/seo/cpanel-seo-v4-release-20261004.json'),
    'utf8',
  ),
);
assert.equal(
  hash(await readFile(basePath)),
  baseReceipt.sha256,
  'Immutable v4 ZIP changed',
);
await run('unzip', ['-tq', basePath]);
const archiveFile = async (path) => {
  const { stdout } = await run('unzip', ['-p', basePath, path], {
    encoding: 'buffer',
    maxBuffer: 32 * 1024 * 1024,
  });
  return stdout;
};
const previous = JSON.parse(await archiveFile('release-manifest.json'));
const report = JSON.parse(
  await readFile(resolve(handoff, 'report.json'), 'utf8'),
);
const rules = await readFile(resolve(handoff, '.htaccess'));
const xml = await readFile(resolve(handoff, 'sitemap-novi.xml'));
assert.equal(hash(rules), report.htaccess.sha256);
assert.equal(hash(xml), report.newSitemap.sha256);
assert.deepEqual(
  await readFile(resolve(dist, 'page-routes.json')),
  await archiveFile('page-routes.json'),
  'Routes must not change with WhatsApp translations',
);
const routes = JSON.parse(
  await readFile(resolve(dist, 'page-routes.json'), 'utf8'),
);
const { xml: renderedXml, pages } = await sitemapFromRenderedPages(
  dist,
  sitemapEntries(xml.toString()).map((page) => page.url),
  routes,
);
assert.equal(
  renderedXml,
  xml.toString(),
  'Every canonical and reciprocal hreflang must remain identical',
);

// Restore the reviewed compact Apache rules and flat XML after the normal build.
// The old immutable archives and the four-document SEO handoff are not modified.
await writeFile(resolve(dist, '.htaccess'), rules);
await writeFile(resolve(dist, 'sitemap.xml'), xml);
await writeFile(resolve(dist, 'sitemap-0.xml'), xml);
const { locales } = JSON.parse(
  await readFile(resolve(root, 'data/whatsapp-copy-20261004.json'), 'utf8'),
);
const withoutChat = (html) => {
  const start = html.indexOf('<div class="chat-widget"');
  if (start === -1) return html; // standalone 404 has no shared panel
  const end = html.indexOf('<div class="mobile-contact"', start);
  assert.ok(end > start, 'Shared chat boundary missing');
  const stable = html.slice(0, start) + html.slice(end);
  // Each build creates new ARIA IDs; preserve the association and occurrence
  // order while normalizing only the three known UUID-generating consumers.
  const ids = new Map();
  return stable.replace(
    /(?:navigation|inquiry-heading|inquiry)-[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}/g,
    (id) => {
      if (!ids.has(id)) ids.set(id, `generated-aria-id-${ids.size}`);
      return ids.get(id);
    },
  );
};
const decode = (text) =>
  text.replace(
    /&(amp|quot|apos|lt|gt|#39);/g,
    (_, key) =>
      ({ amp: '&', quot: '"', apos: "'", '#39': "'", lt: '<', gt: '>' })[key],
  );
let htmlPagesVerified = 0;
const changedFiles = [];
for (const file of previous.files) {
  const old = await archiveFile(file.path);
  assert.equal(old.length, file.bytes, `Base bytes: ${file.path}`);
  assert.equal(hash(old), file.sha256, `Base hash: ${file.path}`);
  const current = await readFile(resolve(dist, file.path));
  if (file.path.endsWith('.html')) {
    const oldHtml = old.toString();
    const html = current.toString();
    assert.deepEqual(
      pageMetadata(html),
      pageMetadata(oldHtml),
      `SEO changed: ${file.path}`,
    );
    assert.equal(
      withoutChat(html),
      withoutChat(oldHtml),
      `Unexpected non-WhatsApp HTML change: ${file.path}`,
    );
    if (html.includes('<div class="chat-widget"')) {
      const lang = pageMetadata(html).lang;
      assert.ok(locales[lang], `Unknown panel language: ${file.path}`);
      assert.equal((html.match(/data-chat-widget/g) ?? []).length, 1);
      const body =
        /<div class="chat-bubble"[^>]*>\s*<span[^>]*>([\s\S]*?)<\/span>/.exec(
          html,
        )?.[1];
      assert.ok(body, `Panel body missing: ${file.path}`);
      assert.equal(
        decode(
          body.replace(/<br\b[^>]*>/gi, '\n').replace(/<!--[\s\S]*?-->/g, ''),
        ).trim(),
        locales[lang].message,
        `Incorrect language copy: ${file.path}`,
      );
      assert.ok(html.includes(`https://wa.me/${locales[lang].phone}`));
      assert.ok(!/<script[^>]*src=["'][^"']*elfsight/i.test(html));
      htmlPagesVerified++;
    }
  } else {
    assert.deepEqual(
      current,
      old,
      `Unexpected non-HTML payload change: ${file.path}`,
    );
  }
  if (hash(current) !== file.sha256) changedFiles.push(file.path);
}
assert.equal(htmlPagesVerified, 141);
const generated = await run(
  'node',
  ['scripts/create-cpanel-release-manifest.mjs'],
  { cwd: root },
);
process.stdout.write(generated.stdout);
const manifestPath = resolve(dist, 'release-manifest.json');
const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
assert.equal(
  manifest.fileCount,
  previous.fileCount,
  'Unexpected package inventory growth',
);
assert.deepEqual(
  manifest.files.map((file) => file.path),
  previous.files.map((file) => file.path),
  'Unexpected new/retired asset paths',
);
assert.deepEqual(
  manifest.backendPrerequisites,
  previous.backendPrerequisites,
  'Backend prerequisites must remain unchanged',
);
Object.assign(manifest, {
  revision: '20261004-whatsapp-v5',
  supersedesArchive: baseName,
  comparedAgainst: { archiveName: baseName, sha256: baseReceipt.sha256 },
  whatsappSourceSha256: hash(
    await readFile(resolve(root, 'data/whatsapp-copy-20261004.json')),
  ),
  scope:
    'Exact owner-supplied WhatsApp copy in all five languages; native panel, real portrait, localized CTA, routes, SEO, forms, scripts/assets and backend unchanged',
  publicActivationApproved: false,
});
await writeFile(manifestPath, JSON.stringify(manifest, null, 2) + '\n');
const receipt = {
  ...(await packageCpanelRelease(dist, output)),
  status:
    'verified-local-full-static-upload-candidate-not-uploaded-not-activated',
  revision: manifest.revision,
  comparedAgainst: manifest.comparedAgainst,
  changedPayloadFiles: changedFiles,
  htmlPanelsVerified: htmlPagesVerified,
  nonPanelHtmlIdenticalExceptGeneratedAriaIds: true,
  unchangedPayloadFiles: previous.fileCount - changedFiles.length,
  sitemapUrls: pages.length,
  hreflangLinks: pages.reduce((sum, page) => sum + page.alternates.length, 0),
  sourceWidgetIds: Object.fromEntries(
    Object.entries(locales).map(([lang, source]) => [lang, source.widgetId]),
  ),
  existingArchivesOverwritten: false,
  backendChanged: false,
  serverChanged: false,
  realPostPerformed: false,
  publicActivationApproved: false,
  intendedPrivateStage: '/home2/dentvita/releases/20261004-whatsapp-v5/',
  existingPrivateNextRoot:
    '/home2/dentvita/public_html-next-20261004-localized-v3/',
  privateNextRootUpdateRequiresSeparateApproval: true,
  privateNextRootUpdateScope:
    'Complete manifest-listed static payload replaces v3/v4 candidate files; preserve index.php and all legacy extras; NOT only four SEO files',
};
await writeFile(
  resolve(root, 'data/seo/cpanel-whatsapp-v5-release-20261004.json'),
  JSON.stringify(receipt, null, 2) + '\n',
  { flag: 'wx' },
);
console.log(
  JSON.stringify(
    {
      archiveName: receipt.archiveName,
      sha256: receipt.sha256,
      compressedZipBytes: receipt.compressedZipBytes,
      totalFilesIncludingManifest: receipt.totalFilesIncludingManifest,
      htmlPanelsVerified,
      changedPayloadFiles: changedFiles.length,
      unchangedPayloadFiles: receipt.unchangedPayloadFiles,
    },
    null,
    2,
  ),
);
