import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { postLiveHtaccess } from './post-live-routing.mjs';
import {
  performanceHtaccess,
  performanceCacheBlock,
} from './performance-cache.mjs';

const before = postLiveHtaccess(
  await readFile('docs/seo/handoff-galleria-v8-20261004/.htaccess'),
  JSON.parse(await readFile('dist/page-routes.json')),
);

test('asset cache preserves the complete accepted routing and PHP configuration', () => {
  const after = performanceHtaccess(before);
  assert.equal(after.slice(0, before.length), before);
  assert.equal(after.slice(before.length), performanceCacheBlock);
  assert.throws(() => performanceHtaccess(after));
});

test('only hashed asset filenames receive immutable, never pages or tokens', () => {
  const regex = new RegExp(
    /<FilesMatch "([^"]+)"/.exec(performanceCacheBlock)[1],
  );
  for (const file of [
    'home.AbCd0123.js',
    'HomePage.C9t7JyKq.css',
    '_..hbUBXTid.css',
    'montserrat-5ce8bc33c495.js',
    'DV-MObile-video01_3_optimized-012345abcdef.mp4',
  ])
    assert.ok(regex.test(file), file);
  for (const file of [
    'index.html',
    'hr.html',
    'index.php',
    'form-tokens',
    'sitemap.xml',
    'robots.txt',
    'style.css',
    'script.js',
    'DV-MObile-video01_3_mp4.mp4',
    'montserrat-invalid.js',
  ])
    assert.ok(!regex.test(file), file);
});
