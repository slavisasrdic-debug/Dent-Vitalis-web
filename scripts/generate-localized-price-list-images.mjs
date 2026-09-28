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
const logoImage = join(
  root,
  'public/assets/images/Dentvitalis-logo-color_21200px.svg',
);
const outputDirectory = join(root, 'public/assets/images');
const diagnosticDirectory = join(root, '.astro/audits');
const imageWidth = 2600;
const imageHeight = 1464;
const boardWidth = 630;
const boardHeight = 1020;
const fontRegular = readFileSync(
  join(
    root,
    'public/assets/fonts/JTUHjIg1_i6t8kCHKm4532VJOt5-QNFgpCtr6Hw5aX8.ttf',
  ),
).toString('base64');
const fontMedium = readFileSync(
  join(
    root,
    'public/assets/fonts/JTUHjIg1_i6t8kCHKm4532VJOt5-QNFgpCtZ6Hw5aX8.ttf',
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

function priceParts(value, fallbackLabel = '') {
  const match = value.match(/(?:€\s*)?[\d.,]+\s*€?$/);
  if (!match) return { label: fallbackLabel, amount: value };
  return {
    label: value.slice(0, match.index).trim() || fallbackLabel,
    amount: match[0].trim(),
  };
}

function priceCard(title, items, price, className) {
  return `<section class="localized-card ${className}"><h2>${escapeHtml(title)}</h2>${priceList(items)}<p class="price-label">${escapeHtml(price.label)}</p><p class="amount">${escapeHtml(price.amount)}</p></section>`;
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
    price: priceParts(get(row, row === 6 ? 1 : 2)),
  }));
  const subtitle = get(0, 0);
  const { boardTitle, country, otherServicesLabel } = locales[locale];
  const fixedLabel = priceParts(fourImplants.amount).label;
  const firstPrice = priceParts(firstVisit.amount, fixedLabel);
  return `<article id="board" class="locale-${locale}">
      <img class="board-logo" src="data:image/svg+xml;base64,${logoData}" alt="" />
      <i class="rule header-rule"></i><i class="rule first-rule"></i><i class="rule whitening-rule"></i><i class="rule four-rule"></i><i class="rule other-rule"></i><i class="rule premium-rule"></i>
      <header class="localized-header"><h1>${escapeHtml(boardTitle)}</h1><p>${escapeHtml(subtitle)}</p></header>
      ${priceCard(firstVisit.title, firstVisit.items, firstPrice, 'first-visit')}
      ${priceCard(whitening.title, whitening.items, priceParts(whitening.amount), 'whitening')}
      ${priceCard(fourImplants.title, fourImplants.items, priceParts(fourImplants.amount), 'four-implants')}
      ${priceCard(premium.title, premium.items, priceParts(premium.amount), 'premium')}
      <section class="other-services"><h2>${escapeHtml(otherServicesLabel)}</h2>${other
        .map(
          (item) =>
            `<div><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.price.label)}</p><strong>${escapeHtml(item.price.amount)}</strong></div>`,
        )
        .join('')}</section>
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
const logoData = readFileSync(logoImage).toString('base64');
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({
  viewport: { width: imageWidth, height: imageHeight },
  deviceScaleFactor: 1,
});
const boardTransform = homography(
  [
    [0, 0],
    [boardWidth, 0],
    [boardWidth, boardHeight],
    [0, boardHeight],
  ],
  [
    [1646, 419],
    [2240, 364],
    [2120, 1464],
    [1420, 1464],
  ],
);
const transform = matrix3d(boardTransform);
for (const locale of Object.keys(locales)) {
  const full = join(outputDirectory, `DV-cjenik-${locale}-2600.webp`);
  await page.setContent(
    `<!doctype html><style>
      @font-face{font-family:DVMontserrat;src:url(data:font/ttf;base64,${fontRegular}) format('truetype');font-weight:400}
      @font-face{font-family:DVMontserrat;src:url(data:font/ttf;base64,${fontMedium}) format('truetype');font-weight:500}
      @font-face{font-family:DVMontserrat;src:url(data:font/ttf;base64,${fontSemiBold}) format('truetype');font-weight:600}
      @font-face{font-family:DVMontserrat;src:url(data:font/ttf;base64,${fontBold}) format('truetype');font-weight:700}
      *{box-sizing:border-box}html,body{margin:0;width:2600px;height:1464px;overflow:hidden}
      #scene{position:relative;width:2600px;height:1464px;background:url(data:image/webp;base64,${sourceData}) center/cover}
      #board{position:absolute;left:0;top:0;width:${boardWidth}px;height:${boardHeight}px;overflow:hidden;background:#f5f1f2;color:#005d70;font-family:DVMontserrat,Arial,sans-serif;transform-origin:0 0;transform:${transform}}
      .board-logo{position:absolute;top:52px;left:54px;width:234px;height:auto}.rule{position:absolute;display:block;height:5px;background:#006477}.header-rule{top:132px;left:54px;width:540px;height:2px}.first-rule{top:160px;left:60px;width:255px}.whitening-rule{top:160px;left:337px;width:275px}.four-rule{top:463px;left:75px;width:248px}.other-rule{top:534px;left:343px;width:267px}.premium-rule{top:723px;left:88px;width:242px}
      .localized-header{position:absolute;top:51px;left:402px;width:214px;text-align:right}.localized-header h1{margin:0;font-size:20px;line-height:1;font-weight:700;font-style:italic}.localized-header p{margin:8px 0 0;font-size:7px;line-height:1.1;color:#506b73}
      .localized-card{position:absolute;color:#172126}.localized-card h2,.other-services h2,.other-services h3{margin:0;color:#172126;font-size:12.5px;line-height:1.16;font-weight:600}.localized-card h2{font-weight:700}.localized-card ul{margin:13px 0 0;padding:0;list-style:none;font-size:8.6px;line-height:1.24;font-weight:500}.localized-card li{position:relative;min-height:0;margin:0 0 8px;padding-left:12px}.localized-card li::before{position:absolute;top:1px;left:0;width:8.5px;height:8.5px;background:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cg fill='none' stroke='%23b2c827' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5'%3E%3Cpath d='m7 12.5 3 3 7-7'/%3E%3Cpath d='M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10Z'/%3E%3C/g%3E%3C/svg%3E") center/contain no-repeat;content:''}.localized-card .price-label{position:absolute;bottom:10px;left:0;margin:0;font-size:7.5px;line-height:1;color:#172126;font-weight:400}.localized-card .amount{position:absolute;right:0;bottom:1px;margin:0;color:#005d70;font-size:18px;line-height:1;font-weight:600;white-space:nowrap}.first-visit{left:74px;top:177px;width:233px;height:265px}.first-visit li{margin-bottom:9px}.whitening{left:353px;top:177px;width:244px;height:335px}.whitening ul{margin-top:26px;font-size:8.3px;line-height:1.24}.whitening li{margin-bottom:8px}.four-implants{left:88px;top:480px;width:226px;height:225px}.four-implants li{margin-bottom:5px}.locale-de .four-implants ul{font-size:7.8px;line-height:1.18}.locale-de .four-implants li{margin-bottom:3px}.premium{left:99px;top:744px;width:232px;height:223px}.premium ul{font-size:8.2px;line-height:1.22}.premium li{margin-bottom:5px}.other-services{position:absolute;top:551px;left:353px;width:242px;color:#172126}.other-services>h2{font-size:12.5px;margin-bottom:12px}.other-services div{position:relative;height:70px}.other-services h3{font-size:10px;line-height:1.18;font-weight:600}.other-services p{position:absolute;bottom:15px;left:0;margin:0;font-size:7.5px;font-weight:400}.other-services strong{position:absolute;right:0;bottom:5px;color:#005d70;font-size:18px;line-height:1;font-weight:600;white-space:nowrap}footer{position:absolute;top:982px;left:94px;right:34px;margin:0;color:#506b73;font-size:5.8px;line-height:1;text-align:left}
    </style><div id="scene">${priceBoard(locale)}</div>`,
  );
  if (process.env.DV_PRICE_LIST_DEBUG === 'flat') {
    const board = page.locator('#board');
    await board.evaluate((element) => {
      element.style.transform = 'none';
    });
    await board.screenshot({
      path: join(diagnosticDirectory, `price-list-flat-${locale}.png`),
    });
    await board.evaluate((element) => {
      element.style.transform = '';
    });
  }
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
