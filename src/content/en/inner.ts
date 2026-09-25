import {
  innerPages as italianPages,
  type InnerPage,
  type ContentBlock,
  type PageSidebar,
} from '../inner-pages';
import { source, t, text, inline, row, ref, p, h, group, faq } from './source';
import { route } from './routes';
import { italianRoute, hrRoutes } from '../hr/routes';
const pageRoutes = hrRoutes.map((entry) => ({
  ...entry,
  localPath: route(entry.page_id),
}));
import { label, navigation } from './site';
import { services, aboutCards } from './home';
import { alt } from './assets';
import { specialPages } from './special';
import { labelParkingLinks } from '../parking-link-labels';
import { anaResearchUrl } from '../doctor-research';
import { linkFirstVisitFaq } from '../faq-first-visit-link';
import { emphasizePaymentCardEligibility } from '../payment-card-highlight';

function base(id: string, title: string, description: string): InnerPage {
  const original = italianPages.find((p) => p.route === italianRoute(id))!;
  const page: InnerPage = {
    ...original,
    referenceRoute: original.route,
    route: route(id),
    lang: 'en',
    title: `${title} | DentVitalis`,
    description,
    source,
    blocks: [],
    directory: [],
    related: [],
    hiddenSourceSections: [],
    hero: {
      ...original.hero,
      title,
      eyebrow: '',
      description: inline(description),
      ...(original.hero.photo
        ? {
            photo: {
              ...original.hero.photo,
              alt: alt(original.hero.photo.image),
            },
          }
        : {}),
    },
    breadcrumb: original.breadcrumb.map((item, i) => {
      const target = pageRoutes.find((r) => r.it_path === item.href);
      return {
        label:
          i === original.breadcrumb.length - 1
            ? label(id)
            : target
              ? label(target.page_id)
              : label('home'),
        href: target ? target.localPath : '',
      };
    }),
  };
  delete page.sidebar;
  if (original.sidebar?.type === 'navigation') {
    const category = navigation.find((g) =>
      g.children.some((c) => c.href === page.route),
    );
    if (category)
      page.sidebar = {
        ...original.sidebar,
        title: category.label,
        items: original.sidebar.items.flatMap((item) => {
          const target = pageRoutes.find((r) => r.it_path === item.href);
          return target
            ? [
                {
                  ...item,
                  label: label(target.page_id),
                  href: target.localPath,
                },
              ]
            : [];
        }),
      };
  }
  return page;
}
const pages: InnerPage[] = [];
function add(
  id: string,
  title: string,
  description: string,
  blocks: ContentBlock[],
) {
  const page = base(id, title, description);
  page.blocks = id === 'directions' ? labelParkingLinks(blocks, 'en') : blocks;
  pages.push(page);
  return page;
}
function packageSidebar(
  table: number,
  price: number,
  intro: number,
  items: number[],
): PageSidebar {
  return {
    type: 'package',
    title: t(table, 0, price),
    secondary: '',
    introduction: t(table, 0, intro),
    mobilePlacement: 'before',
    position: 'before',
    items: items.map((n) => ({
      label: t(table, 0, n),
      href: '',
      icon: true,
      note: false,
      labelSpan: 1,
      smallLabelSpan: 1,
    })),
  };
}
function section(table: number, rowIndex: number, selection: string) {
  return group(row(table, rowIndex, selection));
}

