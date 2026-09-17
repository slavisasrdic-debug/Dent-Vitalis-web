import data from './inner-pages-it.json';
import { bindReferenceBusiness } from './reference-bindings';
import { completeRelatedServices } from './related-services';
import { labelParkingLinks } from './parking-link-labels';
import { applyItalianCorrections } from './editorial-corrections';
import { linkDoctorResearch } from './doctor-research';
import { applyPublicLegal } from './legal-public';
import { replaceItalianPaymentCode } from './payment-code';
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
      variant?: 'plain' | 'underlined' | 'hero-phone' | 'native' | 'contact';
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
  | { type: 'payment-code' }
  | {
      type: 'list';
      ordered: boolean;
      listStyle?: 'lower-alpha';
      items: ContentBlock[][];
    }
  | { type: 'contact-row'; cells: InlineContent[][]; border: boolean }
  | { type: 'paragraph'; content: InlineContent[]; variant: string }
  | {
      type: 'heading';
      content: InlineContent[];
      rank: 2 | 3 | 4;
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

// Interlinking in editorial copy is intentionally deferred until the content
// review is complete. Keep contact and external links (tel:, mailto:, http(s))
// intact, but render internal editorial links as their original text.
function stripEditorialInternalLinks(parts: InlineContent[]): InlineContent[] {
  return parts.flatMap((part) => {
    if (part.kind !== 'link') return [part];
    if (!part.href.startsWith('/') && !part.href.startsWith('#')) return [part];
    return stripEditorialInternalLinks(part.children);
  });
}

function stripEditorialLinks(blocks: ContentBlock[]): ContentBlock[] {
  return blocks.map((block) => {
    if (block.type === 'group')
      return { ...block, children: stripEditorialLinks(block.children) };
    if (block.type === 'paragraph' || block.type === 'bullet')
      return { ...block, content: stripEditorialInternalLinks(block.content) };
    if (block.type === 'heading')
      return { ...block, content: stripEditorialInternalLinks(block.content) };
    if (block.type === 'faq')
      return { ...block, answer: stripEditorialInternalLinks(block.answer) };
    if (block.type === 'contact-row')
      return {
        ...block,
        cells: block.cells.map((cell) => stripEditorialInternalLinks(cell)),
      };
    return block;
  });
}

// A generated transcription, not an approved production content database.
export const innerPages = completeRelatedServices(
  (data as InnerPage[])
    .map(applyItalianCorrections)
    .map(linkDoctorResearch)
    .map(applyPublicLegal)
    .map(replaceItalianPaymentCode)
    .map((page) => ({ ...page, blocks: stripEditorialLinks(page.blocks) }))
    .map((page) =>
      ['/condizioni-di-utilizzo', '/informativa-sulla-privacy'].includes(
        page.route,
      )
        ? page
        : bindReferenceBusiness(page),
    )
    .map((page) =>
      page.route === '/su-di-noi/come-raggiungerci'
        ? { ...page, blocks: labelParkingLinks(page.blocks, 'it') }
        : page,
    ),
  '/prestazioni-dentali',
);
