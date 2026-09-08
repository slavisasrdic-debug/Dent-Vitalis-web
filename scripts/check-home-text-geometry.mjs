import { chromium } from '@playwright/test';
import { writeFile } from 'node:fs/promises';
const browser = await chromium.launch();
const report = [];
for (const width of [1440, 390]) {
  const snapshots = [];
  for (const url of [
    'https://dentvitalis33.webflow.io/',
    process.env.QA_ORIGIN || 'http://localhost:4322/',
  ]) {
    const page = await browser.newPage({ viewport: { width, height: 900 } });
    await page.goto(url, { waitUntil: 'networkidle' });
    await page.evaluate(async () => {
      await document.fonts.ready;
      for (let y = 0; y < document.body.scrollHeight; y += 500) {
        scrollTo({ top: y, behavior: 'instant' });
        await new Promise((resolve) => setTimeout(resolve, 30));
      }
      await Promise.all(
        [...document.images]
          .filter((img) => img.clientWidth)
          .map((img) => img.decode().catch(() => {})),
      );
      scrollTo({ top: 0, behavior: 'instant' });
    });
    await page.waitForTimeout(1600);
    snapshots.push(
      await page.evaluate(() =>
        [...document.querySelectorAll('body *')]
          .filter(
            (e) =>
              !e.children.length &&
              !['SCRIPT', 'STYLE'].includes(e.tagName) &&
              e.textContent.trim() &&
              e.checkVisibility(),
          )
          .map((e) => {
            const r = e.getBoundingClientRect(),
              s = getComputedStyle(e);
            return {
              text: e.textContent.trim().replace(/\s+/g, ' '),
              class: String(e.className),
              x: r.x,
              y: r.y + scrollY,
              w: r.width,
              h: r.height,
              font: s.fontSize,
              lineHeight: s.lineHeight,
              weight: s.fontWeight,
            };
          }),
      ),
    );
    await page.close();
  }
  const pairs = [];
  for (const a of snapshots[0]) {
    if (snapshots[0].filter((e) => e.text === a.text).length !== 1) continue;
    const matches = snapshots[1].filter((e) => e.text === a.text);
    if (matches.length !== 1) continue;
    const b = matches[0];
    pairs.push({
      text: a.text,
      reference: a,
      astro: b,
      delta: { x: b.x - a.x, y: b.y - a.y, w: b.w - a.w, h: b.h - a.h },
    });
  }
  report.push({ width, pairs });
  console.log(
    width,
    pairs
      .filter((p) => Math.abs(p.delta.y) > 0.1 || Math.abs(p.delta.x) > 0.1)
      .map((p) => ({ text: p.text.slice(0, 45), ...p.delta })),
  );
}
await writeFile(
  'reference/screenshots/2026-09-07-home/text-geometry.json',
  JSON.stringify(report, null, 2) + '\n',
);
await browser.close();
