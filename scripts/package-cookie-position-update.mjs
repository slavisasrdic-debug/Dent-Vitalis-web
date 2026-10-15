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
import {
  installedV22Baseline,
  installedV23Baseline,
  sha256,
} from './installed-v20-baseline.mjs';
const revision = '20261015-cookie-position-v24';
const archiveName = 'dentvitalis-cookie-position-20261015-v24.zip';
const archive = resolve('.astro/releases', archiveName);
const base = await installedV22Baseline(),
  v23 = await installedV23Baseline(base);
const accepted = [base.manifest.revision, v23.manifest.revision];
const component = await readFile(
  'src/components/CookieConsentPosition.astro',
  'utf8',
);
const comment = component.match(/<!--[\s\S]*?-->/)[0];
const css = component.match(/<style[^>]*>([\s\S]*?)<\/style>/)[1];
const addition =
  comment + '<style data-cookieyes-mobile-position>' + css + '</style>';
const loader =
  '<script src="https://elfsightcdn.com/platform.js" async></script>';
const anchor = '<script data-tracking-bootstrap>';
const normalize = (html) =>
  html.replace(
    /[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}/g,
    'GENERATED-ID',
  );
const changes = [];
for (const file of base.manifest.files.filter((file) =>
  file.path.endsWith('.html'),
)) {
  const before = base.read(file.path).toString();
  const expected =
    file.path === '404.html'
      ? before
      : before.replace(loader, '').replace(anchor, addition + anchor);
  assert.ok(
    normalize(await readFile(join('dist', file.path), 'utf8')) ===
      normalize(expected),
    'Unexpected change: ' + file.path,
  );
  const beforeV23 = v23.read(file.path).toString();
  assert.equal(
    beforeV23,
    before.replace(loader, ''),
    'V23 changed beyond loader: ' + file.path,
  );
  assert.equal(
    file.path === '404.html'
      ? beforeV23
      : beforeV23.replace(anchor, addition + anchor),
    expected,
    'V22/V23 produce different payload',
  );
  if (file.path !== '404.html') {
    assert.equal(
      (expected.match(/data-cookieyes-mobile-position/g) ?? []).length,
      1,
      file.path,
    );
    assert.ok(!expected.includes('elfsightcdn.com/platform.js'));
    changes.push({
      path: file.path,
      bytes: Buffer.from(expected),
      expectedBeforeSha256: file.sha256,
      expectedBeforeSha256ByRevision: {
        [accepted[0]]: file.sha256,
        [accepted[1]]: sha256(v23.read(file.path)),
      },
    });
  }
}
assert.equal(changes.length, 141);
const records = new Map(base.manifest.files.map((file) => [file.path, file]));
async function verifyAssets(directory) {
  for (const entry of await readdir(join('dist', directory), {
    withFileTypes: true,
  })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) await verifyAssets(path);
    else {
      assert.ok(records.has(path), 'New asset ' + path);
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
const manifest = {
  ...base.manifest,
  revision,
  gitCommit,
  generatedAt: new Date().toISOString(),
  baseRevision: base.manifest.revision,
  basePatchSha256: base.receipt.sha256,
  acceptedBaseRevisions: accepted,
  changeScope:
    'Only a marked inline mobile CookieYes revisit bottom offset (80px + safe area at <=991px) and previously approved direct Elfsight loader removal. Other bytes/markup/scripts/styles/forms/schema/assets/backend/routing/XML/GTM/CookieYes settings preserved. V22 and V23 yield identical final HTML.',
  fileCount: files.length,
  totalBytes: files.reduce((sum, file) => sum + file.bytes, 0),
  files,
};
changes.push({
  path: 'release-manifest.json',
  bytes: Buffer.from(JSON.stringify(manifest, null, 2) + '\n'),
  expectedBeforeSha256: sha256(base.manifestBytes),
  expectedBeforeSha256ByRevision: {
    [accepted[0]]: sha256(base.manifestBytes),
    [accepted[1]]: sha256(v23.manifestBytes),
  },
});
const publicPayloadBytes = changes.reduce(
  (sum, file) => sum + file.bytes.length,
  0,
);
console.log(
  JSON.stringify(
    {
      revision,
      acceptedBaseRevisions: accepted,
      htmlChecked: 142,
      htmlChanged: 141,
      publicFiles: changes.length,
      publicPayloadBytes,
      onlyApprovedChanges: true,
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
const stage = await mkdtemp(join(tmpdir(), 'dentvitalis-cookie-v24-'));
for (const file of changes) {
  const path = join(stage, 'public_html', file.path);
  await mkdir(dirname(path), { recursive: true, mode: 0o755 });
  await writeFile(path, file.bytes, { mode: 0o644 });
}
const readme = `DENTVITALIS V24 — COOKIEYES MOBILE POSITION + ODOBRENI V23, 15.10.2026.
Revision ${revision}. Prihvaća aktivni ${accepted.join(' ILI ')}.
Javni manifest prije pripreme potvrđen kao V22. V23 se NE instalira zasebno:
V24 uključuje njegovo odobreno uklanjanje izravnog Elfsight platform.js taga.
141 HTML datoteka i manifest. Nema novih javnih asseta.
Jedina nova promjena: označeni inline style data-cookieyes-mobile-position,
samo CookieYes revisit ikona u donjem lijevom/desnom kutu do 991px: bottom
80px + safe-area. Mobilni CTA ostaje 60px, razmak 20px; desktop nepromijenjen.
Ne mijenja privole, kategorije, boje, prikaz/sakrivanje, z-index ni dijaloge.
Divovi/ID-jevi Elfsighta ostaju isti; zamjenski loader nije dodan, pa chat
ovisi o drugom izvoru platform skripte ako postoji. GTM/CookieYes nisu uređivani.

CPANEL AGENT
1. Upload/Extract u NOVU release mapu /home2/dentvita/releases/${revision}/.
   Provjeri ZIP SHA iz predaje, aktivni V22 ILI V23 i svježu kvotu. Uračunaj
   ZIP/extract (${publicPayloadBytes} B), backup, eventualnu dodatnu kopiju
   displaced-originals i barem 10 MB rezerve. Ništa staro ne brisati automatski.
2. Novi privatni backup 0700:
   /home2/dentvita/backups/public-before-${revision}/
   Sačuvaj samo 142 izvornika iz patch-manifest.json, iste relativne putanje.
   VAŽNO: za SVAKI izvornik koristi expectedBeforeSha256ByRevision[AKTIVNI_REVISION].
   Polje expectedBeforeSha256 je samo kompatibilni V22 default. Za aktivni V23
   ne uspoređuj s V22 defaultom. Isto vrijedi za release-manifest.json.
   Provjeri svih 142 hashova izvornika i backupa PRIJE zamjene. Ako ne odgovaraju,
   STOP i prijavi razliku — ne prepisuj tuđe novije izmjene.
3. Zamijeni pojedinačno samo 141 navedeni HTML na istim putanjama pod public_html;
   manifest POSLJEDNJI. Ne zamjenjuj cijeli _pages i ne napravi _pages/_pages.
   Ako Copy overwrite nije jasan, izvorne pojedinačne datoteke premjesti u NOVU
   privatnu displaced-originals 0700 pa nove na prazne iste putanje; uračunaj kvotu.
   Datoteke 0644, public_html ostaje 0750; NE preimenuj/briši root.
   NE diraj PHP/application/backend/CRM, assete, .htaccess, XML/robots/sitemap,
   redirecte, GTM/CookieYes/Elfsight postavke ili DNS. README/patch-manifest privatni.
4. Potvrdi 142 nova hasha i revision ${revision}. Javno provjeri pet jezika,
   kontakt, detalj i zahvalnu rutu: 200, po jedan ispravan widget div, nema
   izravnog platform.js taga u izvornom HTML odgovoru, jedan označeni CSS blok.
   U vlastitom testnom browser profilu provjeri stvarnu CookieYes revisit ikonu
   nakon zatvaranja bannera: mobilno iznad CTA-a s najmanje 20px razmaka;
   desktop ostaje na postojećoj poziciji. Provjeri 991/992 granicu, portrait/
   landscape, otvaranje i zatvaranje preference centra, banner i kontaktni popup.
   Ne mijenjaj korisnikove administrativne postavke privole i ne prihvaćaj sve
   samo radi testa. Ne šalji forme/WhatsApp. Provjeri PHP/GET send/301/410/404.
   Ako neki vanjski izvor učitava Elfsight, zabilježi ga; ne gasiti GTM i ne vraćati
   script samo zato što bez drugog loadera nema chata — uklanjanje je odobreno.
5. Kod regresije sačuvaj samo nove ciljne datoteke u NOVU privatnu FAILED mapu
   0700 i vrati 142 izvorne backup datoteke, manifest posljednji. Vrati stvarno
   početni V22 ili V23, ne pretpostavljaj verziju. Potom javno provjeri stanje.
Prijavi javne rezultate, SHA status, backup i kvotu. Ne prikazuj tokene.
`;
await writeFile(join(stage, 'README.txt'), readme, { mode: 0o644 });
await writeFile(
  join(stage, 'patch-manifest.json'),
  JSON.stringify(
    {
      revision,
      acceptedBaseRevisions: accepted,
      gitCommit,
      publicPayloadBytes,
      publicFiles: changes.map(
        ({
          path,
          bytes,
          expectedBeforeSha256,
          expectedBeforeSha256ByRevision,
        }) => ({
          path,
          bytes: bytes.length,
          sha256: sha256(bytes),
          expectedBeforeSha256,
          expectedBeforeSha256ByRevision,
        }),
      ),
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
const zip = await readFile(archive),
  record = {
    archiveName,
    revision,
    acceptedBaseRevisions: accepted,
    sourceGitCommit: gitCommit,
    sha256: sha256(zip),
    compressedZipBytes: zip.length,
    publicPayloadBytes,
    publicFiles: changes.map((file) => file.path),
    htmlChecked: 142,
    htmlChanged: 141,
    onlyApprovedChanges: true,
  };
await writeFile(
  'data/seo/cookie-position-v24-release-20261015.json',
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
