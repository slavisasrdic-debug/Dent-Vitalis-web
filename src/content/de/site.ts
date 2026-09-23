import source from '../../../data/translations/de-source.json';
import {
  clinic as baseClinic,
  type NavigationGroup,
  type contactCopy as ContactCopy,
} from '../site';
import { localizedPageRegistry } from '../localized-page-registry';

// Read the supplied translation by explicit source ID, never by table alignment.
export function row(tableId: string, index: number): string[] {
  const table = source.blocks.find((block) => block.id === tableId);
  if (!table || table.type !== 'table' || !table.rows?.[index])
    throw new Error(`Missing German source ${tableId}:${index}`);
  return table.rows[index]
    .flat()
    .map((paragraph) => paragraph.text.replace(/\u200b/g, '').trim())
    .filter(Boolean);
}
function paragraph(id: string): string {
  const block = source.blocks.find((block) => block.id === id);
  if (!block || block.type !== 'paragraph' || !block.text)
    throw new Error(`Missing German source ${id}`);
  return block.text.replace(/\u200b/g, '').trim();
}
export const labels: Record<string, string> = {
  'four-implant-denture': row('t2', 0)[1]!,
  'fixed-implant-bridge': row('t3', 0)[1]!,
  whitening: row('t4', 0)[1]!,
  'crowns-veneers-bridges': row('t5', 0)[1]!,
  specialists: paragraph('p17'),
  'all-in-one': paragraph('p26'),
  directions: paragraph('p31'),
  laboratory: paragraph('p38'),
  materials: paragraph('p45'),
  'new-implants': paragraph('p49').split('\n')[0]!,
  'first-visit': paragraph('p67'),
  'treatment-duration': paragraph('p71'),
  payment: paragraph('p75'),
  guarantees: paragraph('p81'),
  accommodation: paragraph('p87'),
};
export const navigation: NavigationGroup[] = [
  { label: paragraph('p4'), href: '/de/#leistungen', family: 'service' },
  { label: paragraph('p16'), href: '/de/#ueber-uns', family: 'about' },
  {
    label: paragraph('p64'),
    href: '/de/#informationen',
    family: 'information',
  },
].map(({ family, ...group }) => ({
  ...group,
  children: localizedPageRegistry.de
    .filter((entry) => entry.family === family)
    .map((entry) => ({
      label: labels[entry.route]!,
      href: `/de/${entry.route}`,
    })),
}));
export const navigationLinks = [
  { label: paragraph('p231'), href: '#contatti' },
];
// No German legal translation was supplied. Label the existing Croatian source
// explicitly instead of inventing a German legal URL or legal text.
export const legalLinks = [
  { label: 'Datenschutzerklärung (Kroatisch)', href: '/hr/polica-privatnosti' },
  { label: 'Nutzungsbedingungen (Kroatisch)', href: '/hr/uvjeti-koristenja' },
];
export const footerGroups = [
  ...navigation.map((group) => ({
    title: group.label,
    href: group.href,
    links: group.children,
    legal: false,
  })),
  {
    title: 'Rechtliche Informationen',
    href: '',
    links: legalLinks,
    legal: true,
  },
];
export const clinic = {
  ...baseClinic,
  tagline: 'Zahnärzte Kroatien',
  consultation: 'Zahnarzt fragen',
  menuRequest: { label: row('t1', 11)[0]!, href: '#contatti' },
  tollFree: '',
  address: `${row('t25', 0)[1]}, ${row('t25', 0)[2]}`,
  openingHours: row('t26', 0)[0]!,
  bookingHours: row('t26', 0)[1]!,
};
export const contactCopy: typeof ContactCopy = {
  eyebrow: row('t1', 11)[0]!,
  title: row('t1', 11)[1]!,
  description: row('t1', 11)[2]!,
  name: 'Name',
  email: 'E-Mail',
  phone: 'Telefon',
  message: 'Nachricht',
  upload: 'Datei auswählen',
  limit: 'Max. 8 MB',
  privacyPrefix: 'Ich habe die ',
  privacy: 'Datenschutzerklärung gelesen (Kroatisch).',
  privacyHref: legalLinks[0]!.href,
  submit: 'Nachricht senden',
  unavailable:
    'Der Versand ist in dieser Vorschau nicht aktiv. Es wurde keine Nachricht gesendet.',
  fileTooLarge: 'Die Datei muss kleiner als 8 MB sein.',
  invalidFile: 'Bitte wählen Sie eine PDF-, JPG- oder PNG-Datei.',
};
export const chatCopy = {
  team: 'Jelena',
  responseTime: 'Dentvitalis',
  greeting: '',
  message: 'Wie können wir Ihnen helfen?',
  action: 'Über WhatsApp sprechen',
  unavailable: 'WhatsApp ist in dieser Vorschau nicht aktiv.',
};
