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
  let regulation = false;
  return blocks.map((block) => {
    if (block.type !== 'heading') return block;
    if (
      block.content.some(
        (node) =>
          node.kind === 'text' &&
          node.text === 'Regolamento sul trattamento dei dati personali',
      )
    ) {
      regulation = true;
      return block;
    }
    if (!regulation) return block;
    const numbered = block.content.some(
      (node) => node.kind === 'text' && /^[1-8]\. /.test(node.text),
    );
    return heading(block, numbered ? 4 : 3);
  });
}
