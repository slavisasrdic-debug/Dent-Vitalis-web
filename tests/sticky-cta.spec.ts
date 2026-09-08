import { expect, test } from '@playwright/test';
import { readFileSync } from 'node:fs';

const pages: { route: string }[] = JSON.parse(
  readFileSync('src/content/inner-pages-it.json', 'utf8'),
);
const contentSelector = '.mobile-contact .button > :is(svg, .label)';
test.use({ viewport: { width: 390, height: 844 } });

test('two one-second pulses, five-second rest and fade-in first frame', async ({
  page,
}) => {
  await page.goto('/faq');
  const result = await page.locator('.mobile-contact').evaluate((root) => {
    const link = root.querySelector('.button')!;
    const children = [...link.children];
    const animations = children.map((child) => {
      const animation = child.getAnimations()[0];
      if (!animation?.effect) throw new Error('Missing sticky CTA animation');
      return animation;
    });
    const timing = animations.map((animation) => {
      animation.pause();
      return animation.effect!.getTiming();
    });
    const samples = [
      0, 250, 500, 750, 1000, 1250, 1500, 2500, 5000, 6500, 6750, 7000, 7250,
      7500,
    ].map((time) => {
      animations.forEach((animation) => {
        animation.currentTime = time;
      });
      return {
        time,
        opacity: children.map((child) =>
          Number(getComputedStyle(child).opacity),
        ),
        background: getComputedStyle(link).backgroundColor,
        box: link.getBoundingClientRect().toJSON(),
      };
    });
    return {
      timing: timing.map((t) => ({
        duration: t.duration,
        delay: t.delay,
        infinite: t.iterations === Infinity,
      })),
      samples,
    };
  });
  expect(result.timing).toEqual([
    { duration: 7000, delay: 0, infinite: true },
    { duration: 7000, delay: 0, infinite: true },
  ]);
  const expected = [
    0.12, 0.56, 1, 0.56, 0.12, 0.56, 1, 1, 1, 1, 0.56, 0.12, 0.56, 1,
  ];
  result.samples.forEach((sample, index) => {
    for (const opacity of sample.opacity)
      expect(opacity).toBeCloseTo(expected[index]!, 2);
    expect(sample.box).toEqual(result.samples[0]!.box);
    expect(sample.background).toBe('rgb(4, 90, 114)');
  });
});

test('real playback progresses smoothly and holds fully visible for five seconds', async ({
  page,
}) => {
  await page.goto('/faq');
  const samples = await page
    .locator('.mobile-contact .label')
    .evaluate(async (element) => {
      const animation = element.getAnimations()[0];
      if (!animation) throw new Error('Missing sticky CTA animation');
      animation.currentTime = 0;
      await animation.ready;
      const samples: { time: number; opacity: number }[] = [];
      return await new Promise<typeof samples>((resolve) => {
        const sample = () => {
          const time = Number(animation.currentTime);
          samples.push({
            time,
            opacity: Number(getComputedStyle(element).opacity),
          });
          if (time >= 7100) resolve(samples);
          else requestAnimationFrame(sample);
        };
        sample();
      });
    });
  for (const [start, end, minimum, maximum] of [
    [0, 100, 0.12, 0.22],
    [450, 550, 0.95, 1],
    [950, 1050, 0.12, 0.17],
    [1450, 1550, 0.95, 1],
    [1550, 6450, 0.999, 1],
    [6950, 7050, 0.12, 0.17],
  ] as const) {
    const interval = samples.filter((s) => s.time >= start && s.time <= end);
    expect(interval.length).toBeGreaterThan(0);
    expect(
      interval.every((s) => s.opacity >= minimum && s.opacity <= maximum),
    ).toBe(true);
  }
});

