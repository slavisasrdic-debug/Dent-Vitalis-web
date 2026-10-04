import assert from 'node:assert/strict';

export const performanceCacheBlock = `
# BEGIN DentVitalis versioned asset cache
# Only content-hashed filenames. HTML, PHP, tokens, XML and old assets are excluded.
<FilesMatch "^(?:[A-Za-z0-9_-]+\\.[A-Za-z0-9_-]{8,}\\.(?:css|js)|montserrat-[a-f0-9]{12}\\.(?:css|js)|DV-MObile-video01_3_optimized-[a-f0-9]{12}\\.mp4)$">
  <IfModule mod_expires.c>
    ExpiresActive Off
  </IfModule>
  <IfModule mod_headers.c>
    Header unset Cache-Control
    Header always unset Cache-Control
    Header set Cache-Control "public, max-age=31536000, immutable"
  </IfModule>
</FilesMatch>
# END DentVitalis versioned asset cache
`;

export function performanceHtaccess(input) {
  const source = input.toString();
  assert.ok(source.includes('# POST-LIVE APPROVED REDIRECTS'));
  assert.ok(source.includes('private, no-store, max-age=0'));
  assert.ok(!source.includes('# BEGIN DentVitalis versioned asset cache'));
  // Append only; preserve every byte of the accepted live v12 configuration.
  return source + performanceCacheBlock;
}
