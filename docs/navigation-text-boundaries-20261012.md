# Navigacijski tekstualni razmaci — V22, 12. listopada 2026.

Vlasnikov screenshot prikazuje `implantataFiksni` u Google isječku HR homea.
Verificirani V21 HTML potvrđuje isti izvorni problem: zasebni linkovi u
`.site-nav .dropdown-links` nemaju tekstualni razmak. V21 je obuhvatio
semantičke blokove i footer/sidebar/kontakt stavke, ali ne te linkove.

`html-text-boundaries.ts` sada prepoznaje i te nezavisne dropdown linkove
te glavne `.nav-link` stavke, samo unutar `.site-nav`. Sva tri dropdowna
(usluge, o nama, informacije) koriste isto pravilo u svih pet jezika.
Unutarnji spanovi, dijelovi riječi, nazivi, URL-ovi i struktura nisu mijenjani.
Nema novog JS-a, CSS-a, izvora, dependencyja ili `data-nosnippet` pravila.

## Prihvat i granice dokaza

- V21 instalacija i svih 143 server hasha potvrđeni su korisnikovim
  prethodnim izvještajem. V21 ZIP SHA provjeren lokalno; svih 142 njegovih
  HTML datoteka provjereno prema manifestu.
- Javni read-only dohvat 12. listopada vraća zaštitnu HTML stranicu
  `One moment, please…`, uključujući za manifest. HTTP 200 tog odgovora
  nije potvrda stvarnog weba; ne pokušava se zaobići zaštita.
- Pet unit testova obuhvaća navigacijski razmak, očuvanje inline riječi,
  zaštićenog koda i idempotenciju.
- Deset Chromium scenarija: pet jezičnih homeova × 390/1440px.
  Izvorni V21 i dopunjeni HTML koriste iste produkcijske assete.
  Uspoređuju se rectovi svih body elemenata sa zatvorenim izbornikom i
  svakim od tri otvorena dropdowna. TextContent je jednak nazivima linkova
  spojenim običnim razmacima. Enter otvara dropdown; native child link
  vodi na stvarni lokalizirani sadržaj; kontaktni popup i Escape rade.
  Forme i poruke nisu slane. Snimke HR izbornika u `/tmp/dv-navigation-v22-hr-*`.
  Browser plugin nije dostupan, korišten postojeći Playwright.
- Svih deset browser scenarija i pet unit testova prolazi; Astro check
  315 datoteka bez dijagnostike, ciljani ESLint/Prettier te production build
  142 stranice prolaze. HR desktop/mobilne snimke vizualno pregledane.
- Paket uspoređuje svih 142 production HTML-a sa V21. Dodatna neovisna
  usporedba dopušta samo razmake oko dropdown/main-nav linkova, ne bilo koju
  whitespace izmjenu. Head/schema, skripte, CSS, forme, SVG i svi generirani
  asseti provjeravaju se prema prethodnim bajtovima/hashovima.

## Paket

`node scripts/package-text-boundaries-update.mjs --navigation-v22`
priprema `.astro/releases/dentvitalis-navigation-text-20261012-v22.zip`.
Receipt je `data/seo/navigation-text-v22-release-20261012.json`.
141 HTML-a s navigacijom + manifest; 404 bez navigacije ostaje nepromijenjen.
Stari UUID-jevi i sve non-HTML manifest stavke sačuvani su. Priprema nije objava.

README/patch-manifest propisuju svježu kvotu, ZIP/stare hashove, backup istih
142 izvornika 0700, pojedinačnu zamjenu HTML-a 0644 i manifest posljednji.
Ne preimenovati public_html (0750), ne zamjenjivati cijeli `_pages`, ne dirati
backend/PHP/CRM/forme, assete, XML, redirecte, GTM/CookieYes/Elfsight ili DNS.
Zbog zadnje poznate kvote 53,82 MB treba uračunati ZIP, extract, backup i
eventualni dodatni displaced-originals te zadržati barem 10 MB rezerve.
Ne brisati stare podatke ako prostora nema. Rollback vraća samo ciljne izvornike.

Google sam bira tekst i može zadržati stari isječak do novog obilaska;
ne jamči se izgled ni vrijeme osvježavanja.
[Primarna Google dokumentacija](https://developers.google.com/search/docs/appearance/snippet).
