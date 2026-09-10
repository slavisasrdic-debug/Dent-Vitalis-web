import { expect, test } from '@playwright/test';
import { readFileSync } from 'node:fs';
import italianPages from '../src/content/inner-pages-it.json' with { type: 'json' };

const routes = [
  ...italianPages.map((page) => page.route),
  ...readFileSync('data/hr-routes.proposed.csv', 'utf8')
    .trim()
    .split('\n')
    .slice(1)
    .map((line) => line.split(','))
    .filter((row) => row[4] === 'approved' && row[2] !== '/hr/')
    .map((row) => row[2]!),
];

for (const lang of ['it', 'hr']) {
  test(`all ${lang} detail heroes use compact mobile spacing only`, async ({
    page,
  }) => {
    test.setTimeout(180000);
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    expect(routes).toHaveLength(53);
    for (const route of routes.filter(
      (route) => route.startsWith('/hr/') === (lang === 'hr'),
    )) {
      expect(
        (await page.goto(route, { waitUntil: 'domcontentloaded' }))?.status(),
      ).toBe(200);
      await page.evaluate(() => document.fonts.ready);
      await expect(page.locator('.detail-hero h1')).toBeVisible();
      await expect(
        page.locator('astro-error-overlay,vite-error-overlay'),
      ).toHaveCount(0);
      for (const width of [320, 390, 767, 768, 991, 992, 1440]) {
        await page.setViewportSize({ width, height: 900 });
        const result = await page.locator('.detail-hero').evaluate((hero) => {
          const heading = hero.querySelector('h1')!;
          const description = hero.querySelector('.description')!;
          return {
            gap:
              description.getBoundingClientRect().top -
              heading.getBoundingClientRect().bottom,
            bottom: getComputedStyle(heading).marginBottom,
            top: getComputedStyle(description).marginTop,
            overflow:
              document.documentElement.scrollWidth -
              document.documentElement.clientWidth,
          };
        });
        const spacing = width <= 991 ? 12 : 20;
        expect(result.bottom, `${route} ${width}`).toBe(`${spacing}px`);
        expect(result.top, `${route} ${width}`).toBe(`${spacing}px`);
        expect(result.gap, `${route} ${width}`).toBe(spacing);
        expect(result.overflow, `${route} ${width}`).toBe(0);
      }
    }
    expect(errors).toEqual([]);
  });
}

test('specialists mobile spacing survives reload and breadcrumb navigation', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/su-di-noi/i-nostri-specialisti', {
    waitUntil: 'domcontentloaded',
  });
  await page.reload({ waitUntil: 'domcontentloaded' });
  await expect(page.locator('h1')).toHaveText('I nostri specialisti');
  await expect(page.locator('.detail-hero .description')).toHaveCSS(
    'margin-top',
    '12px',
  );
  await page.locator('.breadcrumbs a').nth(1).click();
  await expect(page).toHaveURL(/\/chi-siamo\/?$/);
  await expect(page.locator('h1')).toBeVisible();
});
