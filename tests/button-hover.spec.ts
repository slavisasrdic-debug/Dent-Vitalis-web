import { expect, test } from '@playwright/test';

test.use({ contextOptions: { reducedMotion: 'reduce' } });

for (const route of ['/', '/hr/']) {
  for (const width of [390, 991, 992, 1440]) {
    test(`hero green hover/focus preserves the responsive CTA: ${route} ${width}px`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 950 });
      const errors: string[] = [];
      page.on('pageerror', (error) => errors.push(error.message));
      expect((await page.goto(route))?.status()).toBe(200);
      await expect(page).toHaveTitle(/Dent[Vv]italis/i);
      const hero = page.locator('.button.hero');
      const mobile = page.locator('.mobile-benefits .button');
      if (width <= 991) {
        await expect(hero).toBeHidden();
        await expect(mobile).toBeVisible();
        await expect(mobile).toHaveCSS('background-color', 'rgb(4, 90, 114)');
        await mobile.hover();
        await expect(mobile).toHaveCSS('background-color', 'rgb(5, 116, 146)');
      } else {
        await expect(hero).toBeVisible();
        await expect(mobile).toBeHidden();
        await hero.scrollIntoViewIfNeeded();
        const geometry = await hero.boundingBox();
        await expect(hero).toHaveCSS('background-color', 'rgb(175, 188, 54)');
        await hero.hover();
        await expect(hero).toHaveCSS('background-color', 'rgb(192, 205, 74)');
        await expect(hero.locator('.label')).toHaveCSS(
          'color',
          'rgb(23, 60, 70)',
        );
        await expect(hero.locator('.arrow path')).toHaveCSS(
          'stroke',
          'rgb(23, 60, 70)',
        );
        expect(await hero.boundingBox()).toEqual(geometry);
        await page.mouse.move(0, 0);
        await page.keyboard.press('Tab');
        await hero.focus();
        await expect(hero).toHaveCSS('background-color', 'rgb(192, 205, 74)');
        await expect(hero).toHaveCSS('outline-color', 'rgb(255, 255, 255)');
        await expect(hero).toHaveCSS('outline-style', 'solid');
        const href = await hero.getAttribute('href');
        await page.keyboard.press('Enter');
        await expect(page).toHaveURL(new RegExp(`${href}/?$`));
        await expect(page.locator('h1')).toBeVisible();
      }
      expect(errors).toEqual([]);
    });
  }
}

for (const width of [390, 991, 992, 1440]) {
  test(`outline buttons retain geometry and white foreground on hover/focus at ${width}px`, async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    page.on('console', (message) => {
      if (message.type() === 'error') errors.push(message.text());
    });
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.evaluate(() => document.fonts.ready);
    await expect(page).toHaveTitle(
      'DentVitalis - migliori dentisti in Croazia',
    );
    await expect(page.locator('main h1')).toBeVisible();
    await expect(
      page.locator('astro-error-overlay, vite-error-overlay'),
    ).toHaveCount(0);
    const buttons = page.locator('.button.outline');
    await expect(buttons).toHaveCount(2);
    for (const button of await buttons.all()) {
      await button.scrollIntoViewIfNeeded();
      await page.mouse.move(0, 0);
      await expect(button).toHaveCSS('background-color', 'rgb(255, 255, 255)');
      await expect(button.locator('.label')).toHaveCSS(
        'color',
        'rgb(4, 90, 114)',
      );
      const geometry = await button.boundingBox();
      await button.hover();
      await expect(button).toHaveCSS('background-color', 'rgb(5, 116, 146)');
      await expect(button.locator('.label')).toHaveCSS(
        'color',
        'rgb(255, 255, 255)',
      );
      await expect(button.locator('.arrow path')).toHaveCSS(
        'stroke',
        'rgb(255, 255, 255)',
      );
      expect(await button.boundingBox()).toEqual(geometry);
      await page.mouse.move(0, 0);
      await page.keyboard.press('Tab');
      await button.focus();
      expect(
        await button.evaluate((element) => element.matches(':focus-visible')),
      ).toBe(true);
      await expect(button.locator('.label')).toHaveCSS(
        'color',
        'rgb(255, 255, 255)',
      );
      await expect(button.locator('.arrow path')).toHaveCSS(
        'stroke',
        'rgb(255, 255, 255)',
      );
      await expect(button).toHaveCSS('outline-style', 'solid');
      await button.evaluate((element) => (element as HTMLElement).blur());
      await expect(button).toHaveCSS('background-color', 'rgb(255, 255, 255)');
    }
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBeLessThanOrEqual(width);
    await buttons.filter({ hasText: 'Prima e dopo' }).click();
    await expect(page).toHaveURL(/\/domande-e-risposte\/?$/);
    await expect(page.locator('h1')).toHaveText('Galleria');
    expect(errors).toEqual([]);
  });
}
