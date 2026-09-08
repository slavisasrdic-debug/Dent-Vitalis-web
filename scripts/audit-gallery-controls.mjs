import { chromium } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
import { settleReferenceState } from './settle-reference-state.mjs';
const out = 'reference/screenshots/2026-09-07-inner/gallery-controls';
const origin = process.env.CAPTURE_ORIGIN || 'https://dentvitalis33.webflow.io';
const label = process.env.CAPTURE_LABEL || 'webflow';
await mkdir(out, { recursive: true });
const browser = await chromium.launch();
try {
  for (const width of [1440, 390]) {
    const page = await browser.newPage({
      viewport: { width, height: 900 },
      hasTouch: width < 992,
    });
    await page.goto(`${origin}/domande-e-risposte`);
    await page.evaluate(() => document.fonts.ready);
    const root = page
      .locator(
        label === 'webflow'
          ? '.galerija-usporedba-stabilna'
          : '[data-comparison]',
      )
      .first();
    await root.scrollIntoViewIfNeeded();
    await page.waitForTimeout(2200);
    await root.evaluate((element) => {
      const rect = element.getBoundingClientRect();
      scrollTo({
        top: scrollY + rect.top - (innerHeight - rect.height) / 2,
        behavior: 'instant',
      });
    });
    const states = [];
    const capture = async (name) => {
      await settleReferenceState(page);
      const value = await root.evaluate((root) =>
        [root, ...root.children].map((e) => {
          const s = getComputedStyle(e),
            r = e.getBoundingClientRect();
          return {
            tag: e.tagName,
            class: e.className,
            text: e.textContent.trim(),
            rect: r.toJSON(),
            style: e.getAttribute('style'),
            css: Object.fromEntries(
              [
                'backgroundColor',
                'border',
                'borderRadius',
                'boxShadow',
                'clipPath',
                'transform',
                'opacity',
                'cursor',
                'transition',
                'padding',
                'font',
                'zIndex',
                'objectFit',
                'objectPosition',
                'pointerEvents',
              ].map((k) => [k, s[k]]),
            ),
          };
        }),
      );
      states.push({ name, scrollY: await page.evaluate(() => scrollY), value });
      await page.screenshot({ path: `${out}/${label}-${width}-${name}.png` });
    };
    await capture('initial');
    const box = await root.boundingBox();
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await page.mouse.down();
    await page.mouse.move(box.x + box.width * 0.8, box.y + box.height / 2, {
      steps: 12,
    });
    await page.mouse.up();
    await page.waitForTimeout(600);
    await capture('drag-80');
    await root
      .locator(label === 'webflow' ? '.bas-label-before-h' : '.before-label')
      .click();
    await page.waitForTimeout(600);
    await capture('before-label');
    await root
      .locator(label === 'webflow' ? '.bas-label-after-h' : '.after-label')
      .click();
    await page.waitForTimeout(600);
    await capture('after-label');
    await page.mouse.click(box.x + box.width * 0.25, box.y + box.height * 0.7);
    await page.waitForTimeout(600);
    await capture('image-click-25');
    await writeFile(
      `${out}/${label}-${width}.json`,
      JSON.stringify(states, null, 2) + '\n',
    );
    console.log(
      JSON.stringify({
        width,
        states: states.map((s) => ({
          name: s.name,
          elements: s.value.map((e) => ({
            class: e.class,
            style: e.style,
            clip: e.css.clipPath,
          })),
        })),
      }),
    );
    await page.close();
  }
} finally {
  await browser.close();
}
