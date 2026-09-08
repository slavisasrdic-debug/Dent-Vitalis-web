import { readFile, writeFile, mkdir, copyFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import { createHash } from 'node:crypto';
import './prepare-font-extensions.mjs';

const source = 'source-assets/webflow-export/2026-09-07/extracted';
const html = await readFile(`${source}/index.html`, 'utf8');
const names = [
  ...new Set(
    [...html.matchAll(/(?:src|srcset)="(images\/[^"]+)"/g)].flatMap((match) =>
      match[1].split(',').map((item) => item.trim().replace(/ \d+w$/, '')),
    ),
  ),
];
const manifest = {};
await mkdir('public/assets/images', { recursive: true });
await mkdir('public/assets/fonts', { recursive: true });
await mkdir('public/assets/video', { recursive: true });
for (const filename of names.filter((name) => !/-p-\d+\./.test(name))) {
  const input = `${source}/${filename}`;
  const basename = path.basename(filename);
  if (filename.endsWith('.svg')) {
    await copyFile(input, `public/assets/images/${basename}`);
    manifest[basename] = { src: `/assets/images/${basename}`, source: input };
    continue;
  }
  const metadata = await sharp(input).metadata();
  const widths = [
    ...new Set(
      [320, 500, 800, 1080, 1400, metadata.width].filter(
        (width) => width <= metadata.width,
      ),
    ),
  ];
  const stem = basename.replace(/\.[^.]+$/, '');
  const variants = [];
  for (const width of widths) {
    const output = `${stem}-${width}.webp`;
    if (width === metadata.width && metadata.format === 'webp')
      await copyFile(input, `public/assets/images/${output}`);
    else
      await sharp(input)
        .resize({ width, withoutEnlargement: true })
        .webp({ quality: 95 })
        .toFile(`public/assets/images/${output}`);
    variants.push({ src: `/assets/images/${output}`, width });
  }
  manifest[basename] = {
    src: variants.at(-1).src,
    width: metadata.width,
    height: metadata.height,
    variants,
    source: input,
  };
}
for (const name of ['Dentvitalis_video-left', 'DV-MObile-video01_3']) {
  for (const suffix of ['_mp4.mp4', '_webm.webm', '_poster.0000000.jpg']) {
    await copyFile(
      `${source}/videos/${name}${suffix}`,
      `public/assets/video/${name}${suffix}`,
    );
  }
}
// Exact accepted font binaries; only variants actually used by the home page.
const fontSources = {
  300: 'JTUHjIg1_i6t8kCHKm4532VJOt5-QNFgpCs16Hw5aX8.ttf',
  400: 'JTUHjIg1_i6t8kCHKm4532VJOt5-QNFgpCtr6Hw5aX8.ttf',
  500: 'JTUHjIg1_i6t8kCHKm4532VJOt5-QNFgpCtZ6Hw5aX8.ttf',
  600: 'JTUHjIg1_i6t8kCHKm4532VJOt5-QNFgpCu173w5aX8.ttf',
  700: 'JTUHjIg1_i6t8kCHKm4532VJOt5-QNFgpCuM73w5aX8.ttf',
  800: 'JTUHjIg1_i6t8kCHKm4532VJOt5-QNFgpCvr73w5aX8.ttf',
  italic400: 'JTUFjIg1_i6t8kCHKm459Wx7xQYXK0vOoz6jq6R9WXh0ow.ttf',
};
for (const filename of Object.values(fontSources)) {
  await copyFile(
    `reference/webflow-handoff/2026-09-07/extracted/assets/fonts/${filename}`,
    `public/assets/fonts/${filename}`,
  );
}
const external = 'source-assets/external-images/2026-09-07';
await mkdir(`${external}/flagcdn/w40`, { recursive: true });
const flagManifest = [];
for (const country of ['it', 'hr', 'de', 'gb', 'si']) {
  const original = `${external}/flagcdn/w40/${country}.png`;
  const url = `https://flagcdn.com/w40/${country}.png`;
  let bytes;
  try {
    bytes = await readFile(original);
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
    const response = await fetch(url);
    if (!response.ok)
      throw new Error(`Flag fetch failed: ${country}`, { cause: error });
    bytes = Buffer.from(await response.arrayBuffer());
    await writeFile(original, bytes, { flag: 'wx' });
  }
  const output = `public/assets/images/flag-${country}.png`;
  await writeFile(output, bytes);
  flagManifest.push({
    url,
    original,
    output,
    sha256: createHash('sha256').update(bytes).digest('hex'),
  });
}
await writeFile(
  `${external}/flags.json`,
  JSON.stringify(flagManifest, null, 2) + '\n',
);
for (const name of [
  '62434fa732124ac15112aad5_twitter small.svg',
  '62434fa732124a389912aad8_linkedin small.svg',
  '62434fa732124a51bf12aae9_facebook small.svg',
])
  await copyFile(`${external}/${name}`, `public/assets/images/${name}`);
await mkdir('src/content', { recursive: true });
await writeFile(
  'src/content/home-assets.json',
  JSON.stringify(manifest, null, 2) + '\n',
);
console.log(
  `Prepared ${Object.keys(manifest).length} original images, six font weights and both reference videos.`,
);
