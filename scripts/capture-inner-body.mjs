import { chromium } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
import sharp from 'sharp';
import { settleReferenceState } from './settle-reference-state.mjs';

// Read-only visual QA: same Chromium, viewport, fonts, scroll and settled state.
// No form submission, map interaction or YouTube playback.
const routes = (
  process.env.CAPTURE_PATHS ||
  [
    '/informazioni/alloggio',
    '/informazioni/listino-prezzi',
    '/su-di-noi/i-nostri-specialisti',
    '/domande-e-risposte',
    '/testimonianze',
    '/contatti',
    '/informativa-sulla-privacy',
    '/prestazioni/corone-faccette-ponti-e-protesi',
    '/prestazioni/protesi-definitiva-ancorata-su-4-impianti',
  ].join(',')
).split(',');
const root = 'reference/screenshots/2026-09-07-inner/body';
const browser = await chromium.launch();
try {
  for (const route of routes)
    for (const width of [1440, 390]) {
      const out = `${root}/${route.slice(1).replaceAll('/', '--')}`;
      await mkdir(out, { recursive: true });
      const pages = await Promise.all(
        [
          'https://dentvitalis33.webflow.io',
          process.env.CAPTURE_ORIGIN || 'http://127.0.0.1:4173',
        ].map(async (origin) => {
          const page = await browser.newPage({
            viewport: { width, height: 900 },
          });
          const response = await page.goto(origin + route);
          if (response?.status() !== 200)
            throw new Error(
              `Refusing to capture ${origin + route}: HTTP ${response?.status()}`,
            );
          await page.evaluate(async () => {
            await document.fonts.ready;
            await Promise.all(
              [300, 400, 500, 600, 700, 800].map((w) =>
                document.fonts.load(`${w} 18px Montserrat`, 'Abc ČĆŽŠĐčćžšđ'),
              ),
            );
          });
          for (
            let y = 0;
            y < (await page.evaluate(() => document.body.scrollHeight));
            y += 700
          ) {
            await page.evaluate((y) => scrollTo(0, y), y);
            await page.waitForTimeout(35);
          }
          await page.evaluate(() => scrollTo(0, 0));
          await page.waitForTimeout(2400);
          return page;
        }),
      );
      const geometry = await Promise.all(
        pages.map((page, i) =>
          page.evaluate((i) => {
            const measure = (e) => {
              const r = e.getBoundingClientRect(),
                s = getComputedStyle(e);
              return {
                text: e.textContent.trim().replace(/\s+/g, ' ').slice(0, 110),
                class: e.className,
                tag: e.tagName,
                x: r.x,
                y: r.y + scrollY,
                width: r.width,
                height: r.height,
                margin: s.margin,
                padding: s.padding,
                font: s.font,
                lineHeight: s.lineHeight,
              };
            };
            const article = document.querySelector(
              i ? '.editorial-copy' : '.tekst-detaljna',
            );
            const related = document.querySelector(
              i ? '.related-services' : '.container-wrapper-list-detail',
            );
            const footer = document.querySelector('footer');
            return {
              article: measure(article),
              children: [...article.children].map(measure),
              sidebar: [
                ...document.querySelectorAll(
                  i
                    ? '.page-sidebar, .page-sidebar .item'
                    : '.podstranice-sidebar, .sadrzaji-usluge, .prednost',
                ),
              ].map(measure),
              related: related && measure(related),
              footer: measure(footer),
              height: document.body.scrollHeight,
            };
          }, i),
        ),
      );
      await writeFile(
        `${out}/${width}-geometry.json`,
        JSON.stringify(geometry, null, 2) + '\n',
      );
      const ref = geometry[0];
      const states = {
        'article-start': Math.round(ref.article.y + 400),
        'article-middle': Math.round(
          ref.article.y + ref.article.height / 2 - 180,
        ),
        'article-end': Math.round(ref.article.y + ref.article.height - 400),
        'footer-start': Math.round(ref.footer.y - 180),
        ...(ref.related ? { related: Math.round(ref.related.y - 150) } : {}),
      };
      for (const [state, y] of Object.entries(states)) {
        const inputs = await Promise.all(
          pages.map(async (page, i) => {
            await page.evaluate((y) => scrollTo(0, y), y);
            await page.waitForTimeout(2300);
            await settleReferenceState(page);
            const file = `${out}/${width}-${state}-${i ? 'astro' : 'webflow'}.png`;
            await page.screenshot({ path: file });
            return file;
          }),
        );
        await sharp({
          create: {
            width: width * 2,
            height: 900,
            channels: 3,
            background: 'white',
          },
        })
          .composite(
            inputs.map((input, i) => ({ input, top: 0, left: width * i })),
          )
          .png()
          .toFile(`${out}/${width}-${state}-pair.png`);
        const rgba = await sharp(inputs[1])
          .ensureAlpha()
          .raw()
          .toBuffer({ resolveWithObject: true });
        for (let i = 3; i < rgba.data.length; i += 4) rgba.data[i] = 128;
        await sharp(inputs[0])
          .composite([{ input: rgba.data, raw: rgba.info }])
          .png()
          .toFile(`${out}/${width}-${state}-overlay.png`);
        await sharp(inputs[0])
          .composite([{ input: inputs[1], blend: 'difference' }])
          .png()
          .toFile(`${out}/${width}-${state}-diff.png`);
      }
      await Promise.all(pages.map((page) => page.close()));
      console.log(JSON.stringify({ route, width, states }));
    }
} finally {
  await browser.close();
}
