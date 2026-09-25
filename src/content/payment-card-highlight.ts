import type { ContentBlock, InlineContent, InnerPage } from './inner-pages';

interface PaymentCardHighlight {
  route: string;
  phrase: string;
}

function emphasizePhrase(
  content: InlineContent[],
  phrase: string,
): [InlineContent[], number] {
  let matches = 0;
  const next = content.flatMap((part): InlineContent[] => {
    if (part.kind !== 'text') return [part];
    const index = part.text.indexOf(phrase);
    if (index === -1) return [part];
    matches++;
    return [
      { kind: 'text', text: part.text.slice(0, index) },
      { kind: 'strong', children: [{ kind: 'text', text: phrase }] },
      { kind: 'text', text: part.text.slice(index + phrase.length) },
    ];
  });
  return [next, matches];
}

/** Applies the approved bold emphasis without changing the translated copy. */
export function emphasizePaymentCardEligibility(
  page: InnerPage,
  { route, phrase }: PaymentCardHighlight,
): InnerPage {
  if (page.route !== route) return page;
  let matches = 0;
  const update = (blocks: ContentBlock[]): ContentBlock[] =>
    blocks.map((block) => {
      if (block.type === 'group')
        return { ...block, children: update(block.children) };
      if (block.type !== 'bullet' && block.type !== 'paragraph') return block;
      const [content, count] = emphasizePhrase(block.content, phrase);
      matches += count;
      return count ? { ...block, content } : block;
    });
  const blocks = update(page.blocks);
  if (matches !== 1)
    throw new Error(`Expected one payment-card eligibility phrase on ${route}`);
  return { ...page, blocks };
}
