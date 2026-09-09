import { expect, test, type Page } from '@playwright/test';
import { readFileSync } from 'node:fs';
import italianPages from '../src/content/inner-pages-it.json' with { type: 'json' };

test.use({ contextOptions: { reducedMotion: 'reduce' } });
const routePairs = readFileSync('data/hr-routes.proposed.csv', 'utf8')
  .trim()
  .split('\n')
  .slice(1)
  .map((row) => row.split(','));
const sections = italianPages.flatMap((page) => {
  const hasAnchors =
    page.sidebar?.secondary ||
    page.sidebar?.items.some(
      (item) => item.href?.startsWith('#') && item.href !== '#',
    );
  if (!hasAnchors) return [];
  const hrRoute = routePairs.find((row) => row[1] === page.route)?.[2];
  return hrRoute ? [page.route, hrRoute] : [page.route];
});
const allRoutes = [
  '/',
  ...italianPages.map((page) => page.route),
  ...routePairs.flatMap((row) =>
    row[4] === 'approved' && row[2] ? [row[2]] : [],
  ),
];

test('every internal fragment on the whole site resolves to a real destination', async ({
  page,
  request,
  baseURL,
}) => {
  test.setTimeout(120_000);
  const documents: { route: string; html: string }[] = [];
  for (const route of allRoutes) {
    const response = await request.get(route);
    expect(response.status(), route).toBe(200);
    documents.push({ route, html: await response.text() });
  }
  const missing = await page.evaluate(
    ({ documents, baseURL }) => {
      const parsed = documents.map(({ route, html }) => ({
        route,
        doc: new DOMParser().parseFromString(html, 'text/html'),
      }));
      const normalize = (path: string) => path.replace(/\/$/, '') || '/';
      const errors: string[] = [];
      for (const { route, doc } of parsed) {
        for (const link of doc.querySelectorAll('a[href]')) {
          const url = new URL(
            link.getAttribute('href')!,
            new URL(route, baseURL),
          );
          if (
            !url.hash ||
            ![new URL(baseURL).origin, 'https://www.dentvitalis.com'].includes(
              url.origin,
            )
          )
            continue;
          const destination = parsed.find(
            (entry) => normalize(entry.route) === normalize(url.pathname),
          );
          if (
            !destination?.doc.getElementById(
              decodeURIComponent(url.hash.slice(1)),
            )
          ) {
            errors.push(`${route} → ${url.pathname}${url.hash}`);
          }
        }
      }
      return errors;
    },
    { documents, baseURL: baseURL! },
  );
  expect(missing).toEqual([]);
});

for (const width of [320, 1616]) {
  for (const lang of ['it', 'hr']) {
    test(`shared contact fragment and skip link on all ${lang} pages: ${width}px`, async ({
      page,
    }) => {
      test.setTimeout(120_000);
      await page.setViewportSize({ width, height: 1000 });
      for (const route of allRoutes.filter(
        (route) => route.startsWith('/hr') === (lang === 'hr'),
      )) {
        expect((await page.goto(`${route}#contatti`))?.status(), route).toBe(
          200,
        );
        await expectClearTarget(page, 'contatti');
        await page.locator('.skip-link').focus();
        await page.keyboard.press('Enter');
        await expect(page).toHaveURL(/#main$/);
        await expect.poll(() => page.evaluate(() => scrollY)).toBe(0);
        await expect(page.locator('h1')).toBeVisible();
      }
    });
  }
}

async function expectClearTarget(page: Page, id: string) {
  await expect
    .poll(
      async () =>
        page.evaluate((id) => {
          const target = document.getElementById(id)!;
          const visible = target.classList.contains('content-anchor')
            ? target.nextElementSibling!
            : target;
          const box = visible.getBoundingClientRect();
          const breadcrumb = document
            .querySelector('.breadcrumbs')
            ?.getBoundingClientRect();
          const header = document
            .querySelector('.site-header')!
            .getBoundingClientRect();
          const top = Math.max(0, breadcrumb?.bottom ?? header.bottom);
          const bottom = document
            .querySelector('.mobile-contact')
            ?.getBoundingClientRect();
          const bottomEdge = bottom?.height ? bottom.top : innerHeight;
          return box.top >= top + 8 && box.top < bottomEdge - 24;
        }, id),
      `${page.url()} target must be below sticky navigation`,
    )
    .toBe(true);
}

for (const width of [320, 820, 1616]) {
  for (const section of sections) {
    test(`sidebar fragments expose every target: ${section} ${width}px`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 1000 });
      const errors: string[] = [];
      page.on('pageerror', (error) => errors.push(error.message));
      expect((await page.goto(section))?.status()).toBe(200);
      await expect(page).toHaveTitle(/Dent[Vv]italis|Imperdibile/i);
      await expect(page.locator('h1')).toBeVisible();
      await expect(
        page.locator('astro-error-overlay,vite-error-overlay'),
      ).toHaveCount(0);
      const ids = await page
        .locator('.page-sidebar a[href^="#"]')
        .evaluateAll((links) =>
          links
            .map((link) => link.getAttribute('href')!.slice(1))
            .filter(Boolean),
        );
      for (const id of ids) {
        const link = page.locator(`.page-sidebar a[href="#${id}"]`);
        await link.click();
        await expect(page).toHaveURL(new RegExp(`#${id}$`));
        await expectClearTarget(page, id);
      }
      expect(errors).toEqual([]);
    });
  }
}

