import corrections from '../../data/editorial-corrections.json';
import type { ContentBlock, InlineContent, InnerPage } from './inner-pages';

/** Exact source-ID exceptions; never rewrite place names in unrelated copy. */
export function applyContactAddressCorrection(
  value: string,
  lang: 'de' | 'en' | 'sl',
  id: string,
): string {
  const correction = corrections.contactAddressLocalization[
    lang
  ].replacements.find((item) => item.sourceId === id);
  if (!correction) return value;
  if (value !== correction.from)
    throw new Error(`Contact address source changed: ${lang}/${id}`);
  return correction.to;
}

/** Owner-approved exceptions; generated/source snapshots stay intact. */
export function applyItalianCorrections(page: InnerPage): InnerPage {
  const address = corrections.contactAddressLocalization.it;
  if (page.route === address.route) {
    let matches = 0;
    const updateParts = (parts: InlineContent[]): InlineContent[] =>
      parts.map((part) => {
        if (part.kind === 'text') {
          const item = address.replacements.find(
            (item) => part.text === item.from,
          );
          if (!item) return part;
          matches++;
          return { ...part, text: item.to };
        }
        if ('children' in part)
          return { ...part, children: updateParts(part.children) };
        return part;
      });
    const updateBlocks = (blocks: ContentBlock[]): ContentBlock[] =>
      blocks.map((block) => {
        if (block.type === 'group')
          return { ...block, children: updateBlocks(block.children) };
        if (block.type === 'contact-row')
          return { ...block, cells: block.cells.map(updateParts) };
        return block;
      });
    const blocks = page.blocks.map((block) => {
      if (block.type !== 'group' || block.variant !== 'contact-address')
        return block;
      return {
        ...block,
        children: updateBlocks(block.children),
      };
    });
    if (matches !== address.replacements.length)
      throw new Error(
        `Italian contact address expected ${address.replacements.length} replacements, found ${matches}`,
      );
    let description = page.description;
    for (const item of address.replacements) {
      if (description.split(item.from).length !== 2)
        throw new Error('Italian contact description source changed');
      description = description.replace(item.from, item.to);
    }
    return { ...page, blocks, description };
  }
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
