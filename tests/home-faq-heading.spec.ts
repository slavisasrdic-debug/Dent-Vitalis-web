import { expect, test } from '@playwright/test';

const locales = [
  ['/', 'Domande e risposte', 'risposte'],
  ['/hr/', 'Pitanja i odgovori', 'odgovori'],
  ['/de/', 'Fragen und Antworten', 'Antworten'],
  ['/en/', 'Questions and answers', 'answers'],
  ['/si/', 'Vprašanja in odgovori', 'odgovori'],
] as const;

test('home FAQ response word uses the shared accented heading treatment', async ({
  page,
}) => {
  for (const [route, title, accent] of locales) {
    await page.goto(route, { waitUntil: 'networkidle' });
    const heading = page.locator('.home-faq h2');
    const highlighted = heading.locator('strong');
    await expect(heading, route).toHaveText(title);
    await expect(highlighted, route).toHaveText(accent);
    expect(await highlighted.evaluate((node) => getComputedStyle(node).color)).toBe(
      'rgb(175, 188, 54)',
    );
    expect(
      Number(await highlighted.evaluate((node) => getComputedStyle(node).fontWeight)),
    ).toBeGreaterThanOrEqual(700);
  }
});
