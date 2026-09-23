import source from '../../../data/translations/sl-source.json';
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
    throw new Error(`Missing Slovenian source ${tableId}:${index}`);
  return table.rows[index]
    .flat()
    .map((paragraph) => paragraph.text.replace(/[\u200b\u200d]/g, '').trim())
    .filter(Boolean);
}
function paragraph(id: string): string {
  const block = source.blocks.find((block) => block.id === id);
  if (!block || block.type !== 'paragraph' || !block.text)
    throw new Error(`Missing Slovenian source ${id}`);
  return block.text.replace(/[\u200b\u200d]/g, '').trim();
}
export const labels: Record<string, string> = {
  home: 'DentVitalis',
  services: paragraph('p3'),
  about: paragraph('p17'),
  information: paragraph('p66'),
  sedation: paragraph('p56'),
  prices: paragraph('p96'),
  testimonials: paragraph('p102').split('\n')[0]!,
  faq: paragraph('p222'),
  gallery: paragraph('p242'),
  contact: paragraph('p262'),
  // Short UI labels; full supplied titles remain in the hero and content.
  'four-implant-denture': 'Proteza na 4 zobnih vsadkih',
  'fixed-implant-bridge': 'Fiksni mostiček na zobnih vsadkih',
  whitening: row('t4', 0)[1]!,
  'crowns-veneers-bridges': row('t5', 0)[1]!,
  specialists: paragraph('p18'),
  'all-in-one': paragraph('p26'),
  directions: paragraph('p31'),
  laboratory: paragraph('p38'),
  materials: paragraph('p45'),
  'new-implants': paragraph('p50').split('\n')[0]!,
  'first-visit': paragraph('p69'),
  'treatment-duration': paragraph('p74'),
  payment: paragraph('p79'),
  guarantees: paragraph('p85'),
  accommodation: paragraph('p91'),
};
export function label(id: string): string {
  const value = labels[id];
  if (!value) throw new Error(`Missing Slovenian label: ${id}`);
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
  { ...link('testimonials'), label: 'Izkušnje pacientov' },
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
      { label: paragraph('p111'), href: route('testimonials') + '#video' },
      {
        label: 'Ocene v iskalniku Google',
        href: route('testimonials') + '#google',
      },
      { label: paragraph('p114'), href: route('testimonials') + '#post' },
    ],
  },
  {
    title: labels.faq!,
    href: route('faq'),
    legal: false,
    links: [
      { label: paragraph('p227'), href: route('faq') + '#dentistry' },
      { label: paragraph('p239'), href: route('faq') + '#dentvitalis' },
    ],
  },
  {
    title: labels.gallery!,
    href: route('gallery'),
    legal: false,
    links: [
      { label: paragraph('p245'), href: route('gallery') + '#aesthetics' },
      {
        label: paragraph('p251').split('/').at(-1)!.trim(),
        href: route('gallery') + '#restoration',
      },
      { label: paragraph('p256'), href: route('gallery') + '#rehabilitation' },
    ],
  },
  {
    title: 'Pravne informacije',
    href: '',
    links: legalLinks,
    legal: true,
  },
];
export const clinic = {
  ...baseClinic,
  tagline: 'Reka, Hrvaška',
  consultation: 'Vprašajte zobozdravnika',
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
  name: 'Ime',
  email: 'E-pošta',
  phone: 'Telefon',
  message: 'Sporočilo',
  upload: 'Izberite datoteko',
  limit: 'Max. 8 MB',
  privacyPrefix: 'Prebral/-a sem ',
  privacy: 'politiko zasebnosti.',
  privacyHref: legalLinks[0]!.href,
  submit: 'Pošlji sporočilo',
  unavailable:
    'Pošiljanje je v tem predogledu onemogočeno. Sporočilo ni bilo poslano.',
  fileTooLarge: 'Datoteka mora biti manjša od 8 MB.',
  invalidFile: 'Izberite datoteko PDF, JPG ali PNG.',
};
export const chatCopy = {
  team: 'Jelena',
  responseTime: 'Dentvitalis',
  greeting: '',
  message: 'Kako vam lahko pomagamo?',
  action: 'Pogovor prek WhatsAppa',
  unavailable: 'WhatsApp je v tem predogledu onemogočen.',
};
