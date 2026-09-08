import { expect, test } from '@playwright/test';

test.use({
  viewport: { width: 390, height: 700 },
  isMobile: true,
  hasTouch: true,
});

test('hero benefits enter as one card using the shared trigger, timing and distance', async ({
  page,
}) => {
  await page.goto('/');
  await page.evaluate(() => document.fonts.ready);
  const card = page.locator('.benefits-card');
  await expect(card).toHaveAttribute('data-reveal', 'card');
  await expect(card).toHaveAttribute('data-reveal-media', 'mobile');
  await expect(card.locator('[data-reveal]')).toHaveCount(0);
  await expect(card.locator('li')).toHaveCount(5);
  await card.evaluate((element) =>
    scrollTo({
      top: scrollY + element.getBoundingClientRect().top - innerHeight * 0.9,
      behavior: 'instant',
    }),
  );
  await page.waitForTimeout(100);
  await expect(card).toHaveAttribute('data-waiting', '');
  const result = await card.evaluate(async (element: HTMLElement) => {
    const geometry = () => ({
      top: element.offsetTop,
      width: element.offsetWidth,
      height: element.offsetHeight,
    });
    const before = geometry();
    scrollTo({
      top: scrollY + element.getBoundingClientRect().top - 250,
      behavior: 'instant',
    });
    const frames = [];
    const start = performance.now();
    while (performance.now() - start < 1200) {
      await new Promise(requestAnimationFrame);
      const style = getComputedStyle(element);
      const timing = element.getAnimations()[0]?.effect?.getTiming();
      frames.push({
        opacity: Number(style.opacity),
        y: new DOMMatrixReadOnly(
          style.transform === 'none' ? undefined : style.transform,
        ).m42,
        duration: timing?.duration,
        delay: timing?.delay,
      });
    }
    return {
      before,
      after: geometry(),
      frames,
      animations: element.getAnimations().length,
    };
  });
  expect(
    result.frames.some(
      (frame) => frame.opacity > 0 && frame.opacity < 1 && frame.y > 0,
    ),
  ).toBe(true);
  expect(
    result.frames.find((frame) => frame.duration !== undefined),
  ).toMatchObject({ duration: 1000, delay: 0 });
  expect(
    Math.max(...result.frames.map((frame) => frame.y)),
  ).toBeLessThanOrEqual(48);
  expect(result.frames.at(-1)).toMatchObject({ opacity: 1, y: 0 });
  expect(result.after).toEqual(result.before);
  expect(result.animations).toBe(0);
  await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }));
  await card.scrollIntoViewIfNeeded();
  await expect(card).toHaveCSS('opacity', '1');
  expect(await card.evaluate((element) => element.getAnimations().length)).toBe(
    0,
  );
});

test('benefits card keeps its existing mobile/tablet visibility and never animates on desktop', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 700 });
  await page.goto('/');
  const card = page.locator('.benefits-card');
  for (const width of [1440, 993, 992, 991, 990, 768, 767, 480, 479, 390]) {
    await page.setViewportSize({ width, height: 700 });
    await expect(page.locator('.mobile-benefits')).toHaveCSS(
      'display',
      width <= 991 ? 'block' : 'none',
    );
    if (width >= 992) {
      await expect(card).not.toHaveAttribute('data-waiting');
      expect(
        await card.evaluate((element) => element.getAnimations().length),
      ).toBe(0);
    }
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBeLessThanOrEqual(width);
  }
});

test('keyboard focus and reduced motion expose the benefits and CTA immediately', async ({
  page,
}) => {
  await page.goto('/');
  const card = page.locator('.benefits-card');
  await expect(card).toHaveAttribute('data-waiting', '');
  await card.locator('a').focus();
  await expect(card).toHaveCSS('opacity', '1');
  await expect(card).toHaveCSS('transform', 'none');
  await expect(card.locator('a')).toBeFocused();
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.reload();
  await expect(card).toHaveCSS('opacity', '1');
  await expect(card).not.toHaveAttribute('data-waiting');
  expect(await card.evaluate((element) => element.getAnimations().length)).toBe(
    0,
  );
});

test('benefits and CTA remain visible without JavaScript', async ({
  browser,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
  });
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:4321/');
  const card = page.locator('.benefits-card');
  await expect(card).toHaveCSS('opacity', '1');
  await expect(card).toHaveCSS('transform', 'none');
  await expect(card.locator('li')).toHaveCount(5);
  await expect(card.locator('a')).toBeVisible();
  await context.close();
});
