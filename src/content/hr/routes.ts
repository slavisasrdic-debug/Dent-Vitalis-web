import proposal from '../../../data/hr-routes.proposed.csv?raw';
import { languages, type LanguageLink } from '../site';
import { englishPageIds, route as enRoute } from '../en/routes';
import { germanPageIds, route as deRoute } from '../de/routes';

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
  // SL remains a draft; matching a suffix is not proof of readiness.
  const germanId = germanPageIds.find(
    (id) => normalize(deRoute(id)) === currentPath,
  );
  const englishId = englishPageIds.find(
    (id) => normalize(enRoute(id)) === currentPath,
  );
  const pair = routeDecisions.find(
    (r) =>
      normalize(r.it_path) === currentPath ||
      (r.status === 'approved' &&
        normalize(r.proposed_hr_path) === currentPath) ||
      r.page_id === germanId ||
      r.page_id === englishId ||
      (currentPath === '/de' && r.page_id === 'home'),
  );
  const germanEquivalent =
    pair && germanPageIds.some((id) => id === pair.page_id)
      ? deRoute(pair.page_id)
      : '';
  return languages.map((language) => {
    const href =
      language.lang === 'it'
        ? (pair?.it_path ?? '')
        : language.lang === 'hr'
          ? (pair?.proposed_hr_path ?? '')
          : language.lang === 'de'
            ? germanEquivalent
            : language.lang === 'en' &&
                pair &&
                englishPageIds.some((id) => id === pair.page_id)
              ? enRoute(pair.page_id)
              : '';
    return { ...language, href, available: !!href };
  });
}
