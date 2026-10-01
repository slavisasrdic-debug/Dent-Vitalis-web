import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import test from 'node:test';
import { pagePath, pageDocument } from '../src/content/page-paths.ts';
import { canonicalUrl } from '../src/content/seo-urls.ts';
import {
  retiredThankYouRoutes,
  thankYouRoutes,
} from '../src/content/thank-you-routes.ts';

test('one slashless page policy, with root and assets kept separate', () => {
  assert.equal(pagePath('/'), '/');
  assert.equal(pagePath('/hr/'), '/hr');
  assert.equal(
    canonicalUrl('/hr/cjenik/?utm_source=a#price'),
    'https://www.dentvitalis.com/hr/cjenik',
  );
  assert.equal(pageDocument('/'), '/index.html');
  assert.equal(pageDocument('/hr/cjenik'), '/_pages/hr/cjenik.html');
  for (const path of ['/../send', '/hr?x=1', '/assets/font.woff2'])
    assert.throws(() => pageDocument(path));
});

test('every built page has matching rewrites, canonical metadata and slashless internal links', async () => {
  const dist = new URL('../dist/', import.meta.url);
  const routes = JSON.parse(
    await readFile(new URL('page-routes.json', dist), 'utf8'),
  );
  const rewrites = await readFile(new URL('_redirects', dist), 'utf8');
  const sitemap = await readFile(new URL('sitemap-0.xml', dist), 'utf8');
  const legacySitemap = await readFile(new URL('sitemap.xml', dist), 'utf8');
  const index = await readFile(new URL('sitemap-index.xml', dist), 'utf8');
  assert.equal(legacySitemap, index);
  for (const route of retiredThankYouRoutes) assert.ok(!routes[route]);
  for (const route of Object.values(thankYouRoutes)) {
    assert.ok(routes[route]);
    assert.ok(!sitemap.includes(`<loc>${canonicalUrl(route)}</loc>`));
  }
  for (const [route, document] of Object.entries({
    '/': '/index.html',
    ...routes,
  })) {
    assert.equal(document, pageDocument(route));
    if (route !== '/') {
      assert.ok(
        rewrites.includes(`${route} ${document.replace(/\.html$/, '')} 200\n`),
        route,
      );
      assert.ok(rewrites.includes(`${route}/ ${route} 308\n`), route);
      await assert.rejects(access(new URL(`.${route}/index.html`, dist)));
    }
    const html = await readFile(new URL(`.${document}`, dist), 'utf8');
    assert.ok(
      html.includes(`rel="canonical" href="${canonicalUrl(route)}"`),
      route,
    );
    for (const match of html.matchAll(/\bhref="([^"]+)"/g)) {
      const href = match[1];
      if (
        !href.startsWith('/') &&
        !href.startsWith('https://www.dentvitalis.com')
      )
        continue;
      const url = new URL(href, 'https://www.dentvitalis.com');
      assert.equal(url.pathname, pagePath(url.pathname), `${route}: ${href}`);
    }
  }
  for (const match of sitemap.matchAll(/<loc>([^<]+)<\/loc>/g))
    assert.equal(match[1], canonicalUrl(match[1]));
});
