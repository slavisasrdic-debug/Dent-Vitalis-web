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
