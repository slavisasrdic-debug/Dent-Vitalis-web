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
  if (path === '/' || path === '/hr/' || path === '/hr') {
    return languages.map((language) => {
      const available = ['it', 'hr', 'de'].includes(language.lang);
      const href =
        language.lang === 'it'
          ? '/'
          : language.lang === 'hr'
            ? '/hr/'
            : language.lang === 'de' ? '/de/' : '';
      return { ...language, href, available };
    });
  }
  const translated = path.match(/^\/(de|en|si)(\/.*)?\/?$/);
  if (translated) {
    const suffix = translated[2] ?? '/';
    return languages.map((language) => {
      const prefix = language.lang === 'de' ? '/de' : language.lang === 'en' ? '/en' : language.lang === 'sl' ? '/si' : '';
      const available = language.lang === 'de' || language.lang === 'en' || language.lang === 'sl';
      return {
        ...language,
        href: available ? `${prefix}${suffix}`.replace(/\/{2,}/g, '/') : '',
        available,
      };
    });
  }
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
