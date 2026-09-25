import { expect, test } from '@playwright/test';

const pages = [
  ['/hr/cjenik/', 'DV-cjenik-hr-2600.webp'],
  ['/de/prices/', 'DV-cjenik-de-2600.webp'],
  ['/en/prices/', 'DV-cjenik-en-2600.webp'],
  ['/si/prices/', 'DV-cjenik-sl-2600.webp'],
] as const;

for (const width of [390, 1440]) {
  test(`each localized price list uses its localized hero image at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });

    for (const [route, image] of pages) {
      expect((await page.goto(route))?.status()).toBe(200);
      const heroImage = page.locator('main img').first();
      await expect(heroImage).toHaveAttribute('src', new RegExp(image));
      await expect
        .poll(() =>
          heroImage.evaluate((element) =>
            element instanceof HTMLImageElement ? element.naturalWidth : 0,
          ),
        )
        .toBeGreaterThan(0);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
    }
  });
}
