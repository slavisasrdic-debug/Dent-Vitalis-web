import type { ContentBlock, InlineContent } from './inner-pages';
import { plain } from './seo';

// Presentation only: retain the complete, language-specific source wording.
export function specialistEndorsement(
  blocks: ContentBlock[],
  lang: string,
): ContentBlock[] {
  const regular = (parts: InlineContent[]): InlineContent[] =>
    parts.flatMap((part) =>
      part.kind === 'strong' || part.kind === 'em'
        ? regular(part.children)
        : [part],
    );
  return blocks.map((block) => {
    if (block.type !== 'group' || block.variant !== 'callout') return block;
    const paragraphs: ContentBlock[] = [];
    for (const [index, child] of block.children.entries()) {
      if (lang === 'it' && index === 0 && child.type === 'paragraph') {
        const split = child.content.findIndex((part) =>
          plain([part]).includes('Manuel Mingione'),
        );
        if (split < 0) throw new Error('Missing endorsement attribution');
        paragraphs.push(
          {
            ...child,
            variant: 'endorsement-quote',
            content: regular(child.content.slice(0, split)),
          },
          {
            ...child,
            variant: 'endorsement-credit',
            content: regular(child.content.slice(split)),
          },
        );
      } else if (child.type === 'paragraph') {
        paragraphs.push({
          ...child,
          variant:
            lang === 'hr' && index < 2
              ? 'endorsement-quote'
              : 'endorsement-credit',
          content: regular(child.content),
        });
      } else if (child.type === 'bullet') {
        paragraphs.push({
          ...child,
          variant: 'endorsement-credit',
          small: true,
          icon: true,
          labelSpan: 1,
          smallLabelSpan: 1,
          content: regular(child.content),
        });
      } else paragraphs.push(child);
    }
    return { ...block, variant: 'callout endorsement', children: paragraphs };
  });
}
