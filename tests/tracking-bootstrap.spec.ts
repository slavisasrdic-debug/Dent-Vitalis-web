import { expect, test } from '@playwright/test';

const trackingUrl = /googletagmanager|google-analytics|cookieyes/i;

for (const path of ['/', '/hr', '/de', '/en', '/si']) {
  test(`${path} preview never loads production tracking or a separate CookieYes`, async ({
    page,
  }) => {
    const requests: string[] = [];
    page.on('request', (request) => {
      if (trackingUrl.test(request.url())) requests.push(request.url());
    });
    await page.goto(path);
    await expect(page.locator('h1')).toBeVisible();
    const bootstrap = page.locator('script[data-tracking-bootstrap]');
    await expect(bootstrap).toHaveCount(1);
    expect(await bootstrap.textContent()).toContain('GTM-K3QGWS');
    expect(await bootstrap.textContent()).not.toMatch(
      /cookieyes|cookieYesScript/i,
    );
    await expect(page.locator('script[src*="cdn-cookieyes"]')).toHaveCount(0);
    expect(requests).toEqual([]);
  });
}

for (const host of ['dentvitalis.com', 'www.dentvitalis.com']) {
  test(`${host} loads only the existing GTM, with all external traffic mocked`, async ({
    page,
    context,
    request,
  }) => {
    const source = await request.get('/');
    const html = await source.text();
    const bootstrap = html.match(
      /<script\b[^>]*data-tracking-bootstrap[^>]*>[\s\S]*?<\/script>/,
    )?.[0];
    expect(bootstrap).toBeTruthy();
    const requests: string[] = [];
    await context.route('**/*', (route) => {
      const url = route.request().url();
      if (url === `https://${host}/`)
        return route.fulfill({
          contentType: 'text/html',
          body: `<html><head><title>Isolated GTM fixture</title>${bootstrap}</head><body>Mocked tracking test</body></html>`,
        });
      requests.push(url);
      if (url === 'https://www.googletagmanager.com/gtm.js?id=GTM-K3QGWS')
        return route.fulfill({
          contentType: 'text/javascript',
          body: 'window.mockGtmLoaded = true;',
        });
      return route.abort();
    });
    await page.goto(`https://${host}/`);
    await expect(
      page.locator('script[src*="googletagmanager.com/gtm.js"]'),
    ).toHaveCount(1);
    await expect
      .poll(() =>
        page.evaluate(
          () =>
            (window as unknown as { mockGtmLoaded?: boolean }).mockGtmLoaded,
        ),
      )
      .toBe(true);
    expect(requests).toEqual([
      'https://www.googletagmanager.com/gtm.js?id=GTM-K3QGWS',
    ]);
    const events = await page.evaluate(() =>
      (window as unknown as { dataLayer: { event: string }[] }).dataLayer.map(
        (entry) => entry.event,
      ),
    );
    expect(events).toEqual(['gtm.js']);
    await expect(page.locator('script[src*="cookieyes"]')).toHaveCount(0);
  });
}
