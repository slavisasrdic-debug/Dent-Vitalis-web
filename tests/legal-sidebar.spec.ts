import { expect, test } from '@playwright/test';
import legal from '../src/content/hr/legal.json' with { type: 'json' };

const languages = [
  {
    lang: 'hr',
    title: 'Pravne informacije',
    links: [
      { label: 'Polica privatnosti', href: '/hr/polica-privatnosti' },
      { label: 'Uvjeti korištenja', href: '/hr/uvjeti-koristenja' },
    ],
  },
  {
    lang: 'it',
    title: 'Informazioni legali',
    links: [
      {
        label: 'Informativa sulla privacy',
        href: '/informativa-sulla-privacy',
      },
      { label: 'Condizioni di utilizzo', href: '/condizioni-di-utilizzo' },
    ],
  },
];
test.use({ contextOptions: { reducedMotion: 'reduce' } });
const normalize = (text: string) => text.normalize('NFC').replace(/\s/g, '');

for (const language of languages) {
  test(`${language.lang} legal navigation retains placement, links and article copy`, async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    page.on('console', (message) => {
      if (message.type() === 'error') errors.push(message.text());
    });
    for (const [index, current] of language.links.entries()) {
      expect((await page.goto(current.href))?.status()).toBe(200);
      await page.evaluate(() => document.fonts.ready);
      await expect(page.locator('html')).toHaveAttribute('lang', language.lang);
      await expect(page.locator('main h1')).toHaveText(current.label);
      await expect(
        page.locator('astro-error-overlay,vite-error-overlay'),
      ).toHaveCount(0);
      const sidebar = page.getByRole('complementary', { name: language.title });
      await expect(sidebar).toHaveCount(1);
      await expect(sidebar.locator('h2')).toHaveText(language.title);
      await expect(sidebar.locator('a')).toHaveText(
        language.links.map((link) => link.label),
      );
      expect(
        await sidebar
          .locator('a')
          .evaluateAll((links) =>
            links.map((link) => link.getAttribute('href')),
          ),
      ).toEqual(language.links.map((link) => link.href));
      await expect(sidebar.locator('[aria-current="page"]')).toHaveAttribute(
        'href',
        current.href,
      );
      await expect(page.locator('.footer-group.legal > a')).toHaveText(
        language.links.map((link) => link.label),
      );
      if (language.lang === 'hr') {
        const source = legal[index]!;
        expect(
          normalize(await page.locator('.editorial-copy').innerText()),
        ).toBe(
          normalize(source.sourceText).slice(normalize(source.title).length),
        );
      }
      for (const width of [
        320, 390, 478, 479, 480, 766, 767, 768, 990, 991, 992, 993, 1440, 1920,
      ]) {
        await page.setViewportSize({ width, height: 900 });
        const geometry = await page.evaluate(() => {
          const sidebar = document.querySelector('.page-sidebar')!;
          const box = sidebar.getBoundingClientRect();
          const article = document
            .querySelector('.editorial-copy')!
            .getBoundingClientRect();
          return {
            sidebar: box.toJSON(),
            article: article.toJSON(),
            position: getComputedStyle(sidebar).position,
            overflow: document.documentElement.scrollWidth - innerWidth,
            sidebarOverflow: sidebar.scrollWidth - sidebar.clientWidth,
          };
        });
        expect(geometry.overflow, `${current.href} at ${width}`).toBe(0);
        expect(geometry.sidebarOverflow).toBe(0);
        if (width <= 991) {
          expect(geometry.sidebar.bottom).toBeLessThan(geometry.article.top);
          expect(
            Math.abs(geometry.sidebar.left - geometry.article.left),
          ).toBeLessThan(1);
          expect(geometry.position).toBe('relative');
        } else {
          expect(geometry.sidebar.left).toBeGreaterThanOrEqual(
            geometry.article.right - 1,
          );
          expect(
            Math.abs(geometry.sidebar.top - geometry.article.top),
          ).toBeLessThan(1);
          expect(geometry.position).toBe('sticky');
        }
      }
    }
    expect(errors).toEqual([]);
  });
}

for (const javaScriptEnabled of [true, false]) {
  for (const width of [390, 1440]) {
    test(`legal links work by keyboard at ${width}px, JS ${javaScriptEnabled}`, async ({
      browser,
    }) => {
      const context = await browser.newContext({
        baseURL: 'http://127.0.0.1:4321',
        javaScriptEnabled,
        reducedMotion: 'reduce',
        viewport: { width, height: 900 },
      });
      const page = await context.newPage();
      try {
        for (const language of languages) {
          await page.goto(language.links[0]!.href);
          for (const target of [language.links[1]!, language.links[0]!]) {
            const link = page
              .locator('.page-sidebar')
              .getByRole('link', { name: target.label, exact: true });
            await link.focus();
            await expect(link).toBeFocused();
            await page.keyboard.press('Enter');
            await expect(page).toHaveURL('http://127.0.0.1:4321' + target.href);
            await expect(
              page.locator('.page-sidebar [aria-current="page"]'),
            ).toHaveText(target.label);
          }
        }
      } finally {
        await context.close();
      }
    });
  }
}
