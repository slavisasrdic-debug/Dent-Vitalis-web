import assert from 'node:assert/strict';

// Formatting candidate only. The accepted SEO handoff is the input; a new
// attachment must not silently replace owner-approved content destinations.
export function readableHtaccess(input, { seoApproved = false } = {}) {
  const source = input.toString();
  const boundary = '# END DentVitalis canonical host\n';
  const split = source.indexOf(boundary);
  assert.ok(split >= 0, 'Expected the complete accepted SEO handoff');
  const generated = source.slice(0, split);
  const legacy = source.slice(split + boundary.length);
  const block = (start, end) => {
    const first = generated.indexOf(start);
    const last = generated.indexOf(end, first + start.length);
    assert.ok(first >= 0 && last > first, `Missing routing block: ${start}`);
    return generated.slice(first + start.length, last).trim();
  };
  const setup = block(
    '# Apply known-page rewrites even when a legacy directory remains on disk.\n',
    'RewriteCond %{HTTP_HOST}',
  );
  const host = block('</If>\n', '# Keep dynamic handlers');
  const dynamic = block(
    '# Keep dynamic handlers ahead of files/directories and static rewrites.\n',
    '# Expired campaign',
  );
  const retired = block(
    '# Expired campaign confirmations removed by the owner, not redirected.\n',
    '# Owner-approved',
  );
  const approved = block(
    '# Owner-approved content redirects; optional slash and original query retained.\n',
    '# Additional equivalent',
  );
  const review = block(
    '# Additional equivalent-page redirects requested for SEO review; not installed on hosting.\n',
    '# Only existing static',
  );
  const staticRouting = generated
    .slice(generated.indexOf('RewriteCond %{DOCUMENT_ROOT}/_pages/$1.html -f'))
    .trim();
  const aliases = new Map();
  for (const [, from, to] of legacy.matchAll(
    /^Redirect\s+301\s+(\S+)\s+(\S+)\s*$/gm,
  )) {
    assert.ok(
      !aliases.has(from) || aliases.get(from) === to,
      `Conflicting legacy redirect: ${from}`,
    );
    aliases.set(from, to);
  }
  assert.equal(
    aliases.size,
    57,
    'Legacy inventory changed; review before formatting',
  );
  const fallbackStart = legacy.indexOf('RewriteCond %{REQUEST_FILENAME} -s');
  const cacheStart = legacy.indexOf('<IfModule mod_expires.c>');
  assert.ok(fallbackStart >= 0 && cacheStart > fallbackStart);
  // Preserve the original bootstrap/alias behavior, removing only commentary.
  const fallback = legacy
    .slice(fallbackStart, cacheStart)
    .split('\n')
    .filter((line) => !line.startsWith('#'))
    .join('\n')
    .trim();
  const cacheAndPhp = legacy.slice(cacheStart).trim();
  const finalOrigin = (rules) =>
    rules.replace(/(RewriteRule \S+ )(?=\/)/g, '$1https://www.dentvitalis.com');
  return `# DentVitalis — pregledni .htaccess, 2026-10-04
# ${seoApproved ? 'SEO PRIJEDLOG ODOBREN; talijanska galerija uskladjena na /galleria.' : 'KANDIDAT ZA PREGLED. Ne zamjenjuje samostalno paket niti odobrava aktivaciju.'}
# Zadrzana postojeca/odobrena odredista; nema novih medicinskih spajanja.
# Query parametri (UTM, gclid itd.) ostaju sacuvani.

# 1. OSNOVNE POSTAVKE — novi HTML ima prednost nad starim PHP-om
Options -Indexes
RewriteEngine On
DirectoryIndex index.html index.php
${setup}

# 2. HTTPS + WWW — 308 cuva metodu i tijelo zahtjeva forme
${host}

# 3. PHP FORME I TOKENI — uvijek backend; bez cachea i indeksiranja
${dynamic}

# 4. TRAJNE PROMJENE URL-OVA — ranije odobrene 301
${finalOrigin(approved)}

# 5. DODATNE JASNE ZAMJENE — osam pravila ${seoApproved ? 'odobrenih od vlasnika i SEO mastera' : 'za SEO pregled'}
# ${seoApproved ? 'Odobreno 2026-10-04; nema novih medicinskih spajanja.' : 'Jos nisu zasebno odobrene za produkcijsku instalaciju.'}
${finalOrigin(review)}

# 6. STARE 301 REDIREKCIJE — ista odredista, uklonjeni samo duplikati
# Redirect zadrzava naslijedeno prefix ponasanje; ne mijenjati u siroke regexe.
${[...aliases].map(([from, to]) => `Redirect 301 ${from} https://www.dentvitalis.com${to}`).join('\n')}

# 7. UKINUTE POTVRDE KAMPANJA — odobreni 410, bez preusmjeravanja
${retired}

# 8. NOVI WEB — 308 samo za slash varijantu; HTML se posluzuje interno
${staticRouting}

# 9. POSTOJECE DATOTEKE I PREOSTALE PHP STRANICE
# Cuva tri ranije odobrene stare PHP stranice i njihov bootstrap.
${fallback}

# 10. POSTOJECI CACHE I CPANEL PHP HANDLER — PHP verzija ne mijenja se
${cacheAndPhp}
`;
}
