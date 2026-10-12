import { test, expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { installedV21Baseline } from '../scripts/installed-v20-baseline.mjs';
import { separateHtmlText } from '../src/lib/html-text-boundaries';
const cases = [
  { route: '/', lang: 'it' },
  { route: '/hr', lang: 'hr' },
  { route: '/en', lang: 'en' },
  { route: '/de', lang: 'de' },
  { route: '/si', lang: 'sl' },
];
let baseline: Awaited<ReturnType<typeof installedV21Baseline>>;
test.beforeAll(async () => {
  baseline = await installedV21Baseline();
});
for (const item of cases)
  for (const width of [390, 1440])
    test(`V22 nav separation and unchanged geometry ${item.lang} ${width}`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.emulateMedia({ reducedMotion: 'reduce' });
      const errors: string[] = [],
        posts: string[] = [],
        consoleErrors: string[] = [];
      page.on('pageerror', (error) => errors.push(error.message));
      page.on('console', (message) => {
        if (
          message.type() === 'error' &&
          !message.text().includes('net::ERR_FAILED')
        )
          consoleErrors.push(message.text());
      });
      page.on('request', (request) => {
        if (request.method() === 'POST') posts.push(request.url());
      });
      let updated = false;
      await page.route('**/*', async (route) => {
        const request = route.request(),
          url = new URL(request.url());
        if (
          request.isNavigationRequest() &&
          request.frame() === page.mainFrame()
        ) {
          const path =
            url.pathname === '/'
              ? 'index.html'
              : '_pages' + url.pathname + '.html';
          const html = baseline.read(path).toString();
          return route.fulfill({
            status: 200,
            contentType: 'text/html',
            body: updated ? separateHtmlText(html) : html,
          });
        }
        if (url.hostname !== '127.0.0.1') return route.abort();
        const path = decodeURIComponent(url.pathname);
        try {
          return route.fulfill({
            status: 200,
            body: await readFile(join(process.cwd(), 'dist', path)),
            contentType: path.endsWith('.js')
              ? 'application/javascript'
              : path.endsWith('.css')
                ? 'text/css'
                : path.endsWith('.svg')
                  ? 'image/svg+xml'
                  : path.endsWith('.webp')
                    ? 'image/webp'
                    : path.endsWith('.woff2')
                      ? 'font/woff2'
                      : 'application/octet-stream',
          });
        } catch {
          return route.abort();
        }
      });
      const geometry = async () => {
        await page.evaluate(() => document.fonts.ready);
        return page.locator('body *').evaluateAll((elements) =>
          elements.map((el) => {
            const r = el.getBoundingClientRect();
            return {
              tag: el.tagName,
              classes: el.getAttribute('class'),
              rect: [r.x, r.y, r.width, r.height].map(
                (v) => Math.round(v * 100) / 100,
              ),
            };
          }),
        );
      };
      const openMenu = async () => {
        if (width < 1200) await page.locator('.menu-toggle').click();
      };
      const openGroup = async (index: number) => {
        const group = page.locator('[data-nav-dropdown]').nth(index);
        await group.locator('summary > a').focus();
        await page.keyboard.press('Enter');
        await expect(group).toHaveAttribute('open', '');
        return group;
      };
      await page.goto(item.route, { waitUntil: 'networkidle' });
      const title = await page.title();
      const closed = await geometry();
      await openMenu();
      const opened = [];
      for (let i = 0; i < 3; i++) {
        await openGroup(i);
        opened.push(await geometry());
      }
      updated = true;
      await page.reload({ waitUntil: 'networkidle' });
      expect(new URL(page.url()).pathname).toBe(item.route);
      expect(await page.title()).toBe(title);
      await expect(page.locator('html')).toHaveAttribute('lang', item.lang);
      await expect(page.locator('h1')).toBeVisible();
      await expect(
        page.locator('astro-error-overlay,vite-error-overlay'),
      ).toHaveCount(0);
      expect(await geometry()).toEqual(closed);
      await openMenu();
      for (let i = 0; i < 3; i++) {
        const group = await openGroup(i);
        const links = group.locator('.dropdown-links');
        const labels = (
          await links.locator(':scope > a').allTextContents()
        ).map((label) => label.trim().replace(/\s+/g, ' '));
        expect((await links.textContent())?.trim().replace(/\s+/g, ' ')).toBe(
          labels.join(' '),
        );
        expect(await geometry()).toEqual(opened[i]);
        if (item.lang === 'hr' && i === 0)
          await links.screenshot({
            path: `/tmp/dv-navigation-v22-hr-${width}.png`,
          });
      }
      const firstChild = page
        .locator('[data-nav-dropdown]')
        .nth(2)
        .locator('.dropdown-links > a')
        .first();
      const href = await firstChild.getAttribute('href');
      await firstChild.focus();
      await page.keyboard.press('Enter');
      await page.waitForURL((url) => url.pathname === href);
      await expect(page.locator('h1')).toBeVisible();
      const trigger = page.locator(
        width >= 1200
          ? '.header-consultation .button'
          : '.mobile-contact .button',
      );
      await trigger.click();
      const dialog = page.locator('[data-inquiry-dialog]');
      await expect(dialog).toBeVisible();
      await expect(dialog.locator('input[name=lang]')).toHaveValue(item.lang);
      await page.keyboard.press('Escape');
      await expect(dialog).not.toBeVisible();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      expect(errors).toEqual([]);
      expect(consoleErrors).toEqual([]);
      expect(posts).toEqual([]);
    });
