# SEO migracija

Izvedeno je 55 IT/HR stranica iz prihvaćenih izvora. Potpuna migracijska mapa starog javnog weba i produkcijski hosting ostaju zasebna odluka; ove tehničke dorade ne odobravaju objavu.

## Usklađivanje nakon audita — 9. rujna 2026.

- Korisnik je odobrio provedbu SEO nalaza. Canonical, hreflang, OG URL, schema page/Service/Offer/Breadcrumb URL-ovi i XML koriste završni `/` preko `canonicalUrl()`. Slugovi, izvorni sadržajni ID-evi, query/fragment odredišta internih linkova i povijesne redirekcije nisu promijenjeni. Astro gradi directory/index.html, a postojeći Cloudflare Pages poslužuje directory URL-ove; dev server ne uvodi novu obveznu redirekciju.
- Talijanske pravne stranice dobivaju title iz postojećeg H1 + brenda te description iz prve potpune rečenice vidljivog članka. Izvorni JSON/export i pravni body ostaju nepromijenjeni. To je odobreno odstupanje od Webflow metapodataka „Dentvitalis33” / praznog opisa, ne razlog za mijenjanje reference radi copy audita.
- Kontakti su `ContactPage`, O nama `AboutPage`, galerija `ImageGallery`, direktoriji usluga/informacija i video-testimonijala `CollectionPage`. Pravne i ostale informativne stranice ostaju `WebPage`; pet usluga po jeziku zadržava `Service` i postojeće sadržajno potkrijepljene ponude. Nisu dodani članci, ocjene, medicinski revieweri ni proizvoljne cijene.
- Svih 13 datuma video objave dolazi iz javnih YouTube podataka, uz izvor i SHA-256 u `data/video-metadata.json`. Naslovi i prikazani videi ostaju lokalizirani prema postojećem sadržaju; ne tvrdi se da je govor preveden. Puni mrežni odgovori ostaju u ignoriranom `.astro/audits/video-metadata-2026-09-09/`, ne u javnom buildu. Datum je preciznosti dana, bez izmišljene ponoći ili zone. Dodavanje novog videa bez provjerenog datuma prekida build.

## Preview i buduća produkcija

`publicationSettings()` je jedno mjesto za SEO režim. Zadano je **preview**, čak i uz `NODE_ENV=production` i `CF_PAGES_BRANCH=main`.

