import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { slovenianPageIds, route } from '../src/content/sl/routes';

const origin = process.env.QA_ORIGIN ?? 'http://127.0.0.1:4321';
const source = JSON.parse(
  readFileSync('data/translations/sl-source.json', 'utf8'),
) as typeof import('../data/translations/sl-source.json');
const tables: Record<string, string[]> = {
  home: ['t1'],
  'four-implant-denture': ['t2'],
  'fixed-implant-bridge': ['t3'],
  whitening: ['t4'],
  'crowns-veneers-bridges': ['t5'],
  specialists: ['t6'],
  'all-in-one': ['t7'],
  directions: ['t8'],
  laboratory: ['t9'],
  materials: ['t10'],
  'new-implants': ['t11'],
  sedation: ['t12'],
  'first-visit': ['t13'],
  'treatment-duration': ['t14'],
  payment: ['t15'],
  guarantees: ['t16'],
  accommodation: ['t17'],
  prices: ['t18'],
  testimonials: ['t19'],
  faq: ['t20', 't21'],
  gallery: ['t22', 't23', 't24'],
  contact: ['t25', 't26', 't27', 't28', 't29'],
};
const normalize = (text: string) =>
  text
    .replace(/(\d)\.(?=\d{3}\b)/g, '$1')
    .replace(/\u200d/g, '')
    .replace(/[\s\u200b•–—-]/g, '');
const overrides: Record<string, string> = {
  't3.r0.c0.p2':
    'Fiksni mostiček na zobnih vsadkih – brez omejitve števila zobnih vsadkov',
  't5.r0.c0.p10': 'Zobne krone že od 220 €',
  't15.r4.c0.p10': 'SWIFT: ESBCHR22',
};
const htmlCache = new Map<string, string>();

test('Slovenian compound headings stay within their text columns', async ({
  page,
}) => {
  test.setTimeout(90000);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const width of [390, 992, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const id of [
      'home',
      'payment',
      'crowns-veneers-bridges',
      'guarantees',
      'privacy',
    ]) {
      await page.goto(origin + route(id));
      await page.evaluate(() => document.fonts.ready);
      const out = await page.evaluate(() =>
        [...document.querySelectorAll('main h1,main h2,main h3')]
          .filter((e) => {
            if (e.closest('[aria-hidden=true]')) return false;
            const range = document.createRange();
            range.selectNodeContents(e);
            const text = range.getBoundingClientRect();
            const copy = e.matches('.detail-hero h1')
              ? e.closest('.hero-copy')
              : null;
            const parent = copy ?? e;
            const box = parent.getBoundingClientRect();
            const style = getComputedStyle(parent);
            return (
              text.right > box.right - parseFloat(style.paddingRight) + 2 ||
              text.left < box.left + parseFloat(style.paddingLeft) - 2
            );
          })
          .map((e) => e.textContent),
      );
      expect(out, `${id} ${width}`).toEqual([]);
    }
  }
});

