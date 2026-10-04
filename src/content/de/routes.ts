import { germanLegalRoutes } from './legal-routes';
import decisions from '../../../data/seo/localized-route-decisions-20261004.json' with { type: 'json' };

// English IDs identify content, not public URLs. Never invent a fallback slug.
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
  if (id === 'home') return '/de';
  const path =
    germanLegalRoutes[id as keyof typeof germanLegalRoutes] ??
    decisions.routes.de[id as keyof typeof decisions.routes.de];
  if (!path) throw new Error(`Unreviewed German public path: ${id}`);
  return path;
}