- Preview: HTML ostaje `noindex, nofollow`; postojeća `_headers` pravila dodatno štite stabilni i verzionirani `*.pages.dev` preview. `robots.txt` dopušta crawl radi čitanja noindexa i ne oglašava sitemap. Nema `Disallow: /` koji bi sakrio noindex.
- Preview mediji u OG/Twitter/JSON-LD koriste [Cloudflareov `CF_PAGES_URL`](https://developers.cloudflare.com/pages/configuration/build-configuration/#environment-variables), odnosno stabilni Pages preview kad varijabla ne postoji. Dev prikaz koristi vlastiti origin. Kanonski identitet klinike i budućih stranica ostaje `https://www.dentvitalis.com`, nije zamijenjen preview domenom.
- **Tek nakon zasebnog odobrenja produkcije**, build s `DENTVITALIS_SITE_MODE=production` uključuje indeksiranje, produkcijske media URL-ove i `Sitemap: https://www.dentvitalis.com/sitemap-index.xml` u robotsu. Varijabla nije sada postavljena niti se aktivira samim pushom. 404 uvijek ostaje noindex. Pages HTTP noindex pravila ostaju na preview hostovima i tada.
- Na budući server prenosi se samo provjereni `dist/`, ne repozitorij, izvori, tajne ili node_modules. Server mora podržati directory `index.html`, HTTPS/canonical host, dogovorene 301/410 i pravi 404 status. Cloudflare `_headers` nisu automatski Apache/cPanel konfiguracija: cache/security/preview headere treba prilagoditi potvrđenom serveru. Obrazac zahtijeva zasebno odobren backend.
- GitHub ostaje izvor istine; preview automatski prati push. Produkcijski build/deploy može se naknadno povezati preko GitHub Actions + SSH/SFTP ili cPanel Git deploymenta ako hosting to omogućuje. Produkcijske vjerodajnice, ciljni direktorij, odobrenje i rollback još nisu konfigurirani.

FAQ podaci ostaju sadržajno istiniti, bez obećanja proširenih Google FAQ rezultata: [Google ih je ukinuo u svibnju 2026.](https://developers.google.com/search/updates#may-2026). Video schema mora slijediti [stvarne podatke i zahtjeve](https://developers.google.com/search/docs/appearance/structured-data/video), a markup sam ne jamči indeksiranje ili rangiranje.

## Redirect inventar

### Prvi aktualni inventar — 9. rujna 2026.

`data/seo/url-inventory.json` sadrži 206 otkrivenih i provjerenih URL-ova:
196 iz javnog sitemapa, dopunjeno ranijim inventarom 174 adrese i internim
poveznicama. HTTP GET provjera našla je 181 odgovor 200 i 25 odgovora 404;
svih 25 nepostojećih adresa nalazi se u starom javnom sitemapu. To nisu 404
pogreške novog previewa. Stari `robots.txt` također vraća 404.

Od dostupnih adresa 105 pripada DE/EN/SI verzijama koje još nisu izrađene u
novom projektu. Njih 19 ima isti normalizirani put kao novi web, ali i za njih
treba potvrditi sadržajnu ekvivalenciju. Preostalih 57 dostupnih adresa traži
pojedinačno mapiranje. Brojevi uključuju zabilježene ulazne alias URL-ove;
nisu broj jedinstvenih sadržajnih stranica.

`samePathCandidate` je samo kandidat, ne odluka o redirekciji. Nijedan 301/410
nije odobren ili instaliran ovom provjerom, a `data/redirects.csv` ostaje
namijenjen zasebno pregledanim migracijskim odlukama. Posebno paziti na
postojeći smjer `/hr/iskustva-pacijenata` → `/hr/testimonials` i na stare
pojedinačne usluge koje nemaju dokazan ekvivalent u novim paketima.

Ponovljiv postupak: `npm run audit:urls`; `npm run audit:urls -- --cached`
ponovno obrađuje iste odgovore bez mrežnog dohvata. Svaki zapis čuva datum,
status, konačni URL, SHA-256, metapodatke i način otkrivanja. Raw odgovori su
u ignoriranom `.astro/audits/url-inventory-2026-09-09/`, ne u buildu. Audit radi
isključivo GET zahtjeve, najviše dva istodobno, bez slanja obrazaca i bez
zaobilaženja zaštita. Sitemap/interni linkovi nisu potpuni dokaz svih URL-ova
koji imaju promet: prije konačne migracije dodati Search Console, backlink i
server-log podatke kad budu dostupni. Izvorni inventar od 2. rujna je sačuvan.

Neutralni izvor podataka je `/data/redirects.csv` sa stupcima:

1. `old_url`
2. `language`
3. `old_page_title`
4. `target_url`
5. `http_status`
6. `reason`
7. `test_status`

## Redoslijed rada

1. Prikupiti sve indeksabilne URL-ove trenutačnog javnog weba za pet jezika.
2. Zabilježiti status, canonical, title, hreflang, sadržajnu namjeru i relevantne interne linkove svake stranice.
3. Usporediti svaki stari URL s potvrđenim novim sadržajem.
4. Dodijeliti 301 samo stvarnom ekvivalentu; za sadržaj bez zamjene posebno odlučiti o relevantnoj zamjeni ili 410.
5. Tek nakon potvrde hostinga generirati konfiguraciju redirecta koja čuva query parametre.
6. Automatizirano provjeriti status, cilj, redirect chain, canonical, hreflang, sitemap, robots i 404.

## Jezični ugovor

| Jezik      | Javni korijen |
| ---------- | ------------- |
| Talijanski | `/`           |
| Hrvatski   | `/hr/`        |
| Njemački   | `/de/`        |
| Engleski   | `/en/`        |
| Slovenski  | `/si/`        |

Ne stvarati `/it/`, `/sl/`, query-param lokalizaciju ili browser/IP redirecte. `x-default` vodi na talijansku početnu stranicu.

## Pre-launch izlazni kriteriji

- svaki stari URL ima dokumentiranu i testiranu odluku
- nema masovnog redirecta na naslovnicu
- nema redirect chainova ni petlji
- canonical i recipročni hreflang odgovaraju stvarnim prijevodima
- sitemap sadrži samo canonical, indeksabilne URL-ove
- production robots dopušta indeksiranje, preview je noindex
- nepostojeće stranice stvarno vraćaju HTTP 404
