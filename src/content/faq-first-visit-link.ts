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

export function linkItalianFirstVisit(page: InnerPage): InnerPage {
  if (page.route !== '/faq') return page;
  return {
    ...page,
    blocks: page.blocks.map((block) =>
      block.type === 'faq' &&
      block.question === 'Cosa devo portare alla prima visita?'
        ? {
            ...block,
            answer: linkAnswerWord(
              block.answer,
              'Qui',
              '/informazioni/prima-visita-gratuita',
            ),
          }
        : block,
    ),
  };
}
