import source from '../../../data/translations/de-source.json';
import {
  clinic as baseClinic,
  type NavigationGroup,
  type contactCopy as ContactCopy,
} from '../site';
import { legalLinks } from './legal-routes';
import { route } from './routes';

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
  return block.text.replace(/[\u200b\u200d]/g, '').trim();
}
export const labels: Record<string, string> = {
  home: 'DentVitalis',
  services: paragraph('p4'),
  about: paragraph('p16'),
  information: paragraph('p64'),
  sedation: paragraph('p54'),
  prices: paragraph('p92'),
  testimonials: paragraph('p98').split('\n')[0]!,
  faq: paragraph('p197'),
  gallery: paragraph('p212'),
  contact: paragraph('p231'),
  // Short UI labels; full supplied titles remain in the hero and content.
  'four-implant-denture': 'Prothese auf 4 Implantaten',
  'fixed-implant-bridge': 'Festsitzende implantatgetragene Brücke',
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
export function label(id: string): string {
  const value = labels[id];
  if (!value) throw new Error(`Missing German label: ${id}`);
  return value;
}
const link = (id: string) => ({ label: label(id), href: route(id) });
const group = (id: string, children: string[]): NavigationGroup => ({
  ...link(id),
  children: children.map(link),
});
export const navigation = [
  group('services', [
    'four-implant-denture',
    'fixed-implant-bridge',
    'whitening',
    'crowns-veneers-bridges',
    'sedation',
  ]),
  group('about', [
    'specialists',
    'all-in-one',
    'directions',
    'laboratory',
    'materials',
    'new-implants',
  ]),
  group('information', [
    'first-visit',
    'treatment-duration',
    'payment',
    'guarantees',
    'accommodation',
    'prices',
  ]),
];
export const navigationLinks = [
  { ...link('testimonials'), label: 'Erfahrungen' },
  { ...link('faq'), label: 'FAQ' },
  link('gallery'),
  link('contact'),
];
export const footerGroups = [
  ...navigation.map((group) => ({
    title: group.label,
    href: group.href,
    links: group.children,
    legal: false,
  })),
  {
    title: labels.testimonials!,
    href: route('testimonials'),
    legal: false,
    links: [
      { label: paragraph('p105'), href: route('testimonials') + '#video' },
      { label: 'Google-Bewertungen', href: route('testimonials') + '#google' },
      { label: paragraph('p108'), href: route('testimonials') + '#post' },
    ],
  },
  {
    title: labels.faq!,
    href: route('faq'),
    legal: false,
    links: [
      { label: paragraph('p202'), href: route('faq') + '#zahnmedizin' },
      { label: paragraph('p209'), href: route('faq') + '#dentvitalis' },
    ],
  },
  {
    title: labels.gallery!,
    href: route('gallery'),
    legal: false,
    links: [
      { label: paragraph('p215'), href: route('gallery') + '#aesthetik' },
      {
        label: paragraph('p220').split('/').at(-1)!.trim(),
        href: route('gallery') + '#funktion',
      },
      { label: paragraph('p225'), href: route('gallery') + '#rehabilitation' },
    ],
  },
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
  privacy: 'Datenschutzerklärung gelesen.',
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
