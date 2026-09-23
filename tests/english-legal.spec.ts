import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
const origin = process.env.QA_ORIGIN ?? 'http://127.0.0.1:4321';
const documents = JSON.parse(
  readFileSync('src/content/en/legal-public.json', 'utf8'),
) as typeof import('../src/content/en/legal-public.json');
for (const article of documents)
  test(`English legal source text, lists, emphasis and links: ${article.route}`, async ({
    page,
    request,
  }) => {
    const source = readFileSync(article.source.file, 'utf8');
    expect(createHash('sha256').update(source).digest('hex')).toBe(
      article.source.sha256,
    );
    const response = await request.get(origin + article.route);
    expect(response.status()).toBe(200);
    const result = await page.evaluate(
      ({ source, rendered }) => {
        const parse = (html: string) =>
          new DOMParser().parseFromString(html, 'text/html');
        const original = parse(source);
        const title = [...original.querySelectorAll('h1,h2')].find((e) =>
          e.closest('.dent_mdl'),
        )!;
        const originalRoot = title.closest('.dent_mdl')!;
        title.remove();
        originalRoot
          .querySelectorAll('script,style,iframe,form')
          .forEach((e) => e.remove());
        const output = parse(rendered).querySelector('.editorial-copy')!;
        const norm = (t: string) => t.replace(/\s/g, '');
        const normalizedHref = (href: string) =>
          href
            .replace(/^https:\/\/www.dentvitalis.com(?=\/en)/, '')
            // Existing shared correction: the source href says 50, its label 51.
            .replace('tel:0038550371064', 'tel:+38551371064')
            .replace(/^tel:00385/, 'tel:+385');
        const summarize = (e: Element) => ({
          text: norm(e.textContent ?? ''),
          lists: [...e.querySelectorAll('ol,ul')].map((l) => [
            l.tagName,
            l.getAttribute('type'),
            l.children.length,
          ]),
          links: [...e.querySelectorAll('a[href]')].map((a) => [
            norm(a.textContent ?? ''),
            normalizedHref(a.getAttribute('href')!),
          ]),
          strong: [...e.querySelectorAll('strong,b')].map((s) =>
            norm(s.textContent ?? ''),
          ),
        });
        return {
          source: summarize(originalRoot),
          rendered: summarize(output),
          headings: [...output.querySelectorAll('h2,h3,h4')].map((h) => ({
            tag: h.tagName,
            text: h.textContent,
          })),
        };
      },
      { source, rendered: await response.text() },
    );
    expect(result.rendered.text).toBe(result.source.text);
    expect(result.rendered.lists).toEqual(result.source.lists);
    expect(result.rendered.strong).toEqual(result.source.strong);
    for (const link of result.source.links)
      expect(result.rendered.links).toContainEqual(link);
    if (article.route.includes('privacy')) {
      // English source has ten .question headings plus one .policy-title.
      expect(result.headings.filter((h) => h.tag === 'H2')).toHaveLength(11);
      expect(result.headings.filter((h) => h.tag === 'H3')).toHaveLength(9);
      expect(result.headings.filter((h) => h.tag === 'H4')).toHaveLength(8);
    } else expect(result.headings.map((h) => h.text)).toContain('Disclaimer');
  });
