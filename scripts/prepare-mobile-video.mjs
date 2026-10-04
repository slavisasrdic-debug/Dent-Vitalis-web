import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { execFileSync, spawnSync } from 'node:child_process';
import { copyFile, mkdtemp, readFile, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

// Optional regeneration. Normal builds use the committed derivative/manifest.
// Never overwrite the accepted source, WebM alternative, or first-frame poster.
const source = 'public/assets/video/DV-MObile-video01_3_mp4.mp4';
const temporary = await mkdtemp(join(tmpdir(), 'dentvitalis-mobile-video-'));
const candidate = join(temporary, 'candidate.mp4');
const sha = (bytes) => createHash('sha256').update(bytes).digest('hex');
const original = await readFile(source);
const probe = (path) =>
  JSON.parse(
    execFileSync('ffprobe', [
      '-v',
      'error',
      '-show_entries',
      'stream=width,height,codec_name,pix_fmt,r_frame_rate,nb_frames:format=duration',
      '-of',
      'json',
      path,
    ]),
  );
execFileSync('ffmpeg', [
  '-nostdin',
  '-v',
  'error',
  '-i',
  source,
  '-an',
  '-c:v',
  'libx264',
  '-preset',
  'slow',
  '-crf',
  '20',
  '-pix_fmt',
  'yuv420p',
  '-threads',
  '2',
  '-movflags',
  '+faststart',
  candidate,
]);
const before = probe(source);
const after = probe(candidate);
assert.deepEqual(
  after,
  before,
  'Keep dimensions, duration, frames, and codec.',
);
// Normalize timestamp units before comparing every corresponding decoded frame.
const check = spawnSync(
  'ffmpeg',
  [
    '-nostdin',
    '-hide_banner',
    '-nostats',
    '-i',
    source,
    '-i',
    candidate,
    '-lavfi',
    '[0:v]settb=AVTB,setpts=PTS-STARTPTS[a];[1:v]settb=AVTB,setpts=PTS-STARTPTS[b];[a][b]ssim',
    '-threads',
    '2',
    '-f',
    'null',
    '-',
  ],
  { encoding: 'utf8' },
);
assert.equal(check.status, 0, check.stderr);
const ssim = Number(/All:([0-9.]+)/.exec(check.stderr)?.[1]);
assert.ok(ssim >= 0.99, 'SSIM must be >= 0.99; visual QA is still required.');
const bytes = await readFile(candidate);
assert.ok(bytes.length < original.length * 0.8, 'Require at least 20% saving.');
assert.equal(sha(await readFile(source)), sha(original));
const path = `/assets/video/DV-MObile-video01_3_optimized-${sha(bytes).slice(0, 12)}.mp4`;
await copyFile(candidate, 'public' + path);
const manifest = {
  source,
  sourceSha256: sha(original),
  sourceBytes: original.length,
  path,
  sha256: sha(bytes),
  bytes: bytes.length,
  ssim,
  media: after,
  encoder:
    'ffmpeg 6.1.1 / libx264, slow, CRF 20, yuv420p, threads 2, faststart',
};
await writeFile(
  'src/content/mobile-video-optimization.json',
  JSON.stringify(manifest, null, 2) + '\n',
);
console.log(JSON.stringify(manifest, null, 2));
