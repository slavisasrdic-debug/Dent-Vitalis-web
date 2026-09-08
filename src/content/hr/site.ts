import {
  clinic as itClinic,
  contactCopy as itContact,
  type NavigationGroup,
} from '../site';
import { t, text, bilingual } from './source';
import { route } from './routes';

// Navigation labels reuse approved copy. Short technical UI labels are kept separate
// from patient/medical content and never used as a source for translated articles.
export const labels = {
  home: 'DentVitalis',
  services: bilingual('p2'),
  'four-implant-denture': t(2, 0, 9).split('„')[1]!.split('”')[0]!,
  'fixed-implant-bridge': t(1, 0, 2),
  whitening: t(4, 0, 3),
  'crowns-veneers-bridges': t(5, 0, 4),
  sedation: text('p62'),
  about: bilingual('p22'),
  specialists: bilingual('p23'),
  'all-in-one': bilingual('p27'),
  directions: bilingual('p32'),
  laboratory: bilingual('p39'),
  materials: text('p48'),
  'new-implants': text('p55').split('\n')[0]!,
  information: t(1, 9, 0),
  'first-visit': text('p71'),
  'treatment-duration': bilingual('p76'),
  payment: t(1, 9, 15),
  guarantees: t(1, 9, 18),
  accommodation: bilingual('p93'),
  prices: bilingual('p104'),
  testimonials: t(1, 8, 0),
  faq: bilingual('p310'),
  gallery: bilingual('p353'),
  contact: 'Kontakti',
  privacy: 'Polica privatnosti',
  terms: 'Uvjeti korištenja',
};
export function label(id: string): string {
  const value = labels[id as keyof typeof labels];
  if (!value) throw new Error(`Missing Croatian label: ${id}`);
  return value;
}
export const link = (id: string) => ({ label: label(id), href: route(id) });
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
  {
    ...group('information', [
      'first-visit',
      'treatment-duration',
      'payment',
      'guarantees',
      'accommodation',
      'prices',
    ]),
    // Short navigation fragments only; full source headings remain unchanged.
    label: labels.information.replace(/^Korisne i/, 'I'),
  },
];
export const navigationLinks = [
  'testimonials',
  'faq',
  'gallery',
  'contact',
].map((id) =>
  id === 'faq'
    ? { ...link(id), label: t(1, 10, 0) }
    : id === 'testimonials'
      ? { ...link(id), label: labels.testimonials.split(' ')[0]! }
      : link(id),
);
// Legal sidebars and the footer share the same approved labels and destinations.
export const legalNavigation = {
  title: 'Pravne informacije',
  links: [link('privacy'), link('terms')],
};
export const footerGroups = [
  ...navigation.map((g) => ({
    title: g.label,
    href: g.href,
    links: g.children,
    legal: false,
  })),
  {
    title: labels.testimonials,
    href: route('testimonials'),
    links: [
      {
        label: 'Video iskustva pacijenata',
        href: route('testimonials') + '#video',
      },
      { label: 'Google recenzije', href: route('testimonials') + '#google' },
      { label: text('p126'), href: route('testimonials') + '#post' },
    ],
    legal: false,
  },
  {
    title: labels.faq,
    href: route('faq'),
    links: [
      { label: bilingual('p333'), href: route('faq') + '#stomatologija' },
      { label: bilingual('p347'), href: route('faq') + '#dentvitalis' },
    ],
    legal: false,
  },
  {
    title: labels.gallery,
    href: route('gallery'),
    links: [
      { label: bilingual('p357'), href: route('gallery') + '#estetika' },
      { label: bilingual('p362'), href: route('gallery') + '#funkcija' },
      { label: bilingual('p367'), href: route('gallery') + '#rehabilitacija' },
    ],
    legal: false,
  },
  {
    ...legalNavigation,
    href: '',
    legal: true,
  },
];
export const clinic = {
  ...itClinic,
  // User-approved Croatian logo descriptor, 2026-09-08.
  tagline: 'Stomatolog Rijeka',
  // User-requested short Croatian equivalent of "Consulta il dentista", 2026-09-08.
  // This overrides the button only; the DOCX contact-section title is unchanged.
  consultation: 'Pitaj stomatologa',
  menuRequest: { label: t(1, 11, 0), href: '#contatti' },
  tollFree: '',
  openingHours: t(28, 0, 1),
  bookingHours: t(28, 0, 2),
  // Existing logo/copyright identify the same business; no inferred new date/number.
};
export const contactCopy: typeof itContact = {
  eyebrow: t(1, 11, 0),
  title: t(1, 11, 1),
  description: t(1, 11, 3),
  name: 'Ime',
  email: 'E-mail',
  phone: 'Telefon',
  message: 'Poruka',
  upload: 'Izaberite datoteku',
  limit: 'Max 8 MB',
  privacyPrefix: 'Prihvaćam ',
  privacy: 'policu privatnosti',
  privacyHref: route('privacy'),
  submit: 'Pošalji',
  unavailable:
    'Slanje nije aktivno u ovom pretpregledu. Nijedna poruka nije poslana.',
  fileTooLarge: 'Priložena datoteka mora biti manja od 8 MB.',
  invalidFile: 'Odaberite PDF, JPG ili PNG datoteku.',
};
export const chatCopy = {
  team: 'DentVitalis',
  responseTime: '',
  greeting: '',
  message: t(1, 11, 1),
  action: 'Otvori WhatsApp',
  unavailable: 'WhatsApp nije aktivan u ovom pretpregledu.',
};
