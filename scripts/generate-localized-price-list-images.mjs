import { readFileSync } from 'node:fs';
import { mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import sharp from 'sharp';
import { chromium } from 'playwright';

const root = new URL('..', import.meta.url).pathname;
const sourceImage = join(
  root,
  'source-assets/webflow-export/2026-09-07/extracted/images/DV-cjenik.webp',
);
const outputDirectory = join(root, 'public/assets/images');
const imageWidth = 2600;
const imageHeight = 1464;
const fontRegular = readFileSync(
  join(
    root,
    'public/assets/fonts/JTUHjIg1_i6t8kCHKm4532VJOt5-QNFgpCtr6Hw5aX8.ttf',
  ),
).toString('base64');
const fontSemiBold = readFileSync(
  join(
    root,
    'public/assets/fonts/JTUHjIg1_i6t8kCHKm4532VJOt5-QNFgpCu173w5aX8.ttf',
  ),
).toString('base64');
const fontBold = readFileSync(
  join(
    root,
    'public/assets/fonts/JTUHjIg1_i6t8kCHKm4532VJOt5-QNFgpCuM73w5aX8.ttf',
  ),
).toString('base64');

const locales = {
  hr: {
    table: 19,
    column: 1,
    source: 'hr-source.json',
    boardTitle: 'CJENIK',
    otherServicesLabel: 'Ostale usluge',
    country: 'Hrvatska',
  },
  de: {
    table: 18,
    column: 0,
    source: 'de-source.json',
    boardTitle: 'PREISLISTE',
    otherServicesLabel: 'Weitere Leistungen',
    country: 'Kroatien',
  },
  en: {
    table: 18,
    column: 0,
    source: 'en-source.json',
    boardTitle: 'PRICE LIST',
    otherServicesLabel: 'Other services',
    country: 'Croatia',
  },
  sl: {
    table: 18,
    column: 0,
    source: 'sl-source.json',
    boardTitle: 'CENIK',
    otherServicesLabel: 'Druge storitve',
    country: 'Hrvaška',
  },
};

function escapeHtml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

function catalogue(locale) {
  return JSON.parse(
    readFileSync(
      join(root, `data/translations/${locales[locale].source}`),
      'utf8',
    ),
  );
}

function lookup(locale) {
  const paragraphs = new Map();
  for (const block of catalogue(locale).blocks) {
    const items = block.type === 'table' ? block.rows.flat().flat() : [block];
    for (const item of items) paragraphs.set(item.id, item.text?.trim());
  }
  const { table, column } = locales[locale];
  return (row, paragraph) => {
    const id = `t${table}.r${row}.c${column}.p${paragraph}`;
    const value = paragraphs.get(id);
    if (!value) throw new Error(`Missing approved price-list text: ${id}`);
    return value;
  };
}

function priceList(items) {
  return `<ul>${items
    .filter(Boolean)
    .map((item) => `<li>${escapeHtml(item)}</li>`)
    .join('')}</ul>`;
}

function priceCard(title, items, amount, className = '') {
  return `<section class="price-card ${className}"><h2>${escapeHtml(title)}</h2>${priceList(items)}<p class="amount">${escapeHtml(amount)}</p></section>`;
}

function priceBoard(locale) {
  const get = lookup(locale);
  const firstVisit = {
    title: get(2, 0),
    items: [2, 3, 4, 5, 6, 7, 8].map((p) => get(2, p)),
    amount: get(2, 10),
  };
  const fourImplants = {
    title: get(3, 0),
    items: [2, 3, 4, 5, 6, 7, 8, 9].map((p) => get(3, p)),
    amount: get(3, 11),
  };
  const premium = {
    title: get(4, 1),
    items: [3, 4, 5, 6, 7, 8, 9].map((p) => get(4, p)),
    amount: get(4, 11),
  };
  const whitening = {
    title: get(5, 0),
    items: [2, 4, 6, 8, 10, 12].map((p) => get(5, p)),
    amount: get(5, 14),
  };
  const other = [6, 7, 8, 9].map((row) => ({
    title: get(row, 0),
    amount: get(row, row === 6 ? 1 : 2),
  }));
  const subtitle = get(0, 0);
  const { boardTitle, country, otherServicesLabel } = locales[locale];
  return `<article id="board">
      <header class="paper-header">
        <p class="brand">DENT<span>VITALIS</span></p>
        <div><h1>${escapeHtml(boardTitle)}</h1><p>${escapeHtml(subtitle)}</p></div>
      </header>
      <div class="price-grid">
        <div class="price-column left-column">
          ${priceCard(firstVisit.title, firstVisit.items, firstVisit.amount, 'first-visit')}
          ${priceCard(fourImplants.title, fourImplants.items, fourImplants.amount, 'four-implants')}
          ${priceCard(premium.title, premium.items, premium.amount, 'premium')}
        </div>
        <div class="price-column right-column">
          ${priceCard(whitening.title, whitening.items, whitening.amount, 'whitening')}
          <section class="other-services"><h2>${escapeHtml(otherServicesLabel)}</h2>${other
            .map(
              (item) =>
                `<div><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.amount)}</p></div>`,
            )
            .join('')}</section>
        </div>
      </div>
      <footer>DentVitalis Fides d.o.o. &nbsp;•&nbsp; Krešimirova 60, 51000 Rijeka, ${escapeHtml(country)}</footer>
    </article>`;
}

