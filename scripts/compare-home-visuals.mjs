import { chromium } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
import sharp from 'sharp';

// Read-only on the reference: no form submissions, contact clicks or uploads.
const root = 'reference/screenshots/2026-09-07-home/comparisons';
await mkdir(root, { recursive: true });
const browser = await chromium.launch();
const widths = (process.env.QA_WIDTHS || '1440,390').split(',').map(Number);
const pairs = [
  ['hero', '.banner-section.hero', '.hero'],
  ['intro', 'body>.base-container', '.intro-section'],
  ['services', '.section-tradizione', '[data-teaser-sequence]'],
  ['welcome', '.section-benvenuti', '.welcome'],
  [
    'about',
    '.section-tradizione',
    'main>section:has([aria-label="Su di noi"])',
    1,
  ],
  ['testimonials', '.section-testimonianze', '.testimonials'],
  ['information', '.section-informazioni', '.information'],
  ['faq', '.section-faq', '.home-faq'],
  ['contact', '.section-contatti', '.contact'],
  ['footer', '.footer', '.site-footer'],
];
const report = {
  capturedAt: new Date().toISOString(),
  browser: browser.version(),
  videoState: 'original poster',
  viewports: [],
};
for (const width of widths) {
  const pages = await Promise.all(
    [
      'https://dentvitalis33.webflow.io/',
      process.env.QA_ORIGIN || 'http://localhost:4322/',
    ].map(async (url) => {
      const page = await browser.newPage({
        viewport: { width, height: 900 },
        deviceScaleFactor: 1,
      });
      const errors = [];
      page.on('pageerror', (error) => errors.push(error.message));
      await page.goto(url, { waitUntil: 'networkidle' });
      await page.evaluate(async () => {
        await document.fonts.ready;
        for (let y = 0; y < document.body.scrollHeight; y += 400) {
          scrollTo({ top: y, behavior: 'instant' });
          await new Promise((resolve) => setTimeout(resolve, 50));
        }
        await Promise.all(
          [...document.images]
            .filter((img) => img.clientWidth)
            .map((img) => img.decode().catch(() => {})),
        );
        for (const video of document.querySelectorAll('video')) {
          video.pause();
          video.poster ||= video.parentElement.dataset.posterUrl || '';
          video.removeAttribute('src');
          video.querySelectorAll('source').forEach((source) => source.remove());
          video.load();
        }
        scrollTo({ top: 0, behavior: 'instant' });
      });
      await page.waitForTimeout(1500);
      return { page, errors };
    }),
  );
  const geometry = [];
  for (const [name, reference, local, nth = 0] of pairs) {
    const bounds = await Promise.all(
      pages.map(({ page }, index) =>
        page
          .locator(index ? local : reference)
          .nth(index ? 0 : nth)
          .evaluate((e) => {
            const r = e.getBoundingClientRect();
            return {
              x: r.x,
              y: r.y + scrollY,
              width: r.width,
              height: r.height,
            };
          }),
      ),
    );
    geometry.push({
      name,
      reference: bounds[0],
      astro: bounds[1],
      deltaY: bounds[1].y - bounds[0].y,
      deltaHeight: bounds[1].height - bounds[0].height,
    });
  }
  const states = [{ name: 'top', y: 0 }];
  for (const item of geometry.slice(1)) {
    states.push({
      name: item.name,
      y: Math.max(0, Math.round(item.reference.y) - 80),
    });
    if (item.name === 'services' && width >= 992)
      for (const offset of [700, 1100, 1600, 2000, 2500, 2900])
        states.push({
          name: `services-${offset}`,
          y: Math.round(item.reference.y + offset),
        });
    if (item.name === 'welcome' && width >= 992)
      states.push({
        name: 'welcome-copy',
        y: Math.round(item.reference.y + 400),
      });
    if (item.name === 'about' && width >= 992)
      for (const offset of [720, 1420, 1820, 2320, 3020, 3620])
        states.push({
          name: `about-${offset}`,
          y: Math.round(item.reference.y + offset),
        });
    if (item.name === 'testimonials')
      states.push({
        name: 'slider',
        y: Math.round(item.reference.y + (width >= 992 ? 1050 : 390)),
      });
    if (width < 992 && ['services', 'about'].includes(item.name)) {
      const positions = await pages[0].page
        .locator('.section-tradizione')
        .nth(item.name === 'services' ? 0 : 1)
        .locator('.teaser-copy-wrap')
        .evaluateAll((es) =>
          es.map(
            (e) => Math.round(e.getBoundingClientRect().top + scrollY) - 80,
          ),
        );
      positions.forEach((y, i) =>
        states.push({ name: `${item.name}-card-${i + 1}`, y }),
      );
    }
  }
  const captures = [];
  for (const state of states) {
    const shots = await Promise.all(
      pages.map(async ({ page }, index) => {
        await page.evaluate(
          (y) => scrollTo({ top: y, behavior: 'instant' }),
          state.y,
        );
        await page.waitForTimeout(1600);
        const shot = await page.screenshot({
          path: `${root}/${width}-${state.name}-${index ? 'astro' : 'webflow'}.png`,
        });
        return { shot, scrollY: await page.evaluate(() => scrollY) };
      }),
    );
    const raws = await Promise.all(
      shots.map(({ shot }) => sharp(shot).removeAlpha().raw().toBuffer()),
    );
    const diff = Buffer.alloc(raws[0].length);
    const overlay = Buffer.alloc(raws[0].length);
    let sum = 0,
      changed = 0;
    for (let i = 0; i < diff.length; i += 3) {
      let maximum = 0;
      for (let channel = 0; channel < 3; channel++) {
        const delta = Math.abs(raws[0][i + channel] - raws[1][i + channel]);
        maximum = Math.max(maximum, delta);
        sum += delta;
        diff[i + channel] = Math.min(255, delta * 3);
        overlay[i + channel] = Math.round(
          (raws[0][i + channel] + raws[1][i + channel]) / 2,
        );
      }
      if (maximum > 16) changed++;
    }
    const raw = { width, height: 900, channels: 3 };
    await Promise.all([
      sharp(diff, { raw })
        .png()
        .toFile(`${root}/${width}-${state.name}-diff.png`),
      sharp(overlay, { raw })
        .png()
        .toFile(`${root}/${width}-${state.name}-overlay.png`),
    ]);
    captures.push({
      ...state,
      actualScroll: shots.map((s) => s.scrollY),
      meanAbsoluteChannelError: sum / diff.length,
      changedPixelsOver16: changed / (width * 900),
    });
  }
  const overflow = await Promise.all(
    pages.map(({ page }) =>
      page.evaluate(() => ({
        viewport: innerWidth,
        document: document.documentElement.scrollWidth,
      })),
    ),
  );
  report.viewports.push({
    width,
    height: 900,
    geometry,
    captures,
    overflow,
    errors: pages.map((p) => p.errors),
  });
  await writeFile(
    `${root}/report.json`,
    JSON.stringify(report, null, 2) + '\n',
  );
  console.log(
    `${width}: ${captures.length} paired viewport states; max section delta ${Math.max(...geometry.map((g) => Math.abs(g.deltaY))).toFixed(2)}px`,
  );
  await Promise.all(pages.map(({ page }) => page.close()));
}
await browser.close();
