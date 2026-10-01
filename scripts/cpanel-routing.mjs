import { productionOrigin } from '../src/content/seo-urls.ts';
import { pageDocument } from '../src/content/page-paths.ts';
import {
  thankYouDocuments,
  retiredThankYouRoutes,
} from '../src/content/thank-you-routes.ts';

const begin = '# BEGIN DentVitalis canonical host\n';
const end = '# END DentVitalis canonical host\n';

/** Production-only Apache rules. The target is never taken from request headers. */
export function canonicalHostRules(documents = thankYouDocuments) {
  for (const [route, document] of Object.entries(documents)) {
    if (
      ['/', '/send', '/gct'].includes(route) ||
      pageDocument(route) !== document ||
      route.endsWith('/')
    )
      throw new Error(`Invalid static page mapping: ${route}`);
  }
  const origin = new URL(productionOrigin);
  if (
    origin.protocol !== 'https:' ||
    !origin.hostname.startsWith('www.') ||
    origin.port ||
    origin.username ||
    origin.password ||
    origin.pathname !== '/' ||
    origin.search ||
    origin.hash
  )
    throw new Error('Expected an HTTPS www production origin without a path.');

  const escape = (host) => host.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const apex = escape(origin.hostname.slice(4));
  const canonicalHost = escape(origin.hostname);
  return (
    begin +
    '# Permanent redirect; 308 also preserves POST bodies and HTTP methods.\n' +
    '# Preserve the original path and query. Do not trust X-Forwarded-Proto.\n' +
    'RewriteEngine On\n' +
    '# Apply known-page rewrites even when a legacy directory remains on disk.\n' +
    'RewriteOptions AllowNoSlash\n' +
    // Restrict directory behavior changes to our explicit static page inventory.
    `<If "%{REQUEST_URI} =~ m#^/(?:${[...Object.keys(documents), ...retiredThankYouRoutes].map((route) => route.slice(1)).join('|')})/?$#">\n` +
    'DirectorySlash Off\n' +
    '</If>\n' +
    `RewriteCond %{HTTP_HOST} ^(?:www\\.)?${apex}(?::[0-9]+)?$ [NC]\n` +
    'RewriteCond %{HTTPS} !=on [OR]\n' +
    `RewriteCond %{HTTP_HOST} !^${canonicalHost}$\n` +
    // THE_REQUEST retains percent encoding; REQUEST_URI is decoded by Apache.
    'RewriteCond %{THE_REQUEST} \\s(/[^?\\s]*)\n' +
    `RewriteRule ^ ${origin.origin}%1 [R=308,L,NE]\n` +
    '# Expired campaign confirmations removed by the owner, not redirected.\n' +
    `RewriteRule ^(?:${retiredThankYouRoutes.map((route) => route.slice(1)).join('|')})/?$ - [G,L]\n` +
    '# Canonical page paths omit the final slash; legacy endpoints are untouched.\n' +
    `RewriteRule ^(${Object.keys(documents)
      .map((route) => route.slice(1))
      .join('|')})/$ /$1 [R=308,L,NE]\n` +
    Object.entries(documents)
      .map(
        ([route, document]) =>
          `RewriteRule ^${route.slice(1)}$ ${document.slice(1)} [END]\n`,
      )
      .join('') +
    end
  );
}

/** Prefix our owned block without changing any bytes of the legacy rules. */
export function mergeLegacyHtaccess(legacy, documents = thankYouDocuments) {
  if (!Buffer.isBuffer(legacy) || !legacy.length)
    throw new Error(
      'A non-empty copy of the existing cPanel .htaccess is required.',
    );
  const startMarker = Buffer.from(begin);
  const endMarker = Buffer.from(end);
  let base = legacy;
  const start = legacy.indexOf(startMarker);
  const stop = legacy.indexOf(endMarker);
  if (start !== -1 || stop !== -1) {
    if (
      start !== 0 ||
      stop < startMarker.length ||
      legacy.indexOf(startMarker, startMarker.length) !== -1 ||
      legacy.indexOf(endMarker, stop + endMarker.length) !== -1
    )
      throw new Error(
        'Ambiguous DentVitalis canonical block; review .htaccess manually.',
      );
    base = legacy.subarray(stop + endMarker.length);
  }
  if (!base.length) throw new Error('Legacy rules are missing.');
  return Buffer.concat([Buffer.from(canonicalHostRules(documents)), base]);
}
