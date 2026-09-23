// Preserve the existing public German legal URLs; no new slugs or redirects.
export const germanLegalRoutes = {
  privacy: '/de/datenschutzerklarung',
  terms: '/de/nutzungsbedingungen',
} as const;
export const legalLinks = [
  { label: 'Datenschutzerklärung', href: germanLegalRoutes.privacy },
  { label: 'Nutzungsbedingungen', href: germanLegalRoutes.terms },
];
