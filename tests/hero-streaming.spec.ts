import { expect, test } from '@playwright/test';
import { createServer } from 'node:http';
import { once } from 'node:events';
import type { AddressInfo } from 'node:net';

test.use({ contextOptions: { reducedMotion: 'reduce' } });

for (const path of ['/', '/hr/']) {
  for (const width of [412, 820]) {
    test(`streamed home reserves copy before the poster: ${path} ${width}`, async ({
      page,
      request,
      baseURL,
    }) => {
      await page.setViewportSize({ width, height: 1180 });
      const response = await request.get(path);
      expect(response.status()).toBe(200);
      const html = await response.text();
      const copyIndex = html.indexOf('<div class="hero-container"');
      const mediaIndex = html.indexOf('<div class="hero-media"');
      expect(copyIndex).toBeGreaterThan(0);
      expect(mediaIndex).toBeGreaterThan(0);
      // Split between the two actual siblings, not an artificial layout fixture.
      // The old media-first HTML paints the poster before receiving the copy.
      const split = Math.max(copyIndex, mediaIndex);
      let finishHtml!: () => void;
      const remainingHtml = new Promise<void>((resolve) => {
        finishHtml = resolve;
      });
      const server = createServer(async (_request, result) => {
        result.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        result.write(html.slice(0, split));
        await remainingHtml;
        result.end(html.slice(split));
      });
      server.listen(0, '127.0.0.1');
      await once(server, 'listening');
      const origin = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
      const errors: string[] = [];
      page.on('pageerror', (error) => errors.push(error.message));
      try {
        // Keep real local assets/scripts; only stream the main HTML in two parts.
        await page.route(`${origin}/**`, async (route) => {
          if (route.request().isNavigationRequest()) return route.continue();
          const url = new URL(route.request().url());
          const asset = await route.fetch({
            url: new URL(url.pathname + url.search, baseURL).href,
          });
          await route.fulfill({ response: asset });
        });
        await page.goto(origin + path, { waitUntil: 'commit' });
        await expect(page.locator('.hero-container')).toBeVisible();
        await expect(page.locator('h1')).toBeVisible();
        await expect(page.locator('.hero-media')).toHaveCount(0);
        // WebKit can defer FontFaceSet.ready until HTML parsing completes.
        // Inspect the real loaded faces while the second chunk is held back.
        await expect
          .poll(() =>
            page.evaluate(
              () =>
                document.fonts.size > 0 &&
                [...document.fonts].every((face) => face.status === 'loaded'),
            ),
          )
          .toBe(true);
        const copyBefore = await page.locator('.hero-container').boundingBox();
        const headingBefore = await page.locator('h1').boundingBox();
        expect(copyBefore!.height).toBeGreaterThan(0);

        finishHtml();
        await page.waitForLoadState('load');
        await expect(page).toHaveTitle(/Dent[Vv]italis/i);
        await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
          'content',
          /noindex/,
        );
        await expect(page.locator('.hero-media')).toBeVisible();
        expect(await page.locator('.hero-container').boundingBox()).toEqual(
          copyBefore,
        );
        expect(await page.locator('h1').boundingBox()).toEqual(headingBefore);
        const media = await page.locator('.hero-media').boundingBox();
        const margin = await page
          .locator('.hero-media')
          .evaluate((element) =>
            parseFloat(getComputedStyle(element).marginTop),
          );
        expect(media!.y).toBeCloseTo(
          copyBefore!.y + copyBefore!.height + margin,
          1,
        );
        expect(
          await page.evaluate(
            () => document.documentElement.scrollWidth - innerWidth,
          ),
        ).toBe(0);
        expect(errors).toEqual([]);
      } finally {
        finishHtml();
        server.closeAllConnections();
        await new Promise<void>((resolve) => server.close(() => resolve()));
      }
    });
  }
}
