import type { ClinicData } from './models';

// Existing public Meta domain verification retained for the same domain.
export const metaDomainVerification = 'cc73uluajxjj85z6o0iat4gfuo51yi';

// Exact Dentvitalis Google profile supplied and approved by the owner, 2026-10-01.
// Separate from the address search: the review badge must select this listing.
export const googleReviewsUrl =
  'https://www.google.com/maps/place/Dentvitalis/@45.3331401,14.4189131,886m/data=!3m1!1e3!4m10!1m2!2m1!1sDentvitalis+Fides,+Kre%C5%A1imirova+60,+Rijeka!3m6!1s0x4764a128f2aa4cd5:0xbe8e3fecfb0c2d31!8m2!3d45.3331401!4d14.4236767!15sCipEZW50dml0YWxpcyBGaWRlcywgS3JlxaFpbWlyb3ZhIDYwLCBSaWpla2GSAQ1kZW50YWxfY2xpbmlj4AEA!16s%2Fg%2F11bbrls6lt?entry=ttu&g_ep=EgoyMDI2MDkyOS4wIKXMDSoASAFQAw%3D%3D';

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
    // Public IT Elfsight number verified; shared IT/HR use approved 2026-09-11.
    whatsapp: '385911100523',
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
  paymentRecipient: 'Dentvitalis Fides d.o.o.', // Verified existing barcode; user approved 2026-09-15.
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
  swift: referenceBusiness.swift, // User-approved Erste alignment, 2026-09-15; DOCX remains unchanged.
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
