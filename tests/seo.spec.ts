import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
import {
  canonicalUrl,
  publicationSettings,
  productionOrigin,
  previewOrigin,
} from '../src/content/seo-urls';

const videoMetadata = JSON.parse(
  readFileSync('data/video-metadata.json', 'utf8'),
) as typeof import('../data/video-metadata.json');

const italian = JSON.parse(
  readFileSync('src/content/inner-pages-it.json', 'utf8'),
) as {
  route: string;
  hero: { title: string };
}[];
const pairs = readFileSync('data/hr-routes.proposed.csv', 'utf8')
  .trim()
  .split('\n')
  .slice(1)
  .map((row) => row.split(','))
  .filter((row) => row[4] === 'approved');
const routes = [
  '/',
  ...italian.map((p) => p.route),
  ...pairs.map((r) => r[2]!),
];

test('canonical page URLs are stable, without query/hash or asset side effects', () => {
  for (const path of routes) {
    const result = canonicalUrl(path);
    expect(result).toBe(productionOrigin + path.replace(/\/+$/, '') + '/');
    expect(canonicalUrl(result)).toBe(result);
  }
  expect(canonicalUrl('/hr/faq?utm_source=test#dentvitalis')).toBe(
    productionOrigin + '/hr/faq/',
  );
  expect(() => canonicalUrl('https://example.org/hr/')).toThrow();
});

test('publication defaults protect preview and production must be explicit', () => {
  for (const env of [
    {},
    { NODE_ENV: 'production' },
    { CF_PAGES_BRANCH: 'main' },
  ]) {
    expect(publicationSettings(env)).toEqual({
      indexable: false,
      robots: 'noindex, nofollow',
      assetOrigin: previewOrigin,
    });
  }
  expect(
    publicationSettings({
      CF_PAGES_URL: 'https://abc123.dent-vitalis-web.pages.dev',
    }).assetOrigin,
  ).toBe('https://abc123.dent-vitalis-web.pages.dev');
  expect(publicationSettings({ DENTVITALIS_SITE_MODE: 'production' })).toEqual({
    indexable: true,
    robots: 'index, follow',
    assetOrigin: productionOrigin,
  });
  for (const env of [
    { DENTVITALIS_SITE_MODE: 'yes' },
    { CF_PAGES_URL: 'https://dent-vitalis-web.pages.dev.attacker.example' },
    { CF_PAGES_URL: 'http://dent-vitalis-web.pages.dev' },
    { CF_PAGES_URL: 'https://user:pass@dent-vitalis-web.pages.dev' },
  ])
    expect(() => publicationSettings(env)).toThrow();
});

