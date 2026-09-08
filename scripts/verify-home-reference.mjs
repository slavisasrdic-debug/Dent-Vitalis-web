import { createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';

const handoff = 'reference/webflow-handoff/2026-09-07/extracted';
const sha = (bytes) => createHash('sha256').update(bytes).digest('hex');
const html = Buffer.from(
  await (await fetch('https://dentvitalis33.webflow.io/')).arrayBuffer(),
);
const original = await readFile(
  `${handoff}/raw/published/html/695e1eeeb10c5fb8eeaba87c.html`,
);
const cssUrl = html
  .toString()
  .match(/href="([^"]+dentvitalis33\.shared\.[^"]+\.css)"/)?.[1];
if (!cssUrl) throw new Error('Published stylesheet changed or missing');
const css = Buffer.from(await (await fetch(cssUrl)).arrayBuffer());
const oldCss = await readFile(
  `${handoff}/raw/published/resources/2ae2f8951fc8-dentvitalis33.shared.f8a4284a1.css`,
);
const result = {
  checkedAt: new Date().toISOString(),
  url: 'https://dentvitalis33.webflow.io/',
  html: {
    accepted: sha(original),
    current: sha(html),
    identical: sha(original) === sha(html),
  },
  css: {
    url: cssUrl,
    accepted: sha(oldCss),
    current: sha(css),
    identical: sha(oldCss) === sha(css),
  },
};
await writeFile(
  'reference/webflow-handoff/2026-09-07/home-reference-identity.json',
  JSON.stringify(result, null, 2) + '\n',
);
console.log(result);
if (!result.html.identical || !result.css.identical)
  throw new Error('Reference drift: review before changing the baseline');
