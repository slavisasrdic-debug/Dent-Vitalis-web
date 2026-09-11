import { expect, test } from '@playwright/test';

for (const route of ['/', '/hr/', '/faq/', '/hr/faq/']) {
  test(`WhatsApp panel responsive and keyboard: ${route}`, async ({ page }) => {
    const errors: string[] = [];
    const external: string[] = [];
    page.on('pageerror', (e) => errors.push(e.message));
    page.on('request', (r) => {
      if (/wa.me|whatsapp|elfsight|zopim/.test(new URL(r.url()).hostname))
        external.push(r.url());
    });
    await page.goto(route, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('h1')).toBeVisible();
    const toggle = page.locator('.chat-toggle');
    const panel = page.locator('.chat-panel');
    for (const [width, height] of [
      [320, 568],
      [390, 844],
      [820, 1180],
      [844, 390],
      [991, 900],
      [992, 900],
      [1440, 900],
    ]) {
      await page.setViewportSize({ width: width!, height: height! });
      await toggle.click();
      await expect(panel).toBeVisible();
      await expect(toggle).toHaveAttribute('aria-expanded', 'true');
      await expect(panel.locator('[data-chat-close]')).toBeFocused();
      await expect(panel).toContainText(
        !route.startsWith('/hr')
          ? "posso esserti d'aiuto?"
          : 'Kako vam možemo pomoći?',
      );
      const rect = await panel.boundingBox();
      expect(rect!.x).toBeGreaterThanOrEqual(0);
      expect(rect!.y).toBeGreaterThanOrEqual(0);
      expect(rect!.x + rect!.width).toBeLessThanOrEqual(width!);
      if (width! <= 991) {
        const sticky = await page.locator('.mobile-contact').boundingBox();
        expect(rect!.y + rect!.height).toBeLessThan(sticky!.y);
      }
      const link = panel.locator('.chat-action a');
      await link.scrollIntoViewIfNeeded();
      await expect(link).toBeVisible();
      await expect(link).toHaveAttribute('href', 'https://wa.me/385911100523');
      await page.keyboard.press('Escape');
      await expect(panel).toBeHidden();
      await expect(toggle).toBeFocused();
    }
    await expect(page.locator('.badge,.avatar')).toHaveCount(0);
    await expect(
      page.locator('astro-error-overlay,vite-error-overlay'),
    ).toHaveCount(0);
    expect(external).toEqual([]);
    expect(errors).toEqual([]);
    await toggle.press('Enter');
    const link = panel.locator('.chat-action a');
    await link.evaluate((a) =>
      a.addEventListener('click', (e) => {
        e.preventDefault();
        a.setAttribute('data-clicked', 'true');
      }),
    );
    await link.focus();
    await link.press('Enter');
    await expect(link).toHaveAttribute('data-clicked', 'true');
    await page.locator('h1').click();
    await expect(panel).toBeHidden();
  });
  test(`WhatsApp works without JavaScript: ${route}`, async ({ browser }) => {
    const context = await browser.newContext({
      javaScriptEnabled: false,
      viewport: { width: 390, height: 844 },
    });
    const page = await context.newPage();
    await page.goto('http://127.0.0.1:4321' + route);
    await expect(page.locator('a.chat-toggle')).toBeVisible();
    await expect(page.locator('a.chat-toggle')).toHaveAttribute(
      'href',
      'https://wa.me/385911100523',
    );
    await expect(page.locator('button.chat-toggle')).toBeHidden();
    await context.close();
  });
}
