import {
  copyFile,
  mkdir,
  readdir,
  readFile,
  rmdir,
  unlink,
  writeFile,
} from 'node:fs/promises';
import { constants } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { pageDocument } from '../src/content/page-paths.ts';
import { publicationSettings } from '../src/content/seo-urls.ts';
import {
  sitemapEntries,
  sitemapFromRenderedPages,
} from './sitemap-hreflang.mjs';

// All pages share the same policy; assets and legacy PHP endpoints are untouched.
const dist = process.argv[2]
  ? resolve(process.argv[2])
  : resolve(import.meta.dirname, '../dist');
async function indexes(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await indexes(path)));
    else if (entry.name === 'index.html' && directory !== dist)
      files.push(path);
  }
  return files;
}
const sources = (await indexes(dist)).sort();
const routes = {};
const folders = new Set();
const lines = [
  '# Owner-approved slashless public pages; preserve query parameters.',
];
for (const source of sources) {
  const route = '/' + relative(dist, dirname(source)).split('\\').join('/');
  const document = pageDocument(route);
  const target = join(dist, document);
  await mkdir(dirname(target), { recursive: true });
  await copyFile(source, target, constants.COPYFILE_EXCL);
  await unlink(source);
  for (let folder = dirname(source); folder !== dist; folder = dirname(folder))
    folders.add(folder);
  routes[route] = document;
  // Pages canonicalizes .html requests, even during an internal proxy rewrite.
  // Proxy to its extensionless lookup; Apache still uses the physical document.
  lines.push(
    `${route} ${document.replace(/\.html$/, '')} 200`,
    `${route}/ ${route} 308`,
  );
}
// Remove only empty generated page directories, deepest first; never asset trees.
for (const folder of [...folders].sort((a, b) => b.length - a.length)) {
  try {
    await rmdir(folder);
  } catch (error) {
    if (error.code !== 'ENOTEMPTY') throw error;
    throw new Error(`Public page directory contains other files: ${folder}`, {
      cause: error,
    });
  }
}
await writeFile(join(dist, '_redirects'), lines.join('\n') + '\n', {
  flag: 'wx',
});
await writeFile(
  join(dist, 'page-routes.json'),
  JSON.stringify(routes, null, 2) + '\n',
  { flag: 'wx' },
);
// Use the same actual translated pairs as the rendered HTML, not prefix guesses.
const sitemapSource = await readFile(join(dist, 'sitemap-0.xml'), 'utf8');
const { xml } = await sitemapFromRenderedPages(
  dist,
  sitemapEntries(sitemapSource).map((entry) => entry.url),
  routes,
  { allowPreviewNoindex: !publicationSettings(process.env).indexable },
);
await writeFile(join(dist, 'sitemap-0.xml'), xml);
console.log(
  `Prepared ${sources.length} slashless public page rewrites (including confirmation paths).`,
);
