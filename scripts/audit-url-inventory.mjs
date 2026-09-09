import { chromium } from '@playwright/test';
import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { format, resolveConfig } from 'prettier';

// Read-only public GETs. No form submissions, challenge bypasses or live redirects.
// Inventory only: this script deliberately does not choose migration destinations.
const origin = 'https://www.dentvitalis.com';
const cache = '.astro/audits/url-inventory-2026-09-09';
const output = 'data/seo/url-inventory.json';
const cachedOnly = process.argv.includes('--cached');
const hash = (value) => createHash('sha256').update(value).digest('hex');
const previous = JSON.parse(
  await readFile('reference/live-site-audit.json', 'utf8'),
);
const italian = JSON.parse(
  await readFile('src/content/inner-pages-it.json', 'utf8'),
);
const pairs = (await readFile('data/hr-routes.proposed.csv', 'utf8'))
  .trim()
  .split('\n')
  .slice(1)
  .map((row) => row.split(','));
const newPaths = new Set(
  [
    '/',
    ...italian.map((page) => page.route),
    ...pairs.filter((row) => row[4] === 'approved').map((row) => row[2]),
  ].map((path) => path.replace(/\/+$/, '') + '/'),
);
await mkdir(cache, { recursive: true });
const responses = new Map();
async function get(url) {
  if (responses.has(url)) return responses.get(url);
  const promise = (async () => {
    const key = hash(url);
    if (cachedOnly)
      return JSON.parse(await readFile(`${cache}/${key}.json`, 'utf8'));
    const checkedAt = new Date().toISOString();
    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(15000) });
      const html = await response.text();
      const record = {
        url,
        finalUrl: response.url,
        status: response.status,
        checkedAt,
        sha256: hash(html),
        contentType: response.headers.get('content-type'),
        xRobotsTag: response.headers.get('x-robots-tag'),
        html,
      };
      await writeFile(`${cache}/${key}.json`, JSON.stringify(record));
      return record;
    } catch (error) {
      const record = { url, checkedAt, error: error.message };
      await writeFile(`${cache}/${key}.json`, JSON.stringify(record));
      return record;
    }
  })();
  responses.set(url, promise);
  return promise;
}
const browser = await chromium.launch();
const page = await browser.newPage({ javaScriptEnabled: false });
await page.route('**/*', (route) => route.abort());
const queue = [];
const discoveries = new Map();
function add(value, source, base = origin) {
  let url;
  try {
    url = new URL(value, base);
  } catch {
    return;
  }
  if (
    url.origin !== origin ||
    url.search ||
    /\.[a-z\d]{2,5}$/i.test(url.pathname)
  )
    return;
  if (/^\/(send|admin|login|logout)(\/|$)/i.test(url.pathname)) return;
  url.hash = '';
  if (!discoveries.has(url.href)) {
    discoveries.set(url.href, new Set());
    queue.push(url.href);
  }
  discoveries.get(url.href).add(source);
}
const records = [];
try {
  const sitemap = await get(origin + '/sitemap.xml');
  if (sitemap.status !== 200 || !sitemap.html.includes('<urlset'))
    throw new Error(
      'Public sitemap unavailable; do not claim a complete inventory.',
    );
  for (const match of sitemap.html.matchAll(/<loc>\s*([^<]+)\s*<\/loc>/g))
    add(match[1].replaceAll('&amp;', '&'), 'public-sitemap');
  for (const old of previous.pages)
    add(old.requestedPath, 'snapshot-2026-09-02');
  const robots = await get(origin + '/robots.txt');
  // Small batches keep requests polite and permit progress output without broad browser crawling.
  let cursor = 0;
  while (cursor < queue.length && cursor < 400) {
    const batch = queue.slice(cursor, cursor + 2);
    cursor += batch.length;
    const fetched = await Promise.all(batch.map(get));
    for (const response of fetched) {
      const { html, ...metadata } = response;
      const pathname = new URL(response.url).pathname;
      const language = pathname.match(/^\/(hr|de|en|si)(\/|$)/)?.[1] ?? 'it';
      if (
        !html ||
        response.status !== 200 ||
        !response.contentType?.includes('text/html')
      ) {
        records.push({
          ...metadata,
          language,
          review: 'unavailable-source-review-required',
          crawlIssue: response.error ?? `HTTP ${response.status}`,
        });
        continue;
      }
      const parsed = await page.evaluate((markup) => {
        const doc = new DOMParser().parseFromString(markup, 'text/html');
        const text = (el) => el?.textContent?.replace(/\s+/g, ' ').trim() ?? '';
        return {
          title: doc.title,
          lang: doc.documentElement.lang,
          description:
            doc.querySelector('meta[name="description"]')?.content ?? null,
          robots: doc.querySelector('meta[name="robots"]')?.content ?? null,
          canonical:
            doc.querySelector('link[rel="canonical"]')?.getAttribute('href') ??
            null,
          hreflang: [...doc.querySelectorAll('link[hreflang]')].map((el) => ({
            lang: el.getAttribute('hreflang'),
            href: el.getAttribute('href'),
          })),
          headings: [...doc.querySelectorAll('h1,h2')].map(text),
          links: [...doc.querySelectorAll('a[href]')].map((el) =>
            el.getAttribute('href'),
          ),
        };
      }, html);
      if (
        /just a moment|one moment, please|access denied/i.test(parsed.title)
      ) {
        records.push({
          ...metadata,
          language,
          review: 'unavailable-source-review-required',
          crawlIssue: 'Access challenge; not bypassed',
        });
        continue;
      }
      const { links, ...content } = parsed;
      for (const link of links)
        add(link, 'public-internal-link', response.finalUrl);
      const normalized = pathname.replace(/\/+$/, '') + '/';
      const candidate = newPaths.has(normalized) ? origin + normalized : null;
      records.push({
        ...metadata,
        ...content,
        language,
        samePathCandidate: candidate,
        review: ['de', 'en', 'si'].includes(language)
          ? 'existing-language-not-yet-implemented'
          : candidate
            ? 'same-path-content-review-required'
            : 'content-mapping-required',
      });
    }
    if (cursor % 20 === 0)
      console.log(`Checked ${cursor}/${queue.length} discovered URLs`);
  }
  for (const record of records)
    record.discoveredBy = [...discoveries.get(record.url)].sort();
  const count = (field) =>
    records.reduce((counts, row) => {
      const key = row[field] ?? 'unknown';
      counts[key] = (counts[key] ?? 0) + 1;
      return counts;
    }, {});
  const result = {
    generatedAt: new Date().toISOString(),
    source: origin,
    mode: cachedOnly
      ? 'cached responses, see checkedAt per URL'
      : 'fresh read-only GET audit',
    scope:
      'Public sitemap, prior 174-URL snapshot and discovered HTML links; not Search Console, backlink or server-log coverage.',
    noMigrationDecisions: true,
    referenceSnapshot: previous.capturedAt,
    sitemap: {
      url: sitemap.url,
      status: sitemap.status,
      checkedAt: sitemap.checkedAt,
      sha256: sitemap.sha256,
    },
    robots: {
      url: robots.url,
      status: robots.status,
      checkedAt: robots.checkedAt,
      sha256: robots.sha256,
    },
    summary: {
      discovered: queue.length,
      checked: records.length,
      capped: queue.length > records.length,
      statuses: count('status'),
      languages: count('language'),
      reviews: count('review'),
      issues: records.filter((row) => row.crawlIssue).length,
    },
    pages: records.sort((a, b) => a.url.localeCompare(b.url)),
  };
  await mkdir('data/seo', { recursive: true });
  await writeFile(
    output,
    await format(JSON.stringify(result), {
      ...(await resolveConfig(output)),
      filepath: output,
    }),
  );
  console.log(JSON.stringify({ output, ...result.summary }));
} finally {
  await browser.close();
}
