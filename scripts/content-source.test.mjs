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

test('route proposal covers accepted pages but does not approve missing legal translations', () => {
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
      'missing-approved-hr-source',
    );
  assert.equal(
    routes.filter((route) => route.status === 'pending-url-approval').length,
    24,
  );
});
