import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { englishPageIds, route } from '../src/content/en/routes';
import { route as deRoute } from '../src/content/de/routes';
const origin = process.env.QA_ORIGIN ?? 'http://127.0.0.1:4321';
const pairs = readFileSync('data/hr-routes.proposed.csv', 'utf8')
  .trim()
  .split('\n')
  .slice(1)
  .map((l) => l.split(','));
test('English destinations and all four reciprocal language pairs', async ({
  page,
  request,
}) => {
  test.setTimeout(120000);
  for (const id of englishPageIds) {
    const pair = pairs.find((p) => p[0] === id)!;
    const paths = [pair[1]!, pair[2]!, deRoute(id), route(id)];
    for (const [i, path] of paths.entries()) {
      const response = await request.get(origin + path);
      expect(response.status()).toBe(200);
      const links = await page.evaluate(
        (html) => {
          const d = new DOMParser().parseFromString(html, 'text/html');
          return {
            switches: [
              ...d.querySelectorAll('[data-language].desktop a[href]'),
            ].map((a) => [a.getAttribute('lang'), a.getAttribute('href')]),
            nav: [
              ...d.querySelectorAll('[data-nav-dropdown] a,header .nav-link'),
            ].map((a) => a.getAttribute('href')),
            locale: d
              .querySelector('meta[property="og:locale"]')
              ?.getAttribute('content'),
          };
        },
        await response.text(),
      );
      expect(links.switches).toEqual(
        ['it', 'hr', 'de', 'en'].map((lang, i) => [lang, paths[i]]),
      );
      if (i === 3) {
        expect(links.nav.every((h) => h?.startsWith('/en/'))).toBe(true);
        expect(links.locale).toBe('en_GB');
      }
    }
  }
});
for (const width of [390, 1440])
  test(`English actual language switching and modal labels ${width}`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto(origin + '/en/first-visit/');
    await page.evaluate(() => document.fonts.ready);
    const brand = await page.locator('.brand').evaluate((e) => {
      const span = e.querySelector('span')!;
      const range = document.createRange();
      range.selectNodeContents(span);
      return {
        difference: Math.abs(
          range.getBoundingClientRect().width - e.clientWidth,
        ),
        lines: range.getClientRects().length,
      };
    });
    expect(brand.difference).toBeLessThan(1);
    expect(brand.lines).toBe(1);
    const pair = pairs.find((p) => p[0] === 'first-visit')!;
    for (const [lang, path] of [
      ['hr', pair[2]],
      ['it', pair[1]],
      ['de', deRoute('first-visit')],
      ['en', route('first-visit')],
    ]) {
      const chooser = page.locator(
        `[data-language].${width < 1200 ? 'mobile' : 'desktop'}`,
      );
      await chooser.locator('summary').click();
      await chooser.locator(`a[lang=${lang}]`).click();
      expect(new URL(page.url()).pathname.replace(/\/$/, '')).toBe(
        path!.replace(/\/$/, ''),
      );
      await expect(page.locator('html')).toHaveAttribute('lang', lang!);
    }
    await page
      .locator(
        width < 992
          ? '.mobile-contact [data-contact-trigger]'
          : 'header [data-contact-trigger]',
      )
      .click();
    const dialog = page.locator('dialog[open]');
    await expect(dialog).toBeVisible();
    await expect(dialog.locator('input[type=tel]')).toHaveAttribute(
      'placeholder',
      '*Phone:',
    );
    await expect(dialog.locator('input[type=tel]')).toHaveAttribute(
      'required',
      '',
    );
    await expect(dialog.locator('.consent a')).toHaveAttribute(
      'href',
      '/en/privacy-policy',
    );
    await page.keyboard.press('Escape');
    await expect(dialog).toHaveCount(0);
    await page.locator('.chat-toggle').click();
    await expect(page.locator('.chat-panel')).toContainText(
      'How can we help you?',
    );
    await page.getByRole('button', { name: 'Close chat', exact: true }).click();
  });
