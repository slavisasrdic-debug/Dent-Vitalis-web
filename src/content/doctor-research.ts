import type { ContentBlock, InnerPage, InlineContent } from './inner-pages';

// Verified publisher record: Ana Beljan is a co-author of this 2017 abstract.
// Evidence and Word paragraph IDs: docs/ana-beljan-research.md.
export const anaResearchUrl = 'https://doi.org/10.1111/clr.320_13042';

export function linkDoctorResearch(page: InnerPage): InnerPage {
  if ((page.referenceRoute ?? page.route) !== '/su-di-noi/i-nostri-specialisti')
    return page;
  let matches = 0;
  const inline = (parts: InlineContent[]): InlineContent[] =>
    parts.flatMap((part): InlineContent[] => {
      if (
        part.kind === 'link' &&
        part.href === '#' &&
        part.children.some(
          (child) =>
            child.kind === 'text' &&
            child.text.includes(
              'Valutazione comparativa del protocollo All-on-4',
            ),
        )
      ) {
        matches++;
        return [{ ...part, href: anaResearchUrl }];
      }
      if (part.kind === 'text') {
        const match = part.text.match(
          /„Komparativna evaluacija All-on-4 protokola između različitih implantoloških sustava \(3-godišnje praćenje\)”/,
        );
        if (match && match.index !== undefined) {
          matches++;
          return [
            { kind: 'text', text: part.text.slice(0, match.index) },
            {
              kind: 'link',
              href: anaResearchUrl,
              variant: 'underlined',
              children: [{ kind: 'text', text: match[0] }],
            },
            {
              kind: 'text',
              text: part.text.slice(match.index + match[0].length),
            },
          ];
        }
      }
      return [part];
    });
  const update = (blocks: ContentBlock[]): ContentBlock[] =>
    blocks.map((block) => {
      if (block.type === 'group')
        return { ...block, children: update(block.children) };
      if (block.type === 'paragraph')
        return { ...block, content: inline(block.content) };
      return block;
    });
  const blocks = update(page.blocks);
  if (matches !== 1)
    throw new Error(
      `Expected one Ana Beljan research title on ${page.route}, found ${matches}`,
    );
  return { ...page, blocks };
}
