import { expect, test } from '@playwright/test';

const origin = process.env.QA_ORIGIN ?? 'http://127.0.0.1:4321';
const routes = [
  ['/si/politika-zasebnosti', 'sl', true],
  ['/si/pogoji-uporabe', 'sl', false],
  ['/en/privacy-policy', 'en', true],
  ['/en/terms-of-use', 'en', false],
  ['/informativa-sulla-privacy', 'it', true],
  ['/condizioni-di-utilizzo', 'it', false],
  ['/hr/polica-privatnosti', 'hr', true],
  ['/hr/uvjeti-koristenja', 'hr', false],
  ['/de/datenschutzerklarung', 'de', true],
  ['/de/nutzungsbedingungen', 'de', false],
] as const;

for (const [route, language, privacy] of routes) {
  test(`legal list markers are solid without changing ordered lists: ${route}`, async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    expect((await page.goto(origin + route))?.status()).toBe(200);
    await page.evaluate(() => document.fonts.ready);
    const article = page.locator('.legal-copy');
    const unordered = article.locator('ul.content-list');
    await expect(unordered).toHaveCount(privacy ? 5 : 0);
    await expect(article.locator('ol[type="a"]')).toHaveCount(privacy ? 6 : 0);
    for (const width of [390, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      for (const list of await unordered.all()) {
        await expect(list).toHaveCSS('list-style-type', 'disc');
        for (const item of await list.locator(':scope > li').all()) {
          await expect(item).toHaveCSS('list-style-type', 'disc');
          const marker = await item.evaluate((li) => {
            const style = getComputedStyle(li, '::marker');
            return {
              content: style.content,
              color: style.color,
              size: style.fontSize,
            };
          });
          expect(marker.content).toBe('normal');
          expect(marker.color).toBe('rgb(51, 51, 51)');
          expect(marker.size).toBe('18px');
        }
      }
      for (const list of await article.locator('ol').all())
        await expect(list).toHaveCSS('list-style-type', 'lower-alpha');
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth > innerWidth,
        ),
      ).toBe(false);
      if (privacy) {
        await unordered.nth(1).scrollIntoViewIfNeeded();
        await page.screenshot({
          path: `/tmp/dv-legal-markers-${language}-${width}.png`,
        });
      }
    }
  });
}
