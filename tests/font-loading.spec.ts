import { expect, test } from '@playwright/test';
import fonts from '../src/content/font-styles.json' with { type: 'json' };

test.use({ contextOptions: { reducedMotion: 'reduce' } });

declare global {
  interface Window {
    fontLoadingProbe: {
      samples: {
        time: number;
        heading: number;
        hero: number;
        header: number;
        breadcrumb: number;
        heroTop: number;
      }[];
      shifts: { time: number; value: number }[];
    };
  }
}

for (const route of [
  '/',
  '/hr/',
  '/hr/proteza-na-4-implantata',
  '/prestazioni/protesi-definitiva-ancorata-su-4-impianti',
]) {
  for (const width of route.includes('impianti') || route.includes('implantata')
    ? [390, 768, 820, 834, 991, 992, 1024, 1180, 1856]
    : [390, 1856]) {
    test(`cold font load keeps the first painted heading stable: ${route} ${width}px`, async ({
      page,
    }) => {
      const tabletHeights: Record<number, number> = {
        768: 1024,
        820: 1180,
        834: 1194,
        1024: 768,
        1180: 820,
      };
      await page.setViewportSize({
        width,
        height: tabletHeights[width] ?? 1050,
      });
      const errors: string[] = [];
      page.on('pageerror', (error) => errors.push(error.message));
      page.on('console', (message) => {
        if (['error', 'warning'].includes(message.type()))
          errors.push(message.text());
      });
      // A slow critical payload must not expose fallback text before real fonts.
      await page.route(`**${fonts.script}`, async (route) => {
        await new Promise((resolve) => setTimeout(resolve, 800));
        await route.continue();
      });
      await page.addInitScript(() => {
        window.fontLoadingProbe = { samples: [], shifts: [] };
        if (PerformanceObserver.supportedEntryTypes.includes('layout-shift')) {
          new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
              const shift = entry as PerformanceEntry & {
                value: number;
                hadRecentInput: boolean;
              };
              if (!shift.hadRecentInput)
                window.fontLoadingProbe.shifts.push({
                  time: shift.startTime,
                  value: shift.value,
                });
            }
          }).observe({ type: 'layout-shift', buffered: true });
        }
        const sample = () => {
          const heading = document.querySelector('main h1');
          if (heading)
            window.fontLoadingProbe.samples.push({
              time: performance.now(),
              heading: heading.getBoundingClientRect().height,
              hero:
                document.querySelector('.detail-hero')?.getBoundingClientRect()
                  .height ?? 0,
              header:
                document.querySelector('.site-header')?.getBoundingClientRect()
                  .height ?? 0,
              breadcrumb:
                document.querySelector('.breadcrumbs')?.getBoundingClientRect()
                  .height ?? 0,
              heroTop:
                document.querySelector('.detail-hero')?.getBoundingClientRect()
                  .top ?? 0,
            });
          requestAnimationFrame(sample);
        };
        requestAnimationFrame(sample);
      });
      expect((await page.goto(route))?.status()).toBe(200);
      await expect(page).toHaveTitle(/DentVitalis|Dentvitalis|Imperdibile/i);
      await expect(page.locator('main h1')).toBeVisible();
      await expect(
        page.locator('astro-error-overlay,vite-error-overlay'),
      ).toHaveCount(0);
      await page.evaluate(() => document.fonts.ready);
      await expect
        .poll(() =>
          page.evaluate(() => {
            const fcp =
              performance.getEntriesByName('first-contentful-paint')[0]
                ?.startTime ?? 0;
            return window.fontLoadingProbe.samples.filter(
              (sample) => sample.time >= fcp,
            ).length;
          }),
        )
        .toBeGreaterThan(2);
      const result = await page.evaluate(() => {
        // Paint/CLS entries are Chromium evidence. WebKit still checks loaded
        // fonts, zero late font requests, geometry, content and console health.
        const fcp = performance.getEntriesByName('first-contentful-paint')[0]
          ?.startTime;
        return {
          fcp,
          probe: window.fontLoadingProbe,
          fontRequests: performance
            .getEntriesByType('resource')
            .filter((entry) => /\.(woff2?|ttf)(\?|$)/.test(entry.name)).length,
          overflow: document.documentElement.scrollWidth - innerWidth,
          fontStatus: document.fonts.status,
        };
      });
      expect(result.fontRequests).toBe(0);
      expect(result.fontStatus).toBe('loaded');
      expect(result.overflow).toBe(0);
      if (result.fcp !== undefined) {
        const painted = result.probe.samples.filter(
          (sample) => sample.time >= result.fcp!,
        );
        expect(painted.length).toBeGreaterThan(1);
        expect(new Set(painted.map((sample) => sample.heading)).size).toBe(1);
        expect(new Set(painted.map((sample) => sample.hero)).size).toBe(1);
        expect(new Set(painted.map((sample) => sample.header)).size).toBe(1);
        expect(new Set(painted.map((sample) => sample.breadcrumb)).size).toBe(
          1,
        );
        expect(new Set(painted.map((sample) => sample.heroTop)).size).toBe(1);
        expect(painted[0]!.header).toBeGreaterThan(0);
        if (route.includes('impianti') || route.includes('implantata')) {
          expect(painted[0]!.breadcrumb).toBeGreaterThan(0);
          expect(painted[0]!.heroTop).toBeCloseTo(
            painted[0]!.header + painted[0]!.breadcrumb,
            1,
          );
        }
        expect(
          result.probe.shifts
            .filter((shift) => shift.time >= result.fcp!)
            .reduce((sum, shift) => sum + shift.value, 0),
        ).toBeLessThan(0.001);
      }
      // Refresh repeats the real entry flow; the current typeface stays loaded.
      const before = await page.locator('main h1').boundingBox();
      await page.reload();
      await page.evaluate(() => document.fonts.ready);
      expect(await page.locator('main h1').boundingBox()).toEqual(before);
      expect(errors).toEqual([]);
    });
  }
}

