import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import {
  mkdir,
  mkdtemp,
  readFile,
  rm,
  writeFile,
  copyFile,
} from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

// Dependency-free, real Office Open XML workbook. Generated reports stay outside Git.
const root = fileURLToPath(new URL('../', import.meta.url));
const csvPath = resolve(root, 'docs/seo/redirects-approved-20261004.csv');
const output = resolve(
  root,
  '.astro/reports/DentVitalis-SEO-redirekcije-20261004.xlsx',
);
const csv = await readFile(csvPath, 'utf8');
const checkExisting = process.argv.includes('--check');
const decisions = JSON.parse(
  await readFile(
    resolve(root, 'data/seo/cpanel-redirect-decisions.json'),
    'utf8',
  ),
);
const release = JSON.parse(
  await readFile(
    resolve(root, 'data/seo/cpanel-routing-revision-20261004.json'),
    'utf8',
  ),
);

export function parseCsv(text) {
  const rows = [];
  let row = [],
    value = '',
    quoted = false;
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (char === '"') {
      if (quoted && text[i + 1] === '"') {
        value += '"';
        i++;
      } else quoted = !quoted;
    } else if (char === ',' && !quoted) {
      row.push(value);
      value = '';
    } else if ((char === '\n' || char === '\r') && !quoted) {
      if (char === '\r' && text[i + 1] === '\n') i++;
      row.push(value);
      rows.push(row);
      row = [];
      value = '';
    } else value += char;
  }
  assert.equal(quoted, false, 'Unclosed CSV string');
  if (row.length || value) {
    row.push(value);
    rows.push(row);
  }
  return rows;
}

const [sourceHeaders, ...rules] = parseCsv(csv);
assert.equal(sourceHeaders.length, 10);
assert.equal(rules.length, 220);
assert(rules.every((row) => row.length === 10 && row[9] === 'ne'));
assert.equal(decisions.status, 'owner-approved-for-candidate');
assert.equal(
  release.publicSiteActivated,
  false,
  'Update the dated report if production changes',
);
assert.equal(release.serverUploaded, false);

const labels = {
  HOST_NORMALIZACIJA: 'HTTPS / www',
  NASLIJEDENI_REDIRECT: 'Postojeća redirekcija',
  ODOBRENI_STARI_ALIAS: 'Odobren novi cilj starog aliasa',
  ODOBRENI_NOVI_CILJ: 'Odobrena nova redirekcija',
  ZAVRSNI_SLASH: 'Uklanjanje završnog slasha',
  NASLIJEDENO_HOST_PRAVILO: 'Staro host pravilo (novi 308 ima prednost)',
  UKLONJENO_410: '410: uklonjena stranica, nije redirekcija',
  UKLONJENO_PRAVILO_NEAKTIVNO: 'Uklonjeno pravilo: NEAKTIVNO',
};
const counts = Object.fromEntries(
  Object.keys(labels).map((key) => [
    key,
    rules.filter((row) => row[1] === key).length,
  ]),
);
assert.deepEqual(Object.values(counts), [3, 56, 8, 6, 140, 2, 2, 3]);

