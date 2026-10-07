import { test, expect } from '@playwright/test';
import { blockElfsight } from './helpers/elfsight';

const cases = [
  {
    lang: 'it',
    route: '/contatti',
    country: 'Croazia',
    city: 'Rijeka (Fiume)',
  },
  { lang: 'de', route: '/de/kontakt', country: 'Kroatien', city: 'Rijeka' },
  { lang: 'en', route: '/en/contact', country: 'Croatia', city: 'Rijeka' },
  { lang: 'sl', route: '/si/stik-z-nami', country: 'Hrvaška', city: 'Rijeka' },
];

for (const item of cases)
  for (const width of [390, 1440])
    test(`${item.lang} contact address at ${width}px`, async ({ page }) => {
      await blockElfsight(page);
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.setViewportSize({ width, height: 900 });
      const errors: string[] = [];
      page.on('pageerror', (error) => errors.push(error.message));
      const response = await page.goto(item.route);
      expect(response?.status()).toBe(200);
      await expect(page.locator('html')).toHaveAttribute('lang', item.lang);
      await expect(page.locator('h1')).toBeVisible();
      const address = page.locator('.contact-address');
      if (item.lang !== 'it') {
        await expect(page.locator('footer')).toContainText(
          `Krešimirova 60, 51000 Rijeka, ${item.country}`,
        );
        await expect(page.locator('footer')).not.toContainText(
          /Fiume|Croazia|\(Reka\)/,
        );
        await expect(page.locator('.map-panel iframe')).toHaveAttribute(
          'title',
          `DentVitalis — Krešimirova 60, 51000 Rijeka, ${item.country}`,
        );
      }
      if (item.lang === 'it') {
        await expect(address).toContainText(
          'Krešimirova 60, 51000 Rijeka (Fiume)',
        );
        await expect(address).toContainText('Croazia');
        await expect(address).not.toContainText('Hrvatska');
        await expect(page.locator('meta[name=description]')).toHaveAttribute(
          'content',
          /Rijeka \(Fiume\), Croazia$/,
        );
      } else
        await expect(address.locator('p')).toHaveText([
          'Dentvitalis Fides d.o.o.',
          `Krešimirova 60, 51000 ${item.city}`,
          item.country,
          /www\.dentvitalis\.com/,
        ]);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      await expect(
        page.locator('astro-error-overlay, vite-error-overlay'),
      ).toHaveCount(0);
      await address.scrollIntoViewIfNeeded();
      await address.screenshot({
        path: `/tmp/dentvitalis-address-v18-${item.lang}-${width}.png`,
      });
      const trigger = page.locator(
        width >= 1200
          ? '.header-consultation .button'
          : '.mobile-contact .button',
      );
      await trigger.click();
      const dialog = page.locator('[data-inquiry-dialog]');
      await expect(dialog).toBeVisible();
      await expect(dialog.locator('input[name=lang]')).toHaveValue(item.lang);
      await page.keyboard.press('Escape');
      await expect(dialog).not.toBeVisible();
      expect(errors).toEqual([]);
    });
