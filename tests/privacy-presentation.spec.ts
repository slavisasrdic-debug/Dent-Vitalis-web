import { expect, test } from '@playwright/test';
import { createHash } from 'node:crypto';

// Captured from the unchanged legal article DOM on 2026-09-11.
// Heading tags are normalized: approved hierarchy changes must not alter text
// (including whitespace), block order, list structure, labels or hrefs.
const pages = [
  [
    '/hr/polica-privatnosti',
    'e66ffbac46f3e4ff2256899c8cd7ce8ce0f0fceaa03772eb7574b77112e9d003',
  ],
];

for (const [route, hash] of pages) {
  test(`privacy typography preserves literal article: ${route}`, async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    page.on('console', (message) => {
      if (['error', 'warning'].includes(message.type()))
        errors.push(message.text());
    });
    expect(
      (await page.goto(route!, { waitUntil: 'domcontentloaded' }))?.status(),
    ).toBe(200);
    await page.evaluate(() => document.fonts.ready);
    await expect(page.locator('main h1')).toHaveCount(1);
    await expect(page.locator('.editorial-copy h2')).toHaveCount(
      route!.startsWith('/hr/') ? 11 : 12,
    );
    await expect(page.locator('.editorial-copy h3')).toHaveCount(9);
    await expect(page.locator('.editorial-copy h4')).toHaveCount(8);
    if (route!.startsWith('/hr/'))
      await expect(page.locator('#privacy-rights')).toHaveCSS(
        'list-style-type',
        'lower-alpha',
      );
    const levels = await page
      .locator('.editorial-copy h2,.editorial-copy h3,.editorial-copy h4')
      .evaluateAll((nodes) =>
        nodes.map((node) => Number(node.tagName.slice(1))),
      );
    let previous = 1;
    for (const level of levels) {
      expect(level).toBeLessThanOrEqual(previous + 1);
      previous = level;
    }
    for (const width of [320, 390, 820, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      const article = page.locator('.editorial-copy');
      await expect(article).toHaveCSS('font-family', /Montserrat/);
      const data = await article.evaluate((original) => {
        // Approved contact anchors may be added, but every original character,
        // existing link and structural node must still match the old checksum.
        const el = original.cloneNode(true) as HTMLElement;
        // Assert the approved one-word deletion, then restore only in the clone
        // so the immutable checksum still protects every other character/node.
        const corrected = [...el.querySelectorAll('h2')].find(
          (h) => h.textContent === 'Online Privacy Protection Act Compliance',
        );
        if (!corrected)
          throw new Error('Missing approved Croatian privacy heading');
        corrected.textContent =
          'Dječje Online Privacy Protection Act Compliance';
        el.querySelectorAll('a[data-contact-link]').forEach((a) =>
          a.replaceWith(...a.childNodes),
        );
        // One approved href-only correction in the HR snapshot; restore it
        // solely for comparison with the immutable pre-change checksum.
        el.querySelectorAll('a[href="tel:+38551371064"]').forEach((a) =>
          a.setAttribute('href', 'tel:0038550371064'),
        );
        return {
          text: el.textContent,
          structure: [...el.querySelectorAll('*')].map((e) => ({
            tag: ['P', 'H2', 'H3', 'H4'].includes(e.tagName)
              ? 'TEXT-BLOCK'
              : e.tagName,
            href: e.getAttribute('href'),
            text: e.childElementCount ? null : e.textContent,
          })),
        };
      });
      expect(
        createHash('sha256').update(JSON.stringify(data)).digest('hex'),
      ).toBe(hash);
      expect(
        await page.evaluate(
          () =>
            document.documentElement.scrollWidth -
            document.documentElement.clientWidth,
        ),
      ).toBe(0);
      await expect(
        page.locator('astro-error-overlay,vite-error-overlay'),
      ).toHaveCount(0);
      await expect(page.locator('h1')).toBeVisible();
    }
    await page.reload({ waitUntil: 'domcontentloaded' });
    await expect(page.locator('.editorial-copy')).toHaveCSS(
      'font-family',
      /Montserrat/,
    );
    const link = page.locator('aside a').last();
    await link.focus();
    await expect(link).toBeFocused();
    expect(errors).toEqual([]);
  });
}

test('terms of use use the approved website font', async ({ page }) => {
  for (const route of ['/condizioni-di-utilizzo', '/hr/uvjeti-koristenja']) {
    await page.goto(route, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('.editorial-copy')).toHaveCSS(
      'font-family',
      /Montserrat/,
    );
  }
});
