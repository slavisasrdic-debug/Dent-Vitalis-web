import proposal from '../../../data/hr-routes.proposed.csv?raw';
import { languages, type LanguageLink } from '../site';
import { localizedPageRegistry } from '../localized-page-registry';

const [header, ...lines] = proposal.trim().split('\n');
const keys = header!.split(',');
interface RouteDecision {
  page_id: string;
  it_path: string;
  proposed_hr_path: string;
  source_refs: string;
  status: string;
  existing_live_path: string;
}
export const routeDecisions: RouteDecision[] = lines.map(
  (line) =>
    Object.fromEntries(
      line.split(',').map((v, i) => [keys[i]!, v]),
    ) as unknown as RouteDecision,
);
export const hrRoutes = routeDecisions.filter(
  (route) => route.status === 'approved',
);
export function route(id: string) {
  const value = hrRoutes.find((r) => r.page_id === id)?.proposed_hr_path;
  if (!value) throw new Error(`Unapproved Croatian route: ${id}`);
  return value;
}
export function italianRoute(id: string) {
  return hrRoutes.find((r) => r.page_id === id)!.it_path;
}
export function equivalentLanguages(path: string): LanguageLink[] {
  const normalize = (value: string) => value.replace(/\/$/, '') || '/';
  const currentPath = normalize(path);
  // Only registered, reviewed destinations may be offered as translations.
  // EN/SL adapters are still drafts; matching a suffix is not proof of readiness.
  const germanPage = localizedPageRegistry.de.find(
    (entry) => `/de/${entry.route}` === currentPath,
  );
  const pair = routeDecisions.find(
    (r) =>
      normalize(r.it_path) === currentPath ||
      (r.status === 'approved' &&
        normalize(r.proposed_hr_path) === currentPath) ||
      r.page_id === germanPage?.route ||
      (currentPath === '/de' && r.page_id === 'home'),
  );
  const germanEquivalent =
    pair?.page_id === 'home'
      ? '/de/'
      : localizedPageRegistry.de.some((entry) => entry.route === pair?.page_id)
        ? `/de/${pair!.page_id}`
        : '';
  return languages.map((language) => {
    const href =
      language.lang === 'it'
        ? (pair?.it_path ?? '')
        : language.lang === 'hr'
          ? (pair?.proposed_hr_path ?? '')
          : language.lang === 'de'
            ? germanEquivalent
            : '';
    return { ...language, href, available: !!href };
  });
}
