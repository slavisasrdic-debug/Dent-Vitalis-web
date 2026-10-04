import { test, expect } from '@playwright/test';

const galleries = [
  '/galleria',
  '/hr/galerija',
  '/de/galerie',
  '/en/gallery',
  '/si/galerija',
];

test('every gallery language points to the approved Italian Galleria URL', async ({
  page,
}) => {
  for (const route of galleries) {
    expect((await page.goto(route))?.status()).toBe(200);
    await expect(
      page.locator('link[rel=alternate][hreflang=it]'),
    ).toHaveAttribute('href', 'https://www.dentvitalis.com/galleria');
    await expect(
      page.locator('[data-language].desktop a[lang=it]'),
    ).toHaveAttribute('href', '/galleria');
    await expect(page.locator('[data-comparison]')).toHaveCount(15);
    expect(await page.locator('a[href*="domande-e-risposte"]').count()).toBe(0);
  }
});

for (const width of [1440, 390]) {
  test(`navigation click opens Galleria with working comparison at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    page.on('console', (message) => {
      if (message.type() === 'error') errors.push(message.text());
    });
    await page.goto('/');
    // The footer is the same real navigation flow at desktop and mobile.
    const link = page.locator('footer a[href="/galleria"]').first();
    await link.click();
    await expect(page).toHaveURL(/\/galleria$/);
    await expect(page.locator('h1')).toHaveText('Galleria');
    await expect(
      page.locator('astro-error-overlay, vite-error-overlay'),
    ).toHaveCount(0);
    const first = page.locator('[data-comparison-ready]').first();
    await first.scrollIntoViewIfNeeded();
    await first.getByRole('button', { name: 'Dopo', exact: true }).click();
    await expect(first.getByRole('slider')).toHaveValue('0');
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth - innerWidth,
      ),
    ).toBe(0);
    expect(errors).toEqual([]);
    await page.screenshot({
      path: `/tmp/dentvitalis-galleria-v8-${width}.png`,
    });
  });
}
