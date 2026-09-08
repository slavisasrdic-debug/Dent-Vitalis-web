import { expect, test } from '@playwright/test';

test.use({ contextOptions: { reducedMotion: 'reduce' } });

for (const route of [
  '/informazioni-per-pazienti',
  '/hr/informacije-za-pacijente',
]) {
  test.describe(`touch parent navigation from ${route}`, () => {
    test.use({ hasTouch: true, isMobile: true });
    for (const width of [390, 1199, 1200, 1440]) {
      test(`first tap opens and second tap follows each parent at ${width}px`, async ({
        page,
      }) => {
        await page.setViewportSize({ width, height: 900 });
        const errors: string[] = [];
        page.on('pageerror', (error) => errors.push(error.message));
        for (let index = 0; index < 3; index++) {
          await page.goto(route);
          // Interaction tests start after the dev server's client initializer.
          await expect(page.locator('[data-header]')).toHaveAttribute(
            'data-ready',
            'true',
          );
          if (width < 1200) await page.locator('.menu-toggle').tap();
          const dropdown = page.locator('[data-nav-dropdown]').nth(index);
          const link = dropdown.locator('summary > a');
          const target = await link.getAttribute('href');
          await expect(dropdown).not.toHaveAttribute('open', '');
          await link.tap();
          await expect(page).toHaveURL(new RegExp(`${route}$`));
          await expect(dropdown).toHaveAttribute('open', '');
          await expect(
            dropdown.locator('.dropdown-links a').first(),
          ).toBeVisible();
          await expect(page.locator('[data-nav-dropdown][open]')).toHaveCount(
            1,
          );
          // The arrow always toggles, without following the parent URL.
          await dropdown.locator('.dropdown-arrow').tap();
          await expect(dropdown).not.toHaveAttribute('open', '');
          await link.tap();
          await expect(dropdown).toHaveAttribute('open', '');
          await link.tap();
          await expect(page).toHaveURL(new RegExp(`${target}$`));
        }
        expect(errors).toEqual([]);
      });
    }
  });

  test(`keyboard parent activation and child navigation remain native on ${route}`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(route);
    const dropdown = page.locator('[data-nav-dropdown]').first();
    const link = dropdown.locator('summary > a');
    await link.focus();
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(new RegExp(`${route}$`));
    await expect(dropdown).toHaveAttribute('open', '');
    await expect(link).toBeFocused();
    // Once open, a child still navigates in one activation.
    await page.keyboard.press('Tab');
    const child = dropdown.locator('.dropdown-links a').first();
    const childTarget = await child.getAttribute('href');
    await expect(child).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(new RegExp(`${childTarget}$`));

    await page.goto(route);
    const parentTarget = await link.getAttribute('href');
    await link.focus();
    await page.keyboard.press('Enter');
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(new RegExp(`${parentTarget}$`));
  });

  test(`hover-open parent follows its URL on the first click on ${route}`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    for (let index = 0; index < 3; index++) {
      await page.goto(route);
      await page.mouse.move(5, 500);
      const dropdown = page.locator('[data-nav-dropdown]').nth(index);
      const parent = dropdown.locator('summary > a');
      const target = await parent.getAttribute('href');
      await parent.hover();
      await expect(dropdown).toHaveAttribute('open', '');
      await parent.click();
      await expect(page).toHaveURL(new RegExp(`${target}$`));
    }
  });
}

test('no-JS parent remains a real direct link', async ({ browser }) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 1200, height: 900 },
  });
  const page = await context.newPage();
  await page.goto('/hr/informacije-za-pacijente');
  const parent = page.locator('[data-nav-dropdown] summary > a').first();
  const target = await parent.getAttribute('href');
  await parent.click();
  await expect(page).toHaveURL(new RegExp(`${target}$`));
  await context.close();
});
