import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { access, mkdir, mkdtemp, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { tmpdir } from 'node:os';
import v15 from '../data/seo/elfsight-favicon-v15-release-20261006.json' with { type: 'json' };
import v16 from '../data/seo/video-schema-v16-release-20261006.json' with { type: 'json' };
import v18 from '../data/seo/contact-address-v18-release-20261007.json' with { type: 'json' };

const sha = (bytes) => createHash('sha256').update(bytes).digest('hex');
const revision = '20261007-footer-address-v19';
const archiveName = 'dentvitalis-footer-address-20261007-v19.zip';
const archive = join(process.cwd(), '.astro/releases', archiveName);
const archives = new Map();
for (const receipt of [v15, v16, v18]) {
  const archive = join(process.cwd(), '.astro/releases', receipt.archiveName);
  assert.equal(sha(await readFile(archive)), receipt.sha256, receipt.revision);
  archives.set(receipt.revision, archive);
}
const unzip = (version, path) =>
  execFileSync('unzip', ['-p', archives.get(version), 'public_html/' + path], {
    maxBuffer: 3 * 1024 * 1024,
    stdio: ['ignore', 'pipe', 'pipe'],
  });
const previousBytes = unzip(v18.revision, 'release-manifest.json');
const previous = JSON.parse(previousBytes);
assert.equal(previous.revision, '20261007-contact-address-v18');
const baseline = (path) =>
  unzip(
    v18.publicFiles.includes(path)
      ? v18.revision
      : v16.publicFiles.includes(path)
        ? v16.revision
        : v15.revision,
    path,
  );
const originalAddress = 'Krešimirova 60, 51000 Rijeka';
const addresses = {
  it: originalAddress + ' (Fiume), Croazia',
  hr: originalAddress + ', Hrvatska',
};
const normalize = (html) =>
  html.replace(
    /[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}/g,
    'GENERATED-ID',
  );
const patchedFiles = new Map();
let htmlChecked = 0;
let mapPanels = 0;
for (const file of previous.files.filter((f) => f.path.endsWith('.html'))) {
  const before = baseline(file.path);
  assert.equal(sha(before), file.sha256, file.path);
  let expected = before.toString();
  const lang = expected.match(/<html lang="(it|hr)"/)?.[1];
  if (lang && file.path !== '404.html') {
    let footers = 0;
    expected = expected.replace(/<footer\b[\s\S]*?<\/footer>/g, (footer) => {
      assert.equal(footer.split(originalAddress).length - 1, 1, file.path);
      footers++;
      return footer.replace(originalAddress, addresses[lang]);
    });
    assert.equal(footers, 1, file.path);
    expected = expected.replace(
      /<div class="map-panel"[^>]*>[\s\S]*?<\/div>/g,
      (panel) => {
        assert.equal(panel.split(originalAddress).length - 1, 2, file.path);
        mapPanels++;
        return panel.replaceAll(originalAddress, addresses[lang]);
      },
    );
    patchedFiles.set(file.path, Buffer.from(expected));
  }
  const actual = normalize(await readFile(join('dist', file.path), 'utf8'));
  const normalizedExpected = normalize(expected);
  if (normalizedExpected !== actual) {
    let i = 0;
    while (normalizedExpected[i] === actual[i]) i++;
    throw new Error(
      `Unexpected change ${file.path} at ${i}: expected=${normalizedExpected.slice(i, i + 100)} actual=${actual.slice(i, i + 100)}`,
    );
  }
  // Additional explicit guards: schema, metadata and every link stay byte-identical.
  const protectedMarkup = (html) =>
    html.match(
      /<script type="application\/ld\+json"[^>]*>[\s\S]*?<\/script>|<meta\b[^>]*>|<link\b[^>]*>|\b(?:href|src)="[^"]*"/g,
    );
  assert.deepEqual(
    protectedMarkup(expected),
    protectedMarkup(before.toString()),
    file.path,
  );
  htmlChecked++;
}
assert.equal(htmlChecked, 142);
assert.equal(patchedFiles.size, 57);
assert.equal(mapPanels, 2);
const gitCommit = execFileSync('git', ['rev-parse', 'HEAD']).toString().trim();
const files = previous.files.map((file) => {
  const bytes = patchedFiles.get(file.path);
  return bytes
    ? { path: file.path, bytes: bytes.length, sha256: sha(bytes) }
    : file;
});
const manifest = {
  ...previous,
  revision,
  gitCommit,
  generatedAt: new Date().toISOString(),
  baseRevision: previous.revision,
  basePatchSha256: v18.sha256,
  acceptedBaseRevisions: [v18.revision],
  changeScope:
    'Approved IT/HR footer and map display addresses only: IT Rijeka (Fiume), Croazia; HR Rijeka, Hrvatska. All schema, metadata, links, contact paragraphs, legal text, forms, CRM/backend, widgets, assets, tracking, routing, XML and other languages unchanged.',
  files,
  totalBytes: files.reduce((sum, file) => sum + file.bytes, 0),
};
const changes = [
  ...Array.from(patchedFiles, ([path, bytes]) => ({
    path,
    bytes,
    expectedBeforeSha256: previous.files.find((f) => f.path === path).sha256,
  })),
  {
    path: 'release-manifest.json',
    bytes: Buffer.from(JSON.stringify(manifest, null, 2) + '\n'),
    expectedBeforeSha256: sha(previousBytes),
  },
];
const publicPayloadBytes = changes.reduce((sum, f) => sum + f.bytes.length, 0);
console.log(
  JSON.stringify(
    {
      revision,
      htmlChecked,
      htmlChanged: patchedFiles.size,
      mapPanels,
      publicFileCount: changes.length,
      publicPayloadBytes,
      onlyFooterMapAddressChanges: true,
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
  'Commit reviewed source before packaging.',
);
const stage = await mkdtemp(join(tmpdir(), 'dentvitalis-footer-address-v19-'));
for (const change of changes) {
  await mkdir(dirname(join(stage, 'public_html', change.path)), {
    recursive: true,
    mode: 0o755,
  });
  await writeFile(join(stage, 'public_html', change.path), change.bytes, {
    mode: 0o644,
  });
}
const readme = `DENTVITALIS V19 — IT/HR PODNOZJE I KARTA, 7.10.2026.
Revision: ${revision}. Preduvjet: aktivni ${v18.revision}.
IT: Krešimirova 60, 51000 Rijeka (Fiume), Croazia
HR: Krešimirova 60, 51000 Rijeka, Hrvatska
Samo 57 IT/HR HTML-a + manifest. Ostali jezici i kontaktni odlomci nepromijenjeni.
Svih 142 HTML-a usporedjeno s verificiranim prethodnim paketima.
Schema.org, metadata, linkovi/karte, forme i ostali kod ostaju isti.

CPANEL AGENT — POSTUPAK
1. Upload i Extract u NOVU privatnu release mapu:
   /home2/dentvita/releases/20261007-footer-address-v19/
   NE raspakiravati u aktivni public_html. README/patch-manifest ostaju privatni.
   Provjeri aktivni revision V18, ZIP integritet i dovoljno slobodne kvote.
   Javni payload iznosi ${publicPayloadBytes} B. Treba mjesta za ZIP, raspakirani
   payload i backup navedenih izvornika, uz rezervu. Ako prostora nema, STANI;
   ne brisi backupove/releaseove bez zasebnog odobrenja.
2. Napravi NOVI privatni backup (0700):
   /home2/dentvita/backups/public-before-footer-address-v19-20261007/
   Kopiraj svih 58 aktivnih datoteka navedenih u patch-manifest.json uz ISTE
   relativne putanje. Provjeri prisutnost/velicine kopija; hashove ako dostupni.
   Ako hash prije zamjene odstupa od expectedBeforeSha256, STANI.
3. Zamijeni samo 57 HTML datoteka s popisa patch-manifest.json, zatim
   release-manifest.json POSLJEDNJI. Izvor: public_html/ UNUTAR PAKETA.
   Cilj: /home2/dentvita/public_html/ + ISTA relativna putanja.
   Ako Copy ne potvrdjuje overwrite, premjesti pojedine izvornike u NOVU
   privatnu displaced-originals/ (0700), pa nove na prazna mjesta.
   Datoteke 0644; postojece mape zadrzati. public_html ostaje 0750.
   NE zamjenjuj cijeli _pages. NE preimenuj/briši public_html.
   NE diraj index.php, PHP/application/backend/CRM, assets, .htaccess,
   sitemap/robots/XML, GTM, CookieYes, Elfsight, DNS ili stare backupove.
4. Javni GET, bez POST-a ili slanja poruka:
   /, /hr, /contatti, /hr/kontakt — HTTP 200 i gornje IT/HR adrese u footeru.
   /contatti i /hr/kontakt: isti lokalizirani tekst uz kartu i iframe title.
   Desktop 1440 i mobile 390 px: adresa citljiva bez horizontalnog overflowa.
   Otvori/zatvori kontaktni popup BEZ slanja; potvrdi ispravan jezik forme.
   /de, /en, /si ostaju kao prije; schema PostalAddress ostaje Rijeka/HR,
   ulica Krešimirova 60, postanski broj 51000. Sitemap/robots nisu zamijenjeni.
   Potvrdi manifest revision ${revision}. Hashove označi PROVJERENO ili
   NEPROVJERENO; ne predstavljaj pregled File Managera kao hash provjeru.
5. Ako se pojavi regresija, spremi ovih 58 novih datoteka u NOVU privatnu
   failed mapu 0700, pa vrati svih 58 iz ovog backupa (manifest posljednji).
   Bez renamea public_html ili promjene backenda.
`;
await writeFile(join(stage, 'README.txt'), readme, { mode: 0o644 });
await writeFile(
  join(stage, 'patch-manifest.json'),
  JSON.stringify(
    {
      revision,
      baseRevision: previous.revision,
      gitCommit,
      publicPayloadBytes,
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
  publicPayloadBytes,
  publicFiles: changes.map((file) => file.path),
  htmlChecked,
  onlyFooterMapAddressChanges: true,
};
await writeFile(
  'data/seo/footer-address-v19-release-20261007.json',
  JSON.stringify(receipt, null, 2) + '\n',
);
console.log(JSON.stringify(receipt, null, 2));
