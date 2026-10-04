import { readFile, readdir, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

export const stylesheetLimit = 20 * 1024;

/** Replace each small local CSS link in place, preserving the cascade order. */
export async function inlineSmallStylesheets(html, readStylesheet) {
  const pattern =
    /<link rel="stylesheet" href="(\/_astro\/[A-Za-z0-9._-]+\.css)">/g;
  const edits = [];
  for (const match of html.matchAll(pattern)) {
    const bytes = await readStylesheet(match[1]);
    if (bytes.length > stylesheetLimit) continue;
    const css = bytes.toString();
    if (/<\/style/i.test(css))
      throw new Error('Unsafe style terminator in generated CSS.');
    edits.push({
      start: match.index,
      end: match.index + match[0].length,
      text: `<style data-inline-css="${match[1]}">${css}</style>`,
    });
  }
  // Reverse offsets so each original insertion position stays valid.
  for (const edit of edits.reverse())
    html = html.slice(0, edit.start) + edit.text + html.slice(edit.end);
  return { html, replaced: edits.length };
}

async function prepare(directory) {
  const cache = new Map();
  let pages = 0,
    replaced = 0;
  const visit = async (current) => {
    for (const entry of await readdir(current, { withFileTypes: true })) {
      const path = join(current, entry.name);
      if (entry.isDirectory()) await visit(path);
      else if (entry.isFile() && entry.name.endsWith('.html')) {
        const before = await readFile(path, 'utf8');
        const result = await inlineSmallStylesheets(
          before,
          async (stylesheet) => {
            if (!cache.has(stylesheet))
              cache.set(
                stylesheet,
                await readFile(join(directory, stylesheet)),
              );
            return cache.get(stylesheet);
          },
        );
        if (result.replaced) await writeFile(path, result.html);
        pages++;
        replaced += result.replaced;
      }
    }
  };
  await visit(directory);
  console.log(
    `Small CSS inline: ${replaced} links across ${pages} HTML files; cascade order retained, limit ${stylesheetLimit} bytes.`,
  );
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(resolve(process.argv[1])).href
)
  await prepare(resolve('dist'));
