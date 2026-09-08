import { clinic } from './site';
import type { ImageKey } from '../components/ResponsiveImage.astro';

export interface TeaserCardData {
  title: string;
  href: string;
  description: string;
  eyebrow?: string;
  price?: string;
  priceInset?: boolean;
  copyLayout?: 'stack' | 'flow';
  desktopImage: ImageKey;
  mobileImage: ImageKey;
  alt: string;
  mobilePosition?: string;
  showArrow?: boolean;
  actionLayout?: 'standard' | 'wide-arrow';
}
export const home = {
  metadata: {
    title: 'DentVitalis - migliori dentisti in Croazia',
    description:
      'Grandi risparmi senza rinunciare alla massima qualità. Siamo una clinica dentale a Rijeka (Fiume), in Croazia, dove puoi provare in anteprima i tuoi nuovi denti',
  },
  faqAction: { href: '/faq', label: 'Tutte le risposte' },
  translations: {
    it: 'review',
    hr: 'missing',
    de: 'missing',
    en: 'missing',
    si: 'missing',
  },
  testimonialActions: [
    { href: '/testimonianze', label: 'Esperienze dei pazienti' },
    { href: '/domande-e-risposte', label: 'Prima e dopo' },
  ],
  testimonialPhoto: {
    desktop: 'Sbiancamento-dei-denti-2.webp' as ImageKey,
    mobile: 'Sbiancamento-dei-denti-mobile.webp' as ImageKey,
    alt: 'Paziente soddisfatta con dentista DentVitalis dopo lo sbiancamento dei denti',
  },
  informationAction: {
    href: '#contatti',
    label: 'Prenota una visita gratuita',
  },
  hero: {
    eyebrowAccent: 'Pacchetto Premium',
    eyebrow: 'dai migliori dentisti in Croazia',
    pricePrefix: 'Prezzo fisso a',
    title: 'nessun limite di impianti',
    href: '/prestazioni/premium-ponte-fisso-su-impianti',
    cta: 'Maggiori informazioni',
    ratingAlt: 'Valutazione Google 4,9 su 5 basata su 152 recensioni',
  },
  benefits: [
    'Ponte fisso su impianti',
    'Senza costi aggiuntivi',
    'Alloggio in clinica',
    "Documenti in italiano per l'IRPEF",
    'Garanzia inclusa',
  ],
  intro: {
    eyebrow:
      'A soli 65 km da Trieste: ponte fisso su impianti in 24 ore. Tutti i lavori inclusi nel prezzo.',
    accent: 'Grandi risparmi',
    title: 'senza rinunciare alla massima qualità',
    description:
      'Siamo una clinica dentale a Rijeka (Fiume), in Croazia, dove puoi provare in anteprima i tuoi nuovi denti e scegliere forma e dimensione.',
  },
  about: {
    eyebrow: 'Su di noi',
    title: 'Tradizione e competenza',
    description: 'Da 30 anni, oltre 30.000 impianti inseriti con successo.',
  },
  testimonials: {
    eyebrow: 'Testimonianze',
    title: 'Rapporto di fiducia',
    description:
      'L’80% dei nostri pazienti ci sceglie su consiglio di amici e familiari. Scopri perché.',
  },
  information: {
    eyebrow: 'Informazioni',
    title: 'Questo potrebbe interessarti',
    description: `Per maggiori informazioni, inviaci un messaggio o contattaci al numero verde:\u00a0${clinic.tollFree}`,
  },
  faq: { eyebrow: 'FAQ', title: 'Domande e risposte' },
};
export const services: TeaserCardData[] = [
  {
    copyLayout: 'stack',
    eyebrow: 'Pacchetto “tutto incluso”',
    title: 'Imperdibile: protesi definitiva ancorata su 4 impianti',
    description:
      'Prezzo fisso per una protesi definitiva su 4 impianti, comprensivo di tutti gli eventuali interventi necessari prima o durante il trattamento implantologico.',
    price: `Prezzo fisso a ${clinic.implantPrice}\u00a0€`,
    href: '/prestazioni/protesi-definitiva-ancorata-su-4-impianti',
    desktopImage: 'Sedazione-cosciente-1.webp',
    mobileImage: 'Sedazione-cosciente-mobile.webp',
    alt: 'Paziente rilassato durante un trattamento con sedazione cosciente',
  },
  {
    eyebrow: 'Pacchetto “tutto incluso”',
    title: 'Premium: ponte fisso su impianti',
    copyLayout: 'stack',
    description:
      'Il prezzo rimane invariato, indipendentemente dal numero di impianti e dagli interventi necessari prima o durante l’implantologia.',
    price: `Prezzo fisso a ${clinic.premiumPrice}\u00a0€`,
    href: '/prestazioni/premium-ponte-fisso-su-impianti',
    desktopImage: 'ponte-fisso-su-impianti-2.webp',
    mobileImage: 'Dv-3.webp',
    alt: 'Paziente durante un trattamento odontoiatrico presso DentVitalis a Rijeka',
    mobilePosition: '80% 50%',
  },
  {
    eyebrow: 'Pacchetto “tutto incluso”',
    title: 'Facilissimo: sbiancamento dei denti',
    description:
      'Tutto compreso: un metodo semplice e sicuro per ritrovare un sorriso luminoso, senza alcun intervento invasivo.',
    price: `Prezzo fisso a ${clinic.whiteningPrice}\u00a0€`,
    priceInset: true,
    href: '/prestazioni/sbiancamento-dei-denti',
    desktopImage: 'Recenzija-detail-1.webp',
    mobileImage: 'Recenzija-mobile.jpg',
    alt: 'Due pazienti DentVitalis nella clinica di Rijeka',
  },
  {
    eyebrow: 'Sostituzione perfetta dei denti naturali',
    title: 'Corone, faccette, ponti e protesi',
    description:
      'Corone, faccette, ponti e protesi realizzati nel nostro laboratorio secondo standard UE, con certificato di conformità per materiali e qualità.',
    price: `A partire da ${clinic.crownPrice}\u00a0€`,
    href: '/prestazioni/corone-faccette-ponti-e-protesi',
    desktopImage: 'Dv-4-2.webp',
    mobileImage: 'Dv-4-2.webp',
    alt: 'Paziente durante una visita odontoiatrica presso DentVitalis a Rijeka',
    mobilePosition: '80% 50%',
  },
];
export const aboutCards: TeaserCardData[] = [
  {
    title: 'I nostri specialisti',
    description:
      'L’esperienza e la competenza dei nostri odontoiatri, maturata in anni di pratica e formazione, si riflette ogni giorno nel nostro studio dentistico a Rijeka (Fiume), in Croazia.',
    href: '/su-di-noi/i-nostri-specialisti',
    desktopImage: 'I-nostri-specialist-2i.webp',
    mobileImage: 'I-nostri-specialisti-mobile-2.webp',
    alt: 'Due dentisti DentVitalis esaminano una protesi dentale nella clinica di Rijeka',
  },
  {
    title: 'Tutto in un unico luogo',
    description:
      'Cure complete all’avanguardia, laboratorio certificato, comfort in clinica e transfer da Trieste. Assistenza dedicata in italiano.',
    href: '/su-di-noi/tutto-in-un-unico-luogo',
    desktopImage: 'Tutto-in-un-unico-luogo-1.webp',
    mobileImage: 'DV-44.webp',
    alt: "Team DentVitalis con pazienti nella sala d'attesa della clinica di Rijeka",
    mobilePosition: '80% 50%',
  },
  {
    title: 'Come raggiungerci?',
    description:
      'Siamo a Rijeka (Fiume), in Croazia, a soli 60 km da Trieste. Trasferimento gratuito.',
    href: '/su-di-noi/come-raggiungerci',
    desktopImage: 'Come-raggiungerci.webp',
    mobileImage: 'Come-raggiungerci.webp',
    alt: 'Rijeka, Croazia, sede della clinica DentVitalis',
    mobilePosition: '90% 50%',
  },
  {
    title: 'Laboratorio odontotecnico',
    description:
      'Alta qualità e rapidità, basate su materiali premium e tecnologie digitali, con il miglior rapporto qualità-prezzo.',
    href: '/su-di-noi/laboratorio-odontotecnico',
    desktopImage: 'Laboratorio-odontotecnico-1.webp',
    mobileImage: 'Laboratorio-odontotecnico-1.webp',
    alt: 'Odontotecnica DentVitalis al lavoro nel laboratorio della clinica di Rijeka',
    mobilePosition: '80% 50%',
  },
];
export const welcome = {
  eyebrow: 'Messaggio del titolare',
  title: 'Benvenuti a Dentvitalis Croazia',
  statement:
    'Da oltre 30 anni uniamo qualità e convenienza per offrire ai nostri pazienti il meglio. Oggi siamo gli unici dentisti in Croazia a proporre pacchetti di implantologia a prezzo fisso. Approfitta di una visita gratuita e scopri cosa possiamo fare per te.',
  thanks: 'Grazie a tutti coloro che ci hanno dato la loro fiducia.',
  author: 'Šime Živković, dr.med.dent.',
  documentation: 'Documentazione completa, scritta e in italiano:',
  cta: { label: 'Fissa un appuntamento', href: '/contatti' },
  items: [
    {
      title: 'Offerta e fatture',
      text: 'Non serve tradurle per usufruire della detrazione IRPEF del 19%.',
    },
    {
      title: 'Passaporto degli impianti',
      text: 'Riporta tutte le informazioni relative a ogni impianto inserito.',
    },
    {
      title: 'Certificato di conformità',
      text: 'Contiene l’elenco completo dei materiali e dei componenti utilizzati per i lavori protesici.',
    },
    {
      title: 'Garanzia dei lavori',
      text: 'Tutte le condizioni della garanzia, presentate con chiarezza e trasparenza.',
    },
  ],
};
export const testimonials = [
  {
    text: 'Personale molto cortese e preparato. Ho fatto un intervento impegnativo ma sono stata felice del lavoro svolto.',
    name: 'Marianna Menini',
    year: '2025',
  },
  {
    text: 'Ottima clinica, personale molto disponibile. La consiglierei a chiunque ne avesse bisogno: molto professionali.',
    name: 'Tatiana Muggianu',
    year: '2025',
  },
  {
    text: 'Mai avuto un’attenzione così curata. Posso dire che è piacevole andare dal dentista e ciò dice tutto!',
    name: 'Marlene Marchetto',
    year: '2025',
  },
];
export const informationCards = [
  {
    title: 'Prima visita gratuita',
    text: 'Dopo la prima visita ti forniremo tutte le informazioni sulle ulteriori agevolazioni e vantaggi disponibili.',
    href: '/informazioni/prima-visita-gratuita',
  },
  {
    title: 'Alloggio all’interno della clinica',
    text: 'Se vieni accompagnato da un amico o un familiare, possono alloggiare con te.',
    href: '/informazioni/alloggio',
  },
  {
    title: 'Il nostro trasporto',
    text: 'Ti assistiamo fin da subito, anche quando sei ancora in Italia.',
    href: '/informazioni/trasporto',
  },
  {
    title: 'Pagamento flessibile',
    text: 'Trova la soluzione più comoda per te.',
    href: '/informazioni/pagamento-flessibile',
  },
  {
    title: 'Garanzie',
    text: 'Garanzie fornite per iscritto e in italiano.',
    href: '/informazioni/garanzie',
  },
  {
    title: 'Tempi del trattamento',
    text: 'Le nostre cure sono pensate per garantire il risultato desiderato con il minor numero di visite.',
    href: '/informazioni/tempi-del-trattamento',
  },
  {
    title: 'Sedazione cosciente',
    text: 'Un’unica seduta: entrambe le arcate risolte, senza ansia e in totale relax.',
    href: '/prestazioni/sedazione-cosciente',
  },
  {
    title: 'Impianti di nuova generazione',
    text: 'Ora tutto è possibile: liberati dalla protesi mobile!',
    href: '/su-di-noi/impianti-di-nuova-generazione',
  },
];