test('all 28 routes share the mobile-only animation and stable breakpoint', async ({
  page,
}) => {
  test.setTimeout(120000);
  for (const route of ['/', ...pages.map((p) => p.route)]) {
    await page.setViewportSize({ width: 390, height: 844 });
    // The sticky CSS is ready at DOMContentLoaded; unrelated lazy images/maps
    // must not turn this shared-component check into a full media load audit.
    const response = await page.goto(route, { waitUntil: 'domcontentloaded' });
    expect(response?.status(), route).toBe(200);
    await expect(page.locator('.mobile-contact')).toHaveCount(1);
    await expect(page.locator('.mobile-contact')).toBeVisible();
    expect(
      await page
        .locator(contentSelector)
        .evaluateAll((elements) =>
          elements.map((e) => e.getAnimations().length),
        ),
      route,
    ).toEqual([1, 1]);
    expect(
      await page
        .locator('.header-consultation .label')
        .evaluate((e) => e.getAnimations().length),
      route,
    ).toBe(0);
    for (const width of [990, 991, 992, 993, 1440]) {
      await page.setViewportSize({ width, height: 844 });
      expect(
        await page.locator('.mobile-contact').isVisible(),
        `${route} at ${width}`,
      ).toBe(width <= 991);
      expect(
        await page
          .locator(contentSelector)
          .evaluateAll((elements) =>
            elements.map((e) => e.getAnimations().length),
          ),
      ).toEqual(width <= 991 ? [1, 1] : [0, 0]);
    }
  }
});

test('focus keeps the label readable, click opens the form and no inquiry is sent', async ({
  page,
}) => {
  await page.goto('/');
  const submitted: string[] = [];
  page.on('request', (request) => {
    if (request.method() === 'POST') submitted.push(request.url());
  });
  const button = page.locator('.mobile-contact .button');
  await button.focus();
  await expect(button.locator('.label')).toHaveCSS('opacity', '1');
  expect(
    await button.locator('.label').evaluate((e) => e.getAnimations().length),
  ).toBe(0);
  await page.keyboard.press('Enter');
  await expect(page.locator('[data-inquiry-dialog]')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(button).toBeFocused();
  await button.click();
  await expect(page.locator('[data-inquiry-dialog]')).toBeVisible();
  expect(submitted).toEqual([]);
});

test('reduced motion from startup and a live preference change both stop blinking', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/faq');
  for (const child of await page.locator(contentSelector).all()) {
    await expect(child).toHaveCSS('opacity', '1');
    expect(await child.evaluate((e) => e.getAnimations().length)).toBe(0);
  }
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await expect
    .poll(() =>
      page
        .locator('.mobile-contact .label')
        .evaluate((e) => e.getAnimations().length),
    )
    .toBe(1);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(page.locator('.mobile-contact .label')).toHaveCSS(
    'opacity',
    '1',
  );
  expect(
    await page
      .locator('.mobile-contact .label')
      .evaluate((e) => e.getAnimations().length),
  ).toBe(0);
});

test('no JavaScript keeps the contact link working; extra instances have no shared state', async ({
  browser,
  page,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    reducedMotion: 'reduce',
    viewport: { width: 390, height: 844 },
  });
  const noJs = await context.newPage();
  await noJs.goto('http://127.0.0.1:4321/faq');
  await expect(noJs.locator('.mobile-contact .label')).toHaveCSS(
    'opacity',
    '1',
  );
  await noJs.locator('.mobile-contact .button').click();
  await expect(noJs).toHaveURL(/#contatti$/);
  await context.close();
  await page.goto('/faq');
  await page.locator('.mobile-contact').evaluate((root) => {
    const clone = root.cloneNode(true) as HTMLElement;
    clone.classList.add('qa-second-cta');
    clone.style.bottom = '70px';
    root.after(clone);
  });
  await page.locator('.qa-second-cta .button').focus();
  expect(
    await page
      .locator(contentSelector)
      .evaluateAll((elements) => elements.map((e) => e.getAnimations().length)),
  ).toEqual([1, 1, 0, 0]);
});
