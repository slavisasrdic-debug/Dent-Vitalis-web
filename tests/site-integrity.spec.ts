import { test, expect } from '@playwright/test';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { route as deRoute } from '../src/content/de/routes';
import { route as enRoute } from '../src/content/en/routes';
import { route as slRoute } from '../src/content/sl/routes';
import { canonicalUrl, productionOrigin } from '../src/content/seo-urls';
import { pagePath } from '../src/content/page-paths';
import { thankYouRoutes } from '../src/content/thank-you-routes';
import decisions from '../data/seo/localized-route-decisions-20261004.json' with { type: 'json' };

const pairs = readFileSync('data/hr-routes.proposed.csv', 'utf8')
  .trim()
  .split('\n')
  .slice(1)
  .map((row) => row.split(','))
  .filter((row) => row[4] === 'approved');
const routesFor = (pair: string[]) => ({
  it: pagePath(pair[1]!),
  hr: pagePath(pair[2]!),
  de: deRoute(pair[0]!),
  en: enRoute(pair[0]!),
  sl: slRoute(pair[0]!),
});
const contentPages = pairs.flatMap((pair) =>
  Object.entries(routesFor(pair)).map(([lang, path]) => ({
    id: pair[0]!,
    lang,
    path,
    equivalents: routesFor(pair),
    thanks: false,
  })),
);
// The extra Italian transport article has no reviewed translation counterparts.
contentPages.push({
  id: 'transport',
  lang: 'it',
  path: '/informazioni/trasporto',
  equivalents: {
    it: '/informazioni/trasporto',
    hr: '',
    de: '',
    en: '',
    sl: '',
  },
  thanks: false,
});
const pages = [
  ...contentPages,
  ...Object.entries(thankYouRoutes).map(([lang, path]) => ({
    id: 'confirmation',
    lang,
    path,
    equivalents: thankYouRoutes,
    thanks: true,
  })),
];
const reportDirectory = '.astro/audits/site-integrity';

test('native public routes are explicit, complete and never English ID fallbacks', () => {
  for (const [locale, resolve] of [
    ['de', deRoute],
    ['sl', slRoute],
  ] as const) {
    const prefix = locale === 'de' ? '/de' : '/si';
    for (const [id, path] of Object.entries(decisions.routes[locale])) {
      expect(resolve(id)).toBe(path);
      if (id !== 'faq') expect(path).not.toBe(`${prefix}/${id}`);
    }
    expect(() => resolve('unreviewed-new-page')).toThrow();
    expect(new Set(pairs.map((pair) => resolve(pair[0]!))).size).toBe(27);
  }
  expect(deRoute('accommodation')).toBe('/de/unterkunft');
  expect(slRoute('accommodation')).toBe('/si/namestitev');
  expect(decisions.unpublishedEnglishAliasesMustNotBeRedirected).toBe(true);
});