test('hero preload selects only the matching responsive image at high priority', async ({
  browser,
}) => {
  for (const viewport of [
    { width: 390, height: 900 },
    { width: 991, height: 900 },
    { width: 992, height: 900 },
    { width: 1856, height: 1050 },
  ]) {
    const context = await browser.newContext({
      viewport,
      deviceScaleFactor: viewport.width === 390 ? 2 : 1,
      reducedMotion: 'reduce',
    });
    try {
      const page = await context.newPage();
      await page.goto('http://127.0.0.1:4321/hr/proteza-na-4-implantata');
      const photo = page.locator('.hero-photo img');
      await expect(photo).toHaveAttribute('loading', 'eager');
      await expect(photo).toHaveAttribute('fetchpriority', 'high');
      await photo.evaluate((image: HTMLImageElement) => image.decode());
      const preload = page.locator('link[rel="preload"][as="image"]');
      await expect(preload).toHaveCount(1);
      expect(await preload.getAttribute('imagesrcset')).toBe(
        await photo.getAttribute('srcset'),
      );
      expect(await preload.getAttribute('imagesizes')).toBe(
        await photo.getAttribute('sizes'),
      );
      const resources = await page.evaluate(() =>
        performance
          .getEntriesByType('resource')
          .filter((entry) => entry.name.includes('/Sedazione-cosciente-1-'))
          .map((entry) => ({
            name: entry.name,
            initiator: (entry as PerformanceResourceTiming).initiatorType,
          })),
      );
      expect(resources).toHaveLength(1);
      expect(resources[0]!.name).toBe(
        await photo.evaluate((image: HTMLImageElement) => image.currentSrc),
      );
      expect(resources[0]!.initiator).toBe('link');
    } finally {
      await context.close();
    }
  }
});

test('font delivery and hero geometry do not depend on JavaScript', async ({
  browser,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 1856, height: 1050 },
  });
  try {
    const page = await context.newPage();
    await page.goto('http://127.0.0.1:4321/hr/proteza-na-4-implantata');
    await expect(page.locator('main h1')).toBeVisible();
    await expect(page.locator('[data-font-styles]')).toHaveCount(1);
    const lines = await page
      .locator('main h1')
      .evaluate(
        (element) =>
          element.getBoundingClientRect().height /
          parseFloat(getComputedStyle(element).lineHeight),
      );
    expect(lines).toBeCloseTo(5, 1);
    await expect(page.locator('.hero-photo img')).toHaveJSProperty(
      'complete',
      true,
    );
  } finally {
    await context.close();
  }
});

test('iPad touch menu keeps the header and breadcrumb in their original space', async ({
  browser,
}) => {
  const context = await browser.newContext({
    viewport: { width: 820, height: 1180 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
    reducedMotion: 'reduce',
  });
  try {
    const page = await context.newPage();
    await page.goto('http://127.0.0.1:4321/hr/proteza-na-4-implantata');
    const before = await page.locator('.detail-hero').boundingBox();
    const menu = page.locator('.menu-toggle');
    await menu.tap();
    await expect(menu).toHaveAttribute('aria-expanded', 'true');
    await expect(page.locator('.site-nav')).toBeVisible();
    await menu.tap();
    await expect(menu).toHaveAttribute('aria-expanded', 'false');
    expect(await page.locator('.detail-hero').boundingBox()).toEqual(before);
  } finally {
    await context.close();
  }
});

test('a failed critical font script falls back to readable native CSS fonts', async ({
  page,
}) => {
  await page.route(`**${fonts.script}`, (route) => route.abort());
  await page.goto('/hr/proteza-na-4-implantata');
  await page.evaluate(() => document.fonts.ready);
  await expect(page.locator('main h1')).toBeVisible();
  await expect(
    page.locator(`link[rel="stylesheet"][href="${fonts.stylesheet}"]`),
  ).toHaveCount(1);
  await expect(
    page.locator('astro-error-overlay,vite-error-overlay'),
  ).toHaveCount(0);
  expect(
    await page.evaluate(() =>
      document.fonts.check('600 46px Montserrat', 'DentVitalis'),
    ),
  ).toBe(true);
});