const summary = [
  ['DentVitalis — SEO pregled', '4. listopada 2026.', '', ''],
  [
    'STATUS',
    'Novi paket NIJE aktiviran na produkciji.',
    'Ovo je pregled konfiguracije pripremljenog paketa, ne potvrda stvarnih produkcijskih odgovora.',
    '',
  ],
  [
    'Kako čitati',
    'Prvi list: jednostavan sažetak odobrenih odluka.',
    'Drugi list: svih 220 stavki konfiguracije, uključujući 410 i neaktivna pravila. Filteri su uključeni.',
    '',
  ],
  [
    'Domena',
    'Sve relativne adrese u ovom sažetku odnose se na:',
    'https://www.dentvitalis.com',
    '',
  ],
  [
    'Važno',
    'HTTP u popisu = status u kodu, ne rezultat testa na novoj produkciji.',
    'Popis pravila paketa nije završni prihvat svih 206 poznatih starih URL-ova.',
    '',
  ],
  ['Odobrene redirekcije', 'Stara adresa', 'Novo odredište', 'Napomena'],
];
for (const redirect of decisions.redirects) {
  const testimonial = /testimonials/.test(redirect.from);
  const note = testimonial
    ? '301. Zbirka iskustava je odobrena zamjena; pojedinačno svjedočanstvo nije preneseno.'
    : '301. Odobreno i pripremljeno; produkcijska provjera slijedi.';
  summary.push(['Nova redirekcija', redirect.from, redirect.to, note]);
  for (const alias of redirect.legacyAliases) {
    summary.push([
      'Stari alias — izravni cilj',
      alias.from,
      redirect.to,
      `301. Bez prolaska kroz stari međucilj.${alias.sourceOccurrences > 1 ? ' Dvije iste pojave pravila sačuvane u potpunom popisu.' : ''}`,
    ]);
  }
}
summary.push([
  'VR engleski',
  decisions.vrTour.from,
  decisions.vrTour.to,
  '301. Ostaje /en; suprotno pravilo prema / uklonjeno.',
]);
summary.push(['Zadržane stare PHP stranice', 'Adresa', 'Odluka', 'Napomena']);
for (const page of decisions.preservedPhpPages) {
  summary.push([
    'Bez nove redirekcije',
    page,
    'Ostaje postojeća PHP stranica',
    'Stari web: HTTP 200. Nakon aktivacije provjeriti stranicu i sačuvane stare CSS/JS/slike/fontove.',
  ]);
}
summary.push(['Ostala pravila', 'Broj stavki', 'Značenje', 'Napomena']);
for (const [category, count] of Object.entries(counts)) {
  summary.push([
    labels[category],
    String(count),
    category === 'UKLONJENO_PRAVILO_NEAKTIVNO'
      ? 'Dvije HR pojave i suprotni VR cilj uklonjeni.'
      : category === 'UKLONJENO_410'
        ? 'Vraćaju 410 Gone, bez preusmjeravanja.'
        : category === 'ZAVRSNI_SLASH'
          ? '308 za poznate stranice; korijen / je iznimka.'
          : category === 'HOST_NORMALIZACIJA'
            ? '308: HTTP / bez www → HTTPS / www.'
            : 'Detalji su u listu Potpuni popis.',
    'Broj konfiguracijskih stavki, ne broj jedinstvenih starih URL-ova.',
  ]);
}
summary.push(
  ['Provjere i što preostaje', 'Nalaz', 'Sljedeći korak', 'Napomena'],
  [
    'Lokalne ciljane provjere',
    `${release.tests.passed}/${release.tests.passed} prošlo; uključuju izolirani Apache.`,
    'Nakon aktivacije provjeriti stvarne HTTP statuse, ciljeve, query parametre, lance i petlje.',
    'Nije završni prihvat cijelog produkcijskog weba.',
  ],
  [
    'SEO na produkciji',
    'Još nije potvrđeno za novi paket.',
    'Canonical, hreflang, sitemap, robots, 404/410 i preostali stari URL-ovi.',
    'Ne provjeravati Cloudflare kao produkciju.',
  ],
  [
    'GTM / CookieYes',
    'Postojeći GTM upravlja CookieYesom — odobreno.',
    'Nakon aktivacije provjeriti privolu, tagove i konverzije na dentvitalis.com.',
    'Ovaj Excel ne potvrđuje runtime ponašanje tagova.',
  ],
  [
    'Paket',
    release.archiveName,
    'Lokalno pripremljen, nije uploadan niti aktiviran.',
    'Sadržaj, forme i mediji nisu mijenjani ovim routing paketom.',
  ],
  ['SHA-256 paketa', release.sha256, '', ''],
  [
    'Izvor potpunog popisa',
    'docs/seo/redirects-approved-20261004.csv',
    `SHA-256: ${createHash('sha256').update(csv).digest('hex')}`,
    'GitHub je izvor podataka; Excel je izvedeni izvještaj.',
  ],
);

