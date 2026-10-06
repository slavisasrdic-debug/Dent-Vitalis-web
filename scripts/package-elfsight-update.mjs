import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import {
  chmod,
  mkdir,
  mkdtemp,
  readFile,
  readdir,
  writeFile,
} from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { tmpdir } from 'node:os';
import baseReceipt from '../data/seo/directory-performance-v14-release-20261005.json' with { type: 'json' };
import oldReceipt from '../data/seo/cpanel-galleria-v8-release-20261004.json' with { type: 'json' };
import { whatsappWidgetId } from '../data/whatsapp-widgets.ts';

const root = process.cwd();
const sha = (bytes) => createHash('sha256').update(bytes).digest('hex');
const baseZip = join(root, '.astro/releases', baseReceipt.archiveName);
const oldZip = join(root, '.astro/releases', oldReceipt.archiveName);
assert.equal(sha(await readFile(baseZip)), baseReceipt.sha256);
assert.equal(sha(await readFile(oldZip)), oldReceipt.sha256);
const unzip = (archive, path) =>
  execFileSync('unzip', ['-p', archive, path], {
    maxBuffer: 3 * 1024 * 1024,
    stdio: ['ignore', 'pipe', 'pipe'],
  });
const previousBytes = unzip(baseZip, 'public_html/release-manifest.json');
const previous = JSON.parse(previousBytes);
assert.equal(previous.revision, '20261005-directory-performance-v14');
const base = new Map(previous.files.map((f) => [f.path, f]));
const records = new Map(base);
const oldHtml = (path) => {
  let bytes;
  try {
    bytes = unzip(baseZip, 'public_html/' + path);
  } catch {
    bytes = unzip(oldZip, path);
  }
  assert.equal(
    sha(bytes),
    base.get(path).sha256,
    'Unverified baseline: ' + path,
  );
  return bytes.toString();
};
// Compare the rest of each page exactly, including forms, tracking, SEO and
// clinical content. Only the requested chat and icon markup/styles differ.
const normalize = (html) =>
  html
    .replace(
      /<div class="chat-widget"[\s\S]*?(?=<div class="mobile-contact")/,
      '',
    )
    .replace(
      /<div class="elfsight-app-[^"]+"[\s\S]*?(?=<div class="mobile-contact")/,
      '',
    )
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, (block) =>
      block.includes('data-chat-widget') ? '' : block,
    )
    .replace(/<!--[^]*?-->/g, '')
    .replace(/<link\b[^>]*rel="icon"[^>]*>/g, '')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/g, '')
    .replace(/<link rel="stylesheet" href="\/_astro\/[^"]+"[^>]*>/g, '')
    .replace(/ data-astro-cid-[a-z0-9]+(?:="")?/g, '')
    .replace(
      /[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}/g,
      'GENERATED-ID',
    )
    .replace(/>\s+</g, '><');
const changes = [];
for (const file of previous.files.filter((f) => f.path.endsWith('.html'))) {
  const bytes = await readFile(join(root, 'dist', file.path));
  const html = bytes.toString();
  const before = normalize(oldHtml(file.path)),
    after = normalize(html);
  if (before !== after) {
    let i = 0;
    while (before[i] === after[i] && i < before.length) i++;
    throw new Error(
      `Unexpected HTML change ${file.path} at ${i}: before=${before.slice(i, i + 160)} after=${after.slice(i, i + 160)}`,
    );
  }
  const lang = html.match(/<html lang="([^"]+)"/)[1];
  if (file.path !== '404.html')
    assert.ok(
      html.includes(`class="elfsight-app-${whatsappWidgetId(lang)}"`),
      file.path,
    );
  assert.equal(
    (html.match(/data-whatsapp-embed=/g) || []).length,
    file.path === '404.html' ? 0 : 1,
    file.path,
  );
  assert.equal(
    (html.match(/src="https:\/\/elfsightcdn.com\/platform.js"/g) || []).length,
    file.path === '404.html' ? 0 : 1,
    file.path,
  );
  assert.ok(!html.includes('data-chat-widget'), file.path);
  assert.ok(
    html.includes('/assets/images/favicon-blue-triangle.ico'),
    file.path,
  );
  changes.push({ path: file.path, bytes, expectedBeforeSha256: file.sha256 });
}
assert.equal(changes.length, 142);
for (const path of ['robots.txt']) {
  assert.equal(
    sha(await readFile(join(root, 'dist', path))),
    base.get(path).sha256,
    'Routing/SEO changed: ' + path,
  );
}
const baseRoutes = unzip(oldZip, 'page-routes.json');
assert.equal(sha(baseRoutes), base.get('page-routes.json').sha256);
assert.deepEqual(
  JSON.parse(await readFile('dist/page-routes.json', 'utf8')),
  JSON.parse(baseRoutes),
  'Page document mapping changed.',
);
// Production keeps its approved direct sitemap.xml. A fresh Astro build emits
// sitemap.xml as an index instead; no generated XML is included in this patch.
// Compare the actual URL/hreflang inventory, without changing the live aliases.
const xmlEntries = (xml) =>
  [...xml.matchAll(/<url>([\s\S]*?)<\/url>/g)]
    .map(([, entry]) => ({
      loc: entry.match(/<loc>([^<]+)<\/loc>/)[1],
      alternates: [...entry.matchAll(/<xhtml:link\b([^>]+)\/>/g)]
        .map(([, attrs]) => [
          attrs.match(/hreflang="([^"]+)"/)[1],
          attrs.match(/href="([^"]+)"/)[1],
        ])
        .sort(),
    }))
    .sort((a, b) => a.loc.localeCompare(b.loc));