test('all 55 pages have consistent metadata, content-backed schema and real media', async ({
  page,
  request,
  baseURL,
}) => {
  test.setTimeout(120000);
  const titles = new Set<string>();
  const documents = new Map<
    string,
    { canonical: string; alternates: Record<string, string> }
  >();
  const media = new Set<string>();
  for (const path of routes) {
    const response = await request.get(path);
    expect(response.status(), path).toBe(200);
    const data = await page.evaluate(
      (html) => {
        const doc = new DOMParser().parseFromString(html, 'text/html');
        const meta = (key: string) =>
          doc
            .querySelector(`meta[name="${key}"],meta[property="${key}"]`)
            ?.getAttribute('content') ?? '';
        const schema = JSON.parse(
          doc.querySelector('script[type="application/ld+json"]')!.textContent!,
        );
        const normalize = (value: string) => value.replace(/\s+/g, '');
        const faq = [...doc.querySelectorAll('details.faq-item')].map((n) => ({
          question: normalize(n.querySelector('summary')!.textContent!),
          answer: normalize(n.querySelector('.answer')!.textContent!),
        }));
        return {
          title: doc.title,
          description: meta('description'),
          robots: meta('robots'),
          canonical: doc
            .querySelector('link[rel=canonical]')!
            .getAttribute('href')!,
          alternates: Object.fromEntries(
            [...doc.querySelectorAll('link[hreflang]')].map((n) => [
              n.getAttribute('hreflang'),
              n.getAttribute('href'),
            ]),
          ),
          ogTitle: meta('og:title'),
          ogDescription: meta('og:description'),
          ogUrl: meta('og:url'),
          ogImage: meta('og:image'),
          imageAlt: meta('og:image:alt'),
          twitterImage: meta('twitter:image'),
          lang: doc.documentElement.lang,
          h1: [...doc.querySelectorAll('h1')].map((n) => n.textContent!.trim()),
          breadcrumb: [
            ...doc.querySelectorAll(
              '.breadcrumbs li > a,.breadcrumbs [aria-current=page]',
            ),
          ].map((n) => n.textContent!.trim()),
          faq,
          schema,
          videoIds: [...doc.querySelectorAll('[data-youtube]')].map((n) =>
            n.getAttribute('data-youtube'),
          ),
          text: normalize(doc.body.textContent!),
        };
      },
      await response.text(),
    );
    expect(data.title, path).not.toBe('Dentvitalis33');
    expect(data.description.length, path).toBeGreaterThan(15);
    expect(titles.has(data.title), path).toBe(false);
    titles.add(data.title);
    expect(data.robots).toBe('noindex, nofollow');
    expect(data.h1).toHaveLength(1);
    expect(data.canonical).toBe(canonicalUrl(path));
    expect(data.alternates[data.lang]).toBe(data.canonical);
    expect(data.alternates['x-default']).toBe(productionOrigin + '/');
    expect(data.ogTitle).toBe(data.title);
    expect(data.ogDescription).toBe(data.description);
    expect(data.ogUrl).toBe(data.canonical);
    expect(data.twitterImage).toBe(data.ogImage);
    expect(data.imageAlt).toBeTruthy();
    expect(new URL(data.ogImage).origin).toBe(new URL(baseURL!).origin);
    media.add(data.ogImage);
    documents.set(data.canonical, data);
    expect(data.schema['@context']).toBe('https://schema.org');
    const nodes = data.schema['@graph'];
    expect(new Set(nodes.map((n: { '@id': string }) => n['@id'])).size).toBe(
      nodes.length,
    );
    const webPage = nodes.find(
      (n: { '@id': string }) => n['@id'] === data.canonical + '#webpage',
    );
    expect(webPage.url).toBe(data.canonical);
    expect(webPage.inLanguage).toBe(data.lang);
    expect(webPage.name).toBe(data.title);
    expect(webPage.description).toBe(data.description);
    const reference = pairs.find((pair) => pair[2] === path)?.[1] ?? path;
    const expectedType =
      reference === '/contatti'
        ? 'ContactPage'
        : reference === '/chi-siamo'
          ? 'AboutPage'
          : reference === '/domande-e-risposte'
            ? 'ImageGallery'
            : [
                  '/prestazioni-dentali',
                  '/informazioni-per-pazienti',
                  '/testimonianze',
                ].includes(reference)
              ? 'CollectionPage'
              : 'WebPage';
    expect(webPage['@type'], path).toBe(expectedType);
    const breadcrumb = nodes.find(
      (n: { '@type': string }) => n['@type'] === 'BreadcrumbList',
    );
    expect(
      breadcrumb?.itemListElement.map((n: { name: string }) => n.name) ?? [],
    ).toEqual(data.breadcrumb);
    for (const item of breadcrumb?.itemListElement ?? [])
      expect(item.item).toBe(canonicalUrl(item.item));
    const faq = nodes.find(
      (n: { '@type': string }) => n['@type'] === 'FAQPage',
    );
    expect(
      faq?.mainEntity.map(
        (n: { name: string; acceptedAnswer: { text: string } }) => ({
          question: n.name.replace(/\s+/g, ''),
          answer: n.acceptedAnswer.text.replace(/\s+/g, ''),
        }),
      ) ?? [],
    ).toEqual(data.faq);
    const service = nodes.find(
      (n: { '@type': string }) => n['@type'] === 'Service',
    );
    if (service) {
      expect(service.name).toBe(data.h1[0]);
      expect(service.url).toBe(data.canonical);
      if (service.offers) {
        expect(service.offers.priceCurrency).toBe('EUR');
        expect(service.offers.url).toBe(data.canonical);
        expect(data.text.replace(/[.,]/g, '')).toContain(service.offers.price);
      }
    }
    for (const node of nodes) {
      if (node.logo) media.add(node.logo);
      if (node.thumbnailUrl) media.add(node.thumbnailUrl);
      if (node['@type'] === 'VideoObject') {
        expect(data.videoIds).toContain(node['@id'].split('#video-')[1]);
        const metadata = videoMetadata.videos.find(
          (item) => item.videoId === node['@id'].split('#video-')[1],
        );
        expect(metadata).toBeTruthy();
        expect(node.uploadDate).toBe(metadata!.uploadDate);
        expect(node.uploadDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      }
      if (node['@type'] === 'Person')
        expect(data.text).toContain(node.name.replace(/\s+/g, ''));
    }
    expect(JSON.stringify(nodes)).not.toMatch(
      /AggregateRating|reviewedBy|dateModified|Dr\. XY/,
    );
  }
  expect(documents.size).toBe(55);
  for (const [url, doc] of documents) {
    for (const [lang, alternate] of Object.entries(doc.alternates)) {
      if (lang !== 'x-default') {
        expect(documents.has(alternate), alternate).toBe(true);
        expect(Object.values(documents.get(alternate)!.alternates)).toContain(
          url,
        );
      }
    }
  }
  for (const url of media) {
    expect(new URL(url).origin).toBe(new URL(baseURL!).origin);
    const response = await request.get(url);
    expect(response.status(), url).toBe(200);
    expect(response.headers()['content-type'], url).toMatch(/^image\//);
  }
});

test('robots allows reading noindex and does not advertise the preview sitemap', async ({
  request,
}) => {
  const response = await request.get('/robots.txt');
  expect(response.status()).toBe(200);
  expect(response.headers()['content-type']).toContain('text/plain');
  const text = await response.text();
  expect(text).toContain('User-agent: *\nAllow: /');
  expect(text).not.toMatch(/^Disallow:|^Sitemap:/m);
});
