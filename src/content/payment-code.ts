import type { InnerPage } from './inner-pages';

// User requested restoration of the original PDF417 on 2026-09-16.
// Use the unchanged full-size derivative, not the unreadable 320px derivative.
export const paymentImage =
  '/assets/images/codice-pagamento-bonifico-dentvitalis-512.webp';

export function replaceItalianPaymentCode(page: InnerPage): InnerPage {
  if (page.route !== '/informazioni/pagamento-flessibile') return page;
  let matches = 0;
  const blocks = page.blocks.map((block) => {
    if (
      block.type === 'group' &&
      block.children.some(
        (child) =>
          child.type === 'image' &&
          child.image === 'codice-pagamento-bonifico-dentvitalis.png',
      )
    ) {
      matches++;
      return { type: 'payment-code' as const };
    }
    return block;
  });
  if (matches !== 1)
    throw new Error('Expected exactly one old Italian payment code');
  return { ...page, blocks };
}

export const paymentCopy = {
  de: {
    title: 'Zahlungscode für die Banküberweisung',
    instruction:
      'Verwenden Sie den folgenden Code für die Zahlung per Banküberweisung.',
  },
  hr: {
    title: 'Kod za plaćanje bankovnom doznakom',
    instruction: 'Koristite sljedeći kod za plaćanje bankovnom doznakom.',
  },
  it: {
    title: 'Codice di pagamento per bonifico bancario',
    instruction:
      'Utilizza il seguente codice per effettuare il pagamento tramite bonifico bancario.',
  },
};
