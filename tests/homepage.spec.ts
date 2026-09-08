import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => document.fonts.ready);
});

test('Italian preview has truthful language/SEO and local media', async ({
  page,
}) => {
  await expect(page.locator('html')).toHaveAttribute('lang', 'it');
  await expect(page.locator('h1')).toHaveCount(1);
  await expect(page.locator('link[rel=canonical]')).toHaveAttribute(
    'href',
    'https://www.dentvitalis.com/',
  );
  await expect(page.locator('meta[name=robots]')).toHaveAttribute(
    'content',
    'noindex, nofollow',
  );
  expect(
    await page
      .locator('link[hreflang]')
      .evaluateAll((es) => es.map((e) => e.getAttribute('hreflang'))),
  ).toEqual(['it', 'hr', 'x-default']);
  await expect(
    page.locator('iframe,script[src*=webflow],script[src*=jquery]'),
  ).toHaveCount(0);
  expect(
    await page
      .locator('img')
      .evaluateAll((es) =>
        es.every((e) => e.getAttribute('src')?.startsWith('/assets/')),
      ),
  ).toBe(true);
  const ids = await page
    .locator('[id]')
    .evaluateAll((es) => es.map((e) => e.id));
  expect(new Set(ids).size).toBe(ids.length);
});

test('desktop dropdown and language menu support keyboard and escape', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  const dropdown = page.locator('[data-nav-dropdown]').first();
  await dropdown.locator('summary').focus();
  await page.keyboard.press('Enter');
  await expect(dropdown).toHaveAttribute('open', '');
  await page.keyboard.press('Escape');
  await expect(dropdown).not.toHaveAttribute('open', '');
  const language = page.locator('[data-language].desktop');
  await language.locator('summary').focus();
  await page.keyboard.press('Space');
  await expect(language).toHaveAttribute('open', '');
  await expect(language.locator('a[lang=sl]')).toHaveAttribute(
    'aria-disabled',
    'true',
  );
  await expect(language.locator('a[lang=hr]')).toHaveAttribute('href', '/hr/');
  await page.keyboard.press('Escape');
  await expect(language).not.toHaveAttribute('open', '');
});

test('mobile menu opens, closes and reconciles the desktop breakpoint', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 900 });
  const toggle = page.locator('.menu-toggle');
  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  await expect(page.locator('.site-nav')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(toggle).toBeFocused();
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await toggle.click();
  await page.setViewportSize({ width: 1200, height: 900 });
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await expect(toggle).toBeHidden();
});

test('FAQ opens natively and slider cycles without autoplay', async ({
  page,
}) => {
  const faq = page.locator('.faq-item').first();
  await faq.locator('summary').focus();
  await page.keyboard.press('Enter');
  await expect(faq).toHaveAttribute('open', '');
  await expect(faq.locator('.answer')).toBeVisible();
  const slider = page.locator('[data-slider]');
  await slider.locator('.next').click();
  await expect(slider.locator('[data-slide-to="1"]')).toHaveAttribute(
    'aria-pressed',
    'true',
  );
  await slider.locator('[data-slide-to="1"]').focus();
  await page.keyboard.press('ArrowRight');
  await expect(slider.locator('[data-slide-to="2"]')).toHaveAttribute(
    'aria-pressed',
    'true',
  );
  await slider.locator('.next').click();
  await expect(slider.locator('[data-slide-to="0"]')).toHaveAttribute(
    'aria-pressed',
    'true',
  );
  await page.waitForTimeout(1200);
  await expect(slider.locator('[data-slide-to="0"]')).toHaveAttribute(
    'aria-pressed',
    'true',
  );
});

test('slider supports horizontal touch gestures', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 900 });
  const slider = page.locator('[data-slider]');
  await slider.dispatchEvent('touchstart', {
    touches: [{ identifier: 1, clientX: 300, clientY: 400 }],
  });
  await slider.dispatchEvent('touchend', {
    changedTouches: [{ identifier: 1, clientX: 120, clientY: 410 }],
  });
  await expect(slider.locator('[data-slide-to="1"]')).toHaveAttribute(
    'aria-pressed',
    'true',
  );
});

