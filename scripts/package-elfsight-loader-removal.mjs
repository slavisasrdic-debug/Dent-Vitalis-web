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
import { installedV22Baseline, sha256 } from './installed-v20-baseline.mjs';
const revision = '20261015-elfsight-loader-v23';
const archiveName = 'dentvitalis-elfsight-loader-removal-20261015-v23.zip';
const archive = resolve('.astro/releases', archiveName);
const { manifest, manifestBytes, read, receipt } = await installedV22Baseline();
const script =
  '<script src="https://elfsightcdn.com/platform.js" async></script>';
const normalize = (html) =>
  html.replace(
    /[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}/g,
    'GENERATED-ID',
  );
const changes = [];
let htmlChecked = 0;
for (const file of manifest.files.filter((file) =>
  file.path.endsWith('.html'),
)) {
  const before = read(file.path).toString();
  const matches = before.split(script).length - 1;
  assert.equal(matches, file.path === '404.html' ? 0 : 1, file.path);
  const expected = before.replace(script, '');
  const current = await readFile(join('dist', file.path), 'utf8');
  assert.ok(
    normalize(current) === normalize(expected),
    'Unexpected change beyond one script removal: ' + file.path,
  );
  assert.ok(!expected.includes('elfsightcdn.com/platform.js'), file.path);
  // Final HTML is made from the verified deployed bytes, preserving every other byte.
  if (matches) {
    assert.equal(
      (expected.match(/data-whatsapp-embed=/g) ?? []).length,
      1,
      file.path,
    );
    changes.push({
      path: file.path,
      bytes: Buffer.from(expected),
      expectedBeforeSha256: file.sha256,
    });
  }
  htmlChecked++;
}
assert.equal(htmlChecked, 142);
assert.equal(changes.length, 141);
const records = new Map(manifest.files.map((file) => [file.path, file]));
async function verifyAssets(directory) {
  for (const entry of await readdir(join('dist', directory), {
    withFileTypes: true,
  })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) await verifyAssets(path);
    else {
      assert.ok(records.has(path), 'Unexpected asset: ' + path);
      assert.equal(
        sha256(await readFile(join('dist', path))),
        records.get(path).sha256,
        path,
      );
    }
  }
}
await verifyAssets('_astro');
await verifyAssets('assets');
for (const file of changes)
  records.set(file.path, {
    path: file.path,
    bytes: file.bytes.length,
    sha256: sha256(file.bytes),
  });
