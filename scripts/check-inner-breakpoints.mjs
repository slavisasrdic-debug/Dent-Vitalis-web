import { chromium } from '@playwright/test';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
const pages = JSON.parse(
  await readFile('src/content/inner-pages-it.json', 'utf8'),
);
const widths = [
  390, 478, 479, 480, 481, 766, 767, 768, 769, 990, 991, 992, 993, 1199, 1200,
  1201, 1279, 1280, 1281, 1439, 1440, 1441, 1919, 1920, 1921,
];
const browser = await chromium.launch();
const results = [];
try {
  const page = await browser.newPage({ reducedMotion: 'reduce' });
  for (const entry of pages) {
    await page.goto(`http://127.0.0.1:4321${entry.route}`);
    await page.evaluate(() => document.fonts.ready);
    for (const width of widths) {
      await page.setViewportSize({ width, height: 900 });
      const state = await page.evaluate(() => ({
        overflow: document.documentElement.scrollWidth - innerWidth,
        menu:
          getComputedStyle(document.querySelector('.menu-toggle')).display !==
          'none',
        heroImageBelowText:
          !!document.querySelector('.hero-photo') &&
          document.querySelector('.hero-photo').getBoundingClientRect().top >=
            document.querySelector('.hero-copy').getBoundingClientRect().bottom,
        mobilePhotos: [...document.querySelectorAll('.mobile-photo img')]
          .filter((image) => image.getBoundingClientRect().width > 0)
          .map((image) => image.getAttribute('src')),
      }));
      results.push({ route: entry.route, width, ...state });
    }
    console.log(`${entry.route}: ${widths.length} viewport boundaries checked`);
  }
  await mkdir('reference/screenshots/2026-09-07-inner', { recursive: true });
  await writeFile(
    'reference/screenshots/2026-09-07-inner/breakpoint-report.json',
    JSON.stringify(results, null, 2) + '\n',
  );
  const failures = results.filter(
    (result) => result.overflow || result.menu !== result.width <= 991,
  );
  console.log(JSON.stringify({ samples: results.length, failures }, null, 2));
  if (failures.length) process.exitCode = 1;
} finally {
  await browser.close();
}
