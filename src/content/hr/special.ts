import {
  innerPages,
  type ContentBlock,
  type PageSidebar,
  type InnerPage,
} from '../inner-pages';
import legal from './legal.json';
import { t, text, bilingual, inline, row, ref, p, h, group } from './source';
import { labels, legalNavigation } from './site';
import { flatten, plain } from '../seo';

interface Special {
  id: string;
  title: string;
  description: string;
  blocks: ContentBlock[];
  sidebar?: PageSidebar;
  source?: InnerPage['source'];
}
const heading = (title: string, id?: string): ContentBlock => ({
  type: 'heading',
  rank: 2,
  variant: 'gallery-section',
  flush: false,
  content: inline(title),
  ...(id ? { id } : {}),
});
const sidebar = (
  title: string,
  items: [string, string][],
  mobilePlacement: 'before' | 'after' = 'after',
): PageSidebar => ({
  type: 'navigation',
  title,
  secondary: '',
  introduction: '',
  mobilePlacement,
  position: 'before',
  items: items.map(([label, id]) => ({
    label,
    href: `#${id}`,
    icon: false,
    note: false,
    labelSpan: 2,
    smallLabelSpan: 2,
  })),
});

// Page-to-page navigation, not a table of contents derived from legal headings.
// Keep the same desktop/mobile placement and item spans as the Italian variant.
const legalSidebar: PageSidebar = {
  type: 'navigation',
  title: legalNavigation.title,
  secondary: '',
  introduction: '',
  mobilePlacement: 'before',
  position: 'after',
  items: legalNavigation.links.map((item) => ({
    ...item,
    icon: false,
    note: false,
    labelSpan: 1,
    smallLabelSpan: 1,
  })),
};

const galleryReference = innerPages.find(
  (p) => p.route === '/domande-e-risposte',
)!;
const pairs = galleryReference.blocks.flatMap((block) =>
  block.type === 'group'
    ? block.children.filter(
        (b): b is Extract<ContentBlock, { type: 'comparison' }> =>
          b.type === 'comparison',
      )
    : [],
);
const captions = [
  ...[0, 1, 2, 3, 4, 5, 6].map((n) => ref(24, 1, n)),
  ref(25, 0, 9),
  ref(25, 0, 11),
  ...[1, 2, 3, 4, 5, 6].map((n) => ref(26, 1, n)),
];
if (pairs.length !== captions.length)
  throw new Error('Croatian gallery must retain all 15 source photo pairs');
const galleryBlocks: ContentBlock[] = [];
const sections = [
  {
    start: 0,
    end: 7,
    title: bilingual('p357'),
    id: 'estetika',
    intro: row(24, 0, '1 3 5'),
  },
  {
    start: 7,
    end: 9,
    title: bilingual('p362'),
    id: 'funkcija',
    intro: row(25, 0, '1 3 5'),
  },
  {
    start: 9,
    end: 15,
    title: bilingual('p367'),
    id: 'rehabilitacija',
    intro: row(26, 0, '1 3 4 6 8'),
  },
];
for (const section of sections) {
  galleryBlocks.push(heading(section.title, section.id), ...section.intro);
  for (let i = section.start; i < section.end; i++)
    galleryBlocks.push(
      group([
        {
          ...pairs[i]!,
          before: { ...pairs[i]!.before, alt: `${text(captions[i]!)} — prije` },
          after: { ...pairs[i]!.after, alt: `${text(captions[i]!)} — poslije` },
          beforeLabel: 'Prije',
          afterLabel: 'Poslije',
        },
        p(captions[i]!, 'caption'),
      ]),
    );
}
function review(
  name: string,
  paragraphs: string[],
  google = false,
): ContentBlock {
  return group(
    [
      { ...h(name), variant: 'review' },
      ...(google
        ? [
            {
              type: 'review-source' as const,
              label: 'Google',
              stars: [],
              logo: { image: 'Google-logo1200px.svg', alt: '' },
            },
          ]
        : []),
      group(paragraphs.map((id) => p(id))),
    ],
    'review',
  );
}
const googleReviews = [
  [2, 3, 4, 5, 6],
  [8, 9],
  [12, 13, 15, 16, 18],
  [21, 22],
  [24, 25],
  [27, 28],
  [30, 31, 32, 33],
  [36, 37, 38, 39, 40],
  [43, 44, 45],
  [48, 49],
  [52, 53, 54],
].map(([name, ...paras]) =>
  review(
    ref(20, 0, name!),
    paras.map((n) => ref(20, 0, n)),
    true,
  ),
);
const postReviews = [
  [217, 218],
  [219, 220],
  [222, 223],
  [224, 225, 226],
  [228, 229],
  [231, 232],
  [234, 235],
  [237, 238, 239],
  [241, 242],
  [244, 245, 246, 247, 248],
  [250, 251, 252, 253],
  [255, 256, 257, 258],
  [260, 261, 262, 263, 264, 265, 266],
  [268, 269, 270],
  [272, 273, 274, 275],
  [277, 278, 279, 280],
  [282, 283, 284],
  [286, 287, 288, 289],
  [290, 291, 292, 293],
  [295, 296, 297, 298, 299],
  [301, 302, 303, 304, 305, 306, 307, 308, 309],
];
// Empty DOCX separators are not body copy. Explicit IDs below are checked by text().
const videos = innerPages
  .find((p) => p.route === '/testimonianze')!
  .blocks.filter((b) => b.type === 'youtube');
