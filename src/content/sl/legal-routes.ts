// Preserve the existing public Slovenian legal URLs; no new slugs or redirects.
export const slovenianLegalRoutes = {
  privacy: '/si/politika-zasebnosti',
  terms: '/si/pogoji-uporabe',
} as const;
export const legalLinks = [
  { label: 'Politika zasebnosti', href: slovenianLegalRoutes.privacy },
  { label: 'Pogoji uporabe', href: slovenianLegalRoutes.terms },
];
