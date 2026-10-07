import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { mkdir, mkdtemp, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import v15 from '../data/seo/elfsight-favicon-v15-release-20261006.json' with { type: 'json' };
import v16 from '../data/seo/video-schema-v16-release-20261006.json' with { type: 'json' };
import corrections from '../data/editorial-corrections.json' with { type: 'json' };

const sha = (bytes) => createHash('sha256').update(bytes).digest('hex');
const archives = new Map();
for (const receipt of [v15, v16]) {
  const archive = join(process.cwd(), '.astro/releases', receipt.archiveName);
  assert.equal(sha(await readFile(archive)), receipt.sha256);
  archives.set(receipt.revision, archive);
}
const unzip = (revision, path) =>
  execFileSync('unzip', ['-p', archives.get(revision), 'public_html/' + path], {
    maxBuffer: 3 * 1024 * 1024,
    stdio: ['ignore', 'pipe', 'pipe'],
  });
const previousBytes = unzip(v16.revision, 'release-manifest.json');
const previous = JSON.parse(previousBytes);
assert.equal(previous.revision, '20261006-video-schema-v16');
const changedV16 = new Set(v16.publicFiles);
const target = '_pages/hr/kontakt.html';
const sourceFile = previous.files.find((file) => file.path === target);
const oldBytes = unzip(v15.revision, target);
assert.equal(sha(oldBytes), sourceFile.sha256);
let patched = oldBytes.toString();
for (const correction of corrections.croatianContactAddress.replacements) {
  assert.equal(
    patched.split(correction.from).length - 1,
    1,
    correction.sourceId,
  );
  patched = patched.replace(correction.from, correction.to);
}
const normalize = (html) =>
  html.replace(
    /[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}/g,
    'GENERATED-ID',
  );
let htmlChecked = 0;
for (const file of previous.files.filter((f) => f.path.endsWith('.html'))) {
  const beforeBytes = unzip(
    changedV16.has(file.path) ? v16.revision : v15.revision,
    file.path,
  );
  assert.equal(sha(beforeBytes), file.sha256, file.path);
  const expected = normalize(
    file.path === target ? patched : beforeBytes.toString(),
  );
  const actual = normalize(await readFile(join('dist', file.path), 'utf8'));
  if (expected !== actual) {
    let i = 0;
    while (i < expected.length && expected[i] === actual[i]) i++;
    throw new Error(
      `Unexpected change ${file.path} at ${i}: expected=${expected.slice(i, i + 100)} actual=${actual.slice(i, i + 100)}`,
    );
  }
  htmlChecked++;
}
assert.equal(htmlChecked, 142);
// Use deployed bytes with only the two explicitly approved substitutions;
// keep forms, inline JS/styles, identifiers, schema and links byte-identical.
const pageBytes = Buffer.from(patched);
const files = previous.files.map((file) =>
  file.path === target
    ? { path: target, bytes: pageBytes.length, sha256: sha(pageBytes) }
    : file,
);
const gitCommit = execFileSync('git', ['rev-parse', 'HEAD']).toString().trim();
const revision = '20261007-hr-contact-v17';
const manifest = {
  ...previous,
  revision,
  gitCommit,
  generatedAt: new Date().toISOString(),
  baseRevision: previous.revision,
  basePatchSha256: v16.sha256,
  changeScope:
    'Owner-approved HR contact address only: remove (Fiume) and (Croazia) from two DOCX-backed paragraphs. All other text, languages, video schema, forms, widgets, backend, tracking, assets, routes and SEO unchanged.',
  files,
  totalBytes: files.reduce((sum, file) => sum + file.bytes, 0),
};
const changes = [
  { path: target, bytes: pageBytes, expectedBeforeSha256: sourceFile.sha256 },
  {
    path: 'release-manifest.json',
    bytes: Buffer.from(JSON.stringify(manifest, null, 2) + '\n'),
    expectedBeforeSha256: sha(previousBytes),
  },
];
console.log(
  JSON.stringify(
    {
      revision,
      htmlChecked,
      publicFiles: changes.map((file) => file.path),
      onlyTwoApprovedTextChanges: true,
    },
    null,
    2,
  ),
);
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
const stage = await mkdtemp(join(tmpdir(), 'dentvitalis-hr-contact-v17-'));
await mkdir(join(stage, 'public_html/_pages/hr'), {
  recursive: true,
  mode: 0o755,
});
for (const change of changes)
  await writeFile(join(stage, 'public_html', change.path), change.bytes, {
    mode: 0o644,
  });
const readme = `DENTVITALIS V17 — HR KONTAKTNA ADRESA, 7.10.2026.
Za aktivni V16 (${previous.revision}); revision ${revision}.
Samo dvije odobrene izmjene na /hr/kontakt:
  Krešimirova 60, 51000 Rijeka (Fiume) -> Krešimirova 60, 51000 Rijeka
  Hrvatska (Croazia) -> Hrvatska
Provjereno 142 HTML-a; druge stranice/jezici/video oznake ostaju isti.
Paket ima samo _pages/hr/kontakt.html i release-manifest.json.

CPANEL AGENT
1. Upload/Extract u /home2/dentvita/releases/20261007-hr-contact-v17/,
   ne u public_html. Potvrdi aktivni V16 i slobodan prostor.
2. Napravi NOVI privatni backup (0700):
   /home2/dentvita/backups/public-before-hr-contact-v17-20261007/
   Sačuvaj postojeće dvije datoteke, uz relativnu putanju _pages/hr/kontakt.html
   i release-manifest.json. Provjeri obje kopije prije prepisivanja.
3. Zamijeni samo /home2/dentvita/public_html/_pages/hr/kontakt.html;
   zatim zamijeni /home2/dentvita/public_html/release-manifest.json POSLJEDNJI.
   Ako Copy ne potvrđuje overwrite, sačuvaj stare datoteke u NOVOJ podmapi
   displaced-originals/ (0700), pa nove stavi na prazna istoimena javna mjesta.
   Datoteke 0644; postojeće mape/dozvole ostaju. public_html ostaje 0750.
   NE zamjenjuj cijeli _pages niti preimenuj/briši public_html.
   Ne diraj druge HTML-e, assets, PHP/backend, CRM, .htaccess, sitemap,
   robots, GTM, CookieYes, Elfsight ili ranije backupove.
4. Provjeri /hr/kontakt: HTTP 200, adresa bez Fiume/Croazia, ista tvrtka,
   telefoni, e-mailovi i linkovi. Provjeri desktop/mobitel i otvori/zatvori
   kontaktni popup bez slanja upita. Talijanski /contatti ostaje isti.
   Potvrdi revision ${revision} u manifestu.
5. Kod regresije sačuvaj dvije nove datoteke u NOVU privatnu failed mapu
   (0700), pa vrati dvije izvorne iz ovog backupa na iste javne putanje.
   Bez preimenovanja public_html ili promjene backenda.
README.txt i patch-manifest.json ostaju izvan javnog direktorija.
`;
await writeFile(join(stage, 'README.txt'), readme, { mode: 0o644 });
await writeFile(
  join(stage, 'patch-manifest.json'),
  JSON.stringify(
    {
      revision,
      baseRevision: previous.revision,
      gitCommit,
      publicFiles: changes.map(({ path, bytes, expectedBeforeSha256 }) => ({
        path,
        bytes: bytes.length,
        sha256: sha(bytes),
        expectedBeforeSha256,
      })),
    },
    null,
    2,
  ) + '\n',
  { mode: 0o644 },
);
const archiveName = 'dentvitalis-hr-contact-20261007-v17.zip';
const archive = join(process.cwd(), '.astro/releases', archiveName);
execFileSync(
  'zip',
  ['-q', '-r', archive, 'README.txt', 'patch-manifest.json', 'public_html'],
  { cwd: stage },
);
execFileSync('unzip', ['-t', archive], { stdio: 'ignore' });
const bytes = await readFile(archive);
const receipt = {
  archiveName,
  revision,
  baseRevision: previous.revision,
  sourceGitCommit: gitCommit,
  sha256: sha(bytes),
  compressedZipBytes: bytes.length,
  publicFiles: changes.map((file) => file.path),
  htmlChecked,
  onlyTwoApprovedTextChanges: true,
};
await writeFile(
  'data/seo/hr-contact-v17-release-20261007.json',
  JSON.stringify(receipt, null, 2) + '\n',
);
console.log(JSON.stringify(receipt, null, 2));
