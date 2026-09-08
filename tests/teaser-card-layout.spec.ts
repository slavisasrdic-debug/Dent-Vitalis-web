import { expect, test } from '@playwright/test';

test.use({ contextOptions: { reducedMotion: 'reduce' } });

for (const javaScriptEnabled of [true, false]) {
  test(`empty action row does not inflate the sedation card (JS ${javaScriptEnabled})`, async ({
    browser,
  }) => {
    const context = await browser.newContext({
      javaScriptEnabled,
      reducedMotion: 'reduce',
    });
    const page = await context.newPage();
    try {
      await page.goto('http://127.0.0.1:4321/hr/usluge');
      const card = page.locator('.teaser-card.directory').last();
      await expect(card.locator('h2')).toHaveText('Svjesna sedacija');
      await expect(card.locator('.card-bottom')).toHaveCount(0);
      await expect(card.locator('.price, .arrow')).toHaveCount(0);
      for (const width of [
        320, 390, 479, 480, 498, 767, 768, 991, 992, 1440, 1920,
      ]) {
        await page.setViewportSize({ width, height: 900 });
        const geometry = await card.evaluate((element) => {
          const style = getComputedStyle(element);
          const copy = element.querySelector('.copy')!;
          const description = element.querySelector('.description')!;
          return {
            height: element.getBoundingClientRect().height,
            contentHeight: copy.getBoundingClientRect().height,
            padding:
              parseFloat(style.paddingTop) + parseFloat(style.paddingBottom),
            belowDescription:
              element.getBoundingClientRect().bottom -
              description.getBoundingClientRect().bottom,
            expectedBelow:
              parseFloat(style.paddingBottom) +
              parseFloat(getComputedStyle(description).marginBottom),
            overflow: document.documentElement.scrollWidth - innerWidth,
          };
        });
        expect(geometry.height, `${width}px natural height`).toBeCloseTo(
          geometry.contentHeight + geometry.padding,
          1,
        );
        expect(
          geometry.belowDescription,
          `${width}px bottom space`,
        ).toBeCloseTo(geometry.expectedBelow, 1);
        expect(geometry.overflow).toBe(0);
      }
      const link = card.locator('h2 a');
      const target = await link.getAttribute('href');
      await link.focus();
      await expect(link).toBeFocused();
      await page.keyboard.press('Enter');
      await expect(page).toHaveURL(`http://127.0.0.1:4321${target}`);
    } finally {
      await context.close();
    }
  });
}

test('all shared card consumers keep real footer content and layout', async ({
  page,
}) => {
  test.setTimeout(90000);
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  const routes = new Set([
    '/',
    '/hr/',
    '/prestazioni-dentali',
    '/hr/usluge',
    '/chi-siamo',
    '/hr/o-nama',
    '/informazioni-per-pazienti',
    '/hr/informacije-za-pacijente',
  ]);
  for (const directory of ['/prestazioni-dentali', '/hr/usluge']) {
    await page.goto(directory);
    const links = await page
      .locator('.teaser-card.directory h2 a')
      .evaluateAll((elements) =>
        elements.map((element) => element.getAttribute('href')!),
      );
    for (const link of links) routes.add(link);
  }
  expect(routes.size).toBe(18);
  for (const route of routes) {
    expect((await page.goto(route))?.status(), route).toBe(200);
    await expect(page.locator('main h1')).toHaveCount(1);
    await expect(
      page.locator('astro-error-overlay, vite-error-overlay'),
    ).toHaveCount(0);
    for (const width of [390, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      const cards = await page.locator('.teaser-card').evaluateAll((elements) =>
        elements.map((card) => {
          const bottom = card.querySelector('.card-bottom');
          const content =
            bottom?.textContent?.trim() || bottom?.querySelector('a');
          return {
            emptyFooter: !!bottom && !content,
            aboutHasDescription:
              !card.classList.contains('about') ||
              !!bottom?.querySelector('.description'),
            clipped: card.scrollWidth > card.clientWidth,
          };
        }),
      );
      expect(cards.length, route).toBeGreaterThan(0);
      for (const card of cards) {
        expect(card.emptyFooter, route).toBe(false);
        expect(card.aboutHasDescription, route).toBe(true);
        expect(card.clipped, `${route} ${width}px`).toBe(false);
      }
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth - innerWidth,
        ),
        route,
      ).toBe(0);
    }
    if (route === '/prestazioni-dentali') {
      const sedation = page.locator('.teaser-card.directory').last();
      await expect(sedation.locator('.price')).toHaveText(
        'Contattaci e scopri come puoi ottenere questo servizio gratuitamente.',
      );
      await expect(sedation.locator('.arrow-spacer')).toHaveCount(1);
      await expect(sedation.locator('.arrow svg')).toHaveCount(0);
    }
  }
  expect(errors).toEqual([]);
});
