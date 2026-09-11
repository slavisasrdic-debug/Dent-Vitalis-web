import { expect, test } from '@playwright/test';

for (const width of [390, 1440]) {
  test(`Croatian treatment booking contacts at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.goto('/hr/kontakt/');
    await expect(page.locator('h1')).toHaveText('Kontakti');
    const card = page
      .locator('.contact-card')
      .filter({ hasText: 'Termini za liječenje i kontrole' });
    await card.scrollIntoViewIfNeeded();
    for (const [label, href] of [
      ['+385 51 688 381', 'tel:+38551688381'],
      ['booking@dentvitalis.com', 'mailto:booking@dentvitalis.com'],
      ['+385 91 912 2071', 'https://wa.me/385919122071'],
    ]) {
      await expect(
        card.getByRole('link', { name: label, exact: true }),
      ).toHaveAttribute('href', href);
    }
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await expect(
      page.locator('astro-error-overlay,vite-error-overlay'),
    ).toHaveCount(0);
    expect(errors).toEqual([]);
  });
}
