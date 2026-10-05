import { expect, test } from '@playwright/test';
import { route as deRoute } from '../src/content/de/routes';
import { route as slRoute } from '../src/content/sl/routes';

const directories = [
  '/prestazioni-dentali',
  '/chi-siamo',
  '/informazioni-per-pazienti',
  '/hr/usluge',
  '/hr/o-nama',
  '/hr/informacije-za-pacijente',
  ...['services', 'about', 'information'].flatMap((id) => [
    `/en/${id}`,
    deRoute(id),
    slRoute(id),
  ]),
];
test.use({ contextOptions: { reducedMotion: 'reduce' } });

for (const route of directories) {
  test(`only directory intro expands above 991px: ${route}`, async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    expect((await page.goto(route))?.status()).toBe(200);
    await page.evaluate(() => document.fonts.ready);
    const hero = page.locator('.detail-hero.directory');
    await expect(hero.locator('h1')).toBeVisible();
    await expect(
      page.locator('astro-error-overlay,vite-error-overlay'),
    ).toHaveCount(0);
    const originalText = await hero.innerText();
    for (const width of [390, 991, 992, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      const layout = await hero.evaluate((element) => {
        const copy = element.querySelector('.hero-copy')!;
        const container = element.querySelector('.hero-container')!;
        return {
          copyWidth: copy.getBoundingClientRect().width,
          containerWidth: container.getBoundingClientRect().width,
          paddingRight: getComputedStyle(copy).paddingRight,
          overflow: document.documentElement.scrollWidth > innerWidth,
        };
      });
      expect(layout.copyWidth).toBeCloseTo(
        width >= 992
          ? Math.min(1000, layout.containerWidth)
          : layout.containerWidth,
        0,
      );
      if (width >= 992) expect(layout.paddingRight).toBe('0px');
      else expect(parseFloat(layout.paddingRight)).toBeCloseTo(width * 0.05, 0);
      expect(layout.overflow).toBe(false);
      expect(await hero.innerText()).toBe(originalText);
    }
    expect(errors).toEqual([]);
  });
}

test('detail photo, specialists and plain variants retain their existing widths', async ({
  page,
}) => {
  const details = [
    '/hr/proteza-na-4-implantata',
    '/hr/nasi-specijalisti',
    '/hr/polica-privatnosti',
    '/prestazioni/protesi-definitiva-ancorata-su-4-impianti',
    deRoute('four-implant-denture'),
    '/en/four-implant-denture',
    slRoute('four-implant-denture'),
  ];
  for (const route of details) {
    await page.goto(route);
    await page.evaluate(() => document.fonts.ready);
    for (const width of [390, 992, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      const layout = await page.locator('.detail-hero').evaluate((hero) => {
        const copy = hero.querySelector('.hero-copy')!;
        const container = hero.querySelector('.hero-container')!;
        return {
          directory: hero.classList.contains('directory'),
          textOnly: hero.classList.contains('text-only'),
          german: document.documentElement.lang === 'de',
          copyWidth: copy.getBoundingClientRect().width,
          containerWidth: container.getBoundingClientRect().width,
          paddingRight: getComputedStyle(copy).paddingRight,
        };
      });
      expect(layout.directory).toBe(false);
      const expectedWidth =
        width < 992
          ? layout.containerWidth
          : layout.german
            ? layout.containerWidth * 0.5
            : layout.textOnly
              ? Math.min(1000, layout.containerWidth)
              : layout.containerWidth * 0.45;
      expect(layout.copyWidth).toBeCloseTo(expectedWidth, 0);
      if (width >= 992)
        expect(layout.paddingRight).toBe(layout.german ? '40px' : '100px');
    }
  }
});

test('directory width is CSS-only and works with JavaScript disabled', async ({
  browser,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 1440, height: 900 },
  });
  const page = await context.newPage();
  try {
    await page.goto('http://127.0.0.1:4321/hr/usluge');
    await expect(page.locator('.detail-hero.directory .hero-copy')).toHaveCSS(
      'width',
      '1000px',
    );
    await expect(page.locator('.detail-hero .description')).toBeVisible();
  } finally {
    await context.close();
  }
});
