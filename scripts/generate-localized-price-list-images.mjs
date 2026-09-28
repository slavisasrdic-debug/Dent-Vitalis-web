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
  return `<article id="board">
      <i class="erase header-copy"></i><i class="erase first-body"></i><i class="erase first-price"></i><i class="erase whitening-body"></i><i class="erase whitening-price"></i><i class="erase four-body"></i><i class="erase four-price"></i><i class="erase other-heading"></i><i class="erase other-row-one"></i><i class="erase other-row-two"></i><i class="erase other-row-three"></i><i class="erase other-row-four"></i><i class="erase premium-body"></i><i class="erase premium-price"></i><i class="erase footer-copy"></i>
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

async function rectifiedBoard(transform) {
  const { data, info } = await sharp(sourceImage)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const pixels = Buffer.alloc(boardWidth * boardHeight * 4);
  for (let y = 0; y < boardHeight; y++) {
    for (let x = 0; x < boardWidth; x++) {
      const denominator = transform[6] * x + transform[7] * y + 1;
      const imageX = Math.round(
        (transform[0] * x + transform[1] * y + transform[2]) / denominator,
      );
      const imageY = Math.round(
        (transform[3] * x + transform[4] * y + transform[5]) / denominator,
      );
      const clampedX = Math.min(Math.max(imageX, 0), info.width - 1);
      const clampedY = Math.min(Math.max(imageY, 0), info.height - 1);
      const sourceOffset = (clampedY * info.width + clampedX) * 4;
      const targetOffset = (y * boardWidth + x) * 4;
      data.copy(pixels, targetOffset, sourceOffset, sourceOffset + 4);
    }
  }
  return sharp(pixels, {
    raw: { width: boardWidth, height: boardHeight, channels: 4 },
  })
    .png()
    .toBuffer();
}

await mkdir(outputDirectory, { recursive: true });
const sourceData = readFileSync(sourceImage).toString('base64');
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
const boardTemplate = (await rectifiedBoard(boardTransform)).toString('base64');
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
      #board{position:absolute;left:0;top:0;width:${boardWidth}px;height:${boardHeight}px;overflow:hidden;background:url(data:image/png;base64,${boardTemplate}) center/100% 100%;color:#005d70;font-family:DVMontserrat,Arial,sans-serif;transform-origin:0 0;transform:${transform}}
      .erase{position:absolute;display:block;background:rgb(241,236,238)}.header-copy{left:390px;top:43px;width:230px;height:79px}.first-body{left:66px;top:170px;width:252px;height:282px}.first-price{display:none}.whitening-body{left:344px;top:170px;width:266px;height:354px}.whitening-price{display:none}.four-body{left:82px;top:470px;width:246px;height:248px}.four-price{display:none}.other-heading{left:344px;top:542px;width:266px;height:338px}.other-row-one,.other-row-two,.other-row-three,.other-row-four{display:none}.premium-body{left:92px;top:733px;width:255px;height:246px}.premium-price{display:none}.footer-copy{left:88px;top:978px;width:440px;height:20px}
      .localized-header{position:absolute;top:51px;left:402px;width:214px;text-align:right}.localized-header h1{margin:0;font-size:20px;line-height:1;font-weight:700;font-style:italic}.localized-header p{margin:8px 0 0;font-size:7px;line-height:1.1;color:#506b73}
      .localized-card{position:absolute;color:#172126}.localized-card h2,.other-services h2,.other-services h3{margin:0;color:#172126;font-size:13px;line-height:1.16;font-weight:600}.localized-card ul{margin:13px 0 0;padding:0;list-style:none;font-size:8.4px;line-height:1.26;font-weight:500}.localized-card li{position:relative;min-height:18px;margin:0;padding-left:12px}.localized-card li::before{position:absolute;left:0;color:#b2c827;content:'•';font-size:11px;line-height:.75}.localized-card .price-label{position:absolute;bottom:10px;left:0;margin:0;font-size:7.2px;line-height:1;color:#172126;font-weight:400}.localized-card .amount{position:absolute;right:0;bottom:1px;margin:0;color:#005d70;font-size:17px;line-height:1;font-weight:600;white-space:nowrap}.first-visit{left:74px;top:177px;width:233px;height:265px}.whitening{left:353px;top:177px;width:244px;height:335px}.whitening ul{font-size:8px;line-height:1.28}.whitening li{min-height:25px}.four-implants{left:88px;top:480px;width:226px;height:225px}.premium{left:99px;top:744px;width:232px;height:223px}.premium ul{font-size:7.8px;line-height:1.26}.premium li{min-height:17px}.other-services{position:absolute;top:551px;left:353px;width:242px;color:#172126}.other-services>h2{font-size:14px;margin-bottom:15px}.other-services div{position:relative;height:80px}.other-services h3{font-size:10.5px;line-height:1.18;font-weight:600}.other-services p{position:absolute;bottom:18px;left:0;margin:0;font-size:7.2px;font-weight:400}.other-services strong{position:absolute;right:0;bottom:8px;color:#005d70;font-size:17px;line-height:1;font-weight:600;white-space:nowrap}footer{position:absolute;top:982px;left:94px;right:34px;margin:0;color:#506b73;font-size:5.8px;line-height:1;text-align:left}
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
