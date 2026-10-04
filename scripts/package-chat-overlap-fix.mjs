import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { chmod, mkdir, mkdtemp, readFile, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { tmpdir } from 'node:os';
import receipt from '../data/seo/whatsapp-brand-update-20261004.json' with { type: 'json' };
import v8Receipt from '../data/seo/cpanel-galleria-v8-release-20261004.json' with { type: 'json' };
import decisions from '../data/seo/post-live-redirect-decisions-20261004.json' with { type: 'json' };
import { postLiveHtaccess } from './post-live-routing.mjs';

// Small combined update for active v9; only explicitly approved routing changes.
const root = resolve(import.meta.dirname, '..');
const baseZip = join(root, '.astro/releases', receipt.archiveName);
const sha256 = (bytes) => createHash('sha256').update(bytes).digest('hex');
assert.equal(sha256(await readFile(baseZip)), receipt.sha256);
assert.equal(
  execFileSync('git', ['status', '--porcelain', '--untracked-files=no'], {
    cwd: root,
  }).toString(),
  '',
  'Commit reviewed source before packaging.',
);
const gitCommit = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root })
  .toString()
  .trim();
const fromBase = (path) =>
  execFileSync('unzip', ['-p', baseZip, 'public_html/' + path], {
    maxBuffer: 2 * 1024 * 1024,
  });