const files = [...records.values()].sort((a, b) =>
  a.path.localeCompare(b.path),
);
const gitCommit = execFileSync('git', ['rev-parse', 'HEAD']).toString().trim();
const next = {
  ...manifest,
  revision,
  gitCommit,
  generatedAt: new Date().toISOString(),
  baseRevision: manifest.revision,
  basePatchSha256: receipt.sha256,
  acceptedBaseRevisions: [manifest.revision],
  changeScope:
    'Remove only the exact direct async Elfsight platform.js script from 141 HTML documents. All widget divs, IDs, comments, no-JS fallback, other scripts/styles/markup/forms/CRM/backend/assets/XML/routing unchanged. No replacement loader and no GTM/CookieYes changes.',
  fileCount: files.length,
  totalBytes: files.reduce((sum, file) => sum + file.bytes, 0),
  files,
};
changes.push({
  path: 'release-manifest.json',
  bytes: Buffer.from(JSON.stringify(next, null, 2) + '\n'),
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
      htmlChecked,
      htmlChanged: 141,
      publicFiles: changes.length,
      publicPayloadBytes,
      onlyDirectLoaderRemoved: true,
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
const stage = await mkdtemp(join(tmpdir(), 'dentvitalis-elfsight-v23-'));
for (const file of changes) {
  const path = join(stage, 'public_html', file.path);
  await mkdir(dirname(path), { recursive: true, mode: 0o755 });
  await writeFile(path, file.bytes, { mode: 0o644 });
}
const readme = `DENTVITALIS V23 — UKLANJANJE IZRAVNOG ELFSIGHT LOADERA, 15.10.2026.
Revision ${revision}; preduvjet aktivni ${manifest.revision} (V22).
141 HTML datoteka + manifest. Nema novih asseta, konfiguracije ili backenda.
Iz svake stranice uklonjen je ISKLJUČIVO:
${script}
Svih pet widget ID-jeva/divova, lazy atributi, postojeći komentari i no-JS
WhatsApp link ostaju doslovno isti. Sve ostalo osim manifesta nepromijenjeno.
VAŽNO: sami divovi ne pokreću chat. Rad chata ovisi o platform skripti iz
drugog izvora (ako postoji). Ovaj paket NE dodaje zamjenski loader i NE mijenja
GTM/CookieYes. Ne obećava se da udaljeni chat radi bez drugog loadera.
Ako GTM već učitava platform.js, njegov mrežni zahtjev može ostati: time se
ne dokazuje neuspjeh uklanjanja iz HTML-a. Ne gasiti GTM niti mijenjati tagove.

CPANEL AGENT
1. Upload/Extract u NOVU release mapu izvan javnog weba:
   /home2/dentvita/releases/${revision}/
   Provjeri ZIP SHA iz predaje, aktivni V22 i svježu kvotu. Uračunaj ZIP,
   extract (${publicPayloadBytes} B), backup ciljnih izvornika, eventualni
   dodatni displaced-originals i najmanje 10 MB rezerve. Bez automatskog brisanja.
2. NOVI privatni backup 0700:
   /home2/dentvita/backups/public-before-${revision}/
   Sačuvaj samo 142 postojeće datoteke iz patch-manifest.json uz iste relativne
   putanje. Provjeri expectedBeforeSha256 i hash kopija PRIJE zamjene.
   Ako aktivni revision/hashovi/prostor ne odgovaraju, STANI i prijavi razliku.
3. Zamijeni pojedinačno navedenih 141 HTML datoteku pod public_html, manifest
   POSLJEDNJI. Ne zamjenjuj cijeli _pages i ne napravi _pages/_pages.
   Ako Copy overwrite nije jasan, upotrijebi novu privatnu displaced-originals
   0700 za pojedinačne stare datoteke pa nove stavi na prazne iste putanje;
   prethodno uračunaj prostor te dodatne kopije. Datoteke 0644; root ostaje 0750.
   NE preimenuj/briši public_html, NE diraj PHP/application/backend/CRM,
   assete, .htaccess/redirecte, XML/sitemap/robots, GTM/CookieYes/Elfsight postavke,
   DNS ili druge stranice. README/patch-manifest ostaju IZVAN javnog weba.
4. Provjeri svih 142 novih SHA i revision ${revision}.
   Javno /, /hr, /en, /de, /si: 200, točan jezik i po jedan odgovarajući
   widget div. U izvornom odgovoru HTML-a NEMA izravnog platform.js script taga.
   Provjeri reprezentativni detalj, FAQ, galeriju, video stranicu i zahvalnu rutu;
   desktop/mobitel, navigaciju i kontaktni popup (otvori/Escape bez slanja).
   Provjeri postojeće PHP stranice, GET /send, reprezentativni 301/410 i 404.
   Zasebno zabilježi učitava li neki vanjski izvor platform.js i radi li chat.
   Bez drugog loadera chat je očekivano neučitan: NE dodavati skriptu nazad
   niti raditi rollback samo radi tog izričito odobrenog uklanjanja.
   Nemoj slati forme ni WhatsApp poruke ili prikazivati tokene.
5. Kod neovisne tehničke regresije sačuvaj samo nove ciljne datoteke u NOVU
   privatnu FAILED mapu 0700, vrati samo 142 izvornika iz backupa, manifest
   posljednji i ponovno provjeri V22. Ne mijenjaj konfiguraciju/backende.
Prijavi stvarno provjerene rezultate, hashove, backup putanju i slobodnu kvotu.
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
  publicFiles: changes.map((file) => file.path),
  htmlChecked,
  htmlChanged: 141,
  onlyDirectLoaderRemoved: true,
};
await writeFile(
  'data/seo/elfsight-loader-v23-release-20261015.json',
  JSON.stringify(record, null, 2) + '\n',
);
console.log(
  JSON.stringify(
    {
      archiveName,
      revision,
      sha256: record.sha256,
      compressedZipBytes: zip.length,
      publicFiles: changes.length,
    },
    null,
    2,
  ),
);
