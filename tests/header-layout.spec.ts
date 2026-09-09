import { expect, test } from '@playwright/test';

test.use({ contextOptions: { reducedMotion: 'reduce' } });

const widths = [
  320, 390, 479, 480, 990, 991, 992, 993, 1145, 1198, 1199, 1200, 1201, 1279,
  1280, 1281, 1439, 1440, 1441, 1919, 1920, 1921, 2560,
];

for (const route of [
  '/',
  '/hr/',
  '/informazioni-per-pazienti',
  '/hr/informacije-za-pacijente',
  '/condizioni-di-utilizzo',
  '/hr/polica-privatnosti',
]) {
  test(`header spacing and typography stay legible on ${route}`, async ({
    page,
  }) => {
    test.setTimeout(60000);
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    page.on('console', (message) => {
      if (['error', 'warning'].includes(message.type()))
        errors.push(message.text());
    });
    expect((await page.goto(route))?.status()).toBe(200);
    await page.evaluate(() => document.fonts.ready);
    await expect(page).toHaveURL(new RegExp(`${route}$`));
    expect(await page.title()).not.toBe('');
    await expect(page.locator('main h1')).toBeVisible();
    await expect(
      page.locator('astro-error-overlay,vite-error-overlay'),
    ).toHaveCount(0);

    for (const width of widths) {
      await page.setViewportSize({ width, height: 900 });
      // CSS switches immediately, but the native media-query change callback
      // (which closes old menus) arrives on a frame. Do not race it with Enter.
      await page.evaluate(
        () =>
          new Promise<void>((resolve) => {
            requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
          }),
      );
      const toggle = page.locator('.menu-toggle');
      if (width < 1200) await expect(toggle).toBeVisible();
      else await expect(toggle).toBeHidden();
      if (width < 992)
        await expect(page.locator('.header-consultation')).toBeHidden();
      else await expect(page.locator('.header-consultation')).toBeVisible();

      const geometry = await page
        .locator('[data-header]')
        .evaluate((header) => {
          const brand = header.querySelector('.brand')!.getBoundingClientRect();
          const actions = header
            .querySelector('.header-actions')!
            .getBoundingClientRect();
          const nav = header.querySelector('.nav-items')!;
          const items = [...nav.children].filter(
            (item) => item.getBoundingClientRect().width > 0,
          );
          const rects = items.map((item) => item.getBoundingClientRect());
          const labels = [
            ...header.querySelectorAll(
              '.dropdown > summary,.nav-items > .nav-link',
            ),
          ];
          return {
            font: getComputedStyle(header).fontFamily,
            fontSizes: labels.map((label) => getComputedStyle(label).fontSize),
            brandLeft: brand.left,
            actionsRight: actions.right,
            groupGaps:
              innerWidth >= 1200
                ? [
                    rects[0]!.left - brand.right,
                    actions.left - rects.at(-1)!.right,
                  ]
                : [actions.left - brand.right],
            itemGaps: rects
              .slice(1)
              .map((rect, index) => rect.left - rects[index]!.right),
            overflow: nav.scrollWidth - nav.clientWidth,
            actionOverflow:
              header.querySelector('.header-actions')!.scrollWidth -
              actions.width,
            documentOverflow: document.documentElement.scrollWidth - innerWidth,
          };
        });
      expect(geometry.font, `${route} ${width}`).toContain('Montserrat');
      expect([...new Set(geometry.fontSizes)]).toEqual([
        width < 1200 ? '16px' : width < 1440 ? '14px' : '15px',
      ]);
      expect(geometry.brandLeft).toBeGreaterThanOrEqual(0);
      expect(geometry.actionsRight).toBeLessThanOrEqual(width);
      expect(
        Math.min(...geometry.groupGaps),
        `${route} ${width}`,
      ).toBeGreaterThanOrEqual(15.9);
      expect(geometry.actionOverflow).toBeLessThan(1);
      expect(geometry.documentOverflow).toBeLessThanOrEqual(0);
      if (width >= 1200) {
        expect(Math.min(...geometry.itemGaps)).toBeGreaterThanOrEqual(6);
        expect(geometry.overflow).toBeLessThanOrEqual(0);
        for (const dropdown of await page
          .locator('[data-nav-dropdown]')
          .all()) {
          await dropdown.locator('summary').focus();
          await page.keyboard.press('Enter');
          await expect(dropdown).toHaveAttribute('open', '');
          const panel = await dropdown.locator('.dropdown-links').boundingBox();
          expect(panel!.x).toBeGreaterThanOrEqual(0);
          expect(panel!.x + panel!.width).toBeLessThanOrEqual(width);
          await page.keyboard.press('Escape');
        }
      }
    }
    expect(errors).toEqual([]);
  });
}

test('tablet menu, language, contact action and resizing retain usable focus', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1199, height: 900 });
  await page.goto('/hr/informacije-za-pacijente');
  const toggle = page.locator('.menu-toggle');
  const nav = page.locator('.site-nav');
  await expect(toggle).toHaveCSS('width', '44px');
  await expect(toggle).toHaveCSS('height', '44px');
  await toggle.click();
  await expect(nav).toBeVisible();
  await expect(page.locator('body')).toHaveCSS('overflow', 'hidden');
  const summary = page.locator('[data-nav-dropdown] > summary').first();
  await summary.focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('[data-nav-dropdown][open]')).toHaveCount(1);
  await toggle.focus();
  await page.setViewportSize({ width: 1200, height: 900 });
  await expect(toggle).toBeHidden();
  await expect(summary).toBeFocused();
  await expect(page.locator('[data-header] details[open]')).toHaveCount(0);
  await expect(page.locator('body')).not.toHaveCSS('overflow', 'hidden');
  await page.setViewportSize({ width: 1199, height: 900 });
  await expect(toggle).toBeFocused();
  await expect(nav).toBeHidden();
  await toggle.click();
  await page.keyboard.press('Escape');
  await expect(toggle).toBeFocused();
  await expect(nav).toBeHidden();

  const language = page.locator('[data-language].mobile');
  await language.locator('summary').click();
  await expect(language.locator('a[lang=it]')).toHaveAttribute(
    'href',
    '/informazioni-per-pazienti',
  );
  await expect(language.locator('.language-menu')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(language.locator('summary')).toBeFocused();
  await page.locator('.header-consultation a').click();
  await expect(page.locator('[data-inquiry-dialog]')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.locator('[data-inquiry-dialog]')).toBeHidden();
});

test('collapsed navigation remains usable without JavaScript at tablet width', async ({
  browser,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 1145, height: 900 },
  });
  const page = await context.newPage();
  await page.goto('/hr/informacije-za-pacijente');
  await expect(page.locator('.menu-toggle')).toBeHidden();
  await expect(page.locator('.site-nav')).toBeVisible();
  const dropdown = page.locator('[data-nav-dropdown]').first();
  await dropdown.locator('.dropdown-arrow').click();
  await expect(dropdown.locator('.dropdown-links a').first()).toBeVisible();
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
  ).toBeLessThanOrEqual(1145);
  await context.close();
});
