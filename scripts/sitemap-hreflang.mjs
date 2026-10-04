import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { productionOrigin } from '../src/content/seo-urls.ts';

export const sitemapLanguages = ['it', 'hr', 'de', 'en', 'sl'];
const decode = (value) =>
  value.replace(
    /&(amp|quot|apos|lt|gt);/g,
    (_, key) => ({ amp: '&', quot: '"', apos: "'", lt: '<', gt: '>' })[key],
  );
const escapeXml = (value) =>
  value.replace(
    /[&"<>]/g,
    (char) => ({ '&': '&amp;', '"': '&quot;', '<': '&lt;', '>': '&gt;' })[char],
  );

export function tagAttributes(tag) {
  return Object.fromEntries(
    [...tag.matchAll(/([\w:-]+)\s*=\s*["']([^"']*)["']/g)].map((match) => [
      match[1].toLowerCase(),
      decode(match[2]),
    ]),
  );
}

export function sitemapEntries(xml) {
  return [...xml.matchAll(/<url\b[^>]*>([\s\S]*?)<\/url>/g)].map((match) => ({
    url: decode(/<loc>([^<]+)<\/loc>/.exec(match[1])?.[1] ?? ''),
    alternates: [...match[1].matchAll(/<xhtml:link\b[^>]*>/g)].map((link) => {
      const attrs = tagAttributes(link[0]);
      return { lang: attrs.hreflang, url: attrs.href };
    }),
  }));
}

export function pageMetadata(html) {
  const head = /<head\b[^>]*>([\s\S]*?)<\/head>/i.exec(html)?.[1];
  assert.ok(head, 'Rendered page must contain a head');
  const links = [...head.matchAll(/<link\b[^>]*>/gi)].map((link) =>
    tagAttributes(link[0]),
  );
  const metas = [...head.matchAll(/<meta\b[^>]*>/gi)].map((meta) =>
    tagAttributes(meta[0]),
  );
  return {
    lang: tagAttributes(/<html\b[^>]*>/i.exec(html)?.[0] ?? '').lang,
    title: decode(/<title>([\s\S]*?)<\/title>/i.exec(head)?.[1] ?? ''),
    canonical: links.find((link) => link.rel === 'canonical')?.href,
    robots: metas.find((meta) => meta.name === 'robots')?.content ?? '',
    alternates: links
      .filter((link) => link.rel === 'alternate' && link.hreflang)
      .map((link) => ({ lang: link.hreflang, url: link.href })),
  };
}

export function validateSitemapPages(
  pages,
  { allowPreviewNoindex = false } = {},
) {
  const indexed = new Map(pages.map((page) => [page.url, page]));
  assert.equal(indexed.size, pages.length, 'Duplicate sitemap URL');
  for (const page of pages) {
    const url = new URL(page.url);
    assert.equal(url.origin, productionOrigin);
    assert.ok(url.pathname === '/' || !url.pathname.endsWith('/'));
    assert.ok(!url.search && !url.hash);
    assert.equal(
      page.canonical,
      page.url,
      'Sitemap and HTML canonical disagree',
    );
    assert.ok(sitemapLanguages.includes(page.lang));
    if (!allowPreviewNoindex)
      assert.ok(
        !/noindex/i.test(page.robots),
        `Noindex page in sitemap: ${page.url}`,
      );
    const alternates = new Map(
      page.alternates.map((link) => [link.lang, link.url]),
    );
    assert.equal(alternates.size, page.alternates.length, 'Duplicate hreflang');
    assert.equal(alternates.get(page.lang), page.url, 'Missing self hreflang');
    assert.equal(alternates.get('x-default'), productionOrigin + '/');
    for (const [lang, href] of alternates) {
      if (lang === 'x-default') continue;
      assert.ok(sitemapLanguages.includes(lang), `Invalid language: ${lang}`);
      const sibling = indexed.get(href);
      assert.ok(sibling, `Hreflang target missing from sitemap: ${href}`);
      assert.equal(
        sibling.lang,
        lang,
        'Hreflang and target HTML language disagree',
      );
      assert.deepEqual(
        new Map(sibling.alternates.map((link) => [link.lang, link.url])),
        alternates,
        `Non-reciprocal hreflang group: ${page.url}`,
      );
    }
  }
}

export async function sitemapFromRenderedPages(
  root,
  urls,
  documents,
  options = {},
) {
  const pages = await Promise.all(
    urls.map(async (url) => {
      const pathname = new URL(url).pathname;
      const document = pathname === '/' ? '/index.html' : documents[pathname];
      assert.ok(document, `Sitemap document missing: ${pathname}`);
      assert.ok(document.startsWith('/') && !document.includes('..'));
      const html = await readFile(resolve(root, '.' + document), 'utf8');
      return { url, ...pageMetadata(html) };
    }),
  );
  validateSitemapPages(pages, options);
  const xml =
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n' +
    pages
      .map(
        (page) =>
          '  <url>\n' +
          `    <loc>${escapeXml(page.url)}</loc>\n` +
          page.alternates
            // Owner decision 2026-10-04: omit x-default only from XML.
            // Keep validating the existing, unchanged HTML language pairs.
            .filter((link) => link.lang !== 'x-default')
            .map(
              (link) =>
                `    <xhtml:link rel="alternate" hreflang="${link.lang}" href="${escapeXml(link.url)}"/>\n`,
            )
            .join('') +
          '  </url>\n',
      )
      .join('') +
    '</urlset>\n';
  return { xml, pages };
}
