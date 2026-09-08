import { chromium } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

// Reference and implementation are captured with identical Chromium settings.
// This script never submits forms or follows contact links.
const origin = process.env.CAPTURE_ORIGIN || 'https://dentvitalis33.webflow.io';
const label = process.env.CAPTURE_LABEL || 'webflow';
const widths = (process.env.CAPTURE_WIDTHS || '1440,390')
  .split(',')
  .map(Number);
const output = path.resolve('reference/screenshots/2026-09-07-home', label);
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ headless: true });
for (const width of widths) {
  const page = await browser.newPage({
    viewport: { width, height: 900 },
    deviceScaleFactor: 1,
  });
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto(origin, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 650) {
      scrollTo(0, y);
      await new Promise((resolve) => setTimeout(resolve, 90));
    }
    scrollTo(0, 0);
    await Promise.race([
      Promise.all(
        [...document.images]
          .filter((img) => img.getBoundingClientRect().width > 0)
          .map((img) => img.decode().catch(() => {})),
      ),
      new Promise((resolve) => setTimeout(resolve, 5000)),
    ]);
  });
  await page.waitForTimeout(1300);
  // The original CSS poster and our same original poster control video frames.
  await page.evaluate(() => {
    for (const video of document.querySelectorAll('video')) {
      video.pause();
      video.poster ||= video.parentElement.dataset.posterUrl || '';
      video.removeAttribute('src');
      video.querySelectorAll('source').forEach((source) => source.remove());
      video.load();
    }
  });
  await page.waitForTimeout(500);
  await page.screenshot({
    path: path.join(output, `${width}-full.png`),
    fullPage: true,
  });
  await page.screenshot({ path: path.join(output, `${width}-top.png`) });
  const sections = await page
    .locator(
      'body > section, body > footer, body > .base-container, main > section, main > .intro-section, footer',
    )
    .all();
  for (let i = 0; i < sections.length; i++) {
    if (await sections[i].isVisible()) {
      await sections[i].screenshot({
        path: path.join(output, `${width}-section-${i}.png`),
      });
    }
  }
  await page.evaluate(() => scrollTo(0, 0));
  const styles = await page.evaluate(() => {
    const properties = [
      'display',
      'position',
      'zIndex',
      'width',
      'height',
      'maxWidth',
      'minHeight',
      'padding',
      'margin',
      'gap',
      'gridTemplateColumns',
      'flexDirection',
      'alignItems',
      'justifyContent',
      'fontFamily',
      'fontWeight',
      'fontSize',
      'lineHeight',
      'letterSpacing',
      'textTransform',
      'color',
      'backgroundColor',
      'backgroundImage',
      'backgroundSize',
      'backgroundPosition',
      'objectFit',
      'objectPosition',
      'border',
      'borderRadius',
      'boxShadow',
      'transition',
    ];
    return [...document.querySelectorAll('body *')]
      .filter((el) => !['SCRIPT', 'STYLE', 'PATH', 'SVG'].includes(el.tagName))
      .map((el) => {
        const style = getComputedStyle(el);
        const rect = el.getBoundingClientRect();
        return {
          tag: el.tagName,
          class: el.className,
          id: el.id,
          text: el.children.length ? null : el.textContent,
          src: el.getAttribute('src'),
          rect: {
            x: rect.x,
            y: rect.y + scrollY,
            width: rect.width,
            height: rect.height,
          },
          style: Object.fromEntries(properties.map((p) => [p, style[p]])),
        };
      });
  });
  await writeFile(
    path.join(output, `${width}-computed.json`),
    JSON.stringify(
      {
        origin,
        capturedAt: new Date().toISOString(),
        viewport: { width, height: 900 },
        errors,
        styles,
      },
      null,
      2,
    ),
  );
  console.log(
    `${label} ${width}: ${styles.length} elements, ${errors.length} runtime errors`,
  );
  await page.close();
}
await browser.close();
