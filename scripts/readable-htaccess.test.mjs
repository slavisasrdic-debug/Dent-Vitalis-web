import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { readableHtaccess } from './readable-htaccess.mjs';

const source = await readFile('docs/seo/handoff-simple-20261004/.htaccess');
const candidate = await readFile(
  'docs/seo/handoff-readable-20261004/.htaccess',
  'utf8',
);
const report = JSON.parse(
  await readFile('data/seo/htaccess-attachment-review-20261004.json', 'utf8'),
);

test('complete readable file is reproducible; only identical legacy duplicates removed', async () => {
  assert.equal(readableHtaccess(source), candidate);
  assert.equal(
    await readFile(
      'docs/seo/handoff-readable-20261004/htaccess-novi.txt',
      'utf8',
    ),
    candidate,
  );
  assert.equal(
    createHash('sha256').update(candidate).digest('hex'),
    report.outputSha256,
  );
  const aliases = (text) =>
    [...text.matchAll(/^Redirect\s+301\s+(\S+)\s+(\S+)\s*$/gm)].map((m) => [
      m[1],
      m[2].replace('https://www.dentvitalis.com', ''),
    ]);
  assert.deepEqual(
    new Map(aliases(candidate)),
    new Map(aliases(source.toString())),
  );
  assert.equal(aliases(candidate).length, 57);
  const content = (text) =>
    [...text.matchAll(/^RewriteRule (\S+) (\S+) \[R=301,L,NE\]$/gm)].map(
      (m) => [m[1], m[2].replace('https://www.dentvitalis.com', '')],
    );
  assert.deepEqual(content(candidate), content(source.toString()));
  assert.equal(content(candidate).length, 16);
});

test('mandatory routing, no-cache, 410 and PHP handler survive; no new semantic mappings', () => {
  for (const line of source
    .toString()
    .split('\n')
    .filter(
      (line) =>
        line.startsWith('Rewrite') ||
        line.startsWith('Directory') ||
        line.includes('Header always') ||
        line.includes('AddHandler'),
    )) {
    if (
      line.includes('R=302') ||
      line.includes('http://www.') ||
      line.includes('%{HTTP_HOST}/$1') ||
      line === 'RewriteCond %{HTTPS} off' ||
      line === 'RewriteCond %{HTTP_HOST} !^www\\.'
    )
      continue;
    const normalized = line.replace(
      /(RewriteRule \S+ )https:\/\/www\.dentvitalis\.com(?=\/)/,
      '$1',
    );
    assert.ok(
      candidate
        .replace(
          /(RewriteRule \S+ )https:\/\/www\.dentvitalis\.com(?=\/)/g,
          '$1',
        )
        .includes(normalized),
      line,
    );
  }
  assert.ok(!candidate.includes('R=302'));
  assert.ok(
    candidate.includes(
      'Redirect 301 /vr_tour_eng.htm https://www.dentvitalis.com/en',
    ),
  );
  for (const from of [
    '/hr/desinfekcija',
    '/hr/klinicko-produzenje-krune-prirodnog-zuba',
    '/hr/keramicki-most-na-svim-implantatima',
  ]) {
    assert.ok(!candidate.includes(`RewriteRule ^${from.slice(1)}/?$`));
    assert.ok(!candidate.includes(`Redirect 301 ${from} `));
  }
  assert.equal(report.retargetedExistingMappings.length, 34);
  assert.equal(report.newMappingsRequiringContentApproval.length, 114);
  assert.equal(report.preservedPhpPagesInterceptedByAttachment.length, 3);
  assert.equal(report.nativeSourceCollisions.length, 0);
  assert.equal(report.missingStaticTargets.length, 0);
  assert.equal(report.productionChanged, false);
});