test('all 27 Slovenian pages retain source paragraphs, local destinations and HR component inventory', async ({
  page,
  request,
}) => {
  test.setTimeout(180000);
  const missing: string[] = [];
  const paths = new Set<string>();
  for (const id of slovenianPageIds) {
    const path = route(id);
    const response = await request.get(origin + path);
    expect(response.status(), path).toBe(200);
    const html = await response.text();
    htmlCache.set(path, html);
    const data = await page.evaluate((html) => {
      const d = new DOMParser().parseFromString(html, 'text/html');
      const m = d.querySelector('main')!;
      return {
        lang: d.documentElement.lang,
        h1: m.querySelectorAll('h1').length,
        text: m.textContent ?? '',
        photos: m.querySelectorAll('.hero-photo img').length,
        sidebar: m.querySelectorAll('.page-sidebar').length,
        portraits: m.querySelectorAll('.editorial-copy img').length,
        related: m.querySelectorAll('.related-grid > *').length,
        directory: m.querySelectorAll('.teaser-card').length,
        comparisons: m.querySelectorAll('[data-comparison]').length,
        videos: m.querySelectorAll('[data-youtube]').length,
        links: [...d.querySelectorAll('a[href]')].map((a) =>
          a.getAttribute('href')!,
        ),
        nav: d.querySelector('header nav')?.textContent ?? '',
        footer: d.querySelector('footer')?.textContent ?? '',
        switches: [
          ...d.querySelectorAll('[data-language].desktop a[href]'),
        ].map((a) => a.getAttribute('lang')),
        phone: d.querySelector('input[type=tel]')?.hasAttribute('required'),
        privacy: d.querySelector('.consent a')?.getAttribute('href'),
      };
    }, html);
    expect(data.lang, path).toBe('sl');
    expect(data.h1, path).toBe(1);
    expect(data.phone, path).toBe(true);
    expect(data.privacy, path).toBe(route('privacy'));
    expect(data.switches, path).toEqual(['it', 'hr', 'de', 'en', 'sl']);
    expect(data.nav, path).toContain('Galerija');
    expect(data.nav, path).toContain('FAQ');
    expect(data.nav, path).not.toMatch(
      /Prestazioni|Informazioni|Contatti|Su di noi/,
    );
    if (!['home', 'services', 'about', 'information'].includes(id)) {
      expect(data.photos, path).toBe(1);
      expect(data.sidebar, path).toBe(1);
    }
    if (
      [
        'four-implant-denture',
        'fixed-implant-bridge',
        'whitening',
        'crowns-veneers-bridges',
        'sedation',
      ].includes(id)
    )
      expect(data.related, path).toBe(4);
    if (id === 'specialists') {
      expect(data.portraits).toBe(5);
      expect(data.links).toContain('https://doi.org/10.1111/clr.320_13042');
    }
    if (id === 'payment') {
      expect(data.portraits).toBe(1);
      expect(data.text).toContain('ESBCHR22');
      expect(data.text).not.toContain('ZABAHR2X');
    }
    if (id === 'gallery') expect(data.comparisons).toBe(15);
    if (id === 'testimonials') expect(data.videos).toBe(13);
    if (id === 'testimonials') {
      // The 21 post-treatment reviews are standalone DOCX paragraphs, not t19.
      for (const paragraph of source.blocks.filter(
        (b) =>
          b.type === 'paragraph' &&
          Number(b.id.slice(1)) >= 117 &&
          Number(b.id.slice(1)) <= 210,
      ))
        if (paragraph.text?.trim())
          expect(normalize(data.text), paragraph.id).toContain(
            normalize(paragraph.text),
          );
    }
    for (const href of data.links) {
      if (href.startsWith('/') || href.startsWith('#'))
        paths.add(new URL(href, origin + path).href);
    }
    for (const table of source.blocks.filter((b) =>
      tables[id]?.includes(b.id),
    )) {
      for (const p of table.rows!.flat(2)) {
        if (!p.text.trim()) continue;
        if (p.id === 't8.r2.c0.p3') {
          expect(data.links).toContain(
            p.text.replace(/[\u200b\u200d]/g, '').trim(),
          );
          continue;
        }
        if (p.id === 't1.r0.c0.p2') {
          expect(normalize(data.text)).toContain(
            normalize('Fiksna cena od 4.990 €'),
          );
          expect(data.text).toContain('brez omejitve števila zobnih vsadkov');
          continue;
        }
        if (
          !normalize(data.text).includes(normalize(overrides[p.id] ?? p.text))
        )
          missing.push(id + ': ' + p.id + ' ' + p.text.slice(0, 80));
      }
    }
  }
  expect(missing).toEqual([]);
  for (const href of paths) {
    const u = new URL(href);
    const result = await request.get(u.origin + u.pathname);
    expect(result.status(), href).toBe(200);
    if (u.hash) {
      const found = await page.evaluate(
        ({ html, id }) =>
          !!new DOMParser()
            .parseFromString(html, 'text/html')
            .getElementById(id),
        { html: await result.text(), id: decodeURIComponent(u.hash.slice(1)) },
      );
      expect(found, href).toBe(true);
    }
  }
});

