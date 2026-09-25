import { expect, test } from '@playwright/test';

const homes = [
  ['/', 'Tradizione e competenza', 'competenza'],
  ['/hr/', 'Tradicija i stručnost', 'stručnost'],
  ['/de/', 'Tradition und Fachkompetenz', 'Fachkompetenz'],
  ['/en/', 'Tradition and expertise', 'expertise'],
  ['/si/', 'Tradicija in strokovno znanje', 'strokovno znanje'],
] as const;

for (const [path, heading, accent] of homes) {
  test(`home heading accent ${path}`, async ({ page }) => {
    await page.goto(path);
    const title = page.getByRole('heading', { level: 2, name: heading });
    await expect(title).toBeVisible();
    const highlight = title.locator('strong');
    await expect(highlight).toHaveText(accent);
    expect(
      Number(await highlight.evaluate((el) => getComputedStyle(el).fontWeight)),
    ).toBeGreaterThanOrEqual(700);
  });
}

for (const [path, phrase] of [
  ['/hr/placanje/', 'izdanih od strane hrvatskih banaka'],
  ['/de/payment/', 'von kroatischen Banken ausgegeben wurden'],
  ['/en/payment/', 'issued by Croatian banks'],
  ['/si/payment/', 'ki so jih izdale hrvaške banke'],
] as const) {
  test(`payment card eligibility emphasis ${path}`, async ({ page }) => {
    await page.goto(path);
    const highlight = page.locator('strong').filter({ hasText: phrase });
    await expect(highlight).toHaveText(phrase);
    expect(
      Number(await highlight.evaluate((el) => getComputedStyle(el).fontWeight)),
    ).toBeGreaterThanOrEqual(700);
  });
}

test('home contact numbers do not split within the number', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 900 });
  await page.goto('/hr/');
  const phone = page.locator('a[data-contact-link][href="tel:+38551688380"]');
  await expect(phone).toHaveCSS('white-space', 'nowrap');

  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  await expect(
    page.locator('a[data-contact-link][href="tel:800174206"]'),
  ).toHaveCSS('white-space', 'nowrap');
});

test('Croatian Flora Dusi review uses the approved feminine wording', async ({
  page,
}) => {
  await page.goto('/hr/iskustva-pacijenata/');
  const review = page.locator('article, section, div').filter({
    has: page.getByRole('heading', { name: 'Flora Dusi, Gavardo (BS)' }),
  });
  await expect(review.first()).toContainText('Imala sam problema sa zubima.');
  await expect(review.first()).toContainText('Dvoumila sam se');
  await expect(review.first()).toContainText('jako zadovoljna');
});
