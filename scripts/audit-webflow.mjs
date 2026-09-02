import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

import { chromium } from '@playwright/test';

const referenceOrigin = 'https://dentvitalis33.webflow.io';
const outputDirectory = path.resolve('reference');
const screenshotDirectory = path.join(outputDirectory, 'screenshots');
const auditPath = path.join(outputDirectory, 'webflow-audit.json');
const seedPaths = ['/', '/su-di-noi/sedazione-cosciente'];
const sensitiveQueryParameters = new Set([
  'access_token',
  'api_key',
  'key',
  'signature',
  'token',
]);

const requestedViewports = [1440, 1200, 992, 991, 768, 767, 480, 479, 390];
const representativePaths = [
  '/prestazioni/protesi-definitiva-ancorata-su-4-impianti',
  '/su-di-noi/i-nostri-specialisti',
  '/informazioni/prima-visita-gratuita',
  '/testimonianze',
  '/faq',
  '/domande-e-risposte',
  '/contatti',
];

const styleProperties = [
  'display',
  'position',
  'zIndex',
  'width',
  'maxWidth',
  'height',
  'padding',
  'margin',
  'gap',
  'fontFamily',
  'fontSize',
  'fontStyle',
  'fontWeight',
  'lineHeight',
  'letterSpacing',
  'textTransform',
  'color',
  'backgroundColor',
  'border',
  'borderRadius',
  'boxShadow',
  'opacity',
  'transition',
];

const styleTargets = {
  body: 'body',
  navigation: '.navbar',
  navigationContainer: '.nav-container',
  navigationLink: '.nav-link',
  navigationDropdownLabel: '.nav-item-title',
  primaryButton: '.gumb-upit',
  heroHeading: 'h1',
  sectionHeading: '.medjunaslov-h2',
  cardHeading: '.medjunaslov-h3',
  bodyParagraph: 'main p, body p',
  formInput: 'input:not([type="hidden"]), textarea',
  footer: 'footer, .footer',
};

function normalizeInternalUrl(value) {
  try {
    const url = new URL(value, referenceOrigin);
    if (url.origin !== referenceOrigin) return null;
    url.hash = '';
    url.search = '';
    return url.pathname || '/';
  } catch {
    return null;
  }
}

function slugForPath(pagePath) {
  if (pagePath === '/') return 'home';
  return pagePath.replace(/^\//, '').replaceAll('/', '--');
}

function redactSensitiveUrl(value) {
  if (typeof value !== 'string' || !/^https?:\/\//i.test(value)) return value;

  try {
    const url = new URL(value);
    for (const parameter of sensitiveQueryParameters) {
      if (url.searchParams.has(parameter)) {
        url.searchParams.set(parameter, '[redacted]');
      }
    }
    return url.href;
  } catch {
    return value;
  }
}

function redactSensitiveUrls(value) {
  if (Array.isArray(value)) return value.map(redactSensitiveUrls);
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, child]) => [
        key,
        redactSensitiveUrls(child),
      ]),
    );
  }
  return redactSensitiveUrl(value);
}

async function settle(page, { scroll = false } = {}) {
  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(1_200);
  await page.evaluate(() => document.fonts.ready);

  if (scroll) {
    await page.evaluate(async () => {
      const delay = (duration) =>
        new Promise((resolve) => setTimeout(resolve, duration));
      let previousHeight = 0;

      for (let pass = 0; pass < 2; pass += 1) {
        const height = document.documentElement.scrollHeight;
        if (height === previousHeight && pass > 0) break;
        previousHeight = height;

        for (
          let y = 0;
          y < height;
          y += Math.max(500, window.innerHeight * 0.75)
        ) {
          window.scrollTo(0, y);
          await delay(60);
        }
      }

      window.scrollTo(0, 0);
    });
    await page.waitForTimeout(500);
  }

  await page.evaluate(() => {
    for (const video of document.querySelectorAll('video')) video.pause();
  });
  await page.addStyleTag({
    content:
      '*,*::before,*::after{animation-play-state:paused!important;scroll-behavior:auto!important}',
  });
}

