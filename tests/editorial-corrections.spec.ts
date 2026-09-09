import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';

const corrections = JSON.parse(
  readFileSync('data/editorial-corrections.json', 'utf8'),
) as typeof import('../data/editorial-corrections.json');
const catalogue = JSON.parse(
  readFileSync('data/translations/hr-source.json', 'utf8'),
) as {
  blocks: (
    | { type: 'paragraph'; id: string; text: string }
    | { type: 'table'; rows: { id: string; text: string }[][][] }
  )[];
};
const doctorSource = catalogue.blocks
  .flatMap((block) => (block.type === 'table' ? block.rows!.flat(2) : [block]))
  .find(
    (paragraph) => paragraph.id === corrections.italianDoctor.sourceId,
  )!.text;

for (const width of [390, 1440]) {
  test(`approved crown price and doctor biography at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    const errors: string[] = [];
    page.on('pageerror', (e) => errors.push(e.message));
    page.on('console', (message) => {
      if (message.type() === 'error') errors.push(message.text());
    });
    const crowns = [
      [corrections.croatianCrown.route, 'hr', corrections.croatianCrown.to],
      [
        '/prestazioni/corone-faccette-ponti-e-protesi',
        'it',
        'Corone dentali a partire da 220 €',
      ],
    ];
    for (const [path, lang, label] of crowns) {
      expect((await page.goto(path!))?.status()).toBe(200);
      await expect(page.locator('html')).toHaveAttribute('lang', lang!);
      await expect(page).toHaveTitle(/DentVitalis/i);
      await expect(page.locator('main h1')).toBeVisible();
      await expect(page.locator('.page-sidebar')).toContainText(label!);
      await expect(page.locator('main')).not.toContainText(/330\s*€/);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
    }
    await page.goto(corrections.italianDoctor.route);
    await page
      .locator('.editorial-copy')
      .getByText(doctorSource!, { exact: true })
      .scrollIntoViewIfNeeded();
    await expect(page.locator('.editorial-copy')).toContainText(doctorSource!);
    await expect(page.locator('main')).not.toContainText('Dr. XY');
    const graph = JSON.parse(
      (await page.locator('script[type="application/ld+json"]').textContent())!,
    );
    const person = graph['@graph'].find(
      (node: { '@type': string; name?: string }) =>
        node['@type'] === 'Person' && node.name?.includes('Domagoj Žalac'),
    );
    expect(person.description).toBe(doctorSource);
    await page.reload();
    await expect(page.locator('.editorial-copy')).toContainText(doctorSource!);
    await expect(
      page.locator('astro-error-overlay,vite-error-overlay'),
    ).toHaveCount(0);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    expect(errors).toEqual([]);
  });
}
