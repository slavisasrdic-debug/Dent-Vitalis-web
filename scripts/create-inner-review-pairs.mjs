import sharp from 'sharp';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
const root = 'reference/screenshots/2026-09-07-inner';
const pages = JSON.parse(
  await readFile('src/content/inner-pages-it.json', 'utf8'),
);
const results = [];
for (const page of pages) {
  const slug = page.route.slice(1).replaceAll('/', '--');
  const out = `${root}/comparison/${slug}`;
  await mkdir(out, { recursive: true });
  for (const width of [1440, 390]) {
    for (const state of ['top', 'scroll-650']) {
      const reference = `${root}/webflow/${slug}/${width}-${state}.png`;
      const astro = `${root}/astro/${slug}/${width}-${state}.png`;
      await sharp({
        create: {
          width: width * 2,
          height: 928,
          channels: 3,
          background: 'white',
        },
      })
        .composite([
          {
            input: Buffer.from(
              `<svg width="${width * 2}" height="28"><rect width="100%" height="100%" fill="#045a72"/><g fill="white" font-size="16" font-family="Arial"><text x="12" y="20">Webflow</text><text x="${width + 12}" y="20">Astro</text></g></svg>`,
            ),
            left: 0,
            top: 0,
          },
          { input: reference, left: 0, top: 28 },
          { input: astro, left: width, top: 28 },
        ])
        .png()
        .toFile(`${out}/${width}-${state}-pair.png`);
      const rgba = await sharp(astro)
        .ensureAlpha()
        .raw()
        .toBuffer({ resolveWithObject: true });
      for (let i = 3; i < rgba.data.length; i += 4) rgba.data[i] = 128;
      await sharp(reference)
        .composite([{ input: rgba.data, raw: rgba.info }])
        .png()
        .toFile(`${out}/${width}-${state}-overlay.png`);
      const { data, info } = await sharp(reference)
        .composite([{ input: astro, blend: 'difference' }])
        .removeAlpha()
        .raw()
        .toBuffer({ resolveWithObject: true });
      const meanAbsoluteError =
        data.reduce((total, byte) => total + byte, 0) / data.length;
      await sharp(data, { raw: info })
        .png()
        .toFile(`${out}/${width}-${state}-diff.png`);
      results.push({ route: page.route, width, state, meanAbsoluteError });
    }
  }
}
await writeFile(
  `${root}/comparison/metrics.json`,
  JSON.stringify(results, null, 2) + '\n',
);
console.log(
  `Prepared ${results.length} same-viewport pairs, overlays and differences. Metrics include deliberate accessibility/player changes and are not a pixel-equivalence certificate.`,
);
