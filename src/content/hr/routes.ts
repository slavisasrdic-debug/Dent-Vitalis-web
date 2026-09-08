import proposal from '../../../data/hr-routes.proposed.csv?raw';
import { languages, type LanguageLink } from '../site';

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
  const pair = hrRoutes.find(
    (r) => r.it_path === path || r.proposed_hr_path === path,
  );
  return languages.map((language) => {
    const href =
      language.lang === 'it'
        ? (pair?.it_path ?? (path.startsWith('/hr/') ? '' : path))
        : language.lang === 'hr'
          ? (pair?.proposed_hr_path ?? '')
          : '';
    return { ...language, href, available: !!href };
  });
}
