import { expect, test } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import { resolve, sep } from 'node:path';
import {
  thankYouRoutes,
  thankYouDocuments,
  retiredThankYouRoutes,
  formSuccessRoute,
} from '../src/content/thank-you-routes';
import { canonicalUrl } from '../src/content/seo-urls';
import { pageDocument } from '../src/content/page-paths';
import data from '../data/thank-you-content.json' with { type: 'json' };

const roots = {
  it: '/',
  hr: '/hr',
  de: '/de',
  en: '/en',
  sl: '/si',
} as const;

test('all public canonical paths omit the final slash except the origin root', () => {
  for (const route of Object.values(thankYouRoutes))
    expect(canonicalUrl(route + '/?utm_source=test')).toBe(
      'https://www.dentvitalis.com' + route,
    );
  expect(canonicalUrl('/hr/cjenik?utm_source=test')).toBe(
    'https://www.dentvitalis.com/hr/cjenik',
  );
  expect(() => formSuccessRoute('unknown')).toThrow();
});

for (const [kind, route] of Object.entries(thankYouRoutes)) {
  const lang = kind as keyof typeof roots;
  const copy = data.pages[lang];
  for (const width of [390, 1440]) {
    test(`${route}: exact URL, localized confirmation and contact popup at ${width}px`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.emulateMedia({ reducedMotion: 'reduce' });
      const errors: string[] = [];
      const submissions: string[] = [];
      page.on('pageerror', (error) => errors.push(error.message));
      page.on('console', (message) => {
        if (message.type() === 'error' || message.type() === 'warning')
          errors.push(message.text());
      });
      page.on('request', (request) => {
        if (/\/(?:send|gct)(?:\?|$)/.test(request.url()))
          submissions.push(request.url());
      });
      const response = await page.goto(route + '?utm_source=qa');
      expect(response?.status()).toBe(200);
      expect(new URL(page.url()).pathname).toBe(route);
      expect(new URL(page.url()).searchParams.get('utm_source')).toBe('qa');
      await expect(page).toHaveTitle(copy.title);
      await expect(page.locator('html')).toHaveAttribute('lang', lang);
      await expect(page.locator('h1')).toHaveText(copy.heading);
      for (const line of copy.lines)
        await expect(page.locator('[data-thank-you]')).toContainText(line);
      await expect(page.locator('link[rel=canonical]')).toHaveAttribute(
        'href',
        'https://www.dentvitalis.com' + route,
      );
      await expect(page.locator('meta[name=robots]')).toHaveAttribute(
        'content',
        'noindex, nofollow',
      );
      await expect(page.locator('#contatti')).toBeHidden();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      await expect(
        page.locator('astro-error-overlay,vite-error-overlay'),
      ).toHaveCount(0);
      if (kind === 'hr' && width === 1440)
        await page.screenshot({
          path: '/tmp/dentvitalis-thank-you-desktop.png',
        });
      if (kind === 'de' && width === 390)
        await page.screenshot({
          path: '/tmp/dentvitalis-thank-you-mobile.png',
        });
      const trigger =
        width === 1440
          ? page.locator('.header-consultation [data-contact-trigger]')
          : page.locator('.mobile-contact [data-contact-trigger]');
      await trigger.click();
      await expect(page.locator('[data-inquiry-dialog]')).toBeVisible();
      await expect(
        page.locator('[data-inquiry-dialog] [data-contact-form]'),
      ).toHaveAttribute('data-success', formSuccessRoute(lang));
      await page.keyboard.press('Escape');
      await expect(page.locator('[data-inquiry-dialog]')).toBeHidden();
      await expect(page.locator('#contatti')).toBeHidden();
      expect(submissions).toEqual([]);
      expect(errors).toEqual([]);
      const hreflangs = await page
        .locator('link[rel=alternate][hreflang]:not([hreflang=x-default])')
        .evaluateAll((links) =>
          links.map((link) => link.getAttribute('hreflang')),
        );
      expect(hreflangs.sort()).toEqual(['de', 'en', 'hr', 'it', 'sl']);
    });
  }
}

for (const route of retiredThankYouRoutes) {
  test(`${route}: expired campaign is absent, not replaced with a success page`, async ({
    page,
  }) => {
    const response = await page.goto(route);
    expect(response?.status()).toBe(404);
    await expect(page.locator('[data-thank-you]')).toHaveCount(0);
  });
}

test('confirmation remains readable without JavaScript', async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  try {
    const page = await context.newPage();
    await page.goto('http://127.0.0.1:4321/hr/hvala');
    await expect(page.locator('h1')).toHaveText(data.pages.hr.heading);
    await expect(page.locator('[data-thank-you]')).toContainText(
      data.pages.hr.lines[0]!,
    );
    await page.locator('header .brand').click();
    await expect(page).toHaveURL('http://127.0.0.1:4321/hr');
  } finally {
    await context.close();
  }
});

