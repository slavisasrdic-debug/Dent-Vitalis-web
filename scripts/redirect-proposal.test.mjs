import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import test from 'node:test';
import {
  loadProposal,
  buildRows,
  serializeRows,
  origin,
} from './redirect-proposal.mjs';

const inputs = await loadProposal();
const rows = buildRows(inputs);

test('every inventoried URL has exactly one proposal; CSV is reproducible', async () => {
  assert.equal(rows.length, inputs.inventory.pages.length);
  assert.equal(rows.length, 206);
  assert.equal(new Set(rows.map((row) => row.old_url)).size, rows.length);
  assert.equal(
    await readFile('data/redirects.csv', 'utf8'),
    serializeRows(rows),
  );
  assert.ok(rows.every((row) => row.test_status.startsWith('proposal-only:')));
  assert.ok(!rows.some((row) => row.http_status === '410'));
});

test('explicit 301 proposals have no chains, loops, cross-language or missing targets', () => {
  assert.equal(rows.filter((row) => row.http_status === '301').length, 24);
  assert.equal(rows.filter((row) => row.http_status === '200').length, 2);
  const redirects = new Map(
    rows
      .filter((row) => row.http_status === '301')
      .map((row) => [row.old_url, row.target_url]),
  );
  for (const [source, target] of redirects) {
    assert.notEqual(source, target);
    assert.ok(!redirects.has(target));
  }
  for (const row of rows.filter((row) => row.http_status === '200'))
    assert.equal(row.old_url, row.target_url);
});

test('unavailable languages/sources and ambiguous content cannot acquire automatic redirects', () => {
  for (const row of rows.filter(
    (row) =>
      ['de', 'en', 'si'].includes(row.language) ||
      row.sourceStatus !== 200 ||
      row.candidates.length,
  )) {
    assert.equal(row.http_status, '');
    assert.equal(row.target_url, '');
  }
  const allOnFour = rows.filter((row) => row.category === 'all-on-four');
  assert.equal(allOnFour.length, 2);
  assert.ok(
    allOnFour.every((row) =>
      row.candidates.every(
        (path) =>
          !path.includes('protesi-definitiva') &&
          !path.includes('proteza-na-4'),
      ),
    ),
  );
  assert.equal(
    rows.filter((row) => row.category === 'language-not-implemented').length,
    105,
  );
  assert.equal(
    rows.filter((row) => row.category === 'source-unavailable').length,
    25,
  );
});

test('known old aliases converge directly; root language and review canonical cannot loop', () => {
  const target = (path) =>
    rows.find((row) => row.old_url === origin + path).target_url;
  assert.equal(target('/hr'), origin + '/hr/');
  assert.equal(target('/hr/'), origin + '/hr/');
  assert.equal(target('/hr/testimonials'), origin + '/hr/iskustva-pacijenata/');
  assert.equal(
    target('/hr/iskustva-pacijenata'),
    origin + '/hr/iskustva-pacijenata/',
  );
  assert.equal(target('/accommodation'), target('/alloggio'));
});

test('audit evidence matches proposal/source versions and covers all targets and candidates', async () => {
  const evidence = JSON.parse(
    await readFile('data/seo/redirect-target-evidence.json', 'utf8'),
  );
  const hash = (value) => createHash('sha256').update(value).digest('hex');
  assert.equal(evidence.status, 'proposal-only');
  assert.equal(
    evidence.inventorySha256,
    hash(await readFile('data/seo/url-inventory.json')),
  );
  assert.equal(
    evidence.groupsSha256,
    hash(await readFile('data/seo/redirect-groups.json')),
  );
  assert.equal(evidence.allSourceHashesVerified, 206);
  const checked = new Set(evidence.targets.map((target) => target.path));
  for (const row of rows)
    for (const path of [
      ...row.candidates,
      ...(row.target_url ? [new URL(row.target_url).pathname] : []),
    ])
      assert.ok(checked.has(path));
  assert.ok(
    evidence.targets.every(
      (target) => target.status === 200 && /noindex/.test(target.robots),
    ),
  );
});

test('invalid proposal fails closed rather than assigning guessed destinations', () => {
  const invalid = structuredClone(inputs);
  invalid.proposal.groups[0].paths.push('/nonexistent-source');
  assert.throws(() => buildRows(invalid), /Group paths/);
  const wrong = structuredClone(inputs);
  wrong.proposal.groups.find((group) => group.id === 'it-first-visit').target =
    '/hr/prvi-pregled/';
  assert.throws(() => buildRows(wrong), /Language mismatch/);
  const external = structuredClone(inputs);
  external.proposal.groups.find(
    (group) => group.id === 'it-first-visit',
  ).target = 'https://example.com/informazioni/prima-visita-gratuita/';
  assert.throws(() => buildRows(external), /External redirect target/);
});