const baseManifestBytes = fromBase('release-manifest.json');
const base = JSON.parse(baseManifestBytes);
assert.equal(base.revision, receipt.revision);
const records = new Map(base.files.map((entry) => [entry.path, entry]));
const normalize = (html) =>
  html
    .replace(/ data-astro-cid-[a-z0-9]+(?:="")?/g, '')
    .replace(
      /<(style|script)\b[^>]*data-legacy-chat-guard[^>]*>[\s\S]*?<\/\1>/g,
      '',
    )
    .replace(
      /(<div class="chat-person"[^>]*><strong>)[^<]*(<\/strong>)/g,
      '$1CLINIC$2',
    )
    .replace(
      /(<section class="chat-panel"[^>]*aria-label=")[^"]*(WhatsApp")/g,
      '$1CLINIC $2',
    )
    .replace(
      /[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}/g,
      'GENERATED-ID',
    );
const changes = [];
let checked = 0;
for (const entry of base.files.filter((entry) =>
  entry.path.endsWith('.html'),
)) {
  checked++;
  if (entry.path === '404.html') {
    assert.equal(
      sha256(await readFile(join(root, 'dist', entry.path))),
      entry.sha256,
    );
    continue;
  }
  const old = fromBase(entry.path);
  assert.equal(sha256(old), entry.sha256, entry.path);
  const bytes = await readFile(join(root, 'dist', entry.path));
  const html = bytes.toString();
  assert.ok(
    normalize(html) === normalize(old.toString()),
    `Unexpected HTML difference outside approved chat changes: ${entry.path}`,
  );
  assert.equal((html.match(/data-legacy-chat-guard/g) ?? []).length, 2);
  assert.ok(
    html.indexOf('data-legacy-chat-guard') <
      html.indexOf('data-tracking-bootstrap'),
  );
  changes.push({ path: entry.path, bytes, expectedBeforeSha256: entry.sha256 });
  records.set(entry.path, {
    path: entry.path,
    bytes: bytes.length,
    sha256: sha256(bytes),
  });
}
assert.equal(checked, 142);
assert.equal(changes.length, 141);
const v8Zip = join(root, '.astro/releases', v8Receipt.archiveName);
assert.equal(sha256(await readFile(v8Zip)), v8Receipt.sha256);
const acceptedHtaccess = execFileSync('unzip', ['-p', v8Zip, '.htaccess']);
const originalHtaccess = records.get('.htaccess');
assert.equal(sha256(acceptedHtaccess), originalHtaccess.sha256);
const documents = JSON.parse(
  await readFile(join(root, 'dist/page-routes.json')),
);
const newHtaccess = Buffer.from(postLiveHtaccess(acceptedHtaccess, documents));
changes.push({
  path: '.htaccess',
  bytes: newHtaccess,
  expectedBeforeSha256: originalHtaccess.sha256,
});
records.set('.htaccess', {
  path: '.htaccess',
  bytes: newHtaccess.length,
  sha256: sha256(newHtaccess),
});
// Every other static payload remains byte-identical. Config is not generated here.
for (const entry of base.files.filter(
  (entry) => !entry.path.endsWith('.html'),
)) {
  // Config/XML are intentionally kept from the approved v9; this patch never
  // includes the freshly generated Astro sitemap-0 (which lacks handoff links).
  if (
    [
      '.htaccess',
      '_redirects',
      'sitemap.xml',
      'sitemap-0.xml',
      'sitemap-index.xml',
    ].includes(entry.path)
  )
    continue;
  if (entry.path === 'page-routes.json') {
    // Build enumeration order is nondeterministic; the mapping is unchanged.
    // Do not include or rewrite this file in the patch: production keeps v9.
    const before = execFileSync('unzip', [
      '-p',
      join(root, '.astro/releases', v8Receipt.archiveName),
      entry.path,
    ]);
    assert.equal(sha256(before), entry.sha256);
    assert.deepEqual(
      JSON.parse(await readFile(join(root, 'dist', entry.path))),
      JSON.parse(before),
    );
    continue;
  }
  assert.equal(
    sha256(await readFile(join(root, 'dist', entry.path))),
    entry.sha256,
    entry.path,
  );
}
const files = [...records.values()].sort((a, b) =>
  a.path.localeCompare(b.path),
);
const manifest = {
  ...base,
  revision: '20261004-public-fixes-v12',
  generatedAt: new Date().toISOString(),
  gitCommit,
  baseRevision: base.revision,
  basePatchSha256: receipt.sha256,
  changeScope:
    '115 owner-approved 301 additions and six approved 410 retirements; hide obsolete Zendesk UI; DentVitalis chat heading in five languages. No new content/design or sitemap/backend/GTM changes.',
  fileCount: files.length,
  totalBytes: files.reduce((sum, file) => sum + file.bytes, 0),
  files,
};
changes.push({
  path: 'release-manifest.json',
  bytes: Buffer.from(JSON.stringify(manifest, null, 2) + '\n'),
  expectedBeforeSha256: sha256(baseManifestBytes),
});
assert.equal(changes.length, 143);
const temporary = await mkdtemp(join(tmpdir(), 'dentvitalis-chat-overlap-'));
const staging = join(temporary, 'package');
await mkdir(staging, { mode: 0o755 });
for (const { path, bytes } of changes) {
  const target = join(staging, 'public_html', path);
  await mkdir(dirname(target), { recursive: true, mode: 0o755 });
  for (
    let directory = dirname(target);
    directory !== staging;
    directory = dirname(directory)
  )
    await chmod(directory, 0o755);
  await writeFile(target, bytes, { flag: 'wx', mode: 0o644 });
  await chmod(target, 0o644);
}
const readme = `DENTVITALIS — JAVNI ISPRAVCI V12, UPDATE AKTIVNOG V9

143 javne datoteke: index.html, cijeli _pages (140 HTML-a), .htaccess, manifest.
Jedan zajednički update, NE puni release. Nema novih stranica ili sadržaja.
Dodaje svih 115 odobrenih 301: 84 tematske zamjene, 17 zamjena usluga,
14 preostalih članaka na postojeće usluge, bez dodavanja teksta.
Šest zasebno odobrenih ukinutih adresa vraća 410, bez redirekcije.
Zadržava postojeće redirekcije, UTM/query, 308 normalizaciju i PHP backend.
Sitemap ostaje postojeći provjereni v9: 136 URL-ova, 676 stvarnih hreflang
veza, bez XML x-default; IT galerija /galleria. Nije ga potrebno mijenjati.
WhatsApp: samo jedan gumb; skriven stari Zendesk launcher/webWidget.
Svih pet zaglavlja DentVitalis; postojeći znak, poruke i broj ne mijenjaju se.

CPANEL — SAMO ZAMJENA ČETIRIJU STAVKI, BEZ PREIMENOVANJA JAVNOG ROOT-a:
1. Raspakiraj ZIP u novu /home2/dentvita/releases/20261004-public-fixes-v12/.
   README.txt, redirekcije-odobrene.csv i patch-manifest.json ostaju privatni.
2. Aktivni release-manifest.json mora biti 20261004-whatsapp-brand-v9.
   Ako nije, STANI. Payload public_html: 143 datoteke 0644, mape 0755.
   Provjeri expectedBeforeSha256 iz patch manifesta ako imaš alat za hash.
   Root /home2/dentvita/public_html ostaje na postojećih 0750.
3. Napravi NOVE prazne backup mape 0700:
   /home2/dentvita/backups/public-before-fixes-v12-20261004/
   /home2/dentvita/backups/public-failed-fixes-v12-20261004/
4. Move postojeće ČETIRI stavke index.html, _pages, .htaccess,
   release-manifest.json iz aktivnog public_html u before backup.
   Tek kad su ta četiri mjesta prazna, Move iste četiri nove stavke iz
   raspakiranog PAYLOAD public_html u originalni /home2/dentvita/public_html.
   Ne stvarati public_html/public_html ili _pages/_pages. Nema overwrite spajanja.
   NE preimenovati ili obrisati public_html. Ne dirati _astro/assets,
   index.php, application/data, mail/log, bazu/CRM, DNS, PHP ili stare backupove.
5. Provjeri izvana: index.html, /, /hr, /de, /en, /si, /galleria -> 200 novi web.
   SVE 301 adrese u redirekcije-odobrene.csv: jedan 301 na cilj, cilj 200,
   query ?utm_source=v12%2Bcheck&item=1&item=2 ostaje sačuvan.
   Posebno /en/implantation -> /en/new-implants;
   /en/registration i /en/contacts -> /en/contact;
   /en/croatia-and-rijeka -> /en/directions.
   Šest adresa označenih 410: HTTP 410 bez Location, sa i bez slasha.
   Tri zadržane HR PHP stranice i GET /send ostaju 200.
   GET tokena/no-store provjeriti bez zapisivanja vrijednosti tokena.
   robots i sitemap 200; manifest revision 20261004-public-fixes-v12.
   HR/SI desktop + mobile: nema zelenog upitnika preko WhatsAppa;
   obični klik otvara panel, Escape zatvara, svih pet zaglavlja DentVitalis.
   CookieYes postavke/odbijanje rade. NE slati forme ili WhatsApp poruke.
6. Ako bilo koji ključni test pokaže regresiju: Move nove četiri stavke u
   prazni failed backup, pa stare četiri iz before vrati na ista prazna mjesta
   originalnog root-a. Ne vraćati application, podatke, mail, bazu ili CRM.
7. Pošalji izvještaj: revision, statusi testova, dozvole, stvarna preostala
   kvota i jesu li hashovi provjereni. Ne proglašavati blokiran GET uspješnim.

WEBMASTER: trajno pauzirati SAMO stari Zendesk/Zopim tag u GTM-K3QGWS.
Ovaj update skriva njegov UI, ali NE zaustavlja učitavanje SDK-a/cookieja.
GTM/CookieYes se ne isključuju. Puni prihvat ponašanja privola nije potvrđen.
SEO: 301 na opći pregled usluga slabija je tematska zamjena; ne jamčimo
očuvanje svih Google pozicija. Vlasnik odabrao bez dodavanja sadržaja.
Šest kampanjskih/ukinutih adresa odobreno je ugasiti s 410; stari oglasi
na te adrese više neće raditi. Vlasnik je potvrdio da se kampanje ne koriste.
Devet starih pogrešnih URL-ova ostaje 404. Tri ranije odobrene HR PHP stranice
svjesno ostaju stare: desinfekcija, kliničko produženje krune, most na svim implantatima.
`;
await writeFile(join(staging, 'README.txt'), readme, {
  flag: 'wx',
  mode: 0o644,
});
await writeFile(
  join(staging, 'redirekcije-odobrene.csv'),
  '\uFEFFStari URL;Novi URL;Status\r\n' +
    decisions.redirects
      .map(
        ({ from, to, status }) =>
          `https://www.dentvitalis.com${from};https://www.dentvitalis.com${to};${status}`,
      )
      .join('\r\n') +
    '\r\n' +
    decisions.retiredRoutes
      .map((from) => `https://www.dentvitalis.com${from};;410`)
      .join('\r\n') +
    '\r\n',
  { flag: 'wx', mode: 0o644 },
);
await writeFile(
  join(staging, 'patch-manifest.json'),
  JSON.stringify(
    {
      revision: manifest.revision,
      sourceGitCommit: gitCommit,
      baseRevision: base.revision,
      baseArchiveSha256: receipt.sha256,
      publicFileCount: changes.length,
      publicFiles: changes.map(({ path, bytes, expectedBeforeSha256 }) => ({
        path,
        bytes: bytes.length,
        sha256: sha256(bytes),
        expectedBeforeSha256,
      })),
      deploymentPerformed: false,
      formPostOrMessageSent: false,
    },
    null,
    2,
  ) + '\n',
  { flag: 'wx', mode: 0o644 },
);
const output = join(
  root,
  '.astro/releases/dentvitalis-public-fixes-20261004-v12.zip',
);
try {
  await readFile(output);
  throw new Error('Refusing to overwrite existing ZIP.');
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
}
execFileSync('zip', ['-q', '-r', '-X', output, '.'], { cwd: staging });
execFileSync('unzip', ['-tq', output]);
const bytes = await readFile(output);
console.log(
  JSON.stringify(
    {
      archive: output,
      bytes: bytes.length,
      sha256: sha256(bytes),
      sourceGitCommit: gitCommit,
      changedPublicFiles: changes.length,
      htmlComparedToV9: checked,
      temporaryStaging: temporary,
      deploymentPerformed: false,
    },
    null,
    2,
  ),
);
