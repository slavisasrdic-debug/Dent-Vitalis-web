import { slovenianLegalRoutes } from './legal-routes';

// Keep the existing SI detail URLs. Complete the same flat route
// convention; no production redirects or existing HR/IT URLs are changed.
export const slovenianPageIds = [
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
  if (!slovenianPageIds.some((value) => value === id))
    throw new Error(`Unknown Slovenian page: ${id}`);
  return id === 'home'
    ? '/si/'
    : (slovenianLegalRoutes[id as keyof typeof slovenianLegalRoutes] ??
        `/si/${id}`);
}
