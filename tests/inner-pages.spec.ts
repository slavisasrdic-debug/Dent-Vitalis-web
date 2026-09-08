import { test, expect, webkit } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import { readFileSync } from 'node:fs';
import type { InnerPage } from '../src/content/inner-pages';
const innerPages: InnerPage[] = JSON.parse(
  readFileSync('src/content/inner-pages-it.json', 'utf8'),
);

const normalized = (text: string) => text.replace(/[\s\u200b]+/g, '');
for (const viewport of [
  { width: 1440, height: 900 },
  { width: 390, height: 900 },
]) {
  test.describe(`${viewport.width}px Italian pages`, () => {
    test.use({ viewport, contextOptions: { reducedMotion: 'reduce' } });
    for (const entry of innerPages) {
      test(entry.route, async ({ page, context }) => {
        const errors: string[] = [];
        page.on('pageerror', (error) => errors.push(error.message));
        const response = await page.goto(entry.route);
        expect(response?.status()).toBe(200);
        await page.evaluate(() => document.fonts.ready);
        await expect(page.locator('h1')).toHaveCount(1);
        await expect(page.locator('h1')).toHaveText(entry.hero.title);
        await expect(page.locator('html')).toHaveAttribute('lang', 'it');
        await expect(page.locator('meta[name=robots]')).toHaveAttribute(
          'content',
          /noindex/,
        );
        expect(
          await page.evaluate(
            () => document.documentElement.scrollWidth - innerWidth,
          ),
        ).toBe(0);
        const duplicateIds = await page.evaluate(() => {
          const ids = [...document.querySelectorAll('[id]')].map((e) => e.id);
          return ids.filter((id, i) => ids.indexOf(id) !== i);
        });
        expect(duplicateIds).toEqual([]);
        if (entry.blocks.length) {
          const reference = await context.newPage();
          await reference.route('**/*', (route) => route.abort());
          await reference.setContent(await readFile(entry.source.file, 'utf8'));
          const expected = await reference
            .locator('.tekst-detaljna')
            .evaluate((root) => {
              const clone = root.cloneNode(true) as HTMLElement;
              clone
                .querySelectorAll('script,style,svg,.skriveni')
                .forEach((node) => node.remove());
              return clone.textContent || '';
            });
          expect(
            normalized(
              (await page.locator('.editorial-copy').textContent()) || '',
            ),
          ).toBe(normalized(expected));
          await reference.close();
        }
        if (entry.sidebar && viewport.width === 390) {
          const sidebar = await page.locator('.page-sidebar').boundingBox();
          const article = await page.locator('.editorial-copy').boundingBox();
          expect(sidebar!.y < article!.y).toBe(
            entry.sidebar.mobilePlacement === 'before',
          );
        }
        expect(errors).toEqual([]);
      });
    }
  });
}

test('all Italian routes also fit mobile WebKit', async () => {
  test.setTimeout(90000);
  const browser = await webkit.launch();
  try {
    const page = await browser.newPage({
      viewport: { width: 390, height: 844 },
      reducedMotion: 'reduce',
    });
    for (const entry of innerPages) {
      expect(
        (await page.goto(`http://127.0.0.1:4321${entry.route}`))?.status(),
      ).toBe(200);
      await page.evaluate(() => document.fonts.ready);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth - innerWidth,
        ),
        entry.route,
      ).toBe(0);
      await expect(page.locator('h1')).toBeVisible();
    }
  } finally {
    await browser.close();
  }
});

test('testimonials load one player only after keyboard activation', async ({
  page,
}) => {
  await page.route('https://www.youtube-nocookie.com/**', (route) =>
    route.fulfill({
      contentType: 'text/html',
      body: '<html lang="it"><title>Player test</title></html>',
    }),
  );
  await page.goto('/testimonianze');
  await expect(page.locator('[data-youtube]')).toHaveCount(13);
  await expect(page.locator('[data-youtube] iframe')).toHaveCount(0);
  const first = page.locator('[data-youtube] a').first();
  await first.focus();
  await first.press('Enter');
  await expect(page.locator('[data-youtube] iframe')).toHaveCount(1);
  await expect(page.locator('[data-youtube] a')).toHaveCount(12);
});

