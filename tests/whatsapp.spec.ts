import { expect, test } from '@playwright/test';
import { whatsappWidgetId, whatsappWidgets } from '../data/whatsapp-widgets';
import { blockElfsight } from './helpers/elfsight';

test.beforeEach(async ({ page }) => blockElfsight(page));

test('only the five owner-approved widget IDs are mapped; unknown languages fail', () => {
  expect(whatsappWidgets).toEqual({
    it: '97dc04b8-23e7-4eef-8c47-449554cf098f',
    hr: 'dbe233ee-6fca-45db-81da-30ab0413a3b6',
    de: '72199004-e373-4537-9de3-0fa41d4e27ea',
    en: '47c668f9-630d-4579-9ff0-0ae419db8879',
    sl: 'c0e50881-1c15-433d-a012-18c1b3d36fcb',
  });
  expect(() => whatsappWidgetId('si')).toThrow('No approved WhatsApp widget');
});

for (const [path, lang] of [
  ['/', 'it'],
  ['/hr', 'hr'],
  ['/de', 'de'],
  ['/en', 'en'],
  ['/si', 'sl'],
  ['/faq', 'it'],
  ['/hr/faq', 'hr'],
  ['/grazie', 'it'],
] as const) {
  test(`one localized Elfsight embed, no native duplicate and independent form: ${path}`, async ({
    page,
  }) => {
    const errors: string[] = [];
    const platformRequests: string[] = [];
    const posts: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    page.on('request', (request) => {
      if (request.url() === 'https://elfsightcdn.com/platform.js')
        platformRequests.push(request.url());
      if (request.method() === 'POST') posts.push(request.url());
    });
    const response = await page.goto(path, { waitUntil: 'domcontentloaded' });
    expect(response?.status()).toBe(200);
    await expect(page.locator('html')).toHaveAttribute('lang', lang);
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('[data-whatsapp-embed]')).toHaveCount(1);
    await expect(page.locator('[data-whatsapp-embed]')).toHaveClass(
      `elfsight-app-${whatsappWidgets[lang]}`,
    );
    await expect(page.locator('[data-whatsapp-embed]')).toHaveAttribute(
      'data-elfsight-app-lazy',
      '',
    );
    await expect(
      page.locator('script[src="https://elfsightcdn.com/platform.js"]'),
    ).toHaveCount(1);
    await expect(
      page.locator('.chat-toggle, .chat-panel, [data-chat-widget]'),
    ).toHaveCount(0);
    await expect(
      page.locator('astro-error-overlay, vite-error-overlay'),
    ).toHaveCount(0);
    for (const width of [1440, 390]) {
      await page.setViewportSize({ width, height: 844 });
      const trigger = page.locator(
        width <= 991
          ? '.mobile-contact [data-contact-trigger]'
          : 'header [data-contact-trigger]',
      );
      await trigger.click();
      const dialog = page.locator('[data-inquiry-dialog]');
      await expect(dialog).toBeVisible();
      await expect(dialog.locator('input[name=lang]')).toHaveValue(lang);
      await page.keyboard.press('Escape');
      await expect(dialog).toBeHidden();
      await expect(trigger).toBeFocused();
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth),
      ).toBeLessThanOrEqual(width);
    }
    expect(platformRequests).toHaveLength(1);
    expect(errors).toEqual([]);
    expect(posts).toEqual([]);
  });
}

for (const route of ['/hr', '/si']) {
  test(`legacy guard hides Zendesk only, not Elfsight or other embeds: ${route}`, async ({
    page,
  }) => {
    await page.goto(route);
    const calls = await page.evaluate(async () => {
      const commands: unknown[][] = [];
      (window as typeof window & { zE?: (...command: unknown[]) => void }).zE =
        (...command) => commands.push(command);
      for (const id of ['launcher', 'webWidget', 'unrelated-embed']) {
        const frame = document.createElement('iframe');
        frame.id = id;
        document.body.append(frame);
      }
      await new Promise((resolve) => setTimeout(resolve, 20));
      return commands;
    });
    expect(calls).toContainEqual(['webWidget', 'hide']);
    await expect(page.locator('iframe#launcher')).toBeHidden();
    await expect(page.locator('iframe#webWidget')).toBeHidden();
    await expect(page.locator('iframe#unrelated-embed')).toBeVisible();
    await expect(page.locator('[data-whatsapp-embed]')).toHaveCount(1);
  });
}

for (const path of ['/', '/hr', '/de', '/en', '/si']) {
  test(`no-JS direct WhatsApp fallback is above the mobile CTA: ${path}`, async ({
    browser,
  }) => {
    const context = await browser.newContext({
      javaScriptEnabled: false,
      viewport: { width: 390, height: 844 },
    });
    const page = await context.newPage();
    await page.goto('http://127.0.0.1:4321' + path);
    const link = page.locator('a.whatsapp-nojs');
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute('href', 'https://wa.me/385911100523');
    const rect = await link.boundingBox();
    const sticky = await page.locator('.mobile-contact').boundingBox();
    expect(rect!.y + rect!.height).toBeLessThan(sticky!.y);
    await context.close();
  });
}
