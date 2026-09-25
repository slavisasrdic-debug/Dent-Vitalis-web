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

const locales = {
  hr: {
    table: 19,
    column: 1,
    source: 'hr-source.json',
    boardTitle: 'CJENIK',
    priceLabel: 'Cijena',
    country: 'Hrvatska',
  },
  de: {
    table: 18,
    column: 0,
    source: 'de-source.json',
    boardTitle: 'PREISLISTE',
    priceLabel: 'Preis',
    country: 'Kroatien',
  },
  en: {
    table: 18,
    column: 0,
    source: 'en-source.json',
    boardTitle: 'PRICE LIST',
    priceLabel: 'Price',
    country: 'Croatia',
  },
  sl: {
    table: 18,
    column: 0,
    source: 'sl-source.json',
    boardTitle: 'CENIK',
    priceLabel: 'Cena',
    country: 'Hrvaška',
  },
};

function escapeXml(value) {
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

function wrap(value, characters) {
  const words = value.replace(/\s+/g, ' ').split(' ');
  const lines = [];
  let line = '';
  for (const word of words) {
    if (`${line} ${word}`.trim().length > characters && line) {
      lines.push(line);
      line = word;
    } else line = `${line} ${word}`.trim();
  }
  if (line) lines.push(line);
  return lines;
}

function text(value, x, y, size, weight = 400, anchor = 'start') {
  return `<text x="${x}" y="${y}" fill="#005f73" font-family="Arial, sans-serif" font-size="${size}" font-weight="${weight}" text-anchor="${anchor}">${escapeXml(value)}</text>`;
}

function lines(value, x, y, options = {}) {
  const {
    size = 5.5,
    lineHeight = 7.4,
    weight = 400,
    characters = 35,
    bullet = false,
  } = options;
  return wrap(value, characters)
    .map(
      (line, index) =>
        `${bullet && index === 0 ? text('•', x, y + index * lineHeight, size + 1, 700) : ''}${text(line, x + (bullet ? 7 : 0), y + index * lineHeight, size, weight)}`,
    )
    .join('');
}

function card(title, items, amount, priceLabel, x, y, width, height) {
  const headingLines = wrap(title, 29);
  const heading = headingLines
    .map((line, index) => text(line, x + 10, y + 19 + index * 10, 8.5, 700))
    .join('');
  const start = y + 19 + headingLines.length * 10 + 8;
  const details = items
    .map((item, index) =>
      lines(item, x + 10, start + index * 14, { bullet: true }),
    )
    .join('');
  return `<g><rect x="${x}" y="${y}" width="${width}" height="${height}" fill="#ffffff"/><path d="M ${x} ${y + 2} H ${x + width}" stroke="#00677a" stroke-width="3"/>${heading}${details}${text(priceLabel, x + 10, y + height - 16, 5.5)}${text(amount, x + width - 10, y + height - 12, 13, 700, 'end')}</g>`;
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
  const { boardTitle, priceLabel, country } = locales[locale];
  return `<svg width="630" height="1020" xmlns="http://www.w3.org/2000/svg">
      <rect width="630" height="1020" rx="5" fill="#fbfbfb" stroke="#d9e0e2" stroke-width="4"/>
      <text x="42" y="72" fill="#00677a" font-family="Arial, sans-serif" font-size="29" font-weight="700">DENT<tspan fill="#b2c327">VITALIS</tspan></text>
      ${text(boardTitle, 590, 54, 21, 700, 'end')}
      ${text(subtitle, 590, 75, 8, 400, 'end')}
      <path d="M 34 92 H 596" stroke="#00677a" stroke-width="3"/>
      ${card(firstVisit.title, firstVisit.items, firstVisit.amount, priceLabel, 28, 112, 276, 258)}
      ${card(fourImplants.title, fourImplants.items, fourImplants.amount, priceLabel, 28, 390, 276, 260)}
      ${card(premium.title, premium.items, premium.amount, priceLabel, 28, 670, 276, 270)}
      ${card(whitening.title, whitening.items, whitening.amount, priceLabel, 326, 112, 276, 258)}
      <g><rect x="326" y="390" width="276" height="550" fill="#ffffff"/><path d="M 326 392 H 602" stroke="#00677a" stroke-width="3"/>${text(other[0].title, 336, 420, 12, 700)}${other
        .map(
          (item, index) =>
            `<g>${index ? '<path d="M 336 ' + (490 + index * 105) + ' H 592" stroke="#d9e0e2" stroke-width="1"/>' : ''}${text(item.title, 336, 450 + index * 105, 8, 700)}${text(item.amount, 590, 477 + index * 105, 13, 700, 'end')}</g>`,
        )
        .join('')}</g>
      ${text(`DentVitalis Fides d.o.o.  •  Krešimirova 60, 51000 Rijeka, ${country}`, 34, 990, 5.5)}
  </svg>`;
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
      [1570, 310],
      [2250, 245],
      [2140, 1464],
      [1180, 1464],
    ],
  ),
);
for (const locale of Object.keys(locales)) {
  const full = join(outputDirectory, `DV-cjenik-${locale}-2600.webp`);
  const boardData = (
    await sharp(Buffer.from(priceBoard(locale)))
      .png()
      .toBuffer()
  ).toString('base64');
  await page.setContent(
    `<!doctype html><style>html,body{margin:0;width:2600px;height:1464px;overflow:hidden}#scene{position:relative;width:2600px;height:1464px;background:url(data:image/webp;base64,${sourceData}) center/cover}#board{position:absolute;left:0;top:0;width:630px;height:1020px;transform-origin:0 0;transform:${transform}}</style><div id="scene"><img id="board" src="data:image/png;base64,${boardData}" alt=""></div>`,
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
