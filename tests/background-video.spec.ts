import { expect, test, type Page } from '@playwright/test';

const videoFiles = /\/assets\/video\/.*\.(mp4|webm)(\?|$)/;
const posterFiles = /\/assets\/video\/.*_first-frame-\d+\.webp/;

async function decodedPoster(page: Page, selector: string) {
  await expect
    .poll(() =>
      page
        .locator(`${selector} img`)
        .evaluate(
          (image: HTMLImageElement) => image.complete && image.naturalWidth > 1,
        ),
    )
    .toBe(true);
}

for (const width of [390, 479, 480, 1440]) {
  test(`blue → exact responsive poster; no unready video or inactive downloads at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 844 });
    const mobile = width <= 479;
    const active = mobile ? '.mobile-video' : '.desktop-video';
    const inactive = mobile ? '.desktop-video' : '.mobile-video';
    const name = mobile ? 'DV-MObile-video01_3' : 'Dentvitalis_video-left';
    const requests: string[] = [];
    page.on('request', (request) => {
      if (posterFiles.test(request.url()) || videoFiles.test(request.url()))
        requests.push(request.url());
    });
    let release!: () => void;
    const gate = new Promise<void>((resolve) => {
      release = resolve;
    });
    page.once('close', release);
    await page.route(posterFiles, async (route) => {
      await gate;
      if (!page.isClosed()) await route.continue();
    });
    // Intentionally leave video responses pending: the visible poster must not
    // depend on a video error, canplay event, or a native video poster renderer.
    await page.route(videoFiles, () => {});
    await page.goto('/', { waitUntil: 'commit' });
    try {
      await expect(page.locator(active)).toHaveCSS(
        'background-color',
        'rgb(4, 90, 114)',
      );
      await expect(page.locator('.hero-media')).toHaveCSS(
        'background-color',
        'rgb(4, 90, 114)',
      );
      await expect(page.locator(`${active} video`)).toHaveCSS('opacity', '0');
      await expect(page.locator('video source[src]')).toHaveCount(0);
    } finally {
      release();
    }
    await decodedPoster(page, active);
    await expect
      .poll(() => requests.filter((url) => videoFiles.test(url)).length)
      .toBeGreaterThan(0);
    await expect(page.locator(`${active} img`)).toHaveCSS('opacity', '1');
    await expect(page.locator(`${active} video`)).toHaveCSS('opacity', '0');
    await expect(page.locator(active)).not.toHaveAttribute('data-video-ready');
    await expect(page.locator(`${inactive} source[src]`)).toHaveCount(0);
    expect(requests.every((url) => url.includes(name))).toBe(true);
    // The preload and <picture> must share exactly one selected image request.
    expect(requests.filter((url) => posterFiles.test(url))).toHaveLength(1);
    const geometry = await page.locator(active).evaluate((root) => {
      const image = root.querySelector('img')!;
      const video = root.querySelector('video')!;
      return {
        image: image.getBoundingClientRect().toJSON(),
        video: video.getBoundingClientRect().toJSON(),
        imageFit: getComputedStyle(image).objectFit,
        videoFit: getComputedStyle(video).objectFit,
      };
    });
    expect(geometry.image).toEqual(geometry.video);
    expect(geometry.imageFit).toBe('cover');
    expect(geometry.videoFit).toBe('cover');
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBe(width);
  });
}

test('no JavaScript still shows the first-frame photo and downloads no videos', async ({
  browser,
}) => {
  for (const width of [390, 1440]) {
    const context = await browser.newContext({
      javaScriptEnabled: false,
      viewport: { width, height: 844 },
    });
    const page = await context.newPage();
    const requests: string[] = [];
    page.on('request', (request) => {
      if (videoFiles.test(request.url())) requests.push(request.url());
    });
    await page.goto('http://127.0.0.1:4321/');
    const active = width === 390 ? '.mobile-video' : '.desktop-video';
    await decodedPoster(page, active);
    await expect(page.locator(`${active} video`)).toHaveCSS('opacity', '0');
    await expect(page.locator('video source[src]')).toHaveCount(0);
    expect(requests).toEqual([]);
    await context.close();
  }
});

test('reduced motion keeps the real poster without fetching videos', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 390, height: 844 });
  const requests: string[] = [];
  page.on('request', (request) => {
    if (videoFiles.test(request.url())) requests.push(request.url());
  });
  await page.goto('/');
  await decodedPoster(page, '.mobile-video');
  await expect(page.locator('video source[src]')).toHaveCount(0);
  await expect(page.locator('#home-title')).toHaveCSS('opacity', '1');
  expect(requests).toEqual([]);
});

test('denied autoplay and failed video preserve the photo, never a gray frame', async ({
  page,
}) => {
  await page.addInitScript(() => {
    HTMLMediaElement.prototype.play = () =>
      Promise.reject(
        new DOMException('Autoplay denied in test', 'NotAllowedError'),
      );
    // Also model denial of declarative autoplay, without invoking the decoder.
    Object.defineProperty(HTMLMediaElement.prototype, 'autoplay', {
      get: () => false,
      set: () => {},
    });
  });
  await page.route(videoFiles, (route) => route.abort());
  await page.setViewportSize({ width: 390, height: 844 });
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/');
  await decodedPoster(page, '.mobile-video');
  await expect(page.locator('.mobile-video video source[src]')).toHaveCount(2);
  await page.waitForTimeout(200);
  await expect(page.locator('.mobile-video')).not.toHaveAttribute(
    'data-video-ready',
  );
  await expect(page.locator('.mobile-video video')).toHaveCSS('opacity', '0');
  expect(errors).toEqual([]);
});

for (const width of [390, 1440]) {
  test(`real video plays only after the poster, pauses offscreen and resumes at ${width}px`, async ({
    page,
  }) => {
    test.setTimeout(45000);
    await page.setViewportSize({ width, height: 844 });
    const active = width === 390 ? '.mobile-video' : '.desktop-video';
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.goto('/');
    await decodedPoster(page, active);
    await expect(page.locator(active)).toHaveAttribute('data-video-ready', '', {
      timeout: 20000,
    });
    await expect(page.locator(`${active} video`)).toHaveCSS('opacity', '1');
    const state = await page
      .locator(`${active} video`)
      .evaluate((video: HTMLVideoElement) => ({
        paused: video.paused,
        time: video.currentTime,
        muted: video.muted,
        inline: video.playsInline,
      }));
    expect(state).toMatchObject({ paused: false, muted: true, inline: true });
    expect(state.time).toBeGreaterThan(0);
    // Isolate playback visibility from the page's smooth-scroll timing and lazy
    // content below the hero (especially in headless WebKit).
    await page.evaluate(() => scrollTo({ top: 2000, behavior: 'instant' }));
    await expect
      .poll(() =>
        page
          .locator(`${active} video`)
          .evaluate((video) => video.getBoundingClientRect().bottom),
      )
      .toBeLessThan(0);
    await expect
      .poll(() =>
        page
          .locator(`${active} video`)
          .evaluate((video: HTMLVideoElement) => video.paused),
      )
      .toBe(true);
    await expect(page.locator(`${active} video`)).not.toHaveAttribute(
      'autoplay',
    );
    await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }));
    await expect
      .poll(() =>
        page
          .locator(`${active} video`)
          .evaluate((video: HTMLVideoElement) => video.paused),
      )
      .toBe(false);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await expect
      .poll(() =>
        page
          .locator(`${active} video`)
          .evaluate((video: HTMLVideoElement) => video.paused),
      )
      .toBe(true);
    expect(errors).toEqual([]);
  });
}

test('a queued decoded frame enforces reduced motion before its change listener arrives', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 844 });
  await page.addInitScript(() => {
    const state = {
      hold: false,
      forceMotion: undefined as boolean | undefined,
      frame: undefined as (() => void) | undefined,
    };
    Object.assign(window, { __lateVideoFrame: state });
    const nativeMedia = window.matchMedia.bind(window);
    window.matchMedia = (query) => {
      const media = nativeMedia(query);
      if (query === '(prefers-reduced-motion:reduce)') {
        // Model policy changing before event delivery independently of each
        // engine's cache for an existing MediaQueryList during emulation.
        Object.defineProperty(media, 'matches', {
          get: () => state.forceMotion ?? nativeMedia(query).matches,
        });
        const listen = media.addEventListener.bind(media);
        media.addEventListener = ((
          type: string,
          listener: EventListenerOrEventListenerObject,
          options?: AddEventListenerOptions | boolean,
        ) => {
          listen(
            type,
            (event: Event) => {
              if (state.hold && type === 'change') return;
              if (typeof listener === 'function') listener.call(media, event);
              else listener.handleEvent(event);
            },
            options,
          );
        }) as typeof media.addEventListener;
      }
      return media;
    };
    const nativeFrame = HTMLVideoElement.prototype.requestVideoFrameCallback;
    HTMLVideoElement.prototype.requestVideoFrameCallback = function (callback) {
      return nativeFrame.call(this, (now, metadata) => {
        if (state.hold) state.frame = () => callback(now, metadata);
        else callback(now, metadata);
      });
    };
  });
  await page.goto('/');
  const video = page.locator('.desktop-video video');
  await expect(page.locator('.desktop-video')).toHaveAttribute(
    'data-video-ready',
    '',
    { timeout: 20000 },
  );
  await page.evaluate(() => scrollTo({ top: 2000, behavior: 'instant' }));
  await expect
    .poll(() => video.evaluate((v: HTMLVideoElement) => v.paused))
    .toBe(true);
  await page.evaluate(() => {
    const state = (window as unknown as { __lateVideoFrame: { hold: boolean } })
      .__lateVideoFrame;
    state.hold = true;
    scrollTo({ top: 0, behavior: 'instant' });
  });
  await page.waitForFunction(
    () =>
      !!(window as unknown as { __lateVideoFrame: { frame?: () => void } })
        .__lateVideoFrame.frame,
  );
  await page.emulateMedia({ reducedMotion: 'reduce' });
  // WebKit may resolve the emulation command before recalculating media state.
  // Deliver the held frame only once the new preference actually exists.
  await page.waitForFunction(
    () => matchMedia('(prefers-reduced-motion:reduce)').matches,
  );
  await page.evaluate(() => {
    const state = (
      window as unknown as {
        __lateVideoFrame: { forceMotion: boolean; frame: () => void };
      }
    ).__lateVideoFrame;
    state.forceMotion = true;
    state.frame();
  });
  await expect
    .poll(() => video.evaluate((v: HTMLVideoElement) => v.paused))
    .toBe(true);
  await expect(video).not.toHaveAttribute('autoplay');
});
