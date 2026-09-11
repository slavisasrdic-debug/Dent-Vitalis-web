import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { canonicalUrl } from '../src/content/seo-urls';
const corrections = JSON.parse(
  readFileSync('data/editorial-corrections.json', 'utf8'),
) as typeof import('../data/editorial-corrections.json');
const videoMetadata = JSON.parse(
  readFileSync('data/video-metadata.json', 'utf8'),
) as typeof import('../data/video-metadata.json');
const catalogue = JSON.parse(
  readFileSync('data/translations/hr-source.json', 'utf8'),
) as typeof import('../data/translations/hr-source.json');
const legal = JSON.parse(
  readFileSync('src/content/hr/legal.json', 'utf8'),
) as typeof import('../src/content/hr/legal.json');
const decisions = readFileSync('data/hr-routes.proposed.csv', 'utf8')
  .trim()
  .split('\n')
  .slice(1)
  .map((l) => l.split(','));
const routes = decisions
  .filter((r) => r[4] === 'approved')
  .map((r) => ({ id: r[0]!, it: r[1]!, hr: r[2]! }));
const normalize = (text: string) =>
  text.normalize('NFC').replace(/\s|\u200b|\u200c|\u200d|\ufeff/g, '');
const tableRoutes: Record<number, string> = {
  1: 'home',
  2: 'four-implant-denture',
  3: 'fixed-implant-bridge',
  4: 'whitening',
  5: 'crowns-veneers-bridges',
  6: 'specialists',
  7: 'all-in-one',
  8: 'directions',
  9: 'laboratory',
  10: 'materials',
  11: 'new-implants',
  12: 'sedation',
  13: 'first-visit',
  14: 'treatment-duration',
  15: 'payment',
  16: 'guarantees',
  17: 'accommodation',
  19: 'prices',
  20: 'testimonials',
  22: 'faq',
  23: 'faq',
  24: 'gallery',
  25: 'gallery',
  26: 'gallery',
  27: 'contact',
  28: 'contact',
  29: 'contact',
  31: 'contact',
};
test('all approved Croatian copy survives SSR, with correct language/SEO/link targets', async ({
  page,
  request,
}) => {
  test.setTimeout(90000);
  const bodies = new Map<string, string>();
  const pageLinks = new Map<string, string[]>();
  const titles = new Set<string>();
  const descriptions = new Set<string>();
  for (const route of routes) {
    const response = await request.get(route.hr);
    expect(response.status(), route.hr).toBe(200);
    const data = await page.evaluate(
      (html) => {
        const doc = new DOMParser().parseFromString(html, 'text/html');
        const meta = (name: string) =>
          doc
            .querySelector(`meta[name="${name}"],meta[property="${name}"]`)
            ?.getAttribute('content');
        const schema = JSON.parse(
          doc.querySelector('script[type="application/ld+json"]')!.textContent!,
        );
        doc
          .querySelectorAll('script,style,svg,template')
          .forEach((n) => n.remove());
        return {
          title: doc.title,
          lang: doc.documentElement.lang,
          canonical: doc
            .querySelector('link[rel=canonical]')
            ?.getAttribute('href'),
          h1: doc.querySelectorAll('h1').length,
          emptySidebars: [
            ...doc.querySelectorAll('.page-sidebar.navigation'),
          ].filter((n) => !n.querySelector('a,iframe')).length,
          body: doc.body.textContent || '',
          description: meta('description'),
          robots: meta('robots'),
          ogTitle: meta('og:title'),
          ogDescription: meta('og:description'),
          ogImage: meta('og:image'),
          schema,
          alternates: [...doc.querySelectorAll('link[hreflang]')].map((n) => [
            n.getAttribute('hreflang'),
            n.getAttribute('href'),
          ]),
          links: [...doc.querySelectorAll('a[href]')]
            .filter((n) => !n.closest('.language-menu'))
            .map((n) => n.getAttribute('href')!),
          imageAlts: [...doc.querySelectorAll('img')].map((n) =>
            n.getAttribute('alt'),
          ),
        };
      },
      await response.text(),
    );
    bodies.set(route.id, normalize(data.body));
    pageLinks.set(route.id, data.links);
    expect(data.h1, route.hr).toBe(1);
    expect(data.emptySidebars, route.hr).toBe(0);
    expect(data.lang).toBe('hr');
    expect(data.robots).toContain('noindex');
    expect(data.canonical).toBe(canonicalUrl(route.hr));
    expect(data.alternates).toEqual(
      expect.arrayContaining([
        ['it', canonicalUrl(route.it)],
        ['hr', canonicalUrl(route.hr)],
        ['x-default', 'https://www.dentvitalis.com/'],
      ]),
    );
    expect(data.alternates).toHaveLength(3);
    expect(data.ogTitle).toBe(data.title);
    expect(data.ogDescription).toBe(data.description);
    expect(data.description!.length).toBeGreaterThan(15);
    expect(data.ogImage).toBeTruthy();
    expect(new URL(data.ogImage!).pathname).toMatch(/^\/assets\//);
    const socialImage = await request.get(data.ogImage!);
    expect(socialImage.status()).toBe(200);
    expect(socialImage.headers()['content-type']).toMatch(/^image\//);
    expect(titles.has(data.title), route.hr).toBe(false);
    titles.add(data.title);
    expect(descriptions.has(data.description!), route.hr).toBe(false);
    descriptions.add(data.description!);
    expect(
      data.schema['@graph'].some(
        (n: { '@type': string }) => n['@type'] === 'Dentist',
      ),
    ).toBe(true);
    expect(JSON.stringify(data.schema)).not.toMatch(
      /AggregateRating|dateModified|reviewedBy/,
    );
    expect(
      data.imageAlts.every((alt) => alt !== null),
      route.hr,
    ).toBe(true);
    expect(data.imageAlts.filter(Boolean).join(' '), route.hr).not.toMatch(
      /\b(?:prima|dopo|paziente|dentisti|Guarda|Valutazione)\b/i,
    );
    for (const href of data.links.filter(
      (h) => h.startsWith('/') && !h.startsWith('/assets/'),
    )) {
      const path = href.split('#')[0]!;
      expect(
        routes.some((r) => r.hr === path),
        `${route.hr} links outside HR: ${href}`,
      ).toBe(true);
    }
  }
  const missing: string[] = [];
  // User-approved screenshot replaces only these two detail hero paragraphs.
  const bridgeHeroSources: Record<string, string> = {
    't3.r0.c1.p2': 't1.r3.c1.p3',
    't3.r0.c1.p4': 't1.r3.c1.p5',
  };
  const sourceParagraphs = catalogue.blocks
    .filter((b) => b.type === 'table')
    .flatMap((b) => b.rows!.flatMap((r) => r[1] ?? []));
  for (const table of catalogue.blocks.filter((b) => b.type === 'table')) {
    const id = tableRoutes[Number(table.id.slice(1))];
    if (!id) continue;
    for (const paragraph of table.rows!.flatMap((r) => r[1] ?? [])) {
      const text = normalize(
        paragraph.id === corrections.croatianCrown.sourceId
          ? corrections.croatianCrown.to
          : bridgeHeroSources[paragraph.id]
            ? sourceParagraphs.find(
                (p) => p.id === bridgeHeroSources[paragraph.id],
              )!.text
            : paragraph.text,
      );
      if (!text || /^Hrvatskine$|^Nemaprijevoda/.test(text)) continue;
      if (paragraph.id === 't8.r2.c1.p3') {
        // User-approved label replaces the visible URL, not its destination.
        expect(bodies.get(id)).toContain(normalize('Lokacija parkirališta'));
        expect(pageLinks.get(id)).toContain(text);
        continue;
      }
      if (!bodies.get(id)?.includes(text))
        missing.push(`${paragraph.id}: ${paragraph.text.slice(0, 80)}`);
    }
  }
  for (const paragraph of catalogue.blocks.filter(
    (b) =>
      b.type === 'paragraph' && +b.id.slice(1) >= 217 && +b.id.slice(1) <= 309,
  )) {
    if (
      normalize(paragraph.text!) &&
      !bodies.get('testimonials')?.includes(normalize(paragraph.text!))
    )
      missing.push(paragraph.id);
  }
  expect(missing, 'DOCX paragraphs missing from their intended page').toEqual(
    [],
  );
  for (const [i, source] of legal.entries()) {
    const sourceText = normalize(
      source.sourceText.replace(
        'Dječje Online Privacy Protection Act Compliance',
        'Online Privacy Protection Act Compliance',
      ),
    );
    const sourceTitle = normalize(source.title);
    expect(sourceText.startsWith(sourceTitle)).toBe(true);
    // DetailHero renders the source H1; the legal article itself is unchanged.
    expect(bodies.get(i === 0 ? 'privacy' : 'terms')).toContain(
      sourceText.slice(sourceTitle.length),
    );
  }
});

for (const width of [390, 1440])
  test(`HR pages render without overflow or app errors at ${width}px`, async ({
    page,
  }) => {
    test.setTimeout(90000);
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    const errors: string[] = [];
    page.on('pageerror', (e) => errors.push(e.message));
    for (const route of routes) {
      const response = await page.goto(route.hr);
      expect(response?.status()).toBe(200);
      await page.evaluate(() => document.fonts.ready);
      await expect(page.locator('main')).toBeVisible();
      await expect(
        page.locator('astro-error-overlay,vite-error-overlay'),
      ).toHaveCount(0);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth - innerWidth,
        ),
        route.hr,
      ).toBe(0);
      const ids = await page
        .locator('[id]')
        .evaluateAll((nodes) => nodes.map((n) => n.id));
      expect(new Set(ids).size, route.hr).toBe(ids.length);
    }
    expect(errors).toEqual([]);
  });

