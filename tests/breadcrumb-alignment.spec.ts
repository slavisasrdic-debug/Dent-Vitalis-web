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
    const header = document
      .querySelector('.site-header')!
      .getBoundingClientRect();
    const breadcrumb = document
      .querySelector('.breadcrumbs')!
      .getBoundingClientRect();
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
    const textProblems: string[] = [];
    const textRects: { text: string; rect: DOMRect }[] = [];
    for (const item of document.querySelectorAll('.breadcrumbs li')) {
      const itemRect = item.getBoundingClientRect();
      for (const label of item.children) {
        const rect = label.getBoundingClientRect();
        if (label.scrollWidth > label.clientWidth + 1)
          textProblems.push(`Overflow: ${label.textContent}`);
        const range = document.createRange();
        range.selectNodeContents(label);
        for (const fragment of range.getClientRects()) {
          if (
            fragment.right > itemRect.right + 1 ||
            fragment.left < itemRect.left - 1 ||
            fragment.bottom > itemRect.bottom + 1
          )
            textProblems.push(`Text outside item: ${label.textContent}`);
          if (fragment.right > rect.right + 1)
            textProblems.push(`Text outside label: ${label.textContent}`);
          textRects.push({ text: label.textContent ?? '', rect: fragment });
        }
      }
    }
    for (let i = 0; i < textRects.length; i++) {
      for (const other of textRects.slice(i + 1)) {
        const current = textRects[i]!;
        if (
          Math.min(current.rect.right, other.rect.right) -
            Math.max(current.rect.left, other.rect.left) >
            1 &&
          Math.min(current.rect.bottom, other.rect.bottom) -
            Math.max(current.rect.top, other.rect.top) >
            1
        )
          textProblems.push(`Overlap: ${current.text} / ${other.text}`);
      }
    }
    return {
      textProblems,
      headerGap: breadcrumb.top - header.bottom,
      breadcrumbHeight: breadcrumb.height,
      fontSize: parseFloat(
        getComputedStyle(document.querySelector('.breadcrumbs li')!).fontSize,
      ),
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
  expect(geometry.textProblems, `${page.url()} at ${geometry.width}px`).toEqual(
    [],
  );
  expect(Math.abs(geometry.headerGap)).toBeLessThan(1);
  if (geometry.fontSize <= 14)
    expect(
      geometry.breadcrumbHeight,
      'Fits the conservative no-JS anchor allowance',
    ).toBeLessThanOrEqual(96);
}

for (const lang of ['it', 'hr']) {
  test(`all ${lang} breadcrumbs fit without overlap across responsive widths`, async ({
    page,
  }) => {
    test.setTimeout(180000);
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    page.on('console', (message) => {
      if (['error', 'warning'].includes(message.type()))
        errors.push(message.text());
    });
    expect(routes).toHaveLength(53);
    for (const route of routes.filter(
      (route) => route.startsWith('/hr/') === (lang === 'hr'),
    )) {
      expect((await page.goto(route))?.status()).toBe(200);
      await expect(page.locator('main h1')).toBeVisible();
      await expect(
        page.locator('astro-error-overlay,vite-error-overlay'),
      ).toHaveCount(0);
      for (const width of [
        320, 360, 375, 390, 414, 479, 480, 767, 768, 820, 834, 991, 992, 1024,
        1199, 1200, 1279, 1280, 1359, 1439, 1440, 1920, 2560,
      ]) {
        await page.setViewportSize({ width, height: 900 });
        await expectAlignment(page);
      }
    }
    expect(errors).toEqual([]);
  });
}

for (const route of [
  '/prestazioni/protesi-definitiva-ancorata-su-4-impianti',
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
    for (const route of [
      '/hr/prvi-pregled',
      '/hr/proteza-na-4-implantata',
      '/prestazioni/protesi-definitiva-ancorata-su-4-impianti',
    ]) {
      await page.goto('http://127.0.0.1:4321' + route);
      for (const width of [320, 390, 767, 768, 1359]) {
        await page.setViewportSize({ width, height: 900 });
        await expectAlignment(page);
      }
    }
  } finally {
    await context.close();
  }
});

test('long mobile breadcrumb stays readable at larger text size and after reload', async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await page.goto('/prestazioni/protesi-definitiva-ancorata-su-4-impianti');
  await page.addStyleTag({
    content: '.breadcrumbs li { font-size: 24px !important; }',
  });
  await expectAlignment(page);
  await page.reload();
  await expectAlignment(page);
  await page.locator('.breadcrumbs a').nth(1).click();
  await expect(page).toHaveURL(/\/prestazioni-dentali\/?$/);
  await expect(page.locator('main h1')).toBeVisible();
});
