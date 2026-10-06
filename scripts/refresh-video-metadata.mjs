import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

// Read-only public YouTube metadata; no API key, login or invented midnight.
// Cache raw sources outside Git/build. Reviewed, sourced values live in data/.
const dataPath = 'data/video-metadata.json';
const metadata = JSON.parse(await readFile(dataPath, 'utf8'));
const retrievedOn = new Date().toISOString().slice(0, 10);
const folder = `.astro/audits/video-metadata-${retrievedOn}`;
await mkdir(folder, { recursive: true });
const sha = (bytes) => createHash('sha256').update(bytes).digest('hex');
const dateTime =
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/;
const results = [];
for (const video of metadata.videos) {
  const path = join(folder, `${video.videoId}.html`);
  let bytes;
  try {
    bytes = await readFile(path);
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
    const response = await fetch(video.sourceUrl, {
      // YouTube's public crawler response includes its own dated microformat.
      headers: { 'User-Agent': 'Googlebot' },
      signal: AbortSignal.timeout(30000),
    });
    assert.equal(response.status, 200, video.videoId);
    bytes = Buffer.from(await response.arrayBuffer());
    await writeFile(path, bytes);
  }
  const html = bytes.toString();
  const match = html.match(/ytInitialPlayerResponse\s*=\s*({[\s\S]*?});/);
  assert.ok(match, `No public player metadata: ${video.videoId}`);
  const player = JSON.parse(match[1]);
  assert.equal(player.videoDetails?.videoId, video.videoId);
  const format = player.microformat?.playerMicroformatRenderer;
  const uploadDate = format?.publishDate;
  assert.ok(
    dateTime.test(uploadDate),
    `No verified datetime: ${video.videoId}`,
  );
  assert.ok(Number.isFinite(Date.parse(uploadDate)), video.videoId);
  assert.equal(
    uploadDate.slice(0, 10),
    video.uploadDate.slice(0, 10),
    `Publication day changed: ${video.videoId}`,
  );
  results.push({
    ...video,
    uploadDate,
    sourceTitle: player.videoDetails.title,
    sourceField:
      'ytInitialPlayerResponse.microformat.playerMicroformatRenderer.publishDate',
    sourceUploadDate: format.uploadDate,
    retrievedOn,
    sha256: sha(bytes),
  });
  console.log(`${video.videoId}: ${uploadDate}`);
}
// Commit data only when all thirteen primary sources pass. Partial refreshes
// remain solely in the ignored raw cache and cannot enter production.
assert.equal(results.length, 13);
await writeFile(
  dataPath,
  JSON.stringify(
    {
      description:
        'First-publication datetimes copied exactly from public YouTube player microformat, including its original timezone. Previous day-only publication dates cross-checked; no time or timezone invented.',
      videos: results,
    },
    null,
    2,
  ) + '\n',
);
