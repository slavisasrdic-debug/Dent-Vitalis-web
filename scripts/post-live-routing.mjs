import assert from 'node:assert/strict';
import decisions from '../data/seo/post-live-redirect-decisions-20261004.json' with { type: 'json' };

/** Extend the accepted readable v8/v9, without rewriting its legacy aliases. */
export function postLiveHtaccess(input, documents) {
  assert.equal(decisions.status, 'owner-approved-for-candidate');
  let source = input.toString();
  assert.ok(!source.includes('# POST-LIVE APPROVED REDIRECTS'));
  const from = new Set(decisions.redirects.map((row) => row.from));
  assert.equal(from.size, decisions.redirects.length);
  for (const row of decisions.redirects) {
    assert.equal(row.status, 301);
    assert.match(row.from, /^\/[a-z0-9/-]+$/);
    assert.match(row.to, /^\/[a-z0-9/-]+$/);
    assert.ok(!row.from.endsWith('/') && !row.to.endsWith('/'));
    assert.ok(!Object.hasOwn(documents, row.from), row.from);
    assert.ok(Object.hasOwn(documents, row.to), row.to);
    assert.ok(!from.has(row.to), 'No new redirect chains: ' + row.to);
  }
  const block =
    '# POST-LIVE APPROVED REDIRECTS\n' +
    '# Owner approved 84 topic consolidations and 17 treatment-page replacements.\n' +
    '# Same language; one 301 to the final URL; original query is retained.\n' +
    decisions.redirects
      .map(
        ({ from, to }) =>
          `RewriteRule ^${from.slice(1)}/?$ https://www.dentvitalis.com${to} [R=301,L,NE]`,
      )
      .join('\n') +
    '\n# END POST-LIVE APPROVED REDIRECTS\n\n';
  assert.equal(source.split('# 5. DODATNE JASNE ZAMJENE').length, 2);
  source = source.replace(
    '# 5. DODATNE JASNE ZAMJENE',
    block + '# 5. DODATNE JASNE ZAMJENE',
  );
  // The generic old PHP fallback is retained until all preservation/retirement
  // decisions are made; do not silently remove unresolved medical articles.
  return source;
}
