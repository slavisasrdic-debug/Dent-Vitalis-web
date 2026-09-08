import { expect, test } from '@playwright/test';
import { readFileSync } from 'node:fs';
import sharp from 'sharp';

test.use({ contextOptions: { reducedMotion: 'reduce' } });
const italian = JSON.parse(
  readFileSync('src/content/inner-pages-it.json', 'utf8'),
) as { route: string }[];
const croatian = readFileSync('data/hr-routes.proposed.csv', 'utf8')
  .trim()
  .split('\n')
  .slice(1)
  .map((line) => line.split(','));
const routes = [
  '/',
  ...italian.map((page) => page.route),
  ...croatian.filter((row) => row[4] === 'approved').map((row) => row[2]!),
];
const logoPath = '/assets/images/Dentvitalis-logo-color_21200px.svg';

for (const width of [390, 1440]) {
  test(`inline logos survive blocked image requests and keep exact artwork at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    const requested: string[] = [];
    page.on('request', (request) => {
      if (request.url().includes(logoPath)) requested.push(request.url());
    });
    await page.route(`**${logoPath}`, (route) => route.abort());
    await page.goto('/hr/informacije-za-pacijente');
    await page.evaluate(() => document.fonts.ready);
    await page.reload();
    await page.evaluate(() => document.fonts.ready);
    for (const selector of ['.brand', '.footer-brand']) {
      const brand = page.locator(selector);
      const logo = brand.locator('[data-brand-logo]');
      const original = readFileSync('public' + logoPath, 'utf8');
      await expect(
        brand.getByRole('img', { name: 'DentVitalis', exact: true }),
      ).toHaveCount(1);
      if (selector === '.brand') {
        await expect(logo).toHaveAttribute('viewBox', '0 0 153.82 22.67');
        await expect(logo.locator('path,polygon')).toHaveCount(12);
      } else {
        await expect(logo).toHaveAttribute(
          'src',
          `data:image/svg+xml,${encodeURIComponent(original)}`,
        );
      }
      await expect(logo.locator('[id]')).toHaveCount(0);
      await brand.scrollIntoViewIfNeeded();
      const beforeRect = await brand.boundingBox();
      const inline = await brand.screenshot();
      // Compare against the unmodified source SVG in the previous <img> layout.
      await logo.evaluate(
        (svg, { original, isHeader }) => {
          const img = document.createElement('img');
          img.src = 'data:image/svg+xml,' + encodeURIComponent(original);
          img.width = isHeader ? 150 : 140;
          img.alt = svg.getAttribute('aria-label') ?? svg.getAttribute('alt')!;
          img.style.cssText = isHeader
            ? 'display:block;width:100%;height:30px;max-width:100%'
            : 'display:inline-block;vertical-align:middle;height:auto;max-width:100%';
          svg.replaceWith(img);
          return img.decode();
        },
        { original, isHeader: selector === '.brand' },
      );
      expect(await brand.boundingBox()).toEqual(beforeRect);
      const external = await brand.screenshot();
      const pixels = (buffer: Buffer) =>
        sharp(buffer).ensureAlpha().raw().toBuffer();
      expect((await pixels(inline)).equals(await pixels(external))).toBe(true);
    }
    expect(requested).toEqual([]);
  });
}

for (const viewport of [
  { width: 390, height: 900 },
  { width: 1920, height: 1080 },
]) {
  test(`all IT/HR first-screen photographs are eager at ${viewport.width}px`, async ({
    page,
  }) => {
    test.setTimeout(90000);
    await page.setViewportSize(viewport);
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    page.on('console', (message) => {
      if (['error', 'warning'].includes(message.type()))
        errors.push(message.text());
    });
    expect(routes).toHaveLength(55);
    for (const route of routes) {
      expect((await page.goto(route))?.status()).toBe(200);
      await page.evaluate(() => document.fonts.ready);
      await expect(page.locator('main h1')).toHaveCount(1);
      await expect(
        page.locator('astro-error-overlay,vite-error-overlay'),
      ).toHaveCount(0);
      const lazy = await page
        .locator('main img[loading="lazy"]')
        .evaluateAll((images) =>
          images
            .filter((image) => {
              const bounds = image.getBoundingClientRect();
              // Later stacked photographs are occluded by the initial photograph.
              const layer = image.closest<HTMLElement>('[data-image-index]');
              return (
                bounds.width > 0 &&
                bounds.height > 0 &&
                bounds.top < innerHeight &&
                bounds.bottom > 0 &&
                image.checkVisibility({
                  opacityProperty: true,
                  visibilityProperty: true,
                }) &&
                (!layer || layer.dataset.imageIndex === '0')
              );
            })
            .map((image) => image.getAttribute('src')),
        );
      expect(lazy, `${route} first screen`).toEqual([]);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth - innerWidth,
        ),
      ).toBe(0);
      await expect(page.locator('[data-brand-logo]')).toHaveCount(2);
    }
    expect(errors).toEqual([]);
  });
}

for (const width of [390, 991, 992, 1440]) {
  test(`eager art direction downloads only the active first photograph at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    const requested: string[] = [];
    page.on('request', (request) =>
      requested.push(new URL(request.url()).pathname),
    );
    await page.goto('/hr/o-nama');
    const mobile = page.locator('.mobile-photo img').first();
    const desktop = page.locator('[data-image-index="0"] img');
    const active = width < 992 ? mobile : desktop;
    const inactive = width < 992 ? desktop : mobile;
    await expect(active).toHaveAttribute('loading', 'eager');
    expect(
      await active.evaluate((image: HTMLImageElement) => image.currentSrc),
    ).toContain('/assets/images/');
    expect(
      await inactive.evaluate((image: HTMLImageElement) => image.currentSrc),
    ).toMatch(/^data:image\/svg\+xml,/);
    const inactiveSources = await inactive.evaluate((image) => [
      image.getAttribute('src')!,
      ...image
        .getAttribute('srcset')!
        .split(',')
        .map((candidate) => candidate.trim().split(' ')[0]!),
    ]);
    expect(requested.filter((url) => inactiveSources.includes(url))).toEqual(
      [],
    );
    for (const next of [
      page.locator('.mobile-photo img').nth(1),
      page.locator('[data-image-index="1"] img'),
    ])
      await expect(next).toHaveAttribute('loading', 'lazy');
    await page.setViewportSize({
      width: width < 992 ? 1440 : 390,
      height: 900,
    });
    await expect
      .poll(() =>
        inactive.evaluate((image: HTMLImageElement) => image.currentSrc),
      )
      .toContain('/assets/images/');
  });
}

test('only the leading testimonial poster is eager; no YouTube player is preloaded', async ({
  page,
}) => {
  for (const route of ['/testimonianze', '/hr/iskustva-pacijenata']) {
    await page.goto(route);
    const posters = page.locator('[data-youtube] img');
    await expect(posters).toHaveCount(13);
    await expect(posters.first()).toHaveAttribute('loading', 'eager');
    for (const poster of (await posters.all()).slice(1))
      await expect(poster).toHaveAttribute('loading', 'lazy');
    await expect(page.locator('iframe[src*=youtube]')).toHaveCount(0);
  }
});

test('logos and the first directory photograph work without JavaScript', async ({
  browser,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 1440, height: 900 },
  });
  const page = await context.newPage();
  await page.route(`**${logoPath}`, (route) => route.abort());
  await page.goto('/chi-siamo');
  await expect(page.locator('.brand [data-brand-logo]')).toBeVisible();
  await expect(page.locator('[data-image-index="0"] img')).toHaveAttribute(
    'loading',
    'eager',
  );
  const ids = await page
    .locator('[id]')
    .evaluateAll((nodes) => nodes.map((node) => node.id));
  expect(new Set(ids).size).toBe(ids.length);
  await context.close();
});
