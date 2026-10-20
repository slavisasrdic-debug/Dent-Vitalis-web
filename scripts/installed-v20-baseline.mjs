import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { resolve } from 'node:path';
import v15 from '../data/seo/elfsight-favicon-v15-release-20261006.json' with { type: 'json' };
import v16 from '../data/seo/video-schema-v16-release-20261006.json' with { type: 'json' };
import v18 from '../data/seo/contact-address-v18-release-20261007.json' with { type: 'json' };
import v19 from '../data/seo/footer-address-v19-release-20261007.json' with { type: 'json' };
import v20 from '../data/seo/testimonial-videos-v20-release-20261007.json' with { type: 'json' };
import v21 from '../data/seo/text-boundaries-v21-release-20261008.json' with { type: 'json' };
import v22 from '../data/seo/navigation-text-v22-release-20261012.json' with { type: 'json' };
import v23 from '../data/seo/elfsight-loader-v23-release-20261015.json' with { type: 'json' };
import v24 from '../data/seo/cookie-position-v24-release-20261015.json' with { type: 'json' };

export const sha256 = (bytes) =>
  createHash('sha256').update(bytes).digest('hex');
export async function installedV20Baseline() {
  const receipts = [v20, v19, v18, v16, v15];
  for (const receipt of receipts)
    assert.equal(
      sha256(await readFile(resolve('.astro/releases', receipt.archiveName))),
      receipt.sha256,
      receipt.archiveName,
    );
  const cache = new Map();
  const read = (path) => {
    if (!cache.has(path)) {
      const receipt =
        receipts.find(
          (r) => Array.isArray(r.publicFiles) && r.publicFiles.includes(path),
        ) ?? v15;
      cache.set(
        path,
        execFileSync(
          'unzip',
          [
            '-p',
            resolve('.astro/releases', receipt.archiveName),
            'public_html/' + path,
          ],
          { maxBuffer: 3 * 1024 * 1024 },
        ),
      );
    }
    return cache.get(path);
  };
  const manifestBytes = read('release-manifest.json');
  const manifest = JSON.parse(manifestBytes);
  assert.equal(manifest.revision, v20.revision);
  for (const file of manifest.files.filter((f) => f.path.endsWith('.html')))
    assert.equal(sha256(read(file.path)), file.sha256, file.path);
  return { manifest, manifestBytes, read, receipt: v20 };
}

// V21 contains every HTML baseline and the manifest; no chain reconstruction needed.
export async function installedV21Baseline() {
  const archive = resolve('.astro/releases', v21.archiveName);
  assert.equal(sha256(await readFile(archive)), v21.sha256, v21.archiveName);
  const cache = new Map();
  const read = (path) => {
    if (!cache.has(path))
      cache.set(
        path,
        execFileSync('unzip', ['-p', archive, 'public_html/' + path], {
          maxBuffer: 3 * 1024 * 1024,
        }),
      );
    return cache.get(path);
  };
  const manifestBytes = read('release-manifest.json');
  const manifest = JSON.parse(manifestBytes);
  assert.equal(manifest.revision, v21.revision);
  for (const file of manifest.files.filter((file) =>
    file.path.endsWith('.html'),
  ))
    assert.equal(sha256(read(file.path)), file.sha256, file.path);
  return { manifest, manifestBytes, read, receipt: v21 };
}

export async function installedV22Baseline() {
  const base = await installedV21Baseline();
  const archive = resolve('.astro/releases', v22.archiveName);
  assert.equal(sha256(await readFile(archive)), v22.sha256, v22.archiveName);
  const cache = new Map();
  const read = (path) => {
    if (!v22.publicFiles.includes(path)) return base.read(path);
    if (!cache.has(path))
      cache.set(
        path,
        execFileSync('unzip', ['-p', archive, 'public_html/' + path], {
          maxBuffer: 3 * 1024 * 1024,
        }),
      );
    return cache.get(path);
  };
  const manifestBytes = read('release-manifest.json');
  const manifest = JSON.parse(manifestBytes);
  assert.equal(manifest.revision, v22.revision);
  for (const file of manifest.files.filter((file) =>
    file.path.endsWith('.html'),
  ))
    assert.equal(sha256(read(file.path)), file.sha256, file.path);
  return { manifest, manifestBytes, read, receipt: v22 };
}

export async function installedV23Baseline(suppliedBase) {
  const base = suppliedBase ?? (await installedV22Baseline());
  const archive = resolve('.astro/releases', v23.archiveName);
  assert.equal(sha256(await readFile(archive)), v23.sha256, v23.archiveName);
  const cache = new Map();
  const read = (path) => {
    if (!v23.publicFiles.includes(path)) return base.read(path);
    if (!cache.has(path))
      cache.set(
        path,
        execFileSync('unzip', ['-p', archive, 'public_html/' + path], {
          maxBuffer: 3 * 1024 * 1024,
        }),
      );
    return cache.get(path);
  };
  const manifestBytes = read('release-manifest.json'),
    manifest = JSON.parse(manifestBytes);
  assert.equal(manifest.revision, v23.revision);
  for (const file of manifest.files.filter((file) =>
    file.path.endsWith('.html'),
  ))
    assert.equal(sha256(read(file.path)), file.sha256, file.path);
  return { manifest, manifestBytes, read, receipt: v23 };
}

export async function installedV24Baseline() {
  const base = await installedV22Baseline();
  const archive = resolve('.astro/releases', v24.archiveName);
  assert.equal(sha256(await readFile(archive)), v24.sha256, v24.archiveName);
  const cache = new Map();
  const read = (path) => {
    if (!v24.publicFiles.includes(path)) return base.read(path);
    if (!cache.has(path))
      cache.set(
        path,
        execFileSync('unzip', ['-p', archive, 'public_html/' + path], {
          maxBuffer: 3 * 1024 * 1024,
        }),
      );
    return cache.get(path);
  };
  const manifestBytes = read('release-manifest.json');
  const manifest = JSON.parse(manifestBytes);
  assert.equal(manifest.revision, v24.revision);
  for (const file of manifest.files.filter((f) => f.path.endsWith('.html')))
    assert.equal(sha256(read(file.path)), file.sha256, file.path);
  return { manifest, manifestBytes, read, receipt: v24 };
}
