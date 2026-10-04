import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import {
  mergeLegacyHtaccess,
  approvedContentRedirects,
} from './cpanel-routing.mjs';
import decisions from '../data/seo/cpanel-redirect-decisions.json' with { type: 'json' };
import { retiredThankYouRoutes } from '../src/content/thank-you-routes.ts';

const [legacyPath, reuseSource, ...unexpected] = process.argv.slice(2);
if (
  !legacyPath ||
  unexpected.length ||
  (reuseSource && reuseSource !== '--reuse-source')
)
  throw new Error(
    'Usage: node scripts/prepare-simple-seo-handoff.mjs /path/to/old/.htaccess',
  );
const output = resolve('docs/seo/handoff-simple-20261004');
const hash = (bytes) => createHash('sha256').update(bytes).digest('hex');
const oldUrl = 'https://www.dentvitalis.com/sitemap.xml';
let oldBytes;
let snapshot;
if (reuseSource) {
  const previous = JSON.parse(
    await readFile(resolve(output, 'report.json'), 'utf8'),
  );
  oldBytes = await readFile(resolve(output, 'sitemap-stari.xml'));
  snapshot = previous.oldSitemap;
  assert.equal(
    hash(oldBytes),
    snapshot.sha256,
    'Previously captured source changed',
  );
} else {
  // One public GET only. No form requests, private application reads or server writes.
  const requestedAt = new Date().toISOString();
  const response = await fetch(oldUrl, { signal: AbortSignal.timeout(20000) });
  oldBytes = Buffer.from(await response.arrayBuffer());
  if (response.status !== 200 || !oldBytes.toString().includes('<urlset'))
    throw new Error(
      `Old sitemap unavailable: HTTP ${response.status}; no cached snapshot substituted.`,
    );
  snapshot = {
    url: oldUrl,
    finalUrl: response.url,
    status: response.status,
    checkedAt: requestedAt,
    bytes: oldBytes.length,
    sha256: hash(oldBytes),
  };
}
const legacy = await readFile(legacyPath);
const documents = JSON.parse(await readFile('dist/page-routes.json', 'utf8'));
const newXmlSource = await readFile('dist/sitemap-0.xml', 'utf8');
const urlEntries = (xml) =>
  [...xml.matchAll(/<url\b[^>]*>([\s\S]*?)<\/url>/g)]
    .map((entry) => /<loc>([^<]+)<\/loc>/.exec(entry[1])?.[1])
    .filter(Boolean);
const newUrls = urlEntries(newXmlSource);
assert.equal(new Set(newUrls).size, 136);
const indexable = new Set(newUrls.map((url) => new URL(url).pathname));
const oldUrls = urlEntries(oldBytes.toString());
const newXml =
  '<?xml version="1.0" encoding="UTF-8"?>\n' +
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
  newUrls.map((url) => `  <url><loc>${url}</loc></url>\n`).join('') +
  '</urlset>\n';
const rules = mergeLegacyHtaccess(legacy, documents, {
  requireApprovedTargets: true,
  compactStaticRouting: true,
});
const legacyRedirects = [
  ...rules.toString().matchAll(/^Redirect\s+301\s+(\S+)\s+(\S+)\s*$/gm),
].map((match) => ({ from: match[1], to: match[2] }));
const normalize = (path) => (path === '/' ? '/' : path.replace(/\/+$/, ''));
function compare(url) {
  const input = new URL(url);
  let path = normalize(input.pathname);
  const chain = [];
  const seen = new Set();
  for (let i = 0; i < 12; i++) {
    if (seen.has(path)) throw new Error(`Redirect loop for ${url}`);
    seen.add(path);
    if (retiredThankYouRoutes.includes(path))
      return { old: url, target: '', status: 'approved-410', chain };
    if (indexable.has(path))
      return {
        old: url,
        target: 'https://www.dentvitalis.com' + path,
        status: chain.length
          ? 'existing-or-approved-301'
          : input.pathname === path
            ? 'same-url'
            : 'slash-normalization-308',
        chain,
      };
    if (Object.hasOwn(documents, path))
      return {
        old: url,
        target: 'https://www.dentvitalis.com' + path,
        status: 'preserved-static-noindex-not-in-new-sitemap',
        chain,
      };
    if (decisions.preservedPhpPages.includes(path))
      return {
        old: url,
        target: 'https://www.dentvitalis.com' + path,
        status: 'preserved-PHP-runtime-check-required',
        chain,
      };
    let next = approvedContentRedirects.find((rule) => rule.from === path);
    if (!next) {
      const rule = legacyRedirects.find(
        ({ from }) =>
          path === from ||
          path.startsWith(from.endsWith('/') ? from : from + '/'),
      );
      if (rule) next = { to: rule.to + path.slice(rule.from.length) };
    }
    if (!next)
      return {
        old: url,
        target: '',
        status: 'content-decision-required-no-new-redirect-invented',
        chain,
      };
    chain.push({ from: path, to: next.to, status: 301 });
    path = normalize(new URL(next.to, oldUrl).pathname);
  }
  throw new Error(`Excessive redirect chain for ${url}`);
}
const comparison = oldUrls.map(compare);
const counts = {};
for (const row of comparison)
  counts[row.status] = (counts[row.status] ?? 0) + 1;
