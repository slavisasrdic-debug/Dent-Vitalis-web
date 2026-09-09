import { expect, test, type Locator } from '@playwright/test';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

test.use({ contextOptions: { reducedMotion: 'reduce' } });

async function contrast(control: Locator) {
  return control.evaluate((element) => {
    const style = getComputedStyle(element);
    const luminance = (color: string) => {
      // Normalize color(srgb ...) as well as rgb() returned by computed CSS.
      const canvas = document.createElement('canvas');
      canvas.width = canvas.height = 1;
      const context = canvas.getContext('2d')!;
      context.fillStyle = color;
      context.fillRect(0, 0, 1, 1);
      const rgb = [...context.getImageData(0, 0, 1, 1).data].slice(0, 3);
      return rgb.reduce((sum, channel, index) => {
        const value = channel / 255;
        return (
          sum +
          [0.2126, 0.7152, 0.0722][index]! *
            (value <= 0.04045
              ? value / 12.92
              : ((value + 0.055) / 1.055) ** 2.4)
        );
      }, 0);
    };
    const foreground = luminance(style.color);
    const background = luminance(style.backgroundColor);
    return (
      (Math.max(foreground, background) + 0.05) /
      (Math.min(foreground, background) + 0.05)
    );
  });
}

for (const route of ['/', '/hr/']) {
  for (const width of [412, 1350]) {
    test(`PageSpeed controls keep contrast, semantics and flag ratios: ${route} ${width}`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 940 });
      const errors: string[] = [];
      page.on('pageerror', (error) => errors.push(error.message));
      expect((await page.goto(route))?.status()).toBe(200);
      await expect(page).toHaveTitle(/Dent[Vv]italis/i);
      await expect(page.locator('h1')).toBeVisible();
      await expect(
        page.locator('astro-error-overlay,vite-error-overlay'),
      ).toHaveCount(0);
      await expect(page.locator('meta[name=robots]')).toHaveAttribute(
        'content',
        /noindex/,
      );

      const hero = page.locator('.button.hero');
      if (width >= 1200) {
        expect(await contrast(hero)).toBeGreaterThanOrEqual(4.5);
        await hero.hover();
        expect(await contrast(hero)).toBeGreaterThanOrEqual(4.5);
        await expect(hero.locator('.arrow svg')).toHaveCSS(
          'color',
          'rgb(23, 60, 70)',
        );
        await page.mouse.move(0, 0);
      } else {
        await page.locator('.menu-toggle').click();
      }

      for (const summary of await page
        .locator('[data-nav-dropdown] summary')
        .all()) {
        const linkBox = (await summary.locator('a').boundingBox())!;
        expect(linkBox.height).toBeGreaterThanOrEqual(44);
        expect(linkBox.width).toBeGreaterThanOrEqual(24);
        if (width >= 1200)
          expect((await summary.boundingBox())!.height).toBe(44);
        await summary.hover();
        expect(await contrast(summary)).toBeGreaterThanOrEqual(4.5);
        await page.mouse.move(0, 0);
      }
      if (width < 1200) await page.locator('.menu-toggle').click();

      const language = page.locator(
        `[data-language].${width >= 1200 ? 'desktop' : 'mobile'}`,
      );
      await language.locator('summary').click();
      const flags = await language
        .locator('img')
        .evaluateAll(async (images: HTMLImageElement[]) => {
          return Promise.all(
            images.map(async (image) => {
              await image.decode();
              const box = image.getBoundingClientRect();
              return {
                actual: box.width / box.height,
                natural: image.naturalWidth / image.naturalHeight,
              };
            }),
          );
        });
      for (const flag of flags)
        expect(Math.abs(flag.actual - flag.natural)).toBeLessThan(0.005);
      await page.keyboard.press('Escape');

      const submit = page.locator('[data-contact-form] .submit');
      await submit.scrollIntoViewIfNeeded();
      expect(await contrast(submit)).toBeGreaterThanOrEqual(4.5);
      await submit.hover();
      expect(await contrast(submit)).toBeGreaterThanOrEqual(4.5);
      await page.mouse.move(0, 0);
      const trigger = page.locator(
        width >= 1200 ? '.header-consultation a' : '.mobile-contact a',
      );
      await trigger.click();
      await expect(page.locator('[data-inquiry-dialog]')).toBeVisible();
      expect(await contrast(submit)).toBeGreaterThanOrEqual(4.5);
      await expect(submit).toHaveCSS('color', 'rgb(255, 255, 255)');
      await page.keyboard.press('Escape');

      const slider = page.locator('[data-slider]');
      await expect(slider.locator('article[role=group]')).toHaveCount(0);
      await expect(slider.locator('div.slide[role=group]')).toHaveCount(3);
      const next = slider.locator(
        width < 480 ? '[data-slide-to="1"]' : '.next',
      );
      await next.click();
      await expect(slider.locator('.slide').nth(1)).toHaveAttribute(
        'aria-hidden',
        'false',
      );
      await next.focus();
      await page.keyboard.press('ArrowRight');
      await expect(slider.locator('.slide').nth(2)).toHaveAttribute(
        'aria-hidden',
        'false',
      );

      const chat = page.locator('.chat-toggle');
      await expect(chat).toHaveText('');
      await expect(chat).toHaveAccessibleName(
        route === '/' ? 'Apri chat WhatsApp' : 'Otvori WhatsApp razgovor',
      );
      await expect(page.locator('.badge')).toHaveAttribute(
        'aria-hidden',
        'true',
      );
      await chat.click();
      await expect(page.locator('.chat-panel')).toBeVisible();
      await chat.click();
      await expect(page.locator('.chat-panel')).toBeHidden();
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth),
      ).toBeLessThanOrEqual(width);
      expect(errors).toEqual([]);
    });
  }
}

test('long-lived video cache keys are generated from the exact local bytes', async ({
  page,
}) => {
  await page.goto('/hr/');
  const urls = await page
    .locator('.video source[data-src]')
    .evaluateAll((sources) =>
      sources.map((source) => source.getAttribute('data-src')!),
    );
  expect(urls).toHaveLength(4);
  for (const value of urls) {
    const url = new URL(value, 'https://dent-vitalis-web.pages.dev');
    const bytes = readFileSync(join(process.cwd(), 'public', url.pathname));
    expect(url.searchParams.get('v')).toBe(
      createHash('sha256').update(bytes).digest('hex'),
    );
  }
  const headers = readFileSync('public/_headers', 'utf8');
  expect(headers).toContain(
    'https://dent-vitalis-web.pages.dev/*\n  X-Robots-Tag: noindex, nofollow',
  );
  expect(headers).toContain(
    'https://:version.dent-vitalis-web.pages.dev/*\n  X-Robots-Tag: noindex, nofollow',
  );
  expect(headers).not.toMatch(/^\/\*\n\s+Cache-Control/m);
});
