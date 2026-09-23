import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { localizedPageRegistry } from '../src/content/localized-page-registry';
const source = JSON.parse(
  readFileSync('data/translations/de-source.json', 'utf8'),
) as typeof import('../data/translations/de-source.json');

const origin = process.env.QA_ORIGIN ?? 'http://127.0.0.1:4321';
const approved = readFileSync('data/hr-routes.proposed.csv', 'utf8')
  .trim()
  .split('\n')
  .slice(1)
  .map((line) => line.split(','));
const entries = [
  { route: 'home', sourceTable: '' },
  ...localizedPageRegistry.de,
];
const normalize = (value: string) => value.replace(/\s|\u200b/g, '');

test('all German pages have reciprocal IT/HR links, German navigation and real destinations', async ({
  page,
  request,
}) => {
  test.setTimeout(120000);
  const destinations = new Set<string>();
  for (const entry of entries) {
    const route = entry.route === 'home' ? '/de/' : `/de/${entry.route}`;
    const response = await request.get(origin + route);
    expect(response.status(), route).toBe(200);
    const doc = await page.evaluate(
      (html) => {
        const d = new DOMParser().parseFromString(html, 'text/html');
        return {
          lang: d.documentElement.lang,
          title: d.title,
          h1: [...d.querySelectorAll('h1')].map((n) => n.textContent),
          nav: d.querySelector('header nav')?.textContent,
          navTargets: [
            ...d.querySelectorAll('[data-nav-dropdown] a, header .nav-link'),
          ].map((a) => a.getAttribute('href')),
          ogLocale: d
            .querySelector('meta[property="og:locale"]')
            ?.getAttribute('content'),
          links: [...d.querySelectorAll('a[href]')].map((a) =>
            a.getAttribute('href')!,
          ),
          switches: [
            ...d.querySelectorAll('[data-language].desktop a[href]'),
          ].map((a) => [a.getAttribute('lang'), a.getAttribute('href')]),
          alternates: [
            ...d.querySelectorAll('link[rel=alternate][hreflang]'),
          ].map((a) => [a.getAttribute('hreflang'), a.getAttribute('href')]),
          logo: d.querySelector('header .brand')?.getAttribute('href'),
          body: d.querySelector('main')?.textContent ?? '',
          phone: d.querySelector('input[type=tel]')?.hasAttribute('required'),
        };
      },
      await response.text(),
    );
    expect(doc.lang).toBe('de');
    expect(doc.h1).toHaveLength(1);
    expect(doc.title.length).toBeGreaterThan(10);
    expect(doc.logo).toBe('/de/');
    expect(doc.ogLocale).toBe('de_DE');
    expect(
      doc.navTargets.every(
        (href) => href?.startsWith('/de/') || href === '#contatti',
      ),
    ).toBe(true);
    expect(doc.nav).toContain('Dienstleistungen');
    expect(doc.nav).toContain('Über uns');
    expect(doc.nav).not.toMatch(/Prestazioni|Su di noi|Informazioni|Contatti/);
    expect(doc.phone).toBe(true);
    const pair = approved.find((r) => r[0] === entry.route)!;
    expect(doc.switches).toEqual([
      ['it', pair[1]],
      ['hr', pair[2]],
      ['de', route],
    ]);
    for (const [language, path] of doc.switches) {
      expect(doc.alternates).toContainEqual([
        language,
        `https://www.dentvitalis.com${path!.endsWith('/') ? path : path + '/'}`,
      ]);
    }
    expect(
      doc.alternates.some(([lang]) => lang === 'en' || lang === 'sl'),
    ).toBe(false);
    for (const localePath of [pair[1]!, pair[2]!]) {
      const counterpart = await request.get(origin + localePath);
      expect(counterpart.status(), localePath).toBe(200);
      const back = await page.evaluate(
        (html) =>
          new DOMParser()
            .parseFromString(html, 'text/html')
            .querySelector('[data-language].desktop a[lang=de]')
            ?.getAttribute('href'),
        await counterpart.text(),
      );
      expect(back, localePath).toBe(route);
    }
    for (const link of doc.links) {
      if (link.startsWith('/') || link.startsWith('#'))
        destinations.add(new URL(link, origin + route).href);
    }
    if (entry.sourceTable) {
      const table = source.blocks.find(
        (block) => block.id === entry.sourceTable,
      )!;
      for (const p of table.rows!.flat(2)) {
        if (p.text.trim())
          expect(normalize(doc.body), `${route}: ${p.id}`).toContain(
            normalize(p.text),
          );
      }
    }
  }
  for (const destination of destinations) {
    const url = new URL(destination);
    const result = await request.get(url.origin + url.pathname);
    expect(result.status(), destination).toBe(200);
    if (url.hash) {
      const exists = await page.evaluate(
        ({ html, id }) =>
          !!new DOMParser()
            .parseFromString(html, 'text/html')
            .getElementById(id),
        {
          html: await result.text(),
          id: decodeURIComponent(url.hash.slice(1)),
        },
      );
      expect(exists, destination).toBe(true);
    }
  }
});

for (const width of [390, 1440]) {
  test(`German menu and language switching by real clicks at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.goto(origin + '/de/');
    const variant = width < 1200 ? 'mobile' : 'desktop';
    for (const [lang, path] of [
      ['hr', '/hr/'],
      ['it', '/'],
      ['de', '/de/'],
    ]) {
      const chooser = page.locator(`[data-language].${variant}`);
      await chooser.locator('summary').click();
      await chooser.locator(`a[lang=${lang}]`).click();
      await expect(page).toHaveURL(origin + path);
      await expect(page.locator('html')).toHaveAttribute('lang', lang!);
    }
    if (width < 1200)
      await page
        .getByRole('button', { name: 'Menü öffnen', exact: true })
        .click();
    const group = page.locator('[data-nav-dropdown]').first();
    await group.locator('summary > a').click();
    await expect(group).toHaveAttribute('open', '');
    await group.locator('.dropdown-links a').nth(1).click();
    await expect(page).toHaveURL(/\/de\/fixed-implant-bridge\/?$/);
    await expect(page.locator('h1')).toContainText('Premium-Paket');
    await expect(page.locator('header .brand')).toHaveAttribute('href', '/de/');
    await page.locator('header .brand').click();
    await expect(page).toHaveURL(origin + '/de/');
    await page.locator(`[data-language].${variant} summary`).click();
    await page.screenshot({ path: `/tmp/dentvitalis-de-${width}.png` });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await expect(page.locator('astro-error-overlay')).toHaveCount(0);
    expect(errors).toEqual([]);
  });
}