const baseSitemap = unzip(oldZip, 'sitemap.xml');
assert.equal(sha(baseSitemap), base.get('sitemap.xml').sha256);
assert.deepEqual(
  xmlEntries(await readFile('dist/sitemap-0.xml', 'utf8')),
  xmlEntries(baseSitemap.toString()),
  'Sitemap URL/hreflang inventory changed.',
);
for (const folder of ['_astro', 'assets/images']) {
  for (const name of await readdir(join(root, 'dist', folder))) {
    const path = folder + '/' + name;
    const bytes = await readFile(join(root, 'dist', path));
    if (base.has(path)) {
      assert.equal(
        sha(bytes),
        base.get(path).sha256,
        'Existing asset changed: ' + path,
      );
      continue;
    }
    if (folder === '_astro')
      assert.ok(name.endsWith('.css'), 'No new JS is expected.');
    else
      assert.ok(
        [
          'dentvitalis-mark-blue-triangle.svg',
          'dentvitalis-chat-logo-blue-triangle-512.png',
          'favicon-blue-triangle.ico',
        ].includes(name),
        'Unexpected image: ' + name,
      );
    changes.push({ path, bytes, expectedBeforeSha256: null });
  }
}
for (const change of changes)
  records.set(change.path, {
    path: change.path,
    bytes: change.bytes.length,
    sha256: sha(change.bytes),
  });
const files = [...records.values()].sort((a, b) =>
  a.path.localeCompare(b.path),
);
const revision = '20261006-elfsight-favicon-v15';
const gitCommit = execFileSync('git', ['rev-parse', 'HEAD']).toString().trim();
const manifest = {
  ...previous,
  revision,
  generatedAt: new Date().toISOString(),
  gitCommit,
  baseRevision: previous.revision,
  basePatchSha256: baseReceipt.sha256,
  changeScope:
    'Owner-approved five-language Elfsight WhatsApp embed replacing native chat; green V with blue triangle favicon/avatar. Existing content, forms, CRM/backend, GTM/CookieYes, routes, redirects and original assets unchanged.',
  fileCount: files.length,
  totalBytes: files.reduce((s, f) => s + f.bytes, 0),
  files,
};
changes.push({
  path: 'release-manifest.json',
  bytes: Buffer.from(JSON.stringify(manifest, null, 2) + '\n'),
  expectedBeforeSha256: sha(previousBytes),
});
const additions = changes
  .filter((c) => c.expectedBeforeSha256 === null)
  .map((c) => c.path);