const detailHeaders = [
  'Vrsta pravila',
  'Stara adresa / obrazac',
  'Ciljna adresa / obrazac',
  'HTTP u kodu',
  'Napomena',
  'Podudaranje',
  'Cilj u statičkoj mapi',
  'Nova produkcija provjerena?',
  'Redak .htaccess',
  'ID',
];
const detail = [
  detailHeaders,
  ...rules.map((r) => [
    labels[r[1]],
    r[2],
    r[3],
    r[4],
    r[8],
    r[5],
    r[7],
    r[9],
    r[6],
    r[0],
  ]),
];
for (const [i, row] of detail.slice(1).entries()) {
  // Recover every original column, including duplicate and inactive rule records.
  const category = Object.keys(labels).find((key) => labels[key] === row[0]);
  assert.deepEqual(
    [
      row[9],
      category,
      row[1],
      row[2],
      row[3],
      row[5],
      row[8],
      row[6],
      row[4],
      row[7],
    ],
    rules[i],
  );
}

const xml = (s) =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
const col = (n) => {
  let result = '';
  for (n++; n; n = Math.floor((n - 1) / 26))
    result = String.fromCharCode(65 + ((n - 1) % 26)) + result;
  return result;
};
const declaration = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>';
const ns = 'http://schemas.openxmlformats.org/spreadsheetml/2006/main';
function worksheet(rows, widths, isDetail) {
  const headers = new Set([
    'Odobrene redirekcije',
    'Zadržane stare PHP stranice',
    'Ostala pravila',
    'Provjere i što preostaje',
  ]);
  const body = rows
    .map((row, i) => {
      const heading = isDetail ? i === 0 : i === 0 || headers.has(row[0]);
      const style = heading
        ? 1
        : (!isDetail && i === 1) ||
            row[0].includes('NEAKTIVNO') ||
            row[0].startsWith('410:')
          ? 3
          : i % 2
            ? 2
            : 0;
      const height = heading ? 28 : isDetail ? 60 : 78;
      return `<row r="${i + 1}" ht="${height}" customHeight="1">${row.map((value, j) => `<c r="${col(j)}${i + 1}" s="${style}" t="inlineStr"><is><t xml:space="preserve">${xml(value)}</t></is></c>`).join('')}</row>`;
    })
    .join('');
  return `${declaration}<worksheet xmlns="${ns}"><dimension ref="A1:${col(widths.length - 1)}${rows.length}"/><sheetViews><sheetView workbookViewId="0"><pane ySplit="${isDetail ? 1 : 5}" topLeftCell="A${isDetail ? 2 : 6}" activePane="bottomLeft" state="frozen"/></sheetView></sheetViews><sheetFormatPr defaultRowHeight="18"/><cols>${widths.map((w, i) => `<col min="${i + 1}" max="${i + 1}" width="${w}" customWidth="1"/>`).join('')}</cols><sheetData>${body}</sheetData>${isDetail ? `<autoFilter ref="A1:J${rows.length}"/>` : ''}<pageMargins left="0.3" right="0.3" top="0.5" bottom="0.5" header="0.2" footer="0.2"/><pageSetup paperSize="9" orientation="landscape" fitToWidth="1" fitToHeight="0"/></worksheet>`;
}
const parts = {
  '[Content_Types].xml': `${declaration}<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/><Override PartName="/xl/worksheets/sheet2.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/></Types>`,
  '_rels/.rels': `${declaration}<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>`,
  'xl/workbook.xml': `${declaration}<workbook xmlns="${ns}" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets><sheet name="Sažetak" sheetId="1" r:id="rId1"/><sheet name="Potpuni popis" sheetId="2" r:id="rId2"/></sheets></workbook>`,
  'xl/_rels/workbook.xml.rels': `${declaration}<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet2.xml"/><Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>`,
  'xl/styles.xml': `${declaration}<styleSheet xmlns="${ns}"><fonts count="2"><font><sz val="11"/><name val="Calibri"/></font><font><b/><color rgb="FFFFFFFF"/><sz val="11"/><name val="Calibri"/></font></fonts><fills count="5"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill><fill><patternFill patternType="solid"><fgColor rgb="FF155E75"/><bgColor indexed="64"/></patternFill></fill><fill><patternFill patternType="solid"><fgColor rgb="FFF0F7FA"/><bgColor indexed="64"/></patternFill></fill><fill><patternFill patternType="solid"><fgColor rgb="FFFFF1D6"/><bgColor indexed="64"/></patternFill></fill></fills><borders count="1"><border><left/><right/><top/><bottom/><diagonal/></border></borders><cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs><cellXfs count="4">${[0, 2, 3, 4].map((fillId, i) => `<xf numFmtId="0" fontId="${i === 1 ? 1 : 0}" fillId="${fillId}" borderId="0" xfId="0" applyAlignment="1" applyFill="1" applyFont="1"><alignment vertical="top" wrapText="1"/></xf>`).join('')}</cellXfs><cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles></styleSheet>`,
  'xl/worksheets/sheet1.xml': worksheet(summary, [34, 65, 70, 54], false),
  'xl/worksheets/sheet2.xml': worksheet(
    detail,
    [38, 74, 74, 14, 65, 50, 21, 26, 18, 10],
    true,
  ),
};
const stage = await mkdtemp(resolve(tmpdir(), 'dentvitalis-seo-excel-'));
try {
  for (const [path, contents] of Object.entries(parts)) {
    const target = resolve(stage, path);
    await mkdir(dirname(target), { recursive: true });
    await writeFile(target, contents, 'utf8');
    execFileSync('xmllint', ['--noout', target], { stdio: 'pipe' });
  }
  const archive = resolve(stage, 'report.xlsx');
  execFileSync('zip', ['-q', '-X', archive, ...Object.keys(parts)], {
    cwd: stage,
  });
  execFileSync('unzip', ['-t', archive], { stdio: 'pipe' });
  for (const [path, contents] of Object.entries(parts)) {
    assert.equal(
      execFileSync(
        'unzip',
        [
          '-p',
          archive,
          path === '[Content_Types].xml' ? '\\[Content_Types\\].xml' : path,
        ],
        { encoding: 'utf8' },
      ),
      contents,
    );
  }
  const decodeXml = (value) =>
    value.replace(
      /&(?:amp|lt|gt|quot|apos);/g,
      (entity) =>
        ({
          '&amp;': '&',
          '&lt;': '<',
          '&gt;': '>',
          '&quot;': '"',
          '&apos;': "'",
        })[entity],
    );
  for (const [index, expected] of [summary, detail].entries()) {
    const serialized = execFileSync(
      'unzip',
      ['-p', archive, `xl/worksheets/sheet${index + 1}.xml`],
      { encoding: 'utf8' },
    );
    const recovered = [
      ...serialized.matchAll(/<row\b[^>]*>(.*?)<\/row>/gs),
    ].map((row) =>
      [...row[1].matchAll(/<t\b[^>]*>(.*?)<\/t>/gs)].map((cell) =>
        decodeXml(cell[1]),
      ),
    );
    assert.deepEqual(
      recovered,
      expected,
      'Every workbook cell must round-trip without data loss',
    );
    assert(!serialized.includes('<f>'), 'Report must not contain formulas');
  }
  if (checkExisting) {
    execFileSync('unzip', ['-t', output], { stdio: 'pipe' });
    for (const [path, contents] of Object.entries(parts)) {
      assert.equal(
        execFileSync(
          'unzip',
          [
            '-p',
            output,
            path === '[Content_Types].xml' ? '\\[Content_Types\\].xml' : path,
          ],
          { encoding: 'utf8' },
        ),
        contents,
      );
    }
  } else {
    await mkdir(dirname(output), { recursive: true });
    await copyFile(archive, output, 1); // COPYFILE_EXCL: never overwrite an existing report.
  }
  console.log(
    JSON.stringify(
      {
        output,
        sheets: 2,
        rules: rules.length,
        summaryRows: summary.length,
        crc: 'passed',
        xml: 'passed',
        sourceSha256: createHash('sha256').update(csv).digest('hex'),
        workbookSha256: createHash('sha256')
          .update(await readFile(output))
          .digest('hex'),
      },
      null,
      2,
    ),
  );
} finally {
  await rm(stage, { recursive: true, force: true }); // Only this script's own temporary directory.
}
