import { expect, test, type Locator } from '@playwright/test';

// A text-only translation must not change link hitboxes, line breaks or rows.
const geometry = (dropdown: Locator) =>
  dropdown.evaluate((element) => {
    const rect = (node: Element) => node.getBoundingClientRect().toJSON();
    return {
      panel: rect(element.querySelector('.dropdown-panel')!),
      links: [...element.querySelectorAll('.dropdown-links a')].map((link) => {
        const range = document.createRange();
        range.selectNodeContents(link.querySelector('.link-label')!);
        return {
          hitbox: rect(link),
          lines: [...range.getClientRects()].map(({ y, width, height }) => ({
            y,
            // Transformed text can report floating-point noise below 0.001px.
            width: Math.round(width * 1000) / 1000,
            height,
          })),
        };
      }),
    };
  });

test.use({ contextOptions: { reducedMotion: 'reduce' } });

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => document.fonts.ready);
  await expect(page.locator('[data-nav-dropdown]')).toHaveCount(3);
});

for (const width of [
  1200, 1201, 1279, 1280, 1281, 1439, 1440, 1441, 1919, 1920, 1921, 2560,
]) {
  test(`all desktop dropdown rows stay fixed on hover and keyboard focus at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    for (const dropdown of await page.locator('[data-nav-dropdown]').all()) {
      const summary = dropdown.locator('summary');
      await summary.hover();
      await expect(dropdown).toHaveAttribute('open', '');
      const before = await geometry(dropdown);
      const links = await dropdown.locator('.dropdown-links a').all();
      for (const link of links) {
        expect(
          await link
            .locator('.line')
            .evaluate(
              (node) =>
                new DOMMatrixReadOnly(getComputedStyle(node).transform).m11,
            ),
        ).toBe(0);
      }
      for (const link of links) {
        // The old moving margin also made the pointer leave near the left edge.
        await link.hover({ position: { x: 2, y: 10 } });
        expect(await geometry(dropdown)).toEqual(before);
        await expect(link).toHaveCSS('color', 'rgb(4, 90, 114)');
        expect(
          await link
            .locator('.line')
            .evaluate(
              (node) =>
                new DOMMatrixReadOnly(getComputedStyle(node).transform).m11,
            ),
        ).toBe(1);
        expect(await link.evaluate((node) => node.matches(':hover'))).toBe(
          true,
        );
        expect(
          await link.evaluate((node) => {
            const label = node.querySelector('.link-label')!;
            const panel = node.closest('.dropdown-links')!;
            return (
              label.getBoundingClientRect().right <=
              panel.getBoundingClientRect().right
            );
          }),
        ).toBe(true);
      }
      await summary.hover();
      await summary.locator('a').focus();
      for (const link of links) {
        await page.keyboard.press('Tab');
        await expect(link).toBeFocused();
        expect(await geometry(dropdown)).toEqual(before);
        await expect(link).toHaveCSS('color', 'rgb(4, 90, 114)');
        expect(
          await link.evaluate((node) => getComputedStyle(node).outlineStyle),
        ).not.toBe('none');
      }
      await page.keyboard.press('Escape');
      await expect(dropdown).not.toHaveAttribute('open', '');
      await expect(summary).toBeFocused();
    }
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBeLessThanOrEqual(width);
  });
}

test('desktop hover moves smoothly without reflow or an unstable left-edge hitbox', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1920, height: 900 });
  const dropdown = page.locator('[data-nav-dropdown]').first();
  await dropdown.locator('summary').hover();
  const before = await geometry(dropdown);
  // Start only the interaction under test, after the stable poster has loaded.
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  const link = dropdown.locator('.dropdown-links a').first();
  await link.hover({ position: { x: 2, y: 10 } });
  const frames = await link.evaluate(async (node) => {
    const label = node.querySelector('.link-label')!;
    const line = node.querySelector('.line')!;
    const frames = [];
    const start = performance.now();
    while (performance.now() - start < 420) {
      await new Promise(requestAnimationFrame);
      const transform = getComputedStyle(label).transform;
      frames.push({
        x: new DOMMatrixReadOnly(transform === 'none' ? undefined : transform)
          .m41,
        duration: label.getAnimations()[0]?.effect?.getTiming().duration,
        lineScale: new DOMMatrixReadOnly(getComputedStyle(line).transform).m11,
        hovered: node.matches(':hover'),
        linkHeight: node.getBoundingClientRect().height,
        panelHeight: node.closest('.dropdown-panel')!.getBoundingClientRect()
          .height,
      });
    }
    return frames;
  });
  expect(frames.some((frame) => frame.x > 0 && frame.x < 20)).toBe(true);
  expect(frames.some((frame) => frame.duration === 300)).toBe(true);
  expect(
    frames.some((frame) => frame.lineScale > 0 && frame.lineScale < 1),
  ).toBe(true);
  expect(frames.every((frame) => frame.hovered)).toBe(true);
  expect(
    frames.every(
      (frame) =>
        frame.linkHeight === before.links[0]!.hitbox.height &&
        frame.panelHeight === before.panel.height,
    ),
  ).toBe(true);
  expect(frames.at(-1)?.x).toBe(20);
  expect(frames.at(-1)?.lineScale).toBe(1);
  expect(await geometry(dropdown)).toEqual(before);
  await dropdown.locator('summary').hover();
  await expect(link.locator('.link-label')).toHaveCSS('transform', 'none');
  expect(
    await link
      .locator('.line')
      .evaluate(
        (node) => new DOMMatrixReadOnly(getComputedStyle(node).transform).m11,
      ),
  ).toBe(0);
  expect(await geometry(dropdown)).toEqual(before);
  await page.mouse.move(10, 500);
  await expect(dropdown).not.toHaveAttribute('open', '');
});

test.describe('touch navigation', () => {
  test.use({ isMobile: true, hasTouch: true });
  for (const width of [
    390, 479, 480, 767, 768, 990, 991, 992, 1145, 1198, 1199,
  ]) {
    test(`mobile dropdowns wrap naturally without desktop displacement at ${width}px`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.locator('.menu-toggle').tap();
      for (const dropdown of await page.locator('[data-nav-dropdown]').all()) {
        await dropdown.locator('.dropdown-arrow').tap();
        await expect(dropdown).toHaveAttribute('open', '');
        for (const link of await dropdown.locator('.dropdown-links a').all()) {
          await link.focus();
          await expect(link.locator('.link-label')).toHaveCSS(
            'transform',
            'none',
          );
          await expect(link.locator('.line')).toBeHidden();
          expect(
            await link.evaluate((node) => {
              const label = node.querySelector('.link-label')!;
              const rect = label.getBoundingClientRect();
              return rect.left >= 0 && rect.right <= innerWidth;
            }),
          ).toBe(true);
        }
        await dropdown.locator('.dropdown-arrow').tap();
        await expect(dropdown).not.toHaveAttribute('open', '');
      }
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth),
      ).toBeLessThanOrEqual(width);
    });
  }
});

test('top-level links and language options keep their geometry on hover and focus', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1920, height: 900 });
  for (const link of await page.locator('.nav-items > .nav-link').all()) {
    const before = await link.boundingBox();
    await link.hover();
    expect(await link.boundingBox()).toEqual(before);
    await link.focus();
    expect(await link.boundingBox()).toEqual(before);
  }
  const language = page.locator('[data-language].desktop');
  const summary = language.locator('summary');
  const before = await summary.boundingBox();
  await summary.focus();
  await page.keyboard.press('Space');
  expect(await summary.boundingBox()).toEqual(before);
  for (const link of await language.locator('a').all()) {
    const before = await link.boundingBox();
    await link.hover();
    expect(await link.boundingBox()).toEqual(before);
    if ((await link.getAttribute('aria-disabled')) === 'true') {
      // Unavailable translations have no destination and are not tab stops.
      expect(await link.getAttribute('href')).toBeNull();
      continue;
    }
    await page.keyboard.press('Tab');
    await expect(link).toBeFocused();
    expect(await link.boundingBox()).toEqual(before);
  }
  await page.keyboard.press('Escape');
  await expect(summary).toBeFocused();
  await expect(language).not.toHaveAttribute('open', '');
});