for (const width of [390, 1440])
  test(`Slovenian rendered completeness and interactions ${width}`, async ({
    page,
  }) => {
    test.setTimeout(240000);
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    const errors: string[] = [];
    page.on('pageerror', (e) => errors.push(e.message));
    for (const id of slovenianPageIds) {
      const response = await page.goto(origin + route(id));
      expect(response?.status(), id).toBe(200);
      await page.evaluate(() => document.fonts.ready);
      await expect(page.locator('main h1')).toBeVisible();
      await expect(page.locator('astro-error-overlay')).toHaveCount(0);
      const overflow = await page.evaluate(() => ({
        page: document.documentElement.scrollWidth > innerWidth,
        elements: [
          ...document.querySelectorAll(
            'main h1, main h2, main h3, .page-sidebar, header .header-inner',
          ),
        ]
          .filter((e) => {
            if (e.closest('[aria-hidden="true"]')) return false;
            const range = document.createRange();
            range.selectNodeContents(e);
            const r = range.getBoundingClientRect();
            return r.right > innerWidth + 1 || r.left < -1;
          })
          .map((e) => e.textContent?.slice(0, 70)),
      }));
      expect.soft(overflow, id).toEqual({ page: false, elements: [] });
      if (
        [
          'home',
          'services',
          'specialists',
          'fixed-implant-bridge',
          'faq',
          'gallery',
          'payment',
          'contact',
          'politika-zasebnosti',
          'privacy',
        ].includes(id)
      )
        await page.screenshot({
          path: `/tmp/dv-sl-complete-${id}-${width}.png`,
        });
      const broken = await page
        .locator('main img[loading=eager]')
        .evaluateAll(async (imgs) => {
          await Promise.all(
            imgs.map((img) =>
              (img as HTMLImageElement).decode().catch(() => {}),
            ),
          );
          return imgs
            .filter((img) => (img as HTMLImageElement).naturalWidth === 0)
            .map((img) => img.getAttribute('src'));
        });
      expect(broken, id).toEqual([]);
    }
    await page.goto(origin + '/si/');
    if (width < 1200) await page.locator('.menu-toggle').click();
    const group = page.locator('[data-nav-dropdown]').first();
    if (width >= 1200) {
      await group.locator('summary > a').hover();
      await expect(group).toHaveAttribute('open', '');
    } else {
      await group.locator('summary > a').click();
      await expect(group).toHaveAttribute('open', '');
    }
    await group.locator('summary > a').click();
    await expect(page).toHaveURL(/\/si\/services\/?$/);
    await expect(page.locator('.menu-toggle')).toHaveAttribute(
      'aria-expanded',
      'false',
    );
    expect(
      await page.evaluate(() => getComputedStyle(document.body).overflow),
    ).not.toBe('hidden');
    await page.goto(origin + '/si/faq');
    const faq = page.locator('main details').first();
    await faq.locator('summary').click();
    await expect(faq).toHaveAttribute('open', '');
    await page.goto(origin + '/si/gallery');
    const comparison = page.locator('[data-comparison]').first();
    await expect(comparison).toBeVisible();
    const slider = comparison.locator('input[type=range]');
    await slider.focus();
    await slider.press('End');
    await expect(slider).toHaveValue('100');
    await page.goto(origin + '/si/contact');
    await page
      .locator(
        width < 992
          ? '.mobile-contact [data-contact-trigger]'
          : 'header [data-contact-trigger]',
      )
      .click();
    await expect(page.locator('dialog[open]')).toBeVisible();
    const phone = page.locator('dialog input[type=tel]');
    await expect(phone).toHaveAttribute('required', '');
    await expect(phone).toHaveAttribute('placeholder', '*Telefon:');
    expect(errors).toEqual([]);
  });
