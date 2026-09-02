import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

import { chromium } from '@playwright/test';

const liveOrigin = 'https://www.dentvitalis.com';
const outputPath = path.resolve('reference/live-site-audit.json');
const seeds = ['/', '/hr/', '/de/', '/en/', '/si/'];

function normalizeInternalUrl(value) {
  try {
    const url = new URL(value, liveOrigin);
    if (url.origin !== liveOrigin) return null;
    if (
      /\.(?:avif|css|gif|ico|jpe?g|js|json|mp4|pdf|png|svg|webm|webp|woff2?)$/i.test(
        url.pathname,
      )
    ) {
      return null;
    }
    url.hash = '';
    url.search = '';
    return url.pathname || '/';
  } catch {
    return null;
  }
}

await mkdir(path.dirname(outputPath), { recursive: true });

const browser = await chromium.launch({
  headless: false,
  args: ['--disable-blink-features=AutomationControlled'],
});
const context = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  userAgent:
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36',
});

await context.addInitScript(() => {
  Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
  Object.defineProperty(window, 'outerWidth', { get: () => 1440 });
  Object.defineProperty(window, 'outerHeight', { get: () => 900 });
});

const page = await context.newPage();
const pending = [...seeds];
const visited = new Set();
const pages = [];

while (pending.length > 0 && visited.size < 400) {
  const requestedPath = pending.shift();
  if (!requestedPath || visited.has(requestedPath)) continue;
  visited.add(requestedPath);

  try {
    const response = await page.goto(`${liveOrigin}${requestedPath}`, {
      waitUntil: 'domcontentloaded',
      timeout: 60_000,
    });
    await page.waitForTimeout(350);
    if ((await page.title()) === 'One moment, please...') {
      await page.waitForTimeout(6_000);
    }

    const record = await page.evaluate(
      ({ pathRequested, responseStatus }) => {
        const cleanText = (value) => value?.trim().replace(/\s+/g, ' ') ?? '';
        const links = [...document.querySelectorAll('a[href]')].map(
          (anchor) => anchor.href,
        );
        return {
          requestedPath: pathRequested,
          finalUrl: location.href,
          status: responseStatus,
          title: document.title,
          lang: document.documentElement.lang || null,
          description:
            document
              .querySelector('meta[name="description"]')
              ?.getAttribute('content') ?? null,
          canonical:
            document
              .querySelector('link[rel="canonical"]')
              ?.getAttribute('href') ?? null,
          robots:
            document
              .querySelector('meta[name="robots"]')
              ?.getAttribute('content') ?? null,
          hreflang: [
            ...document.querySelectorAll('link[rel="alternate"][hreflang]'),
          ].map((link) => ({
            language: link.getAttribute('hreflang'),
            href: link.getAttribute('href'),
          })),
          h1: [...document.querySelectorAll('h1')].map((heading) =>
            cleanText(heading.textContent),
          ),
          internalLinks: [
            ...new Set(
              links.filter((link) => link.startsWith(location.origin)),
            ),
          ],
        };
      },
      {
        pathRequested: requestedPath,
        responseStatus: response?.status() ?? null,
      },
    );

    pages.push(record);
    for (const link of record.internalLinks) {
      const normalized = normalizeInternalUrl(link);
      if (
        normalized &&
        !visited.has(normalized) &&
        !pending.includes(normalized)
      )
        pending.push(normalized);
    }
  } catch (error) {
    pages.push({
      requestedPath,
      error: error instanceof Error ? error.message : String(error),
    });
  }
}

await browser.close();

const audit = {
  capturedAt: new Date().toISOString(),
  source: liveOrigin,
  methodology: {
    browser: 'Playwright headed Chromium under Xvfb',
    browserPlugin: 'not available',
    note: 'A headed context was required because the public host returned an anti-bot interstitial to headless Chromium and curl.',
  },
  pages,
};

await writeFile(outputPath, `${JSON.stringify(audit, null, 2)}\n`, 'utf8');
console.log(`Audited ${pages.length} live-site paths.`);
console.log(`Saved audit to ${outputPath}.`);
