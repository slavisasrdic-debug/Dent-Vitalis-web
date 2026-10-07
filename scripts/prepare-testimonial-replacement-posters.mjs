import assert from 'node:assert/strict';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import sharp from 'sharp';
import replacements from '../data/testimonial-video-replacements-20261007.json' with { type: 'json' };

const source = 'source-assets/external-images/2026-10-07/youtube';
await mkdir(source, { recursive: true });
const sha = (bytes) => createHash('sha256').update(bytes).digest('hex');
const manifest = [];
for (const video of replacements.replacements) {
  const url = `https://i.ytimg.com/vi/${video.newId}/maxresdefault.jpg`;
  const original = `${source}/${video.newId}-maxresdefault.jpg`;
  let bytes;
  try {
    bytes = await readFile(original);
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
    const response = await fetch(url, { signal: AbortSignal.timeout(20000) });
    assert.equal(response.status, 200, `New video thumbnail ${video.newId}`);
    bytes = Buffer.from(await response.arrayBuffer());
    await writeFile(original, bytes, { flag: 'wx' });
  }
  const meta = await sharp(bytes).metadata();
  assert.equal(meta.width, 1280, video.newId);
  assert.equal(meta.height, 720, video.newId);
  const output = `public/assets/images/youtube-${video.newId}.webp`;
  const result = await sharp(bytes).webp({ quality: 90 }).toBuffer();
  await writeFile(output, result);
  const oldPoster = await readFile(
    `public/assets/images/youtube-${video.oldId}.webp`,
  );
  assert.notEqual(
    sha(result),
    sha(oldPoster),
    `Poster was merely renamed: ${video.newId}`,
  );
  manifest.push({
    videoId: video.newId,
    oldId: video.oldId,
    title: video.title,
    url,
    original,
    output,
    width: meta.width,
    height: meta.height,
    sourceSha256: sha(bytes),
    sha256: sha(result),
    bytes: result.length,
  });
  console.log(`${video.newId}: actual new 1280x720 poster, ${result.length} B`);
}
assert.equal(manifest.length, 10);
await writeFile(
  `${source}/manifest.json`,
  JSON.stringify(manifest, null, 2) + '\n',
);