const testimonialSections: [string, string][] = [
  ['Video iskustva pacijenata', 'video'],
  ['Google recenzije', 'google'],
  [text('p126'), 'post'],
];

export const specialPages: Special[] = [
  {
    id: 'gallery',
    title: labels.gallery,
    description: text('p355'),
    blocks: galleryBlocks,
    sidebar: sidebar(
      labels.gallery,
      sections.map((s) => [s.title, s.id]),
    ),
  },
  {
    id: 'testimonials',
    title: labels.testimonials,
    description: t(1, 8, 2),
    sidebar: sidebar(labels.testimonials, testimonialSections, 'before'),
    blocks: [
      heading(testimonialSections[0]![0], 'video'),
      ...videos,
      heading(testimonialSections[1]![0], 'google'),
      group(googleReviews, 'reviews'),
      heading(testimonialSections[2]![0], 'post'),
      ...postReviews.map(([name, ...paras]) =>
        review(
          `p${name}`,
          paras.map((n) => `p${n}`),
        ),
      ),
    ],
  },
  {
    id: 'contact',
    title: labels.contact,
    description: text('p375'),
    sidebar: {
      ...sidebar(bilingual('p32'), []),
      map: innerPages.find((p) => p.route === '/contatti')!.sidebar!.map!,
    },
    blocks: [
      group(row(27, 0, '0 1 2 3'), 'contact-address'),
      group([heading(bilingual('p379')), ...row(28, 0, '1 2')], 'contact-card'),
      group([heading(bilingual('p383')), ...row(29, 0, '0 1')], 'contact-card'),
      group([heading(bilingual('p393')), ...row(31, 0, '1')], 'contact-card'),
    ],
  },
  ...legal.map((page, i) => {
    const blocks = structuredClone(page.blocks) as ContentBlock[];
    function localLinks(value: unknown): void {
      if (!value || typeof value !== 'object') return;
      if (
        'kind' in value &&
        value.kind === 'link' &&
        'href' in value &&
        typeof value.href === 'string'
      ) {
        if (value.href === 'https://www.dentvitalis.com/hr')
          value.href = '/hr/';
        else if (value.href.startsWith('https://www.dentvitalis.com/hr/'))
          value.href = value.href.replace('https://www.dentvitalis.com', '');
      }
      Object.values(value).forEach(localLinks);
    }
    localLinks(blocks);
    const first = flatten(blocks).find((b) => b.type === 'paragraph');
    if (first?.type !== 'paragraph')
      throw new Error(`Missing legal introduction: ${page.route}`);
    return {
      id: i === 0 ? 'privacy' : 'terms',
      title: page.title,
      description: plain(first.content)
        .trim()
        .replace(/\s+/g, ' ')
        .split(/(?<=[.!?])\s+/)[0]!,
      blocks,
      sidebar: legalSidebar,
      source: page.source as InnerPage['source'],
    };
  }),
];
