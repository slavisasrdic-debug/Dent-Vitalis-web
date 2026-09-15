import { referenceBusiness as business } from '../../data/site';
import type { InnerPage } from './inner-pages';

// EPC069-12 v3.1, version 002, UTF-8, SCT. Omit amount rather than encode zero.
// No URL, external service, expiry, customer data or variable runtime inputs.
export const paymentDescription = 'Ponuda/Preventivo';
export const paymentFields = [
  'BCD',
  '002',
  '1',
  'SCT',
  business.swift,
  business.paymentRecipient,
  business.iban,
  '',
  '',
  '',
  paymentDescription,
];
export const paymentPayload = paymentFields.join('\n');
if (
  Buffer.byteLength(paymentPayload, 'utf8') > 331 ||
  paymentFields.some((field) => /[\r\n]|https?:|www\./i.test(field))
) {
  throw new Error('Invalid static SEPA payment data');
}
const ibanDigits = (business.iban.slice(4) + business.iban.slice(0, 4)).replace(
  /[A-Z]/g,
  (letter) => String(letter.charCodeAt(0) - 55),
);
if (BigInt(ibanDigits) % 97n !== 1n)
  throw new Error('Invalid payment IBAN checksum');

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
  hr: {
    title: 'Kod za plaćanje bankovnom doznakom',
    instruction:
      'Skenirajte SEPA QR kod u bankovnoj aplikaciji koja ga podržava. Iznos nije unaprijed zadan: unesite ga prema svojoj ponudi. Prije potvrde plaćanja provjerite primatelja, IBAN, iznos i opis plaćanja.',
    fallback:
      'Ako vaša aplikacija ne podržava ovaj kod, podatke za bankovnu doznaku unesite ručno.',
    recipient: 'Primatelj',
    amount: 'Iznos: unesite prema ponudi',
    description: 'Opis plaćanja',
  },
  it: {
    title: 'Codice di pagamento per bonifico bancario',
    instruction:
      'Scansiona il codice QR SEPA con un’app bancaria che lo supporta. L’importo non è preimpostato: inseriscilo in base al tuo preventivo. Prima di confermare il pagamento, verifica il beneficiario, l’IBAN, l’importo e la causale.',
    fallback:
      'Se la tua app non supporta questo codice, inserisci manualmente i dati per il bonifico bancario.',
    recipient: 'Beneficiario',
    amount: 'Importo: da inserire in base al preventivo',
    description: 'Causale',
  },
};
