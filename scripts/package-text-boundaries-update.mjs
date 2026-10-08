import assert from 'node:assert/strict';
import {
  access,
  mkdir,
  mkdtemp,
  readFile,
  readdir,
  writeFile,
} from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { dirname, join, resolve } from 'node:path';
import { tmpdir } from 'node:os';
import { installedV20Baseline, sha256 } from './installed-v20-baseline.mjs';
import { separateHtmlText } from '../src/lib/html-text-boundaries.ts';

const revision = '20261008-text-boundaries-v21';
const archiveName = 'dentvitalis-text-boundaries-20261008-v21.zip';
const archive = resolve('.astro/releases', archiveName);
const { manifest, manifestBytes, read, receipt } = await installedV20Baseline();
const normalize = (html) =>
  html.replace(
    /[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}/g,
    'GENERATED-ID',
  );
const changes = [];
for (const file of manifest.files.filter((f) => f.path.endsWith('.html'))) {
  const before = read(file.path).toString();
  const expected = separateHtmlText(before);
  const current = await readFile(join('dist', file.path), 'utf8');
  if (normalize(current) !== normalize(expected)) {
    const actual = normalize(current),
      wanted = normalize(expected);
    const offset = [...actual].findIndex(
      (char, index) => char !== wanted[index],
    );
    throw new Error(
      `Unexpected change beyond boundary whitespace: ${file.path}, offset ${offset}`,
    );
  }
  assert.equal(
    expected.replace(/\s/g, ''),
    before.replace(/\s/g, ''),
    'Non-whitespace changed: ' + file.path,
  );
  assert.equal(
    separateHtmlText(expected),
    expected,
    'Not idempotent: ' + file.path,
  );
  for (const pattern of [
    /<head\b[^>]*>[\s\S]*?<\/head>/g,
    /<script\b[^>]*>[\s\S]*?<\/script>/g,
    /<style\b[^>]*>[\s\S]*?<\/style>/g,
    /<form\b[^>]*>[\s\S]*?<\/form>/g,
    /<svg\b[^>]*>[\s\S]*?<\/svg>/g,
  ])
    assert.deepEqual(
      [...expected.matchAll(pattern)].map((m) => m[0]),
      [...before.matchAll(pattern)].map((m) => m[0]),
      'Protected bytes: ' + file.path,
    );
  if (expected !== before)
    changes.push({
      path: file.path,
      bytes: Buffer.from(expected),
      expectedBeforeSha256: file.sha256,
    });
}
assert.equal(
  manifest.files.filter((f) => f.path.endsWith('.html')).length,
  142,
);
// Existing deployed routing/XML and historical assets stay on the server and in
// the old manifest unchanged. A generic build is not their deployment authority.
const records = new Map(manifest.files.map((file) => [file.path, file]));
const verifyGeneratedAssets = async (directory) => {
  for (const entry of await readdir(join('dist', directory), {
    withFileTypes: true,
  })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) await verifyGeneratedAssets(path);
    else if (!path.endsWith('.html')) {
      assert.ok(records.has(path), 'Unexpected generated asset: ' + path);
      assert.equal(
        sha256(await readFile(join('dist', path))),
        records.get(path).sha256,
        path,
      );
    }
  }
};
await verifyGeneratedAssets('_astro');
await verifyGeneratedAssets('assets');
for (const change of changes)
  records.set(change.path, {
    path: change.path,
    bytes: change.bytes.length,
    sha256: sha256(change.bytes),
  });
