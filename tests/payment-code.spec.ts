import { test, expect } from '@playwright/test';
import { paymentPayload } from '../src/content/payment-code';

test('static SEPA payload is pinned and has no amount or redirect', () => {
  expect(paymentPayload).toBe(
    'BCD\n002\n1\nSCT\nESBCHR22\nDentvitalis Fides d.o.o.\nHR1424020061100858111\n\n\n\nPonuda/Preventivo',
  );
  expect(paymentPayload.split('\n')[7]).toBe('');
  expect(paymentPayload).not.toMatch(/https?:|www\.|EUR0/);
});
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
      await expect(section).toContainText('Dentvitalis Fides d.o.o.');
      await expect(section).toContainText('HR1424020061100858111');
      await expect(section).toContainText('ESBCHR22');
      await expect(section.locator('a,script,iframe')).toHaveCount(0);
      await expect(
        page.locator('img[src*="codice-pagamento-bonifico"]'),
      ).toHaveCount(0);
      const src = await section.locator('img').getAttribute('src');
      expect(src).toMatch(/^data:image\/svg\+xml;base64,/);
      if (imageSource) expect(src).toBe(imageSource);
      imageSource = src;
      expect(
        await section
          .locator('img')
          .evaluate((img) => (img as HTMLImageElement).naturalWidth),
      ).toBe(256);
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
