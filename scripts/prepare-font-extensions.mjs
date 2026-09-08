import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';

// The exact Latin Extended sources observed in the rendered Webflow reference.
// Keep its Montserrat v31, original filenames and the accepted Latin TTF faces.
const directory = 'source-assets/fonts/montserrat-v31';
const files = [
  {
    name: 'JTUSjIg1_i6t8kCHKm459Wdhyzbi.woff2',
    style: 'normal',
    weights: '100 900',
  },
  {
    name: 'JTUQjIg1_i6t8kCHKm459WxRxy7mw9c.woff2',
    style: 'italic',
    weights: '100 900',
  },
];
await mkdir(directory, { recursive: true });
await mkdir('public/assets/fonts', { recursive: true });
const manifest = {
  reference: 'https://dentvitalis33.webflow.io/',
  observedOn: '2026-09-07',
  family: 'Montserrat',
  version: 'v31',
  subset: 'latin-ext',
  files: [],
};
for (const file of files) {
  const url = `https://fonts.gstatic.com/s/montserrat/v31/${file.name}`;
  const source = `${directory}/${file.name}`;
  let bytes;
  try {
    bytes = await readFile(source);
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
    const response = await fetch(url);
    if (!response.ok)
      throw new Error(`Font download failed: ${url}`, { cause: error });
    bytes = Buffer.from(await response.arrayBuffer());
    if (bytes.subarray(0, 4).toString() !== 'wOF2')
      throw new Error(`Invalid WOFF2 response: ${url}`, { cause: error });
    await writeFile(source, bytes, { flag: 'wx' });
  }
  const output = `public/assets/fonts/${file.name}`;
  try {
    const existing = await readFile(output);
    if (!existing.equals(bytes))
      throw new Error(`Refusing to overwrite a different font: ${output}`);
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
    await writeFile(output, bytes, { flag: 'wx' });
  }
  manifest.files.push({
    ...file,
    url,
    source,
    output,
    bytes: bytes.length,
    sha256: createHash('sha256').update(bytes).digest('hex'),
  });
}
await writeFile(
  `${directory}/manifest.json`,
  JSON.stringify(manifest, null, 2) + '\n',
);
console.log(manifest);