test('wrapped breadcrumb heights and header breakpoints update the same offset', async ({
  page,
}) => {
  await page.goto('/prestazioni/corone-faccette-ponti-e-protesi');
  for (const width of [
    320, 390, 479, 480, 767, 768, 991, 992, 1199, 1200, 1279, 1280, 1439, 1440,
    1920,
  ]) {
    await page.setViewportSize({ width, height: 1000 });
    await expect
      .poll(() =>
        page.evaluate(() => {
          const root = getComputedStyle(document.documentElement);
          const expected =
            parseFloat(root.getPropertyValue('--header-height')) +
            document.querySelector('.breadcrumbs')!.getBoundingClientRect()
              .height +
            parseFloat(root.getPropertyValue('--anchor-gap'));
          return Math.abs(parseFloat(root.scrollPaddingTop) - expected);
        }),
      )
      .toBeLessThan(0.1);
    await page.locator('.page-sidebar a[href="#corone_dentali"]').click();
    await expectClearTarget(page, 'corone_dentali');
  }
});

for (const width of [390, 1616]) {
  test(`cold fragment entry, refresh, footer link and browser history: ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto('/hr/faq/#dentvitalis');
    await expectClearTarget(page, 'dentvitalis');
    await page.reload();
    await expectClearTarget(page, 'dentvitalis');
    await page.locator('.page-sidebar a[href="#stomatologija"]').focus();
    const previousScroll = await page.evaluate(() => scrollY);
    await page.keyboard.press('Enter');
    await expectClearTarget(page, 'stomatologija');
    await page.goBack();
    await expect(page).toHaveURL(/#dentvitalis$/);
    await expect
      .poll(() => page.evaluate(() => scrollY))
      .toBeCloseTo(previousScroll, 0);
    await page.goto('/hr/');
    await page.locator('footer a[href$="#post"]').click();
    await expect(page).toHaveURL(/\/hr\/iskustva-pacijenata\/?#post$/);
    await expectClearTarget(page, 'post');
  });
}

for (const width of [390, 1616]) {
  test(`smooth scrolling and repeated sidebar clicks retain the clear heading: ${width}px`, async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.setViewportSize({ width, height: 1000 });
    await page.goto('/hr/faq/');
    for (let click = 0; click < 2; click++) {
      const link = page.locator('.page-sidebar a[href="#dentvitalis"]');
      // Bring the real control into view and finish its reveal before clicking.
      // Playwright considers opacity:0 "visible" and can click its old position.
      await link.scrollIntoViewIfNeeded();
      await expect(page.locator('.page-sidebar')).toHaveCSS('opacity', '1');
      await expect(link).toHaveCSS('opacity', '1');
      await expect(link).toHaveCSS('transform', 'none');
      await link.click();
      await expect(page).toHaveURL(/#dentvitalis$/);
      await expect
        .poll(() =>
          page.evaluate(
            () =>
              document.getElementById('dentvitalis')!.getBoundingClientRect()
                .top -
              document.querySelector('.breadcrumbs')!.getBoundingClientRect()
                .bottom,
          ),
        )
        .toBeCloseTo(16, 0);
      await expectClearTarget(page, 'dentvitalis');
    }
  });
}

for (const width of [320, 1616]) {
  test(`native fragments stay readable without JavaScript: ${width}px`, async ({
    browser,
  }) => {
    const context = await browser.newContext({
      javaScriptEnabled: false,
      viewport: { width, height: 1000 },
      reducedMotion: 'reduce',
    });
    try {
      const page = await context.newPage();
      for (const route of [
        '/hr/faq',
        '/faq',
        '/prestazioni/corone-faccette-ponti-e-protesi',
      ]) {
        await page.goto(route);
        const id = route.includes('prestazioni')
          ? 'corone_dentali'
          : 'dentvitalis';
        await page.locator(`.page-sidebar a[href="#${id}"]`).click();
        await expectClearTarget(page, id);
      }
    } finally {
      await context.close();
    }
  });
}
