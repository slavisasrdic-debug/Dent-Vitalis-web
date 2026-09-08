import { chromium } from '@playwright/test';
import { readFile, writeFile } from 'node:fs/promises';

const pages = JSON.parse(
  await readFile('src/content/inner-pages-it.json', 'utf8'),
);
const root = 'reference/screenshots/2026-09-07-inner';
const mapping = {
  '.zaglavlje-detaljna': '.detail-hero',
  '.naslov-detaljna': '.detail-hero h1',
  '.podnaslov-detaljna': '.detail-hero .description',
  '.tekst-detaljna': '.editorial-copy',
  '.podstranice-sidebar': '.page-sidebar.navigation',
  '.sadrzaji-usluge': '.page-sidebar.package',
};
const browser = await chromium.launch();
const results = [];
try {
  for (const width of [1440, 390]) {
    const page = await browser.newPage({
      viewport: { width, height: 900 },
      reducedMotion: 'reduce',
    });
    for (const entry of pages) {
      const reference = JSON.parse(
        await readFile(
          `${root}/webflow/${entry.route.slice(1).replaceAll('/', '--')}/${width}.json`,
          'utf8',
        ),
      );
      await page.goto(`http://127.0.0.1:4321${entry.route}`);
      await page.evaluate(async () => {
        await Promise.all(
          [300, 400, 500, 600, 700, 800].map((weight) =>
            document.fonts.load(`${weight} 18px Montserrat`, 'Abc ČĆŽŠĐčćžšđ'),
          ),
        );
        await document.fonts.ready;
      });
      const current = await page.evaluate(
        (mapping) =>
          Object.fromEntries(
            Object.entries(mapping).map(([key, selector]) => {
              const element = document.querySelector(selector);
              return [key, element?.getBoundingClientRect().toJSON()];
            }),
          ),
        mapping,
      );
      const delta = Object.fromEntries(
        Object.entries(current).flatMap(([selector, actual]) => {
          const expected = reference.styles[selector]?.[0]?.rect;
          if (!expected || !actual) return [];
          return [
            [
              selector,
              Object.fromEntries(
                ['x', 'y', 'width', 'height'].map((key) => [
                  key,
                  +(actual[key] - expected[key]).toFixed(2),
                ]),
              ),
            ],
          ];
        }),
      );
      results.push({ route: entry.route, width, delta });
      console.log(JSON.stringify(results.at(-1)));
    }
    await page.close();
  }
} finally {
  await browser.close();
}
await writeFile(
  `${root}/geometry-report.json`,
  JSON.stringify(results, null, 2) + '\n',
);
