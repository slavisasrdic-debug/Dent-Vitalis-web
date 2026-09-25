import { expect, test } from '@playwright/test';

for (const [path, question, word, destination] of [
  [
    '/faq/',
    'Cosa devo portare alla prima visita?',
    'Qui',
    '/informazioni/prima-visita-gratuita',
  ],
  [
    '/hr/faq/',
    'Što trebam ponijeti na prvi pregled?',
    'ovdje',
    '/hr/prvi-pregled',
  ],
  [
    '/de/faq/',
    'Was soll ich zur Erstuntersuchung mitbringen?',
    'hier',
    '/de/first-visit',
  ],
  [
    '/en/faq/',
    'What should I bring to my first consultation?',
    'here',
    '/en/first-visit',
  ],
  ['/si/faq/', 'Kaj naj prinesem na prvi pregled?', 'tukaj', '/si/first-visit'],
]) {
  test(`First visit FAQ word link ${path}`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 900 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto(path!);
    const answer = page.locator('details').filter({ hasText: question! });
    await answer.locator('summary').click();
    await expect(answer.locator('a')).toHaveText(word!);
    await expect(answer.locator('a')).toHaveAttribute('href', destination!);
    await answer.locator('a').click();
    await expect(page).toHaveURL(new RegExp(destination! + '/?$'));
    await expect(page.locator('h1')).toBeVisible();
  });
}