async function inspectPage(page, pagePath, status, consoleMessages) {
  return page.evaluate(
    ({ inspectedPath, responseStatus, messages }) => {
      const cleanText = (value) => value?.trim().replace(/\s+/g, ' ') ?? '';
      const absolute = (value) => {
        try {
          return new URL(value, document.baseURI).href;
        } catch {
          return null;
        }
      };

      const attributeAssets = [];
      for (const element of document.querySelectorAll(
        '[src], [srcset], [poster]',
      )) {
        for (const attribute of ['src', 'poster']) {
          const value = element.getAttribute(attribute);
          const url = value ? absolute(value) : null;
          if (url?.startsWith('http')) {
            attributeAssets.push({
              url,
              kind: element.tagName.toLowerCase(),
              attribute,
              alt: element instanceof HTMLImageElement ? element.alt : '',
            });
          }
        }

        const srcset = element.getAttribute('srcset');
        if (srcset) {
          for (const candidate of srcset.split(',')) {
            const value = candidate.trim().split(/\s+/)[0];
            const url = absolute(value);
            if (url?.startsWith('http')) {
              attributeAssets.push({
                url,
                kind: element.tagName.toLowerCase(),
                attribute: 'srcset',
                alt: element instanceof HTMLImageElement ? element.alt : '',
              });
            }
          }
        }
      }

      const backgroundAssets = [];
      for (const element of document.querySelectorAll('body *')) {
        const background = getComputedStyle(element).backgroundImage;
        for (const match of background.matchAll(
          /url\(["']?([^"')]+)["']?\)/g,
        )) {
          const url = absolute(match[1]);
          if (url?.startsWith('http')) {
            backgroundAssets.push({
              url,
              kind: 'background-image',
              attribute: 'computed-style',
              alt: '',
            });
          }
        }
      }

      return {
        path: inspectedPath,
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
        viewport: { width: innerWidth, height: innerHeight },
        documentSize: {
          width: document.documentElement.scrollWidth,
          height: document.documentElement.scrollHeight,
        },
        headings: [...document.querySelectorAll('h1, h2, h3')].map(
          (heading) => ({
            level: heading.tagName.toLowerCase(),
            text: cleanText(heading.textContent),
            className: heading.className,
          }),
        ),
        forms: [...document.forms].map((form) => ({
          action: form.action || null,
          method: form.method || null,
          fields: [...form.elements].map((field) => ({
            tag: field.tagName.toLowerCase(),
            type: field.getAttribute('type'),
            name: field.getAttribute('name'),
            required: field.hasAttribute('required'),
            accept: field.getAttribute('accept'),
          })),
        })),
        iframes: [...document.querySelectorAll('iframe')].map((iframe) => ({
          src: iframe.src,
          title: iframe.title || null,
          loading: iframe.loading || null,
        })),
        videos: [...document.querySelectorAll('video')].map((video) => ({
          src: video.currentSrc || video.src || null,
          poster: video.poster || null,
          autoplay: video.autoplay,
          muted: video.muted,
          loop: video.loop,
          playsInline: video.playsInline,
        })),
        internalLinks: [
          ...new Set(
            [...document.querySelectorAll('a[href]')]
              .map((anchor) => absolute(anchor.getAttribute('href')))
              .filter((url) => url?.startsWith(location.origin)),
          ),
        ],
        externalLinks: [
          ...new Set(
            [...document.querySelectorAll('a[href]')]
              .map((anchor) => absolute(anchor.getAttribute('href')))
              .filter(
                (url) =>
                  url?.startsWith('http') && !url.startsWith(location.origin),
              ),
          ),
        ],
        assets: [...attributeAssets, ...backgroundAssets],
        consoleMessages: messages,
      };
    },
    {
      inspectedPath: pagePath,
      responseStatus: status,
      messages: consoleMessages,
    },
  );
}

