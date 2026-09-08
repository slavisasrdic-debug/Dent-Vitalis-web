import sharp from 'sharp';
const root = 'reference/screenshots/2026-09-07-home/comparisons';
for (const [width, label] of [
  [1440, 'desktop'],
  [390, 'mobile'],
]) {
  for (const state of ['top', 'services', 'contact', 'footer']) {
    const files = ['webflow', 'astro'].map(
      (name) => `${root}/${width}-${state}-${name}.png`,
    );
    const heading = Buffer.from(
      `<svg width="${width * 2}" height="32" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="white"/><g font-family="sans-serif" font-size="15" fill="#045a72"><text x="12" y="22">Webflow · ${width}px</text><text x="${width + 12}" y="22">Astro · ${width}px</text></g></svg>`,
    );
    await sharp({
      create: {
        width: width * 2,
        height: 932,
        channels: 3,
        background: '#fff',
      },
    })
      .composite([
        { input: heading, left: 0, top: 0 },
        ...files.map((input, i) => ({ input, left: i * width, top: 32 })),
      ])
      .png()
      .toFile(`${root}/${label}-${state}-pair.png`);
  }
}
console.log(
  'Desktop and mobile side-by-side review pairs created; reference left, Astro right.',
);
