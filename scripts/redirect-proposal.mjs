import assert from 'node:assert/strict';
import { readFile, writeFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';

export const origin = 'https://www.dentvitalis.com';
export const columns = [
  'old_url',
  'language',
  'old_page_title',
  'target_url',
  'http_status',
  'reason',
  'test_status',
];
export const canonicalPath = (path) => path.replace(/\/+$/, '') + '/';
export const languageOf = (path) =>
  path.match(/^\/(hr|de|en|si)(\/|$)/)?.[1] ?? 'it';

export async function loadProposal() {
  const inventory = JSON.parse(
    await readFile('data/seo/url-inventory.json', 'utf8'),
  );
  const proposal = JSON.parse(
    await readFile('data/seo/redirect-groups.json', 'utf8'),
  );
  const italian = JSON.parse(
    await readFile('src/content/inner-pages-it.json', 'utf8'),
  );
  const hr = (await readFile('data/hr-routes.proposed.csv', 'utf8'))
    .trim()
    .split('\n')
    .slice(1)
    .map((row) => row.split(','));
  const targets = new Set([
    '/',
    ...italian.map((page) => canonicalPath(page.route)),
    ...hr
      .filter((row) => row[4] === 'approved')
      .map((row) => canonicalPath(row[2])),
  ]);
  return { inventory, proposal, targets };
}

export function buildRows({ inventory, proposal, targets }) {
  assert.equal(proposal.status, 'proposal-only');
  assert.equal(
    proposal.queryPolicy,
    'preserve-exact; future-host-verification-required',
  );
  const byPath = new Map();
  for (const group of proposal.groups) {
    assert.ok(['keep', 'redirect', 'review'].includes(group.action));
    for (const path of group.paths) {
      assert.ok(!byPath.has(path), `Duplicate group assignment: ${path}`);
      byPath.set(path, group);
    }
  }
  const used = new Set();
  const rows = inventory.pages.map((source) => {
    const old = new URL(source.url);
    assert.equal(old.origin, origin);
    const group = byPath.get(old.pathname);
    let category,
      reason,
      target = '',
      status = '',
      candidates = [];
    if (source.status !== 200) {
      assert.ok(!group, `A mapped source became unavailable: ${old.pathname}`);
      category = 'source-unavailable';
      reason = `Inventar od 9. rujna bilježi HTTP ${source.status ?? 'error'}, ne dokazan trajno uklonjen sadržaj. Provjeriti stari sadržaj, sitemap, promet i backlinkove; zatim odlučiti obnova, stvarni ekvivalent ili uklanjanje. Bez automatskog 301/410.`;
    } else if (['de', 'en', 'si'].includes(source.language)) {
      assert.ok(!group);
      category = 'language-not-implemented';
      reason =
        'Nema odobrene nove stranice na istom jeziku. Prije zamjene starog servera odlučiti o očuvanju postojeće verzije ili izradi prijevoda. Ne preusmjeravati na IT/HR niti automatski ukloniti cijeli jezik.';
    } else {
      assert.ok(group, `Unreviewed IT/HR source: ${old.pathname}`);
      used.add(old.pathname);
      category = group.id;
      reason = group.reason;
      candidates = group.candidates?.[source.language] ?? [];
      if (group.action !== 'review') {
        target = new URL(group.target ?? canonicalPath(old.pathname), origin)
          .href;
        assert.equal(
          new URL(target).origin,
          origin,
          'External redirect target',
        );
        status = target === source.url ? '200' : '301';
        if (group.action === 'redirect') assert.equal(status, '301');
      }
    }
    for (const path of [
      ...candidates,
      ...(target ? [new URL(target).pathname] : []),
    ]) {
      assert.equal(path, canonicalPath(path), `Noncanonical target: ${path}`);
      assert.ok(targets.has(path), `Missing target: ${path}`);
      assert.equal(
        languageOf(path),
        source.language,
        `Language mismatch: ${old.pathname} -> ${path}`,
      );
      assert.ok(!path.includes('?') && !path.includes('#'));
    }
    return {
      old_url: source.url,
      language: source.language,
      old_page_title: source.title ?? '',
      target_url: target,
      http_status: status,
      reason,
      test_status: target
        ? 'proposal-only:target-route-exists:not-deployed'
        : 'proposal-only:owner-decision-required:not-deployed',
      category,
      candidates,
      sourceStatus: source.status,
    };
  });
  assert.equal(new Set(rows.map((row) => row.old_url)).size, rows.length);
  assert.equal(
    used.size,
    byPath.size,
    'Group paths must all exist in the inventory',
  );
  const redirects = new Map(
    rows
      .filter((row) => row.http_status === '301')
      .map((row) => [row.old_url, row.target_url]),
  );
  for (const [from, to] of redirects) {
    assert.notEqual(from, to, 'Self redirect');
    assert.ok(
      !redirects.has(to),
      `Redirect chain/cycle in proposal: ${from} -> ${to}`,
    );
  }
  return rows;
}

export function serializeRows(rows) {
  const escape = (value) => `"${String(value).replaceAll('"', '""')}"`;
  return (
    columns.join(',') +
    '\n' +
    rows
      .map((row) => columns.map((key) => escape(row[key])).join(','))
      .join('\n') +
    '\n'
  );
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  const rows = buildRows(await loadProposal());
  const csv = serializeRows(rows);
  if (process.argv.includes('--check'))
    assert.equal(
      await readFile('data/redirects.csv', 'utf8'),
      csv,
      'Regenerate the proposal CSV',
    );
  else await writeFile('data/redirects.csv', csv);
  const counts = (field) =>
    rows.reduce((result, row) => {
      const key = row[field] || 'unresolved';
      result[key] = (result[key] ?? 0) + 1;
      return result;
    }, {});
  console.log(
    JSON.stringify(
      {
        status: 'proposal-only; no runtime configuration',
        total: rows.length,
        proposedHttpStatus: counts('http_status'),
        categories: counts('category'),
      },
      null,
      2,
    ),
  );
}
