import type { ContentBlock } from './inner-pages';

// Presentation mapping against the immutable accepted privacy snapshots.
// Reuse the exact inline nodes; never rewrite legal labels or paragraph text.
export function privacyPresentation(
  blocks: ContentBlock[],
  lang: string,
): ContentBlock[] {
  const heading = (block: ContentBlock, rank: 2 | 3 | 4): ContentBlock => {
    if (block.type !== 'paragraph' && block.type !== 'heading')
      throw new Error('Privacy heading source structure changed');
    return {
      ...block,
      type: 'heading',
      rank,
      variant: rank === 2 ? 'section' : 'subsection',
      flush: false,
    };
  };
  if (lang === 'hr') {
    // Every ordered list in the public HR article uses type="a", not just
    // the list of rights. Preserve nested unordered lists and every inline node.
    const listStyles = (items: ContentBlock[]): ContentBlock[] =>
      items.map((block) =>
        block.type === 'list'
          ? {
              ...block,
              ...(block.ordered ? { listStyle: 'lower-alpha' as const } : {}),
              items: block.items.map(listStyles),
            }
          : block,
      );
    blocks = listStyles(blocks);
    // Source classes: question / policy-title / policy-section-title.
    const main = new Set([0, 2, 9, 11, 15, 18, 20, 22, 24, 26, 30]);
    const sections = new Set([34, 36, 38, 41, 44, 47, 49, 51, 55]);
    return blocks.map((block, index) => {
      if (main.has(index)) return heading(block, 2);
      if (sections.has(index)) return heading(block, 3);
      if (index === 50) {
        if (block.type !== 'list')
          throw new Error('Privacy rights list changed');
        return {
          ...block,
          id: 'privacy-rights',
          items: block.items.map((item) =>
            item.map((child, i) => (i === 0 ? heading(child, 4) : child)),
          ),
        };
      }
      return block;
    });
  }
  // Italian public-source extraction now carries the source list structure
  // and heading hierarchy directly; do not flatten or renumber it again.
  return blocks;
}