async function inspectViewport(browser, width) {
  const height = width <= 480 ? 844 : 900;
  const page = await browser.newPage({ viewport: { width, height } });
  await page.goto(`${referenceOrigin}/`, {
    waitUntil: 'domcontentloaded',
    timeout: 60_000,
  });
  await settle(page);

  const measurement = await page.evaluate(
    ({ targets, properties }) => {
      const isVisible = (element) => {
        const style = getComputedStyle(element);
        const box = element.getBoundingClientRect();
        return (
          style.display !== 'none' &&
          style.visibility !== 'hidden' &&
          box.width > 0 &&
          box.height > 0
        );
      };
      const round = (value) => Math.round(value * 100) / 100;
      const result = {};

      for (const [name, selector] of Object.entries(targets)) {
        const element = [...document.querySelectorAll(selector)].find(
          isVisible,
        );
        if (!element) {
          result[name] = null;
          continue;
        }

        const computed = getComputedStyle(element);
        const box = element.getBoundingClientRect();
        result[name] = {
          selector,
          tag: element.tagName.toLowerCase(),
          className: element.className,
          text:
            element.textContent?.trim().replace(/\s+/g, ' ').slice(0, 140) ??
            '',
          box: {
            x: round(box.x),
            y: round(box.y),
            width: round(box.width),
            height: round(box.height),
          },
          style: Object.fromEntries(
            properties.map((property) => [property, computed[property]]),
          ),
        };
      }

      const rootStyle = getComputedStyle(document.documentElement);
      const customProperties = {};
      for (const property of rootStyle) {
        if (property.startsWith('--'))
          customProperties[property] = rootStyle
            .getPropertyValue(property)
            .trim();
      }

      return {
        viewport: { width: innerWidth, height: innerHeight },
        documentSize: {
          width: document.documentElement.scrollWidth,
          height: document.documentElement.scrollHeight,
        },
        customProperties,
        targets: result,
      };
    },
    { targets: styleTargets, properties: styleProperties },
  );

  await page.screenshot({
    path: path.join(screenshotDirectory, `webflow-home-${width}-viewport.png`),
    fullPage: false,
  });

  await page.close();
  return measurement;
}

async function captureFullPage(browser, pagePath, width) {
  const height = width <= 480 ? 844 : 900;
  const page = await browser.newPage({ viewport: { width, height } });
  await page.goto(`${referenceOrigin}${pagePath}`, {
    waitUntil: 'domcontentloaded',
    timeout: 60_000,
  });
  await settle(page, { scroll: true });
  await page.screenshot({
    path: path.join(
      screenshotDirectory,
      `webflow-${slugForPath(pagePath)}-${width}-full.jpg`,
    ),
    type: 'jpeg',
    quality: 82,
    fullPage: true,
  });
  await page.close();
}

async function captureInteractionStates(browser) {
  const desktop = await browser.newPage({
    viewport: { width: 1440, height: 900 },
  });
  await desktop.goto(`${referenceOrigin}/`, {
    waitUntil: 'domcontentloaded',
    timeout: 60_000,
  });
  await settle(desktop);
  await desktop.locator('.nav-dropdown').first().hover();
  await desktop.waitForTimeout(500);
  await desktop.screenshot({
    path: path.join(screenshotDirectory, 'webflow-home-1440-nav-dropdown.png'),
  });
  await desktop.close();

  const mobile = await browser.newPage({
    viewport: { width: 390, height: 844 },
  });
  await mobile.goto(`${referenceOrigin}/`, {
    waitUntil: 'domcontentloaded',
    timeout: 60_000,
  });
  await settle(mobile);
  await mobile.locator('.menu-button').click();
  await mobile.waitForTimeout(500);
  await mobile.screenshot({
    path: path.join(screenshotDirectory, 'webflow-home-390-mobile-menu.png'),
  });
  await mobile.close();

  const faq = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await faq.goto(`${referenceOrigin}/faq`, {
    waitUntil: 'domcontentloaded',
    timeout: 60_000,
  });
  await settle(faq);
  const firstAccordion = faq.locator('.accordion-item, .faq-item').first();
  if ((await firstAccordion.count()) > 0) {
    await firstAccordion.click();
    await faq.waitForTimeout(500);
  }
  await faq.screenshot({
    path: path.join(screenshotDirectory, 'webflow-faq-1440-interaction.png'),
  });
  await faq.close();
}

