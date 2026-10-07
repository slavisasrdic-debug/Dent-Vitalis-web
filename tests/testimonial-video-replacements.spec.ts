import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { blockElfsight } from './helpers/elfsight';

const mapping = JSON.parse(
  readFileSync('data/testimonial-video-replacements-20261007.json', 'utf8'),
) as typeof import('../data/testimonial-video-replacements-20261007.json');
const videos = [
  ...mapping.replacements.map((v) => ({
    id: v.newId,
    title: v.title,
    replaced: true,
  })),
  ...mapping.unchanged.map((v) => ({
    id: v.videoId,
    title: v.title,
    replaced: false,
  })),
];
const cases = [
  { lang: 'it', route: '/testimonianze' },
  { lang: 'hr', route: '/hr/iskustva-pacijenata' },
  { lang: 'en', route: '/en/testimonials' },
  { lang: 'de', route: '/de/erfahrungen-unserer-patienten' },
  { lang: 'sl', route: '/si/izkusnje-pacientov' },
];

for (const item of cases)
  for (const width of [390, 1440])
    test(`${item.lang}: exact video mapping, click-to-load and captions at ${width}px`, async ({
      page,
    }) => {
      await blockElfsight(page);
      // This deterministic test verifies our URLs and iframe behavior, not the
      // remote player's media/caption availability (checked separately live).
      await page.route('https://www.youtube-nocookie.com/embed/**', (r) =>
        r.fulfill({
          contentType: 'text/html',
          body: '<!doctype html><title>Player fixture</title>',
        }),
      );
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.setViewportSize({ width, height: 900 });
      const errors: string[] = [];
      page.on('pageerror', (e) => errors.push(e.message));
      page.on('console', (message) => {
        if (
          message.type() === 'error' &&
          message.location().url.includes('127.0.0.1')
        )
          errors.push(message.text());
      });
      const response = await page.goto(item.route);
      expect(response?.status()).toBe(200);
      await expect(page).toHaveURL(new RegExp(`${item.route}$`));
      await expect(page.locator('html')).toHaveAttribute('lang', item.lang);
      await expect(page.locator('h1')).toBeVisible();
      await expect(page).not.toHaveTitle(/error/i);
      await expect(
        page.locator('astro-error-overlay, vite-error-overlay'),
      ).toHaveCount(0);
      const cards = page.locator('figure.testimonial-video');
      await expect(cards).toHaveCount(13);
      await expect(cards.locator('iframe')).toHaveCount(0);
      for (let i = 0; i < videos.length; i++) {
        const video = videos[i]!;
        const card = cards.nth(i);
        await expect(card).toHaveAttribute('data-youtube', video.id);
        await expect(card).toHaveAttribute('data-title', video.title);
        await expect(card.locator('figcaption')).toHaveText(video.title);
        await expect(card.locator('a')).toHaveAttribute(
          'href',
          `https://www.youtube.com/watch?v=${video.id}`,
        );
        await expect(card.locator('a')).toHaveAttribute(
          'aria-label',
          new RegExp(video.title),
        );
        const image = card.locator('img');
        await expect(image).toHaveAttribute(
          'src',
          `/assets/images/youtube-${video.id}.webp`,
        );
        await card.scrollIntoViewIfNeeded();
        await expect
          .poll(() =>
            image.evaluate(
              (img: HTMLImageElement) => img.complete && img.naturalWidth > 0,
            ),
          )
          .toBe(true);
        if (video.replaced) {
          await expect(image).toHaveAttribute('width', '1280');
          await expect(image).toHaveAttribute('height', '720');
          expect(
            await image.evaluate((img: HTMLImageElement) => [
              img.naturalWidth,
              img.naturalHeight,
            ]),
          ).toEqual([1280, 720]);
        }
        const box = await card.locator('.player').boundingBox();
        expect(box!.width / box!.height).toBeCloseTo(16 / 9, 1);
        if (i === 0)
          await card.screenshot({
            path: `/tmp/dv-v20-${item.lang}-${width}-poster.png`,
          });
        if (i === 0) {
          await card.locator('a').focus();
          await page.keyboard.press('Enter');
        } else await card.locator('a').click();
        const iframe = card.locator('iframe');
        await expect(iframe).toHaveCount(1);
        const url = new URL((await iframe.getAttribute('src'))!);
        expect(url.origin).toBe('https://www.youtube-nocookie.com');
        expect(url.pathname).toBe(`/embed/${video.id}`);
        const parameters = video.replaced
          ? {
              autoplay: '1',
              cc_load_policy: '1',
              cc_lang_pref: item.lang,
              hl: item.lang,
              playsinline: '1',
              rel: '0',
            }
          : { autoplay: '1' };
        expect(Object.fromEntries(url.searchParams)).toEqual(parameters);
        await expect(iframe).toHaveAttribute('title', video.title);
        await expect(iframe).toHaveAttribute(
          'allow',
          'autoplay; encrypted-media; picture-in-picture; fullscreen',
        );
        expect(await iframe.getAttribute('allowfullscreen')).not.toBeNull();
        if (video.replaced)
          await expect(iframe).toHaveAttribute(
            'referrerpolicy',
            'strict-origin-when-cross-origin',
          );
        // A second activation must never create a second player.
        await card.evaluate((figure) =>
          figure.dispatchEvent(new MouseEvent('click', { bubbles: true })),
        );
        await expect(card.locator('iframe')).toHaveCount(1);
      }
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      const schema = JSON.parse(
        (await page
          .locator('script[type="application/ld+json"]')
          .textContent())!,
      );
      const nodes = schema['@graph'].filter(
        (n: { '@type': string }) => n['@type'] === 'VideoObject',
      );
      expect(nodes.map((n: { name: string }) => n.name)).toEqual(
        videos.map((v) => v.title),
      );
      for (const old of mapping.replacements)
        expect(await page.content()).not.toContain(old.oldId);
      expect(errors).toEqual([]);
    });

test('legacy videos and source catalogues are not rewritten', () => {
  const original = JSON.parse(
    readFileSync('src/content/inner-pages-it.json', 'utf8'),
  );
  const sourceVideos = original
    .find((p: { route: string }) => p.route === '/testimonianze')
    .blocks.filter((b: { type: string }) => b.type === 'youtube');
  expect(sourceVideos.map((b: { videoId: string }) => b.videoId)).toEqual([
    ...mapping.replacements.map((v) => v.oldId),
    ...mapping.unchanged.map((v) => v.videoId),
  ]);
});
