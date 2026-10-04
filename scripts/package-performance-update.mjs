import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import {
  chmod,
  copyFile,
  mkdir,
  mkdtemp,
  readFile,
  writeFile,
} from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { tmpdir } from 'node:os';
import baseReceipt from '../data/seo/public-fixes-v12-release-20261004.json' with { type: 'json' };
import video from '../src/content/mobile-video-optimization.json' with { type: 'json' };
import { performanceHtaccess } from './performance-cache.mjs';

const root = process.cwd();
const sha = (bytes) => createHash('sha256').update(bytes).digest('hex');
const zip = join(root, '.astro/releases', baseReceipt.archiveName);
assert.equal(sha(await readFile(zip)), baseReceipt.sha256);
const fromBase = (path) =>
  execFileSync('unzip', ['-p', zip, 'public_html/' + path], {
    maxBuffer: 3 * 1024 * 1024,
  });
const previousManifestBytes = fromBase('release-manifest.json');
const previous = JSON.parse(previousManifestBytes);
assert.equal(previous.revision, '20261004-public-fixes-v12');
const baseline = new Map(previous.files.map((file) => [file.path, file]));
const records = new Map(baseline);
const oldVideo = `/assets/video/DV-MObile-video01_3_mp4.mp4?v=${video.sourceSha256}`;
const newVideo = `${video.path}?v=${video.sha256}`;
const normalize = (html) =>
  html
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/g, '')
    .replace(/<link rel="stylesheet" href="\/_astro\/[^"]+"[^>]*>/g, '')
    .replaceAll(newVideo, oldVideo)
    .replace(/ data-astro-cid-[a-z0-9]+(?:="")?/g, '')
    .replace(
      /[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}/g,
      'GENERATED-ID',
    )
    .replace(/>\s+</g, '><');
const changes = [];
const cssSequences = async (html, directory) => {
  const blocks = [];
  for (const match of html.matchAll(
    /<style\b[^>]*>([\s\S]*?)<\/style>|<link rel="stylesheet" href="(\/_astro\/[^"]+)"[^>]*>/g,
  )) {
    blocks.push(
      (match[1] ?? (await readFile(join(directory, match[2]), 'utf8'))).trim(),
    );
  }
  return blocks;
};
const baselineDirectory = process.env.DENTVITALIS_BASELINE_DIST;
assert.ok(
  baselineDirectory,
  'Use the saved, hash-verified v12 dist for CSS comparisons.',
);
let stylesheetLinksBefore = 0,
  stylesheetLinksAfter = 0;
