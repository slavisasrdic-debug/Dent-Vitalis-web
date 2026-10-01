import { expect, test } from '@playwright/test';
import reference from '../data/homepage-title-reference.json' with { type: 'json' };

for (const [lang, source] of Object.entries(reference.pages)) {
  const path = new URL(source.sourceUrl).pathname;
  test(`${lang} homepage uses the exact existing public SEO title`, async ({
    page,
  }) => {
    await page.goto(path);
    await expect(page).toHaveTitle(source.title);
    await expect(page.locator('html')).toHaveAttribute('lang', lang);
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
      'content',
      source.title,
    );
    await expect(page.locator('meta[name="twitter:title"]')).toHaveAttribute(
      'content',
      source.title,
    );
    const webPage = await page
      .locator('script[type="application/ld+json"]')
      .evaluate((script) => {
        const graph = JSON.parse(script.textContent!)['@graph'];
        return graph.find((node: { '@id': string }) =>
          node['@id'].endsWith('#webpage'),
        );
      });
    expect(webPage.name).toBe(source.title);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      'content',
      'noindex, nofollow',
    );
  });
}
