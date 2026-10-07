import { test, expect } from '@playwright/test';
import { blockElfsight } from './helpers/elfsight';

for (const width of [390, 1440])
  test(`Croatian contact address omits Italian glosses at ${width}px`, async ({
    page,
  }) => {
    await blockElfsight(page);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.setViewportSize({ width, height: 900 });
    const errors: string[] = [];
    const posts: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.route('**/send', (route) => {
      if (route.request().method() === 'POST') {
        posts.push(route.request().url());
        return route.abort();
      }
      return route.continue();
    });
    const response = await page.goto('/hr/kontakt');
    expect(response?.status()).toBe(200);
    await expect(page).toHaveTitle('Kontakti | DentVitalis');
    await expect(page.locator('h1')).toHaveText('Kontakti');
    const address = page.locator('.contact-address');
    await expect(address).toBeVisible();
    await expect(address.locator('p')).toHaveText([
      'Dentvitalis Fides d.o.o.',
      'Krešimirova 60, 51000 Rijeka',
      'Hrvatska',
      /www\.dentvitalis\.com/,
    ]);
    await expect(address).not.toContainText(/Fiume|Croazia/);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await expect(
      page.locator('astro-error-overlay, vite-error-overlay'),
    ).toHaveCount(0);
    await address.screenshot({
      path: `/tmp/dentvitalis-hr-address-${width}.png`,
    });
    const trigger =
      width >= 1200
        ? page.locator('.header-consultation .button')
        : page.locator('.mobile-contact .button');
    await trigger.click();
    await expect(page.locator('[data-inquiry-dialog]')).toBeVisible();
    await expect(
      page.locator('[data-inquiry-dialog] input[name=lang]'),
    ).toHaveValue('hr');
    await page
      .getByRole('button', { name: 'Zatvori upit', exact: true })
      .click();
    await expect(page.locator('[data-inquiry-dialog]')).not.toBeVisible();
    expect(posts).toEqual([]);
    expect(errors).toEqual([]);
  });

test('Italian contact page retains its own geographic names', async ({
  request,
  page,
}) => {
  const response = await request.get('/contatti');
  expect(response.status()).toBe(200);
  const address = await page.evaluate(
    (html) =>
      new DOMParser()
        .parseFromString(html, 'text/html')
        .querySelector('.contact-address')!.textContent,
    await response.text(),
  );
  expect(address).toContain('Fiume');
  expect(address).toContain('Croazia');
  expect(address).not.toContain('Hrvatska');
});
