import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
import {
  videoDescription,
  verifiedVideoDateTime,
} from '../src/content/video-schema';
const videoMetadata = JSON.parse(
  readFileSync('data/video-metadata.json', 'utf8'),
) as typeof import('../data/video-metadata.json');

test('video publication times retain sourced timezone, never fabricated midnight', () => {
  expect(videoMetadata.videos).toHaveLength(13);
  for (const video of videoMetadata.videos) {
    expect(verifiedVideoDateTime(video.uploadDate)).toBe(video.uploadDate);
    expect(video.sourceField).toBe(
      'ytInitialPlayerResponse.microformat.playerMicroformatRenderer.publishDate',
    );
    expect(video.sha256).toMatch(/^[a-f0-9]{64}$/);
    expect(video.sourceUploadDate).toBeTruthy();
  }
  for (const invalid of [
    '2026-05-27',
    '2026-05-27T03:42:52',
    'invalid',
    '2026-13-27T03:42:52Z',
    '2026-02-30T03:42:52Z',
    '2026-05-27T24:00:00Z',
  ])
    expect(() => verifiedVideoDateTime(invalid)).toThrow();
  expect(verifiedVideoDateTime('2026-05-27T10:42:52Z')).toBe(
    '2026-05-27T10:42:52Z',
  );
});

test('descriptions require visible section and caption', () => {
  expect(() =>
    videoDescription('', 'Lucilla Cecchin', 'H-FtIARwy9o'),
  ).toThrow();
  expect(() =>
    videoDescription('Video recensioni', '', 'H-FtIARwy9o'),
  ).toThrow();
  expect(
    videoDescription('Video recensioni', 'Lucilla Cecchin', 'H-FtIARwy9o'),
  ).toBe('Video recensioni: Lucilla Cecchin');
});

const routes = [
  '/testimonianze',
  '/hr/iskustva-pacijenata',
  '/de/erfahrungen-unserer-patienten',
  '/en/testimonials',
  '/si/izkusnje-pacientov',
];
for (const route of routes) {
  test(`all thirteen videos have content-backed descriptions and timezone on ${route}`, async ({
    request,
    page,
  }) => {
    const response = await request.get(route);
    expect(response.status()).toBe(200);
    // Parse server HTML only: vendor widgets/tracking do not need to execute.
    const data = await page.evaluate(
      (html) => {
        const doc = new DOMParser().parseFromString(html, 'text/html');
        const nodes = JSON.parse(
          doc.querySelector('script[type="application/ld+json"]')!.textContent!,
        )['@graph'];
        const figures = [...doc.querySelectorAll('figure[data-youtube]')];
        return {
          videos: nodes.filter(
            (n: { '@type': string }) => n['@type'] === 'VideoObject',
          ),
          figures: figures.map((figure) => {
            let sibling: Element | null = figure.previousElementSibling;
            while (sibling && !/^H[2-4]$/.test(sibling.tagName))
              sibling = sibling.previousElementSibling;
            return {
              id: figure.getAttribute('data-youtube'),
              title: figure.querySelector('figcaption')!.textContent!,
              section: sibling?.textContent?.trim(),
            };
          }),
        };
      },
      await response.text(),
    );
    expect(data.videos).toHaveLength(13);
    expect(data.figures).toHaveLength(13);
    for (const video of data.videos) {
      const id = video['@id'].split('#video-')[1];
      const source = videoMetadata.videos.find((v) => v.videoId === id)!;
      const visible = data.figures.find((v) => v.id === id)!;
      expect(visible.section).toBeTruthy();
      expect(video.name).toBe(visible.title);
      expect(video.description).toBe(`${visible.section}: ${visible.title}`);
      expect(video.uploadDate).toBe(source.uploadDate);
      expect(verifiedVideoDateTime(video.uploadDate)).toBe(video.uploadDate);
      expect(video.embedUrl).toBe(
        `https://www.youtube-nocookie.com/embed/${id}`,
      );
    }
  });
}
