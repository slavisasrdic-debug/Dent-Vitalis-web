import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
import { chromium } from '@playwright/test';
import { format, resolveConfig } from 'prettier';
import {
  buildRows,
  loadProposal,
  origin,
  languageOf,
} from './redirect-proposal.mjs';

// Read-only verification: public source bytes are reused, only LOCAL targets fetched.
// DOMParser runs in an isolated blank page, never navigates or submits a form.
const inputs = await loadProposal();
const rows = buildRows(inputs);
const hash = (value) => createHash('sha256').update(value).digest('hex');
const targetPaths = [
  ...new Set(
    rows.flatMap((row) => [
      ...(row.target_url ? [new URL(row.target_url).pathname] : []),
      ...row.candidates,
    ]),
  ),
].sort();
const browser = await chromium.launch();
const page = await browser.newPage({ javaScriptEnabled: false });
await page.route('**/*', (route) => route.abort());
const sources = [],
  targets = [];
try {
  for (const source of inputs.inventory.pages) {
    const cached = JSON.parse(
      await readFile(
        `.astro/audits/url-inventory-2026-09-09/${hash(source.url)}.json`,
        'utf8',
      ),
    );
    assert.equal(
      hash(cached.html),
      source.sha256,
      `Changed cached source: ${source.url}`,
    );
    // The other languages remain unimplemented, not semantically matched.
    if (!['it', 'hr'].includes(source.language) || source.status !== 200)
      continue;
    const evidence = await page.evaluate((html) => {
      const doc = new DOMParser().parseFromString(html, 'text/html');
      doc
        .querySelectorAll('script,style,noscript')
        .forEach((node) => node.remove());
      const heading = doc.querySelector('h1,h2');
      const body = doc.querySelector('.dent_mdl') ?? heading?.parentElement;
      const text = body?.textContent.replace(/\s+/g, ' ').trim() ?? '';
      return {
        heading: heading?.textContent.trim(),
        excerpt: text.slice(0, 500),
      };
    }, cached.html);
    assert.ok(
      evidence.heading && evidence.excerpt,
      `Missing source evidence: ${source.url}`,
    );
    sources.push({
      url: source.url,
      finalUrl: source.finalUrl,
      checkedAt: source.checkedAt,
      sha256: source.sha256,
      ...evidence,
    });
  }
  for (let offset = 0; offset < targetPaths.length; offset += 2) {
    const responses = await Promise.all(
      targetPaths.slice(offset, offset + 2).map(async (path) => {
        const response = await fetch('http://127.0.0.1:4321' + path, {
          redirect: 'manual',
          signal: AbortSignal.timeout(15000),
        });
        assert.equal(
          response.status,
          200,
          `Target HTTP ${response.status}: ${path}`,
        );
        return { path, html: await response.text(), status: response.status };
      }),
    );
    for (const response of responses) {
      const evidence = await page.evaluate((html) => {
        const doc = new DOMParser().parseFromString(html, 'text/html');
        const h1 = [...doc.querySelectorAll('main h1')];
        const body =
          doc.querySelector('.editorial-copy') ?? doc.querySelector('main');
        return {
          title: doc.title,
          lang: doc.documentElement.lang,
          h1Count: h1.length,
          h1: h1[0]?.textContent.trim(),
          canonical: doc
            .querySelector('link[rel="canonical"]')
            ?.getAttribute('href'),
          robots: doc
            .querySelector('meta[name="robots"]')
            ?.getAttribute('content'),
          excerpt: body?.textContent.replace(/\s+/g, ' ').trim().slice(0, 500),
        };
      }, response.html);
      assert.equal(evidence.h1Count, 1);
      assert.ok(evidence.title && evidence.h1 && evidence.excerpt);
      assert.equal(evidence.lang, languageOf(response.path));
      assert.equal(evidence.canonical, origin + response.path);
      assert.match(evidence.robots, /noindex/);
      targets.push({
        path: response.path,
        status: response.status,
        sha256: hash(response.html),
        ...evidence,
      });
    }
  }
  const output = 'data/seo/redirect-target-evidence.json';
  const report = {
    status: 'proposal-only',
    checkedAt: new Date().toISOString(),
    sourceMode:
      'Hash-verified cached public responses from 2026-09-09; NOT a fresh source HTTP check.',
    targetMode:
      'Local SSR target checks, not deployed redirects or production headers.',
    limits:
      'Excerpts support manual topic review, not automatic medical equivalence. Search Console/backlinks/logs and query preservation on the future host are unverified.',
    inventorySha256: hash(await readFile('data/seo/url-inventory.json')),
    groupsSha256: hash(await readFile('data/seo/redirect-groups.json')),
    allSourceHashesVerified: inputs.inventory.pages.length,
    sources,
    targets,
  };
  await writeFile(
    output,
    await format(JSON.stringify(report), {
      ...(await resolveConfig(output)),
      filepath: output,
    }),
  );
  console.log(
    JSON.stringify({
      output,
      sourceHashesVerified: report.allSourceHashesVerified,
      sourceExcerpts: sources.length,
      localTargets: targets.length,
      targetChecks: 'HTTP 200, language, canonical, H1, title, noindex',
      redirectsActivated: 0,
    }),
  );
} finally {
  await browser.close();
}