function homography(source, target) {
  const matrix = [];
  for (let i = 0; i < 4; i++) {
    const [x, y] = source[i];
    const [X, Y] = target[i];
    matrix.push([x, y, 1, 0, 0, 0, -X * x, -X * y, X]);
    matrix.push([0, 0, 0, x, y, 1, -Y * x, -Y * y, Y]);
  }
  for (let column = 0; column < 8; column++) {
    let pivot = column;
    for (let row = column + 1; row < 8; row++)
      if (Math.abs(matrix[row][column]) > Math.abs(matrix[pivot][column]))
        pivot = row;
    [matrix[column], matrix[pivot]] = [matrix[pivot], matrix[column]];
    const divisor = matrix[column][column];
    for (let item = column; item < 9; item++) matrix[column][item] /= divisor;
    for (let row = 0; row < 8; row++) {
      if (row === column) continue;
      const factor = matrix[row][column];
      for (let item = column; item < 9; item++)
        matrix[row][item] -= factor * matrix[column][item];
    }
  }
  return matrix.map((row) => row[8]);
}

function matrix3d([a, b, c, d, e, f, g, h]) {
  return `matrix3d(${a},${d},0,${g},${b},${e},0,${h},0,0,1,0,${c},${f},0,1)`;
}

await mkdir(outputDirectory, { recursive: true });
const sourceData = readFileSync(sourceImage).toString('base64');
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({
  viewport: { width: imageWidth, height: imageHeight },
  deviceScaleFactor: 1,
});
const transform = matrix3d(
  homography(
    [
      [0, 0],
      [630, 0],
      [630, 1020],
      [0, 1020],
    ],
    [
      [1646, 419],
      [2240, 364],
      [2120, 1464],
      [1420, 1464],
    ],
  ),
);
for (const locale of Object.keys(locales)) {
  const full = join(outputDirectory, `DV-cjenik-${locale}-2600.webp`);
  await page.setContent(
    `<!doctype html><style>
      @font-face{font-family:DVMontserrat;src:url(data:font/ttf;base64,${fontRegular}) format('truetype');font-weight:400}
      @font-face{font-family:DVMontserrat;src:url(data:font/ttf;base64,${fontSemiBold}) format('truetype');font-weight:600}
      @font-face{font-family:DVMontserrat;src:url(data:font/ttf;base64,${fontBold}) format('truetype');font-weight:700}
      *{box-sizing:border-box}html,body{margin:0;width:2600px;height:1464px;overflow:hidden}
      #scene{position:relative;width:2600px;height:1464px;background:url(data:image/webp;base64,${sourceData}) center/cover}
      #board{position:absolute;left:0;top:0;width:630px;height:1020px;overflow:hidden;padding:39px 34px 25px;background:#fafafa;color:#005d70;font-family:DVMontserrat,Arial,sans-serif;transform-origin:0 0;transform:${transform}}
      .paper-header{height:72px;border-bottom:3px solid #006477;display:flex;align-items:flex-start;justify-content:space-between}
      .brand{margin:10px 0 0;font-size:29px;font-weight:700;font-style:italic;letter-spacing:-1.7px}.brand span{color:#b2c827}
      .paper-header div{text-align:right}.paper-header h1{margin:1px 0 6px;font-size:20px;line-height:1;font-weight:700;font-style:italic}.paper-header div p{margin:0;font-size:7.2px;color:#506b73}
      .price-grid{display:grid;grid-template-columns:1fr 1fr;gap:24px;padding-top:20px}.price-column{display:flex;flex-direction:column;gap:18px}.price-card,.other-services{position:relative;border-top:4px solid #006477;padding:14px 8px 10px}.price-card h2,.other-services>h2{margin:0;color:#005d70;font-size:9px;line-height:1.18;font-weight:700}.price-card ul{margin:10px 0 0;padding:0;list-style:none;font-size:6.1px;line-height:1.38}.price-card li{position:relative;padding-left:10px}.price-card li::before{position:absolute;left:0;color:#b2c827;content:'•';font-size:10px;line-height:.8}.price-card .amount{position:absolute;right:8px;bottom:11px;margin:0;font-size:12.4px;font-weight:700;white-space:nowrap}.first-visit{height:246px}.four-implants{height:250px}.premium{height:254px}.whitening{height:272px}.whitening ul{font-size:6px;line-height:1.34}.other-services{height:510px;padding-top:15px}.other-services>h2{font-size:11px;margin-bottom:17px}.other-services div{min-height:99px;border-bottom:1px solid #d6dfe1;padding:0 0 14px}.other-services div+div{padding-top:16px}.other-services h3{margin:0;font-size:8px;line-height:1.22;font-weight:700}.other-services p{margin:14px 0 0;text-align:right;font-size:12.4px;font-weight:700;white-space:nowrap}footer{position:absolute;right:34px;bottom:20px;left:34px;color:#506b73;font-size:5.8px;line-height:1;text-align:left}
    </style><div id="scene">${priceBoard(locale)}</div>`,
  );
  await sharp(await page.screenshot({ type: 'png' }))
    .webp({ quality: 90 })
    .toFile(full);
  for (const width of [320, 500, 800, 1080, 1400, 2000]) {
    await sharp(full)
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: 84 })
      .toFile(join(outputDirectory, `DV-cjenik-${locale}-${width}.webp`));
  }
}
await browser.close();
