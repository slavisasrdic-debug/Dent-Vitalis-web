import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { createHash } from 'node:crypto';
import {
  chmod,
  mkdir,
  mkdtemp,
  readFile,
  rm,
  stat,
  symlink,
  writeFile,
} from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { promisify } from 'node:util';
import test from 'node:test';
import { packageCpanelRelease } from './package-cpanel-release.mjs';

const run = promisify(execFile);

async function fixture(t) {
  const root = await mkdtemp(join(tmpdir(), 'dentvitalis-zip-test-'));
  t.after(() => rm(root, { recursive: true, force: true }));
  const source = join(root, 'source');
  await mkdir(join(source, '_pages', 'hr'), { recursive: true });
  const payload = new Map([
    ['index.html', Buffer.from('static index\n')],
    ['.htaccess', Buffer.from('DirectoryIndex index.html index.php\n')],
    ['_pages/hr/hvala.html', Buffer.from('hvala\n')],
  ]);
  const files = [];
  for (const [path, bytes] of payload) {
    await writeFile(join(source, path), bytes);
    await chmod(join(source, path), 0o666);
    files.push({
      path,
      bytes: bytes.length,
      sha256: createHash('sha256').update(bytes).digest('hex'),
    });
  }
  await chmod(join(source, '_pages'), 0o777);
  await chmod(join(source, '_pages/hr'), 0o777);
  const manifest = {
    format: 1,
    gitCommit: 'fixture',
    files,
    fileCount: files.length,
    totalBytes: files.reduce((sum, file) => sum + file.bytes, 0),
  };
  await writeFile(
    join(source, 'release-manifest.json'),
    JSON.stringify(manifest),
  );
  return { root, source, payload };
}

test('ZIP extracts to 0644/0755 with identical manifest and payload; source modes stay unchanged', async (t) => {
  const { root, source, payload } = await fixture(t);
  const output = join(root, 'safe.zip');
  const result = await packageCpanelRelease(source, output);
  const extracted = join(root, 'extracted');
  await mkdir(extracted);
  await run('unzip', ['-q', output, '-d', extracted]);
  for (const [path, bytes] of payload) {
    assert.deepEqual(await readFile(join(extracted, path)), bytes);
    assert.equal((await stat(join(extracted, path))).mode & 0o777, 0o644);
    assert.equal((await stat(join(source, path))).mode & 0o777, 0o666);
  }
  assert.deepEqual(
    await readFile(join(extracted, 'release-manifest.json')),
    await readFile(join(source, 'release-manifest.json')),
  );
  for (const path of ['_pages', '_pages/hr'])
    assert.equal((await stat(join(extracted, path))).mode & 0o777, 0o755);
  assert.equal((await stat(join(source, '_pages'))).mode & 0o777, 0o777);
  assert.equal(result.totalFilesIncludingManifest, 4);
  assert.equal(result.crcPassed, true);
});

test('an existing output is never overwritten', async (t) => {
  const { root, source } = await fixture(t);
  const output = join(root, 'existing.zip');
  await writeFile(output, 'keep');
  await assert.rejects(
    packageCpanelRelease(source, output),
    /refusing to overwrite/,
  );
  assert.equal(await readFile(output, 'utf8'), 'keep');
});

test('changed payload and files outside the manifest are rejected', async (t) => {
  const { root, source } = await fixture(t);
  await writeFile(join(source, 'index.html'), 'changed');
  await assert.rejects(
    packageCpanelRelease(source, join(root, 'changed.zip')),
    /bytes do not match/,
  );
  await writeFile(join(source, 'extra.php'), 'not in the manifest');
  await assert.rejects(
    packageCpanelRelease(source, join(root, 'extra.zip')),
    /inventory does not match/,
  );
});

test('symlinks are rejected, not copied or followed', async (t) => {
  const { root, source } = await fixture(t);
  await symlink(join(source, 'index.html'), join(source, 'link'));
  await assert.rejects(
    packageCpanelRelease(source, join(root, 'link.zip')),
    /symlink/,
  );
});
