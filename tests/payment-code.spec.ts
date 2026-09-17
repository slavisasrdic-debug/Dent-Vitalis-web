import { test, expect } from '@playwright/test';
import { paymentImage } from '../src/content/payment-code';

for (const width of [320, 390, 1440]) {
  test(`both payment languages expose the same inert code at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    const errors: string[] = [];
    page.on('pageerror', (e) => errors.push(e.message));
    let imageSource: string | null = null;
    for (const route of [
      '/hr/placanje',
      '/informazioni/pagamento-flessibile',
    ]) {
      expect((await page.goto(route))?.status()).toBe(200);
      await page.evaluate(() => document.fonts.ready);
      const section = page.locator('.payment-code');
      await expect(section).toHaveCount(1);
      await expect(section).not.toContainText('SEPA');
      await expect(page.locator('main')).toContainText('ESBCHR22');
      await expect(section.locator('a,script,iframe')).toHaveCount(0);
      await expect(
        page.locator('img[src*="codice-pagamento-bonifico"]'),
      ).toHaveCount(1);
      const src = await section.locator('img').getAttribute('src');
      expect(src).toBe(paymentImage);
      await section.locator('img').scrollIntoViewIfNeeded();
      await expect
        .poll(() =>
          section
            .locator('img')
            .evaluate((img) => (img as HTMLImageElement).naturalWidth),
        )
        .toBe(512);
      if (imageSource) expect(src).toBe(imageSource);
      imageSource = src;
      expect(
        await section
          .locator('img')
          .evaluate((img) => (img as HTMLImageElement).naturalWidth),
      ).toBe(512);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
    }
    expect(errors).toEqual([]);
  });
}
test('hero prices separate the amount and euro sign in both languages', async ({
  page,
}) => {
  for (const route of ['/', '/hr/']) {
    await page.goto(route);
    await expect(page.locator('#home-title strong')).toContainText(/4\.990\s€/);
  }
});

test('home and directory prices use the larger cjenik typography in both languages', async ({
  page,
}) => {
  for (const route of ['/', '/hr/', '/prestazioni-dentali/', '/hr/usluge/']) {
    await page.goto(route);
    for (const selector of [
      '.teaser-card.home .price',
      '.teaser-card.directory .price',
    ]) {
      const prices = page.locator(selector);
      if (await prices.count()) {
        await expect(prices.first()).toHaveCSS('font-size', '22px');
        await expect(prices.first()).toHaveCSS('font-weight', '500');
      }
    }
  }
});

test('home and directory card typography stays identical in both languages', async ({
  page,
}) => {
  for (const route of ['/', '/hr/', '/prestazioni-dentali/', '/hr/usluge/']) {
    await page.goto(route);
    const cards = page.locator('.teaser-card.service.home, .teaser-card.service.directory');
    if (!(await cards.count())) continue;
    const styles = await cards.first().evaluate((card) =>
      ['h2, h3', '.description', '.price'].map((selector) => {
        const el = card.querySelector(selector);
        if (!(el instanceof Element)) return null;
        const style = getComputedStyle(el);
        return [
          style.fontFamily,
          style.fontSize,
          style.fontWeight,
          style.lineHeight,
        ];
      }),
    );
    expect(styles[0]?.[0]).toContain('Montserrat');
    expect(styles[0]?.[1]).toBe('28px');
    expect(styles[0]?.[2]).toBe('700');
    expect(styles[1]?.slice(0, 3)).toEqual([styles[0]?.[0], '18px', '400']);
    expect(styles[2]?.slice(0, 3)).toEqual([styles[0]?.[0], '22px', '500']);
  }
});
