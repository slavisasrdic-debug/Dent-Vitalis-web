import { chromium } from '@playwright/test';
import { writeFile } from 'node:fs/promises';

// Source and static Astro, all cards (not only the first four audit samples).
const browser = await chromium.launch();
const results = [];
try {
  for (const route of [
    '/prestazioni-dentali',
    '/chi-siamo',
    '/informazioni-per-pazienti',
  ]) {
    for (const width of [1440, 991, 480, 479, 390]) {
      const samples = await Promise.all(
        ['https://dentvitalis33.webflow.io', 'http://127.0.0.1:4173'].map(
          async (origin, i) => {
            const page = await browser.newPage({
              viewport: { width, height: 900 },
              reducedMotion: 'reduce',
            });
            try {
              const response = await page.goto(origin + route);
              if (response?.status() !== 200)
                throw new Error(
                  `${origin + route}: HTTP ${response?.status()}`,
                );
              await page.evaluate(() => document.fonts.ready);
              await page.waitForTimeout(2200);
              return await page.evaluate((i) => {
                const cards = [
                  ...document.querySelectorAll(
                    i ? '.teaser-card' : '.home-service-card-hp',
                  ),
                ];
                const photos = [
                  ...document.querySelectorAll(
                    i ? '.mobile-photo img' : '.teaser-img-tablet-down img',
                  ),
                ];
                return cards.map((e, index) => {
                  const r = e.getBoundingClientRect();
                  return {
                    text: e.textContent.trim().replace(/\s+/g, ' '),
                    x: r.x,
                    y: r.y,
                    width: r.width,
                    height: r.height,
                    photoPosition: getComputedStyle(photos[index])
                      .objectPosition,
                    arrow: !!e.querySelector('svg'),
                  };
                });
              }, i);
            } finally {
              await page.close();
            }
          },
        ),
      );
      const deltas = samples[0].map((reference, index) => {
        const astro = samples[1][index];
        return {
          index,
          delta: Object.fromEntries(
            ['x', 'y', 'width', 'height'].map((key) => [
              key,
              +(astro[key] - reference[key]).toFixed(3),
            ]),
          ),
          photoMatches:
            width >= 992 || reference.photoPosition === astro.photoPosition,
          arrowMatches: reference.arrow === astro.arrow,
        };
      });
      results.push({ route, width, samples, deltas });
      console.log(JSON.stringify({ route, width, deltas }));
    }
  }
} finally {
  await browser.close();
}
await writeFile(
  'reference/screenshots/2026-09-07-inner/directory-geometry.json',
  JSON.stringify(results, null, 2) + '\n',
);
