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
const serviceRoutes = [
  '/prestazioni/protesi-definitiva-ancorata-su-4-impianti',
  '/hr/proteza-na-4-implantata',
  '/de/four-implant-denture',
  '/en/four-implant-denture',
  '/si/four-implant-denture',
];

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

test('hero subtitles contain no navigation links and retain white telephone links', async ({
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
  for (const width of [390, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const route of serviceRoutes) {
      await page.goto(route);
      await page.evaluate(() => document.fonts.ready);
      const description = page.locator('.detail-hero .description');
      await expect(description).toHaveCSS('color', 'rgb(255, 255, 255)');
      await expect(description.locator('a')).toHaveCount(0);
    }
  }
  await page.goto('/informazioni-per-pazienti');
  const link = page.locator('.detail-hero .description a[href^="tel:"]');
  await expect(link).toHaveCount(1);
  await expect(link).toHaveCSS('color', 'rgb(255, 255, 255)');
  const box = await page.locator('.detail-hero .description').boundingBox();
  await link.focus();
  await expect(link).toBeFocused();
  await expect(link).toHaveCSS('outline-color', 'rgb(255, 255, 255)');
  const focusedBox = await page.locator('.detail-hero .description').boundingBox();
  expect(focusedBox!.width).toBe(box!.width);
  expect(focusedBox!.height).toBe(box!.height);
  expect(errors).toEqual([]);
});
