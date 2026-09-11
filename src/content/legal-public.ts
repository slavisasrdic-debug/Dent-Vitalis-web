import publicLegal from './legal-public.json';
import type { ContentBlock, InnerPage } from './inner-pages';

// User approved the current public Italian legal text on 2026-09-11.
// HR keeps its already identical, previously approved source snapshot.
export function applyPublicLegal(page: InnerPage): InnerPage {
  if (page.lang !== 'it') return page;
  const source = publicLegal.find((item) => item.route === page.route);
  if (!source) return page;
  return {
    ...page,
    hero: { ...page.hero, title: source.title },
    breadcrumb: page.breadcrumb.map((item, index) =>
      index === page.breadcrumb.length - 1
        ? { ...item, label: source.title }
        : item,
    ),
    blocks: source.blocks as ContentBlock[],
    source: {
      file: source.source.file,
      sha256: source.source.sha256,
      approval: 'review',
    },
  };
}
