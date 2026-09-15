import { expect, test } from '@playwright/test';

for (const route of [
  '/prestazioni-dentali',
  '/chi-siamo',
  '/informazioni-per-pazienti',
  '/hr/usluge',
  '/hr/o-nama',
  '/hr/informacije-za-pacijente',
]) {
  test(`Directory uses brand fonts ${route}`, async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (e) => errors.push(e.message));
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto(route);
    for (const width of [390, 820, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      await expect(page.locator('h1')).toBeVisible();
      await expect(page.locator('body')).toHaveCSS('font-family', /Montserrat/);
      for (const card of await page.locator('.teaser-card').all()) {
        await card.scrollIntoViewIfNeeded();
        await expect(card.locator('h2,h3')).toHaveCSS(
          'font-family',
          /Montserrat/,
        );
        await expect(card.locator('.description')).toHaveCSS(
          'font-family',
          /Montserrat/,
        );
        const rect = await card.boundingBox();
        expect(rect!.x).toBeGreaterThanOrEqual(0);
        expect(rect!.x + rect!.width).toBeLessThanOrEqual(width + 1);
      }
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      await page.evaluate(() => window.scrollTo(0, 0));
    }
    expect(errors).toEqual([]);
    await expect(
      page.locator('astro-error-overlay,vite-error-overlay'),
    ).toHaveCount(0);
  });
}