const denture = add('four-implant-denture', t(2, 0, 2), t(2, 0, 4), [
  ...row(2, 0, '20 21 h:23 b:25 b:26 b:27 b:28 b:29 31'),
  ...row(2, 1, 'h:0'),
  ...['h3:2 3', 'h3:5 6', 'h3:8 9', 'h3:11 12', 'h3:14 15', 'h3:17 18'].map(
    (s) => section(2, 1, s),
  ),
]);
denture.hero.eyebrow = t(2, 0, 1);
denture.sidebar = packageSidebar(2, 6, 9, [11, 12, 13, 14, 15, 16, 17, 18]);
const bridge = add('fixed-implant-bridge', t(1, 3, 3), t(3, 0, 4), [
  ...row(3, 0, '19 21 h:23 b:25 b:26 b:27 b:28 b:29 31'),
  ...row(3, 1, 'h:0'),
  ...['h3:2 3', 'h3:5 6', 'h3:8 9', 'h3:11 12', 'h3:14 15', 'h3:17 18'].map(
    (s) => section(3, 1, s),
  ),
]);
bridge.hero.eyebrow = t(3, 0, 0);
bridge.sidebar = packageSidebar(3, 6, 8, [10, 11, 12, 13, 14, 15, 16]);
const whitening = add('whitening', t(4, 0, 3), t(4, 0, 5), [
  ...row(4, 0, '16 18 20 22'),
  ...row(4, 1, 'h:0'),
  ...['h3:1 2 3', 'h3:4 5', 'h3:7 8', 'h3:9 10'].map((s) => section(4, 1, s)),
  section(4, 2, '0 h:2 $:4 6 8 10'),
]);
whitening.hero.eyebrow = t(4, 0, 1);
whitening.sidebar = packageSidebar(4, 6, 8, [10, 11, 12, 13, 14]);
const crown = add('crowns-veneers-bridges', t(5, 0, 4), t(5, 0, 6), [
  ...row(5, 0, '19'),
  section(5, 1, 'h:0 $:1 3 5 7 9 11'),
  section(5, 2, 'h:0 2 4 6'),
  section(5, 3, 'h:0 $:2 h3:4 6 h3:8 10 12'),
  section(5, 4, 'h:0 $:2 4 6 8 10 h3:12 b:14 b:15 b:16 b:17'),
  section(5, 5, 'h:0 h3:2 3 h3:5 6 h3:8 9 h3:11 12'),
]);
crown.hero.eyebrow = t(5, 0, 2);
crown.sidebar = {
  ...packageSidebar(5, 8, 8, [10, 12, 14, 16]),
  title: t(1, 5, 7),
};

