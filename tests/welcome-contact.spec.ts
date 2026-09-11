import { expect, test } from '@playwright/test';

for (const route of ['/', '/hr/']) {
  for (const width of [390, 1440]) {
    test(`Welcome CTA scrolls to inline form ${route} ${width}`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.emulateMedia({ reducedMotion: 'reduce' });
      const errors: string[] = [];
      page.on('pageerror', (error) => errors.push(error.message));
      await page.goto(route);
      await expect(page.locator('h1')).toBeVisible();
      const cta = page.locator('.welcome .cta a');
      await expect(cta).toHaveAttribute('href', '#contatti');
      await cta.click();
      await expect(page).toHaveURL(new RegExp(`${route}#contatti$`));
      await expect(page.locator('#contatti form')).toBeInViewport();
      await expect(
        page.locator('dialog[open],astro-error-overlay,vite-error-overlay'),
      ).toHaveCount(0);
      expect(errors).toEqual([]);
    });
  }
}
