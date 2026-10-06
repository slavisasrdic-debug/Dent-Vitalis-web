import { readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import sharp from 'sharp';
import {
  brandMarkArtwork,
  brandMarkViewBox,
} from '../src/content/brand-mark.ts';

const source = 'public/assets/images/Dentvitalis-logo-color_21200px.svg';
const original = await readFile(source);
const svg = Buffer.from(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${brandMarkViewBox}" width="512" height="512">${brandMarkArtwork(original.toString())}</svg>\n`,
);
const folder = 'public/assets/images/';
const files = new Map();
files.set('dentvitalis-mark-blue-triangle.svg', svg);
files.set(
  'dentvitalis-chat-logo-blue-triangle-512.png',
  await sharp(svg)
    .resize(512, 512)
    .flatten({ background: '#ffffff' })
    .png()
    .toBuffer(),
);
// PNG-compressed 16/32/48 favicon images in a standard ICO directory.
const sizes = [16, 32, 48];
const images = await Promise.all(
  sizes.map((size) => sharp(svg).resize(size, size).png().toBuffer()),
);
const header = Buffer.alloc(6 + 16 * sizes.length);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(sizes.length, 4);
let offset = header.length;
for (const [index, size] of sizes.entries()) {
  const base = 6 + index * 16;
  header[base] = size;
  header[base + 1] = size;
  header.writeUInt16LE(1, base + 4);
  header.writeUInt16LE(32, base + 6);
  header.writeUInt32LE(images[index].length, base + 8);
  header.writeUInt32LE(offset, base + 12);
  offset += images[index].length;
}
files.set('favicon-blue-triangle.ico', Buffer.concat([header, ...images]));
for (const [name, bytes] of files) await writeFile(folder + name, bytes);
console.log(
  JSON.stringify(
    {
      source,
      sourceSha256: createHash('sha256').update(original).digest('hex'),
      files: [...files].map(([name, bytes]) => ({
        path: folder + name,
        bytes: bytes.length,
        sha256: createHash('sha256').update(bytes).digest('hex'),
      })),
    },
    null,
    2,
  ),
);