async function fetchStylesheetData(stylesheetUrls) {
  const result = [];
  for (const url of stylesheetUrls) {
    try {
      const response = await fetch(url);
      const css = await response.text();
      const mediaQueries = [
        ...new Set(
          [...css.matchAll(/@media\s*([^{]+)/g)].map((match) =>
            match[1].trim(),
          ),
        ),
      ];
      const urls = [
        ...new Set(
          [...css.matchAll(/url\(["']?([^"')]+)["']?\)/g)].map((match) => {
            try {
              return new URL(match[1], url).href;
            } catch {
              return match[1];
            }
          }),
        ),
      ];
      result.push({
        url,
        status: response.status,
        bytes: css.length,
        mediaQueries,
        urls,
      });
    } catch (error) {
      result.push({
        url,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }
  return result;
}

await mkdir(screenshotDirectory, { recursive: true });

const browser = await chromium.launch({ headless: true });
const crawler = await browser.newPage({
  viewport: { width: 1440, height: 900 },
});
const pending = [...seedPaths];
const visited = new Set();
const pages = [];
const networkAssets = new Map();
const stylesheetUrls = new Set();

crawler.on('response', (response) => {
  const request = response.request();
  const resourceType = request.resourceType();
  if (['image', 'media', 'font'].includes(resourceType)) {
    networkAssets.set(response.url(), {
      url: response.url(),
      resourceType,
      status: response.status(),
      contentType: response.headers()['content-type'] ?? null,
    });
  }
  if (resourceType === 'stylesheet') stylesheetUrls.add(response.url());
});

while (pending.length > 0 && visited.size < 100) {
  const pagePath = pending.shift();
  if (!pagePath || visited.has(pagePath)) continue;
  visited.add(pagePath);

  const consoleMessages = [];
  const consoleListener = (message) => {
    if (['error', 'warning'].includes(message.type())) {
      consoleMessages.push({ type: message.type(), text: message.text() });
    }
  };
  const pageErrorListener = (error) => {
    consoleMessages.push({ type: 'pageerror', text: error.message });
  };
  crawler.on('console', consoleListener);
  crawler.on('pageerror', pageErrorListener);

  let status = null;
  try {
    const response = await crawler.goto(`${referenceOrigin}${pagePath}`, {
      waitUntil: 'domcontentloaded',
      timeout: 60_000,
    });
    status = response?.status() ?? null;
    await settle(crawler);
    const inspected = await inspectPage(
      crawler,
      pagePath,
      status,
      consoleMessages,
    );
    pages.push(inspected);

    for (const link of inspected.internalLinks) {
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
      path: pagePath,
      status,
      error: error instanceof Error ? error.message : String(error),
      consoleMessages,
    });
  } finally {
    crawler.off('console', consoleListener);
    crawler.off('pageerror', pageErrorListener);
  }
}

await crawler.close();

const viewportMeasurements = [];
for (const width of requestedViewports) {
  viewportMeasurements.push(await inspectViewport(browser, width));
}

for (const width of [1440, 390]) await captureFullPage(browser, '/', width);
for (const pagePath of representativePaths) {
  await captureFullPage(browser, pagePath, 1440);
  await captureFullPage(browser, pagePath, 390);
}
await captureInteractionStates(browser);

const stylesheetData = await fetchStylesheetData([...stylesheetUrls]);

await browser.close();

const audit = {
  capturedAt: new Date().toISOString(),
  source: referenceOrigin,
  methodology: {
    browser: 'Playwright Chromium',
    browserPlugin: 'not available',
    requestedViewports,
    screenshotNotes:
      'Fonts loaded; full-page captures scroll through content; videos paused; animation playback paused before capture.',
  },
  pages,
  viewportMeasurements,
  networkAssets: [...networkAssets.values()].sort((a, b) =>
    a.url.localeCompare(b.url),
  ),
  stylesheets: stylesheetData,
};

await writeFile(
  auditPath,
  `${JSON.stringify(redactSensitiveUrls(audit), null, 2)}\n`,
  'utf8',
);
console.log(`Audited ${pages.length} pages.`);
console.log(`Recorded ${networkAssets.size} network assets.`);
console.log(`Saved audit to ${auditPath}.`);
