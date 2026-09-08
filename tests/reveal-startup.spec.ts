import { expect, test, type Page } from '@playwright/test';

declare global {
  interface Window {
    __revealFrames: number[];
  }
}

test.beforeEach(async ({ page }) => {
  // Keep posters, but isolate reveal startup from native video decoder startup.
  // Live video behavior is covered separately by homepage/video browser checks.
  await page.route('http://127.0.0.1:4321/', async (route) => {
    const response = await route.fetch();
    const html = await response.text();
    await route.fulfill({
      response,
      body: html.replace(
        /<source\b[^>]*\btype="video\/(?:mp4|webm)"[^>]*>/g,
        '',
      ),
    });
  });
});

async function holdRevealModule(page: Page) {
  let release!: () => void;
  const gate = new Promise<void>((resolve) => {
    release = resolve;
  });
  await page.route('**/src/scripts/reveal.ts*', async (route) => {
    await gate;
    if (!page.isClosed()) await route.continue();
  });
  page.once('close', release);
  await page.addInitScript(() => {
    window.__revealFrames = [];
    const sample = () => {
      const hero = document.querySelector('#home-title');
      if (hero && getComputedStyle(hero).fontFamily.includes('Montserrat')) {
        window.__revealFrames.push(Number(getComputedStyle(hero).opacity));
      }
      if (performance.now() < 8000) requestAnimationFrame(sample);
    };
    requestAnimationFrame(sample);
  });
  await page.goto('/', { waitUntil: 'commit' });
  await expect(page.locator('body')).toHaveCSS('font-family', /Montserrat/);
  await expect(page.locator('#home-title')).toBeAttached();
  return release;
}

async function expectNoVisibleThenHiddenFlash(page: Page) {
  const frames = await page.evaluate(() => window.__revealFrames);
  expect(frames.length).toBeGreaterThan(2);
  const drops = frames.filter(
    (opacity, index) => index && opacity + 0.001 < frames[index - 1]!,
  );
  expect(drops).toEqual([]);
}

