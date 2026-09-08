import { expect, test, type Page } from '@playwright/test';
import { readFileSync } from 'node:fs';
import italianPages from '../src/content/inner-pages-it.json' with { type: 'json' };

test.use({ contextOptions: { reducedMotion: 'reduce' } });
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

async function expectAlignment(page: Page) {
  const geometry = await page.evaluate(() => {
    const logo = document.querySelector('.brand')!.getBoundingClientRect();
    const list = document
      .querySelector('.breadcrumbs ol')!
      .getBoundingClientRect();
    const first = document
      .querySelector('.breadcrumbs li')!
      .getBoundingClientRect();
    const width = document.documentElement.clientWidth;
    const gutter =
      width <= 479
        ? width * 0.07
        : width <= 991 || width >= 1440
          ? width * 0.05
          : 20;
    const maxWidth = width >= 1280 ? 1400 : 1200;
    return {
      delta: first.left - logo.left,
      logoDelta: logo.left - Math.max(gutter, (width - maxWidth) / 2),
      listRight: list.right,
      width,
      overflow: document.documentElement.scrollWidth - width,
    };
  });
  expect(
    Math.abs(geometry.delta),
    `${page.url()} at ${geometry.width}px`,
  ).toBeLessThan(0.1);
  expect(
    Math.abs(geometry.logoDelta),
    'header geometry must not change',
  ).toBeLessThan(0.1);
  expect(geometry.listRight).toBeLessThanOrEqual(geometry.width);
  expect(geometry.overflow, `${page.url()} at ${geometry.width}px`).toBe(0);
}

for (const width of [767, 1359]) {
  test(`all 53 IT/HR inner pages align with the logo at ${width}px`, async ({
    page,
  }) => {
    test.setTimeout(90000);
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.setViewportSize({ width, height: 900 });
    expect(routes).toHaveLength(53);
    for (const route of routes) {
      expect((await page.goto(route))?.status()).toBe(200);
      await expect(page.locator('main h1')).toBeVisible();
      await expect(
        page.locator('astro-error-overlay,vite-error-overlay'),
      ).toHaveCount(0);
      await expectAlignment(page);
    }
    expect(errors).toEqual([]);
  });
}

for (const route of [
  '/informazioni/prima-visita-gratuita',
  '/hr/prvi-pregled',
  '/hr/proteza-na-4-implantata',
  '/informazioni-per-pazienti',
]) {
  test(`breadcrumb alignment across container and font boundaries: ${route}`, async ({
    page,
  }) => {
    await page.goto(route);
    await page.evaluate(() => document.fonts.ready);
    for (const width of [
      320, 390, 478, 479, 480, 481, 766, 767, 768, 769, 990, 991, 992, 993,
      1199, 1200, 1201, 1239, 1240, 1241, 1279, 1280, 1281, 1359, 1439, 1440,
      1441, 1555, 1556, 1557, 1920, 2560,
    ]) {
      await page.setViewportSize({ width, height: 900 });
      await expectAlignment(page);
      if (width === 320 && route === '/hr/prvi-pregled') {
        const lines = await page
          .locator('.breadcrumbs [aria-current]')
          .evaluate(
            (element) =>
              element.getBoundingClientRect().height /
              parseFloat(getComputedStyle(element).lineHeight),
          );
        // Preserve readable words, not a narrow column of broken syllables.
        expect(lines).toBeLessThanOrEqual(2.1);
      }
    }
    await page.evaluate(() =>
      window.scrollTo({ top: 300, behavior: 'instant' }),
    );
    await expectAlignment(page);
    const home = page.locator('.breadcrumbs a').first();
    const href = await home.getAttribute('href');
    await home.focus();
    await expect(home).toBeFocused();
    await home.press('Enter');
    await expect(page).toHaveURL(`http://127.0.0.1:4321${href}`);
  });
}

test('breadcrumb alignment is CSS-only without JavaScript', async ({
  browser,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 1359, height: 900 },
  });
  try {
    const page = await context.newPage();
    await page.goto('http://127.0.0.1:4321/hr/prvi-pregled');
    await expectAlignment(page);
    await page.setViewportSize({ width: 767, height: 900 });
    await expectAlignment(page);
  } finally {
    await context.close();
  }
});
