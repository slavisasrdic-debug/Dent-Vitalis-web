import corrections from '../../data/editorial-corrections.json';
import type { ContentBlock, InnerPage } from './inner-pages';

/** Only this approved paragraph changes; generated/source snapshots stay intact. */
export function applyItalianCorrections(page: InnerPage): InnerPage {
  const correction = corrections.italianDoctor;
  if (page.route !== correction.route) return page;
  let matches = 0;
  const update = (blocks: ContentBlock[]): ContentBlock[] =>
    blocks.map((block) => {
      if (block.type === 'group')
        return { ...block, children: update(block.children) };
      if (block.type !== 'paragraph') return block;
      return {
        ...block,
        content: block.content.map((part) => {
          if (part.kind !== 'text' || !part.text.startsWith(correction.from))
            return part;
          matches++;
          return {
            ...part,
            text: part.text.replace(correction.from, correction.to),
          };
        }),
      };
    });
  const blocks = update(page.blocks);
  if (matches !== 1)
    throw new Error(
      `Doctor correction expected one source paragraph, found ${matches}`,
    );
  return { ...page, blocks };
}