test('modal reuses one form and never sends an inquiry', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  const submitted: string[] = [];
  page.on('request', (request) => {
    if (request.method() !== 'GET') submitted.push(request.url());
  });
  const trigger = page.locator('.header-consultation a');
  await trigger.click();
  const dialog = page.locator('[data-inquiry-dialog]');
  await expect(dialog).toBeVisible();
  await expect(page.locator('[data-contact-form]')).toHaveCount(1);
  await dialog.locator('[name=name]').fill('Local QA');
  await dialog.locator('[name=email]').fill('qa@example.invalid');
  await dialog.locator('[name=form_agreement]').check();
  await dialog.locator('[data-submit]').click();
  await expect(dialog.locator('[role=status]')).toContainText(
    'Nessun messaggio è stato inviato',
  );
  expect(submitted).toEqual([]);
  await expect(dialog.locator('[name=form_placement]')).toHaveValue(
    'home_popup',
  );
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
  await expect(page.locator('[data-inline-form-host] [name=name]')).toHaveValue(
    'Local QA',
  );
});

test('upload validates local type/size and WhatsApp never uses a placeholder', async ({
  page,
}) => {
  const file = page.locator('input[type=file]');
  await file.setInputFiles({
    name: 'unsupported.txt',
    mimeType: 'text/plain',
    buffer: Buffer.from('local only'),
  });
  expect(
    await file.evaluate((e) => (e as HTMLInputElement).validationMessage),
  ).toContain('PDF');
  await file.setInputFiles({
    name: 'oversize.png',
    mimeType: 'image/png',
    buffer: Buffer.alloc(8 * 1024 * 1024 + 1),
  });
  expect(
    await file.evaluate((e) => (e as HTMLInputElement).validationMessage),
  ).toContain('8 MB');
  await page.locator('.chat-toggle').click();
  await expect(page.locator('.chat-panel')).toBeVisible();
  await expect(page.locator('.chat-action button')).toBeDisabled();
  expect(await page.content()).not.toContain('+ADDNUMBERHERE');
});

test('all requested breakpoint boundaries avoid horizontal overflow and console errors', async ({
  page,
}) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  for (const width of [
    358, 359, 360, 390, 478, 479, 480, 766, 767, 768, 769, 990, 991, 992, 993,
    1200, 1279, 1280, 1281, 1439, 1440, 1441, 1919, 1920, 1921,
  ]) {
    await page.setViewportSize({ width, height: 900 });
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
      `overflow at ${width}`,
    ).toBeLessThanOrEqual(width);
  }
  expect(errors).toEqual([]);
});

test('without JavaScript content, all reviews, navigation and FAQ remain available', async ({
  browser,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 900 },
  });
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:4321/');
  await expect(page.locator('.site-nav')).toBeVisible();
  for (const slide of await page.locator('.slide').all())
    await expect(slide).toBeVisible();
  await page.locator('.faq-item summary').first().click();
  await expect(page.locator('.faq-item .answer').first()).toBeVisible();
  expect(await page.locator('[data-waiting]').count()).toBe(0);
  await expect(page.locator('[data-submit]')).toBeDisabled();
  await context.close();
});

test('reduced motion leaves content visible and videos paused', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.reload();
  await expect(page.locator('[data-waiting]')).toHaveCount(0);
  expect(
    await page
      .locator('video')
      .evaluateAll((es) =>
        es.every((video) => (video as HTMLVideoElement).paused),
      ),
  ).toBe(true);
});

test('initial load and all local images are free of console/network errors', async ({
  page,
}) => {
  const errors: string[] = [];
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('response', (response) => {
    if (response.status() >= 400)
      errors.push(`${response.status()} ${response.url()}`);
  });
  await page.reload({ waitUntil: 'networkidle' });
  const broken = await page.evaluate(async () => {
    document.querySelectorAll('img').forEach((img) => (img.loading = 'eager'));
    await Promise.all(
      [...document.images].map((img) => img.decode().catch(() => {})),
    );
    return [...document.images]
      .filter((img) => !img.naturalWidth)
      .map((img) => img.src);
  });
  expect(broken).toEqual([]);
  expect(errors).toEqual([]);
});
