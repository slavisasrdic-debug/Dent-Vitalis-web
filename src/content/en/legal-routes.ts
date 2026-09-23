// Preserve the existing public English legal URLs; no new slugs or redirects.
export const englishLegalRoutes = {
  privacy: '/en/privacy-policy',
  terms: '/en/terms-of-use',
} as const;
export const legalLinks = [
  { label: 'Privacy Policy', href: englishLegalRoutes.privacy },
  { label: 'Terms of Use', href: englishLegalRoutes.terms },
];
