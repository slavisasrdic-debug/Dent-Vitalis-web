import { expect, test } from '@playwright/test';

const cases = [
  {
    route: '/hr/kako-do-nas',
    label: 'Lokacija parkirališta',
    href: 'https://share.google/71jvli5wQ7ylYdd8N',
  },
  {
    route: '/su-di-noi/come-raggiungerci',
    label: 'Posizione del parcheggio',
    href: 'https://share.google/TJtLAKAVtTdLcpCDF',
  },
];

for (const entry of cases) {
  test(`parking label fits and keeps the original destination: ${entry.route}`, async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.emulateMedia({ reducedMotion: 'reduce' });
    expect((await page.goto(entry.route))?.status()).toBe(200);
    await expect(page).toHaveTitle(/DentVitalis/i);
    await expect(page.locator('main h1')).toBeVisible();
    await expect(
      page.locator('astro-error-overlay,vite-error-overlay'),
    ).toHaveCount(0);
    await page.evaluate(() => document.fonts.ready);
    const link = page.getByRole('link', { name: entry.label, exact: true });
    await expect(link).toHaveCount(1);
    await expect(link).toHaveAttribute('href', entry.href);
    await expect(page.locator('main')).not.toContainText(
      'https://share.google/',
    );
    for (const width of [320, 390, 479, 767, 991, 992, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      await link.scrollIntoViewIfNeeded();
      const geometry = await link.evaluate((element) => {
        const bounds = element.getBoundingClientRect();
        const parent = element.closest('p')!.getBoundingClientRect();
        return {
          left: bounds.left - parent.left,
          right: parent.right - bounds.right,
          overflow: document.documentElement.scrollWidth - innerWidth,
          underline: getComputedStyle(element).textDecorationLine,
        };
      });
      expect(geometry.left, `${width}px left`).toBeGreaterThanOrEqual(-1);
      expect(geometry.right, `${width}px right`).toBeGreaterThanOrEqual(-1);
      expect(geometry.overflow, `${width}px overflow`).toBe(0);
      expect(geometry.underline).toContain('underline');
    }
    await link.focus();
    await expect(link).toBeFocused();
    // Verify native navigation without calling Google or any clinic endpoint.
    await page.route(entry.href, (route) =>
      route.fulfill({ contentType: 'text/plain', body: 'Parking link test' }),
    );
    await link.press('Enter');
    await expect(page).toHaveURL(entry.href);
    expect(errors).toEqual([]);
  });

  test(`parking link works without JavaScript: ${entry.route}`, async ({
    browser,
  }) => {
    const context = await browser.newContext({
      javaScriptEnabled: false,
      viewport: { width: 390, height: 900 },
    });
    try {
      const page = await context.newPage();
      await page.goto(`http://127.0.0.1:4321${entry.route}`);
      const link = page.getByRole('link', { name: entry.label, exact: true });
      await expect(link).toBeVisible();
      await expect(link).toHaveAttribute('href', entry.href);
    } finally {
      await context.close();
    }
  });
}
