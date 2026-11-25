import { readFileSync } from 'node:fs';

// The published cjenik is the source of the base amounts. Match by service
// identity, since the retail amount alone can also match an unrelated service.
const xml = readFileSync('public/cjenici/aktualni.xml', 'utf8');
const entries = Array.from(
  xml.matchAll(/<Usluga>([\s\S]*?)<\/Usluga>/g),
  ([, entry]) => ({
    name: entry!.match(/<naziv>([^<]*)<\/naziv>/)?.[1],
    amount: entry!.match(
      /<bazna_cijena>([0-9]+,[0-9]{2})<\/bazna_cijena>/,
    )?.[1],
  }),
);
const format = new Intl.NumberFormat('hr-HR', {
  style: 'currency',
  currency: 'EUR',
  useGrouping: 'always',
  trailingZeroDisplay: 'stripIfInteger',
});

function basePrice(name: string, label = 'Bazna cijena'): string {
  const matches = entries.filter((entry) => entry.name === name);
  if (matches.length !== 1 || !matches[0]?.amount)
    throw new Error(
      `Missing or ambiguous base price in the Croatian XML: ${name}`,
    );
  const amount = Number(matches[0].amount.replace(',', '.'));
  return `${label} ${format.format(amount)}`;
}

export const dentureBasePrice = basePrice(
  'Premium paket “Definitivna proteza sidrena na 4 implantata”',
);
export const bridgeBasePrice = basePrice(
  'Premium paket “Fiksni most na implantatima” - OnX',
);
export const whiteningBasePrice = basePrice(
  'Premium paket „Kućno izbjeljivanje zuba“',
);
export const veneerBasePrice = basePrice(
  'Estetska ljuskica (krunica dvočetvrtinska cirkon-keramička)',
  'Bazna cijena cirkon-keramičke ljuskice',
);
