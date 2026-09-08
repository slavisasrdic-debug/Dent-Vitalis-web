import { chromium } from '@playwright/test';
import { readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';

// Content transcription only. No Webflow HTML, CSS classes or scripts are output.
const handoff = 'reference/webflow-handoff/2026-09-07/extracted';
const source = 'source-assets/webflow-export/2026-09-07/extracted';
const { pages } = JSON.parse(await readFile(`${handoff}/pages.json`, 'utf8'));
const browser = await chromium.launch();
const page = await browser.newPage({
  javaScriptEnabled: false,
  viewport: { width: 390, height: 900 },
});
const referenceStyles = await readFile(
  `${source}/css/dentvitalis33.css`,
  'utf8',
);
await page.route('**/*', (route) => route.abort());
const result = [];
try {
  for (const entry of pages.filter((p) => p.metadata.publishedPath !== '/')) {
    const route = entry.metadata.publishedPath;
    const file = `${source}${route}.html`;
    const html = await readFile(file, 'utf8');
    await page.setContent(
      html.replace('</head>', `<style>${referenceStyles}</style></head>`),
      { waitUntil: 'domcontentloaded' },
    );
    await page.setViewportSize({ width: 1440, height: 900 });
    const desktopLabelSpans = await page
      .locator(
        '.podstranice-sidebar .prednost .text-block-16, .sadrzaji-usluge .prednost .text-block-16',
      )
      .evaluateAll((elements) =>
        elements.map((element) =>
          getComputedStyle(element).gridColumnEnd === 'span 2' ? 2 : 1,
        ),
      );
    const desktopBulletSpans = await page
      .locator('.bulet')
      .evaluateAll((elements) =>
        elements.map((element) => {
          const label = element.querySelector('.large-paragraph');
          return label && getComputedStyle(label).gridColumnEnd === 'span 2'
            ? 2
            : 1;
        }),
      );
    await page.setViewportSize({ width: 390, height: 900 });
    const content = await page.evaluate(
      ({ route, desktopLabelSpans, desktopBulletSpans }) => {
        const text = (e) =>
          e?.textContent.replace(/[\t\n\r ]+/g, ' ').trim() || '';
        const href = (raw) => {
          if (
            !raw ||
            raw.startsWith('#') ||
            /^(https?:|mailto:|tel:)/.test(raw)
          )
            return raw || '';
          const url = new URL(raw, `https://export.invalid${route}.html`);
          return (
            url.pathname.replace(/\/index\.html$/, '/').replace(/\.html$/, '') +
            url.search +
            url.hash
          );
        };
        const image = (e) =>
          e
            ? {
                image: decodeURIComponent(
                  e.getAttribute('src').split('/').at(-1),
                ),
                alt: e.getAttribute('alt') || '',
              }
            : undefined;
        const inline = (e) =>
          [...e.childNodes].flatMap((n) => {
            if (n.nodeType === 3)
              return n.textContent
                ? [
                    {
                      kind: 'text',
                      text: n.textContent.replace(/[\t\n\r ]+/g, ' '),
                    },
                  ]
                : [];
            if (
              n.nodeType !== 1 ||
              ['SVG', 'SCRIPT', 'STYLE'].includes(n.tagName)
            )
              return [];
            if (n.tagName === 'BR') return [{ kind: 'break' }];
            const children = inline(n);
            if (n.tagName === 'A')
              return [
                {
                  kind: 'link',
                  href: href(n.getAttribute('href')),
                  children,
                  variant: n.classList.contains('dv-hero-phone')
                    ? 'hero-phone'
                    : n.classList.contains('link')
                      ? 'underlined'
                      : 'plain',
                },
              ];
            if (['STRONG', 'B', 'EM', 'I', 'SUP', 'SUB'].includes(n.tagName))
              return [
                {
                  kind: {
                    STRONG: 'strong',
                    B: 'strong',
                    EM: 'em',
                    I: 'em',
                    SUP: 'sup',
                    SUB: 'sub',
                  }[n.tagName],
                  children,
                },
              ];
            if (n.classList.contains('titula'))
              return [{ kind: 'qualification', children }];
            return children;
          });
        const inlineClean = (e) => {
          if (!e) return [];
          const items = inline(e);
          if (items[0]?.kind === 'text')
            items[0].text = items[0].text.trimStart();
          if (items.at(-1)?.kind === 'text')
            items.at(-1).text = items.at(-1).text.trimEnd();
          return items.filter((i) => i.kind !== 'text' || i.text);
        };
        const block = (e) => {
          if (
            e.nodeType !== 1 ||
            ['STYLE', 'SCRIPT', 'SVG'].includes(e.tagName) ||
            e.classList.contains('skriveni')
          )
            return [];
          const id = e.id && !e.id.startsWith('w-node-') ? e.id : undefined;
          if (e.matches('.accordion-item'))
            return [
              {
                type: 'faq',
                question: text(e.querySelector('.accordion-title')),
                answer: inlineClean(e.querySelector('.accordion-text')),
                id,
              },
            ];
          if (e.matches('.galerija-usporedba-stabilna'))
            return [
              {
                type: 'comparison',
                before: image(e.querySelector('.bas-image-before')),
                after: image(e.querySelector('.bas-image-after-h')),
                beforeLabel: text(e.querySelector('.bas-label-before-h')),
                afterLabel: text(e.querySelector('.bas-label-after-h')),
                id,
              },
            ];
          if (e.matches('.video') && e.querySelector('iframe')) {
            const embed = new URL(
              e.querySelector('iframe').getAttribute('src'),
            );
            return [
              {
                type: 'youtube',
                videoId: embed.pathname.split('/').at(-1),
                title: text(e.querySelector('.naziv-klijenta')),
                id,
              },
            ];
          }
          if (
            e.tagName === 'IFRAME' &&
            /google.*maps/.test(e.getAttribute('src') || '')
          )
            return [{ type: 'map', src: e.getAttribute('src'), id }];
          if (e.tagName === 'IMG')
            return [
              {
                type: 'image',
                ...image(e),
                variant: e.classList.contains('foto-osoblje')
                  ? 'portrait'
                  : 'content',
                id,
              },
            ];
          if (
            e.matches(
              '.medjunaslov-h2-detaljna,.medjunaslov-h2-detaljna-2,.medjunaslov-h2-kontakti,.medjunaslov-h3,.naziv-klijenta',
            )
          )
            return [
              {
                type: 'heading',
                rank: e.matches('.medjunaslov-h3') ? 3 : 2,
                variant: e.matches('.medjunaslov-h3')
                  ? 'subsection'
                  : e.matches('.medjunaslov-h2-kontakti')
                    ? 'contact'
                    : e.matches('.naziv-klijenta')
                      ? 'review'
                      : e.matches('.medjunaslov-h2-detaljna-2')
                        ? 'gallery-section'
                        : 'section',
                flush:
                  e.classList.contains('bez-razmaka') ||
                  e.classList.contains('cjenik'),
                compact: e.classList.contains('bez'),
                content: inlineClean(e),
                id,
              },
            ];
          if (e.matches('.cijena,.large-paragraph._2'))
            return [
              {
                type: 'paragraph',
                content: inlineClean(e),
                variant: e.matches('.cijena.cjenik')
                  ? 'price-list'
                  : e.matches('.cijena')
                    ? 'price'
                    : 'price-prefix',
                id,
              },
            ];
          if (e.tagName === 'P')
            return [
              {
                type: 'paragraph',
                content: inlineClean(e),
                variant: e.classList.contains('mali')
                  ? 'small'
                  : e.classList.contains('prije-poslije')
                    ? 'caption'
                    : e.classList.contains('cijena')
                      ? 'price'
                      : 'body',
                id,
              },
            ];
          if (e.matches('.bulet.kontakti'))
            return [
              {
                type: 'contact-row',
                cells: [...e.children]
                  .filter((c) => !c.matches('.w-embed'))
                  .map((c) =>
                    c.tagName === 'A'
                      ? [
                          {
                            kind: 'link',
                            href: href(c.getAttribute('href')),
                            children: inlineClean(c),
                            variant:
                              c.matches('.link,.link-svijetli') ||
                              c.querySelector('.link,.link-svijetli')
                                ? 'underlined'
                                : 'native',
                          },
                        ]
                      : inlineClean(c),
                  ),
                border: !e.classList.contains('bez-crte'),
                id,
              },
            ];
          if (e.matches('.bulet'))
            return [
              {
                type: 'bullet',
                content: inlineClean(e),
                icon: !!e.querySelector('svg'),
                small: !!e.querySelector('.large-paragraph.mali'),
                labelSpan:
                  desktopBulletSpans[
                    [...document.querySelectorAll('.bulet')].indexOf(e)
                  ],
                smallLabelSpan: (() => {
                  const label = e.querySelector('.large-paragraph');
                  return label &&
                    getComputedStyle(label).gridColumnEnd === 'span 2'
                    ? 2
                    : 1;
                })(),
                variant: e.matches('.kontakti')
                  ? 'contact'
                  : e.querySelector('.icon-price-bullet')
                    ? 'check'
                    : 'dot',
                id,
              },
            ];
          if (e.matches('.izvor-recenzije'))
            return [
              {
                type: 'review-source',
                label: text(
                  e.querySelector('.gogole-reenzija:last-child > div'),
                ),
                stars: [...e.querySelectorAll('.zvjezdica')].map(image),
                logo: image(e.querySelector('.image-11')),
                id,
              },
            ];
          if (
            e.matches(
              '.galerija-sidro-odmak,.testimonianze-sidro-odmak,.razmak',
            )
          )
            return [
              {
                type: 'anchor',
                variant: e.matches('.razmak')
                  ? 'space'
                  : e.matches(
                        '.galerija-sidro-odmak,.testimonianze-sidro-odmak',
                      )
                    ? 'section-offset'
                    : 'anchor',
                id,
              },
            ];
          if (e.tagName === 'A' && !e.querySelector('p,div,img'))
            return [
              {
                type: 'paragraph',
                content: [
                  {
                    kind: 'link',
                    href: href(e.getAttribute('href')),
                    children: inlineClean(e),
                  },
                ],
                variant: 'body',
                id,
              },
            ];
          const children = e.matches('.div-block-33')
            ? [...e.children].map((c) => ({
                type: 'group',
                variant: 'price-cell',
                children: block(c),
              }))
            : [...e.children].flatMap(block);
          const variants = {
            odlomak: 'paragraphs',
            izdvojeno: 'callout',
            'kontakt-kartica': 'contact-card',
            'cjenik-kartica': 'price-card',
            'div-block-33': e.classList.contains('bez-crtice')
              ? 'price-row-borderless'
              : 'price-row',
            'cijen-crta': 'price-amount',
            video: 'review',
            'gogole-recenzije': 'reviews',
            'dv-legal-content': 'legal',
            'div-block-34': 'contact-address',
          };
          const variant = Object.entries(variants)
            .filter(([cls]) => e.classList.contains(cls))
            .at(-1)?.[1];
          if (variant) return [{ type: 'group', variant, children, id }];
          if (!children.length && text(e) && !e.matches('.w-embed'))
            return [
              {
                type: 'paragraph',
                content: inlineClean(e),
                variant: 'body',
                id,
              },
            ];
          if (id) return [{ type: 'group', variant: 'plain', children, id }];
          return children;
        };
        const hero = document.querySelector('.zaglavlje-detaljna');
        const sidebar = document.querySelector(
          '.sadrzaji-usluge,.podstranice-sidebar',
        );
        const card = (e) => {
          const title = e.querySelector('.medjunaslov-h3');
          return {
            title: text(title),
            href: href(title?.getAttribute('href')),
            eyebrow: text(e.querySelector('.nadnaslov-kartica')),
            description: text(e.querySelector('.large-paragraph')),
            price: text(e.querySelector('.cijena-velika')),
            copyLayout: e.querySelector('.div-block-35,.div-block-36')
              ? 'stack'
              : 'flow',
            priceInset: !!e.querySelector('.cijena-velika strong'),
          };
        };
        const desktop = [
          ...document.querySelectorAll('.p-teaser-img-wrap > img'),
        ];
        return {
          route,
          lang: document.documentElement.lang,
          title: document.title,
          description:
            document.querySelector('meta[name="description"]')?.content || '',
          typography: document.body.classList.contains('body')
            ? 'brand'
            : 'reference-default',
          breadcrumb: [
            ...document.querySelectorAll('.breadcrumb .breadcrum-text'),
          ]
            .filter((e) => text(e) !== '/')
            .map((e) => ({
              label: text(e),
              href: href(e.querySelector('a')?.getAttribute('href')),
            })),
          hero: {
            title: text(hero.querySelector('h1')),
            eyebrow: text(hero.querySelector('.nadnaslov-detaljna')),
            description: inlineClean(hero.querySelector('.podnaslov-detaljna')),
            photo: image(hero.querySelector('img')),
            variant: document.querySelector('.teaser-section')
              ? 'directory'
              : hero.querySelector('img')?.classList.contains('nostri')
                ? 'specialists'
                : hero.querySelector('img')
                  ? 'photo'
                  : 'plain',
          },
          sidebar: sidebar
            ? {
                type: sidebar.matches('.sadrzaji-usluge')
                  ? 'package'
                  : 'navigation',
                title: text(sidebar.querySelector('.text-block-11')),
                secondary: text(sidebar.querySelector('.text-span-4')),
                introduction: text(sidebar.querySelector('h3')),
                map: sidebar.querySelector('iframe')?.getAttribute('src'),
                mobilePlacement: (() => {
                  const article = document.querySelector('.tekst-detaljna');
                  const difference =
                    Number(getComputedStyle(sidebar).order) -
                    Number(getComputedStyle(article).order);
                  return difference < 0 ||
                    (difference === 0 &&
                      sidebar.compareDocumentPosition(article) &
                        Node.DOCUMENT_POSITION_FOLLOWING)
                    ? 'before'
                    : 'after';
                })(),
                items: [...sidebar.querySelectorAll('.prednost')].map(
                  (e, i) => ({
                    label: text(e.querySelector('.text-block-16')),
                    href: href((e.closest('a') || e).getAttribute('href')),
                    icon: !!e.querySelector('svg'),
                    labelSpan: desktopLabelSpans[i],
                    smallLabelSpan:
                      getComputedStyle(e.querySelector('.text-block-16'))
                        .gridColumnEnd === 'span 2'
                        ? 2
                        : 1,
                    note: e.classList.contains('malo'),
                    id: e.id && !e.id.startsWith('w-node-') ? e.id : undefined,
                  }),
                ),
                position: sidebar.previousElementSibling?.classList.contains(
                  'tekst-detaljna',
                )
                  ? 'after'
                  : 'before',
              }
            : undefined,
          blocks: [
            ...(document.querySelector('.tekst-detaljna')?.children || []),
          ].flatMap(block),
          trailingSpace: !!document.querySelector(
            '.base-container.full-width > .container-wrapper-2',
          ),
          directory: [...document.querySelectorAll('.teaser-copy-wrap')].map(
            (step, i) => ({
              ...card(step),
              desktop: image(desktop[i]),
              mobile: image(step.querySelector('.teaser-img-tablet-down img')),
              mobilePosition: getComputedStyle(
                step.querySelector('.teaser-img-tablet-down img'),
              ).objectPosition,
              showArrow: !!step.querySelector('.home-service-card-hp svg'),
              actionLayout:
                getComputedStyle(step.querySelector('.link-block-5')).width ===
                '44px'
                  ? 'wide-arrow'
                  : 'standard',
            }),
          ),
          related: [
            ...document.querySelectorAll(
              '.container-wrapper-list-detail .home-service-card',
            ),
          ].map(card),
          hiddenSourceSections: [
            ...document.querySelectorAll('.tekst-detaljna .skriveni'),
          ].map((e) => text(e.querySelector('.medjunaslov-h2-detaljna'))),
        };
      },
      { route, desktopLabelSpans, desktopBulletSpans },
    );
    result.push({
      ...content,
      source: {
        file,
        sha256: createHash('sha256').update(html).digest('hex'),
        approval: 'review',
      },
    });
  }
  await writeFile(
    'src/content/inner-pages-it.json',
    JSON.stringify(result, null, 2) + '\n',
  );
  console.log(
    `Transcribed ${result.length} Italian pages; no template HTML or Webflow runtime emitted.`,
  );
} finally {
  await browser.close();
}
