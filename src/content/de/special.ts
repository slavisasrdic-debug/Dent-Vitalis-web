import {
  innerPages,
  type ContentBlock,
  type PageSidebar,
  type InnerPage,
} from '../inner-pages';
import { t, text, bilingual, inline, row, ref, p, h, group } from './source';
import { label } from './site';

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
  ...[0, 1, 2, 3, 4, 5, 6].map((n) => ref(22, 1, n)),
  ref(23, 0, 9),
  ref(23, 0, 11),
  ...[1, 2, 3, 4, 5, 6].map((n) => ref(24, 1, n)),
];
if (pairs.length !== captions.length)
  throw new Error('German gallery must retain all 15 source photo pairs');
const galleryBlocks: ContentBlock[] = [];
const sections = [
  {
    start: 0,
    end: 7,
    title: text('p215'),
    id: 'aesthetik',
    intro: row(22, 0, '1 3 5'),
  },
  {
    start: 7,
    end: 9,
    title: bilingual('p220'),
    id: 'funktion',
    intro: row(23, 0, '1 3 5'),
  },
  {
    start: 9,
    end: 15,
    title: text('p225'),
    id: 'rehabilitation',
    intro: row(24, 0, '1 3 4 6 8'),
  },
];
for (const section of sections) {
  galleryBlocks.push(heading(section.title, section.id), ...section.intro);
  for (let i = section.start; i < section.end; i++)
    galleryBlocks.push(
      group([
        {
          ...pairs[i]!,
          before: {
            ...pairs[i]!.before,
            alt: `${text(captions[i]!)} — vorher`,
          },
          after: { ...pairs[i]!.after, alt: `${text(captions[i]!)} — nachher` },
          beforeLabel: 'Vorher',
          afterLabel: 'Nachher',
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
  [10, 11, 13, 14, 16],
  [19, 20],
  [22, 23],
  [25, 26],
  [28, 29, 30, 31],
  [34, 35, 36, 37, 38],
  [41, 42, 43],
  [46, 47],
  [50, 51, 52],
].map(([name, ...paras]) =>
  review(
    ref(19, 0, name!),
    paras.map((n) => ref(19, 0, n)),
    true,
  ),
);
const postReviews = [
  [111, 112],
  [113, 114],
  [116, 117],
  [118, 119, 120],
  [122, 123],
  [125, 126],
  [128, 129],
  [130, 131, 132],
  [134, 135],
  [137, 138, 139, 140, 141],
  [142, 143, 144, 145],
  [146, 147, 148, 149],
  [150, 151, 152, 153, 154, 155, 156],
  [157, 158, 159],
  [160, 161, 162, 163],
  [164, 165, 166, 167],
  [169, 170, 171],
  [173, 174, 175, 176],
  [177, 178, 179, 180],
  [182, 183, 184, 185, 186],
  [187, 188, 189, 190, 191, 192, 193, 194, 195],
];
// Empty DOCX separators are not body copy. Explicit IDs below are checked by text().
const videos = innerPages
  .find((p) => p.route === '/testimonianze')!
  .blocks.filter((b) => b.type === 'youtube');
const testimonialSections: [string, string][] = [
  [text('p105'), 'video'],
  ['Google-Bewertungen', 'google'],
  [text('p108'), 'post'],
];

export const specialPages: Special[] = [
  {
    id: 'gallery',
    title: label('gallery'),
    description: text('p213'),
    blocks: galleryBlocks,
    sidebar: sidebar(
      label('gallery'),
      sections.map((s) => [s.title, s.id]),
    ),
  },
  {
    id: 'testimonials',
    title: label('testimonials'),
    description: t(1, 8, 2),
    sidebar: sidebar(label('testimonials'), testimonialSections, 'before'),
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
    title: label('contact'),
    description: text('p232'),
    sidebar: {
      ...sidebar(text('p31'), []),
      map: innerPages.find((p) => p.route === '/contatti')!.sidebar!.map!,
    },
    blocks: [
      group(row(25, 0, '0 1 2 3'), 'contact-address'),
      group([heading(text('p236')), ...row(26, 0, '1 2')], 'contact-card'),
      group(
        [
          heading(text('p240')),
          ...row(27, 0, '0 1 2'),
          {
            type: 'paragraph',
            variant: 'body',
            content: [
              {
                kind: 'link',
                href: 'https://wa.me/' + t(27, 0, 3).replace(/\D/g, ''),
                children: [{ kind: 'text', text: t(27, 0, 3) }],
              },
            ],
          },
        ],
        'contact-card',
      ),
      group(
        [
          heading(text('p245')),
          ...[1, 4, 7].map((n): ContentBlock => ({
            type: 'contact-row',
            border: false,
            cells: [
              inline(t(28, 0, n)),
              n === 7
                ? [
                    {
                      kind: 'link',
                      href:
                        'https://wa.me/' + t(28, 0, n + 1).replace(/\D/g, ''),
                      children: inline(t(28, 0, n + 1)),
                    },
                  ]
                : inline(t(28, 0, n + 1)),
            ],
          })),
        ],
        'contact-card',
      ),
      group([heading(text('p250')), ...row(29, 0, '1')], 'contact-card'),
    ],
  },
];
