import { chromium } from '@playwright/test';
import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';

// One HTTP request per source; immutable snapshot hashes gate every comparison.
// No navigation clicks, third-party media, form submissions or source rewrites.
const accepted = 'reference/webflow-handoff/2026-09-07/extracted';
const output = process.env.COPY_AUDIT_OUTPUT || '.astro/audits/italian-copy';
const origin = process.env.QA_ORIGIN || 'http://127.0.0.1:4321';
const cached = process.argv.includes('--cached')
  ? JSON.parse(await readFile(`${output}/report.json`, 'utf8'))
  : undefined;
// Reviewed 2026-09-08: language abbreviations and JS-replaced Webflow form
// labels; the live rendered form was separately inspected, without submission.
const reviewed = {
  missing: new Set([
    'Italiano',
    'Hrvatski',
    'Deutsch',
    'English',
    'Slovenščina',
    'Allega un documento',
    "Accetto l'informativa sulla privacy.",
  ]),
  added: new Set([
    'Vai al contenuto',
    'HR',
    'DE',
    'EN',
    'SI',
    'Prenota la prima visita gratuita a Rijeka (Fiume), Croazia!',
    'Nome',
    'E-mail',
    'Telefono',
    'Messaggio',
    'Seleziona il file',
    "Ho letto l'informativa sulla privacy.",
  ]),
};
const { pages } = JSON.parse(await readFile(`${accepted}/pages.json`, 'utf8'));
const hash = (value) => createHash('sha256').update(value).digest('hex');
const normalize = (value) => value.normalize('NFC').replace(/\s+/gu, '');
await mkdir(output, { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage({ javaScriptEnabled: false });
const report = {
  checkedAt: new Date().toISOString(),
  referenceCheckedAt:
    cached?.referenceCheckedAt || cached?.checkedAt || new Date().toISOString(),
  referenceMode: cached ? 'cached; not a new network verification' : 'fresh',
  origin,
  pages: [],
};
try {
  for (const { metadata } of pages) {
    const path = metadata.publishedPath;
    let html;
    if (cached) html = await readFile(`${output}/${metadata.id}.html`, 'utf8');
    else {
      const response = await fetch(`https://dentvitalis33.webflow.io${path}`, {
        signal: AbortSignal.timeout(30000),
      });
      if (!response.ok)
        throw new Error(`${path}: reference HTTP ${response.status}`);
      html = await response.text();
      await writeFile(`${output}/${metadata.id}.html`, html);
    }
    const snapshot = await readFile(
      `${accepted}/raw/published/html/${metadata.id}.html`,
    );
    const row = {
      path,
      sourceSha256: hash(html),
      acceptedSha256: hash(snapshot),
    };
    row.sourceIdentical = row.sourceSha256 === row.acceptedSha256;
    if (!row.sourceIdentical) {
      report.pages.push(row);
      continue; // Never silently mix the newly published version with accepted copy.
    }
    const local = await fetch(`${origin}${path}`);
    if (!local.ok) throw new Error(`${path}: Astro HTTP ${local.status}`);
    const localHtml = await local.text();
    const extract = async (markup) =>
      page.evaluate((markup) => {
        const document = new DOMParser().parseFromString(markup, 'text/html');
        document
          .querySelectorAll(
            'script,style,noscript,svg,iframe,.skriveni,.w-form-done,.w-form-fail,dialog,[data-chat-panel]',
          )
          .forEach((node) => node.remove());
        // Patient copy, including FAQ answers and responsive variants, not only
        // the initial viewport. Dynamic statuses/attributes are checked in e2e.
        const selectors =
          'h1,h2,h3,h4,h5,h6,p,li,a,button,label,.podnaslov-detaljna,.prednost,.text-block-11,.text-block-16,.large-paragraph,.nadnaslov-kartica,.cijena-velika,.medjunaslov-h3,.accordion-title,.accordion-text';
        const units = [...document.querySelectorAll(selectors)]
          .map((node) => node.textContent.replace(/\s+/gu, ' ').trim())
          .filter((value) => /[\p{L}\p{N}]/u.test(value));
        return {
          title: document.title,
          description:
            document.querySelector('meta[name="description"]')?.content || '',
          h1: document.querySelector('h1')?.textContent.trim(),
          text: document.body.textContent,
          units: [...new Set(units)],
        };
      }, markup);
    const reference = await extract(html);
    const astro = await extract(localHtml);
    const missing = reference.units.filter(
      (unit) => !normalize(astro.text).includes(normalize(unit)),
    );
    const added = astro.units.filter(
      (unit) => !normalize(reference.text).includes(normalize(unit)),
    );
    Object.assign(row, {
      titleMatches: reference.title === astro.title,
      descriptionMatches: reference.description === astro.description,
      h1Matches: normalize(reference.h1 || '') === normalize(astro.h1 || ''),
      referenceUnits: reference.units.length,
      missing: missing.filter(
        (unit) =>
          !missing.some(
            (other) =>
              other !== unit && normalize(other).includes(normalize(unit)),
          ),
      ),
      added: added.filter(
        (unit) =>
          !added.some(
            (other) =>
              other !== unit && normalize(other).includes(normalize(unit)),
          ),
      ),
    });
    report.pages.push(row);
  }
  const home = report.pages.find((row) => row.path === '/');
  const homeMetadata = pages.find(
    ({ metadata }) => metadata.publishedPath === '/',
  ).metadata;
  const homeHtml = await readFile(`${output}/${homeMetadata.id}.html`, 'utf8');
  const cssUrl = homeHtml.match(
    /href="([^"]+dentvitalis33\.shared\.[^"]+\.css)"/,
  )?.[1];
  if (!cssUrl) throw new Error('Published stylesheet missing');
  const oldCss = await readFile(
    `${accepted}/raw/published/resources/2ae2f8951fc8-dentvitalis33.shared.f8a4284a1.css`,
  );
  let cssHash = cached?.stylesheet.sourceSha256;
  if (!cached) {
    const cssResponse = await fetch(cssUrl);
    if (!cssResponse.ok)
      throw new Error(`Stylesheet HTTP ${cssResponse.status}`);
    cssHash = hash(await cssResponse.text());
  }
  report.stylesheet = {
    url: cssUrl,
    sourceSha256: cssHash,
    acceptedSha256: hash(oldCss),
    identical: cssHash === hash(oldCss),
  };
  const unreviewed = report.pages.flatMap((row) =>
    ['missing', 'added'].flatMap((kind) =>
      (row[kind] || [])
        .filter((text) => !reviewed[kind].has(text))
        .map((text) => ({ path: row.path, kind, text })),
    ),
  );
  report.unreviewed = unreviewed;
  await writeFile(
    `${output}/report.json`,
    JSON.stringify(report, null, 2) + '\n',
  );
  console.log(
    JSON.stringify(
      {
        report: `${output}/report.json`,
        pages: report.pages.length,
        unchanged: report.pages.filter((row) => row.sourceIdentical).length,
        stylesheetUnchanged: report.stylesheet.identical,
        metadataDifferences: report.pages
          .filter(
            (row) =>
              row.sourceIdentical &&
              (!row.titleMatches || !row.descriptionMatches || !row.h1Matches),
          )
          .map((row) => row.path),
        referenceMode: report.referenceMode,
        distinctReviewedMarkupDifferences: [
          ...new Set(
            report.pages.flatMap((row) => [
              ...(row.missing || []),
              ...(row.added || []),
            ]),
          ),
        ].length,
        unreviewed,
      },
      null,
      2,
    ),
  );
  if (
    !home?.sourceIdentical ||
    report.pages.some((row) => !row.sourceIdentical) ||
    !report.stylesheet.identical ||
    report.pages.some(
      (row) => !row.titleMatches || !row.descriptionMatches || !row.h1Matches,
    ) ||
    unreviewed.length
  )
    process.exitCode = 1;
} finally {
  await browser.close();
}
