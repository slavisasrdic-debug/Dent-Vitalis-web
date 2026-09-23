import { germanLegalRoutes } from './legal-routes';

// Keep the already published DE detail URLs. Complete the same flat route
// convention; no production redirects or existing HR/IT URLs are changed.
export const germanPageIds = [
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
  if (!germanPageIds.some((value) => value === id))
    throw new Error(`Unknown German page: ${id}`);
  return id === 'home'
    ? '/de/'
    : (germanLegalRoutes[id as keyof typeof germanLegalRoutes] ?? `/de/${id}`);
}
