import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import {
  access,
  mkdir,
  mkdtemp,
  readFile,
  readdir,
  writeFile,
} from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { tmpdir } from 'node:os';
import v15 from '../data/seo/elfsight-favicon-v15-release-20261006.json' with { type: 'json' };
import v16 from '../data/seo/video-schema-v16-release-20261006.json' with { type: 'json' };
import v18 from '../data/seo/contact-address-v18-release-20261007.json' with { type: 'json' };
import v19 from '../data/seo/footer-address-v19-release-20261007.json' with { type: 'json' };
import mapping from '../data/testimonial-video-replacements-20261007.json' with { type: 'json' };
import metadata from '../data/video-metadata.json' with { type: 'json' };
import posters from '../source-assets/external-images/2026-10-07/youtube/manifest.json' with { type: 'json' };

const sha = (bytes) => createHash('sha256').update(bytes).digest('hex');
const revision = '20261007-testimonial-videos-v20';
const archiveName = 'dentvitalis-testimonial-videos-20261007-v20.zip';
const archive = join(process.cwd(), '.astro/releases', archiveName);
const archives = new Map();
for (const receipt of [v15, v16, v18, v19]) {
  const path = join(process.cwd(), '.astro/releases', receipt.archiveName);
  assert.equal(sha(await readFile(path)), receipt.sha256, receipt.revision);
  archives.set(receipt.revision, path);
}
const unzip = (version, path) =>
  execFileSync('unzip', ['-p', archives.get(version), 'public_html/' + path], {
    maxBuffer: 3 * 1024 * 1024,
    stdio: ['ignore', 'pipe', 'pipe'],
  });
const previousBytes = unzip(v19.revision, 'release-manifest.json');
const previous = JSON.parse(previousBytes);
assert.equal(previous.revision, '20261007-footer-address-v19');
const baseline = (path) =>
  unzip(
    [v19, v18, v16].find((r) => r.publicFiles.includes(path))?.revision ??
      v15.revision,
    path,
  );
const base = new Map(previous.files.map((f) => [f.path, f]));
const oldMetadata = JSON.parse(
  execFileSync('git', [
    'show',
    `${v19.sourceGitCommit}:data/video-metadata.json`,
  ]).toString(),
);
for (const video of mapping.unchanged)
  assert.deepEqual(
    metadata.videos.find((v) => v.videoId === video.videoId),
    oldMetadata.videos.find((v) => v.videoId === video.videoId),
  );
const targetPaths = [
  '_pages/testimonianze.html',
  '_pages/hr/iskustva-pacijenata.html',
  '_pages/en/testimonials.html',
  '_pages/de/erfahrungen-unserer-patienten.html',
  '_pages/si/izkusnje-pacientov.html',
];
const figurePattern =
  /<figure class="testimonial-video"[^>]*>[\s\S]*?<\/figure>/g;
const jsonPattern =
  /<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/;
const scripts = (html) =>
  [...html.matchAll(/<script\b[^>]*>[\s\S]*?<\/script>/g)]
    .map((m) => m[0])
    .filter((s) => s.includes('document.querySelectorAll(`[data-youtube]`)'));
const normalize = (html) =>
  html.replace(
    /[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}/g,
    'GENERATED-ID',
  );
