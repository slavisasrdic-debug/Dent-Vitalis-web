import { chromium } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';

const widths = [
  358, 359, 360, 390, 478, 479, 480, 766, 767, 768, 769, 990, 991, 992, 993,
  1200, 1279, 1280, 1281, 1439, 1440, 1441, 1919, 1920, 1921,
];
const output = 'reference/screenshots/2026-09-07-home/breakpoints';
await mkdir(output, { recursive: true });
const browser = await chromium.launch();
const report = {
  capturedAt: new Date().toISOString(),
  browser: browser.version(),
  samples: [],
};
for (const [label, url] of [
  ['webflow', 'https://dentvitalis33.webflow.io/'],
  ['astro', process.env.QA_ORIGIN || 'http://localhost:4322/'],
]) {
  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 },
  });
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.evaluate(async () => {
    await document.fonts.ready;
    document.querySelectorAll('video').forEach((video) => {
      video.pause();
      video.poster ||= video.parentElement.dataset.posterUrl || '';
      video.removeAttribute('src');
      video.querySelectorAll('source').forEach((source) => source.remove());
      video.load();
    });
  });
  for (const width of widths) {
    await page.setViewportSize({ width, height: 900 });
    await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }));
    await page.waitForTimeout(400);
    const values = await page.evaluate((label) => {
      const selectors =
        label === 'webflow'
          ? {
              header: '.navbar',
              logo: '.navbar .brand',
              navigation: '.nav-menu',
              items: '.menu-wrap',
              link: '.nav-link',
              dropdown: '.nav-dropdown-toggle',
              title: 'h1',
              hero: '.banner-section.hero',
              container: '.nav-container',
              toggle: '.menu-button',
              footer: '.footer',
              form: '.dv-native-form',
            }
          : {
              header: '.site-header',
              logo: '.brand',
              navigation: '.site-nav',
              items: '.nav-items',
              link: '.nav-link',
              dropdown: '.dropdown summary',
              title: 'h1',
              hero: '.hero',
              container: '.header-container',
              toggle: '.menu-toggle',
              footer: '.site-footer',
              form: '.contact-form',
            };
      const properties = [
        'display',
        'fontSize',
        'lineHeight',
        'fontWeight',
        'letterSpacing',
        'padding',
        'margin',
        'gap',
        'width',
        'maxWidth',
        'height',
      ];
      return {
        width: innerWidth,
        scrollWidth: document.documentElement.scrollWidth,
        parts: Object.fromEntries(
          Object.entries(selectors).map(([name, selector]) => {
            const element = document.querySelector(selector);
            if (!element) return [name, null];
            const style = getComputedStyle(element),
              r = element.getBoundingClientRect();
            return [
              name,
              {
                rect: {
                  x: r.x,
                  y: r.y + scrollY,
                  width: r.width,
                  height: r.height,
                },
                style: Object.fromEntries(properties.map((p) => [p, style[p]])),
              },
            ];
          }),
        ),
      };
    }, label);
    await page.screenshot({ path: `${output}/${width}-${label}.png` });
    report.samples.push({ label, ...values });
  }
  report[label + 'Errors'] = errors;
  await page.close();
  console.log(
    `${label}: ${widths.length} boundary/representative widths checked`,
  );
}
await writeFile(
  `${output}/report.json`,
  JSON.stringify(report, null, 2) + '\n',
);
await browser.close();
