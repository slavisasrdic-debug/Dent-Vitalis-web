import { test, expect } from '@playwright/test';
const cases = [
  { route: '/hr', width: 390 },
  { route: '/hr', width: 991 },
  { route: '/hr', width: 992 },
  { route: '/hr', width: 1440 },
  { route: '/', width: 390 },
  { route: '/en', width: 390 },
  { route: '/de', width: 390 },
  { route: '/si', width: 390 },
];
for (const item of cases)
  test(`CookieYes position only ${item.route} ${item.width}`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: item.width, height: 844 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    const errors: string[] = [],
      posts: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    page.on('request', (request) => {
      if (request.method() === 'POST') posts.push(request.url());
    });
    const response = await page.goto(item.route, { waitUntil: 'networkidle' });
    expect(response?.status()).toBe(200);
    expect(new URL(page.url()).pathname).toBe(item.route);
    await expect(page.locator('h1')).toBeVisible();
    await expect(
      page.locator('astro-error-overlay,vite-error-overlay'),
    ).toHaveCount(0);
    await expect(
      page.locator('style[data-cookieyes-mobile-position]'),
    ).toHaveCount(1);
    await expect(
      page.locator('script[src="https://elfsightcdn.com/platform.js"]'),
    ).toHaveCount(0);
    // Only a deterministic layout fixture: production CookieYes is inspected separately.
    await page.evaluate(() => {
      const style = document.createElement('style');
      style.textContent =
        '.cookie-position-fixture{position:fixed;width:40px;height:40px;left:8px;bottom:8px;z-index:2147483647;background:#0056a7}.cookie-position-fixture button{width:100%;height:100%}.cookie-position-fixture.cky-revisit-hide{display:none!important}.cookie-position-fixture.cky-revisit-bottom-right{left:auto;right:8px}';
      document.head.append(style);
      const root = document.createElement('div');
      root.className =
        'cky-btn-revisit-wrapper cky-revisit-bottom-left cookie-position-fixture';
      root.setAttribute('data-cky-tag', 'revisit-consent');
      root.style.bottom = '8px';
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = 'Cookies';
      button.addEventListener('click', () => (root.dataset.clicked = 'true'));
      root.append(button);
      document.body.append(root);
    });
    const icon = page.locator('.cookie-position-fixture');
    const bottom = await icon.evaluate((el) => getComputedStyle(el).bottom);
    const before = await page.locator('.mobile-contact').boundingBox();
    if (item.width <= 991) {
      expect(bottom).toBe('80px');
      const rect = (await icon.boundingBox())!;
      expect(before!.y - (rect.y + rect.height)).toBeGreaterThanOrEqual(20);
    } else expect(bottom).toBe('8px');
    await icon.locator('button').click();
    await expect(icon).toHaveAttribute('data-clicked', 'true');
    await icon.evaluate((el) => el.classList.add('cky-revisit-hide'));
    await expect(icon).toBeHidden();
    await icon.evaluate((el) => {
      el.classList.remove('cky-revisit-hide', 'cky-revisit-bottom-left');
      el.classList.add('cky-revisit-bottom-right');
    });
    expect(await icon.evaluate((el) => getComputedStyle(el).bottom)).toBe(
      bottom,
    );
    expect(await page.locator('.mobile-contact').boundingBox()).toEqual(before);
    const trigger = page.locator(
      item.width < 992
        ? '.mobile-contact [data-contact-trigger]'
        : 'header [data-contact-trigger]',
    );
    await trigger.click();
    await expect(page.locator('[data-inquiry-dialog]')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.locator('[data-inquiry-dialog]')).toBeHidden();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    expect(errors).toEqual([]);
    expect(posts).toEqual([]);
  });
