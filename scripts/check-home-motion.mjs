import { chromium } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';

// Normal forward scrolling, no jumps between sections, no source runtime extraction.
const root = 'reference/screenshots/2026-09-07-home/motion';
await mkdir(root, { recursive: true });
const browser = await chromium.launch();
const results = {
  capturedAt: new Date().toISOString(),
  browser: browser.version(),
  runs: [],
};
for (const width of [1440, 390]) {
  for (const [name, url] of [
    ['webflow', 'https://dentvitalis33.webflow.io/'],
    ['astro', process.env.QA_ORIGIN || 'http://localhost:4322/'],
  ]) {
    const page = await browser.newPage({
      viewport: { width, height: 900 },
      recordVideo: { dir: root, size: { width, height: 900 } },
    });
    const errors = [];
    page.on('pageerror', (e) => errors.push(e.message));
    await page.goto(url, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(1800);
    const initialVideo = await page.locator('video').evaluateAll((vs) =>
      vs.map((v) => ({
        time: v.currentTime,
        paused: v.paused,
        muted: v.muted,
        readyState: v.readyState,
      })),
    );
    const frames = [];
    for (let y = 0; y <= 4700; y += 100) {
      await page.evaluate((y) => scrollTo({ top: y, behavior: 'instant' }), y);
      await page.waitForTimeout(140);
      frames.push(
        await page.evaluate((name) => {
          const root = document.querySelector(
            name === 'astro' ? '[data-teaser-sequence]' : '.section-tradizione',
          );
          const images =
            name === 'astro'
              ? [...root.querySelectorAll('[data-image-index]')]
              : [...root.querySelectorAll('.p-teaser-img-wrap img')];
          return {
            y: scrollY,
            images: images.map((e) => ({
              class: e.className,
              opacity: getComputedStyle(e).opacity,
              transform: getComputedStyle(e).transform,
            })),
          };
        }, name),
      );
    }
    await page.waitForTimeout(1400);
    await page.screenshot({
      path: `${root}/${width}-${name}-after-scroll.png`,
    });
    const finalVideo = await page
      .locator('video')
      .evaluateAll((vs) =>
        vs.map((v) => ({ time: v.currentTime, paused: v.paused })),
      );
    await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }));
    await page.waitForTimeout(1400);
    const heroAfterReverse = await page.locator('h1').evaluate((e) => ({
      opacity: getComputedStyle(e).opacity,
      transform: getComputedStyle(e).transform,
    }));
    const video = page.video();
    await page.close();
    await video.saveAs(`${root}/${width}-${name}-forward-scroll.webm`);
    await video.delete(); // Remove only Playwright's own temporary recording, not the named evidence.
    results.runs.push({
      name,
      width,
      initialVideo,
      finalVideo,
      heroAfterReverse,
      errors,
      frames,
    });
  }
}
await writeFile(`${root}/report.json`, JSON.stringify(results, null, 2) + '\n');
await browser.close();
console.log(
  'Four desktop/mobile normal-scroll recordings and computed animation samples saved. No forms submitted.',
);