const changes = [];
let htmlChecked = 0;
for (const file of previous.files.filter((f) => f.path.endsWith('.html'))) {
  const beforeBytes = baseline(file.path);
  assert.equal(sha(beforeBytes), file.sha256, file.path);
  const before = beforeBytes.toString();
  const after = await readFile(join('dist', file.path), 'utf8');
  let expected = before;
  if (targetPaths.includes(file.path)) {
    const lang = after.match(/<html lang="([^"]+)"/)[1];
    const afterFigures = [...after.matchAll(figurePattern)].map((m) => m[0]);
    const beforeFigures = [...before.matchAll(figurePattern)].map((m) => m[0]);
    assert.equal(afterFigures.length, 13);
    assert.equal(beforeFigures.length, 13);
    expected = expected.replace(figurePattern, (figure) => {
      const oldId = figure.match(/data-youtube="([^"]+)"/)[1];
      const replacement = mapping.replacements.find((v) => v.oldId === oldId);
      if (!replacement) {
        assert.equal(
          afterFigures.find((f) => f.includes(`data-youtube="${oldId}"`)),
          figure,
          'Legacy card changed: ' + oldId,
        );
        return figure;
      }
      let card = figure.replaceAll(oldId, replacement.newId);
      if (replacement.oldTitle)
        card = card.replaceAll(replacement.oldTitle, replacement.title);
      card = card.replace(
        'width="480" height="360"',
        'width="1280" height="720"',
      );
      const url = `https://www.youtube-nocookie.com/embed/${replacement.newId}?autoplay=1&amp;cc_load_policy=1&amp;cc_lang_pref=${lang}&amp;hl=${lang}&amp;playsinline=1&amp;rel=0`;
      card = card.replace(
        `data-title="${replacement.title}"`,
        `data-title="${replacement.title}" data-embed-src="${url}"`,
      );
      assert.equal(
        afterFigures.find((f) =>
          f.includes(`data-youtube="${replacement.newId}"`),
        ),
        card,
        replacement.newId,
      );
      return card;
    });
    const beforeScript = scripts(before),
      afterScript = scripts(after);
    assert.equal(beforeScript.length, 1);
    assert.equal(afterScript.length, 1);
    const patchedScript = beforeScript[0]
      .replace(
        'r.src=`https://www.youtube-nocookie.com/embed/${e.dataset.youtube}?autoplay=1`',
        'r.src=e.dataset.embedSrc??`https://www.youtube-nocookie.com/embed/${e.dataset.youtube}?autoplay=1`',
      )
      .replace(
        'r.allowFullscreen=!0,t.replaceWith(r)',
        'r.allowFullscreen=!0,e.dataset.embedSrc&&(r.referrerPolicy=`strict-origin-when-cross-origin`),t.replaceWith(r)',
      );
    assert.equal(
      patchedScript,
      afterScript[0],
      'Unexpected player code change',
    );
    expected = expected.replace(beforeScript[0], patchedScript);
    const graph = JSON.parse(before.match(jsonPattern)[1]);
    for (const video of graph['@graph'].filter(
      (n) => n['@type'] === 'VideoObject',
    )) {
      const replacement = mapping.replacements.find((v) =>
        video['@id'].endsWith('#video-' + v.oldId),
      );
      if (!replacement) continue;
      const source = metadata.videos.find(
        (v) => v.videoId === replacement.newId,
      );
      assert.ok(source && source.sha256.match(/^[a-f0-9]{64}$/));
      video['@id'] = video['@id'].replace(replacement.oldId, replacement.newId);
      video.name = replacement.title;
      if (replacement.oldTitle)
        video.description = video.description.replace(
          replacement.oldTitle,
          replacement.title,
        );
      video.uploadDate = source.uploadDate;
      video.embedUrl = video.embedUrl.replace(
        replacement.oldId,
        replacement.newId,
      );
      video.thumbnailUrl = video.thumbnailUrl.replace(
        replacement.oldId,
        replacement.newId,
      );
    }
    const actualGraph = JSON.parse(after.match(jsonPattern)[1]);
    assert.deepEqual(actualGraph, graph, 'Only ten video nodes may change');
    expected = expected.replace(jsonPattern, after.match(jsonPattern)[0]);
    for (const replacement of mapping.replacements)
      assert.ok(!expected.includes(replacement.oldId));
    changes.push({
      path: file.path,
      bytes: Buffer.from(expected),
      expectedBeforeSha256: file.sha256,
    });
  }
  assert.equal(
    normalize(after),
    normalize(expected),
    'Unexpected non-video HTML change: ' + file.path,
  );
  htmlChecked++;
}
assert.equal(htmlChecked, 142);
assert.equal(changes.length, 5);
assert.equal(posters.length, 10);
const newAssets = new Set();
for (const poster of posters) {
  const path = poster.output.replace(/^public\//, '');
  assert.ok(!base.has(path), 'New poster must not overwrite an existing asset');
  const bytes = await readFile(join('dist', path));
  assert.equal(sha(bytes), poster.sha256);
  assert.equal(poster.width, 1280);
  assert.equal(poster.height, 720);
  newAssets.add(path);
  changes.push({ path, bytes, expectedBeforeSha256: null });
}
for (const folder of ['_astro', 'assets/images'])
  for (const name of await readdir(join('dist', folder))) {
    const path = folder + '/' + name;
    if (newAssets.has(path)) continue;
    assert.ok(base.has(path), 'Unexpected additional asset: ' + path);
    assert.equal(
      sha(await readFile(join('dist', path))),
      base.get(path).sha256,
      'Existing asset changed: ' + path,
    );
  }
const records = new Map(base);
for (const file of changes)
  records.set(file.path, {
    path: file.path,
    bytes: file.bytes.length,
    sha256: sha(file.bytes),
  });
const files = [...records.values()].sort((a, b) =>
  a.path.localeCompare(b.path),
);
const gitCommit = execFileSync('git', ['rev-parse', 'HEAD']).toString().trim();
const manifest = {
  ...previous,
  revision,
  gitCommit,
  generatedAt: new Date().toISOString(),
  baseRevision: previous.revision,
  basePatchSha256: v19.sha256,
  acceptedBaseRevisions: [v19.revision],
  changeScope:
    'Ten owner-specified video replacements in all five languages, Lucilla Cecchini spelling, real new 16:9 posters, caption-language click-to-load parameters and corresponding sourced VideoObject metadata. Last three videos/cards unchanged. All other HTML, assets, forms, CRM/backend, tracking, addresses, routing and XML unchanged.',
  fileCount: files.length,
  totalBytes: files.reduce((sum, f) => sum + f.bytes, 0),
  files,
};
changes.push({
  path: 'release-manifest.json',
  bytes: Buffer.from(JSON.stringify(manifest, null, 2) + '\n'),
  expectedBeforeSha256: sha(previousBytes),
});
const publicPayloadBytes = changes.reduce((sum, f) => sum + f.bytes.length, 0);
console.log(
  JSON.stringify(
    {
      revision,
      htmlChecked,
      htmlChanged: 5,
      newPosters: 10,
      publicFiles: changes.length,
      publicPayloadBytes,
      onlyApprovedVideoChanges: true,
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
const stage = await mkdtemp(join(tmpdir(), 'dentvitalis-testimonial-v20-'));
for (const change of changes) {
  const path = join(stage, 'public_html', change.path);
  await mkdir(dirname(path), { recursive: true, mode: 0o755 });
  await writeFile(path, change.bytes, { mode: 0o644 });
}
const readme = `DENTVITALIS V20 — NOVI VIDEO TESTIMONIALI, 7.10.2026.
Revision ${revision}; preduvjet aktivni ${v19.revision}.
5 HTML datoteka, 10 NOVIH WebP slika i manifest (16 javnih datoteka).
50 kartica zamijenjeno; Lucilla Cecchini ispravljena. Zadnja tri videa ostaju.
Svih 142 HTML-a usporedjeno; ostali sadrzaj/kod/asseti nepromijenjeni.
Novi videi: cc_load_policy=1, cc_lang_pref/hl=it/hr/en/de/sl, playsinline=1,
rel=0, autoplay=1 tek nakon klika. /si koristi sl, ne si. Player je 16:9.
Nove YouTube slike i datumi su stvarno dohvaćeni, ne kopirani sa starih videa.

VAZNO: automatizirani YouTube player u Codespacesu trazi potvrdu "niste bot".
URL-ovi, klik/Enter, atributi, slike i schema jesu provjereni; stvarna
reprodukcija i svih pet rucnih titlovnih traka nisu potvrđeni u tom okruženju.
Ne prikazivati to kao potpun YouTube prihvat. Provjeriti u običnom pregledniku.
Vlasnik je u svom pregledniku POTVRDIO prvi novi HR video Lucilla Cecchini:
reprodukcija radi i hrvatski titlovi su uključeni. To nije potvrda ostalih 49.

CPANEL AGENT
1. Upload/Extract u NOVU release mapu izvan javnog weba:
   /home2/dentvita/releases/20261007-testimonial-videos-v20/
   Provjeri ZIP, aktivni V19, kvotu i dovoljno prostora za ZIP, raspakirani
   payload (${publicPayloadBytes} B), backup šest izvornika i rezervu.
   Ako prostora/prava nema, stani; ne brisi stare backupove/releaseove.
2. Napravi NOVI privatni backup 0700:
   /home2/dentvita/backups/public-before-testimonial-videos-v20-20261007/
   Sacuvaj samo PET starih HTML-a i release-manifest.json uz ISTE relativne
   putanje. Provjeri kopije i expectedBeforeSha256 iz patch-manifest.json.
   Deset novih asset putanja mora biti NEPOSTOJEĆE; ako postoje, stani.
3. Dodaj deset novih assets/images/youtube-NOVI_ID.webp slika (0644) PRVO.
   Ne mijenjaj niti brisi trinaest starih slika ni druge assete.
   Zatim zamijeni samo:
${targetPaths.map((p) => '   ' + p).join('\n')}
   Manifest zamijeni POSLJEDNJI. Cilj /home2/dentvita/public_html/ + ista putanja.
   Ne zamjenjuj cijeli _pages; ne napravi _pages/_pages.
   Ako Copy overwrite nije jasan, premjesti pojedine izvornike u NOVU privatnu
   displaced-originals/ 0700 pa nove stavi na prazne istoimene putanje.
   Datoteke 0644, postojece mape zadrzi, public_html ostaje 0750.
   NE preimenuj/briši public_html. NE diraj PHP/application/CRM/backend,
   forme, GTM, CookieYes, Elfsight, .htaccess, sitemap/robots ili DNS.
4. Javno provjeri pet ruta: HTTP 200, 13 kartica istim redoslijedom, novih
   deset ID-jeva i zadnja tri zyUCJSaCPgQ/Zs_gwP-7iuc/fzDUHdfqXfo.
   Za svih 50 novih kartica watch link i iframe moraju upucivati na isti novi ID.
   /si parametri sl. Prije klika NULA YouTube iframeova; click/Enter stvara jedan.
   Lokalni posteri 200 i 16:9; mobile bez overflowa. Title, allowfullscreen,
   allow i referrerpolicy kao u korisnickoj uputi. Svaki jezik: pokreni video,
   potvrdi rucne titlove u trazenom jeziku, provjeri mobile i desktop.
   Ako YouTube blokira test, zabiljezi tocnu poruku; ne oznaci playback/titlove
   provjerenim na temelju samog URL-a. Ne salji kontaktne upite/WhatsApp poruke.
   Schema: 13 VideoObject po ruti, novih 10 ID-jeva/thumbnail/embed/datum sa
   zonom i Lucilla Cecchini; tri stara datuma i svi drugi schema podaci isti.
   Potvrdi hashove svih 16 datoteka i revision ${revision}.
5. Kod regresije sačuvaj samo šest novih HTML/manifest datoteka u NOVU
   privatnu failed mapu 0700, vrati šest izvornih datoteka (manifest posljednji).
   Deset novih slika moze ostati kao neupotrijebljeni asseti; ne brisi ih
   automatski. Bez preimenovanja public_html i bez izmjena konfiguracije/backenda.
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
  publicFiles: changes.map((f) => f.path),
  htmlChecked,
  videoCardsChanged: 50,
  newPosters: 10,
  onlyApprovedVideoChanges: true,
  livePlaybackCaptionVerification:
    'Owner confirmed playback and Croatian subtitles for z4sEEQUWAs4 on HR preview. Other video/language combinations pending ordinary-browser verification; automated player blocked by YouTube bot check.',
};
await writeFile(
  'data/seo/testimonial-videos-v20-release-20261007.json',
  JSON.stringify(receipt, null, 2) + '\n',
);
console.log(JSON.stringify(receipt, null, 2));
