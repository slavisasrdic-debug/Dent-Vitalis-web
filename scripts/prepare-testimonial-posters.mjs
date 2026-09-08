import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import sharp from 'sharp';
const data = JSON.parse(
  await readFile('src/content/inner-pages-it.json', 'utf8'),
);
const videos = [];
function visit(value) {
  if (!value || typeof value !== 'object') return;
  if (value.type === 'youtube') videos.push(value);
  Object.values(value).forEach(visit);
}
visit(data);
const source = 'source-assets/external-images/2026-09-07/youtube';
await mkdir(source, { recursive: true });
const manifest = [];
for (const video of videos) {
  const url = `https://i.ytimg.com/vi/${video.videoId}/hqdefault.jpg`;
  const original = `${source}/${video.videoId}-hqdefault.jpg`;
  let bytes;
  try {
    bytes = await readFile(original);
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
    const response = await fetch(url, { signal: AbortSignal.timeout(20000) });
    if (!response.ok)
      throw new Error(
        `Reference thumbnail unavailable: ${video.videoId} HTTP ${response.status}`,
        { cause: error },
      );
    bytes = Buffer.from(await response.arrayBuffer());
    await writeFile(original, bytes, { flag: 'wx' });
  }
  const meta = await sharp(bytes).metadata();
  if (meta.width < 320)
    throw new Error(`YouTube placeholder received: ${video.videoId}`);
  const output = `public/assets/images/youtube-${video.videoId}.webp`;
  await sharp(bytes).webp({ quality: 90 }).toFile(output);
  manifest.push({
    videoId: video.videoId,
    title: video.title,
    url,
    original,
    output,
    width: meta.width,
    height: meta.height,
    sha256: createHash('sha256').update(bytes).digest('hex'),
  });
}
await writeFile(
  `${source}/manifest.json`,
  JSON.stringify(manifest, null, 2) + '\n',
);
console.log(
  `Prepared ${manifest.length} exact video thumbnails; no YouTube player needed at page load.`,
);
