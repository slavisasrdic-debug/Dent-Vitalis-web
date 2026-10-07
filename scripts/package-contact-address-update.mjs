import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { mkdir, mkdtemp, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { tmpdir } from 'node:os';
import v15 from '../data/seo/elfsight-favicon-v15-release-20261006.json' with { type: 'json' };
import v16 from '../data/seo/video-schema-v16-release-20261006.json' with { type: 'json' };
import v17 from '../data/seo/hr-contact-v17-release-20261007.json' with { type: 'json' };
import corrections from '../data/editorial-corrections.json' with { type: 'json' };

const sha = (bytes) => createHash('sha256').update(bytes).digest('hex');
const archives = new Map();
for (const receipt of [v15, v16, v17]) {
  const archive = join(process.cwd(), '.astro/releases', receipt.archiveName);
  assert.equal(sha(await readFile(archive)), receipt.sha256);
  archives.set(receipt.revision, archive);
}
const unzip = (revision, path) =>
  execFileSync('unzip', ['-p', archives.get(revision), 'public_html/' + path], {
    maxBuffer: 3 * 1024 * 1024,
    stdio: ['ignore', 'pipe', 'pipe'],
  });
const previousBytes = unzip(v17.revision, 'release-manifest.json');
const previous = JSON.parse(previousBytes);
const v16ManifestBytes = unzip(v16.revision, 'release-manifest.json');
const v16Manifest = JSON.parse(v16ManifestBytes);
assert.equal(previous.revision, '20261007-hr-contact-v17');
const changedV16 = new Set(v16.publicFiles);
const targetHr = '_pages/hr/kontakt.html';
const targets = new Map([[targetHr, []]]);
for (const lang of ['it', 'de', 'en', 'sl']) {
  const address = corrections.contactAddressLocalization[lang];
  if (lang === 'it')
    targets.set('_pages' + address.route + '.html', address.replacements);
  else
    for (const file of previous.files.filter(
      (file) =>
        file.path.endsWith('.html') &&
        (file.path.startsWith(`_pages/${lang === 'sl' ? 'si' : lang}/`) ||
          file.path === `_pages/${lang === 'sl' ? 'si' : lang}.html`),
    ))
      targets.set(file.path, address.replacements);
}
const baseline = (path) =>
  unzip(
    path === targetHr
      ? v17.revision
      : changedV16.has(path)
        ? v16.revision
        : v15.revision,
    path,
  );
const patchedFiles = new Map();
for (const [path, replacements] of targets) {
  const old = baseline(path);
  const sourceFile = previous.files.find((file) => file.path === path);
  assert.equal(sha(old), sourceFile.sha256, path);
  let patched = old.toString();
  for (const correction of replacements) {
    const count = patched.split(correction.from).length - 1;
    // IT: visible address + description consumers. Others: footer,
    // optional map title/link and the contact page's address paragraph.
    if (path === '_pages/contatti.html') assert.equal(count, 5, path);
    else
      assert.ok(
        [1, 3, 4].includes(count),
        `${path}: unexpected address occurrences ${count}`,
      );
    patched = patched.replaceAll(correction.from, correction.to);
  }
  patchedFiles.set(path, Buffer.from(patched));
}
const normalize = (html) =>
  html.replace(
    /[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}/g,
    'GENERATED-ID',
  );
let htmlChecked = 0;
for (const file of previous.files.filter((f) => f.path.endsWith('.html'))) {
  const beforeBytes = baseline(file.path);
  assert.equal(sha(beforeBytes), file.sha256, file.path);
  const expected = normalize(
    (patchedFiles.get(file.path) ?? beforeBytes).toString(),
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
// Preserve deployed HTML bytes except the explicitly approved address literals.
const files = previous.files.map((file) => {
  const bytes = patchedFiles.get(file.path);
  return bytes
    ? { path: file.path, bytes: bytes.length, sha256: sha(bytes) }
    : file;
});
const gitCommit = execFileSync('git', ['rev-parse', 'HEAD']).toString().trim();
const revision = '20261007-contact-address-v18';
const manifest = {
  ...previous,
  revision,
  gitCommit,
  generatedAt: new Date().toISOString(),
  baseRevision: previous.revision,
  basePatchSha256: v17.sha256,
  acceptedBaseRevisions: [v16.revision, v17.revision],
  changeScope:
    'Owner-approved contact address localization across five languages, including the HR V17 correction. DE/EN/SL shared footer and map address follow the same source correction. IT keeps Rijeka (Fiume), country Croazia, with matching contact description. All other text, legal articles, forms, widgets, backend, assets, tracking, URLs and video schema unchanged.',
  files,
  totalBytes: files.reduce((sum, file) => sum + file.bytes, 0),
};
const changes = [
  ...Array.from(patchedFiles, ([path, bytes]) => ({
    path,
    bytes,
    expectedBeforeSha256: previous.files.find((f) => f.path === path).sha256,
    acceptedBeforeSha256: [
      ...new Set([
        previous.files.find((f) => f.path === path).sha256,
        v16Manifest.files.find((f) => f.path === path).sha256,
      ]),
    ],
  })),
  {
    path: 'release-manifest.json',
    bytes: Buffer.from(JSON.stringify(manifest, null, 2) + '\n'),
    expectedBeforeSha256: sha(previousBytes),
    acceptedBeforeSha256: [sha(previousBytes), sha(v16ManifestBytes)],
  },
];
console.log(
  JSON.stringify(
    {
      revision,
      htmlChecked,
      publicFileCount: changes.length,
      onlyApprovedAddressChanges: true,
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
const stage = await mkdtemp(join(tmpdir(), 'dentvitalis-contact-address-v18-'));
for (const change of changes) {
  await mkdir(dirname(join(stage, 'public_html', change.path)), {
    recursive: true,
    mode: 0o755,
  });
  await writeFile(join(stage, 'public_html', change.path), change.bytes, {
    mode: 0o644,
  });
}
const readme = `DENTVITALIS V18 — KONTAKTNE ADRESE, 7.10.2026.
Revision ${revision}; dozvoljen aktivni V16 ili V17.
Paket ukljucuje prethodni HR ispravak; V17 ne treba instalirati zasebno.

Promjena: izvorna hrvatska ulica i Rijeka u kontaktnoj adresi.
HR Hrvatska, DE Kroatien, EN Croatia, SL Hrvaška.
IT Rijeka (Fiume), Croazia; opis iste kontaktne stranice uskladjen.
Pravni tekstovi, clanci, logotipi i udaljeni widgeti nisu mijenjani.
142 HTML-a usporedjena; ${patchedFiles.size} HTML-a u paketu:
5 kontaktnih stranica te DE/EN/SL prikazi iste adrese u podnozju/karti.

CPANEL AGENT
1. Upload/Extract u /home2/dentvita/releases/20261007-contact-address-v18/,
   NE u public_html. Procitaj README. Potvrdi slobodan prostor i
   aktivni revision 20261006-video-schema-v16 ili 20261007-hr-contact-v17.
2. Napravi NOVI privatni backup (0700):
   /home2/dentvita/backups/public-before-contact-address-v18-20261007/
   Sacuvaj svih ${changes.length} datoteka iz patch-manifest.json, s istim relativnim putanjama.
   Provjeri kopije prije zamjene.
3. Iz public_html/ UNUTAR PAKETA zamijeni samo datoteke popisane u
   patch-manifest.json. Popis HTML-a:
${Array.from(patchedFiles.keys())
  .map((path) => '   ' + path)
  .join('\n')}
   Zatim release-manifest.json — POSLJEDNJI.
   Cilj je /home2/dentvita/public_html/ + ista relativna putanja.
   NE stavljaj novi public_html unutar postojeceg.
   Ako Copy ne potvrdjuje overwrite, stare datoteke premjesti u NOVU
   privatnu displaced-originals/ podmapu (0700), pa nove na prazna mjesta.
   Datoteke 0644; postojece dozvole mapa ne mijenjaj. public_html ostaje 0750.
   NE zamjenjuj cijeli _pages, ne preimenuj/briši public_html.
   Ne diraj druge HTML-e, assets, PHP/backend, CRM, .htaccess, sitemap,
   robots, GTM, CookieYes, Elfsight ili ranije backupove.
4. Provjeri pet kontaktnih ruta: HTTP 200, gornji naziv grada/drzave,
   isti naziv tvrtke, telefoni, e-mailovi i linkovi. Desktop i mobitel:
   adresa citljiva, kontaktni popup otvori/zatvori BEZ slanja upita.
   IT ostaje Rijeka (Fiume), ali samo Croazia bez Hrvatska u zagradi.
   Provjeri podnozja /de, /en i /si te adrese uz karte:
   Rijeka bez Fiume/Reka u zagradi, drzava Kroatien/Croatia/Hrvaška.
   Potvrdi revision ${revision} u manifestu.
5. Kod regresije sacuvaj samo ${changes.length} novih datoteka u NOVU privatnu failed
   mapu (0700), pa vrati svih ${changes.length} izvornika iz ovog backupa.
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
      acceptedBaseRevisions: [v16.revision, v17.revision],
      publicFiles: changes.map(
        ({ path, bytes, expectedBeforeSha256, acceptedBeforeSha256 }) => ({
          path,
          bytes: bytes.length,
          sha256: sha(bytes),
          expectedBeforeSha256,
          acceptedBeforeSha256,
        }),
      ),
    },
    null,
    2,
  ) + '\n',
  { mode: 0o644 },
);
const archiveName = 'dentvitalis-contact-address-20261007-v18.zip';
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
  onlyApprovedAddressChanges: true,
};
await writeFile(
  'data/seo/contact-address-v18-release-20261007.json',
  JSON.stringify(receipt, null, 2) + '\n',
);
console.log(
  JSON.stringify(
    {
      archiveName,
      revision,
      sha256: receipt.sha256,
      compressedZipBytes: bytes.length,
      publicFileCount: changes.length,
      htmlChecked,
    },
    null,
    2,
  ),
);
