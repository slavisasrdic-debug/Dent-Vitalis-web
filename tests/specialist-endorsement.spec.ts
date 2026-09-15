import { expect, test } from '@playwright/test';

for (const path of [
  '/su-di-noi/i-nostri-specialisti',
  '/hr/nasi-specijalisti',
]) {
  for (const width of [390, 1440]) {
    test(`Endorsement hierarchy ${path} ${width}`, async ({ page }) => {
      const errors: string[] = [];
      page.on('pageerror', (e) => errors.push(e.message));
      await page.setViewportSize({ width, height: 900 });
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.goto(path);
      await expect(page.locator('h1')).toBeVisible();
      const callout = page.locator('.endorsement');
      await callout.scrollIntoViewIfNeeded();
      await expect(callout).toContainText('Manuel Mingione');
      await expect(callout.locator('.content-bullet')).toHaveCount(3);
      for (const quote of await callout.locator('.endorsement-quote').all()) {
        await expect(quote).toHaveCSS('font-size', '18px');
        await expect(quote).toHaveCSS('font-weight', '500');
      }
      for (const credit of await callout.locator('.endorsement-credit').all()) {
        await expect(credit).toHaveCSS('font-size', '16px');
        await expect(credit).toHaveCSS('font-weight', '400');
      }
      await expect(callout.locator('strong')).toHaveCount(0);
      await expect(callout.locator('.bullet-icon')).toHaveCount(3);
      for (const dot of await callout.locator('.bullet-icon').all()) {
        await expect(dot).toHaveCSS('width', '5px');
        await expect(dot).toHaveCSS('background-color', 'rgb(0, 0, 0)');
      }
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      expect(errors).toEqual([]);
      await expect(
        page.locator('astro-error-overlay,vite-error-overlay'),
      ).toHaveCount(0);
    });
  }
}