test('missing translations are not represented as equivalent pages', async ({
  page,
}) => {
  await page.goto('/informazioni/trasporto');
  const languages = await page
    .locator('link[rel=alternate]')
    .evaluateAll((nodes) => nodes.map((node) => node.getAttribute('hreflang')));
  expect(languages).not.toContain('hr');
  expect(languages).not.toContain('de');
  expect(languages).not.toContain('en');
  expect(languages).not.toContain('sl');
  await expect(
    page.locator('.language-switcher a[aria-disabled=true][href]'),
  ).toHaveCount(0);
});

test('inner-page content and FAQ remain available without JavaScript', async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  try {
    const page = await context.newPage();
    for (const route of [
      '/prestazioni-dentali',
      '/prestazioni/premium-ponte-fisso-su-impianti',
      '/faq',
      '/domande-e-risposte',
      '/testimonianze',
    ]) {
      await page.goto(`http://127.0.0.1:4321${route}`);
      await expect(page.locator('h1')).toBeVisible();
      expect(
        await page
          .locator('[data-reveal]')
          .evaluateAll((nodes) =>
            nodes.every((node) => getComputedStyle(node).opacity === '1'),
          ),
      ).toBe(true);
    }
    await page.goto('http://127.0.0.1:4321/faq');
    await page.locator('summary').first().focus();
    await page.keyboard.press('Enter');
    await expect(page.locator('details').first()).toHaveAttribute('open', '');
  } finally {
    await context.close();
  }
});

test('related services keep all four desktop columns and stack at the source breakpoint', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const width of [1440, 992, 991, 390]) {
    await page.setViewportSize({ width, height: 900 });
    for (const entry of innerPages.filter((entry) => entry.related.length)) {
      await page.goto(entry.route);
      await page.evaluate(() => document.fonts.ready);
      const cards = page.locator('.related-services .teaser-card');
      await expect(cards).toHaveCount(4);
      const boxes = await cards.evaluateAll((nodes) =>
        nodes.map((node) => node.getBoundingClientRect().toJSON()),
      );
      if (width >= 992) {
        expect(new Set(boxes.map((box) => box.y)).size).toBe(1);
      } else {
        expect(
          boxes.every((box, i) => !i || box.y >= boxes[i - 1].bottom + 39),
        ).toBe(true);
      }
    }
  }
});

test('package navigation retains the source icons and section targets', async ({
  page,
}) => {
  await page.goto('/prestazioni/corone-faccette-ponti-e-protesi');
  await expect(page.locator('.page-sidebar .item svg')).toHaveCount(4);
  await expect(
    page.locator('.page-sidebar a[href="#ponti_su_impianti"]'),
  ).toHaveCount(1);
  await expect(page.locator('#ponti_su_impianti')).toHaveCount(1);
});

test('directory cards preserve explicit mobile crops and the source arrow omission', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 900 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/prestazioni-dentali');
  const photos = page.locator('.mobile-photo img');
  await expect(photos.nth(1)).toHaveCSS('object-position', '80% 50%');
  await expect(photos.nth(3)).toHaveCSS('object-position', '80% 50%');
  await expect(photos.first()).toHaveCSS('object-position', '50% 50%');
  const cards = page.locator('.teaser-card');
  await expect(cards).toHaveCount(5);
  await expect(cards.last().locator('.arrow svg')).toHaveCount(0);
  await expect(cards.first().locator('.arrow')).toHaveCSS('width', '44px');
  await page.setViewportSize({ width: 480, height: 900 });
  await expect(photos.nth(1)).toHaveCSS('object-position', '100% 50%');
  await expect(cards.first().locator('.price')).toHaveCSS(
    'padding-top',
    '10px',
  );
  await page.goto('/');
  await expect(page.locator('.teaser-card .arrow').first()).toHaveCSS(
    'width',
    '40px',
  );
});