test('every rendered page, internal link, fragment, language pair and form is consistent', async ({
  page,
  request,
}) => {
  test.setTimeout(300000);
  const findings: string[] = [];
  const check = (value: unknown, message: string) => {
    if (!value) findings.push(message);
  };
  const documents = new Map<string, Awaited<ReturnType<typeof parse>>>();
  const assets = new Set<string>();
  const externals = new Set<string>();
  async function parse(html: string) {
    return page.evaluate((html) => {
      const d = new DOMParser().parseFromString(html, 'text/html');
      const attr = (selector: string, name: string) =>
        d.querySelector(selector)?.getAttribute(name) ?? '';
      const meta = (name: string) =>
        attr(`meta[name="${name}"],meta[property="${name}"]`, 'content');
      const schema = [
        ...d.querySelectorAll('script[type="application/ld+json"]'),
      ].map((s) => JSON.parse(s.textContent!));
      return {
        title: d.title,
        lang: d.documentElement.lang,
        description: meta('description'),
        robots: meta('robots'),
        canonical: attr('link[rel=canonical]', 'href'),
        ogTitle: meta('og:title'),
        ogDescription: meta('og:description'),
        ogUrl: meta('og:url'),
        ogImage: meta('og:image'),
        twitterImage: meta('twitter:image'),
        ogImageAlt: meta('og:image:alt'),
        h1: [...d.querySelectorAll('main h1')].map((n) =>
          n.textContent?.trim(),
        ),
        ids: [...d.querySelectorAll('[id]')].map((n) => n.id),
        links: [...d.querySelectorAll('a[href]')].map((n) => ({
          href: n.getAttribute('href')!,
          text: n.textContent?.trim(),
          languageSwitch: !!n.closest('[data-language]'),
        })),
        alternates: [
          ...d.querySelectorAll('link[rel=alternate][hreflang]'),
        ].map((n) => ({
          lang: n.getAttribute('hreflang')!,
          href: n.getAttribute('href')!,
        })),
        switches: [
          ...d.querySelectorAll('[data-language].desktop a[href]'),
        ].map((n) => ({
          lang: n.getAttribute('lang')!,
          href: n.getAttribute('href')!,
        })),
        forms: [...d.querySelectorAll('form[data-contact-form]')].map((f) => ({
          lang: f.querySelector('input[name=lang]')?.getAttribute('value'),
          success: f.getAttribute('data-success'),
          required: ['name', 'email', 'phone'].every((name) =>
            f.querySelector(`input[name=${name}]`)?.hasAttribute('required'),
          ),
          consent: !!f.querySelector(
            'input[type=checkbox][name=form_agreement][required]',
          ),
          tokens: ['csrf', 'gct'].every(
            (name) =>
              f.querySelector(`input[name=${name}]`)?.getAttribute('value') ===
              '',
          ),
          privacy: f.querySelector('.consent a')?.getAttribute('href'),
        })),
        schema,
        text: d.querySelector('main')?.textContent ?? '',
        images: [...d.querySelectorAll('img')].map((n) => ({
          src: n.getAttribute('src') ?? '',
          hasAlt: n.hasAttribute('alt'),
        })),
        scripts: [...d.querySelectorAll('script[src]')].map((n) =>
          n.getAttribute('src')!,
        ),
      };
    }, html);
  }
  mkdirSync(reportDirectory, { recursive: true });
  const csvCell = (value: string) => `"${value.replaceAll('"', '""')}"`;
  const routeRows = pairs.map((pair) => [
    pair[0]!,
    ...Object.values(routesFor(pair)).map(canonicalUrl),
  ]);
  writeFileSync(
    `${reportDirectory}/urls-five-languages.csv`,
    '\uFEFF' +
      [['Stranica (interni ID)', 'IT', 'HR', 'DE', 'EN', 'SI'], ...routeRows]
        .map((row) => row.map(csvCell).join(';'))
        .join('\r\n') +
      '\r\n',
  );
  // Fetch each page once. The cache is ignored and never enters the build/repo.
  for (let start = 0; start < pages.length; start += 4) {
    const batch = await Promise.all(
      pages.slice(start, start + 4).map(async (entry) => {
        const response = await request.get(entry.path, { maxRedirects: 0 });
        check(
          response.status() === 200,
          `${entry.path}: HTTP ${response.status()}`,
        );
        return { entry, html: await response.text() };
      }),
    );
    for (const { entry, html } of batch) {
      writeFileSync(
        `${reportDirectory}/${entry.path.replace(/\//g, '_') || 'root'}.html`,
        html,
      );
      const doc = await parse(html);
      documents.set(entry.path, doc);
      check(
        doc.lang === entry.lang,
        `${entry.path}: wrong html lang ${doc.lang}`,
      );
      check(
        doc.h1.length === 1 && doc.h1[0],
        `${entry.path}: expected one nonempty H1`,
      );
      check(
        (entry.thanks ? doc.title.length > 0 : doc.title.length > 10) &&
          doc.description.length > 15,
        `${entry.path}: incomplete title/description`,
      );
      check(
        doc.robots === 'noindex, nofollow',
        `${entry.path}: preview must remain noindex`,
      );
      check(
        doc.canonical === canonicalUrl(entry.path),
        `${entry.path}: wrong canonical`,
      );
      check(
        doc.ogUrl === doc.canonical &&
          doc.ogTitle === doc.title &&
          doc.ogDescription === doc.description,
        `${entry.path}: Open Graph mismatch`,
      );
      check(
        doc.ogImage && doc.ogImage === doc.twitterImage && doc.ogImageAlt,
        `${entry.path}: missing social image/alt`,
      );
      check(
        new Set(doc.ids).size === doc.ids.length,
        `${entry.path}: duplicate HTML IDs`,
      );
      check(
        !doc.text.includes('Prima visita gratuita') || entry.lang === 'it',
        `${entry.path}: Italian source marker leaked`,
      );
      const graph = doc.schema.flatMap((s) => s['@graph'] ?? []);
      const node = graph.find((n) => n['@id'] === `${doc.canonical}#webpage`);
      check(
        node?.url === doc.canonical &&
          node?.inLanguage === entry.lang &&
          node?.name === doc.title &&
          node?.description === doc.description,
        `${entry.path}: schema page metadata mismatch`,
      );
      for (const equivalent of doc.alternates) {
        const expected =
          equivalent.lang === 'x-default'
            ? productionOrigin + '/'
            : entry.equivalents[
                equivalent.lang as keyof typeof entry.equivalents
              ];
        check(
          expected &&
            equivalent.href ===
              (equivalent.lang === 'x-default'
                ? expected
                : canonicalUrl(expected)),
          `${entry.path}: wrong ${equivalent.lang} hreflang ${equivalent.href}`,
        );
      }
      if (!entry.thanks) {
        for (const [lang, href] of Object.entries(entry.equivalents).filter(
          ([, href]) => href,
        )) {
          check(
            doc.alternates.some(
              (link) => link.lang === lang && link.href === canonicalUrl(href),
            ),
            `${entry.path}: missing ${lang} hreflang`,
          );
          check(
            doc.switches.some(
              (link) => link.lang === lang && link.href === href,
            ),
            `${entry.path}: wrong ${lang} language switch`,
          );
        }
        check(doc.forms.length > 0, `${entry.path}: missing contact form`);
      }
      for (const form of doc.forms) {
        check(
          form.lang === entry.lang &&
            form.success ===
              thankYouRoutes[entry.lang as keyof typeof thankYouRoutes],
          `${entry.path}: wrong form language/success`,
        );
        check(
          form.required && form.consent && form.tokens,
          `${entry.path}: incomplete form required fields/consent or static tokens`,
        );
        const privacyId = pairs.find((pair) => pair[0] === 'privacy')!;
        check(
          form.privacy &&
            new URL(form.privacy, productionOrigin).href ===
              canonicalUrl(
                routesFor(privacyId)[
                  entry.lang as keyof ReturnType<typeof routesFor>
                ],
              ),
          `${entry.path}: wrong form privacy language`,
        );
      }
      for (const image of doc.images) {
        check(image.hasAlt, `${entry.path}: image without alt: ${image.src}`);
        if (image.src.startsWith('/')) assets.add(image.src);
      }
      for (const src of doc.scripts)
        if (src.startsWith('/') && !src.startsWith('/@')) assets.add(src);
    }
  }
  const titles = new Map<string, string>();
  let internalLinkOccurrences = 0;
  const knownPageLinks = new Set<string>();
  const preservedPhpPaths = new Set([
    '/hr/desinfekcija',
    '/hr/klinicko-produzenje-krune-prirodnog-zuba',
    '/hr/keramicki-most-na-svim-implantatima',
  ]);
  const preservedPhpLinks = new Set<string>();
  const siteIdentityLinks = new Set<string>();
  for (const entry of pages) {
    const doc = documents.get(entry.path)!;
    const titleKey = `${entry.lang}:${doc.title}`;
    check(
      !titles.has(titleKey),
      `${entry.path}: duplicate same-language title with ${titles.get(titleKey)}`,
    );
    titles.set(titleKey, entry.path);
    for (const link of doc.links) {
      if (!link.href || /^(tel|mailto):/.test(link.href)) continue;
      const url = new URL(link.href, productionOrigin + entry.path);
      if (!['http:', 'https:'].includes(url.protocol)) {
        check(false, `${entry.path}: unsafe link ${link.href}`);
        continue;
      }
      if (
        url.origin !== productionOrigin &&
        url.origin !== 'https://dentvitalis.com'
      ) {
        externals.add(url.href);
        continue;
      }
      internalLinkOccurrences++;
      const targetPath = pagePath(url.pathname);
      check(
        url.pathname === targetPath,
        `${entry.path}: noncanonical slash link ${link.href}`,
      );
      const target = documents.get(targetPath);
      if (!target) {
        if (preservedPhpPaths.has(targetPath)) {
          preservedPhpLinks.add(url.href);
          continue;
        }
        if (/\.[a-z0-9]+$/i.test(targetPath)) {
          assets.add(targetPath);
          continue;
        }
        check(
          false,
          `${entry.path}: missing internal destination ${link.href}`,
        );
        continue;
      }
      knownPageLinks.add(url.href);
      // Literal website-address references in contact/legal source copy are not
      // language navigation. Preserve their approved source destination.
      const siteIdentity =
        /^(https:\/\/)?www\.dentvitalis\.com\/?$/.test(link.text ?? '') &&
        /^https:\/\/www\.dentvitalis\.com\/?$/.test(link.href);
      if (siteIdentity) siteIdentityLinks.add(`${entry.path}: ${link.href}`);
      check(
        link.languageSwitch || siteIdentity || target.lang === entry.lang,
        `${entry.path}: cross-language content link ${link.href} (${link.text})`,
      );
      if (url.hash)
        check(
          target.ids.includes(decodeURIComponent(url.hash.slice(1))),
          `${entry.path}: missing section ${link.href}`,
        );
    }
  }
  for (const src of assets) {
    const response = await request.get(src);
    check(response.status() === 200, `asset ${src}: HTTP ${response.status()}`);
  }
  const unknown = await request.get('/definitely-not-a-dentvitalis-page', {
    maxRedirects: 0,
  });
  check(unknown.status() === 404, 'unknown page must return 404');
  const report = {
    scope:
      'all Astro preview pages, DOM links/fragments, localized metadata/schema/forms and referenced local assets; no POST',
    routes: pages.map(({ path, lang, id, thanks }) => ({
      path,
      lang,
      id,
      thanks,
    })),
    productionOrCpanelVerified: false,
    pageCount: documents.size,
    contentPageCount: contentPages.length,
    internalLinkOccurrences,
    distinctInternalDestinations: knownPageLinks.size,
    assetCount: assets.size,
    externalUrls: [...externals].sort(),
    externalTargetsFetched: false,
    preservedPhpLinks: [...preservedPhpLinks],
    sourceWebsiteIdentityReferences: [...siteIdentityLinks],
    preservedPhpRuntimeVerified: false,
    findings,
  };
  writeFileSync(
    `${reportDirectory}/report.json`,
    JSON.stringify(report, null, 2) + '\n',
  );
  console.log(
    JSON.stringify({
      pages: report.pageCount,
      links: internalLinkOccurrences,
      destinations: knownPageLinks.size,
      assets: assets.size,
      findings: findings.length,
    }),
  );
  expect(findings, `See ${reportDirectory}/report.json`).toEqual([]);
});

