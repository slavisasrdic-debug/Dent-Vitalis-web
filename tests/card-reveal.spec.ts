import { expect, test } from '@playwright/test';

test.use({
  viewport: { width: 390, height: 844 },
  isMobile: true,
  hasTouch: true,
});

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => document.fonts.ready);
});

test('both card variants enter once with the shared heading duration and no layout movement', async ({
  page,
}) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  const cards = page.locator('.teaser-card');
  await expect(cards).toHaveCount(8);
  await expect(
    page.locator('[data-teaser-sequence][data-waiting]'),
  ).toHaveCount(0);
  for (const card of await cards.all()) {
    const result = await card.evaluate(async (element: HTMLElement) => {
      const initial = {
        top: element.offsetTop,
        height: element.offsetHeight,
        width: element.offsetWidth,
      };
      const y = scrollY + element.getBoundingClientRect().top - 320;
      scrollTo({ top: y, behavior: 'instant' });
      const frames: {
        opacity: number;
        translateY: number;
        duration?: number | string | CSSNumericValue;
        delay?: number;
      }[] = [];
      const start = performance.now();
      while (performance.now() - start < 1200) {
        await new Promise(requestAnimationFrame);
        const style = getComputedStyle(element);
        const timing = element.getAnimations()[0]?.effect?.getTiming();
        frames.push({
          opacity: Number(style.opacity),
          translateY: new DOMMatrixReadOnly(
            style.transform === 'none' ? undefined : style.transform,
          ).m42,
          ...(timing ? { duration: timing.duration, delay: timing.delay } : {}),
        });
      }
      return {
        frames,
        initial,
        final: {
          top: element.offsetTop,
          height: element.offsetHeight,
          width: element.offsetWidth,
        },
        activeAnimations: element.getAnimations().length,
      };
    });
    expect(
      result.frames.some(
        (frame) =>
          frame.opacity > 0 && frame.opacity < 1 && frame.translateY > 0,
      ),
    ).toBe(true);
    expect(
      result.frames.find((frame) => frame.duration !== undefined),
    ).toMatchObject({ duration: 1000, delay: 0 });
    expect(
      Math.max(...result.frames.map((frame) => frame.translateY)),
    ).toBeLessThanOrEqual(48);
    expect(result.frames.at(-1)).toMatchObject({ opacity: 1, translateY: 0 });
    expect(result.final).toEqual(result.initial);
    expect(result.activeAnimations).toBe(0);
  }
  await cards.first().evaluate((element) =>
    scrollTo({
      top: scrollY + element.getBoundingClientRect().top - 320,
      behavior: 'instant',
    }),
  );
  await page.waitForTimeout(100);
  expect(
    await cards.evaluateAll((elements) =>
      elements.every(
        (element) =>
          getComputedStyle(element).opacity === '1' &&
          element.getAnimations().length === 0,
      ),
    ),
  ).toBe(true);
  expect(errors).toEqual([]);
});

test('cards wait until their top passes the 15 percent viewport inset, with no time delay', async ({
  page,
}) => {
  const card = page.locator('.teaser-card').first();
  // The card is already inside the real viewport but has not reached the inset.
  await card.evaluate((element) =>
    scrollTo({
      top: scrollY + element.getBoundingClientRect().top - innerHeight * 0.9,
      behavior: 'instant',
    }),
  );
  await page.waitForTimeout(150);
  await expect(card).toHaveAttribute('data-waiting', '');
  expect(await card.evaluate((element) => element.getAnimations().length)).toBe(
    0,
  );
  await card.evaluate((element) =>
    scrollTo({
      top: scrollY + element.getBoundingClientRect().top - innerHeight * 0.84,
      behavior: 'instant',
    }),
  );
  await expect(card).not.toHaveAttribute('data-waiting');
  const timing = await card.evaluate((element) =>
    element.getAnimations()[0]?.effect?.getTiming(),
  );
  expect(timing).toMatchObject({ duration: 1000, delay: 0 });
  await expect(card).toHaveCSS('opacity', '1');
});

test('large headings and cards read the same single duration token', async ({
  page,
}) => {
  const heading = page.locator('.section-heading h2').first();
  await heading.evaluate((element) =>
    scrollTo({
      top: scrollY + element.getBoundingClientRect().top - 300,
      behavior: 'instant',
    }),
  );
  await expect(heading).not.toHaveAttribute('data-waiting');
  const headingDuration = await heading.evaluate(
    (element) => element.getAnimations()[0]?.effect?.getTiming().duration,
  );
  const card = page.locator('.teaser-card').first();
  await card.evaluate((element) =>
    scrollTo({
      top: scrollY + element.getBoundingClientRect().top - 300,
      behavior: 'instant',
    }),
  );
  await expect(card).not.toHaveAttribute('data-waiting');
  const cardDuration = await card.evaluate(
    (element) => element.getAnimations()[0]?.effect?.getTiming().duration,
  );
  const sharedDuration = await page.evaluate(() =>
    parseFloat(
      getComputedStyle(document.documentElement).getPropertyValue(
        '--reveal-duration',
      ),
    ),
  );
  expect(headingDuration).toBe(1000);
  expect(cardDuration).toBe(sharedDuration);
  expect(cardDuration).toBe(headingDuration);
});