for (const width of [
  991, 992, 1145, 1199, 1200, 1201, 1279, 1280, 1281, 1439, 1440, 1441, 1920,
])
  test(`HR header fits and language switch maps equivalents at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/hr/izbjeljivanje-zubi');
    await page.evaluate(() => document.fonts.ready);
    if (width < 1200) {
      await page
        .getByRole('button', { name: 'Otvori izbornik', exact: true })
        .click();
      await expect(page.locator('.menu-toggle')).toHaveAttribute(
        'aria-expanded',
        'true',
      );
      await page.keyboard.press('Escape');
    } else {
      const rects = await page
        .locator('.brand,.site-nav,.header-actions')
        .evaluateAll((nodes) =>
          nodes.map((n) => n.getBoundingClientRect().toJSON()),
        );
      expect(rects[0]!.right).toBeLessThanOrEqual(rects[1]!.left + 1);
      const items = await page.locator('.nav-items').boundingBox();
      expect(items!.x).toBeGreaterThanOrEqual(rects[0]!.right);
      expect(items!.x + items!.width).toBeLessThanOrEqual(rects[2]!.left + 1);
      // A flex container can fit while its actual children overflow beneath CTA.
      const language = await page
        .locator('.desktop-language summary')
        .boundingBox();
      expect(language!.x + language!.width).toBeLessThanOrEqual(rects[2]!.left);
      expect(
        await page
          .locator('.nav-items')
          .evaluate((n) => n.scrollWidth - n.clientWidth),
      ).toBeLessThanOrEqual(1);
    }
    const switcher = page.locator(
      width < 1200 ? '.language.mobile' : '.desktop-language .language',
    );
    await switcher.locator('summary').click();
    await switcher.getByRole('link', { name: 'Italiano', exact: true }).click();
    await expect(page).toHaveURL(/\/prestazioni\/sbiancamento-dei-denti$/);
    await expect(page.locator('html')).toHaveAttribute('lang', 'it');
    const back = page.locator(
      width < 1200 ? '.language.mobile' : '.desktop-language .language',
    );
    await back.locator('summary').click();
    await back.getByRole('link', { name: 'Hrvatski', exact: true }).click();
    await expect(page).toHaveURL(/\/hr\/izbjeljivanje-zubi$/);
  });

test('HR gallery, FAQ, slider and inquiry dialog respond without sending a request', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const posts: string[] = [];
  page.on('request', (r) => {
    if (r.method() === 'POST') posts.push(r.url());
  });
  await page.goto('/hr/galerija');
  const pair = page.locator('[data-comparison]').first();
  await pair.getByRole('button', { name: 'Prije', exact: true }).click();
  await expect(pair.locator('input')).toHaveValue('100');
  await pair.getByRole('button', { name: 'Poslije', exact: true }).click();
  await expect(pair.locator('input')).toHaveValue('0');
  await expect(
    page.locator('[data-comparison]').nth(1).locator('input'),
  ).toHaveValue('50');
  await page.goto('/hr/faq');
  const question = page.locator('.faq-item').first();
  await question.locator('summary').click();
  await expect(question).toHaveAttribute('open', '');
  await page.goto('/hr/');
  const slider = page.locator('[data-slider]');
  await slider
    .getByRole('button', { name: 'Prikaži iskustvo pacijenta 2', exact: true })
    .click();
  await expect(slider.locator('[data-slide-to="1"]')).toHaveAttribute(
    'aria-pressed',
    'true',
  );
  await page.locator('.header-consultation .button').click();
  await expect(page.locator('[data-inquiry-dialog]')).toBeVisible();
  await expect(
    page.locator('[data-inquiry-dialog] input[name=lang]'),
  ).toHaveValue('hr');
  await page.getByRole('button', { name: 'Zatvori upit', exact: true }).click();
  expect(posts).toEqual([]);
});

test('Croatian structured data describes visible FAQs, offers, people and videos only', async ({
  page,
}) => {
  for (const path of [
    '/hr/',
    '/hr/faq',
    '/hr/proteza-na-4-implantata',
    '/hr/nasi-specijalisti',
    '/hr/iskustva-pacijenata',
  ]) {
    await page.goto(path);
    const data = await page.evaluate(() => ({
      graph: JSON.parse(
        document.querySelector('script[type="application/ld+json"]')!
          .textContent!,
      )['@graph'],
      body: document.querySelector('main')!.textContent!,
      questions: [...document.querySelectorAll('.faq-item summary')].map((n) =>
        n.textContent!.trim(),
      ),
      videos: document.querySelectorAll('[data-youtube]').length,
    }));
    const faq = data.graph.find(
      (n: { '@type': string }) => n['@type'] === 'FAQPage',
    );
    if (faq) {
      expect(faq.mainEntity.map((q: { name: string }) => q.name)).toEqual(
        data.questions,
      );
      for (const question of faq.mainEntity)
        expect(normalize(data.body)).toContain(
          normalize(question.acceptedAnswer.text),
        );
    }
    if (path.includes('proteza')) {
      const service = data.graph.find(
        (n: { '@type': string }) => n['@type'] === 'Service',
      );
      expect(service.offers.price).toBe('2990');
      expect(data.body).toContain('2.990');
    }
    if (path.includes('specijalisti')) {
      const people = data.graph.filter(
        (n: { '@type': string }) => n['@type'] === 'Person',
      );
      expect(people).toHaveLength(5);
      for (const person of people) expect(data.body).toContain(person.name);
    }
    if (path.includes('iskustva')) {
      const videos = data.graph.filter(
        (n: { '@type': string }) => n['@type'] === 'VideoObject',
      );
      expect(videos).toHaveLength(13);
      expect(data.videos).toBe(13);
      for (const video of videos) {
        const metadata = videoMetadata.videos.find((item) =>
          video['@id'].endsWith(`#video-${item.videoId}`),
        );
        expect(metadata).toBeTruthy();
        expect(video.uploadDate).toBe(metadata!.uploadDate);
      }
      await expect(page.locator('[data-youtube] iframe')).toHaveCount(0);
    }
  }
});

