# SEO migracija

Ovaj dokument je početni okvir. Inventar se popunjava tek nakon što se dostavi Webflow export i odobri početak inventara.

## Redirect inventar

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
