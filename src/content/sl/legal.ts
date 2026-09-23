import publicLegal from './legal-public.json';
import { slovenianLegalRoutes, legalLinks } from './legal-routes';
import type { ContentBlock, InnerPage } from '../inner-pages';
import { plain } from '../seo';
import { alt } from './assets';

// User approved the existing public Slovenian legal articles, including their
// structure and links. The original HTML and its SHA-256 remain immutable.
export const slovenianLegalPages: InnerPage[] = publicLegal.map((source) => {
  const blocks = source.blocks as ContentBlock[];
  const introduction = blocks.find((block) => block.type === 'paragraph');
  if (introduction?.type !== 'paragraph')
    throw new Error(`Missing legal introduction: ${source.route}`);
  const description =
    plain(introduction.content).match(/^.*?[.!?](?=\s|$)/s)?.[0] ??
    plain(introduction.content);
  return {
    route: source.route,
    referenceRoute:
      source.route === slovenianLegalRoutes.privacy
        ? '/informativa-sulla-privacy'
        : '/condizioni-di-utilizzo',
    lang: 'sl',
    title: `${source.title} | DentVitalis`,
    description,
    typography: 'reference-default',
    breadcrumb: [
      { label: 'DentVitalis', href: '/si/' },
      { label: source.title, href: source.route },
    ],
    hero: {
      title: source.title,
      eyebrow: '',
      description: [],
      variant: 'photo',
      photo: {
        image: 'Prima-visita-gratuita.webp',
        alt: alt('Prima-visita-gratuita.webp'),
      },
    },
    blocks,
    sidebar: {
      type: 'navigation',
      title: 'Pravne informacije',
      secondary: '',
      introduction: '',
      position: 'after',
      mobilePlacement: 'before',
      items: legalLinks.map((link) => ({
        ...link,
        note: false,
        icon: false,
        labelSpan: 1,
        smallLabelSpan: 1,
      })),
    },
    trailingSpace: false,
    directory: [],
    related: [],
    hiddenSourceSections: [],
    source: {
      file: source.source.file,
      sha256: source.source.sha256,
      approval: 'review',
    },
  };
});
