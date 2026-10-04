import { slovenianLegalRoutes } from './legal-routes';
import decisions from '../../../data/seo/localized-route-decisions-20261004.json' with { type: 'json' };

// Slovenian content uses the existing /si prefix; English IDs stay private.
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
  if (id === 'home') return '/si';
  const path =
    slovenianLegalRoutes[id as keyof typeof slovenianLegalRoutes] ??
    decisions.routes.sl[id as keyof typeof decisions.routes.sl];
  if (!path) throw new Error(`Unreviewed Slovenian public path: ${id}`);
  return path;
}
