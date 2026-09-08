import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
import type { InnerPage } from '../src/content/inner-pages';

const pages: InnerPage[] = JSON.parse(
  readFileSync('src/content/inner-pages-it.json', 'utf8'),
);
const translatedRoutes = readFileSync('data/hr-routes.proposed.csv', 'utf8')
  .trim()
  .split('\n')
  .slice(1)
  .map((line) => line.split(','))
  .filter((row) => row[4] === 'approved' && row[0] !== 'home')
  .map((row) => row[2]!);
const service = '/prestazioni/protesi-definitiva-ancorata-su-4-impianti';

test('all IT/HR detail hero descriptions stay left aligned', async ({
  page,
}) => {
  test.setTimeout(120000);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  for (const width of [390, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const route of [
      ...pages.map((entry) => entry.route),
      ...translatedRoutes,
    ]) {
      expect((await page.goto(route))?.status(), route).toBe(200);
      await expect(page.locator('h1')).toBeVisible();
      await expect(
        page.locator('astro-error-overlay,vite-error-overlay'),
      ).toHaveCount(0);
      await expect(page.locator('.detail-hero .description')).toHaveCSS(
        'text-align',
        'left',
      );
    }
  }
  expect(errors).toEqual([]);
});

test('hero links are green, remain readable on hover/focus and still navigate', async ({
  page,
}) => {
  test.setTimeout(90000);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => {
    if (['error', 'warning'].includes(message.type()))
      errors.push(message.text());
  });
  for (const width of [390, 479, 480, 767, 768, 991, 992, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const route of [service, '/informazioni-per-pazienti']) {
      await page.goto(route);
      await page.evaluate(() => document.fonts.ready);
      await page.mouse.move(0, 0);
      const description = page.locator('.detail-hero .description');
      await expect(description).toHaveCSS('color', 'rgb(255, 255, 255)');
      for (const link of await description.locator('a').all()) {
        await expect(link).toHaveCSS('color', 'rgb(175, 188, 54)');
        const box = await description.boundingBox();
        await link.hover();
        await expect(link).toHaveCSS('color', 'rgb(255, 255, 255)');
        await link.focus();
        await page.mouse.move(0, 0);
        await expect(link).toBeFocused();
        await expect(link).toHaveCSS('outline-color', 'rgb(255, 255, 255)');
        await expect(link).toHaveCSS('color', 'rgb(255, 255, 255)');
        const focusedBox = await description.boundingBox();
        expect(focusedBox!.width).toBe(box!.width);
        expect(focusedBox!.height).toBe(box!.height);
        await link.evaluate((element) => element.blur());
      }
    }
  }
  await page.goto(service);
  const link = page.locator('.detail-hero .description a').first();
  await link.focus();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(
    /\/prestazioni\/corone-faccette-ponti-e-protesi#protesi_mobili$/,
  );
  await expect(page.locator('#protesi_mobili')).toBeVisible();
  // Article links keep their existing blue treatment; no global link override.
  await expect(page.locator('.editorial-copy a.underlined').first()).toHaveCSS(
    'color',
    'rgb(4, 90, 114)',
  );
  expect(errors).toEqual([]);
});
