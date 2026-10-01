import { expect, test } from '@playwright/test';
import { googleReviewsUrl } from '../data/site';

for (const route of ['/', '/hr', '/de', '/en', '/si']) {
  test(`${route} Google badge selects the owner-approved Dentvitalis profile`, async ({
    page,
  }) => {
    await page.goto(route);
    const badge = page.locator('.hero a.google');
    await expect(badge).toBeVisible();
    await expect(badge).toHaveAttribute('href', googleReviewsUrl);
    await expect(badge).toHaveAttribute('target', '_blank');
    await expect(badge).toHaveAttribute('rel', 'noopener');
    expect(googleReviewsUrl).toContain(
      '!1s0x4764a128f2aa4cd5:0xbe8e3fecfb0c2d31!',
    );
    await expect
      .poll(() =>
        badge
          .locator('img')
          .evaluate((image) => (image as HTMLImageElement).naturalWidth),
      )
      .toBeGreaterThan(0);
  });
}

for (const viewport of [
  { width: 1440, height: 900 },
  { width: 390, height: 844 },
]) {
  test(`Google badge opens the exact profile in a new tab at ${viewport.width}px`, async ({
    page,
    context,
  }) => {
    await page.setViewportSize(viewport);
    // Confirm the native click destination without making Google traffic part of QA.
    await context.route('https://www.google.com/maps/**', (route) =>
      route.fulfill({
        contentType: 'text/html',
        body: '<title>Google destination intercepted</title>',
      }),
    );
    await page.goto('/');
    const popupPromise = page.waitForEvent('popup');
    await page.locator('.hero a.google').click();
    const popup = await popupPromise;
    await popup.waitForLoadState();
    expect(popup.url()).toBe(googleReviewsUrl);
    await popup.close();
  });
}