test('changing only CSS tokens controls timing, trigger, distance and easing for both profiles', async ({
  page,
}) => {
  await page.route('http://127.0.0.1:4321/', async (route) => {
    const response = await route.fetch();
    const html = await response.text();
    // Test-only overrides mimic editing the central motion block. No TS or props change.
    await route.fulfill({
      response,
      body: html.replace(
        '</head>',
        `<style>:root {
      --reveal-duration: .72s !important;
      --reveal-distance: 64px !important;
      --reveal-delay: .08s !important;
      --reveal-offset: 20 !important;
      --reveal-easing: ease-in-out !important;
      --reveal-card-distance: 24px !important;
      --reveal-card-delay: 0s !important;
      --reveal-card-offset: 25 !important;
      --reveal-card-easing: linear !important;
    }</style></head>`,
      ),
    });
  });
  await page.reload();
  for (const profile of [
    {
      selector: '.section-heading h2',
      before: 0.85,
      after: 0.78,
      distance: 64,
      delay: 80,
      easing: 'ease-in-out',
    },
    {
      selector: '.teaser-card',
      before: 0.8,
      after: 0.73,
      distance: 24,
      delay: 0,
      easing: 'linear',
    },
  ]) {
    const element = page.locator(profile.selector).first();
    await element.evaluate(
      (node, ratio) =>
        scrollTo({
          top: scrollY + node.getBoundingClientRect().top - innerHeight * ratio,
          behavior: 'instant',
        }),
      profile.before,
    );
    await page.waitForTimeout(100);
    await expect(element).toHaveAttribute('data-waiting', '');
    await element.evaluate(
      (node, ratio) =>
        scrollTo({
          top: scrollY + node.getBoundingClientRect().top - innerHeight * ratio,
          behavior: 'instant',
        }),
      profile.after,
    );
    await expect(element).not.toHaveAttribute('data-waiting');
    const animation = await element.evaluate((node) => {
      const effect = node.getAnimations()[0]?.effect as
        KeyframeEffect | undefined;
      return {
        timing: effect?.getTiming(),
        transform: effect?.getKeyframes()[0]?.transform,
      };
    });
    expect(animation.timing).toMatchObject({
      duration: 720,
      delay: profile.delay,
      easing: profile.easing,
    });
    expect(animation.transform).toBe(`translateY(${profile.distance}px)`);
    await expect(element).toHaveCSS('opacity', '1');
  }
});

test('mobile-only profile follows breakpoint changes without altering desktop cards', async ({
  page,
}) => {
  for (const width of [
    390, 479, 480, 767, 768, 990, 991, 992, 993, 1440, 844, 390,
  ]) {
    await page.setViewportSize({ width, height: 844 });
    await expect(page.locator('.teaser-card[data-waiting]')).toHaveCount(
      width <= 991 ? 8 : 0,
    );
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBeLessThanOrEqual(width);
    if (width >= 992) {
      expect(
        await page
          .locator('.teaser-card')
          .evaluateAll((elements) =>
            elements.every(
              (element) =>
                getComputedStyle(element).opacity === '1' &&
                getComputedStyle(element).transform === 'none',
            ),
          ),
      ).toBe(true);
    }
  }
});

test('reduced motion reveals pending cards and cancels a running entrance', async ({
  page,
}) => {
  const card = page.locator('.teaser-card').first();
  await card.evaluate((element) =>
    scrollTo({
      top: scrollY + element.getBoundingClientRect().top - 320,
      behavior: 'instant',
    }),
  );
  await page.waitForFunction(
    () => document.querySelector('.teaser-card')!.getAnimations().length > 0,
  );
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(page.locator('.teaser-card[data-waiting]')).toHaveCount(0);
  await expect(card).toHaveCSS('opacity', '1');
  await expect(card).toHaveCSS('transform', 'none');
  expect(await card.evaluate((element) => element.getAnimations().length)).toBe(
    0,
  );
  await page.reload();
  await expect(page.locator('[data-waiting]')).toHaveCount(0);
});

test('keyboard focus immediately exposes a pending card', async ({ page }) => {
  const card = page.locator('.teaser-card').first();
  await card.locator('a').first().focus();
  await expect(card).not.toHaveAttribute('data-waiting');
  await expect(card).toHaveCSS('opacity', '1');
  expect(await card.evaluate((element) => element.getAnimations().length)).toBe(
    0,
  );
});

test('cards remain visible without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
  });
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:4321/');
  await expect(page.locator('.teaser-card')).toHaveCount(8);
  await expect(page.locator('[data-waiting]')).toHaveCount(0);
  for (const card of await page.locator('.teaser-card').all()) {
    await expect(card).toHaveCSS('opacity', '1');
    await expect(card).toHaveCSS('transform', 'none');
  }
  await context.close();
});

test('fast scrolling, viewport height changes and returning to cards never leave blank content', async ({
  page,
}) => {
  await page.evaluate(() =>
    scrollTo({ top: document.body.scrollHeight, behavior: 'instant' }),
  );
  const cards = page.locator('.teaser-card');
  for (const index of [6, 2, 7, 0]) {
    await cards.nth(index).evaluate((element) =>
      scrollTo({
        top: scrollY + element.getBoundingClientRect().top - 300,
        behavior: 'instant',
      }),
    );
    await page.waitForTimeout(30);
  }
  await page.setViewportSize({ width: 390, height: 720 });
  await expect(cards.first()).toHaveCSS('opacity', '1');
  await expect(cards.first()).toHaveCSS('transform', 'none');
  await expect(cards.first()).not.toHaveAttribute('data-waiting');
  await page.setViewportSize({ width: 992, height: 720 });
  await expect(page.locator('.teaser-card[data-waiting]')).toHaveCount(0);
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(cards.first()).toHaveCSS('opacity', '1');
});
