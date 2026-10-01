import { execFile } from 'node:child_process';
import { readFile, writeFile } from 'node:fs/promises';
import { isAbsolute, resolve } from 'node:path';
import { promisify } from 'node:util';
import { mergeLegacyHtaccess } from './cpanel-routing.mjs';

const run = promisify(execFile);
const root = resolve(import.meta.dirname, '..');
const [flag, suppliedPath, ...unexpected] = process.argv.slice(2);

if (flag !== '--legacy-htaccess' || !suppliedPath || unexpected.length)
  throw new Error(
    'Usage: npm run release:prepare:production -- --legacy-htaccess /absolute/path/to/server-backup/.htaccess',
  );
if (process.env.CF_PAGES)
  throw new Error(
    'Production cPanel releases must not be built inside Cloudflare Pages.',
  );
if (!isAbsolute(suppliedPath))
  throw new Error('The legacy .htaccess backup path must be absolute.');
const legacyPath = resolve(suppliedPath);
if (
  legacyPath.startsWith(root + '/dist/') ||
  legacyPath.startsWith(root + '/public/')
)
  throw new Error(
    'The legacy .htaccess backup must be outside dist/ and public/.',
  );

// Fail before building if the actual legacy routing has not been supplied.
const legacy = await readFile(legacyPath);
mergeLegacyHtaccess(legacy);
const env = { ...process.env, DENTVITALIS_SITE_MODE: 'production' };
for (const script of ['build', 'form:preflight']) {
  const { stdout, stderr } = await run('npm', ['run', script], {
    cwd: root,
    env,
    maxBuffer: 10 * 1024 * 1024,
  });
  process.stdout.write(stdout);
  process.stderr.write(stderr);
}

const documents = JSON.parse(
  await readFile(resolve(root, 'dist/page-routes.json'), 'utf8'),
);
const htaccess = mergeLegacyHtaccess(legacy, documents);
await writeFile(resolve(root, 'dist/.htaccess'), htaccess, { flag: 'wx' });
const { stdout, stderr } = await run(
  'node',
  ['scripts/create-cpanel-release-manifest.mjs'],
  {
    cwd: root,
    env,
  },
);
process.stdout.write(stdout);
process.stderr.write(stderr);
console.log(
  'Production cPanel package prepared; no files uploaded or deployed.',
);
