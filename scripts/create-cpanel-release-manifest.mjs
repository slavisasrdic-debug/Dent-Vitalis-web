import { createHash } from 'node:crypto';
import { readFile, readdir, stat, writeFile } from 'node:fs/promises';
import { relative, resolve } from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);
const root = resolve(import.meta.dirname, '..');
const dist = resolve(root, 'dist');
const manifestPath = resolve(dist, 'release-manifest.json');
const excludedNames = new Set(['release-manifest.json']);

async function filesIn(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map(async (entry) => {
      const path = resolve(directory, entry.name);
      if (entry.isDirectory()) return filesIn(path);
      return entry.isFile() && !excludedNames.has(entry.name) ? [path] : [];
    }),
  );
  return nested.flat().sort();
}

async function git(command) {
  const { stdout } = await execFileAsync('git', command, { cwd: root });
  return stdout.trim();
}

try {
  await stat(resolve(dist, 'index.html'));
} catch {
  throw new Error('dist/index.html is missing; run npm run build first.');
}

if (await git(['status', '--porcelain', '--untracked-files=no'])) {
  throw new Error(
    'Tracked changes are present. Commit the verified release before creating its manifest.',
  );
}

const files = await Promise.all(
  (await filesIn(dist)).map(async (path) => {
    const contents = await readFile(path);
    return {
      path: relative(dist, path).replaceAll('\\', '/'),
      bytes: contents.byteLength,
      sha256: createHash('sha256').update(contents).digest('hex'),
    };
  }),
);
const totalBytes = files.reduce((total, file) => total + file.bytes, 0);
const manifest = {
  format: 1,
  purpose: 'cPanel static release integrity record',
  generatedAt: new Date().toISOString(),
  gitCommit: await git(['rev-parse', 'HEAD']),
  backendPrerequisites: {
    existingBootstrap: '/home2/dentvita/public_html/index.php',
    tokenEndpoint: '/form-tokens',
    tokenTemplate:
      '/home2/dentvita/application/view/template/form-tokens.phtml',
    tokenTemplateSha256: createHash('sha256')
      .update(
        await readFile(
          resolve(root, 'server/application/view/template/form-tokens.phtml'),
        ),
      )
      .digest('hex'),
    uploadGuard:
      '/home2/dentvita/application/view/template/form-request-guard.php',
    uploadGuardSha256: createHash('sha256')
      .update(
        await readFile(
          resolve(
            root,
            'server/application/view/template/form-request-guard.php',
          ),
        ),
      )
      .digest('hex'),
    installedByThisPackage: false,
    acceptanceRequired: [
      'session-tokens',
      'safe-upload',
      'email-receipt',
      'crm-lead',
      'backup-and-rollback',
    ],
  },
  fileCount: files.length,
  totalBytes,
  files,
};

await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
console.log(
  `Release manifest written: ${files.length} files, ${totalBytes} bytes, ${manifest.gitCommit.slice(0, 12)}`,
);
