import { expect, test } from '@playwright/test';

const routes = [
  '/prestazioni-dentali',
  '/chi-siamo',
  '/informazioni-per-pazienti',
  '/hr/usluge',
  '/hr/o-nama',
  '/hr/informacije-za-pacijente',
];
test.use({ contextOptions: { reducedMotion: 'reduce' } });
for (const route of routes) {
  test(`directory card alignment and full-width photographs: ${route}`, async ({
    page,
  }) => {
    await page.goto(route);
    await page.evaluate(() => document.fonts.ready);
    const cards = page.locator('.teaser-sequence.directory .teaser-card');
    for (const width of [
      390, 991, 992, 993, 1200, 1280, 1439, 1440, 1441, 1894, 1920, 2560,
    ]) {
      await page.setViewportSize({ width, height: 900 });
      if (width < 992) {
        await expect(page.locator('.image-column')).toBeHidden();
        await expect(page.locator('.mobile-photo').first()).toBeVisible();
        continue;
      }
      await page.evaluate(() => scrollTo(0, 0));
      const geometry = await page.evaluate(() => ({
        brand: document
          .querySelector('.brand')!
          .getBoundingClientRect()
          .toJSON(),
        card: document
          .querySelector('.teaser-sequence.directory .teaser-card')!
          .getBoundingClientRect()
          .toJSON(),
        image: document
          .querySelector('[data-image-index="0"] img')!
          .getBoundingClientRect()
          .toJSON(),
      }));
      expect(
        Math.abs(geometry.brand.left - geometry.card.left),
        `${width}px card gutter`,
      ).toBeLessThan(1);
      expect(geometry.card.width).toBeCloseTo(
        width >= 1440 ? 560 : Math.min(width * 0.45, 540),
        0,
      );
      expect(
        Math.abs(geometry.image.left),
        `${width}px full-bleed left`,
      ).toBeLessThan(1);
      expect(
        Math.abs(geometry.image.right - width),
        `${width}px full-bleed right`,
      ).toBeLessThan(1);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth - innerWidth,
        ),
      ).toBe(0);
    }
    await page.setViewportSize({ width: 1440, height: 900 });
    await cards
      .nth(1)
      .evaluate((card) =>
        scrollTo(
          0,
          card.getBoundingClientRect().top + scrollY - innerHeight + 100,
        ),
      );
    await expect(page.locator('[data-image-index="1"]')).toHaveCSS(
      'opacity',
      '1',
    );
    await expect(page.locator('[data-image-index="0"]')).toHaveCSS(
      'opacity',
      '0',
    );
    await page.evaluate(() => scrollTo(0, 0));
    await expect(page.locator('[data-image-index="0"]')).toHaveCSS(
      'opacity',
      '1',
    );
  });
}

for (const width of [992, 1440, 1920]) {
  test(`directory geometry does not change when delayed JavaScript starts at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    let release!: () => void;
    const gate = new Promise<void>((resolve) => {
      release = resolve;
    });
    await page.route('**/*', async (route) => {
      if (route.request().resourceType() === 'script') await gate;
      await route.continue();
    });
    try {
      await page.goto('/hr/usluge', { waitUntil: 'commit' });
      const card = page
        .locator('.teaser-sequence.directory .teaser-card')
        .first();
      await card.waitFor({ state: 'attached' });
      // WebKit holds FontFaceSet.ready until deferred scripts finish. This
      // directory uses system Arial, so wait for its actual CSS, not page load.
      await expect(card).toHaveCSS('padding-top', '60px');
      await expect(card.locator('h2')).toHaveCSS('font-size', '28px');
      const before = await card.boundingBox();
      expect(before!.width).toBeCloseTo(
        width >= 1440 ? 560 : Math.min(width * 0.45, 540),
        0,
      );
      release();
      await page.waitForLoadState('load');
      await expect(page.locator('.teaser-sequence.directory')).toHaveAttribute(
        'data-ready',
        'true',
      );
      expect(await card.boundingBox()).toEqual(before);
      await expect(page.locator('[data-image-index="0"]')).toHaveCSS(
        'opacity',
        '1',
      );
    } finally {
      release();
    }
  });
}
