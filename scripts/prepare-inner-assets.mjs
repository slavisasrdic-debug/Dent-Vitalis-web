import { readFile, writeFile, mkdir, copyFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import sharp from 'sharp';
const source = 'source-assets/webflow-export/2026-09-07/extracted/images';
const pages = JSON.parse(
  await readFile('src/content/inner-pages-it.json', 'utf8'),
);
const home = JSON.parse(await readFile('src/content/home-assets.json', 'utf8'));
const aliases = JSON.parse(
  await readFile(
    'reference/webflow-handoff/2026-09-07/external-assets-resolution.json',
    'utf8',
  ),
);
const images = new Set();
function collect(value) {
  if (!value || typeof value !== 'object') return;
  if (value.image) images.add(value.image);
  Object.values(value).forEach(collect);
}
collect(pages);
const manifest = {};
await mkdir('public/assets/images', { recursive: true });
for (const name of images) {
  if (home[name]) continue;
  const alias = aliases.find((a) => a.original_name === name);
  const input = alias?.source_file || `${source}/${name}`;
  const bytes = await readFile(input);
  const sha256 = createHash('sha256').update(bytes).digest('hex');
  if (alias && sha256 !== alias.sha256)
    throw new Error(`Source checksum mismatch: ${name}`);
  const existing = Object.values(manifest).find((a) => a.sha256 === sha256);
  if (existing) {
    manifest[name] = { ...existing, source: input, aliasOf: existing.source };
    continue;
  }
  if (name.endsWith('.svg')) {
    await copyFile(input, `public/assets/images/${name}`);
    manifest[name] = { src: `/assets/images/${name}`, source: input, sha256 };
    continue;
  }
  const meta = await sharp(bytes).metadata();
  const variants = [];
  for (const width of [
    ...new Set(
      [320, 500, 800, 1080, 1400, 2000, meta.width].filter(
        (w) => w <= meta.width,
      ),
    ),
  ]) {
    const output = `${name.replace(/\.[^.]+$/, '')}-${width}.webp`;
    if (width === meta.width && meta.format === 'webp')
      await copyFile(input, `public/assets/images/${output}`);
    else
      await sharp(bytes)
        .resize({ width, withoutEnlargement: true })
        .webp({ quality: 95 })
        .toFile(`public/assets/images/${output}`);
    variants.push({ src: `/assets/images/${output}`, width });
  }
  manifest[name] = {
    src: variants.at(-1).src,
    width: meta.width,
    height: meta.height,
    variants,
    source: input,
    sha256,
  };
}
await writeFile(
  'src/content/inner-assets.json',
  JSON.stringify(manifest, null, 2) + '\n',
);
console.log(
  `Prepared ${Object.keys(manifest).length} inner-page originals; reused ${[...images].filter((i) => home[i]).length} home originals.`,
);