const files = [...records.values()].sort((a, b) =>
  a.path.localeCompare(b.path),
);
const gitCommit = execFileSync('git', ['rev-parse', 'HEAD']).toString().trim();
const nextManifest = {
  ...manifest,
  revision,
  gitCommit,
  generatedAt: new Date().toISOString(),
  baseRevision: manifest.revision,
  basePatchSha256: receipt.sha256,
  acceptedBaseRevisions: [manifest.revision],
  changeScope:
    'Only ordinary HTML spaces at semantic block/line boundaries and known independent footer/sidebar/contact items. All content characters, attributes, scripts/styles, forms, JSON-LD and other assets/routing/XML/backend unchanged.',
  fileCount: files.length,
  totalBytes: files.reduce((sum, file) => sum + file.bytes, 0),
  files,
};
const htmlChanged = changes.length;
changes.push({
  path: 'release-manifest.json',
  bytes: Buffer.from(JSON.stringify(nextManifest, null, 2) + '\n'),
  expectedBeforeSha256: sha256(manifestBytes),
});
const publicPayloadBytes = changes.reduce(
  (sum, file) => sum + file.bytes.length,
  0,
);
console.log(
  JSON.stringify(
    {
      revision,
      htmlChecked: 142,
      htmlChanged,
      publicFiles: changes.length,
      publicPayloadBytes,
      onlyWhitespace: true,
    },
    null,
    2,
  ),
);
if (process.argv.includes('--check-only')) process.exit(0);
await assert.rejects(access(archive), { code: 'ENOENT' });
assert.equal(
  execFileSync('git', [
    'status',
    '--porcelain',
    '--untracked-files=no',
  ]).toString(),
  '',
  'Commit reviewed source before packaging',
);
const stage = await mkdtemp(join(tmpdir(), 'dentvitalis-text-boundaries-v21-'));
for (const file of changes) {
  const path = join(stage, 'public_html', file.path);
  await mkdir(dirname(path), { recursive: true, mode: 0o755 });
  await writeFile(path, file.bytes, { mode: 0o644 });
}
const readme = `DENTVITALIS V21 — RAZDVAJANJE HTML TEKSTA, 8.10.2026.
Revision ${revision}; preduvjet aktivni ${manifest.revision}.
Samo ${htmlChanged} HTML datoteke i manifest. Nema novih asseta.
Dodani su obični razmaci na stvarnim granicama odlomaka, naslova, lista,
br redaka te nezavisnih footer/sidebar/kontakt stavki. Inline riječi nisu razdvojene.
Konačni build uspoređen sa svih 142 verificirana V20 HTML-a: svi znakovi
sadržaja/atributi/skripte/CSS/forme/schema nepromijenjeni. Nema data-nosnippet.
Ne obećava se izgled Google isječka ni rok promjene; Google mora ponovo obići web.

CPANEL AGENT — NE RADITI PUNI UPLOAD/RENAME ROOT-a
1. Upload/Extract u NOVU privatnu release mapu:
   /home2/dentvita/releases/20261008-text-boundaries-v21/
   Provjeri ZIP SHA iz predaje, aktivni V20 i svježu kvotu. Raspakirani payload
   ${publicPayloadBytes} B; potreban je i backup istih izvornika + rezerva.
   Ako bilo što ne odgovara ili prostora nema, STANI, bez brisanja starih podataka.
2. Novi privatni backup 0700:
   /home2/dentvita/backups/public-before-text-boundaries-v21-20261008/
   Sačuvaj ISKLJUČIVO postojeće datoteke iz patch-manifest.json, iste relativne
   putanje. Provjeri svih ${changes.length} expectedBeforeSha256 i kopije prije zamjene.
3. Zamijeni pojedinačne navedene HTML datoteke na istoimenim putanjama pod
   /home2/dentvita/public_html/. NE zamjenjuj cijeli _pages. Manifest POSLJEDNJI.
   Ako Copy overwrite nije jasan, pojedinačne izvornike premjesti u novu privatnu
   displaced-originals/0700, pa nove stavi na prazne ISTE putanje. Bez _pages/_pages.
   Datoteke 0644; zadrži postojeće mape i public_html 0750.
   NE preimenuj/briši public_html. NE diraj index.php/application/backend/CRM,
   assete, .htaccess, robots/sitemap, GTM/CookieYes/Elfsight, DNS ili konfiguraciju.
4. Svih ${changes.length} novih hashova mora odgovarati patch-manifestu.
   Javno provjeri /, /hr, /de, /en, /si: 200; između footer telefona, e-maila
   i radnog vremena postoje stvarni razmaci u textContent/HTML-u.
   Provjeri kontaktnu stranicu svih pet jezika, HR usluge i detalj, FAQ, cjenik,
   galeriju, testimonial s 13 videa/Lucillom Cecchini i 404. Desktop/mobitel:
   izgled i prelamanje isti; otvori/zatvori kontaktni popup, provjeri jezik.
   Provjeri postojeće PHP stranice, GET /send i reprezentativne 301/410 iz V20.
   Ne šalji forme ni WhatsApp, ne prikazuj tokene. Potvrdi revision ${revision}.
5. Ako se pojavi regresija, sačuvaj nove datoteke u NOVU privatnu FAILED mapu
   0700 i vrati samo popis iz backupa, manifest posljednji; ponovno provjeri stari V20.
README.txt i patch-manifest.json ostaju IZVAN javnog weba. Prijavi stvarno
provjereno, backup, SHA status i kvotu. Ne traži ponovni Google crawl prije prihvata.
`;
await writeFile(join(stage, 'README.txt'), readme, { mode: 0o644 });
await writeFile(
  join(stage, 'patch-manifest.json'),
  JSON.stringify(
    {
      revision,
      baseRevision: manifest.revision,
      gitCommit,
      publicPayloadBytes,
      publicFiles: changes.map(({ path, bytes, expectedBeforeSha256 }) => ({
        path,
        bytes: bytes.length,
        sha256: sha256(bytes),
        expectedBeforeSha256,
      })),
    },
    null,
    2,
  ) + '\n',
  { mode: 0o644 },
);
execFileSync(
  'zip',
  ['-q', '-r', archive, 'README.txt', 'patch-manifest.json', 'public_html'],
  { cwd: stage },
);
execFileSync('unzip', ['-t', archive], { stdio: 'ignore' });
const zip = await readFile(archive);
const record = {
  archiveName,
  revision,
  baseRevision: manifest.revision,
  sourceGitCommit: gitCommit,
  sha256: sha256(zip),
  compressedZipBytes: zip.length,
  publicPayloadBytes,
  publicFiles: changes.map((f) => f.path),
  htmlChecked: 142,
  htmlChanged,
  onlyWhitespace: true,
};
await writeFile(
  'data/seo/text-boundaries-v21-release-20261008.json',
  JSON.stringify(record, null, 2) + '\n',
);
console.log(JSON.stringify(record, null, 2));
