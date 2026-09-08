import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import sharp from 'sharp';

const source = 'source-assets/webflow-export/2026-09-07/extracted/videos';
const manifest = {};
await mkdir('public/assets/video', { recursive: true });
for (const name of ['Dentvitalis_video-left', 'DV-MObile-video01_3']) {
  const input = `${source}/${name}_mp4.mp4`;
  const frame = execFileSync(
    'ffmpeg',
    [
      '-v',
      'error',
      '-nostdin',
      '-i',
      input,
      '-frames:v',
      '1',
      '-f',
      'image2pipe',
      '-vcodec',
      'png',
      '-threads',
      '1',
      'pipe:1',
    ],
    { maxBuffer: 10 * 1024 * 1024 },
  );
  const { width, height } = await sharp(frame).metadata();
  const widths = [
    ...new Set([320, 640, 960, width].filter((value) => value <= width)),
  ];
  const variants = [];
  for (const size of widths) {
    const src = `/assets/video/${name}_first-frame-${size}.webp`;
    const data = await sharp(frame)
      .resize({ width: size, withoutEnlargement: true })
      .webp({ quality: 78, effort: 6 })
      .toBuffer();
    await writeFile(`public${src}`, data);
    variants.push({
      src,
      width: size,
      bytes: data.length,
      sha256: createHash('sha256').update(data).digest('hex'),
    });
  }
  manifest[name] = {
    source: input,
    sourceSha256: createHash('sha256')
      .update(await readFile(input))
      .digest('hex'),
    frame: 'first decoded presentation frame; no seek, no crop',
    frameSha256: createHash('sha256').update(frame).digest('hex'),
    width,
    height,
    src: variants.at(-1).src,
    variants,
  };
}
await writeFile(
  'src/content/video-posters.json',
  `${JSON.stringify(manifest, null, 2)}\n`,
);
console.log(
  JSON.stringify(
    Object.fromEntries(
      Object.entries(manifest).map(([name, value]) => [
        name,
        value.variants.map(({ width, bytes }) => ({ width, bytes })),
      ]),
    ),
    null,
    2,
  ),
);
