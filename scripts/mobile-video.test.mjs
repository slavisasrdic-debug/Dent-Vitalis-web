import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import optimization from '../src/content/mobile-video-optimization.json' with { type: 'json' };
import { videoUrl } from '../src/content/background-videos.ts';

const sha = (bytes) => createHash('sha256').update(bytes).digest('hex');
test('smaller derivative and immutable source both match their recorded hashes', async () => {
  const source = await readFile(optimization.source);
  const derivative = await readFile('public' + optimization.path);
  assert.equal(sha(source), optimization.sourceSha256);
  assert.equal(sha(derivative), optimization.sha256);
  assert.equal(source.length, optimization.sourceBytes);
  assert.equal(derivative.length, optimization.bytes);
  assert.ok(derivative.length < source.length * 0.8);
  assert.ok(optimization.ssim >= 0.99);
  assert.equal(optimization.media.streams[0].width, 406);
  assert.equal(optimization.media.streams[0].height, 720);
  assert.equal(optimization.media.streams[0].nb_frames, '350');
  assert.equal(optimization.media.streams[0].r_frame_rate, '30/1');
});

test('only mobile MP4 changes; all video URLs retain the actual content version', async () => {
  const mobile = new URL(
    videoUrl('DV-MObile-video01_3', 'mp4'),
    'https://example.test',
  );
  assert.equal(mobile.pathname, optimization.path);
  assert.equal(mobile.searchParams.get('v'), optimization.sha256);
  for (const [name, format] of [
    ['DV-MObile-video01_3', 'webm'],
    ['Dentvitalis_video-left', 'mp4'],
    ['Dentvitalis_video-left', 'webm'],
  ]) {
    const url = new URL(videoUrl(name, format), 'https://example.test');
    assert.equal(url.pathname, `/assets/video/${name}_${format}.${format}`);
    assert.equal(
      url.searchParams.get('v'),
      sha(await readFile('public' + url.pathname)),
    );
  }
});