for (const [lang, root] of Object.entries(roots)) {
  test(`${lang}: mocked successful form lands on the unchanged confirmation path`, async ({
    page,
    context,
  }) => {
    // Every request is intercepted: no live SMTP, CRM, GTM or CookieYes requests.
    const dist = resolve('dist');
    let sent = 0;
    let tokenLoads = 0;
    let failure: 'tokens' | 'delivery' | null = null;
    const pageErrors: string[] = [];
    page.on('pageerror', (error) => pageErrors.push(error.message));
    page.on('console', (message) => {
      if (
        ['error', 'warning'].includes(message.type()) &&
        !/Failed to load resource:.*\b(?:502|503)\b/.test(message.text())
      )
        pageErrors.push(message.text());
    });
    await context.route('**/*', async (route) => {
      const request = route.request();
      const url = new URL(request.url());
      if (url.hostname !== 'www.dentvitalis.com')
        return route.fulfill({ contentType: 'text/javascript', body: '' });
      if (url.pathname === '/form-tokens') {
        tokenLoads++;
        if (failure === 'tokens')
          return route.fulfill({ status: 503, json: {} });
        return route.fulfill({
          json: {
            csrf: tokenLoads === 1 ? 'fixture-initial-csrf' : 'fixture-csrf',
            gct: 'fixture-gct',
          },
        });
      }
      if (url.pathname === '/send') {
        sent++;
        expect(request.method()).toBe('POST');
        expect(request.postData()).toContain('fixture-gct');
        expect(request.postData()).toContain('name="pos"');
        expect(request.postData()).toContain('home_popup');
        expect(request.postData()).toContain('name="action"');
        if (failure === 'delivery')
          return route.fulfill({ status: 502, json: {} });
        expect(request.postData()).toContain(
          sent === 1 ? 'fixture-initial-csrf' : 'fixture-csrf',
        );
        return route.fulfill({
          json:
            sent === 1
              ? { status: 'error', message: { csrf: 'fixture-csrf' } }
              : { status: 'ok' },
        });
      }
      const path = resolve(
        dist,
        '.' +
          (thankYouDocuments[url.pathname] ??
            (!/\.[a-z0-9]+$/i.test(url.pathname)
              ? pageDocument(decodeURIComponent(url.pathname))
              : decodeURIComponent(url.pathname))),
      );
      if (!path.startsWith(dist + sep)) return route.abort();
      const extension = path.slice(path.lastIndexOf('.'));
      const contentType =
        (
          {
            '.html': 'text/html',
            '.js': 'text/javascript',
            '.css': 'text/css',
            '.svg': 'image/svg+xml',
            '.png': 'image/png',
            '.webp': 'image/webp',
            '.woff2': 'font/woff2',
            '.mp4': 'video/mp4',
            '.webm': 'video/webm',
          } as Record<string, string>
        )[extension] ?? 'application/octet-stream';
      try {
        return route.fulfill({ contentType, body: await readFile(path) });
      } catch {
        return route.fulfill({ status: 404, body: 'Fixture not found' });
      }
    });
    await page.goto('https://www.dentvitalis.com' + root);
    await page.locator('.header-consultation [data-contact-trigger]').click();
    const form = page.locator('[data-inquiry-dialog] [data-contact-form]');
    await form.locator('[name=name]').fill('QA Fixture');
    await form.locator('[name=email]').fill('qa@example.invalid');
    await form.locator('[name=phone]').fill('000000000');
    await form.locator('input[type=checkbox][name=form_agreement]').check();
    await form.locator('[data-submit]').click();
    await expect(page).toHaveURL(
      'https://www.dentvitalis.com' + formSuccessRoute(lang),
    );
    expect(tokenLoads).toBe(2);
    expect(sent).toBe(2);
    await expect(page.locator('h1')).toHaveText(
      data.pages[lang as keyof typeof roots].heading,
    );
    const approved = {
      it: 'L’invio non è stato confermato. Contattaci telefonicamente.',
      hr: 'Slanje nije potvrđeno. Molimo kontaktirajte nas telefonom.',
      de: 'Der Versand wurde nicht bestätigt. Bitte kontaktieren Sie uns telefonisch.',
      en: 'Submission could not be confirmed. Please contact us by phone.',
      sl: 'Pošiljanje ni bilo potrjeno. Prosimo, kontaktirajte nas po telefonu.',
    };
    for (const mode of ['tokens', 'delivery'] as const) {
      failure = mode;
      await page.goto('https://www.dentvitalis.com' + root);
      await page.locator('.header-consultation [data-contact-trigger]').click();
      await form.locator('[name=name]').fill('QA Fixture');
      await form.locator('[name=email]').fill('qa@example.invalid');
      await form.locator('[name=phone]').fill('000000000');
      await form.locator('input[type=checkbox][name=form_agreement]').check();
      const before = sent;
      await form.locator('[data-submit]').click();
      await expect(form.locator('[role=status]')).toHaveText(
        approved[lang as keyof typeof approved],
      );
      await expect(form.locator('[role=status]')).toBeVisible();
      expect(sent - before).toBe(mode === 'tokens' ? 0 : 1);
      await expect(form.locator('[name=email]')).toHaveValue(
        'qa@example.invalid',
      );
      await expect(form.locator('[data-submit]')).toBeEnabled();
      expect(new URL(page.url()).pathname).toBe(root);
      await expect(page.locator('h1')).toBeVisible();
      await expect(
        page.locator('astro-error-overlay,vite-error-overlay'),
      ).toHaveCount(0);
      if (lang === 'hr' && mode === 'delivery') {
        await form.locator('[role=status]').scrollIntoViewIfNeeded();
        await page.screenshot({
          path: '/tmp/dentvitalis-form-error-desktop.png',
        });
        await page.setViewportSize({ width: 390, height: 900 });
        await form.locator('[role=status]').scrollIntoViewIfNeeded();
        await page.screenshot({
          path: '/tmp/dentvitalis-form-error-mobile.png',
        });
        expect(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth,
          ),
        ).toBe(true);
      }
    }
    expect(pageErrors).toEqual([]);
  });
}