for (const width of [390, 1440]) {
  test(`real five-language accommodation switching and required-phone form, ${width}px`, async ({
    page,
  }) => {
    const errors: string[] = [];
    const posts: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    page.on('request', (request) => {
      if (request.method() === 'POST') posts.push(request.url());
    });
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    const pair = pairs.find((row) => row[0] === 'accommodation')!;
    const paths = routesFor(pair);
    await page.goto(paths.de);
    for (const [lang, path] of Object.entries(paths)) {
      const chooser = page.locator(
        `[data-language].${width < 1200 ? 'mobile' : 'desktop'}`,
      );
      await chooser.locator('summary').click();
      await chooser.locator(`a[lang=${lang}]`).click();
      expect(new URL(page.url()).pathname).toBe(path);
      await expect(page.locator('html')).toHaveAttribute('lang', lang);
      await expect(page.locator('main h1')).toHaveCount(1);
      await expect(page.locator('astro-error-overlay')).toHaveCount(0);
    }
    await page
      .locator(
        width < 992
          ? '.mobile-contact [data-contact-trigger]'
          : 'header [data-contact-trigger]',
      )
      .click();
    const form = page.locator('dialog[open] form');
    await expect(form).toBeVisible();
    await form.locator('input[name=name]').fill('TEST UI ONLY');
    await form.locator('input[name=email]').fill('ui-only@example.invalid');
    await form.locator('input[type=checkbox][name=form_agreement]').check();
    expect(
      await form
        .locator('input[name=phone]')
        .evaluate((input: HTMLInputElement) => input.validity.valueMissing),
    ).toBe(true);
    expect(
      await form.evaluate((element: HTMLFormElement) =>
        element.checkValidity(),
      ),
    ).toBe(false);
    await form.locator('input[name=phone]').fill('123456');
    expect(
      await form.evaluate((element: HTMLFormElement) =>
        element.checkValidity(),
      ),
    ).toBe(true);
    await page.keyboard.press('Escape');
    await page.evaluate(() => document.fonts.ready);
    mkdirSync(reportDirectory, { recursive: true });
    await page.screenshot({
      path: `${reportDirectory}/accommodation-${width}.png`,
    });
    expect(posts).toEqual([]);
    expect(errors).toEqual([]);
  });
}
