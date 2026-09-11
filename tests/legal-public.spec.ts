import { expect, test } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import sources from '../src/content/legal-public.json' with { type: 'json' };

for (const source of sources) {
  test(`legal article matches approved public source: ${source.route}`, async ({
    page,
  }) => {
    const raw = readFileSync(source.source.file, 'utf8');
    expect(createHash('sha256').update(raw).digest('hex')).toBe(
      source.source.sha256,
    );
    const errors: string[] = [];
    page.on('pageerror', (e) => errors.push(e.message));
    expect(
      (
        await page.goto(source.route, { waitUntil: 'domcontentloaded' })
      )?.status(),
    ).toBe(200);
    await expect(page.locator('main h1')).toHaveText(source.title);
    await expect(
      page.locator('astro-error-overlay,vite-error-overlay'),
    ).toHaveCount(0);
    const comparison = await page.evaluate((raw) => {
      const doc = new DOMParser().parseFromString(raw, 'text/html');
      const heading = [...doc.querySelectorAll('h1,h2')].find((e) =>
        e.closest('.dent_mdl'),
      )!;
      const original = heading.closest('.dent_mdl')!;
      heading.remove();
      const current = document.querySelector('.editorial-copy')!;
      const text = (e: Element) =>
        (e.textContent || '')
          .replace(
            'Dječje Online Privacy Protection Act Compliance',
            'Online Privacy Protection Act Compliance',
          )
          .replace(/\s+/g, '');
      const lists = (e: Element) =>
        [...e.querySelectorAll('ol,ul')].map((l) => ({
          tag: l.tagName,
          type: l.getAttribute('type'),
          count: l.children.length,
          nested: l.parentElement?.closest('li') !== null,
        }));
      const strong = (e: Element) =>
        [...e.querySelectorAll('strong,b')].map(text);
      const href = (a: Element) => {
        const value = a.getAttribute('href')!;
        if (value === 'tel:0038550371064' || value === 'tel:0038551371064')
          return 'tel:+38551371064';
        if (value.startsWith('/')) return value.replace(/\/$/, '') || '/';
        return value;
      };
      const links = (e: Element) =>
        [...e.querySelectorAll('a')].map((a) => ({
          text: text(a),
          href: href(a),
        }));
      const headings = [...current.querySelectorAll('h2,h3,h4')].map((h) =>
        Number(h.tagName.slice(1)),
      );
      return {
        oldText: text(original),
        newText: text(current),
        oldLists: lists(original),
        newLists: lists(current),
        oldStrong: strong(original),
        newStrong: strong(current),
        oldLinks: links(original),
        newLinks: links(current),
        headings,
      };
    }, raw);
    // Whitespace differs with responsive layout / HTML indentation, but no
    // letter, punctuation mark, number or block order may change.
    expect(comparison.newText).toBe(comparison.oldText);
    expect(comparison.newLists).toEqual(comparison.oldLists);
    expect(comparison.newStrong).toEqual(comparison.oldStrong);
    for (const link of comparison.oldLinks)
      expect(comparison.newLinks).toContainEqual(link);
    let previous = 1;
    for (const level of comparison.headings) {
      expect(level).toBeLessThanOrEqual(previous + 1);
      previous = level;
    }
    for (const width of [320, 390, 820, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      await expect(page.locator('.editorial-copy')).toHaveCSS(
        'font-family',
        /Montserrat/,
      );
      expect(
        await page.evaluate(
          () =>
            document.documentElement.scrollWidth -
            document.documentElement.clientWidth,
        ),
      ).toBe(0);
      for (const list of await page.locator('.editorial-copy ol').all())
        await expect(list).toHaveCSS('list-style-type', 'lower-alpha');
    }
    await expect(page.locator('aside a')).not.toHaveCount(0);
    expect(errors).toEqual([]);
  });
}
