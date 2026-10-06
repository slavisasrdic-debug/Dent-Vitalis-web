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
import receipt from '../data/seo/elfsight-favicon-v15-release-20261006.json' with { type: 'json' };
import metadata from '../data/video-metadata.json' with { type: 'json' };
import { verifiedVideoDateTime } from '../src/content/video-schema.ts';

const sha = (bytes) => createHash('sha256').update(bytes).digest('hex');
const baseZip = join(process.cwd(), '.astro/releases', receipt.archiveName);
assert.equal(sha(await readFile(baseZip)), receipt.sha256);
const unzip = (path) =>
  execFileSync('unzip', ['-p', baseZip, 'public_html/' + path], {
    maxBuffer: 3 * 1024 * 1024,
  });
const previousBytes = unzip('release-manifest.json');
const previous = JSON.parse(previousBytes);
assert.equal(previous.revision, '20261006-elfsight-favicon-v15');
const base = new Map(previous.files.map((f) => [f.path, f]));
const records = new Map(base);
const jsonScript =
  /<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/;
const videoNodes = (json) =>
  json['@graph'].filter((n) => n['@type'] === 'VideoObject');
const withoutVideoFix = (json) => {
  const copy = structuredClone(json);
  for (const video of videoNodes(copy)) {
    delete video.description;
    video.uploadDate = video.uploadDate.slice(0, 10);
  }
  return copy;
};
const normalize = (html) =>
  html
    .replace(jsonScript, (_, json) =>
      JSON.stringify(withoutVideoFix(JSON.parse(json))),
    )
    .replace(
      /[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}/g,
      'GENERATED-ID',
    );
const expected = new Set([
  '_pages/testimonianze.html',
  '_pages/hr/iskustva-pacijenata.html',
  '_pages/de/erfahrungen-unserer-patienten.html',
  '_pages/en/testimonials.html',
  '_pages/si/izkusnje-pacientov.html',
]);
const changes = [];
let checked = 0;
for (const file of previous.files.filter((f) => f.path.endsWith('.html'))) {
  const beforeBytes = unzip(file.path);
  assert.equal(sha(beforeBytes), file.sha256, file.path);
  const before = beforeBytes.toString();
  const after = await readFile(join('dist', file.path), 'utf8');
  const normalizedBefore = normalize(before),
    normalizedAfter = normalize(after);
  if (normalizedBefore !== normalizedAfter) {
    let i = 0;
    while (
      i < normalizedBefore.length &&
      normalizedBefore[i] === normalizedAfter[i]
    )
      i++;
    throw new Error(
      `Unexpected page change ${file.path} at ${i}: before=${normalizedBefore.slice(i, i + 120)} after=${normalizedAfter.slice(i, i + 120)}`,
    );
  }
  checked++;
  if (!expected.has(file.path)) {
    if (before.match(jsonScript))
      assert.deepEqual(
        JSON.parse(before.match(jsonScript)[1]),
        JSON.parse(after.match(jsonScript)[1]),
      );
    continue;
  }
  const script = after.match(jsonScript);
  assert.ok(script, file.path);
  const json = JSON.parse(script[1]);
  const videos = videoNodes(json);
  assert.equal(videos.length, 13, file.path);
  for (const video of videos) {
    const id = video['@id'].split('#video-')[1];
    const source = metadata.videos.find((v) => v.videoId === id);
    assert.ok(source, id);
    assert.equal(verifiedVideoDateTime(video.uploadDate), source.uploadDate);
    assert.ok(video.description && video.description.includes(video.name), id);
  }
  // Patch only JSON-LD into the byte-verified deployed baseline. Even generated
  // form UUIDs, inline CSS/JS, tracking and all visible text remain byte-identical.
  const bytes = Buffer.from(before.replace(jsonScript, script[0]));
  assert.equal(
    bytes.toString().replace(jsonScript, ''),
    before.replace(jsonScript, ''),
    file.path,
  );
  changes.push({ path: file.path, bytes, expectedBeforeSha256: file.sha256 });
}
assert.equal(checked, 142);
assert.equal(changes.length, 5);
for (const folder of ['_astro', 'assets/images'])
  for (const name of await readdir(join('dist', folder))) {
    const path = folder + '/' + name;
    assert.ok(base.has(path), 'Unexpected asset: ' + path);
    assert.equal(
      sha(await readFile(join('dist', path))),
      base.get(path).sha256,
      path,
    );
  }
assert.equal(
  sha(await readFile('dist/robots.txt')),
  base.get('robots.txt').sha256,
);
for (const change of changes)
  records.set(change.path, {
    path: change.path,
    bytes: change.bytes.length,
    sha256: sha(change.bytes),
  });
