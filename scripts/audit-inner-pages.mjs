import { chromium } from '@playwright/test';
import { createHash } from 'node:crypto';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { settleReferenceState } from './settle-reference-state.mjs';

// Read-only reference audit. Never follows a contact link or submits a form.
const source = 'reference/webflow-handoff/2026-09-07/extracted';
const { pages } = JSON.parse(await readFile(`${source}/pages.json`, 'utf8'));
const root = 'reference/screenshots/2026-09-07-inner';
const origin = process.env.CAPTURE_ORIGIN || 'https://dentvitalis33.webflow.io';
const label = process.env.CAPTURE_LABEL || 'webflow';
const only = process.env.CAPTURE_PATHS?.split(',');
const widths = (process.env.CAPTURE_WIDTHS || '1440,390')
  .split(',')
  .map(Number);
const browser = await chromium.launch();
const properties = [
  'display',
  'position',
  'top',
  'left',
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
  'fontStyle',
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
  'opacity',
  'transform',
];
const selectors = [
  'body',
  '.breadcrumb-conteiner',
  '.breadcrumb-wrapper-4',
  '.breadcrumb',
  '.breadcrum-text',
  '.zaglavlje-detaljna',
  '.inner-banner-photo',
  '.inner-banner-photo img',
  '.sjena-lijevo',
  '.container-wrapper-4',
  '.inner-banner',
  '.inner-banner-text-wrap',
  '.naslov-detaljna-tekstovi',
  '.naslov-detaljna',
  '.nadnaslov-detaljna',
  '.podnaslov-detaljna',
  '.base-container.full-width',
  '.detaljna-tekst',
  '.tekst-detaljna',
  '.podstranice-sidebar',
  '.sadrzaji-usluge',
  '.prednost',
  '.text-block-11',
  '.text-block-16',
  '.text-span-4',
  '.odlomak',
  '.large-paragraph',
  '.medjunaslov-h2-detaljna',
  '.medjunaslov-h3',
  '.bulet',
  '.foto-osoblje',
  '.titula',
  '.teaser-section',
  '.teaser-container',
  '.teaser-grid',
  '.teaser-column',
  '.teaser-copy-wrap',
  '.p-teaser-img-wrap',
  '.teaser-img-tablet-down',
  '.teaser-img',
  '.home-service-card-hp',
  '.home-service-card',
  '.nadnaslov-kartica',
  '.istaknuta-cijena',
  '.cijena-velika',
  '.container-wrapper-list-detail',
  '.accordion-item',
  '.accordion-title',
  '.accordion-text',
  '.video',
  '.naziv-klijenta',
  '.kontakt-kartica',
  '.galerija-usporedba-stabilna',
  '.bas-image-before',
  '.bas-image-after-h',
];
try {
  for (const item of pages.filter(
    (p) =>
      p.metadata.publishedPath !== '/' &&
      (!only || only.includes(p.metadata.publishedPath)),
  )) {
    const route = item.metadata.publishedPath;
    const out = `${root}/${label}/${route.slice(1).replaceAll('/', '--')}`;
    await mkdir(out, { recursive: true });
    for (const width of widths) {
      const page = await browser.newPage({
        viewport: { width, height: 900 },
        deviceScaleFactor: 1,
      });
      const errors = [];
      page.on('pageerror', (error) => errors.push(error.message));
      const response = await page.goto(origin + route, {
        waitUntil: 'domcontentloaded',
        timeout: 45000,
      });
      if (response?.status() !== 200)
        throw new Error(
          `Refusing to capture ${origin + route}: HTTP ${response?.status()}`,
        );
      const bytes = await response.body();
      const sha = (data) => createHash('sha256').update(data).digest('hex');
      const version = {
        status: response.status(),
        sha256: sha(bytes),
        acceptedSha256: sha(
          await readFile(`${source}/${item.publishedHtmlRef}`),
        ),
      };
      // Wait for Webfont loader, not merely a still-empty FontFaceSet.
      if (label === 'webflow')
        await page
          .waitForFunction(
            () =>
              document.documentElement.classList.contains('wf-active') ||
              document.documentElement.classList.contains('wf-inactive'),
            { timeout: 10000 },
          )
          .catch(() => {});
      await page.evaluate(() => document.fonts.ready);
      await page.evaluate(async () => {
        for (let y = 0; y < document.body.scrollHeight; y += 800) {
          scrollTo(0, y);
          await new Promise((resolve) => setTimeout(resolve, 35));
        }
        scrollTo(0, 0);
        await Promise.race([
          Promise.all(
            [...document.images]
              .filter((i) => i.getBoundingClientRect().width)
              .map((i) => i.decode().catch(() => {})),
          ),
          new Promise((resolve) => setTimeout(resolve, 4000)),
        ]);
      });
      // Include the reference sidebar's 1000ms delay + 1000ms entrance.
      await page.waitForTimeout(2200);
      const data = await page.evaluate(
        ({ selectors, properties }) => ({
          title: document.title,
          lang: document.documentElement.lang,
          bodyClass: document.body.className,
          height: document.body.scrollHeight,
          styles: Object.fromEntries(
            selectors.map((selector) => [
              selector,
              [...document.querySelectorAll(selector)]
                .slice(0, 4)
                .map((element) => ({
                  text: element.textContent.trim().slice(0, 120),
                  class: element.className,
                  rect: element.getBoundingClientRect().toJSON(),
                  css: Object.fromEntries(
                    properties.map((prop) => [
                      prop,
                      getComputedStyle(element)[prop],
                    ]),
                  ),
                })),
            ]),
          ),
          headings: [...document.querySelectorAll('h1,h2,h3')].map((e) =>
            e.textContent.trim(),
          ),
          images: [...document.images].map((e) => ({
            src: e.getAttribute('src'),
            alt: e.alt,
            width: e.naturalWidth,
            height: e.naturalHeight,
            visible: getComputedStyle(e).display !== 'none',
          })),
        }),
        { selectors, properties },
      );
      await settleReferenceState(page);
      await page.screenshot({ path: `${out}/${width}-top.png` });
      await page.evaluate(() => scrollTo(0, 650));
      await page.waitForTimeout(2200);
      await settleReferenceState(page);
      await page.screenshot({ path: `${out}/${width}-scroll-650.png` });
      await writeFile(
        `${out}/${width}.json`,
        JSON.stringify(
          {
            origin,
            route,
            width,
            capturedAt: new Date().toISOString(),
            version,
            errors,
            ...data,
          },
          null,
          2,
        ) + '\n',
      );
      console.log(
        JSON.stringify({
          route,
          width,
          status: version.status,
          unchanged: version.sha256 === version.acceptedSha256,
          bodyFont: data.styles.body[0].css.fontFamily,
        }),
      );
      await page.close();
    }
  }
} finally {
  await browser.close();
}
