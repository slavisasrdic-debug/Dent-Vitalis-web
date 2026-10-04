import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { execFile } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { promisify } from 'node:util';
import test from 'node:test';
import { mergeLegacyHtaccess } from './cpanel-routing.mjs';

const folder = 'docs/seo/handoff-simple-20261004/';
const hash = (bytes) => createHash('sha256').update(bytes).digest('hex');

test('handoff XML, exact htaccess bytes and complete comparison are consistent without a production change', async () => {
  const report = JSON.parse(await readFile(folder + 'report.json', 'utf8'));
  const old = await readFile(folder + 'sitemap-stari.xml');
  const current = await readFile(folder + 'sitemap-novi.xml');
  const rules = await readFile(folder + '.htaccess');
  assert.equal(hash(old), report.oldSitemap.sha256);
  assert.equal(hash(current), report.newSitemap.sha256);
  assert.equal(hash(rules), report.htaccess.sha256);
  assert.deepEqual(await readFile(folder + 'htaccess-novi.txt'), rules);
  const documents = JSON.parse(await readFile('dist/page-routes.json', 'utf8'));
  const generatedHeader = rules.indexOf('# END DentVitalis canonical host\n');
  const legacy = rules.subarray(
    generatedHeader + Buffer.byteLength('# END DentVitalis canonical host\n'),
  );
  assert.deepEqual(
    mergeLegacyHtaccess(legacy, documents, {
      requireApprovedTargets: true,
      compactStaticRouting: true,
    }),
    rules,
  );
  const productionXml = await readFile('dist/sitemap-0.xml', 'utf8');
  const urls = (xml) =>
    [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
  assert.deepEqual(
    new Set(urls(current.toString())),
    new Set(urls(productionXml)),
  );
  assert.equal(urls(current.toString()).length, 136);
  assert.equal(report.comparison.length, report.oldSitemap.urls);
  assert.equal(
    Object.values(report.comparisonCounts).reduce((a, b) => a + b, 0),
    report.oldSitemap.urls,
  );
  assert.equal(report.serverStageAndNextRootChanged, false);
  assert.equal(report.realBackendPostPerformed, false);
  assert.equal(report.htaccess.productionRuntimeVerified, false);
  for (const row of report.comparison.filter((row) =>
    row.status.startsWith('content-decision'),
  ))
    assert.equal(row.target, '', 'Unapproved destination must not be invented');
  const { stdout } = await promisify(execFile)('python3', [
    '-c',
    'import xml.etree.ElementTree as E,sys; ns={"s":"http://www.sitemaps.org/schemas/sitemap/0.9"}; print(*[len(E.parse(p).getroot().findall("s:url",ns)) for p in sys.argv[1:]])',
    folder + 'sitemap-stari.xml',
    folder + 'sitemap-novi.xml',
  ]);
  assert.equal(stdout.trim(), `${report.oldSitemap.urls} 136`);
});
