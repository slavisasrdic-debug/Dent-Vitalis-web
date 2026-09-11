import { expect, test } from '@playwright/test';
import catalogue from '../data/translations/hr-source.json' with { type: 'json' };
import { anaResearchUrl } from '../src/content/doctor-research';

function sourceParagraph(value: unknown, id: string): string | undefined {
  if (!value || typeof value !== 'object') return undefined;
  if ('id' in value && value.id === id && 'text' in value)
    return String(value.text);
  for (const child of Object.values(value)) {
    const text = sourceParagraph(child, id);
    if (text !== undefined) return text;
  }
  return undefined;
}
const normalize = (text: string) => text.replace(/\s+/g, ' ').trim();
for (const [route, id] of [
  ['/su-di-noi/i-nostri-specialisti', 't6.r4.c0.p4'],
  ['/hr/nasi-specijalisti', 't6.r4.c1.p5'],
]) {
  test(`Ana research link keeps source paragraph: ${route}`, async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.goto(route!, { waitUntil: 'domcontentloaded' });
    const link = page.locator(`.editorial-copy a[href="${anaResearchUrl}"]`);
    await expect(link).toHaveCount(1);
    const source = sourceParagraph(catalogue, id!);
    expect(source).toBeDefined();
    expect(normalize(await link.locator('..').innerText())).toBe(
      normalize(source!),
    );
    for (const width of [320, 390, 820, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      await link.scrollIntoViewIfNeeded();
      await expect(link).toBeVisible();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth - innerWidth,
        ),
      ).toBe(0);
    }
    // Check the exact external destination without depending on publisher access.
    await page.route(anaResearchUrl, (request) =>
      request.fulfill({ status: 200, body: 'Verified DOI navigation test' }),
    );
    await link.focus();
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(anaResearchUrl);
    expect(errors).toEqual([]);
  });
}