console.log(
  JSON.stringify(
    {
      revision,
      htmlChecked: 142,
      publicFiles: changes.length,
      additions,
      contentFormsMetadataTrackingAndRoutingUnchanged: true,
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
const stage = await mkdtemp(join(tmpdir(), 'dentvitalis-elfsight-v15-'));
for (const change of changes) {
  const target = join(stage, 'public_html', change.path);
  await mkdir(dirname(target), { recursive: true, mode: 0o755 });
  await writeFile(target, change.bytes, { mode: 0o644 });
  await chmod(target, 0o644);
}
async function setModes(folder) {
  await chmod(folder, 0o755);
  for (const e of await readdir(folder, { withFileTypes: true }))
    if (e.isDirectory()) await setModes(join(folder, e.name));
}
await setModes(stage);
const readme = `DENTVITALIS V15 — ELFSIGHT WHATSAPP + FAVICON, 6.10.2026.
Mali update za aktivni v14; nije puni web. Revision: ${revision}
Izvorni Git commit: ${gitCommit}
Sadrži ${changes.length} javnih datoteka. 142 HTML-a uspoređena s verificiranim v14:
nepromijenjeni ostali sadržaj, kontaktne forme, SEO, tracking i putanje.
Htaccess, sitemap, robots, index.php, application, baza/CRM i GTM NISU u paketu.
Stari asseti se ne brišu. Novi avatar ima bijelu podlogu 512x512; V #afbc36,
trokut #056c7a (izvorna DentVitalis plava). Originalni puni logo/ICO očuvani.

CPANEL — ODOBRENA INSTALACIJA SADRŽAJA, BEZ PREIMENOVANJA PUBLIC_HTML
1. Upload ovog ZIP-a u /home2/dentvita/releases/20261006-elfsight-favicon-v15/.
   Extract tamo, ne u public_html. Provjeri aktivni manifest revision v14;
   kod drugog revisiona ili nedostatnog prostora za backup: stani i prijavi.
2. Napravi nove privatne backup i failed mape (0700):
   /home2/dentvita/backups/public-before-elfsight-favicon-v15-20261006/
   /home2/dentvita/backups/public-failed-elfsight-favicon-v15-20261006/
   Sačuvaj postojeći index.html, cijeli _pages, 404.html i release-manifest.json
   u prvu mapu. Ne diraj ranije backupove. public_html ostaje ista mapa 0750.
3. Najprije dodaj samo ove NOVE datoteke, bez zamjene cijelih mapa:
${additions.map((path) => '   ' + path).join('\n')}
4. Nakon potvrđenog backupa zamijeni SAMO index.html, _pages, 404.html i manifest.
   Ako Copy ne jamči overwrite, premjesti stare četiri stavke u prazni privatni
   backup, pa nove istoimene stavke u prazna javna mjesta. Bez spajanja _pages
   i bez stvaranja _pages/_pages. Ne preimenuj i ne briši public_html.
   Datoteke 0644, podmape 0755; public_html ostaje 0750.
5. Javno provjeri /, /hr, /de, /en, /si i /galleria: HTTP 200, novi sadržaj,
   jedan jezično odgovarajući Elfsight widget, nema native/Zendesk duplikata.
   Otvori chat i provjeri polje za poruku; nemoj slati poruku niti web-formu.
   Provjeri desktop i mobitel: gumb i chat ne smiju prekrivati donji kontaktni
   CTA ili CookieYes. Otvori/zatvori native kontaktni popup; forma ostaje ista.
   Provjeri novi SVG/ICO (200) i postojeće SEO/PHP/token rute bez slanja upita.
6. Kod tehničke regresije: nove četiri zamijenjene stavke premjesti u failed,
   stare vrati iz ovog backupa u isti public_html. Stari asseti su sačuvani.
   Kozmetičke postavke widgeta uređuje webmaster u Elfsightu, ne u web-kodu.

ZA ELFSIGHT WEBMASTERA (SVIH PET WIDGETA)
Content -> Chat Window: naziv DENTVITALIS, priloženi 512px avatar, lokalna adresa.
Content -> Start Chat Method: Send Message (polje za poruku, ne Start Chat Button).
Poruka se prenosi u WhatsApp; to nije razgovor u CRM-u. Pozdrav/potpis po jeziku.
Display/Position: jedan kružni floating gumb; na mobitelu DONJI ODMAK najmanje
80 px (kontaktna traka je visoka 60 px). Aktualnih 20 px preklapa traku:
to treba prilagoditi u svih pet widgeta prije završne javne provjere.
Isključi nepotrebnu tekstualnu oznaku, nemoj ponovno uključivati Zendesk.
Objavi postavke svih pet ID-jeva. Potvrdi domenu/kvotu widgeta i CookieYes
klasifikaciju/pristanak: ugradnja dodaje vanjski SDK; GTM/CMP nisu izmijenjeni.
Favicon/avatar iz ZIP-a ne mijenjaju automatski udaljeni Elfsight avatar:
učitaj assets/images/dentvitalis-chat-logo-blue-triangle-512.png u editor.
`;
await writeFile(join(stage, 'README.txt'), readme, { mode: 0o644 });
const patch = {
  revision,
  baseRevision: previous.revision,
  baseArchiveSha256: baseReceipt.sha256,
  gitCommit,
  publicFiles: changes.map(({ path, bytes, expectedBeforeSha256 }) => ({
    path,
    bytes: bytes.length,
    sha256: sha(bytes),
    expectedBeforeSha256,
  })),
  additions,
};
await writeFile(
  join(stage, 'patch-manifest.json'),
  JSON.stringify(patch, null, 2) + '\n',
  { mode: 0o644 },
);
const archiveName = 'dentvitalis-elfsight-favicon-20261006-v15.zip';
const archive = join(root, '.astro/releases', archiveName);
execFileSync(
  'zip',
  ['-q', '-r', archive, 'README.txt', 'patch-manifest.json', 'public_html'],
  { cwd: stage },
);
execFileSync('unzip', ['-t', archive], { stdio: 'ignore' });
const archiveBytes = await readFile(archive);
const receipt = {
  archiveName,
  revision,
  baseRevision: previous.revision,
  sourceGitCommit: gitCommit,
  sha256: sha(archiveBytes),
  compressedZipBytes: archiveBytes.length,
  publicFiles: changes.length,
  additions,
  replace: ['index.html', '_pages', '404.html', 'release-manifest.json'],
  htmlChecked: 142,
  backendTrackingSeoAndOriginalAssetsUntouched: true,
};
await writeFile(
  join(root, 'data/seo/elfsight-favicon-v15-release-20261006.json'),
  JSON.stringify(receipt, null, 2) + '\n',
);
console.log(JSON.stringify(receipt, null, 2));
