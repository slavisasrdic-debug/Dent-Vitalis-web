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
import { installedV24Baseline, sha256 } from './installed-v20-baseline.mjs';
import { websiteCredit, websiteProducer } from '../data/website-credit.ts';

const revision = '20261020-enter-credit-v26';
const archiveName = 'dentvitalis-enter-credit-20261020-v26.zip';
const archive = resolve('.astro/releases', archiveName);
const base = await installedV24Baseline();
const component = await readFile('src/components/WebsiteCredit.astro', 'utf8');
const css = component.match(/<style[^>]*>([\s\S]*?)<\/style>/)[1];
const normalize = (html) =>
  html.replace(
    /[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}/g,
    'GENERATED-ID',
  );
const schemaPattern =
  /(<script type="application\/ld\+json">)([\s\S]*?)(<\/script>)/g;
const footerPattern =
  /(<p class="copyright"[^>]*>[\s\S]*?<\/p>) <\/div><\/footer>/g;
const changes = [];
for (const file of base.manifest.files.filter((f) =>
  f.path.endsWith('.html'),
)) {
  const before = base.read(file.path).toString();
  let expected = before;
  if (file.path !== '404.html') {
    const lang = before.match(/<html[^>]*\blang="([^"]+)"/)[1];
    const { label, text } = websiteCredit(lang);
    assert.ok(!before.includes('data-website-credit'));
    let schemas = 0,
      footers = 0;
    expected = before.replace(schemaPattern, (_, open, raw, close) => {
      schemas++;
      const graph = JSON.parse(raw);
      assert.equal(
        graph['@graph'].filter((n) => n['@type'] === 'WebSite').length,
        1,
      );
      graph['@graph'] = graph['@graph'].map((node) => {
        if (node['@type'] !== 'WebSite') return node;
        assert.deepEqual(node.publisher, {
          '@id': 'https://www.dentvitalis.com/#dentist',
        });
        assert.equal(node.creator, undefined);
        assert.equal(node.creditText, undefined);
        return Object.fromEntries(
          Object.entries(node).flatMap(([key, value]) =>
            key === 'publisher'
              ? [
                  [key, value],
                  ['creator', { '@id': websiteProducer.id }],
                  ['creditText', text],
                ]
              : [[key, value]],
          ),
        );
      });
      graph['@graph'].push({
        '@type': 'Organization',
        '@id': websiteProducer.id,
        name: websiteProducer.name,
        url: websiteProducer.url,
      });
      return open + JSON.stringify(graph).replaceAll('<', '\\u003c') + close;
    });
    const markup = `<p class="website-credit" data-website-credit>${label}: <a href="${websiteProducer.url}" rel="nofollow">${websiteProducer.name}</a> </p> <style data-website-credit-style>${css}</style>`;
    expected = expected.replace(footerPattern, (_, copyright) => {
      footers++;
      return copyright + ' ' + markup + '</div></footer>';
    });
    assert.equal(schemas, 1, file.path);
    assert.equal(footers, 1, file.path);
    changes.push({
      path: file.path,
      bytes: Buffer.from(expected),
      expectedBeforeSha256: file.sha256,
    });
  }
  assert.equal(
    normalize(await readFile(join('dist', file.path), 'utf8')),
    normalize(expected),
    'Unexpected HTML change: ' + file.path,
  );
}
assert.equal(changes.length, 141);
const records = new Map(base.manifest.files.map((f) => [f.path, f]));
async function verifyAssets(directory) {
  for (const entry of await readdir(join('dist', directory), {
    withFileTypes: true,
  })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) await verifyAssets(path);
    else {
      assert.ok(records.has(path), 'New asset: ' + path);
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
// Existing deployed XML is deliberately retained, not replaced with build-time XML.
// In particular, deployed sitemap.xml is the earlier full sitemap, whereas the
// current route generates a sitemap index. Neither format is changed by this patch.
// Legacy page-routes.json is retained too; no routing file is in the payload.
for (const path of ['robots.txt'])
  assert.equal(
    sha256(await readFile(join('dist', path))),
    records.get(path).sha256,
    path,
  );
for (const f of changes)
  records.set(f.path, {
    path: f.path,
    bytes: f.bytes.length,
    sha256: sha256(f.bytes),
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
  acceptedBaseRevisions: [base.manifest.revision],
  changeScope:
    'Only localized visible footer website production attribution to Enter Internet (nofollow), scoped inline credit styling including footer bottom clearance through 991px, and WebSite creator/creditText plus Organization identity. Clinic publisher and all other schema, HTML, forms, assets, backend, routing, XML, consent and tracking unchanged. V25 is not required.',
  fileCount: files.length,
  totalBytes: files.reduce((sum, f) => sum + f.bytes, 0),
  files,
};
changes.push({
  path: 'release-manifest.json',
  bytes: Buffer.from(JSON.stringify(manifest, null, 2) + '\n'),
  expectedBeforeSha256: sha256(base.manifestBytes),
});
const publicPayloadBytes = changes.reduce((sum, f) => sum + f.bytes.length, 0);
console.log(
  JSON.stringify({
    revision,
    baseRevision: base.manifest.revision,
    htmlChecked: 142,
    htmlChanged: 141,
    publicFiles: changes.length,
    publicPayloadBytes,
    onlyApprovedChanges: true,
  }),
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
const stage = await mkdtemp(join(tmpdir(), 'dentvitalis-credit-v26-'));
for (const f of changes) {
  const path = join(stage, 'public_html', f.path);
  await mkdir(dirname(path), { recursive: true, mode: 0o755 });
  await writeFile(path, f.bytes, { mode: 0o644 });
}
const readme = `DENTVITALIS V26 — POTPIS ENTER INTERNET, 20.10.2026.
Revision: ${revision}. Jedini odobreni početni revision: ${base.manifest.revision}.
V25 NIJE potreban i nije preduvjet. V24 privole/chat/položaji ostaju isti.
141 pojedinačni HTML + manifest, bez novih asseta ili JavaScripta.
Potpis u footeru na pet jezika s brendiranom nofollow poveznicom. Schema.org:
Organization Enter Internet, WebSite.creator i lokalizirani creditText.
DentVitalis ostaje publisher; medicinski autori, Service/Offer/Video/FAQ nisu mijenjani.
Donji footer razmak 160px + safe-area vrijedi do 991px (ranije samo do 767px),
kako fiksni kontaktni CTA ne bi prekrivao potpis u landscape/tablet prikazu.

CPANEL AGENT — README i patch-manifest.json OSTAJU PRIVATNI.
1. Upload i Extract u novu privatnu release mapu
   /home2/dentvita/releases/${revision}/ (0700).
   Provjeri ZIP SHA-256 iz predaje, aktivni revision V24 i SVJEŽU kvotu.
   ZIP + extract (${publicPayloadBytes} B) + backup izvornika + najmanje 10 MB
   rezerve; eventualnu dodatnu displaced-originals kopiju također uračunaj.
   Ne briši druge release mape ili backupe. Ako nema mjesta, stani i prijavi.
2. Napravi novi privatni backup (0700):
   /home2/dentvita/backups/public-before-${revision}/
   Sačuvaj 142 izvornika s istim relativnim putanjama iz patch-manifest.json.
   Provjeri sve expectedBeforeSha256 hashove na aktivnim datotekama I backupu
   PRIJE zamjene. Ako se razlikuju ili je aktivan drugi revision, STOP.
3. Zamijeni SAMO 141 pojedinačnu HTML datoteku na istim putanjama, a
   release-manifest.json POSLJEDNJI. Datoteke 0644; public_html ostaje 0750.
   Ne preimenuj/briši public_html, ne mijenjaj cijeli _pages, bez _pages/_pages.
   Ako Copy overwrite nije jasan, pojedine stare ciljeve premjesti u novu
   privatnu displaced-originals (0700), pa nove na iste slobodne putanje.
   NE diraj backend/PHP/CRM/application, assete, .htaccess, redirekcije,
   sitemap/robots/XML, GTM, CookieYes, Elfsight, DNS ili postavke hostinga.
4. Potvrdi svih 142 novih hashova i revision ${revision}. Javno provjeri
   pet naslovnica, HR kontakt, detalj usluge, video iskustva i zahvalnu rutu.
   Svugdje 200, jedan lokalizirani vidljivi potpis i ispravna nofollow poveznica.
   JSON-LD mora biti valjan: jedan Enter Organization, WebSite.creator prema
   njemu i creditText jednak footeru; publisher ostaje DentVitalis.
   Provjeri footer na desktopu/mobitelu, bez overflowa; fokus tipkovnicom i link.
   Na 390/768/820/991px i landscape, skrol do kraja: cijeli copyright/potpis
   mora ostati iznad fiksne CTA trake (najmanje 20px razmaka). Od 992px desktop.
   Otvori/zatvori kontaktni popup BEZ slanja. Provjeri V24 CookieYes položaj
   i postojeći WhatsApp nakon korisnikove privole; NE mijenjaj CMP/GTM postavke
   niti automatski prihvaćaj sve radi testa. Provjeri stare PHP stranice,
   GET /send, po jednu postojeću 301 i 410 te nepostojeći URL (404).
   Ne prikazuj tokene i ne šalji forme, e-mailove ni WhatsApp poruke.
5. Kod regresije sačuvaj samo nove ciljne datoteke u NOVU privatnu FAILED
   mapu (0700). Vrati svih 142 izvornika iz backupa, manifest posljednji.
   Potvrdi povratak na početni V24 hashovima i javnim provjerama.
Prijavi revision, SHA status, javne provjere, backup, slobodnu kvotu i ograničenja.
Nacrt članka za Enter nije dio ovog ZIP-a niti se objavljuje na DentVitalisu.
`;
await writeFile(join(stage, 'README.txt'), readme, { mode: 0o644 });
await writeFile(
  join(stage, 'patch-manifest.json'),
  JSON.stringify(
    {
      revision,
      baseRevision: base.manifest.revision,
      gitCommit,
      publicPayloadBytes,
      publicFiles: changes.map((f) => ({
        path: f.path,
        bytes: f.bytes.length,
        sha256: sha256(f.bytes),
        expectedBeforeSha256: f.expectedBeforeSha256,
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
const receipt = {
  archiveName,
  revision,
  baseRevision: base.manifest.revision,
  sourceGitCommit: gitCommit,
  sha256: sha256(zip),
  compressedZipBytes: zip.length,
  publicPayloadBytes,
  publicFiles: changes.map((f) => f.path),
  htmlChecked: 142,
  htmlChanged: 141,
  onlyApprovedChanges: true,
};
await writeFile(
  'data/seo/website-credit-v26-release-20261020.json',
  JSON.stringify(receipt, null, 2) + '\n',
);
console.log(
  JSON.stringify({
    archiveName,
    sha256: receipt.sha256,
    compressedZipBytes: zip.length,
    publicFiles: changes.length,
  }),
);
