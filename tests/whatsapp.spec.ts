import { expect, test } from '@playwright/test';
import source from '../data/whatsapp-copy-20261004.json' with { type: 'json' };

for (const route of ['/hr', '/si']) {
  test(`Legacy Zendesk cannot cover native WhatsApp: ${route}`, async ({
    page,
  }) => {
    await page.goto(route);
    const calls = await page.evaluate(async () => {
      const commands: unknown[][] = [];
      const chatWindow = window as typeof window & {
        zE?: (...command: unknown[]) => void;
      };
      chatWindow.zE = (...command) => commands.push(command);
      // Mirror the public launcher and include an unrelated iframe to prove
      // that neither CookieYes nor other embedded services are hidden.
      for (const id of ['launcher', 'webWidget', 'unrelated-embed']) {
        const frame = document.createElement('iframe');
        frame.id = id;
        Object.assign(frame.style, {
          position: 'fixed',
          right: '0',
          bottom: '0',
          width: '400px',
          height: '160px',
          zIndex: '999999',
        });
        document.body.append(frame);
      }
      await new Promise((resolve) => setTimeout(resolve, 20));
      return commands;
    });
    expect(calls).toContainEqual(['webWidget', 'hide']);
    await expect(page.locator('iframe#launcher')).toBeHidden();
    await expect(page.locator('iframe#webWidget')).toBeHidden();
    await expect(page.locator('iframe#unrelated-embed')).toBeVisible();
    await page
      .locator('iframe#unrelated-embed')
      .evaluate((frame) => frame.remove());
    for (const width of [1440, 390]) {
      await page.setViewportSize({ width, height: 900 });
      await page.locator('.chat-toggle').click();
      await expect(page.locator('.chat-panel')).toBeVisible();
      await page.keyboard.press('Escape');
      await expect(page.locator('.chat-panel')).toBeHidden();
    }
  });
}

for (const route of [
  '/',
  '/hr/',
  '/de/',
  '/en/',
  '/si/',
  '/faq/',
  '/hr/faq/',
]) {
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
    const lang = (await page
      .locator('html')
      .getAttribute('lang')) as keyof typeof source.locales;
    const expected = source.locales[lang];
    await expect(page.locator('[data-chat-widget]')).toHaveCount(1);
    await expect(panel).toBeHidden();
    for (const [width, height] of [
      [320, 568],
      [390, 844],
      [1440, 900],
    ]) {
      await page.setViewportSize({ width: width!, height: height! });
      await toggle.click();
      await expect(panel).toBeVisible();
      await expect(toggle).toHaveAttribute('aria-expanded', 'true');
      await expect(panel.locator('[data-chat-close]')).toBeFocused();
      await expect(panel.locator('.chat-person strong')).toHaveText(
        expected.team,
      );
      await expect(panel.locator('.chat-person small')).toHaveText(
        expected.responseTime,
      );
      expect((await panel.locator('.chat-bubble').innerText()).trim()).toBe(
        expected.message,
      );
      const brand = panel.locator('[data-brand-mark]');
      await expect(brand).toHaveAttribute('aria-label', 'DentVitalis');
      await expect(brand.locator('path,polygon')).toHaveCount(2);
      await expect(panel.locator('img[alt="Jelena"]')).toHaveCount(0);
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
      const actions = {
        it: 'Avvia chat su WhatsApp',
        hr: 'Razgovaraj putem WhatsAppa',
        de: 'Über WhatsApp sprechen',
        en: 'Chat on WhatsApp',
        sl: 'Pogovor prek WhatsAppa',
      };
      await expect(link).toHaveText(actions[lang]);
      if (
        process.env.DV_WHATSAPP_SCREENSHOTS &&
        ((route === '/' && width === 1440) ||
          (route === '/hr/' && width === 390))
      ) {
        await page.screenshot({
          path: `/tmp/dentvitalis-whatsapp-brand-${lang}-${width}.png`,
        });
      }
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
