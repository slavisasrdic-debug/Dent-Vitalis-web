import { execFile } from 'node:child_process';
import { createHash } from 'node:crypto';
import {
  lstat,
  mkdir,
  mkdtemp,
  readFile,
  rm,
  writeFile,
} from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { isAbsolute, join, resolve } from 'node:path';
import { promisify } from 'node:util';
import review from '../data/seo/legacy-target-review-20261004.json' with { type: 'json' };
import { mergeLegacyHtaccess } from './cpanel-routing.mjs';
import { packageCpanelRelease } from './package-cpanel-release.mjs';

const run = promisify(execFile);
const root = resolve(import.meta.dirname, '..');
const hash = (bytes) => createHash('sha256').update(bytes).digest('hex');
const [sourceFlag, source, outputFlag, output, ...extra] =
  process.argv.slice(2);
if (
  sourceFlag !== '--source-zip' ||
  outputFlag !== '--output' ||
  extra.length ||
  !source?.endsWith('.zip') ||
  !output?.endsWith('.zip') ||
  !isAbsolute(source) ||
  !isAbsolute(output)
)
  throw new Error(
    'Usage: node scripts/revise-cpanel-routing-release.mjs --source-zip /absolute/approved-base.zip --output /absolute/new.zip',
  );
if (process.env.CF_PAGES)
  throw new Error('Not a Cloudflare build or deployment.');
if (
  (
    await run('git', ['status', '--porcelain', '--untracked-files=no'], {
      cwd: root,
    })
  ).stdout.trim()
)
  throw new Error(
    'Commit verified tracked changes before creating a routing revision.',
  );
try {
  await lstat(output);
  throw new Error('Output exists; refusing to overwrite it.');
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
}
const archiveBytes = await readFile(source);
if (hash(archiveBytes) !== review.candidate.sha256)
  throw new Error('Source ZIP is not the previously verified candidate.');
await run('unzip', ['-tq', source]);
const entries = (await run('unzip', ['-Z', '-1', source])).stdout
  .trim()
  .split('\n');
for (const name of entries)
  if (
    name.startsWith('/') ||
    name.includes('\\') ||
    name.split('/').some((part) => part === '..' || part === '.')
  )
    throw new Error('Unsafe source ZIP path.');
const temporary = await mkdtemp(
  join(tmpdir(), 'dentvitalis-routing-revision-'),
);
try {
  const payload = join(temporary, 'payload');
  await mkdir(payload);
  await run('unzip', ['-q', source, '-d', payload]);
  const manifestPath = join(payload, 'release-manifest.json');
  const originalManifestBytes = await readFile(manifestPath);
  const manifest = JSON.parse(originalManifestBytes);
  if (
    manifest.format !== 1 ||
    manifest.files.length !== manifest.fileCount ||
    entries.filter((name) => !name.endsWith('/')).length !==
      manifest.fileCount + 1
  )
    throw new Error('Source manifest/inventory is inconsistent.');
  for (const file of manifest.files) {
    if (
      file.path
        .split('/')
        .some((part) => !part || part === '..' || part === '.') ||
      file.path.includes('\\') ||
      file.path === 'release-manifest.json'
    )
      throw new Error('Unsafe manifest path.');
    const bytes = await readFile(join(payload, file.path));
    if (bytes.length !== file.bytes || hash(bytes) !== file.sha256)
      throw new Error('Source payload does not match its manifest.');
  }
  const documents = JSON.parse(
    await readFile(join(payload, 'page-routes.json'), 'utf8'),
  );
  const htaccess = mergeLegacyHtaccess(
    await readFile(join(payload, '.htaccess')),
    documents,
    { requireApprovedTargets: true },
  );
  // Generated release artifacts only; all page/media/form bytes remain unchanged.
  await writeFile(join(payload, '.htaccess'), htaccess);
  const record = manifest.files.find((file) => file.path === '.htaccess');
  if (!record) throw new Error('Source .htaccess is absent from manifest.');
  record.bytes = htaccess.length;
  record.sha256 = hash(htaccess);
  manifest.totalBytes = manifest.files.reduce(
    (sum, file) => sum + file.bytes,
    0,
  );
  const routingCommit = (
    await run('git', ['rev-parse', 'HEAD'], { cwd: root })
  ).stdout.trim();
  const revisedAt = new Date().toISOString();
  manifest.routingRevision = {
    gitCommit: routingCommit,
    generatedAt: revisedAt,
    parentArchiveName: source.split('/').at(-1),
    parentArchiveSha256: hash(archiveBytes),
    parentManifestSha256: hash(originalManifestBytes),
    approvalFile: 'data/seo/cpanel-redirect-decisions.json',
    approvalFileSha256: hash(
      await readFile(join(root, 'data/seo/cpanel-redirect-decisions.json')),
    ),
    changedPayloadFiles: ['.htaccess'],
    originalStaticContentGitCommit: manifest.gitCommit,
    staticContentOrFrontendRebuilt: false,
  };
  await writeFile(manifestPath, JSON.stringify(manifest, null, 2) + '\n');
  const result = await packageCpanelRelease(payload, output);
  console.log(
    JSON.stringify(
      {
        ...result,
        routingGitCommit: routingCommit,
        changedArchiveFiles: ['.htaccess', 'release-manifest.json'],
        uploadedOrActivated: false,
      },
      null,
      2,
    ),
  );
} finally {
  // Only this task's mkdtemp directory; never the source ZIP or existing release.
  await rm(temporary, { recursive: true, force: true });
}
