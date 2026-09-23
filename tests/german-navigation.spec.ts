import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { localizedPageRegistry } from '../src/content/localized-page-registry';
import { route as slovenianRoute } from '../src/content/sl/routes';
import { route as englishRoute } from '../src/content/en/routes';
import { germanPageIds, route as germanRoute } from '../src/content/de/routes';
const source = JSON.parse(
  readFileSync('data/translations/de-source.json', 'utf8'),
) as typeof import('../data/translations/de-source.json');

const origin = process.env.QA_ORIGIN ?? 'http://127.0.0.1:4321';
const approved = readFileSync('data/hr-routes.proposed.csv', 'utf8')
  .trim()
  .split('\n')
  .slice(1)
  .map((line) => line.split(','));
const entries = germanPageIds.map((route) => ({
  route,
  sourceTable:
    localizedPageRegistry.de.find((entry) => entry.route === route)
      ?.sourceTable ?? '',
}));
const normalize = (value: string) =>
  value.replace(/\u200d/g, '').replace(/[\s\u200b•–—-]/g, '');
const corrections: Record<string, string> = {
  't3.r0.c0.p2':
    'Festsitzende implantatgetragene Brücke – unabhängig von der Anzahl der Implantate',
  't5.r0.c0.p10': 'Zahnkronen bereits ab 220 €',
  't15.r3.c0.p11': 'SWIFT: ESBCHR22',
};

test('all German pages have reciprocal IT/HR links, German navigation and real destinations', async ({
  page,
  request,
}) => {
  test.setTimeout(120000);
  const destinations = new Set<string>();
  for (const entry of entries) {
    const route = germanRoute(entry.route);
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
      ['en', englishRoute(entry.route)],
      ['sl', slovenianRoute(entry.route)],
    ]);
    for (const [language, path] of doc.switches) {
      expect(doc.alternates).toContainEqual([
        language,
        `https://www.dentvitalis.com${path!.endsWith('/') ? path : path + '/'}`,
      ]);
    }
    expect(doc.alternates.some(([lang]) => lang === 'sl')).toBe(true);
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
        if (p.text.trim() && p.id !== 't8.r2.c0.p3')
          expect(normalize(doc.body), `${route}: ${p.id}`).toContain(
            normalize(corrections[p.id] ?? p.text),
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
  test(`German detail headings are readable and fit at ${width}px`, async ({
    page,
  }) => {
    test.setTimeout(90000);
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    for (const entry of localizedPageRegistry.de) {
      await page.goto(`${origin}/de/${entry.route}/`);
      const geometry = await page.locator('.detail-hero').evaluate((hero) => {
        const h1 = hero.querySelector('h1')!;
        const range = document.createRange();
        range.selectNodeContents(h1);
        return {
          photo: Boolean(hero.querySelector('.hero-photo img')),
          foreground: getComputedStyle(h1).color,
          right: range.getBoundingClientRect().right,
          viewport: innerWidth,
          overflow: document.documentElement.scrollWidth > innerWidth,
        };
      });
      expect(geometry.photo, entry.route).toBe(true);
      expect(geometry.foreground, entry.route).toBe('rgb(255, 255, 255)');
      expect(geometry.right, entry.route).toBeLessThanOrEqual(
        geometry.viewport,
      );
      expect(geometry.overflow, entry.route).toBe(false);
      if (entry.route === 'payment')
        await page.screenshot({
          path: `/tmp/dentvitalis-de-payment-${width}.png`,
        });
    }
  });
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
    if (width < 1200) await group.locator('summary > a').click();
    else await group.locator('summary > a').hover();
    await expect(group).toHaveAttribute('open', '');
    await group.locator('.dropdown-links a').nth(1).click();
    await expect(page).toHaveURL(/\/de\/fixed-implant-bridge\/?$/);
    await expect(page.locator('h1')).toContainText('Brücke');
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
