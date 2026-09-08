import { chromium } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
import sharp from 'sharp';
const output = 'reference/screenshots/2026-09-07-home/interactions';
await mkdir(output, { recursive: true });
const browser = await chromium.launch();
const report = { capturedAt: new Date().toISOString(), checks: [] };
for (const width of [1440, 390]) {
  const pages = await Promise.all(
    [
      'https://dentvitalis33.webflow.io/',
      process.env.QA_ORIGIN || 'http://localhost:4322/',
    ].map(async (url) => {
      const p = await browser.newPage({
        viewport: { width, height: 900 },
        hasTouch: width < 992,
      });
      await p.goto(url, { waitUntil: 'networkidle' });
      await p.evaluate(async () => {
        await document.fonts.ready;
        document.querySelectorAll('video').forEach((v) => {
          v.pause();
          v.poster ||= v.parentElement.dataset.posterUrl || '';
          v.removeAttribute('src');
          v.querySelectorAll('source').forEach((s) => s.remove());
          v.load();
        });
      });
      await p.waitForTimeout(2500);
      return p;
    }),
  );
  const shot = async (name) => {
    await Promise.all(pages.map((p) => p.waitForTimeout(1100)));
    for (let i = 0; i < pages.length; i++) {
      const styles = await pages[i].evaluate(() =>
        [...document.querySelectorAll('body *')]
          .filter(
            (e) =>
              e.checkVisibility({ visibilityProperty: true }) &&
              e.getBoundingClientRect().width > 0 &&
              e.getBoundingClientRect().height > 0 &&
              !['SCRIPT', 'STYLE', 'path', 'svg'].includes(e.tagName),
          )
          .map((e) => {
            const r = e.getBoundingClientRect(),
              s = getComputedStyle(e);
            return {
              tag: e.tagName,
              class: String(e.className),
              id: e.id,
              text: e.children.length ? null : e.textContent,
              rect: { x: r.x, y: r.y, width: r.width, height: r.height },
              style: Object.fromEntries(
                [
                  'fontFamily',
                  'fontSize',
                  'fontWeight',
                  'lineHeight',
                  'letterSpacing',
                  'padding',
                  'margin',
                  'gap',
                  'display',
                  'backgroundColor',
                  'borderRadius',
                  'width',
                  'height',
                  'border',
                  'boxShadow',
                ].map((k) => [k, s[k]]),
              ),
            };
          }),
      );
      await writeFile(
        `${output}/${width}-${name}-${i ? 'astro' : 'webflow'}-computed.json`,
        JSON.stringify(styles, null, 2) + '\n',
      );
    }
    const images = await Promise.all(
      pages.map(async (p, i) => {
        await p.waitForTimeout(1000);
        return p.screenshot({
          path: `${output}/${width}-${name}-${i ? 'astro' : 'webflow'}.png`,
        });
      }),
    );
    const raw = await Promise.all(
      images.map((i) => sharp(i).removeAlpha().raw().toBuffer()),
    );
    const overlay = Buffer.from(raw[0]);
    let error = 0;
    for (let i = 0; i < overlay.length; i++) {
      overlay[i] = Math.round((raw[0][i] + raw[1][i]) / 2);
      error += Math.abs(raw[0][i] - raw[1][i]);
    }
    await sharp(overlay, { raw: { width, height: 900, channels: 3 } })
      .png()
      .toFile(`${output}/${width}-${name}-overlay.png`);
    report.checks.push({
      width,
      name,
      meanAbsoluteChannelError: error / overlay.length,
    });
  };
  if (width < 992) {
    await pages[0].locator('.menu-button').click();
    await pages[1].locator('.menu-toggle').click();
    await shot('menu');
  }
  if (width >= 992) {
    await pages[0].locator('.nav-dropdown').first().hover();
    await pages[1].locator('[data-nav-dropdown]').first().hover();
  } else {
    await pages[0]
      .locator('.nav-dropdown .w-dropdown-toggle')
      .first()
      .tap({ position: { x: 280, y: 20 } });
    await pages[1]
      .locator('[data-nav-dropdown] summary')
      .first()
      .tap({ position: { x: 280, y: 20 } });
  }
  await shot('dropdown');
  await Promise.all(pages.map((p) => p.keyboard.press('Escape')));
  if (width < 992) {
    await pages[0].locator('.menu-button').click();
    if (
      (await pages[1].locator('.menu-toggle').getAttribute('aria-expanded')) ===
      'true'
    )
      await pages[1].locator('.menu-toggle').click();
  }
  await pages[0]
    .locator(
      width < 992
        ? '.dv-language-mobile-adjacent summary'
        : '.dv-language-switcher summary',
    )
    .click();
  await pages[1]
    .locator(`[data-language].${width < 992 ? 'mobile' : 'desktop'} summary`)
    .click();
  await shot('language');
  await pages[0]
    .locator(
      width < 992
        ? '.dv-language-mobile-adjacent summary'
        : '.dv-language-switcher summary',
    )
    .click();
  await pages[1]
    .locator(`[data-language].${width < 992 ? 'mobile' : 'desktop'} summary`)
    .click();
  await Promise.all(
    pages.map((p) =>
      p.evaluate(() => scrollTo({ top: 0, behavior: 'instant' })),
    ),
  );
  await pages[0]
    .locator(
      width < 992
        ? '.fiksni-kontakti-mobile .gumb-upit'
        : '.header-button-wrapper .gumb-upit',
    )
    .click();
  await pages[1]
    .locator(width < 992 ? '.mobile-contact a' : '.header-consultation a')
    .click();
  await shot('dialog');
  await Promise.all(pages.map((p) => p.keyboard.press('Escape')));
  const y = await pages[0]
    .locator('.section-faq')
    .evaluate((e) => Math.round(e.getBoundingClientRect().top + scrollY));
  await Promise.all(
    pages.map((p) =>
      p.evaluate((y) => scrollTo({ top: y + 180, behavior: 'instant' }), y),
    ),
  );
  await pages[0].locator('.accordion-toggle').first().click();
  await pages[1].locator('.faq-item summary').first().click();
  await Promise.all(pages.map((p) => p.waitForTimeout(1500)));
  await Promise.all(
    pages.map((p) =>
      p.evaluate((y) => scrollTo({ top: y + 180, behavior: 'instant' }), y),
    ),
  );
  await shot('faq-open');
  await Promise.all(
    pages.map((p) =>
      p
        .locator('h1')
        .evaluate((e) =>
          e.dispatchEvent(new MouseEvent('click', { bubbles: true })),
        ),
    ),
  );
  await Promise.all(pages.map((p) => p.waitForTimeout(800)));
  await Promise.all(
    pages.map((p) =>
      p.evaluate((y) => scrollTo({ top: y + 180, behavior: 'instant' }), y),
    ),
  );
  await pages[0].locator('.whatsapp-container').click();
  await pages[1].locator('.chat-toggle').click();
  await shot('chat');
  // Slider states start independently of the chat exit animation.
  await Promise.all(
    pages.map(async (page) => {
      await page.reload({ waitUntil: 'networkidle' });
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
      await page.waitForTimeout(1600);
    }),
  );
  const sliderY = await pages[0]
    .locator('.w-slider')
    .evaluate((e) => Math.round(e.getBoundingClientRect().top + scrollY) - 100);
  for (const slide of [2, 3]) {
    await Promise.all(
      pages.map((p) =>
        p.evaluate((y) => scrollTo({ top: y, behavior: 'instant' }), sliderY),
      ),
    );
    // Dot controls are present on mobile where the arrow is intentionally hidden.
    if (width < 992) {
      await pages[0]
        .locator('.w-slider-dot')
        .nth(slide - 1)
        .tap();
      await pages[1].locator(`[data-slide-to="${slide - 1}"]`).tap();
    } else {
      await pages[0]
        .locator('.w-slider-dot')
        .nth(slide - 1)
        .click();
      await pages[1].locator(`[data-slide-to="${slide - 1}"]`).click();
    }
    await Promise.all(pages.map((p) => p.waitForTimeout(1500)));
    await Promise.all(
      pages.map((p) =>
        p.evaluate((y) => scrollTo({ top: y, behavior: 'instant' }), sliderY),
      ),
    );
    await shot(`slider-${slide}`);
  }
  await Promise.all(pages.map((p) => p.close()));
  console.log(
    `${width}: menu/dropdown, dialog, FAQ, chat captured without submitting`,
  );
}
await writeFile(
  `${output}/report.json`,
  JSON.stringify(report, null, 2) + '\n',
);
await browser.close();
