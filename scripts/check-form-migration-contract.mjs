import { access, readFile, readdir } from 'node:fs/promises';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  formSuccessRoute,
  thankYouRoutes,
  thankYouDocuments,
} from '../src/content/thank-you-routes.ts';

const dist = new URL('../dist/', import.meta.url);
const distPath = fileURLToPath(dist);
const requiredNames = [
  'name',
  'email',
  'phone',
  'message',
  'file',
  'form_agreement',
  'url',
  'pos',
  'action',
  'lang',
  'csrf',
  'gct',
];
const expectedLanguageByRoot = new Map([
  ['index.html', { lang: 'it' }],
  ['_pages/hr.html', { lang: 'hr' }],
  ['_pages/de.html', { lang: 'de' }],
  ['_pages/en.html', { lang: 'en' }],
  ['_pages/si.html', { lang: 'sl' }],
]);

async function htmlFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map(async (entry) => {
      const path = join(directory, entry.name);
      if (entry.isDirectory()) return htmlFiles(path);
      return entry.isFile() && entry.name.endsWith('.html') ? [path] : [];
    }),
  );
  return nested.flat();
}

function attribute(markup, name) {
  const match = markup.match(
    new RegExp(`\\s${name}=(?:"([^"]*)"|'([^']*)'|([^\\s>]+))`, 'i'),
  );
  return match?.[1] ?? match?.[2] ?? match?.[3] ?? null;
}

function contactForms(html) {
  return [...html.matchAll(/<form\b([\s\S]*?)<\/form>/gi)]
    .map((match) => match[0])
    .filter((form) => /\bdata-contact-form\b/.test(form));
}

const failures = [];
const files = await htmlFiles(distPath);
let formCount = 0;

for (const file of files) {
  const html = await readFile(file, 'utf8');
  const forms = contactForms(html);
  const outputPath = relative(distPath, file);

  for (const form of forms) {
    formCount += 1;
    const names = new Set(
      [
        ...form.matchAll(
          /<(?:input|textarea)\b[^>]*\bname=["']([^"']+)["'][^>]*>/gi,
        ),
      ].map((match) => match[1]),
    );
    const missing = requiredNames.filter((name) => !names.has(name));
    if (missing.length)
      failures.push(`${outputPath}: missing ${missing.join(', ')}`);
    if (attribute(form, 'method') !== 'dialog')
      failures.push(`${outputPath}: preview form method must remain dialog`);
    if (attribute(form, 'action') !== null)
      failures.push(`${outputPath}: preview form must not declare an action`);
    const submit = form.match(/<button\b[^>]*\bdata-submit\b[^>]*>/i)?.[0];
    if (!submit || attribute(submit, 'type') !== 'button')
      failures.push(`${outputPath}: preview submit must remain a button`);
    const langField = form.match(
      /<input\b[^>]*\bname=["']lang["'][^>]*\bvalue=["']([^"']+)["']/i,
    )?.[1];
    if (!langField || !['it', 'hr', 'de', 'en', 'sl'].includes(langField))
      failures.push(`${outputPath}: unknown form language`);
    else if (attribute(form, 'data-success') !== formSuccessRoute(langField))
      failures.push(
        `${outputPath}: success path differs from the existing public ${langField} route`,
      );
  }
}

for (const [outputPath, expected] of expectedLanguageByRoot) {
  const html = await readFile(new URL(outputPath, dist), 'utf8');
  const form = contactForms(html)[0];
  if (!form) {
    failures.push(`${outputPath}: no contact form`);
    continue;
  }
  const langField = form.match(
    /<input\b[^>]*\bname=["']lang["'][^>]*\bvalue=["']([^"']+)["'][^>]*>/i,
  );
  if (langField?.[1] !== expected.lang)
    failures.push(
      `${outputPath}: expected lang=${expected.lang}, found ${langField?.[1] ?? 'none'}`,
    );
  if (attribute(form, 'data-success') !== formSuccessRoute(expected.lang))
    failures.push(
      `${outputPath}: expected data-success=${formSuccessRoute(expected.lang)}, found ${attribute(form, 'data-success') ?? 'none'}`,
    );
}

for (const route of Object.values(thankYouRoutes)) {
  try {
    await access(new URL(`.${thankYouDocuments[route]}`, dist));
    const html = await readFile(
      new URL(`.${thankYouDocuments[route]}`, dist),
      'utf8',
    );
    if (!/<meta\b[^>]*name="robots"[^>]*content="noindex,/.test(html))
      failures.push(
        `${route}: thank-you page must remain noindex in all modes`,
      );
    if (
      !html.includes(
        `rel="canonical" href="https://www.dentvitalis.com${route}"`,
      )
    )
      failures.push(
        `${route}: canonical must preserve the exact public success path`,
      );
  } catch {
    failures.push(`${route}: missing thank-you HTML in release`);
  }
}

if (!formCount) failures.push('No contact forms found in dist');
if (failures.length) {
  console.error(`Form migration preflight failed:\n- ${failures.join('\n- ')}`);
  process.exit(1);
}

console.log(
  `Form migration preflight passed: ${formCount} protected forms, ${Object.keys(thankYouRoutes).length} exact thank-you routes, ${files.length} HTML files.`,
);
