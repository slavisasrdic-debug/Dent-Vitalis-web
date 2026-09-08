import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
import type { InnerPage } from '../src/content/inner-pages';

const sourcePages: InnerPage[] = JSON.parse(
  readFileSync('src/content/inner-pages-it.json', 'utf8'),
);

const translations = readFileSync('data/hr-routes.proposed.csv', 'utf8')
  .trim()
  .split('\n')
  .slice(1)
  .map((line) => line.split(','))
  .filter((row) => row[4] === 'approved');
const consumers = sourcePages
  .filter((entry) => entry.sidebar)
  .flatMap((entry) => {
    const translated = translations.find((row) => row[1] === entry.route);
    // Approved HR legal sources have no sidebar, unlike the Italian sources.
    const routes = [entry.route];
    if (translated && entry.typography !== 'reference-default')
      routes.push(translated[2]!);
    return routes.map((route) => ({ route, type: entry.sidebar!.type }));
  });

for (const width of [390, 1440]) {
  test(`all IT/HR sidebars group their headings with the content at ${width}px`, async ({
    page,
  }) => {
    test.setTimeout(120000);
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    for (const { route, type } of consumers) {
      expect((await page.goto(route))?.status(), route).toBe(200);
      await page.evaluate(() => document.fonts.ready);
      await expect(page.locator('main')).toBeVisible();
      await expect(
        page.locator('astro-error-overlay,vite-error-overlay'),
      ).toHaveCount(0);
      const sidebar = page.locator('.page-sidebar');
      await expect(sidebar).toHaveCount(1);
      const heading = sidebar.locator('.sidebar-heading');
      const titleVisible = await heading.locator('h2').isVisible();
      await expect(heading).toHaveCSS(
        'margin-bottom',
        type === 'package' || !titleVisible ? '0px' : '16px',
      );
      if (type === 'navigation' && titleVisible) {
        const spacing = await sidebar.evaluate((root) => {
          const title = root.querySelector('h2')!.getBoundingClientRect();
          const label = root.querySelector('.item > span');
          return {
            top: title.top - root.getBoundingClientRect().top,
            below: label ? label.getBoundingClientRect().top - title.bottom : 0,
            overflow: root.scrollWidth - root.clientWidth,
          };
        });
        expect(spacing.below, route).toBeLessThan(spacing.top);
        expect(spacing.overflow, route).toBe(0);
      }
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth - innerWidth,
        ),
        route,
      ).toBe(0);
    }
    expect(errors).toEqual([]);
  });
}

test('shared sidebar spacing survives breakpoints and keyboard navigation', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const width of [479, 480, 767, 768, 991, 992]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/informazioni/tempi-del-trattamento');
    await expect(page.locator('.sidebar-heading')).toHaveCSS(
      'margin-bottom',
      '16px',
    );
  }
  const link = page.locator('.page-sidebar .item').first();
  await link.focus();
  await expect(link).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/\/informazioni\/prima-visita-gratuita$/);
  await expect(page.locator('.page-sidebar .item').first()).toHaveAttribute(
    'aria-current',
    'page',
  );
});
