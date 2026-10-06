import { test, expect } from '@playwright/test';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import sharp from 'sharp';
import { blockElfsight } from './helpers/elfsight';
test.beforeEach(async ({ page }) => blockElfsight(page));

const iconPath = '/assets/images/favicon-blue-triangle.ico';
const svgPath = '/assets/images/dentvitalis-mark-blue-triangle.svg';
const sourceHash =
  '47de59c5d0ac6e97ec3c58885f38f2334ccc04f16497c00b860aa04ffdc251db';

test('favicon has the approved blue triangle and green V; original icon remains', async ({
  request,
}) => {
  const response = await request.get(iconPath);
  expect(response.status()).toBe(200);
  expect(response.headers()['content-type']).toMatch(/^image\//);
  const bytes = await response.body();
  expect([...bytes.subarray(0, 8)]).toEqual([0, 0, 1, 0, 3, 0, 16, 16]);
  for (const [index, size] of [16, 32, 48].entries()) {
    const length = bytes.readUInt32LE(6 + index * 16 + 8);
    const offset = bytes.readUInt32LE(6 + index * 16 + 12);
    const metadata = await sharp(
      bytes.subarray(offset, offset + length),
    ).metadata();
    expect([metadata.width, metadata.height]).toEqual([size, size]);
  }
  const svg = await request.get(svgPath);
  expect(svg.status()).toBe(200);
  expect(await svg.text()).toContain(
    'style="fill:#056c7a; fill-rule:evenodd;"',
  );
  expect(await svg.text()).toContain('style="fill:#afbc36;"');
  const old = await request.get('/assets/images/favicon.ico');
  expect(
    createHash('sha256')
      .update(await old.body())
      .digest('hex'),
  ).toBe(sourceHash);
  expect(await svg.body()).toEqual(readFileSync('public' + svgPath));
});

for (const width of [390, 1440]) {
  test(`favicon survives navigation and refresh at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    for (const path of ['/hr/', '/', '/hr/kontakt', '/contatti', '/404']) {
      await page.goto(path);
      await expect(page).toHaveTitle(/DentVitalis/i);
      await expect(page.locator('main h1')).toBeVisible();
      await expect(page.locator('vite-error-overlay')).toHaveCount(0);
      await expect(page.locator('head link[rel="icon"]')).toHaveCount(2);
      const icon = page.locator('head link[rel="icon"][type="image/x-icon"]');
      await expect(icon).toHaveAttribute('href', iconPath);
      await expect(icon).toHaveAttribute('sizes', '16x16 32x32 48x48');
      await expect(
        page.locator('head link[rel="icon"][type="image/svg+xml"]'),
      ).toHaveAttribute('href', svgPath);
      const dimensions = await page.evaluate(async () => {
        const href = document.querySelector<HTMLLinkElement>(
          'link[rel="icon"][type="image/svg+xml"]',
        )!.href;
        const image = new Image();
        image.src = href;
        await image.decode();
        return [image.naturalWidth, image.naturalHeight];
      });
      expect(dimensions).toEqual([512, 512]);
    }
    await page.getByRole('link', { name: 'Povratak na naslovnicu' }).click();
    await expect(page).toHaveURL(/\/hr\/?$/);
    await page.reload();
    await expect(
      page.locator('head link[rel="icon"][type="image/x-icon"]'),
    ).toHaveAttribute('href', iconPath);
    // The standalone 404 intentionally returns HTTP 404; browsers may log it.
    expect(errors.filter((error) => !error.includes('404'))).toEqual([]);
  });
}
