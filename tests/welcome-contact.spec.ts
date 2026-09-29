import { expect, test } from '@playwright/test';

for (const route of ['/', '/hr/', '/de/', '/en/', '/si/']) {
  for (const width of [390, 1440]) {
    test(`Welcome CTA opens the contact popup ${route} ${width}`, async ({
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
      await expect(cta).toHaveAttribute('data-contact-trigger', 'true');
      await cta.click();
      await expect(page).toHaveURL(new RegExp(`${route}$`));
      await expect(page.locator('[data-inquiry-dialog]')).toBeVisible();
      await expect(page.locator('[data-inquiry-dialog] form')).toBeVisible();
      await expect(page.locator('astro-error-overlay,vite-error-overlay')).toHaveCount(
        0,
      );
      expect(errors).toEqual([]);
    });
  }
}
