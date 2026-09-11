import { expect, test } from '@playwright/test';

for (const route of ['/', '/hr/', '/faq/', '/hr/faq/']) {
  for (const width of [390, 820, 1440]) {
    test(`FAQ start remains below fixed chrome: ${route} ${width}`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.emulateMedia({ reducedMotion: 'reduce' });
      const errors: string[] = [];
      page.on('pageerror', (e) => errors.push(e.message));
      await page.goto(route, { waitUntil: 'domcontentloaded' });
      const summaries = page.locator('.faq-item summary');
      await summaries.nth(0).click();
      await page.waitForTimeout(100);
      const second = summaries.nth(1);
      await second.evaluate((e) =>
        window.scrollTo({
          top: window.scrollY + e.getBoundingClientRect().top - 350,
          behavior: 'instant',
        }),
      );
      await second.click();
      await expect(second.locator('..')).toHaveAttribute('open', '');
      await expect
        .poll(async () =>
          second.evaluate(
            (e) =>
              e.getBoundingClientRect().top -
              parseFloat(
                getComputedStyle(document.documentElement).scrollPaddingTop,
              ),
          ),
        )
        .toBeGreaterThanOrEqual(-1);
      await expect(second).toBeInViewport();
      const position = await page.evaluate(() => window.scrollY);
      await second.click();
      await page.waitForTimeout(100);
      expect(
        Math.abs((await page.evaluate(() => window.scrollY)) - position),
      ).toBeLessThan(2);
      expect(errors).toEqual([]);
    });
  }
}

test('animated collapse and keyboard opening keep FAQ start visible', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/hr/faq/');
  const items = page.locator('.faq-item summary');
  await items.nth(0).click();
  await page.waitForTimeout(900);
  const next = items.nth(1);
  await next.focus();
  await next.evaluate((e) =>
    window.scrollTo({
      top: window.scrollY + e.getBoundingClientRect().top - 350,
      behavior: 'instant',
    }),
  );
  await page.keyboard.press('Enter');
  await expect
    .poll(async () =>
      next.evaluate(
        (e) =>
          e.getBoundingClientRect().top -
          parseFloat(
            getComputedStyle(document.documentElement).scrollPaddingTop,
          ),
      ),
    )
    .toBeGreaterThanOrEqual(-1);
  await page.waitForTimeout(900);
  await expect(next).toBeFocused();
  expect(
    await next.evaluate((e) => e.getBoundingClientRect().top),
  ).toBeGreaterThan(100);
  await page.keyboard.press('Escape');
  await expect(next.locator('..')).not.toHaveAttribute('open', '');
});

test('an already visible FAQ start does not trigger scrolling', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/hr/faq/');
  const first = page.locator('.faq-item summary').first();
  await first.evaluate((e) =>
    window.scrollTo({
      top: window.scrollY + e.getBoundingClientRect().top - 250,
      behavior: 'instant',
    }),
  );
  const before = await page.evaluate(() => window.scrollY);
  await first.click();
  await page.waitForTimeout(150);
  expect(await page.evaluate(() => window.scrollY)).toBe(before);
});
