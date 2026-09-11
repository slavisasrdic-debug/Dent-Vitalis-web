import type { ClinicData } from './models';

/**
 * Kontakt prepisan iz prihvaćene reference 2026-09-07 za noindex preview.
 * Nije zamjena za poslovno/medicinsko odobrenje prije produkcije.
 * Nepostojeći podaci ostaju null; WhatsApp se ne zaključuje iz telefona.
 */
export const clinic = {
  legalName: null,
  contact: {
    email: 'it@dentvitalis.com',
    phone: '+385 51 688 380',
    whatsapp: null,
    address: 'Krešimirova 60, 51000 Rijeka',
    mapUrl:
      'https://www.google.com/maps/search/?api=1&query=Dentvitalis%20Fides%2C%20Kre%C5%A1imirova%2060%2C%20Rijeka',
  },
} as const satisfies ClinicData;

export const referenceBusiness = {
  source: 'accepted-webflow-2026-09-07',
  approval: 'review',
  name: 'DentVitalis',
  premiumPrice: '4.990',
  implantPrice: '2.990',
  whiteningPrice: '250',
  crownPrice: '220',
  singleImplantPrice: '249',
  mobileProsthesisPrice: '319',
  gumRemodellingPrice: '119',
  veneerPrice: '420',
  firstVisitPrice: '0',
  // Exact displayed reference amounts, not a tax calculation or approval.
  premiumAfterTax: '4.041,9',
  implantAfterTax: '2.421,9',
  whiteningAfterTax: '202,5',
  tollFree: '800 174 206',
  firstVisitMobile: '+385 91 110 0523',
  ongoingTreatmentTollFree: '800 824 634',
  ongoingTreatmentPhone: '+385 51 688 381',
  ongoingTreatmentEmail: 'booking@dentvitalis.com',
  ongoingTreatmentMobile: '+385 91 912 2071',
  receptionPhone: '+385 51 37 1064',
  iban: 'HR1424020061100858111',
  swift: 'ESBCHR22',
  openingHours: 'Mar-Sab 08:00-16:00',
  bookingHours: 'Prenotazioni telefoniche: 08:00-18:00',
  // User-approved footer spelling, 2026-09-11; reference year unchanged.
  copyright: 'Copyright © 2025 Dentvitalis Fides',
} as const;

// Explicit source differences are not silently reconciled across languages.
export const croatianBusinessReview = {
  source:
    'DOCX 7b9273a1338415f095ec43e367e051afaa30df24de9a91b31ec3d7dc4ecc648e',
  swift: 'ZABAHR2X', // t15.r3.c1.p11; conflicts with the named bank and IT ESBCHR22.
  maxCardInstallments: '36',
  approval: 'review',
} as const;
export const structuredBusiness = {
  address: {
    streetAddress: clinic.contact.address.split(',')[0]!,
    postalCode: '51000',
    addressLocality: 'Rijeka',
    addressCountry: 'HR',
  },
  openingDays: [
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ] as const,
  opens: '08:00',
  closes: '16:00',
  // Opening hours verified against referenceBusiness and DOCX t28.r0.c1.p1.
};
