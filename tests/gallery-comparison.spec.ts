import { test, expect, chromium, webkit } from '@playwright/test';

const url = 'http://127.0.0.1:4321/domande-e-risposte';
for (const [engine, browserType] of Object.entries({ chromium, webkit })) {
  for (const width of [1440, 390]) {
    test(`${engine} ${width}px: gallery labels, range and keyboard control independent pairs`, async () => {
      const browser = await browserType.launch();
      try {
        const page = await browser.newPage({
          viewport: { width, height: 900 },
          hasTouch: width === 390,
        });
        const errors: string[] = [];
        page.on('pageerror', (error) => errors.push(error.message));
        expect((await page.goto(url))?.status()).toBe(200);
        await expect(page).toHaveTitle(
          'Galleria dei sorrisi e dei trattamenti | DentVitalis',
        );
        await expect(page.locator('h1')).toHaveText('Galleria');
        await expect(
          page.locator('astro-error-overlay, vite-error-overlay'),
        ).toHaveCount(0);
        const pairs = page.locator('[data-comparison-ready]');
        await expect(pairs).toHaveCount(15);
        const first = pairs.first();
        const slider = first.getByRole('slider');
        await first.scrollIntoViewIfNeeded();
        await expect(slider).toHaveValue('50');
        const before = first.getByRole('button', {
          name: 'Prima',
          exact: true,
        });
        const after = first.getByRole('button', { name: 'Dopo', exact: true });
        if (width === 390) await before.tap();
        else await before.click();
        await expect(slider).toHaveValue('100');
        await expect(before).toHaveAttribute('aria-pressed', 'true');
        await expect
          .poll(() =>
            first
              .locator('.after')
              .evaluate((e) => getComputedStyle(e).clipPath),
          )
          .toBe('inset(0px 0px 0px 100%)');
        await after.focus();
        await after.press('Enter');
        await expect(slider).toHaveValue('0');
        await expect(after).toHaveAttribute('aria-pressed', 'true');
        await expect
          .poll(() =>
            first
              .locator('.after')
              .evaluate((e) => getComputedStyle(e).clipPath),
          )
          .toBe('inset(0px 0px 0px 0%)');
        await slider.focus();
        await slider.press('ArrowRight');
        await expect(slider).toHaveValue('1');
        await slider.press('End');
        await expect(slider).toHaveValue('100');
        await slider.press('Home');
        await expect(slider).toHaveValue('0');
        const box = await first.boundingBox();
        await page.mouse.move(
          box!.x + box!.width / 2,
          box!.y + box!.height / 2,
        );
        await page.mouse.down();
        await page.mouse.move(
          box!.x + box!.width * 0.8,
          box!.y + box!.height / 2,
          { steps: 10 },
        );
        await page.mouse.up();
        expect(Number(await slider.inputValue())).toBeGreaterThan(75);
        expect(Number(await slider.inputValue())).toBeLessThan(90);
        const untouched = await pairs
          .locator('input')
          .evaluateAll((es) =>
            es.slice(1).map((e) => (e as HTMLInputElement).value),
          );
        expect(untouched).toEqual(Array(14).fill('50'));
        await pairs
          .last()
          .getByRole('button', { name: 'Dopo', exact: true })
          .click();
        await expect(pairs.last().getByRole('slider')).toHaveValue('0');
        await expect(pairs.nth(1).getByRole('slider')).toHaveValue('50');
        await page.emulateMedia({ reducedMotion: 'reduce' });
        await pairs
          .last()
          .getByRole('button', { name: 'Prima', exact: true })
          .click();
        await expect(pairs.last().getByRole('slider')).toHaveValue('100');
        expect(
          await pairs
            .last()
            .locator('.after')
            .evaluate((e) => getComputedStyle(e).transitionDuration),
        ).toBe('0s');
        expect(
          await page.evaluate(
            () => document.documentElement.scrollWidth - innerWidth,
          ),
        ).toBe(0);
        expect(errors).toEqual([]);
      } finally {
        await browser.close();
      }
    });
  }
}

test('mobile horizontal touch drag adjusts a pair; vertical touch scroll remains available', async () => {
  const browser = await chromium.launch();
  try {
    const context = await browser.newContext({
      viewport: { width: 390, height: 844 },
      isMobile: true,
      hasTouch: true,
    });
    const page = await context.newPage();
    await page.goto(url);
    const root = page.locator('[data-comparison-ready]').first();
    await root.scrollIntoViewIfNeeded();
    const cdp = await context.newCDPSession(page);
    const box = (await root.boundingBox())!;
    const x = box.x + box.width / 2,
      y = box.y + box.height / 2;
    await cdp.send('Input.dispatchTouchEvent', {
      type: 'touchStart',
      touchPoints: [{ x, y }],
    });
    for (let i = 1; i <= 8; i++) {
      await cdp.send('Input.dispatchTouchEvent', {
        type: 'touchMove',
        touchPoints: [{ x: x + i * 12, y }],
      });
    }
    await cdp.send('Input.dispatchTouchEvent', {
      type: 'touchEnd',
      touchPoints: [],
    });
    expect(Number(await root.getByRole('slider').inputValue())).toBeGreaterThan(
      75,
    );
    const scrollBefore = await page.evaluate(() => scrollY);
    await cdp.send('Input.dispatchTouchEvent', {
      type: 'touchStart',
      touchPoints: [{ x, y }],
    });
    for (let i = 1; i <= 8; i++) {
      await cdp.send('Input.dispatchTouchEvent', {
        type: 'touchMove',
        touchPoints: [{ x, y: y - i * 18 }],
      });
    }
    await cdp.send('Input.dispatchTouchEvent', {
      type: 'touchEnd',
      touchPoints: [],
    });
    await expect
      .poll(() => page.evaluate(() => scrollY))
      .toBeGreaterThan(scrollBefore + 50);
  } finally {
    await browser.close();
  }
});

test('gallery remains a visible static comparison without JavaScript', async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  try {
    const page = await context.newPage();
    await page.goto(url);
    await expect(page.locator('[data-comparison]')).toHaveCount(15);
    await expect(page.locator('[data-comparison-ready]')).toHaveCount(0);
    await expect(page.locator('.comparison-range:disabled')).toHaveCount(15);
    await expect(page.locator('[data-comparison] button:disabled')).toHaveCount(
      30,
    );
    const root = page.locator('[data-comparison]').first();
    await root.scrollIntoViewIfNeeded();
    await expect(root).toBeVisible();
    expect(
      await root
        .locator('.after')
        .evaluate((e) => getComputedStyle(e).clipPath),
    ).toBe('inset(0px 0px 0px 50%)');
  } finally {
    await context.close();
  }
});
