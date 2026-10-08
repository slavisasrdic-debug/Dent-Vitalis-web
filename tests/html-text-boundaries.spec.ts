import { test, expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { installedV20Baseline } from '../scripts/installed-v20-baseline.mjs';
import { separateHtmlText } from '../src/lib/html-text-boundaries';

const cases = [
  { route: '/contatti', path: '_pages/contatti.html', lang: 'it' },
  { route: '/hr/kontakt', path: '_pages/hr/kontakt.html', lang: 'hr' },
  { route: '/de/kontakt', path: '_pages/de/kontakt.html', lang: 'de' },
  { route: '/en/contact', path: '_pages/en/contact.html', lang: 'en' },
  { route: '/si/stik-z-nami', path: '_pages/si/stik-z-nami.html', lang: 'sl' },
  { route: '/hr', path: '_pages/hr.html', lang: 'hr' },
  { route: '/', path: 'index.html', lang: 'it' },
  { route: '/hr/usluge', path: '_pages/hr/usluge.html', lang: 'hr' },
  { route: '/hr/cjenik', path: '_pages/hr/cjenik.html', lang: 'hr' },
  {
    route: '/hr/iskustva-pacijenata',
    path: '_pages/hr/iskustva-pacijenata.html',
    lang: 'hr',
  },
  { route: '/hr/faq', path: '_pages/hr/faq.html', lang: 'hr' },
  { route: '/hr/galerija', path: '_pages/hr/galerija.html', lang: 'hr' },
];
let baseline: Awaited<ReturnType<typeof installedV20Baseline>>;
test.beforeAll(async () => {
  baseline = await installedV20Baseline();
});

for (const item of cases)
  for (const width of [390, 1440])
    test(`production whitespace-only geometry ${item.route} ${width}`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.emulateMedia({ reducedMotion: 'reduce' });
      const pageErrors: string[] = [];
      const consoleErrors: string[] = [];
      const posts: string[] = [];
      page.on('pageerror', (error) => pageErrors.push(error.message));
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
      let html = baseline.read(item.path).toString();
      await page.route('**/*', async (route) => {
        const request = route.request(),
          url = new URL(request.url());
        if (
          request.isNavigationRequest() &&
          request.frame() === page.mainFrame()
        )
          return route.fulfill({
            status: 200,
            contentType: 'text/html',
            body: html,
          });
        if (url.hostname !== '127.0.0.1') return route.abort();
        try {
          const path = decodeURIComponent(url.pathname);
          const bytes = await readFile(join(process.cwd(), 'dist', path));
          const contentType = path.endsWith('.js')
            ? 'application/javascript'
            : path.endsWith('.css')
              ? 'text/css'
              : path.endsWith('.svg')
                ? 'image/svg+xml'
                : path.endsWith('.webp')
                  ? 'image/webp'
                  : path.endsWith('.woff2')
                    ? 'font/woff2'
                    : 'application/octet-stream';
          return route.fulfill({ status: 200, body: bytes, contentType });
        } catch {
          return route.abort();
        }
      });
      const geometry = async () => {
        await page.evaluate(() => document.fonts.ready);
        return page.locator('body *').evaluateAll((elements) =>
          elements.map((element) => {
            const rect = element.getBoundingClientRect();
            return {
              tag: element.tagName,
              classes: element.getAttribute('class'),
              rect: [rect.x, rect.y, rect.width, rect.height].map(
                (n) => Math.round(n * 100) / 100,
              ),
            };
          }),
        );
      };
      await page.goto(item.route, { waitUntil: 'networkidle' });
      const before = await geometry();
      const title = await page.title();
      const formBefore = await page
        .locator('[data-contact-form]')
        .evaluateAll((forms) => forms.map((form) => form.outerHTML));
      html = separateHtmlText(html);
      await page.reload({ waitUntil: 'networkidle' });
      expect(await page.title()).toBe(title);
      await expect(page.locator('html')).toHaveAttribute('lang', item.lang);
      await expect(page.locator('h1')).toBeVisible();
      await expect(
        page.locator('astro-error-overlay,vite-error-overlay'),
      ).toHaveCount(0);
      expect(await geometry()).toEqual(before);
      expect(
        await page
          .locator('[data-contact-form]')
          .evaluateAll((forms) => forms.map((form) => form.outerHTML)),
      ).toEqual(formBefore);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      const address = page.locator('footer .contacts address');
      const phone = await address
        .locator('a[href^="tel:"]')
        .last()
        .textContent();
      const email = await address.locator('a[href^="mailto:"]').textContent();
      const plain = await address.textContent();
      expect(plain).toContain(`${phone} ${email}`);
      if (item.route === '/hr') {
        await page.locator('footer .contacts').scrollIntoViewIfNeeded();
        await page
          .locator('footer .contacts')
          .screenshot({ path: `/tmp/dv-text-boundaries-v21-hr-${width}.png` });
      }
      const trigger = page.locator(
        width >= 1200
          ? '.header-consultation .button'
          : '.mobile-contact .button',
      );
      await trigger.click();
      const dialog = page.locator('[data-inquiry-dialog]');
      await expect(dialog).toBeVisible();
      await expect(dialog.locator('input[name="lang"]')).toHaveValue(item.lang);
      await page.keyboard.press('Escape');
      await expect(dialog).not.toBeVisible();
      if (item.route === '/hr/faq') {
        const first = page.locator('.faq-item').first();
        await first.locator('summary').click();
        await expect(first).toHaveAttribute('open', '');
        await first.locator('summary').click();
        await expect(first).not.toHaveAttribute('open', '');
      }
      expect(posts).toEqual([]);
      expect(pageErrors).toEqual([]);
      expect(consoleErrors).toEqual([]);
    });
