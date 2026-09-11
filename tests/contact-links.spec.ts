import { expect, test } from '@playwright/test';
import { readdirSync } from 'node:fs';
import { contactLinks } from '../src/content/contact-links';

test('contact tokenization is literal and excludes dates and identifiers', () => {
  for (const text of [
    'www.dentvitalis.com\u200b',
    'info@dentvitalis.com',
    '+38551371064',
    'Nazovi +385 51 688 380.',
    '800 174 206',
    'https://example.com/path?a=1&b=2.',
  ]) {
    const parts = contactLinks(text);
    expect(
      parts
        .map((p) =>
          p.kind === 'text'
            ? p.text
            : p.kind === 'link'
              ? p.children
                  .map((c) => (c.kind === 'text' ? c.text : ''))
                  .join('')
              : '',
        )
        .join(''),
    ).toBe(text);
    expect(parts.filter((p) => p.kind === 'link')).toHaveLength(1);
  }
  for (const text of [
    'OIB 39977041464',
    '24/02/2013',
    '2.990 €',
    '51000 Rijeka',
    '2025–2026',
    'dentiumeu.com.',
  ])
    expect(contactLinks(text).some((p) => p.kind === 'link')).toBe(false);
});

test('all IT/HR routes have no unlinked contact literals or nested anchors', async ({
  page,
  request,
}) => {
  const routes = readdirSync('dist', { recursive: true })
    .filter((f) => String(f).endsWith('index.html'))
    .map((f) => '/' + String(f).replace(/index.html$/, ''));
  expect(routes).toHaveLength(55);
  for (const route of routes) {
    const response = await request.get(route);
    expect(response.status(), route).toBe(200);
    const missing = await page.evaluate(
      (html) => {
        const doc = new DOMParser().parseFromString(html, 'text/html');
        const walker = doc.createTreeWalker(doc.body, NodeFilter.SHOW_TEXT);
        const found: string[] = [];
        let node;
        while ((node = walker.nextNode())) {
          if (node.parentElement?.closest('a,script,style,select,svg,textarea'))
            continue;
          if (
            /@|https?:\/\/|\b[\w-]+\.(?:com|hr|org|net|eu|it)\b|\+\d[\d ()-]{6,}|\b800[\s\d]{6,}/.test(
              (node.textContent || '').replace(/\bdentiumeu\.com\b/g, ''),
            )
          )
            found.push(node.textContent || '');
        }
        return found;
      },
      await response.text(),
    );
    expect(missing, route).toEqual([]);
  }
});

test('privacy contacts work without JavaScript and wrap on mobile', async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  for (const route of [
    '/informativa-sulla-privacy/',
    '/hr/polica-privatnosti/',
  ]) {
    await page.goto(`http://127.0.0.1:4321${route}`, {
      waitUntil: 'domcontentloaded',
    });
    await expect(page.locator('main h1')).toBeVisible();
    await expect(
      page.locator('astro-error-overlay,vite-error-overlay'),
    ).toHaveCount(0);
    for (const width of [320, 390, 820, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      expect(
        await page.evaluate(
          () =>
            document.documentElement.scrollWidth -
            document.documentElement.clientWidth,
        ),
      ).toBe(0);
    }
    const email = page
      .locator('.editorial-copy a[href="mailto:info@dentvitalis.com"]')
      .first();
    await email.focus();
    await expect(email).toBeFocused();
    if (route.startsWith('/informativa')) {
      await expect(
        page.locator('.editorial-copy a[href="tel:+38551371064"]'),
      ).toHaveText('+38551371064');
      await expect(page.locator('.editorial-copy a[href="/"]')).toHaveText(
        'www.dentvitalis.com',
      );
    }
  }
  expect(errors).toEqual([]);
  await context.close();
});

test('contact link keyboard activation is native', async ({ page }) => {
  await page.goto('/informativa-sulla-privacy/');
  for (const href of ['mailto:info@dentvitalis.com', 'tel:+38551371064', '/']) {
    const link = page.locator(`.editorial-copy a[href="${href}"]`).first();
    await link.evaluate((a) =>
      a.addEventListener('click', (e) => {
        e.preventDefault();
        a.setAttribute('data-activated', 'true');
      }),
    );
    await link.focus();
    await page.keyboard.press('Enter');
    await expect(link).toHaveAttribute('data-activated', 'true');
  }
});
