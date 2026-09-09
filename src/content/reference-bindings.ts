import { clinic, referenceBusiness as business } from '../../data/site';

// The left side is immutable transcription provenance; the right side is the
// single editable business value. Keep historical legal contacts out of this.
// Match amounts only when followed by €, never bare numbers in medical copy.
const amounts: Record<string, string> = {
  '4.990': business.premiumPrice,
  '2.990': business.implantPrice,
  '250': business.whiteningPrice,
  '220': business.crownPrice,
  '249': business.singleImplantPrice,
  '319': business.mobileProsthesisPrice,
  '119': business.gumRemodellingPrice,
  '420': business.veneerPrice,
  '0': business.firstVisitPrice,
  '4.041,9': business.premiumAfterTax,
  '2.421,9': business.implantAfterTax,
  '202,5': business.whiteningAfterTax,
};
const contacts: [string, string][] = [
  ['800 174 206', business.tollFree],
  ['+385 51 688 380', clinic.contact.phone],
  ['it@dentvitalis.com', clinic.contact.email],
  ['+385 91 110 0523', business.firstVisitMobile],
  ['800 824 634', business.ongoingTreatmentTollFree],
  ['+385 51 688 381', business.ongoingTreatmentPhone],
  ['booking@dentvitalis.com', business.ongoingTreatmentEmail],
  ['+385 91 912 2071', business.ongoingTreatmentMobile],
  ['+385 51 37 1064', business.receptionPhone],
  ['Krešimirova 60, 51000 Rijeka', clinic.contact.address],
  ['Mar-Sab 08:00-16:00', business.openingHours],
  ['HR1424020061100858111', business.iban],
  ['ESBCHR22', business.swift],
];
const escaped = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const contactMap = new Map(contacts);
for (const [source, current] of contacts.filter(([source]) =>
  /^[+\d]/.test(source),
)) {
  contactMap.set(
    `tel:${source.replaceAll(' ', '')}`,
    `tel:${current.replaceAll(' ', '')}`,
  );
}
const contactPattern = new RegExp(
  [...contactMap.keys()]
    .sort((a, b) => b.length - a.length)
    .map(escaped)
    .join('|'),
  'g',
);

function textWithBusinessValues(text: string): string {
  return text
    .replace(
      /(?<![\d.,])\d[\d.,]*(?=[\s\u00a0]*(?:€|eura\b))/g,
      (amount) => amounts[amount] ?? amount,
    )
    .replace(contactPattern, (source) => contactMap.get(source)!);
}

/** Build-time data binding only; source snapshots stay byte-for-byte reviewable. */
export function bindReferenceBusiness<T>(source: T): T {
  if (typeof source === 'string') return textWithBusinessValues(source) as T;
  if (Array.isArray(source)) return source.map(bindReferenceBusiness) as T;
  if (source && typeof source === 'object')
    return Object.fromEntries(
      Object.entries(source).map(([key, value]) => [
        key,
        ['source', 'route', 'image', 'src', 'videoId'].includes(key)
          ? value
          : bindReferenceBusiness(value),
      ]),
    ) as T;
  return source;
}
