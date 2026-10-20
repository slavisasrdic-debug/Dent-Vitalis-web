import { test, expect } from '@playwright/test';
import { websiteCredit, websiteProducer } from '../data/website-credit';
import titleReference from '../data/homepage-title-reference.json' with { type: 'json' };

const locales = [
  { path: '/', lang: 'it' },
  { path: '/hr', lang: 'hr' },
  { path: '/de', lang: 'de' },
  { path: '/en', lang: 'en' },
  { path: '/si', lang: 'sl' },
];
for (const locale of locales)
  for (const width of locale.lang === 'hr'
    ? [390, 768, 820, 991, 992, 1440]
    : [390, 1440])
    test(`website credit ${locale.lang} ${width}`, async ({ page }) => {
      await page.setViewportSize({ width, height: 844 });
      await page.emulateMedia({ reducedMotion: 'reduce' });
      const errors: string[] = [],
        logs: string[] = [],
        posts: string[] = [];
      page.on('pageerror', (e) => errors.push(e.message));
      page.on('console', (m) => {
        if (m.type() === 'error' || m.type() === 'warning') logs.push(m.text());
      });
      page.on('request', (r) => {
        if (r.method() === 'POST') posts.push(r.url());
      });
      expect((await page.goto(locale.path))?.status()).toBe(200);
      expect(new URL(page.url()).pathname).toBe(locale.path);
      expect(await page.title()).toBe(
        titleReference.pages[locale.lang as keyof typeof titleReference.pages]
          .title,
      );
      await expect(page.locator('h1')).toBeVisible();
      await expect(
        page.locator('astro-error-overlay,vite-error-overlay'),
      ).toHaveCount(0);
      const credit = page.locator('footer [data-website-credit]');
      await credit.scrollIntoViewIfNeeded();
      await expect(credit).toHaveText(websiteCredit(locale.lang).text);
      const link = credit.getByRole('link', {
        name: websiteProducer.name,
        exact: true,
      });
      await expect(link).toHaveAttribute('href', websiteProducer.url);
      await expect(link).toHaveAttribute('rel', 'nofollow');
      await link.focus();
      await expect(link).toBeFocused();
      expect(
        await link.evaluate((el) => getComputedStyle(el).outlineStyle),
      ).toBe('solid');
      const graph = JSON.parse(
        (await page
          .locator('script[type="application/ld+json"]')
          .textContent())!,
      );
      const nodes = graph['@graph'];
      const site = nodes.find(
        (n: Record<string, unknown>) => n['@type'] === 'WebSite',
      );
      const agency = nodes.filter(
        (n: Record<string, unknown>) => n['@id'] === websiteProducer.id,
      );
      expect(agency).toEqual([
        {
          '@type': 'Organization',
          '@id': websiteProducer.id,
          name: websiteProducer.name,
          url: websiteProducer.url,
        },
      ]);
      expect(site.creator).toEqual({ '@id': websiteProducer.id });
      expect(site.creditText).toBe(websiteCredit(locale.lang).text);
      expect(site.publisher).toEqual({
        '@id': 'https://www.dentvitalis.com/#dentist',
      });
      for (const node of nodes.filter(
        (n: Record<string, unknown>) => n['@type'] !== 'WebSite',
      )) {
        expect(node.creator).toBeUndefined();
        expect(node.author).toBeUndefined();
      }
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      const copyright = (await page.locator('.copyright').boundingBox())!;
      const box = (await credit.boundingBox())!;
      expect(box.y).toBeGreaterThanOrEqual(copyright.y + copyright.height);
      expect(box.x).toBeGreaterThanOrEqual(0);
      expect(box.x + box.width).toBeLessThanOrEqual(width);
      if (width <= 991) {
        await page.evaluate(() =>
          scrollTo(0, document.documentElement.scrollHeight),
        );
        const last = (await credit.boundingBox())!;
        const cta = (await page.locator('.mobile-contact').boundingBox())!;
        expect(cta.y - (last.y + last.height)).toBeGreaterThanOrEqual(20);
      }
      if (locale.lang === 'hr' && [390, 820, 1440].includes(width))
        await page.screenshot({
          path: `/tmp/dv-enter-credit-${width}.png`,
          fullPage: false,
        });
      await page
        .locator(
          width < 992
            ? '.mobile-contact [data-contact-trigger]'
            : 'header [data-contact-trigger]',
        )
        .click();
      await expect(page.locator('[data-inquiry-dialog]')).toBeVisible();
      await page.keyboard.press('Escape');
      await expect(page.locator('[data-inquiry-dialog]')).toBeHidden();
      expect(errors).toEqual([]);
      expect(logs).toEqual([]);
      expect(posts).toEqual([]);
    });

test('website credit works without JavaScript and follows its ordinary link', async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:4321/hr');
  const link = page.locator('[data-website-credit] a');
  await link.scrollIntoViewIfNeeded();
  await expect(link).toBeVisible();
  await page.route('https://www.enter-internet.com/', (r) =>
    r.fulfill({
      contentType: 'text/html',
      body: '<title>Enter Internet link test</title><h1>Enter Internet</h1>',
    }),
  );
  await link.click();
  await expect(page).toHaveURL(websiteProducer.url);
  await expect(page).toHaveTitle('Enter Internet link test');
  await context.close();
});