add('specialists', label('specialists'), t(6, 0, 1), [
  p(ref(6, 0, 3)),
  ...(
    [
      ['h:1 3 5 7 9', 'DV-Dr-Sime-Zivkocic-4.webp'],
      ['h:0 2 4 6 8', 'Zvonimir-Zivkovic.webp'],
      [
        'h:0 2 4 5 b:7 b:8 b:9 b:10 13 b:15 b:16 18 20',
        'Zoran-Jurković-dr.med.dent..jpg',
      ],
      ['h:0 1 3 5 7 9', 'Ana-Beljan-dr.med.dent.webp'],
      ['h:0 2 4 6', 'Domagoj-Žalac-dr.med.dent..webp'],
    ] as const
  ).flatMap(([selection, image], i) => {
    const blocks = row(6, i + 1, selection);
    blocks.splice(1, 0, {
      type: 'image',
      variant: 'portrait',
      image,
      alt: alt(image),
    });
    if (i === 1)
      blocks.push(group(row(6, 2, '10 12 14 16 b:18 b:20 b:22'), 'callout'));
    return blocks;
  }),
]);
add('all-in-one', label('all-in-one'), t(7, 0, 0), [
  section(7, 0, '2 4 6'),
  section(7, 1, 'h:0 1'),
  section(7, 2, 'h:0 2 3'),
  section(7, 3, 'h:0 2'),
  section(7, 4, 'h:0 1 3'),
  section(7, 5, 'h:0 2 4'),
]);
add('directions', label('directions'), t(8, 0, 0), [
  ...row(8, 0, '2'),
  section(8, 1, 'h:0 2 4'),
  section(8, 2, 'h:0 1 3 5 7 9 10'),
]);
add('laboratory', label('laboratory'), t(9, 0, 0), [
  ...row(9, 0, '2'),
  section(9, 1, 'h:0 2 4'),
  section(9, 2, 'h:0 1 3'),
]);
add('materials', label('materials'), text('p47'), [
  section(10, 0, 'h:0 2 b:4 b:5 b:6 b:7 b:8 b:9 b:10'),
  section(10, 1, 'h:0 2 b:4 b:5 b:6 b:7 b:8'),
  section(10, 2, 'h:0 2 4 5 b:7 b:8 b:9 b:10 b:11'),
  section(10, 3, 'h:0 2 4 b:6 b:7 b:8 b:9 b:10 b:11'),
]);
add('new-implants', label('new-implants'), text('p52'), [
  section(11, 0, '2 4 6 8'),
  section(11, 1, 'h:0 1 3 5'),
  ...['h:0 1', 'h:3 4', 'h:6 7', 'h:9 10', 'h:12 13 15'].map((s) =>
    section(11, 2, s),
  ),
]);
add('sedation', label('sedation'), text('p58'), [
  ...row(12, 0, '0'),
  section(12, 1, 'h:0 1 2 4 6'),
  section(12, 2, 'h:0 1 3'),
]);
add('first-visit', label('first-visit'), t(13, 0, 1), [
  ...row(13, 0, '3 5'),
  section(13, 1, 'h:0 2 4'),
  section(13, 2, 'h:0 2 4 6 8 b:10 b:11 b:12 b:13 15'),
  section(13, 3, 'h:0 2 4'),
]);
add('treatment-duration', label('treatment-duration'), t(14, 0, 0), [
  ...row(14, 0, '2 4'),
  section(14, 1, 'h:1 3 5 6'),
  section(14, 2, 'h:1 3 5'),
  section(14, 3, 'h:0 2 4'),
  section(14, 4, 'h:0 1 3'),
]);
add('payment', label('payment'), t(15, 0, 1), [
  ...row(15, 0, '3 6'),
  section(15, 1, 'h:0 2'),
  section(
    15,
    2,
    'h:0 2 4 h3:6 b:8 b:9 b:10 h3:12 b:14 b:15 b:16 b:17 h3:19 b:21 b:22 b:23 b:24',
  ),
  section(15, 3, 'h:2 4 6 8 10 12 14'),
  { type: 'payment-code' },
]);
add('guarantees', label('guarantees'), t(16, 0, 1), [
  section(16, 0, 'h:6 8 10 11 13'),
  section(16, 1, 'h:1 3 5 7 9'),
  section(16, 2, 'h:1 3 5 7'),
]);
add('accommodation', label('accommodation'), t(17, 0, 1), [
  section(17, 1, 'h:0 2 4 6'),
  section(17, 2, 'h:0 2 4'),
  section(17, 3, 'h:1 2 4'),
]);
function priceCard(
  r: number,
  title: number,
  items: number[],
  amount: number,
): ContentBlock {
  const heading = {
    ...h(ref(18, r, title)),
    flush: true,
    compact: !items.length,
  };
  const left = items.length
    ? items.map((n) => ({
        type: 'bullet' as const,
        content: inline(t(18, r, n)),
        icon: true,
        variant: 'check',
      }))
    : [heading];
  return group(
    [
      ...(items.length ? [heading] : []),
      group([
        group(
          [
            group(left, 'price-cell'),
            group(
              [group([p(ref(18, r, amount), 'price-list')], 'price-amount')],
              'price-cell',
            ),
          ],
          items.length ? 'price-row' : 'price-row-borderless',
        ),
      ]),
    ],
    'price-card',
  );
}
add('prices', label('prices'), t(18, 0, 0), [
  priceCard(2, 0, [2, 3, 4, 5, 6, 7, 8], 10),
  priceCard(3, 0, [2, 3, 4, 5, 6, 7, 8, 9], 11),
  priceCard(4, 1, [3, 4, 5, 6, 7, 8, 9], 11),
  priceCard(5, 0, [2, 4, 6, 8, 10, 12], 14),
  priceCard(6, 0, [], 1),
  priceCard(7, 0, [], 2),
  priceCard(8, 0, [], 2),
  priceCard(9, 0, [], 2),
]);

