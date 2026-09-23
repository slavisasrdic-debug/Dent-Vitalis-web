import { englishLegalRoutes } from './legal-routes';

// Keep the existing EN detail URLs. Complete the same flat route
// convention; no production redirects or existing HR/IT URLs are changed.
export const englishPageIds = [
  'home',
  'services',
  'four-implant-denture',
  'fixed-implant-bridge',
  'whitening',
  'crowns-veneers-bridges',
  'sedation',
  'about',
  'specialists',
  'all-in-one',
  'directions',
  'laboratory',
  'materials',
  'new-implants',
  'information',
  'first-visit',
  'treatment-duration',
  'payment',
  'guarantees',
  'accommodation',
  'prices',
  'testimonials',
  'faq',
  'gallery',
  'contact',
  'privacy',
  'terms',
] as const;
export function route(id: string): string {
  if (!englishPageIds.some((value) => value === id))
    throw new Error(`Unknown English page: ${id}`);
  return id === 'home'
    ? '/en/'
    : (englishLegalRoutes[id as keyof typeof englishLegalRoutes] ??
        `/en/${id}`);
}
