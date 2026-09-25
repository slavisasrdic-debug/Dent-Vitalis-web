import type { InlineContent, InnerPage } from './inner-pages';

export function linkAnswerWord(
  parts: InlineContent[],
  word: string,
  href: string,
): InlineContent[] {
  return parts.flatMap((part): InlineContent[] => {
    if (part.kind !== 'text') return [part];
    const index = part.text.indexOf(word);
    if (index === -1) return [part];
    return [
      { kind: 'text', text: part.text.slice(0, index) },
      {
        kind: 'link',
        href,
        variant: 'underlined',
        children: [{ kind: 'text', text: word }],
      },
      { kind: 'text', text: part.text.slice(index + word.length) },
    ];
  });
}

interface FirstVisitFaqLink {
  route: string;
  question: string;
  word: string;
  href: string;
}

/**
 * The final FAQ answer intentionally keeps its first-visit link. It is an
 * explicit navigation cue, unlike the editorial links that remain deferred.
 */
export function linkFirstVisitFaq(
  page: InnerPage,
  { route, question, word, href }: FirstVisitFaqLink,
): InnerPage {
  if (page.route !== route) return page;
  let matches = 0;
  const blocks = page.blocks.map((block) => {
    if (block.type !== 'faq' || block.question !== question) return block;
    matches++;
    return {
      ...block,
      answer: linkAnswerWord(block.answer, word, href),
    };
  });
  if (matches !== 1)
    throw new Error(`Expected one first-visit FAQ answer on ${route}`);
  return {
    ...page,
    blocks,
  };
}
