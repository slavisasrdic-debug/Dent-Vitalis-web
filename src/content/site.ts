import { clinic as business, referenceBusiness } from '../../data/site';
import footerSource from './footer-it.json';
// Published footer label points to post-treatment reviews, whose actual source
// anchor is #post (the source footer mistakenly uses the FAQ anchor #dentvitalis).
export const footerGroups = footerSource.map((group) => ({
  ...group,
  links: group.links.map((link) => ({
    ...link,
    href:
      link.href === '/testimonianze#dentvitalis'
        ? '/testimonianze#post'
        : link.href,
  })),
}));
export interface LinkData {
  label: string;
  href: string;
}
export interface NavigationGroup extends LinkData {
  children: LinkData[];
}
export interface LanguageLink extends LinkData {
  code: string;
  lang: string;
  flag: string;
  available?: boolean;
}

// Values transcribed from the accepted published source. Not a medical/price approval.
export const clinic = {
  ...referenceBusiness,
  tagline: 'Dentisti Croazia',
  consultation: 'Consulta il dentista',
  menuRequest: { href: '#', label: 'Invia una richiesta' },
  telephone: business.contact.phone,
  telephoneHref: `tel:${business.contact.phone.replaceAll(' ', '')}`,
  email: business.contact.email,
  address: business.contact.address,
  whatsapp: business.contact.whatsapp,
  maps: business.contact.mapUrl,
} as const;
export const chatCopy = {
  team: 'Jelena',
  responseTime: 'Chiedi a nostro staff',
  greeting: 'Buongiorno! Sono Jelena...',
  message: "posso esserti d'aiuto?",
  action: 'Avvia chat su WhatsApp',
  unavailable: 'Numero WhatsApp in attesa di conferma.',
};
export const contactCopy = {
  eyebrow: 'Contatti',
  title: 'Prenota la prima visita gratuita a Rijeka (Fiume), Croazia!',
  description:
    'Contattaci per ricevere una consulenza dal nostro dentista o per organizzare la tua visita, il trasferimento e il soggiorno presso la nostra clinica di Fiume, in Croazia.',
  name: 'Nome',
  email: 'E-mail',
  phone: 'Telefono',
  message: 'Messaggio',
  upload: 'Seleziona il file',
  limit: 'Max 8 MB',
  privacyPrefix: "Ho letto l'",
  privacy: 'informativa sulla privacy.',
  privacyHref: 'https://www.dentvitalis.com/informativa-sulla-privacy',
  submit: 'Invia il messaggio',
  unavailable:
    'Invio non attivo in questa anteprima. Nessun messaggio è stato inviato.',
  fileTooLarge: 'Il file allegato deve essere inferiore a 8 MB.',
  invalidFile: 'Seleziona un file PDF, JPG o PNG.',
};
export const languages: LanguageLink[] = [
  { code: 'IT', lang: 'it', label: 'Italiano', flag: 'it', href: '/' },
  {
    code: 'HR',
    lang: 'hr',
    label: 'Hrvatski',
    flag: 'hr',
    href: 'https://www.dentvitalis.com/hr/',
  },
  {
    code: 'DE',
    lang: 'de',
    label: 'Deutsch',
    flag: 'de',
    href: 'https://www.dentvitalis.com/de/',
  },
  {
    code: 'EN',
    lang: 'en',
    label: 'English',
    flag: 'gb',
    href: 'https://www.dentvitalis.com/en/',
  },
  {
    code: 'SI',
    lang: 'sl',
    label: 'Slovenščina',
    flag: 'si',
    href: 'https://www.dentvitalis.com/si/',
  },
];
export const navigation: NavigationGroup[] = [
  {
    label: 'Prestazioni',
    href: '/prestazioni-dentali',
    children: [
      {
        label: 'Imperdibile: protesi definitiva ancorata su 4 impianti',
        href: '/prestazioni/protesi-definitiva-ancorata-su-4-impianti',
      },
      {
        label: 'Premium: ponte fisso su impianti',
        href: '/prestazioni/premium-ponte-fisso-su-impianti',
      },
      {
        label: 'Sbiancamento dei denti',
        href: '/prestazioni/sbiancamento-dei-denti',
      },
      {
        label: 'Corone, faccette, ponti e protesi',
        href: '/prestazioni/corone-faccette-ponti-e-protesi',
      },
      {
        label: 'Sedazione cosciente',
        href: '/prestazioni/sedazione-cosciente',
      },
    ],
  },
  {
    label: 'Su di noi',
    href: '/chi-siamo',
    children: [
      {
        label: 'I nostri specialisti',
        href: '/su-di-noi/i-nostri-specialisti',
      },
      {
        label: 'Tutto in un unico luogo',
        href: '/su-di-noi/tutto-in-un-unico-luogo',
      },
      { label: 'Come raggiungerci', href: '/su-di-noi/come-raggiungerci' },
      {
        label: 'Laboratorio odontotecnico',
        href: '/su-di-noi/laboratorio-odontotecnico',
      },
      {
        label: 'Materiali e apparecchiature',
        href: '/su-di-noi/materiali-e-apparecchiature',
      },
      {
        label: 'Impianti di nuova generazione',
        href: '/su-di-noi/impianti-di-nuova-generazione',
      },
    ],
  },
  {
    label: 'Informazioni',
    href: '/informazioni-per-pazienti',
    children: [
      {
        label: 'Prima visita gratuita',
        href: '/informazioni/prima-visita-gratuita',
      },
      {
        label: 'Tempi del trattamento',
        href: '/informazioni/tempi-del-trattamento',
      },
      {
        label: 'Pagamento flessibile',
        href: '/informazioni/pagamento-flessibile',
      },
      { label: 'Garanzie', href: '/informazioni/garanzie' },
      { label: 'Alloggio', href: '/informazioni/alloggio' },
      { label: 'Trasporto', href: '/informazioni/trasporto' },
      { label: 'Listino prezzi', href: '/informazioni/listino-prezzi' },
    ],
  },
];
export const navigationLinks: LinkData[] = [
  { label: 'Testimonianze', href: '/testimonianze' },
  { label: 'FAQ', href: '/faq' },
  { label: 'Galleria', href: '/domande-e-risposte' },
  { label: 'Contatti', href: '/contatti' },
];
