import assert from 'node:assert/strict';
import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import comparison from '../docs/seo/handoff-simple-20261004/report.json' with { type: 'json' };

// Reuse one completed, read-only public audit; do not crawl or change hosting.
const [suppliedAudit, suppliedExtra] = process.argv.slice(2);
assert.ok(suppliedAudit, 'Supply the completed external HTTP audit JSON.');
const audit = JSON.parse(await readFile(suppliedAudit, 'utf8'));
assert.equal(audit.revisionBefore, '20261004-whatsapp-brand-v9');
assert.equal(audit.revisionAfter, audit.revisionBefore);
const byOld = new Map(comparison.comparison.map((row) => [row.old, row]));
const pages = new Map(audit.pages.map((page) => [page.url, page]));
const medical = new Set([
  'all-on-four',
  'full-arch-bridge',
  'implant-denture',
  'whitening-method',
]);
const directions = {
  it: '/su-di-noi/come-raggiungerci',
  sl: '/si/kako-do-nas',
  en: '/en/directions',
  de: '/de/wie-sie-uns-erreichen',
};
const origin = 'https://www.dentvitalis.com';
const rows = [];
for (const live of [
  ...audit.legacyInventory.old200,
  ...audit.legacyInventory.non200,
]) {
  const old = byOld.get(live.old);
  assert.ok(old, live.old);
  if (old.status === 'preserved-PHP-runtime-check-required') continue;
  const from = new URL(live.old).pathname;
  let action,
    target = '',
    reason,
    approvalGroup;
  if (old.group === 'no-dedicated-equivalent') {
    action = 'content-preservation-or-410';
    approvalGroup = 'C';
    reason =
      'Nema novog punog ekvivalenta. Preporuka: prenijeti postojeći tekst u novi dizajn; 410 samo uz izričitu odluku vlasnika.';
  } else if (old.group === 'campaigns' || from === '/decisione-implantologia') {
    action = '410';
    approvalGroup = 'C';
    reason =
      old.group === 'campaigns'
        ? 'Prijedlog gašenja stare kampanje. Aktivni oglasi na ovu adresu prestali bi raditi.'
        : 'Prijedlog gašenja već nepostojećeg zasebnog starog članka.';
  } else if (old.group === 'no-confirmed-equivalent') {
    action = 'keep-404';
    approvalGroup = 'existing';
    reason =
      'Stara stranica greške: zadržati stvarni 404, bez preusmjeravanja na naslovnicu i izvan sitemapa.';
  } else {
    action = '301';
    approvalGroup = medical.has(old.group) ? 'B' : 'A';
    target =
      old.group === 'destination-guide'
        ? origin + directions[old.language]
        : old.proposalTargets[0];
    const page = pages.get(target);
    assert.ok(page, target);
    assert.equal(page.status, 200);
    assert.equal(page.lang, old.language);
    assert.equal(page.canonical, target);
    reason =
      approvalGroup === 'B'
        ? 'Zamjena starog opisa novom ponuđenom uslugom: konstrukcija/metoda može se razlikovati. Nije tvrdnja o medicinskoj istovjetnosti; potrebna odluka vlasnika.'
        : 'Prijedlog zamjene/objedinjavanja starog detaljnog članka novom pripadajućom tematskom stranicom u istom jeziku; potrebna odluka vlasnika.';
  }
  rows.push({
    from,
    language: old.language,
    group: old.group,
    currentHttpStatus: live.status,
    action,
    target: target ? new URL(target).pathname : '',
    approvalGroup,
    reason,
    previousInventoryHttpStatus: old.oldHttpStatus,
  });
}
rows.push({
  from: '/en/contacts',
  language: 'en',
  group: 'contacts',
  currentHttpStatus: audit.legacyInventory.extraContacts.status,
  action: '301',
  target: '/en/contact',
  approvalGroup: 'A',
  reason:
    'Stari kontakt ostaje 200 u starom dizajnu; nova kontakt stranica odgovara namjeni.',
});
if (suppliedExtra) {
  const extra = JSON.parse(await readFile(suppliedExtra, 'utf8'));
  assert.deepEqual(
    extra.map((row) => row.path),
    ['/action', '/hr/registration-fb'],
  );
  for (const live of extra) {
    assert.equal(live.status, 200);
    assert.equal(live.modern, false);
    rows.push({
      from: live.path,
      language: live.path.startsWith('/hr/') ? 'hr' : 'it',
      group: 'campaigns',
      currentHttpStatus: live.status,
      action: '410',
      target: '',
      approvalGroup: 'C',
      reason:
        'Dodatna stara kampanja iz potpunog URL inventara (izvan XML sitemapa). Prijedlog gašenja; oglasi na ovu adresu prestali bi raditi.',
    });
  }
}
assert.equal(rows.length, suppliedExtra ? 130 : 128);
assert.equal(new Set(rows.map((row) => row.from)).size, rows.length);
const counts = Object.fromEntries(
  ['A', 'B', 'C', 'existing'].map((group) => [
    group,
    rows.filter((row) => row.approvalGroup === group).length,
  ]),
);
assert.deepEqual(counts, {
  A: 84,
  B: 17,
  C: suppliedExtra ? 20 : 18,
  existing: 9,
});
const payload = {
  status: 'proposal-awaiting-owner-decisions-not-installed',
  checkedAt: audit.finishedAt,
  currentRevision: audit.revisionAfter,
  existingRedirectsExternallyPassed: audit.redirects.checked,
  counts,
  rows,
  existingPreservedPhpPagesNotChanged: [
    '/hr/desinfekcija',
    '/hr/klinicko-produzenje-krune-prirodnog-zuba',
    '/hr/keramicki-most-na-svim-implantatima',
  ],
  genericFallbackChangeApproved: false,
  sourceContentOrProductionChanged: false,
};
const root = resolve(import.meta.dirname, '..');
await writeFile(
  resolve(root, 'data/seo/post-live-redirect-proposal-20261004.json'),
  JSON.stringify(payload, null, 2) + '\n',
  { flag: 'w' },
);
const quote = (value) => '"' + String(value ?? '').replaceAll('"', '""') + '"';
const columns = [
  'from',
  'language',
  'currentHttpStatus',
  'action',
  'target',
  'approvalGroup',
  'reason',
];
const csv =
  '\uFEFF' +
  [
    'stari_url;jezik;trenutni_http;prijedlog;novi_url;skupina_odluke;obrazlozenje',
    ...rows.map((row) => columns.map((column) => quote(row[column])).join(';')),
  ].join('\r\n') +
  '\r\n';
await writeFile(
  resolve(
    root,
    '.astro/reports/DentVitalis-preostale-redirekcije-prijedlog-20261004.csv',
  ),
  csv,
  { flag: 'w' },
);
console.log(
  JSON.stringify({ rows: rows.length, counts, status: payload.status }),
);
