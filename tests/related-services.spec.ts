import { expect, test } from '@playwright/test';
import { readFileSync } from 'node:fs';

const source = JSON.parse(
  readFileSync('src/content/inner-pages-it.json', 'utf8'),
) as {
  route: string;
  title: string;
  directory: { href: string }[];
}[];
const italianRoutes = source
  .find((page) => page.route === '/prestazioni-dentali')!
  .directory.map((card) => card.href);
const translatedRoutes = new Map(
  readFileSync('data/hr-routes.proposed.csv', 'utf8')
    .trim()
    .split('\n')
    .slice(1)
    .map((line) => line.split(','))
    .filter((row) => row[4] === 'approved')
    .map((row) => [row[1]!, row[2]!]),
);
const widths = [
  320, 360, 390, 414, 478, 479, 480, 481, 766, 767, 768, 769, 990, 991, 992,
  993, 1199, 1200, 1201, 1279, 1280, 1281, 1439, 1440, 1441, 1500, 1600, 1919,
  1920, 1921, 2560,
];
const normalize = (text: string) => text.replace(/\s+/g, ' ').trim();
test.use({ contextOptions: { reducedMotion: 'reduce' } });

for (const lang of ['it', 'hr'] as const) {
  const routes =
    lang === 'it'
      ? italianRoutes
      : italianRoutes.map((route) => translatedRoutes.get(route)!);
  const directory = lang === 'it' ? '/prestazioni-dentali' : '/hr/usluge';
  for (const route of routes) {
    test(`${lang} ${route}: four other services, source copy and responsive geometry`, async ({
      page,
    }) => {
      test.setTimeout(90000);
      const errors: string[] = [];
      page.on('pageerror', (error) => errors.push(error.message));
      page.on('console', (message) => {
        if (['warning', 'error'].includes(message.type()))
          errors.push(message.text());
      });
      await page.goto(directory);
      const catalogue = await page
        .locator('.teaser-sequence.directory .teaser-card')
        .evaluateAll((cards) =>
          cards.map((card) => ({
            href: card.querySelector('h2 a')!.getAttribute('href'),
            title: card.querySelector('h2')!.textContent!,
            eyebrow: card.querySelector('.eyebrow')?.textContent ?? '',
            description: card.querySelector('.description')!.textContent!,
            price: card.querySelector('.price')?.textContent ?? '',
          })),
        );
      expect(catalogue).toHaveLength(5);
      expect((await page.goto(route))?.status()).toBe(200);
      await expect(page).toHaveURL(new RegExp(`${route}$`));
      await expect(page.locator('html')).toHaveAttribute('lang', lang);
      await expect(page.locator('main h1')).toHaveCount(1);
      if (lang === 'it')
        expect(await page.title()).toBe(
          source.find((page) => page.route === route)!.title,
        );
      else expect(await page.title()).toContain('DentVitalis');
      await expect(
        page.locator('astro-error-overlay,vite-error-overlay'),
      ).toHaveCount(0);
      await page.evaluate(() => document.fonts.ready);
      const section = page.locator('.related-services');
      const cards = section.locator('.teaser-card');
      await expect(cards).toHaveCount(4);
      const expected = catalogue.filter((card) => card.href !== route);
      expect(
        await section
          .locator('h3 a')
          .evaluateAll((links) =>
            links.map((link) => link.getAttribute('href')),
          ),
      ).toEqual(expected.map((card) => card.href));
      for (const [index, original] of expected.entries()) {
        const card = cards.nth(index);
        for (const [selector, text] of [
          ['h3', original.title],
          ['.eyebrow', original.eyebrow],
          ['.description', original.description],
          ['.price', original.price],
        ]) {
          expect(
            normalize(
              (await card.locator(selector!).count())
                ? await card.locator(selector!).innerText()
                : '',
            ),
          ).toBe(normalize(text!));
        }
      }
      for (const width of widths) {
        await page.setViewportSize({ width, height: 900 });
        await section.evaluate((section) =>
          window.scrollTo(
            0,
            section.getBoundingClientRect().top + scrollY - 170,
          ),
        );
        await page.evaluate(
          () =>
            new Promise<void>((resolve) =>
              requestAnimationFrame(() => resolve()),
            ),
        );
        const boxes = await cards.evaluateAll((cards) =>
          cards.map((card) => {
            const box = card.getBoundingClientRect();
            const heading = card.querySelector('h3')!;
            const contentOverflow = [
              ...card.querySelectorAll('h3,.eyebrow,.description,.price'),
            ].some((node) => {
              const range = document.createRange();
              range.selectNodeContents(node);
              const bounds = node.getBoundingClientRect();
              return [...range.getClientRects()].some(
                (rect) =>
                  rect.left < bounds.left - 1 || rect.right > bounds.right + 1,
              );
            });
            return {
              x: box.x,
              y: box.y,
              width: box.width,
              height: box.height,
              bottom: box.bottom,
              overflow: card.scrollWidth - card.clientWidth,
              contentOverflow,
              headingLines: Math.round(
                heading.getBoundingClientRect().height /
                  parseFloat(getComputedStyle(heading).lineHeight),
              ),
            };
          }),
        );
        const alignment = await page.evaluate(() => {
          const related = document
            .querySelector('.related-container')!
            .getBoundingClientRect();
          const content = document
            .querySelector('.editorial-container')!
            .getBoundingClientRect();
          return {
            left: related.left - content.left,
            right: related.right - content.right,
          };
        });
        expect(
          Math.abs(alignment.left),
          `${width}px left page margin`,
        ).toBeLessThan(1);
        expect(
          Math.abs(alignment.right),
          `${width}px right page margin`,
        ).toBeLessThan(1);
        const columns = width >= 992 ? 2 : 1;
        expect(
          new Set(boxes.map((box) => Math.round(box.y))).size,
          `${width}px rows`,
        ).toBe(4 / columns);
        expect(
          new Set(boxes.map((box) => Math.round(box.x))).size,
          `${width}px columns`,
        ).toBe(columns);
        for (const [index, box] of boxes.entries()) {
          expect(
            box.overflow,
            `${width}px card ${index} overflow`,
          ).toBeLessThanOrEqual(1);
          expect(
            box.contentOverflow,
            `${width}px card ${index} text overflow`,
          ).toBe(false);
          expect(box.x).toBeGreaterThanOrEqual(0);
          expect(box.x + box.width).toBeLessThanOrEqual(width + 1);
          if (columns > 1) {
            expect(box.width).toBeGreaterThanOrEqual(369);
            expect(
              box.headingLines,
              `${width}px card ${index} heading lines`,
            ).toBeLessThanOrEqual(4);
          }
          if (index >= columns)
            expect(
              box.y - boxes[index - columns]!.bottom,
            ).toBeGreaterThanOrEqual(39);
        }
        expect(
          await page.evaluate(
            () => document.documentElement.scrollWidth - innerWidth,
          ),
          `${width}px document overflow`,
        ).toBe(0);
      }
      // The newly included service is a real native link, not a decorative card.
      const target = section.locator('h3 a').last();
      const href = await target.getAttribute('href');
      await target.focus();
      await page.keyboard.press('Enter');
      await expect(page).toHaveURL(new RegExp(`${href}$`));
      await expect(page.locator('.related-services .teaser-card')).toHaveCount(
        4,
      );
      expect(errors).toEqual([]);
    });
  }
}

test('all four related services remain available without JavaScript', async ({
  browser,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 844 },
  });
  const page = await context.newPage();
  for (const route of [
    '/hr/svjesna-sedacija',
    '/prestazioni/sedazione-cosciente',
  ]) {
    await page.goto('http://127.0.0.1:4321' + route);
    const cards = page.locator('.related-services .teaser-card');
    await expect(cards).toHaveCount(4);
    for (const card of await cards.all()) await expect(card).toBeVisible();
    const link = cards.first().locator('h3 a');
    const href = await link.getAttribute('href');
    await link.click();
    await expect(page).toHaveURL(new RegExp(`${href}$`));
  }
  await context.close();
});
