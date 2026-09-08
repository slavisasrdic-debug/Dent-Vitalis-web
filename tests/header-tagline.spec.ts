import { test, expect } from '@playwright/test';

test('Croatian descriptor aligns to the logo at mobile and desktop breakpoints', async ({
  page,
}) => {
  test.setTimeout(90000);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => {
    if (['warning', 'error'].includes(message.type()))
      errors.push(message.text());
  });
  // Home uses brand typography; directory/legal variants otherwise inherit Arial.
  for (const route of ['/hr/', '/hr/usluge', '/hr/polica-privatnosti']) {
    for (const width of [390, 479, 480, 767, 768, 991, 992, 1280, 1440, 1920]) {
      await page.setViewportSize({ width, height: 900 });
      expect((await page.goto(route))?.status()).toBe(200);
      await page.evaluate(() => document.fonts.ready);
      await expect(page.locator('.brand span')).toHaveText('Stomatolog Rijeka');
      await expect(page.locator('.brand span')).toHaveCSS(
        'font-size',
        width < 992 ? '12px' : '13px',
      );
      await expect(page.locator('main')).toBeVisible();
      await expect(
        page.locator('astro-error-overlay,vite-error-overlay'),
      ).toHaveCount(0);
      const geometry = await page.locator('.brand').evaluate((brand) => {
        const span = brand.querySelector('span')!;
        const range = document.createRange();
        range.selectNodeContents(span);
        return {
          logo: brand.querySelector('img')!.getBoundingClientRect().toJSON(),
          text: range.getBoundingClientRect().toJSON(),
          textHeight: span.clientHeight,
          overflow: span.scrollWidth - span.clientWidth,
          font: getComputedStyle(span).fontFamily,
          tracking: getComputedStyle(span).letterSpacing,
        };
      });
      expect(geometry.logo.width).toBe(width < 992 ? 140 : 150);
      expect(Math.abs(geometry.text.left - geometry.logo.left)).toBeLessThan(1);
      expect(Math.abs(geometry.text.right - geometry.logo.right)).toBeLessThan(
        1,
      );
      expect(geometry.overflow).toBe(0);
      expect(geometry.textHeight).toBeLessThan(20);
      expect(geometry.font).toContain('Montserrat');
      expect(['normal', '0px']).toContain(geometry.tracking);
    }
  }
  expect(errors).toEqual([]);
  await page.goto('/hr/izbjeljivanje-zubi');
  await page.locator('.brand').focus();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/\/hr\/$/);
});

test('Italian logo descriptor keeps its existing text and typography', async ({
  page,
}) => {
  for (const width of [390, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    await expect(page.locator('.brand span')).toHaveText('Dentisti Croazia');
    await expect(page.locator('.brand span')).toHaveCSS('font-size', '14px');
    await expect(page.locator('.brand span')).toHaveCSS(
      'letter-spacing',
      width === 390 ? '0.375px' : '1px',
    );
    await expect(page.locator('.brand')).toHaveAttribute('href', '/');
  }
});
