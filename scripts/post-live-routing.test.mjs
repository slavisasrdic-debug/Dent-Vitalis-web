import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import decisions from '../data/seo/post-live-redirect-decisions-20261004.json' with { type: 'json' };
import { postLiveHtaccess } from './post-live-routing.mjs';
const before = await readFile(
  'docs/seo/handoff-galleria-v8-20261004/.htaccess',
  'utf8',
);
const documents = JSON.parse(await readFile('dist/page-routes.json', 'utf8'));

test('all 115 approved redirects have existing final targets and preserve v9', () => {
  assert.equal(decisions.redirects.length, 115);
  const after = postLiveHtaccess(before, documents);
  const block =
    /# POST-LIVE APPROVED REDIRECTS\n[\s\S]*?# END POST-LIVE APPROVED REDIRECTS\n\n/.exec(
      after,
    )?.[0];
  assert.ok(block);
  assert.equal(after.replace(block, ''), before);
  assert.equal((block.match(/\[R=301,L,NE\]/g) ?? []).length, 115);
  assert.ok(!block.includes('R=302') && !block.includes('QSD'));
  for (const row of decisions.redirects)
    assert.ok(
      block.includes(`https://www.dentvitalis.com${row.to} [R=301,L,NE]`),
    );
  assert.ok(after.indexOf(block) < after.indexOf('# 8. NOVI WEB'));
});

test('missing targets or repeated augmentation are rejected', () => {
  assert.throws(() => postLiveHtaccess(before, {}));
  assert.throws(() =>
    postLiveHtaccess(postLiveHtaccess(before, documents), documents),
  );
});
