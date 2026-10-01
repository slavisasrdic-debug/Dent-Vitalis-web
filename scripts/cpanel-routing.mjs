import { productionOrigin } from '../src/content/seo-urls.ts';
import { pageDocument } from '../src/content/page-paths.ts';
import readiness from '../data/migration-readiness.json' with { type: 'json' };
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
      ['/', '/send', '/gct', '/send-sconto', '/form-tokens'].includes(route) ||
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
    '# The new root must win over the preserved PHP bootstrap.\n' +
    'DirectoryIndex index.html index.php\n' +
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
    '# Keep dynamic handlers ahead of files/directories and static rewrites.\n' +
    'RewriteRule ^(?:send|gct|send-sconto|form-tokens)/?$ index.php [END]\n' +
    // REQUEST_URI becomes /index.php after the internal rewrite; use the
    // original request line so the dynamic response remains uncacheable.
    '<If "%{THE_REQUEST} =~ m#\\s/(?:send|gct|send-sconto|form-tokens)/?(?:[?\\s])#">\n' +
    '  <IfModule mod_expires.c>\n' +
    '    ExpiresActive Off\n' +
    '  </IfModule>\n' +
    '  <IfModule mod_headers.c>\n' +
    '    Header always set Cache-Control "private, no-store, max-age=0"\n' +
    '    Header always set X-Robots-Tag "noindex, nofollow"\n' +
    '  </IfModule>\n' +
    '</If>\n' +
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

/** Only explicit owner-approved, exact Redirect rules may be removed. */
function prepareLegacyRules(original, documents) {
  const kept = [];
  const removalCounts = new Map();
  const protectedRoutes = [
    ...Object.keys(documents),
    '/send',
    '/gct',
    '/send-sconto',
    '/form-tokens',
  ];
  for (let start = 0; start < original.length;) {
    const newline = original.indexOf(10, start);
    const stop = newline === -1 ? original.length : newline + 1;
    const line = original.subarray(start, stop);
    start = stop;
    const rule =
      /^\s*Redirect\s+(301|302|303|307|308|permanent|temp|seeother)\s+(\/\S*)\s+(\S+)\s*$/i.exec(
        line.toString(),
      );
    if (rule) {
      const [, status, from, to] = rule;
      const approved = readiness.legacyHtaccess.approvedRedirectRemovals.find(
        (decision) =>
          String(decision.status) === status &&
          decision.from === from &&
          decision.to === to,
      );
      if (approved && Object.hasOwn(documents, from)) {
        const count = (removalCounts.get(approved) ?? 0) + 1;
        if (count > approved.sourceOccurrences)
          throw new Error(
            'Legacy Redirect removal count exceeds owner approval; review required.',
          );
        removalCounts.set(approved, count);
        continue;
      }
      const conflict = protectedRoutes.find(
        (route) =>
          route === from ||
          route.startsWith(from.endsWith('/') ? from : from + '/'),
      );
      if (conflict)
        throw new Error(
          `Legacy Redirect intercepts protected route ${conflict}; owner review required.`,
        );
    }
    kept.push(line);
  }
  return Buffer.concat(kept);
}

/** Preserve legacy bytes except the separately recorded approved removals. */
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
  return Buffer.concat([
    Buffer.from(canonicalHostRules(documents)),
    prepareLegacyRules(base, documents),
  ]);
}
