import data from './inner-pages-it.json';
import { bindReferenceBusiness } from './reference-bindings';
import { completeRelatedServices } from './related-services';
export type InlineContent =
  | { kind: 'text'; text: string }
  | { kind: 'break' }
  | {
      kind: 'strong' | 'em' | 'sup' | 'sub' | 'qualification';
      children: InlineContent[];
    }
  | {
      kind: 'link';
      href: string;
      children: InlineContent[];
      variant?: 'plain' | 'underlined' | 'hero-phone' | 'native';
    };
export interface ContentPhoto {
  image: string;
  alt: string;
}
export interface PageCard {
  title: string;
  href: string;
  eyebrow: string;
  description: string;
  price: string;
  copyLayout: 'stack' | 'flow';
  priceInset: boolean;
}
export interface DirectoryCard extends PageCard {
  desktop: ContentPhoto;
  mobile: ContentPhoto;
  mobilePosition: string;
  showArrow: boolean;
  actionLayout: 'standard' | 'wide-arrow';
}
export type ContentBlock = { id?: string } & (
  | { type: 'list'; ordered: boolean; items: ContentBlock[][] }
  | { type: 'contact-row'; cells: InlineContent[][]; border: boolean }
  | { type: 'paragraph'; content: InlineContent[]; variant: string }
  | {
      type: 'heading';
      content: InlineContent[];
      rank: 2 | 3;
      variant: string;
      flush: boolean;
      compact?: boolean;
    }
  | {
      type: 'bullet';
      content: InlineContent[];
      icon: boolean;
      variant: string;
      small?: boolean;
      labelSpan?: 1 | 2;
      smallLabelSpan?: 1 | 2;
    }
  | { type: 'group'; variant: string; children: ContentBlock[] }
  | { type: 'image'; variant: string; image: string; alt: string }
  | { type: 'anchor'; variant: string }
  | { type: 'faq'; question: string; answer: InlineContent[] }
  | {
      type: 'comparison';
      before: ContentPhoto;
      after: ContentPhoto;
      beforeLabel: string;
      afterLabel: string;
    }
  | { type: 'youtube'; videoId: string; title: string }
  | { type: 'map'; src: string }
  | {
      type: 'review-source';
      label: string;
      stars: ContentPhoto[];
      logo: ContentPhoto;
    }
);
export interface PageSidebar {
  mobilePlacement: 'before' | 'after';
  map?: string;
  type: 'package' | 'navigation';
  title: string;
  secondary: string;
  introduction: string;
  items: {
    label: string;
    href: string;
    note: boolean;
    icon: boolean;
    labelSpan: 1 | 2;
    smallLabelSpan: 1 | 2;
    id?: string;
  }[];
  position: 'before' | 'after';
}
export interface InnerPage {
  referenceRoute?: string;
  route: string;
  lang: string;
  title: string;
  description: string;
  typography: 'brand' | 'reference-default';
  breadcrumb: { label: string; href: string }[];
  hero: {
    title: string;
    eyebrow: string;
    description: InlineContent[];
    photo?: ContentPhoto;
    variant: 'directory' | 'photo' | 'plain' | 'specialists';
  };
  sidebar?: PageSidebar;
  blocks: ContentBlock[];
  trailingSpace: boolean;
  directory: DirectoryCard[];
  related: PageCard[];
  source: { file: string; sha256: string; approval: 'review' };
  hiddenSourceSections: string[];
}
// A generated transcription, not an approved production content database.
export const innerPages = completeRelatedServices(
  (data as InnerPage[]).map((page) =>
    ['/condizioni-di-utilizzo', '/informativa-sulla-privacy'].includes(
      page.route,
    )
      ? page
      : bindReferenceBusiness(page),
  ),
  '/prestazioni-dentali',
);
