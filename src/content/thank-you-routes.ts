import { pageDocument } from './page-paths.ts';

/** Existing public confirmation paths: GTM uses exact Page Path comparisons. */
export const thankYouRoutes = {
  it: '/grazie',
  hr: '/hr/hvala',
  de: '/de/dank',
  en: '/en/thanks',
  sl: '/si/hvala',
} as const;
/** Expired campaign confirmations explicitly removed by the owner on 2026-10-01. */
export const retiredThankYouRoutes = [
  '/hr/hvala-akcija',
  '/si/hvala-akcija',
] as const;
export type ThankYouKey = keyof typeof thankYouRoutes;
/** Flat generated documents avoid Apache/Pages directory-slash redirects. */
export const thankYouDocuments: Record<string, string> = Object.fromEntries(
  Object.values(thankYouRoutes).map((route) => [route, pageDocument(route)]),
);

export function isThankYouPath(path: string): boolean {
  const normalized = path.replace(/\/+$/, '');
  return Object.values(thankYouRoutes).some((route) => route === normalized);
}

export function formSuccessRoute(lang: string): string {
  const key = lang as ThankYouKey;
  if (!['it', 'hr', 'de', 'en', 'sl'].includes(key))
    throw new Error(`Unknown contact form language: ${lang}`);
  return thankYouRoutes[key];
}
