import source from '../../../data/translations/en-source.json';
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
    throw new Error(`Missing English source ${tableId}:${index}`);
  return table.rows[index]
    .flat()
    .map((paragraph) => paragraph.text.replace(/[\u200b\u200d]/g, '').trim())
    .filter(Boolean);
}
function paragraph(id: string): string {
  const block = source.blocks.find((block) => block.id === id);
  if (!block || block.type !== 'paragraph' || !block.text)
    throw new Error(`Missing English source ${id}`);
  return block.text.replace(/[\u200b\u200d]/g, '').trim();
}
export const labels: Record<string, string> = {
  home: 'DentVitalis',
  services: paragraph('p3'),
  about: paragraph('p16'),
  information: paragraph('p67'),
  sedation: paragraph('p57'),
  prices: paragraph('p97'),
  testimonials: paragraph('p103').split('\n')[0]!,
  faq: paragraph('p222'),
  gallery: paragraph('p240'),
  contact: paragraph('p259'),
  // Short UI labels; full supplied titles remain in the hero and content.
  'four-implant-denture': 'Overdenture on 4 implants',
  'fixed-implant-bridge': 'Implant-supported fixed bridge',
  whitening: row('t4', 0)[1]!,
  'crowns-veneers-bridges': row('t5', 0)[1]!,
  specialists: paragraph('p17'),
  'all-in-one': paragraph('p27'),
  directions: paragraph('p32'),
  laboratory: paragraph('p39'),
  materials: paragraph('p46'),
  'new-implants': paragraph('p51').split('\n')[0]!,
  'first-visit': paragraph('p69'),
  'treatment-duration': paragraph('p75'),
  payment: paragraph('p80'),
  guarantees: paragraph('p86'),
  accommodation: paragraph('p92'),
};
export function label(id: string): string {
  const value = labels[id];
  if (!value) throw new Error(`Missing English label: ${id}`);
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
  { ...link('testimonials'), label: 'Testimonials' },
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
      { label: paragraph('p112'), href: route('testimonials') + '#video' },
      { label: 'Google reviews', href: route('testimonials') + '#google' },
      { label: paragraph('p115'), href: route('testimonials') + '#post' },
    ],
  },
  {
    title: labels.faq!,
    href: route('faq'),
    legal: false,
    links: [
      { label: paragraph('p227'), href: route('faq') + '#dentistry' },
      { label: paragraph('p237'), href: route('faq') + '#dentvitalis' },
    ],
  },
  {
    title: labels.gallery!,
    href: route('gallery'),
    legal: false,
    links: [
      { label: paragraph('p243'), href: route('gallery') + '#aesthetics' },
      {
        label: paragraph('p248').split('/').at(-1)!.trim(),
        href: route('gallery') + '#restoration',
      },
      { label: paragraph('p253'), href: route('gallery') + '#rehabilitation' },
    ],
  },
  {
    title: 'Legal information',
    href: '',
    links: legalLinks,
    legal: true,
  },
];
export const clinic = {
  ...baseClinic,
  tagline: 'Rijeka, Croatia',
  consultation: 'Ask a dentist',
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
  email: 'E-mail',
  phone: 'Phone',
  message: 'Message',
  upload: 'Choose a file',
  limit: 'Max. 8 MB',
  privacyPrefix: 'I have read the ',
  privacy: 'privacy policy.',
  privacyHref: legalLinks[0]!.href,
  submit: 'Send message',
  unavailable: 'Sending is disabled in this preview. No message has been sent.',
  fileTooLarge: 'The file must be smaller than 8 MB.',
  invalidFile: 'Please choose a PDF, JPG or PNG file.',
};
export const chatCopy = {
  team: 'Jelena',
  responseTime: 'Dentvitalis',
  greeting: '',
  message: 'How can we help you?',
  action: 'Chat on WhatsApp',
  unavailable: 'WhatsApp is disabled in this preview.',
};