test('Croatian content and FAQ remain accessible without JavaScript', async ({
  browser,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 844 },
  });
  const page = await context.newPage();
  for (const path of [
    '/hr/',
    '/hr/faq',
    '/hr/galerija',
    '/hr/izbjeljivanje-zubi',
  ]) {
    await page.goto('http://127.0.0.1:4321' + path);
    await expect(page.locator('main h1')).toBeVisible();
    expect(await page.locator('main').innerText()).not.toHaveLength(0);
    if (path === '/hr/faq') {
      const first = page.locator('.faq-item').first();
      await first.locator('summary').click();
      await expect(first).toHaveAttribute('open', '');
    }
    if (path === '/hr/galerija') {
      await expect(
        page.locator('[data-comparison] input').first(),
      ).toBeDisabled();
      await expect(page.locator('[data-comparison] img').first()).toBeVisible();
    }
  }
  await context.close();
});

test('unknown routes return a real 404 and Italian-only transport has no Croatian equivalent', async ({
  page,
  request,
}) => {
  const response = await page.goto('/hr/nepostojeca-stranica-qa');
  expect(response?.status()).toBe(404);
  await expect(
    page.getByRole('heading', { name: '404', exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole('link', { name: 'Povratak na naslovnicu' }),
  ).toHaveAttribute('href', '/hr/');
  const transport = await request.get('/informazioni/trasporto');
  expect(await transport.text()).not.toContain('hreflang="hr"');
});

test('Italian footer post-treatment link reaches the existing source section', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await page
    .locator('footer')
    .getByRole('link', { name: 'Recensioni post-trattamento', exact: true })
    .click();
  await expect(page).toHaveURL(/\/testimonianze#post$/);
  await expect(page.locator('#post')).toHaveCount(1);
});