const questions = [
  faq(20, 0, 1, [3, 5]),
  faq(20, 1, 0, [2, 4, 5, 7]),
  faq(20, 2, 1, [3, 5, 7, 9]),
  faq(21, 0, 0, [2, 4, 6]),
  faq(21, 1, 1, [3]),
  faq(21, 2, 1, [3, 5]),
  faq(21, 3, 0, [2, 3, 4]),
  faq(21, 4, 0, [2, 4, 6]),
  faq(21, 5, 0, [2]),
  faq(21, 6, 1, [3]),
];
const faqPage = add('faq', label('faq'), text('p224'), [
  { ...h('p227'), id: 'dentistry' },
  ...questions.slice(0, 3),
  { ...h('p237'), id: 'dentvitalis' },
  ...questions.slice(3),
]);
faqPage.sidebar = {
  type: 'navigation',
  title: label('faq'),
  secondary: '',
  introduction: '',
  mobilePlacement: 'after',
  position: 'before',
  items: [
    ['dentistry', text('p227')],
    ['dentvitalis', text('p237')],
  ].map(([id, label]) => ({
    label: label!,
    href: '#' + id,
    icon: false,
    note: false,
    labelSpan: 2,
    smallLabelSpan: 2,
  })),
};

for (const spec of specialPages) {
  const page = add(spec.id, spec.title, spec.description, spec.blocks);
  if (spec.sidebar) page.sidebar = spec.sidebar;
  if (spec.source) page.source = spec.source;
}
for (const id of ['services', 'about', 'information']) {
  const original = italianPages.find((p) => p.route === italianRoute(id))!;
  const description =
    id === 'services' ? t(1, 1, 4) : id === 'about' ? t(1, 7, 3) : t(1, 9, 4);
  const page = add(id, label(id), description, []);
  page.directory = original.directory.flatMap((card) => {
    const target = pageRoutes.find((r) => r.it_path === card.href);
    if (!target) return [];
    const detail = pages.find((p) => p.route === target.localPath)!;
    const homeCard = [...services, ...aboutCards].find(
      (c) => c.href === target.localPath,
    );
    return [
      {
        ...card,
        title: homeCard?.title ?? label(target.page_id),
        href: target.localPath,
        eyebrow: homeCard?.eyebrow ?? '',
        description: homeCard?.description ?? detail.description,
        price: homeCard?.price ?? '',
        desktop: { ...card.desktop, alt: alt(card.desktop.image) },
        mobile: { ...card.mobile, alt: alt(card.mobile.image) },
      },
    ];
  });
}
// The directory contains all five translated services, including sedation.
// Home intentionally contains only four and is not the related-service catalogue.
const translatedServices = pages.find(
  (page) => page.route === route('services'),
)!.directory;
for (const page of pages) {
  const original = italianPages.find((p) => p.route === page.referenceRoute)!;
  page.related = original.related.flatMap((card) => {
    const target = pageRoutes.find((r) => r.it_path === card.href);
    const translated = translatedServices.find(
      (c) => c.href === target?.localPath,
    );
    return translated
      ? [
          {
            ...card,
            title: translated.title,
            href: translated.href,
            eyebrow: translated.eyebrow ?? '',
            description: translated.description,
            price: translated.price ?? '',
          },
        ]
      : [];
  });
}
// Link the exact translated research title without changing the source wording.
const specialists = pages.find((page) => page.route === route('specialists'))!;
const research = t(6, 4, 5);
const quoted = research.match(/“[^”]+”/)?.[0];
if (!quoted) throw new Error('Missing English Ana research title');
function linkResearch(blocks: ContentBlock[]): ContentBlock[] {
  return blocks.map((block) => {
    if (block.type === 'group')
      return { ...block, children: linkResearch(block.children) };
    if (
      block.type !== 'paragraph' ||
      !block.content.some(
        (part) => part.kind === 'text' && part.text === research,
      )
    )
      return block;
    const start = research.indexOf(quoted!);
    return {
      ...block,
      content: [
        { kind: 'text', text: research.slice(0, start) },
        { kind: 'link', href: anaResearchUrl, children: inline(quoted!) },
        { kind: 'text', text: research.slice(start + quoted!.length) },
      ],
    };
  });
}
specialists.blocks = linkResearch(specialists.blocks);
export const innerPagesEn = pages
  .map((page) =>
    linkFirstVisitFaq(page, {
      route: route('faq'),
      question: 'What should I bring to my first consultation?',
      word: 'here',
      href: route('first-visit'),
    }),
  )
  .map((page) =>
    emphasizePaymentCardEligibility(page, {
      route: route('payment'),
      phrase: 'issued by Croatian banks',
    }),
  );
