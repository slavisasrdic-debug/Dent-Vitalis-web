import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { chmod, mkdir, mkdtemp, readFile, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { tmpdir } from 'node:os';
import baseReceipt from '../data/seo/cpanel-galleria-v8-release-20261004.json' with { type: 'json' };

// A narrow update for an already live v8, not another full migration.
const root = resolve(import.meta.dirname, '..');
const baseZip = join(root, '.astro/releases', baseReceipt.archiveName);
const sha256 = (bytes) => createHash('sha256').update(bytes).digest('hex');
assert.equal(sha256(await readFile(baseZip)), baseReceipt.sha256);
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
  execFileSync('unzip', ['-p', baseZip, path], { maxBuffer: 2 * 1024 * 1024 });
const base = JSON.parse(fromBase('release-manifest.json'));
const records = new Map(base.files.map((entry) => [entry.path, entry]));
const changes = [];
const cssChanges = new Map();
const normalize = (html) =>
  html
    .replace(/ data-astro-cid-[a-z0-9]+(?:="")?/g, '')
    .replace(
      /[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}/g,
      'GENERATED-ID',
    )
    .replace(/\/_astro\/[^"\s]+\.css/g, '/_astro/STYLE.css')
    .replace(/<img\b[^>]*class="chat-portrait"[^>]*>/g, 'BRAND_MARK')
    .replace(
      /<div class="chat-brand"[^>]*>\s*<svg\b[^>]*>[\s\S]*?<\/svg>\s*<\/div>/g,
      'BRAND_MARK',
    );

for (const entry of base.files.filter(({ path }) => path.endsWith('.html'))) {
  const old = fromBase(entry.path);
  const bytes = await readFile(join(root, 'dist', entry.path));
  const before = old.toString();
  const after = bytes.toString();
  assert.equal(normalize(after), normalize(before), entry.path);
  const beforeCss = [...before.matchAll(/href="(\/_astro\/[^"\s]+\.css)"/g)];
  const afterCss = [...after.matchAll(/href="(\/_astro\/[^"\s]+\.css)"/g)];
  assert.equal(beforeCss.length, afterCss.length, entry.path);
  beforeCss.forEach((match, index) => {
    const next = afterCss[index][1];
    if (match[1] !== next) cssChanges.set(match[1].slice(1), next.slice(1));
  });
  if (sha256(bytes) !== entry.sha256) {
    assert.ok(after.includes('data-brand-mark'), entry.path);
    assert.ok(!after.includes('chat-portrait'), entry.path);
    changes.push({ path: entry.path, bytes });
  }
}
assert.equal(changes.length, 141);
assert.equal(cssChanges.size, 1);
for (const [before, after] of cssChanges) {
  assert.ok(records.has(before));
  const bytes = await readFile(join(root, 'dist', after));
  assert.ok(bytes.toString().includes('.chat-brand'));
  records.delete(before);
  changes.push({ path: after, bytes });
}
for (const { path, bytes } of changes) {
  records.set(path, { path, bytes: bytes.length, sha256: sha256(bytes) });
}
const files = [...records.values()].sort((a, b) =>
  a.path.localeCompare(b.path),
);
const fullManifest = {
  ...base,
  revision: '20261004-whatsapp-brand-v9',
  generatedAt: new Date().toISOString(),
  gitCommit,
  baseRevision: base.revision,
  baseArchiveSha256: baseReceipt.sha256,
  changeScope: 'WhatsApp portrait replaced by original DentVitalis vector mark',
  fileCount: files.length,
  totalBytes: files.reduce((sum, entry) => sum + entry.bytes, 0),
  files,
};
assert.equal(fullManifest.fileCount, base.fileCount);
changes.push({
  path: 'release-manifest.json',
  bytes: Buffer.from(JSON.stringify(fullManifest, null, 2) + '\n'),
});
const temporary = await mkdtemp(join(tmpdir(), 'dentvitalis-brand-update-'));
const payload = join(temporary, 'package');
await mkdir(payload);
await chmod(payload, 0o755);
for (const { path, bytes } of changes) {
  const target = join(payload, 'public_html', path);
  await mkdir(dirname(target), { recursive: true, mode: 0o755 });
  // mkdir's requested mode is filtered by umask; set ZIP directory modes explicitly.
  for (
    let directory = dirname(target);
    directory !== payload;
    directory = dirname(directory)
  ) {
    await chmod(directory, 0o755);
  }
  await writeFile(target, bytes, { flag: 'wx', mode: 0o644 });
  await chmod(target, 0o644);
}
const cssFile = [...cssChanges.values()][0];
const readme = `WHATSAPP ZNAK — MALI UPDATE ZA AKTIVNI V8, 2026-10-04

Sadrži public_html/index.html, cijeli _pages (140 HTML datoteka),
jedan NOVI CSS: ${cssFile}, i ažurirani puni statički manifest.
Ukupno 143 javne datoteke. Nije puni release i NE ide umjesto cijelog weba.
Mijenja samo fotografiju u WhatsApp panelu u postojeći zeleni DentVitalis znak.
Svih 142 HTML-a uspoređeno s verificiranim v8: ostali sadržaj, linkovi,
forme, SEO i skripte jednaki, izuzev generiranih ID-jeva i CSS scope/hash oznaka.
Htaccess, sitemap/robots, PHP, kontakti, prijevodi i GTM nisu u paketu.

INSTALACIJA SAMO NAKON ODOBRENJA, kroz cPanel:
1. Raspakiraj ZIP u NOVU privatnu releases mapu, ne izravno u aktivni web.
2. Potvrdi aktivni v8, sve 143 payload datoteke i 0644/0755.
3. Napravi NOVU privatnu backup mapu 0700 za ovaj update.
   Prije zamjene sačuvaj postojeći index.html, cijeli _pages i manifest.
   Puni raniji backup ne mijenjaj. Public_html direktorij ostaje isti (0750).
4. Dodaj samo navedenu NOVU CSS datoteku u postojeći public_html/_astro.
   NE zamjenjuj cijeli _astro i NE briši stari CSS: potreban je za povratak.
5. Kad je backup potvrđen, zamijeni samo index.html, _pages i manifest.
   Ako Copy ne potvrđuje overwrite, Move stare tri stavke u NOVI prazni
   privatni backup, pa nove istoimene stavke u prazna javna mjesta.
   Ne preimenuj public_html, ne diraj index.php, application, assets ili podatke.
6. Provjeri /, /hr, /de, /en, /si i /galleria (200), otvori/zatvori WhatsApp:
   DentVitalis znak umjesto slike, prijevodi/broj očuvani. Bez slanja forme/poruke.
7. Kod regresije: nove tri javne stavke Move u NOVU privatnu failed mapu,
   prethodne tri vrati iz update backupa u isti public_html. Stari CSS je očuvan.

ZELENI GUMB S UPITNIKOM NIJE WHATSAPP: to je dodatni Zendesk/Zopim iz
postojećeg GTM-K3QGWS. Ovaj paket ga ne uklanja. Webmaster treba zasebno
odobriti/pauzirati SAMO Zendesk/Zopim tag i objaviti GTM verziju;
ne gasiti GTM, CookieYes ili analitiku. Potom provjeriti da ostaje jedan chat.
`;
await writeFile(join(payload, 'README.txt'), readme, {
  flag: 'wx',
  mode: 0o644,
});
const patchManifest = {
  revision: fullManifest.revision,
  sourceGitCommit: gitCommit,
  baseArchiveSha256: baseReceipt.sha256,
  fullStaticPayloadCount: files.length,
  patchPublicFileCount: changes.length,
  existingOldCssMustRemain: [...cssChanges.keys()],
  publicFiles: changes.map(({ path, bytes }) => ({
    path,
    bytes: bytes.length,
    sha256: sha256(bytes),
    expectedBeforeSha256:
      path === 'release-manifest.json'
        ? sha256(fromBase(path))
        : (base.files.find((entry) => entry.path === path)?.sha256 ?? null),
  })),
  deploymentPerformed: false,
};
await writeFile(
  join(payload, 'patch-manifest.json'),
  JSON.stringify(patchManifest, null, 2) + '\n',
  { flag: 'wx', mode: 0o644 },
);
const output = join(
  root,
  '.astro/releases/dentvitalis-whatsapp-brand-update-20261004.zip',
);
try {
  await readFile(output);
  throw new Error('Refusing to overwrite an existing update ZIP.');
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
}
execFileSync('zip', ['-q', '-r', '-X', output, '.'], { cwd: payload });
execFileSync('unzip', ['-tq', output]);
const zipBytes = await readFile(output);
console.log(
  JSON.stringify(
    {
      archive: output,
      bytes: zipBytes.length,
      sha256: sha256(zipBytes),
      sourceGitCommit: gitCommit,
      changedPublicFiles: changes.length,
      htmlComparedToV8: 142,
      temporaryStaging: temporary,
      deploymentPerformed: false,
    },
    null,
    2,
  ),
);