const csvEscape = (value) => `"${String(value).replaceAll('"', '""')}"`;
const labels = {
  'same-url': 'Ista adresa',
  'slash-normalization-308': 'Ista stranica; završni slash 308',
  'existing-or-approved-301': 'Postojeća ili odobrena redirekcija 301',
  'preserved-static-noindex-not-in-new-sitemap':
    'Zadržana zahvalna stranica; noindex, izvan sitemapa',
  'preserved-PHP-runtime-check-required':
    'Zadržana PHP stranica; provjeriti na hostingu',
  'approved-410': 'Odobreno uklanjanje 410',
  'content-decision-required-no-new-redirect-invented':
    'Potrebna provjera/odluka; nema novog statičkog ekvivalenta ni odobrene 301, PHP fallback nije testiran',
};
const csv =
  '\uFEFFstari_url;novi_url;status;lanac\r\n' +
  comparison
    .map((row) =>
      [
        row.old,
        row.target,
        labels[row.status],
        row.chain.map((step) => `${step.from} -> ${step.to}`).join(' | '),
      ]
        .map(csvEscape)
        .join(';'),
    )
    .join('\r\n') +
  '\r\n';
const report = {
  status:
    'local-review-handoff-not-uploaded-not-approved-for-public-activation',
  oldSitemap: { ...snapshot, urls: oldUrls.length },
  sourceLegacy: { bytes: legacy.length, sha256: hash(legacy) },
  newSitemap: {
    urls: newUrls.length,
    bytes: Buffer.byteLength(newXml),
    sha256: hash(newXml),
    source:
      'unchanged localized-v3 dist/sitemap-0.xml URL set; flat urlset instead of sitemap index',
  },
  htaccess: {
    bytes: rules.length,
    sha256: hash(rules),
    lines: rules.toString().split('\n').length,
    legacy301Lines: legacyRedirects.length,
    approvedNew301Rules: approvedContentRedirects.length,
    explicitStaticPageRewrites: 0,
    genericStaticRules: 2,
    preservesOtherLegacyDirectiveBytes: true,
    productionRuntimeVerified: false,
  },
  sourceContentCommit: JSON.parse(
    await readFile('dist/release-manifest.json', 'utf8'),
  ).gitCommit,
  comparisonCounts: counts,
  comparison,
  serverStageAndNextRootChanged: false,
  realBackendPostPerformed: false,
};
await mkdir(output, { recursive: true });
for (const [name, content] of [
  ['sitemap-stari.xml', oldBytes],
  ['sitemap-novi.xml', newXml],
  ['htaccess-novi.txt', rules],
  ['.htaccess', rules],
  ['usporedba-stari-novi.csv', csv],
  ['report.json', JSON.stringify(report, null, 2) + '\n'],
]) {
  if (reuseSource && name === 'sitemap-stari.xml') continue;
  await writeFile(resolve(output, name), content, {
    mode: 0o644,
    flag: reuseSource ? 'w' : 'wx',
  });
}
console.log(
  JSON.stringify(
    {
      output,
      oldUrls: oldUrls.length,
      newUrls: newUrls.length,
      comparisonCounts: counts,
      htaccessBytes: rules.length,
      publicServerChanged: false,
    },
    null,
    2,
  ),
);
