import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';

const catalogue = JSON.parse(
  readFileSync('data/translations/hr-source.json', 'utf8'),
);
const tables = catalogue.blocks.filter((block) => block.type === 'table');
const paragraphs = catalogue.blocks.flatMap((block) =>
  block.type === 'table' ? block.rows.flatMap((row) => row.flat()) : [block],
);
test('approved editorial corrections retain evidence in the original Word source', () => {
  const corrections = JSON.parse(
    readFileSync('data/editorial-corrections.json', 'utf8'),
  );
  assert.equal(corrections.docxSha256, catalogue.sha256);
  const paragraph = (id) => paragraphs.find((p) => p.id === id).text;
  const doctor = corrections.italianDoctor;
  const crown = corrections.croatianCrown;
  assert.ok(paragraph(doctor.sourceId).startsWith(doctor.to));
  assert.ok(!paragraph(doctor.sourceId).includes(doctor.from));
  assert.equal(paragraph(crown.sourceId), crown.from);
  assert.match(paragraph(crown.italianSourceId), /a partire da 220 €/);
  assert.equal(crown.to, 'Zubne krunice već od 220 €');
});

test('DOCX catalogue matches the original source and deterministic extraction', () => {
  assert.equal(
    createHash('sha256').update(readFileSync(catalogue.source)).digest('hex'),
    catalogue.sha256,
  );
  execFileSync('python3', ['scripts/extract-translation-source.py', '--check']);
  assert.equal(tables.length, 31);
  assert.equal(paragraphs.length, 2424);
  assert.equal(
    new Set(paragraphs.map((paragraph) => paragraph.id)).size,
    paragraphs.length,
  );
});

test('run text and yellow editorial evidence are retained, not silently normalized', () => {
  for (const paragraph of paragraphs)
    assert.equal(
      paragraph.text,
      paragraph.runs.map((run) => run.text).join(''),
    );
  assert.equal(
    paragraphs
      .flatMap((paragraph) => paragraph.runs)
      .filter((run) => run.highlight === 'yellow').length,
    315,
  );
  assert.equal(
    paragraphs.find((paragraph) => paragraph.id === 't8.r3.c1.p0').text,
    'Nema prijevoda – ne nudimo drugima prijevoz',
  );
  assert.match(
    paragraphs.find((paragraph) => paragraph.id === 't1.r0.c1.p4').text,
    /36 rata/,
  );
});

test('empty Croatian cells and explicit exclusions never become inferred translations', () => {
  for (const id of ['t18', 't30'])
    assert.ok(
      tables
        .find((table) => table.id === id)
        .rows.every((row) =>
          row[1].every((paragraph) => !paragraph.text.trim()),
        ),
    );
  assert.equal(
    paragraphs.find((paragraph) => paragraph.id === 't23.r0.c1.p0').text,
    'Hrvatski ne',
  );
});

test('approved Croatian routes exclude transport and include approved live legal sources', () => {
  const lines = readFileSync('data/hr-routes.proposed.csv', 'utf8')
    .trim()
    .split('\n');
  const headers = lines.shift().split(',');
  const routes = lines.map((line) =>
    Object.fromEntries(line.split(',').map((value, i) => [headers[i], value])),
  );
  assert.equal(routes.length, 28);
  const paths = routes.map((route) => route.proposed_hr_path).filter(Boolean);
  assert.equal(new Set(paths).size, paths.length);
  assert.ok(
    paths.every((path) => path.startsWith('/hr/') && !path.includes('?')),
  );
  assert.equal(
    routes.find((route) => route.page_id === 'transport').proposed_hr_path,
    '',
  );
  for (const id of ['privacy', 'terms'])
    assert.equal(
      routes.find((route) => route.page_id === id).status,
      'approved',
    );
  assert.equal(
    routes.filter((route) => route.status === 'approved').length,
    27,
  );
});

test('Croatian legal content retains the exact approved public source snapshots', () => {
  const pages = JSON.parse(readFileSync('src/content/hr/legal.json', 'utf8'));
  assert.equal(pages.length, 2);
  for (const page of pages) {
    assert.equal(
      createHash('sha256').update(readFileSync(page.source.file)).digest('hex'),
      page.source.sha256,
    );
    assert.match(
      page.source.url,
      /^https:\/\/www\.dentvitalis\.com\/hr\/(polica-privatnosti|uvjeti-koristenja)$/,
    );
    assert.ok(page.sourceText.length > 1000);
  }
});
