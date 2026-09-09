import { test, expect } from '@playwright/test';
import { createHash } from 'node:crypto';

const iconPath = '/assets/images/favicon.ico';
const sourceHash =
  '47de59c5d0ac6e97ec3c58885f38f2334ccc04f16497c00b860aa04ffdc251db';

test('favicon is the unchanged icon from the public DentVitalis site', async ({
  request,
}) => {
  const response = await request.get(iconPath);
  expect(response.status()).toBe(200);
  expect(response.headers()['content-type']).toMatch(/^image\//);
  const bytes = await response.body();
  expect(createHash('sha256').update(bytes).digest('hex')).toBe(sourceHash);
  expect([...bytes.subarray(0, 8)]).toEqual([0, 0, 1, 0, 1, 0, 16, 16]);
});

for (const width of [390, 1440]) {
  test(`favicon survives navigation and refresh at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    page.on('console', (message) => {
      if (message.type() === 'error') errors.push(message.text());
    });
    for (const path of ['/hr/', '/', '/hr/kontakt', '/contatti', '/404']) {
      await page.goto(path);
      await expect(page).toHaveTitle(/DentVitalis/i);
      await expect(page.locator('main h1')).toBeVisible();
      await expect(page.locator('vite-error-overlay')).toHaveCount(0);
      const icon = page.locator('head link[rel="icon"]');
      await expect(icon).toHaveCount(1);
      await expect(icon).toHaveAttribute('href', iconPath);
      await expect(icon).toHaveAttribute('sizes', '16x16');
      const dimensions = await page.evaluate(async () => {
        const href =
          document.querySelector<HTMLLinkElement>('link[rel="icon"]')!.href;
        const image = new Image();
        image.src = href;
        await image.decode();
        return [image.naturalWidth, image.naturalHeight];
      });
      expect(dimensions).toEqual([16, 16]);
    }
    await page.getByRole('link', { name: 'Povratak na naslovnicu' }).click();
    await expect(page).toHaveURL(/\/hr\/?$/);
    await page.reload();
    await expect(page.locator('head link[rel="icon"]')).toHaveAttribute(
      'href',
      iconPath,
    );
    // The standalone 404 intentionally returns HTTP 404; browsers may log it.
    expect(errors.filter((error) => !error.includes('404'))).toEqual([]);
  });
}
