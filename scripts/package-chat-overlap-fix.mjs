import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { chmod, mkdir, mkdtemp, readFile, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { tmpdir } from 'node:os';
import receipt from '../data/seo/whatsapp-brand-update-20261004.json' with { type: 'json' };
import v8Receipt from '../data/seo/cpanel-galleria-v8-release-20261004.json' with { type: 'json' };

// Narrow patch for an active v9. No routing/content decisions or full redeploy.
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
    .replace(/ data-astro-cid-[a-z0-9]+(?:="")?/g, '')
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
  assert.equal(normalize(html), normalize(old.toString()), entry.path);
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
  revision: '20261004-chat-fixes-v11',
  generatedAt: new Date().toISOString(),
  gitCommit,
  baseRevision: base.revision,
  basePatchSha256: receipt.sha256,
  changeScope:
    'Hide obsolete Zendesk Classic UI and use DentVitalis clinic heading in all five languages; other copy/GTM/CookieYes unchanged',
  fileCount: files.length,
  totalBytes: files.reduce((sum, file) => sum + file.bytes, 0),
  files,
};
changes.push({
  path: 'release-manifest.json',
  bytes: Buffer.from(JSON.stringify(manifest, null, 2) + '\n'),
  expectedBeforeSha256: sha256(baseManifestBytes),
});
assert.equal(changes.length, 142);
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
const readme = `ISPRAVCI CHATA — MALI UPDATE AKTIVNOG V9

142 javne datoteke: index.html, cijeli _pages (140 HTML-a), manifest.
Nije puni release. Nema htaccessa, CSS/JS asseta, sitemapa, robotsa ili PHP-a.
Skriva samo stari Zendesk launcher/webWidget; native WhatsApp ostaje jedini chat.
U svih pet plavih zaglavlja naziv je DentVitalis, ne ime Jelena.
Ne gasi GTM/CookieYes, ne mijenja poruke, broj, forme ili odredišta redirekcija.
Provjereno: 142 HTML-a prema verificiranom v9, samo zaštitni head blok i
generirani ID-jevi/scope oznake i naziv/ARIA chata smiju se razlikovati;
svi ostali asseti jednaki, odobreni XML/config ostaju postojeći v9.

CPANEL — INSTALIRATI SAMO OVAJ UPDATE, NE PONAVLJATI MIGRACIJU:
1. Raspakiraj ZIP u novu privatnu releases/20261004-chat-fixes-v11 mapu.
   README i patch-manifest.json ne smiju u javni web.
2. Potvrdi aktivni revision 20261004-whatsapp-brand-v9. Ako je drugi, STANI.
   Provjeri 142 javne datoteke (0644), mape (0755). Public root ostaje 0750.
3. Napravi dvije NOVE prazne privatne backup mape (0700):
   backups/public-before-chat-fixes-v11-20261004/
   backups/public-failed-chat-fixes-v11-20261004/
4. Sačuvaj postojeće index.html, cijeli _pages i release-manifest.json:
   Move samo te tri stavke iz public_html u before. Tek kada su ta tri
   javna mjesta prazna, Move tri nove stavke iz PAYLOAD public_html u
   ISTI originalni /home2/dentvita/public_html. Ne stvarati _pages/_pages.
   Ne preimenovati niti obrisati public_html; ne dirati _astro/assets,
   htaccess, index.php, application, podatke, DNS, PHP ili stare backupove.
5. Izvana provjeri /, /hr, /de, /en, /si, /galleria: 200, novi sadržaj.
   Na HR/SI desktopu i mobitelu jedan WhatsApp, bez zelenog upitnika.
   U svih pet plavih zaglavlja DentVitalis, znak umjesto fotografije.
   Normalni klik -> otvara znak/panel; Escape zatvara. Cookie banner radi.
   Nikakvo slanje forme ili WhatsApp poruke.
6. Kod regresije: nove tri stavke Move u prazni failed backup;
   stare tri vratiti iz before na ista prazna mjesta u originalnom rootu.
   Ne vraćati pune backupove, application/data, mail/log, bazu ili CRM.

WEBMASTER: trajno pauzirati SAMO stari Zendesk/Zopim tag u GTM-K3QGWS.
Ovaj update ispravlja prikaz odmah, ali ne uklanja SDK/cookieje iz GTM-a.
SEO: svi postojeći 74 redirecta prolaze vanjski test; 106 starih sadržajnih
URL-ova bez odobrene zamjene i /en/contacts ostaju zaseban otvoreni posao.
Ne tvrditi da ovaj chat update rješava sve redirekcije ili puni prihvat privola.
`;
await writeFile(join(staging, 'README.txt'), readme, {
  flag: 'wx',
  mode: 0o644,
});
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
  '.astro/releases/dentvitalis-chat-fixes-20261004-v11.zip',
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
