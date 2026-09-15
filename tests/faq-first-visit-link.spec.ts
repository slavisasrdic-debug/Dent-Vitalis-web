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
