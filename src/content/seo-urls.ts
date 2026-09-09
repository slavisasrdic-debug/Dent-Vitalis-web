export const productionOrigin = 'https://www.dentvitalis.com';
export const previewOrigin = 'https://dent-vitalis-web.pages.dev';

/** Page identity only: never apply directory slashes to asset URLs. */
export function canonicalUrl(path: string): string {
  const url = new URL(path, productionOrigin);
  if (url.origin !== productionOrigin)
    throw new Error(`Unexpected canonical origin: ${url.origin}`);
  url.pathname = url.pathname.replace(/\/+$/, '') + '/';
  url.search = '';
  url.hash = '';
  return url.href;
}

export function publicationSettings(env: Record<string, string | undefined>) {
  const mode = env.DENTVITALIS_SITE_MODE ?? 'preview';
  if (mode !== 'preview' && mode !== 'production')
    throw new Error('DENTVITALIS_SITE_MODE must be preview or production');
  // Neither NODE_ENV=production nor the Pages main branch authorizes indexing.
  const indexable = mode === 'production';
  const candidate = indexable
    ? productionOrigin
    : (env.CF_PAGES_URL ?? previewOrigin);
  const assetOrigin = new URL(candidate);
  if (
    assetOrigin.protocol !== 'https:' ||
    assetOrigin.username ||
    assetOrigin.password ||
    (!indexable &&
      assetOrigin.hostname !== 'dent-vitalis-web.pages.dev' &&
      !assetOrigin.hostname.endsWith('.dent-vitalis-web.pages.dev'))
  )
    throw new Error(`Unexpected SEO asset origin: ${assetOrigin.origin}`);
  return {
    indexable,
    assetOrigin: assetOrigin.origin,
    robots: indexable ? 'index, follow' : 'noindex, nofollow',
  };
}
