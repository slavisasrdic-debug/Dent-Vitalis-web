import { execFile } from 'node:child_process';
import { constants } from 'node:fs';
import {
  chmod,
  copyFile,
  lstat,
  mkdir,
  mkdtemp,
  readFile,
  readdir,
  rm,
  writeFile,
} from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { tmpdir } from 'node:os';
import { isAbsolute, join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { promisify } from 'node:util';

const run = promisify(execFile);
const sha256 = (bytes) => createHash('sha256').update(bytes).digest('hex');

async function inventory(directory, prefix = '') {
  if (!(await lstat(directory)).isDirectory())
    throw new Error('Release source must be a real directory, not a symlink.');
  const files = [];
  const directories = [];
  for (const name of (await readdir(directory)).sort()) {
    const path = join(directory, name);
    const relative = prefix + name;
    const entry = await lstat(path);
    if (entry.isDirectory()) {
      directories.push(relative);
      const nested = await inventory(path, relative + '/');
      files.push(...nested.files);
      directories.push(...nested.directories);
    } else if (entry.isFile()) files.push(relative);
    else throw new Error('Release contains a symlink or non-regular entry.');
  }
  return { files: files.sort(), directories };
}

export async function packageCpanelRelease(source, output) {
  if (!isAbsolute(source) || !isAbsolute(output) || !output.endsWith('.zip'))
    throw new Error('Use absolute source and .zip output paths.');
  source = resolve(source);
  output = resolve(output);
  const entries = await inventory(source);
  const manifestBytes = await readFile(join(source, 'release-manifest.json'));
  const manifest = JSON.parse(manifestBytes);
  if (manifest.format !== 1 || !Array.isArray(manifest.files))
    throw new Error('A supported static release manifest is required.');
  const expected = new Map();
  for (const file of manifest.files) {
    if (
      typeof file.path !== 'string' ||
      file.path.includes('\\') ||
      file.path
        .split('/')
        .some((part) => !part || part === '.' || part === '..') ||
      file.path === 'release-manifest.json' ||
      expected.has(file.path) ||
      !Number.isSafeInteger(file.bytes) ||
      file.bytes < 0 ||
      !/^[a-f0-9]{64}$/.test(file.sha256)
    )
      throw new Error('Invalid or duplicate release manifest entry.');
    expected.set(file.path, file);
  }
  if (
    manifest.fileCount !== expected.size ||
    manifest.totalBytes !==
      [...expected.values()].reduce((sum, file) => sum + file.bytes, 0) ||
    JSON.stringify(entries.files) !==
      JSON.stringify([...expected.keys(), 'release-manifest.json'].sort())
  )
    throw new Error('Release file inventory does not match its manifest.');
  try {
    await lstat(output);
    throw new Error('Output already exists; refusing to overwrite it.');
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
  const temporary = await mkdtemp(join(tmpdir(), 'dentvitalis-safe-zip-'));
  try {
    const staged = join(temporary, 'payload');
    await mkdir(staged);
    await chmod(staged, 0o755);
    for (const directory of entries.directories) {
      await mkdir(join(staged, directory));
      await chmod(join(staged, directory), 0o755);
    }
    let totalBytes = 0;
    for (const path of entries.files) {
      const bytes = await readFile(join(source, path));
      if (path === 'release-manifest.json') {
        if (!bytes.equals(manifestBytes))
          throw new Error('Manifest changed while packaging.');
      } else {
        const record = expected.get(path);
        if (bytes.length !== record.bytes || sha256(bytes) !== record.sha256)
          throw new Error('Release bytes do not match the manifest.');
      }
      const destination = join(staged, path);
      await writeFile(destination, bytes, { flag: 'wx', mode: 0o644 });
      await chmod(destination, 0o644);
      totalBytes += bytes.length;
    }
    const archive = join(temporary, 'release.zip');
    await run('zip', ['-q', '-r', '-X', archive, '.'], { cwd: staged });
    await run('unzip', ['-tq', archive]);
    // Exclusive publication preserves every existing artifact, including on races.
    await copyFile(archive, output, constants.COPYFILE_EXCL);
    const bytes = await readFile(archive);
    return {
      archiveName: output.split('/').at(-1),
      compressedZipBytes: bytes.length,
      sha256: sha256(bytes),
      contentGitCommit: manifest.gitCommit,
      totalFilesIncludingManifest: entries.files.length,
      directories: entries.directories.length,
      logicalUnpackedBytesIncludingManifest: totalBytes,
      manifestSha256: sha256(manifestBytes),
      fileMode: '0644',
      directoryMode: '0755',
      crcPassed: true,
    };
  } finally {
    // This is only our mkdtemp staging area, never the source or output.
    await rm(temporary, { recursive: true, force: true });
  }
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(resolve(process.argv[1])).href
) {
  const [sourceFlag, source, outputFlag, output, ...extra] =
    process.argv.slice(2);
  if (sourceFlag !== '--source' || outputFlag !== '--output' || extra.length)
    throw new Error(
      'Usage: npm run release:zip -- --source /absolute/release --output /absolute/new.zip',
    );
  console.log(
    JSON.stringify(await packageCpanelRelease(source, output), null, 2),
  );
}
