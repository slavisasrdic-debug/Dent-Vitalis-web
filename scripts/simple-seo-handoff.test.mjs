import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { execFile } from 'node:child_process';
import { copyFile, mkdir, mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { promisify } from 'node:util';
import test from 'node:test';
import { mergeLegacyHtaccess } from './cpanel-routing.mjs';
import {
  sitemapEntries,
  sitemapFromRenderedPages,
  validateSitemapPages,
} from './sitemap-hreflang.mjs';

const folder = 'docs/seo/handoff-simple-20261004/';
const hash = (bytes) => createHash('sha256').update(bytes).digest('hex');

test('handoff XML, exact htaccess bytes and complete comparison are consistent without a production change', async () => {
  const report = JSON.parse(await readFile(folder + 'report.json', 'utf8'));
  const old = await readFile(folder + 'sitemap-stari.xml');
  const current = await readFile(folder + 'sitemap-novi.xml');
  const rules = await readFile(folder + '.htaccess');
  assert.equal(hash(old), report.oldSitemap.sha256);
  assert.equal(hash(current), report.newSitemap.sha256);
  assert.equal(hash(rules), report.htaccess.sha256);
  assert.deepEqual(await readFile(folder + 'htaccess-novi.txt'), rules);
  const documents = JSON.parse(await readFile('dist/page-routes.json', 'utf8'));
  const generatedHeader = rules.indexOf('# END DentVitalis canonical host\n');
  const legacy = rules.subarray(
    generatedHeader + Buffer.byteLength('# END DentVitalis canonical host\n'),
  );
  assert.deepEqual(
    mergeLegacyHtaccess(legacy, documents, {
      requireApprovedTargets: true,
      compactStaticRouting: true,
      reviewRedirects: report.reviewRedirects,
    }),
    rules,
  );
  const productionXml = await readFile('dist/sitemap-0.xml', 'utf8');
  const urls = (xml) =>
    [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
  assert.deepEqual(
    new Set(urls(current.toString())),
    new Set(urls(productionXml)),
  );
  assert.equal(urls(current.toString()).length, 136);
  assert.equal(report.comparison.length, report.oldSitemap.urls);
  assert.equal(
    Object.values(report.comparisonCounts).reduce((a, b) => a + b, 0),
    report.oldSitemap.urls,
  );
  assert.equal(report.serverStageAndNextRootChanged, false);
  assert.equal(report.realBackendPostPerformed, false);
  assert.equal(report.htaccess.productionRuntimeVerified, false);
  for (const row of report.comparison.filter((row) =>
    row.status.startsWith('content-decision'),
  ))
    assert.equal(row.target, '', 'Unapproved destination must not be invented');
  const { stdout } = await promisify(execFile)('python3', [
    '-c',
    'import xml.etree.ElementTree as E,sys; ns={"s":"http://www.sitemaps.org/schemas/sitemap/0.9"}; print(*[len(E.parse(p).getroot().findall("s:url",ns)) for p in sys.argv[1:]])',
    folder + 'sitemap-stari.xml',
    folder + 'sitemap-novi.xml',
  ]);
  assert.equal(stdout.trim(), `${report.oldSitemap.urls} 136`);
});

test('all 136 sitemap entries carry actual reciprocal HTML hreflang, including Italian and Slovenian', async () => {
  const documents = JSON.parse(await readFile('dist/page-routes.json', 'utf8'));
  const entries = sitemapEntries(
    await readFile(folder + 'sitemap-novi.xml', 'utf8'),
  );
  const { xml, pages } = await sitemapFromRenderedPages(
    'dist',
    entries.map((entry) => entry.url),
    documents,
  );
  assert.equal(await readFile(folder + 'sitemap-novi.xml', 'utf8'), xml);
  const counts = Object.fromEntries(
    ['it', 'hr', 'de', 'en', 'sl'].map((lang) => [
      lang,
      pages.filter((page) => page.lang === lang).length,
    ]),
  );
  assert.deepEqual(counts, { it: 28, hr: 27, de: 27, en: 27, sl: 27 });
  for (const page of pages)
    assert.ok(
      !/\/(grazie|hvala|dank|thanks)$/.test(new URL(page.url).pathname),
    );
  const transport = pages.find((page) =>
    page.url.endsWith('/informazioni/trasporto'),
  );
  assert.deepEqual(
    transport.alternates.map((link) => link.lang),
    ['it', 'x-default'],
  );
  assert.equal(
    pages.reduce((sum, page) => sum + page.alternates.length, 0),
    812,
  );
  const { stdout } = await promisify(execFile)('python3', [
    '-c',
    'import xml.etree.ElementTree as E,sys; n={"s":"http://www.sitemaps.org/schemas/sitemap/0.9","h":"http://www.w3.org/1999/xhtml"}; r=E.parse(sys.argv[1]).getroot(); print(len(r.findall("s:url/h:link",n)))',
    folder + 'sitemap-novi.xml',
  ]);
  assert.equal(stdout.trim(), '812');
});

test('hreflang validation rejects missing self, non-reciprocal targets, noindex and wrong language', () => {
  const base = 'https://www.dentvitalis.com';
  const links = [
    { lang: 'it', url: base + '/' },
    { lang: 'hr', url: base + '/hr' },
    { lang: 'x-default', url: base + '/' },
  ];
  const makePages = () =>
    ['it', 'hr'].map((lang, i) => ({
      url: links[i].url,
      canonical: links[i].url,
      lang,
      robots: 'index, follow',
      alternates: structuredClone(links),
    }));
  validateSitemapPages(makePages());
  for (const mutate of [
    (pages) => pages[0].alternates.shift(),
    (pages) => pages[1].alternates.pop(),
    (pages) => (pages[0].alternates[1].url = base + '/not-a-page'),
    (pages) => (pages[1].lang = 'sl'),
    (pages) => (pages[1].robots = 'noindex, follow'),
  ]) {
    const pages = makePages();
    mutate(pages);
    assert.throws(() => validateSitemapPages(pages));
  }
});

test('postbuild pipeline generates hreflang automatically without rebuilding or changing the staged v3', async (t) => {
  const directory = await mkdtemp(join(tmpdir(), 'dentvitalis-sitemap-build-'));
  t.after(() => rm(directory, { recursive: true }));
  const routes = JSON.parse(await readFile('dist/page-routes.json', 'utf8'));
  await copyFile('dist/index.html', join(directory, 'index.html'));
  await copyFile('dist/sitemap-0.xml', join(directory, 'sitemap-0.xml'));
  for (const [route, document] of Object.entries(routes)) {
    const target = join(directory, route, 'index.html');
    await mkdir(dirname(target), { recursive: true });
    await copyFile(resolve('dist', '.' + document), target);
  }
  await promisify(execFile)(
    process.execPath,
    ['scripts/prepare-page-routes.mjs', directory],
    {
      env: { ...process.env, DENTVITALIS_SITE_MODE: 'production' },
    },
  );
  assert.equal(
    await readFile(join(directory, 'sitemap-0.xml'), 'utf8'),
    await readFile(folder + 'sitemap-novi.xml', 'utf8'),
  );
  assert.deepEqual(
    JSON.parse(await readFile(join(directory, 'page-routes.json'), 'utf8')),
    routes,
  );
});

test('comparison covers every old and new URL, adds clear Italian moves and does not equate different clinical services', async () => {
  const report = JSON.parse(await readFile(folder + 'report.json', 'utf8'));
  const rules = await readFile(folder + '.htaccess', 'utf8');
  const neutral = JSON.parse(
    await readFile(
      'data/seo/handoff-equivalent-redirects-20261004.json',
      'utf8',
    ),
  );
  assert.deepEqual(neutral.redirects, report.reviewRedirects);
  assert.equal(
    neutral.status,
    'owner-requested-SEO-review-not-production-approved',
  );
  assert.equal(report.reviewRedirects.length, 8);
  for (const redirect of report.reviewRedirects) {
    assert.ok(
      rules.includes(
        `RewriteRule ^${redirect.from.slice(1)}/?$ ${redirect.to} [R=301,L,NE]`,
      ),
    );
    assert.ok(
      report.comparison.some(
        (row) => new URL(row.old).pathname === redirect.from,
      ),
    );
    assert.equal(
      new URL(redirect.to, 'https://www.dentvitalis.com').pathname.endsWith(
        '/',
      ),
      false,
    );
  }
  const covered = new Set(
    [...report.comparison, ...report.newOnly]
      .flatMap((row) => [row.target, ...row.proposalTargets])
      .filter(Boolean),
  );
  for (const entry of sitemapEntries(
    await readFile(folder + 'sitemap-novi.xml', 'utf8'),
  ))
    assert.ok(covered.has(entry.url), entry.url);
  for (const row of report.comparison) assert.ok(row.reason.length > 10);
  for (const path of [
    '/all-on-four',
    '/sbiancamento-dentale',
    '/protesi-su-impianti',
  ]) {
    const row = report.comparison.find(
      (row) => new URL(row.old).pathname === path,
    );
    assert.equal(row.target, '');
    assert.ok(row.proposalTargets.length > 0);
    assert.ok(!rules.includes(`RewriteRule ^${path.slice(1)}/?$`));
  }
  for (const path of [
    '/testimonials-edita-karadole-igralka',
    '/testimonilas-zoran-roje-sportski-direktor',
  ]) {
    assert.equal(
      report.comparison.find((row) => new URL(row.old).pathname === path)
        .language,
      'sl',
    );
  }
});