for (const width of [390, 1440]) {
  test(`all reveals start prepared before the deferred module at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 844 });
    const release = await holdRevealModule(page);
    try {
      await expect(page.locator('html')).toHaveAttribute(
        'data-reveal-boot',
        'pending',
      );
      const pending = await page
        .locator('[data-reveal]')
        .evaluateAll((elements) =>
          elements.map((element) => ({
            media: element.getAttribute('data-reveal-media'),
            opacity: getComputedStyle(element).opacity,
            ready: element.hasAttribute('data-reveal-ready'),
          })),
        );
      expect(pending.length).toBeGreaterThan(20);
      for (const element of pending) {
        const inactive = element.media === (width < 992 ? 'desktop' : 'mobile');
        expect(element.ready).toBe(false);
        expect(element.opacity).toBe(inactive ? '1' : '0');
      }
      await page.waitForTimeout(80);
    } finally {
      release();
    }
    await expect(page.locator('html')).toHaveAttribute(
      'data-reveal-boot',
      'ready',
    );
    await expect(page.locator('#home-title')).toHaveCSS('opacity', '1');
    await expectNoVisibleThenHiddenFlash(page);
  });
}

test('an initializer ahead of CSS waits for tokens without losing the pre-paint state', async ({
  page,
}) => {
  await page.route('**/reveal-css-load-gate.svg', () => {});
  const release = await holdRevealModule(page);
  try {
    await page.evaluate(() => {
      const style = document.createElement('style');
      style.textContent = ':root { --reveal-duration: initial !important; }';
      document.head.append(style);
      // Keep window.load pending, as with an outstanding production stylesheet.
      const gate = new Image();
      gate.src = '/reveal-css-load-gate.svg';
      gate.hidden = true;
      document.body.append(gate);
    });
  } finally {
    release();
  }
  await page.waitForTimeout(100);
  await expect(page.locator('html')).toHaveAttribute(
    'data-reveal-boot',
    'pending',
  );
  await expect(page.locator('#home-title')).not.toHaveAttribute(
    'data-reveal-ready',
  );
  await page.evaluate(() => {
    const stylesheet = document.createElement('link');
    stylesheet.rel = 'stylesheet';
    stylesheet.href = 'data:text/css,:root{--reveal-duration:1000ms!important}';
    document.head.append(stylesheet);
  });
  await expect(page.locator('html')).toHaveAttribute(
    'data-reveal-boot',
    'ready',
  );
  await expect(page.locator('#home-title')).toHaveCSS('opacity', '1');
  await expectNoVisibleThenHiddenFlash(page);
});

test('a late module cannot hide content after the fail-open deadline', async ({
  page,
}) => {
  const release = await holdRevealModule(page);
  try {
    await expect(page.locator('html')).toHaveAttribute(
      'data-reveal-boot',
      'off',
    );
    await expect(page.locator('#home-title')).toHaveCSS('opacity', '1');
  } finally {
    release();
  }
  await expect(page.locator('#home-title')).toHaveAttribute(
    'data-reveal-ready',
    'true',
  );
  await page.waitForTimeout(250);
  await expect(page.locator('[data-waiting]')).toHaveCount(0);
  expect(
    await page
      .locator('[data-reveal]')
      .evaluateAll((elements) =>
        elements.every(
          (element) =>
            getComputedStyle(element).opacity === '1' &&
            element.getAnimations().length === 0,
        ),
      ),
  ).toBe(true);
  await expectNoVisibleThenHiddenFlash(page);
});

test('a failed animation module cannot leave content hidden', async ({
  page,
}) => {
  await page.route('**/src/scripts/reveal.ts*', (route) => route.abort());
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('data-reveal-boot', 'off');
  await expect(page.locator('#home-title')).toHaveCSS('opacity', '1');
  await expect(page.locator('[data-waiting]')).toHaveCount(0);
});

test('focus before module loading exposes the card without a late restart', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const release = await holdRevealModule(page);
  const card = page.locator('.teaser-card').first();
  try {
    await card.locator('a').first().focus();
    await expect(page.locator('html')).toHaveAttribute(
      'data-reveal-boot',
      'off',
    );
    await expect(card).toHaveCSS('opacity', '1');
  } finally {
    release();
  }
  await expect(card).toHaveAttribute('data-reveal-ready', 'true');
  await expect(card).toHaveCSS('opacity', '1');
  expect(await card.evaluate((element) => element.getAnimations().length)).toBe(
    0,
  );
});

test('changing to reduced motion during bootstrap permanently releases the pending state', async ({
  page,
}) => {
  const release = await holdRevealModule(page);
  try {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await expect(page.locator('#home-title')).toHaveCSS('opacity', '1');
    await expect(page.locator('html')).toHaveAttribute(
      'data-reveal-boot',
      'off',
    );
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await expect(page.locator('#home-title')).toHaveCSS('opacity', '1');
  } finally {
    release();
  }
  await expect(page.locator('#home-title')).toHaveAttribute(
    'data-reveal-ready',
    'true',
  );
  await expect(page.locator('[data-waiting]')).toHaveCount(0);
});

test('a visible desktop card is not hidden again when its mobile profile activates', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  const card = page.locator('.teaser-card').first();
  await card.evaluate((element) =>
    scrollTo({
      top: scrollY + element.getBoundingClientRect().top - 240,
      behavior: 'instant',
    }),
  );
  // Ensure the new mobile position remains in view before switching the media query.
  await page.setViewportSize({ width: 991, height: 4000 });
  await expect(card).not.toHaveAttribute('data-waiting');
  await expect(card).toHaveCSS('opacity', '1');
  await expect(card).toHaveCSS('transform', 'none');
});

test('unsupported animation APIs leave the initial HTML visible', async ({
  page,
}) => {
  await page.addInitScript(() => {
    Object.defineProperty(Element.prototype, 'animate', {
      configurable: true,
      value: undefined,
    });
  });
  await page.goto('/');
  await expect(page.locator('html')).not.toHaveAttribute('data-reveal-boot');
  await expect(page.locator('#home-title')).toHaveCSS('opacity', '1');
  await expect(page.locator('[data-waiting]')).toHaveCount(0);
});