for (const record of previous.files.filter((file) =>
  file.path.endsWith('.html'),
)) {
  const before =
    record.path === '404.html'
      ? await readFile(join(baselineDirectory, record.path))
      : fromBase(record.path);
  assert.equal(sha(before), record.sha256, record.path);
  const after = await readFile(join(root, 'dist', record.path));
  const oldHtml = before.toString(),
    newHtml = after.toString();
  assert.equal(
    normalize(newHtml),
    normalize(oldHtml),
    'Unexpected non-CSS/video HTML change: ' + record.path,
  );
  assert.deepEqual(
    await cssSequences(newHtml, join(root, 'dist')),
    await cssSequences(oldHtml, baselineDirectory),
    'CSS content/order changed: ' + record.path,
  );
  stylesheetLinksBefore += (
    oldHtml.match(/<link rel="stylesheet" href="\/_astro\//g) ?? []
  ).length;
  stylesheetLinksAfter += (
    newHtml.match(/<link rel="stylesheet" href="\/_astro\//g) ?? []
  ).length;
  if (!after.equals(before))
    changes.push({
      path: record.path,
      bytes: after,
      expectedBeforeSha256: record.sha256,
    });
}
assert.ok(stylesheetLinksAfter < stylesheetLinksBefore);
assert.deepEqual(
  JSON.parse(await readFile('dist/page-routes.json')),
  JSON.parse(await readFile(join(baselineDirectory, 'page-routes.json'))),
);
// Existing JS, fonts, images, XML and original videos are not replaced or deleted.
for (const file of previous.files.filter(
  (file) => file.path.startsWith('_astro/') || file.path.startsWith('assets/'),
)) {
  const bytes = await readFile(join(baselineDirectory, file.path));
  assert.equal(sha(bytes), file.sha256, file.path);
  if (file.path.endsWith('.css') && file.path.startsWith('_astro/')) continue;
  assert.equal(
    sha(await readFile(join(root, 'dist', file.path))),
    file.sha256,
    'Unexpected asset change: ' + file.path,
  );
}
const beforeHtaccess = fromBase('.htaccess');
assert.equal(sha(beforeHtaccess), baseline.get('.htaccess').sha256);
changes.push({
  path: '.htaccess',
  bytes: Buffer.from(performanceHtaccess(beforeHtaccess)),
  expectedBeforeSha256: sha(beforeHtaccess),
});
const videoPath = video.path.slice(1);
assert.ok(!baseline.has(videoPath));
const videoBytes = await readFile(join(root, 'dist', videoPath));
assert.equal(sha(videoBytes), video.sha256);
changes.push({
  path: videoPath,
  bytes: videoBytes,
  expectedBeforeSha256: null,
});
for (const change of changes)
  records.set(change.path, {
    path: change.path,
    bytes: change.bytes.length,
    sha256: sha(change.bytes),
  });
const files = [...records.values()].sort((a, b) =>
  a.path.localeCompare(b.path),
);
const gitCommit = execFileSync('git', ['rev-parse', 'HEAD']).toString().trim();
const manifest = {
  ...previous,
  revision: '20261005-performance-v13',
  generatedAt: new Date().toISOString(),
  gitCommit,
  baseRevision: previous.revision,
  basePatchSha256: baseReceipt.sha256,
  changeScope:
    'Inline CSS below 20 KiB without changing rule content/order; smaller mobile MP4; append cache for hashed assets only. No content, routing, fonts, CookieYes, GTM or backend changes.',
  fileCount: files.length,
  totalBytes: files.reduce((sum, file) => sum + file.bytes, 0),
  files,
};
changes.push({
  path: 'release-manifest.json',
  bytes: Buffer.from(JSON.stringify(manifest, null, 2) + '\n'),
  expectedBeforeSha256: sha(previousManifestBytes),
});
assert.equal(changes.length, 144);
assert.equal(
  changes.some((file) => file.path === '404.html'),
  false,
);
const proof = {
  htmlChecked: 142,
  changedHtml: changes.filter((file) => file.path.endsWith('.html')).length,
  stylesheetLinksBefore,
  stylesheetLinksAfter,
  originalAssetsUnchanged: true,
  cssContentAndOrderUnchanged: true,
  contentMetadataAndFormsUnchanged: true,
  videoBytesSaved: video.sourceBytes - video.bytes,
  videoSsim: video.ssim,
  revision: manifest.revision,
  gitCommit,
};
console.log(JSON.stringify(proof, null, 2));
if (process.argv.includes('--check-only')) process.exit(0);
assert.equal(
  execFileSync('git', [
    'status',
    '--porcelain',
    '--untracked-files=no',
  ]).toString(),
  '',
  'Commit reviewed source before packaging.',
);
const staging = await mkdtemp(
  join(tmpdir(), 'dentvitalis-performance-package-'),
);
for (const file of changes) {
  const target = join(staging, 'public_html', file.path);
  await mkdir(dirname(target), { recursive: true, mode: 0o755 });
  for (
    let directory = dirname(target);
    directory !== staging;
    directory = dirname(directory)
  )
    await chmod(directory, 0o755);
  await writeFile(target, file.bytes, { flag: 'wx', mode: 0o644 });
  await chmod(target, 0o644);
}
const patchManifest = {
  revision: manifest.revision,
  baseRevision: previous.revision,
  files: changes.map(({ path, bytes, expectedBeforeSha256 }) => ({
    path,
    bytes: bytes.length,
    sha256: sha(bytes),
    expectedBeforeSha256,
  })),
  proof,
};
await writeFile(
  join(staging, 'patch-manifest.json'),
  JSON.stringify(patchManifest, null, 2) + '\n',
  { mode: 0o644 },
);
const readme = `DENTVITALIS — PERFORMANCE V13, 5.10.2026.

MALI UPDATE AKTIVNOG V12, NIJE PUNI WEB.
144 javne datoteke: 141 HTML, .htaccess, manifest i JEDAN dodatni mobilni MP4.
Nema promjene dizajna, sadržaja, fonta, URL-ova, sitemapa, GTM-a ili CookieYesa.
Mobilni MP4 je 24,98% manji, s istim dimenzijama/kadrovima/trajanjem;
kompresija nije pikselno identična (SSIM 0,992111). Originali ostaju sačuvani.
Dvije male CSS datoteke home stranice dolaze u HTML-u, na istom mjestu;
veća shared CSS ostaje zasebna. Cache 1 godine samo za hashirane assete.

CPANEL — NE PREIMENOVATI, BRISATI NI ZAMJENJIVATI public_html.
1. Provjeri da je aktivni manifest revision 20261004-public-fixes-v12.
   Ako nije, STANI. Provjeri stvarnu slobodnu kvotu prije ekstrakcije.
   Treba prostora za ZIP + ${changes.reduce((sum, file) => sum + file.bytes.length, 0)} B payload
   + najmanje 10 MB rezerve. Backup se radi premještanjem, ne dupliciranjem.
2. Raspakiraj ZIP privatno u NOVU releases/20261005-performance-v13/.
   README i patch-manifest ostaju privatni. Datoteke 0644, mape 0755.
   Provjeri SHA-256 iz patch-manifest.json ako imaš hash alat.
3. Premjesti SAMO novu datoteku assets/video/${videoPath.split('/').at(-1)}
   iz payloada u postojeću javnu assets/video mapu. Ne zamjenjuj mapu assets,
   video, _astro, fonts niti postojeće videe/slike. Ako naziv postoji, STANI.
4. Napravi NOVU praznu privatnu backup mapu 0700:
   /home2/dentvita/backups/public-before-performance-v13-20261005/.
   Premjesti postojeće ČETIRI stavke index.html, _pages, .htaccess i
   release-manifest.json u backup. Ne diraj 404.html ni bilo koju drugu stavku.
5. Premjesti te ČETIRI nove stavke iz PAYLOAD public_html u postojeći
   /home2/dentvita/public_html. Bez spajanja _pages i bez _pages/_pages.
   Root ostaje 0750, _pages/podmape 0755, datoteke 0644.
6. Provjeri naslovnice /, /hr, /de, /en, /si, /galleria, mobitel i desktop.
   Na mobitelu video treba igrati; pri reduced-motion ostaje pravi poster.
   Otvori WhatsApp, zatvori Escape; otvori/zatvori mobilni meni. Ne šalji formu.
7. Potvrdi 189 ranijih 301, šest 410 i query parametre; token GET/no-store;
   robots/sitemap ostaju neizmijenjeni. Novi video + hashirani font/JS/CSS
   trebaju Cache-Control: public, max-age=31536000, immutable; HTML/PHP ne.
   Ne prihvaćati samo HTTP 200; mora biti pravi sadržaj/status.
8. Na grešku odmah vrati ČETIRI stare stavke iz backupa, uz NOVU
   zasebnu FAILED mapu 0700 za ČETIRI nove. Novi dodatni video može ostati
   nekorišten; ništa ne brisati. Ne diraj backend/application, DNS ili PHP.

ZAVRŠNO: novi manifest revision ${manifest.revision}; javni HTTP i mobilna
PageSpeed provjera nakon instalacije. Nova ocjena/brzina nije zajamčena.
Cache na stvarnom LiteSpeedu mora se potvrditi izvana nakon instalacije.
`;
await writeFile(join(staging, 'README.txt'), readme, { mode: 0o644 });
const name = 'dentvitalis-performance-20261005-v13.zip';
const output = join(root, '.astro/releases', name);
// Exclusive copy preserves any earlier package with the same name.
execFileSync(
  'zip',
  [
    '-q',
    '-r',
    '-X',
    join(staging, 'package.zip'),
    'public_html',
    'README.txt',
    'patch-manifest.json',
  ],
  { cwd: staging },
);
execFileSync('unzip', ['-tq', join(staging, 'package.zip')]);
await copyFile(
  join(staging, 'package.zip'),
  output,
  (await import('node:fs')).constants.COPYFILE_EXCL,
);
for (const file of changes)
  assert.equal(
    sha(
      execFileSync('unzip', ['-p', output, 'public_html/' + file.path], {
        maxBuffer: 3 * 1024 * 1024,
      }),
    ),
    sha(file.bytes),
    file.path,
  );
console.log(
  JSON.stringify(
    {
      archiveName: name,
      sha256: sha(await readFile(output)),
      zipBytes: (await readFile(output)).length,
      publicFiles: changes.length,
      unpackedPublicBytes: changes.reduce(
        (sum, file) => sum + file.bytes.length,
        0,
      ),
      staging,
      proof,
    },
    null,
    2,
  ),
);
