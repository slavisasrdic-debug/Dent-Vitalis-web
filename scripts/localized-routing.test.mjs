import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { germanLegalRoutes } from '../src/content/de/legal-routes.ts';
import { slovenianLegalRoutes } from '../src/content/sl/legal-routes.ts';
import { canonicalUrl } from '../src/content/seo-urls.ts';
import { thankYouRoutes } from '../src/content/thank-you-routes.ts';
import { canonicalHostRules } from './cpanel-routing.mjs';
import decisions from '../data/seo/localized-route-decisions-20261004.json' with { type: 'json' };

test('all localized documents and sitemap entries use the reviewed native path, never an English fallback', async () => {
  const ids = (await readFile('data/hr-routes.proposed.csv', 'utf8'))
    .trim()
    .split('\n')
    .slice(1)
    .map((row) => row.split(','))
    .filter((row) => row[4] === 'approved')
    .map((row) => row[0]);
  const documents = JSON.parse(await readFile('dist/page-routes.json', 'utf8'));
  const sitemap = await readFile('dist/sitemap-0.xml', 'utf8');
  const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(
    (match) => match[1],
  );
  assert.equal(new Set(urls).size, 136);
  assert.deepEqual(
    new Set(urls),
    new Set(
      ['/', ...Object.keys(documents)]
        .filter((path) => !Object.values(thankYouRoutes).includes(path))
        .map(canonicalUrl),
    ),
  );
  let renamed = 0;
  const nativeRules = canonicalHostRules(documents, {
    requireApprovedTargets: true,
  });
  for (const [locale, legal, prefix] of [
    ['de', germanLegalRoutes, '/de'],
    ['sl', slovenianLegalRoutes, '/si'],
  ]) {
    // Independent build oracle: compare emitted documents to the reviewed data,
    // not to the same route implementation that produced them. Browser tests
    // separately exercise the real route functions and all their consumers.
    const route = (id) =>
      id === 'home' ? prefix : (legal[id] ?? decisions.routes[locale][id]);
    assert.equal(new Set(ids.map(route)).size, 27);
    for (const id of ids) {
      const path = route(id);
      const document = documents[path];
      assert.ok(document, `Missing ${locale} built route: ${path}`);
      assert.ok(
        urls.includes(canonicalUrl(path)),
        `Missing ${path} in sitemap`,
      );
      const html = await readFile('dist' + document, 'utf8');
      assert.ok(html.includes(`rel="canonical" href="${canonicalUrl(path)}"`));
      assert.ok(
        html.includes(`RewriteRule`) === false,
        'Server rules must not leak into pages',
      );
      if (['home', 'privacy', 'terms', 'faq'].includes(id)) continue;
      const draft = `${prefix}/${id}`;
      assert.notEqual(path, draft);
      assert.ok(
        !documents[draft],
        `Unpublished English alias is still built: ${draft}`,
      );
      if (decisions.publishedTestimonials.paths.includes(draft)) {
        assert.ok(
          nativeRules.includes(
            `RewriteRule ^${draft.slice(1)}/?$ ${path} [R=301,L,NE]`,
          ),
        );
      } else {
        assert.ok(
          !nativeRules.includes(`RewriteRule ^${draft.slice(1)}/?$`),
          `Unrequested draft 301: ${draft}`,
        );
      }
      assert.equal(path, decisions.routes[locale][id]);
      renamed++;
    }
  }
  assert.equal(renamed, 46);
});