const files = [...records.values()].sort((a, b) =>
  a.path.localeCompare(b.path),
);
const revision = '20261006-video-schema-v16';
const gitCommit = execFileSync('git', ['rev-parse', 'HEAD']).toString().trim();
const manifest = {
  ...previous,
  revision,
  gitCommit,
  generatedAt: new Date().toISOString(),
  baseRevision: previous.revision,
  basePatchSha256: receipt.sha256,
  changeScope:
    'VideoObject only: sourced YouTube first-publication datetime with timezone and description from each language’s visible section heading/caption. Existing page HTML, forms, CRM/backend, tracking, widgets, SEO/routing and assets unchanged.',
  fileCount: files.length,
  totalBytes: files.reduce((sum, f) => sum + f.bytes, 0),
  files,
};
changes.push({
  path: 'release-manifest.json',
  bytes: Buffer.from(JSON.stringify(manifest, null, 2) + '\n'),
  expectedBeforeSha256: sha(previousBytes),
});
console.log(
  JSON.stringify(
    {
      revision,
      htmlChecked: checked,
      videoObjectsChecked: 65,
      publicFiles: changes.map((c) => c.path),
      onlyVideoSchemaChanged: true,
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
const stage = await mkdtemp(join(tmpdir(), 'dentvitalis-video-v16-'));
for (const change of changes) {
  const target = join(stage, 'public_html', change.path);
  await mkdir(dirname(target), { recursive: true, mode: 0o755 });
  await writeFile(target, change.bytes, { mode: 0o644 });
}
async function modes(folder) {
  await chmod(folder, 0o755);
  for (const entry of await readdir(folder, { withFileTypes: true }))
    if (entry.isDirectory()) await modes(join(folder, entry.name));
}
await modes(stage);
const readme = `DENTVITALIS V16 — VIDEO STRUCTURED DATA, 6.10.2026.
Mali update za aktivni V15 (${previous.revision}); nije puni web.
Revision: ${revision}. Izvorni Git commit: ${gitCommit}.
Ispravljenih 65 VideoObject oznaka: 13 videa u svih pet jezika.
Vrijeme PRVE OBJAVE i zona doslovno preuzeti s YouTubea. Nisu izmišljeni.
Opis koristi postojeći vidljivi jezični naslov sekcije i ime osobe iz videa.
U 142 HTML-a provjereno: osim dvije video schema vrijednosti nema promjena.
Paket ima SAMO pet HTML datoteka i novi manifest:
${changes.map((c) => '  ' + c.path).join('\n')}
NE mijenjati index.html, cijeli _pages, assets, .htaccess, sitemap, robots,
index.php, application, CRM/bazu, GTM, CookieYes ili Elfsight.

CPANEL AGENT — JASNA INSTALACIJA
1. Upload i Extract u /home2/dentvita/releases/20261006-video-schema-v16/,
   NE u javni direktorij. Provjeri aktivni V15 revision i slobodan prostor.
   Kod drugog revisiona ili nedostatka prostora stani i prijavi.
2. Napravi NOVI privatni backup (0700):
   /home2/dentvita/backups/public-before-video-schema-v16-20261006/
   Kopiraj SAMO navedenih šest izvornih datoteka iz public_html u backup,
   uz iste relativne putanje. Provjeri da su svih šest prisutne/čitljive.
   Ne diraj ranije backupove. Ne preimenuj niti briši public_html (0750).
3. Prepiši SAMO pet navedenih HTML-a, na ISTE postojeće putanje u public_html.
   Manifest zamijeni POSLJEDNJI. Ne zamjenjuj cijelu mapu _pages!
   Copy radi s pojedinačnim datotekama; ako overwrite nije potvrđen, premjesti
   stare datoteke u NOVU podmapu displaced-originals/ (0700) ovog backupa,
   uz iste relativne putanje, pa nove stavi na prazna istoimena javna mjesta.
   Datoteke 0644, postojeće podmape zadržati. README/patch-manifest nisu javni.
4. Provjeri pet javnih stranica: /testimonianze, /hr/iskustva-pacijenata,
   /de/erfahrungen-unserer-patienten, /en/testimonials, /si/izkusnje-pacientov.
   HTTP 200, isti vidljivi sadržaj, po 13 VideoObject oznaka s opisima i
   uploadDate s vremenom/zonom (npr. 2026-05-27T03:42:52-07:00).
   Otvori kontaktni popup i provjeri Elfsight prikaz bez slanja upita/poruka.
   Potvrdi novi manifest revision. Naslovnica i redirekcije moraju ostati iste.
5. Kod regresije: novih šest datoteka sačuvaj u NOVU privatnu failed mapu 0700,
   pa vrati tih šest starih iz ovog backupa na iste putanje. Bez preimenovanja
   public_html, promjene konfiguracije ili brisanja asseta/podataka.

SEO MASTER — NAKON OBJAVE
Pokreni Google Rich Results Test za svih pet stranica. U Search Console
izvještaju Videos pokreni Validate fix / Potvrdi ispravak za tri upozorenja.
Googleovo prihvaćanje ovisi o ponovnom crawlu; upozorenja ne nestaju odmah.
Ne treba novi sitemap ni promjena redirekcija. Ovo ne jamči video rich result.
Službena pravila: https://developers.google.com/search/docs/appearance/structured-data/video
`;
await writeFile(join(stage, 'README.txt'), readme, { mode: 0o644 });
await writeFile(
  join(stage, 'patch-manifest.json'),
  JSON.stringify(
    {
      revision,
      baseRevision: previous.revision,
      gitCommit,
      baseArchiveSha256: receipt.sha256,
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
const archiveName = 'dentvitalis-video-schema-20261006-v16.zip';
const archive = join(process.cwd(), '.astro/releases', archiveName);
execFileSync(
  'zip',
  ['-q', '-r', archive, 'README.txt', 'patch-manifest.json', 'public_html'],
  { cwd: stage },
);
execFileSync('unzip', ['-t', archive], { stdio: 'ignore' });
const bytes = await readFile(archive);
const release = {
  archiveName,
  revision,
  baseRevision: previous.revision,
  sourceGitCommit: gitCommit,
  sha256: sha(bytes),
  compressedZipBytes: bytes.length,
  publicFiles: changes.map((c) => c.path),
  htmlChecked: checked,
  videoObjectsChecked: 65,
  onlyVideoSchemaChanged: true,
};
await writeFile(
  'data/seo/video-schema-v16-release-20261006.json',
  JSON.stringify(release, null, 2) + '\n',
);
console.log(JSON.stringify(release, null, 2));
