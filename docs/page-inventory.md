# Inventar stranica i URL-ova

## Obvezni jezični korijeni

| Jezik      | Javni korijen | `html lang` | Zabranjeno           |
| ---------- | ------------- | ----------- | -------------------- |
| talijanski | `/`           | `it`        | `/it/`, query locale |
| hrvatski   | `/hr/`        | `hr`        | query locale         |
| njemački   | `/de/`        | `de`        | query locale         |
| engleski   | `/en/`        | `en`        | query locale         |
| slovenski  | `/si/`        | `sl`        | `/sl/`, query locale |

Svaka objavljena lokalizirana stranica mora imati vlastiti stabilan URL, self-canonical i recipročne hreflang veze samo prema stvarnim ekvivalentima. Language switcher koristi istu eksplicitnu mapu. Ne postoji automatsko preusmjeravanje prema browseru ili lokaciji.

## Webflow referentne rute

Audit od 2. rujna 2026. pronašao je 26 valjanih povezanih stranica. Raniji prolaz otkrio je i pogrešnu rutu koja je zatim uklonjena iz link grafa; audit je zato i dalje eksplicitno provjerava kao poznatu 404 rutu.

| Skup                 | Talijanske referentne rute                                                                                                                                                                                                            |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Home                 | `/`                                                                                                                                                                                                                                   |
| Usluge overview      | `/prestazioni-dentali`                                                                                                                                                                                                                |
| Usluge detail        | `/prestazioni/protesi-definitiva-ancorata-su-4-impianti`; `/prestazioni/premium-ponte-fisso-su-impianti`; `/prestazioni/sbiancamento-dei-denti`; `/prestazioni/corone-faccette-ponti-e-protesi`; `/prestazioni/sedazione-cosciente`   |
| O nama overview      | `/chi-siamo`                                                                                                                                                                                                                          |
| O nama detail        | `/su-di-noi/i-nostri-specialisti`; `/su-di-noi/tutto-in-un-unico-luogo`; `/su-di-noi/come-raggiungerci`; `/su-di-noi/laboratorio-odontotecnico`; `/su-di-noi/materiali-e-apparecchiature`; `/su-di-noi/impianti-di-nuova-generazione` |
| Informacije overview | `/informazioni-per-pazienti`                                                                                                                                                                                                          |
| Informacije detail   | `/informazioni/prima-visita-gratuita`; `/informazioni/tempi-del-trattamento`; `/informazioni/pagamento-flessibile`; `/informazioni/garanzie`; `/informazioni/alloggio`; `/informazioni/trasporto`; `/informazioni/listino-prezzi`     |
| Dokaz i pomoć        | `/testimonianze`; `/faq`; `/domande-e-risposte` (vizualno/navigacijski “Galleria”); `/contatti`                                                                                                                                       |
| Pokvaren link        | `/su-di-noi/sedazione-cosciente` → Webflow 404; valjana stranica je pod `/prestazioni/sedazione-cosciente`                                                                                                                            |

Svaka 200 Webflow ruta ima `lang="it"` i jedan H1, ali nema canonical niti hreflang. Preview `robots.txt` trenutačno sadrži samo `Disallow: /404`, a `/sitemap.xml` vraća 404; nijedno se ne prenosi naslijepo na produkciju.

## Sadašnji live web

Rendered crawl [sadašnjeg live weba](https://www.dentvitalis.com/) na isti datum zabilježen je u `reference/live-site-audit.json`. Headed Chromium pod Xvfb bio je potreban jer su curl i headless Chromium dobili anti-bot interstitial.

Snapshot sadrži 174 otkrivene putanje:

- 38 talijanskih zapisa (`lang=it`);
- po 34 hrvatska, njemačka i engleska;
- 34 slovenska (`lang=sl`);
- 168 jedinstvenih finalnih pathnameova nakon postojećih redirecta.

Svi auditirani live zapisi trenutačno nemaju canonical i hreflang. Live korijeni završavaju bez trailing slasha, ali novi javni model mora koristiti izričito zadane korijene `/hr/`, `/de/`, `/en/`, `/si/` i dosljednu Astro trailing-slash politiku.

`reference/live-site-audit.json` je izvor istine za sirovi crawl, uključujući `requestedPath` i `finalUrl`. Nije automatski redirect plan: prije migracije svaku staru rutu treba svrstati u 1:1 ekvivalent, sadržajnu konsolidaciju, namjerni 410 ili neriješen slučaj. Primjeri postojećih aliasa/redirecta uključuju hrvatski `/hr/iskustva-pacijenata` prema `/hr/testimonials` i `/accommodation` prema `/alloggio`.

## Pravilo za lokalizirane stranice

Za svaki stabilni page ID treba voditi matricu, primjerice:

| Page ID   | IT          | HR               | DE     | EN     | SI     | Status prijevoda              |
| --------- | ----------- | ---------------- | ------ | ------ | ------ | ----------------------------- |
| `home`    | `/`         | `/hr/`           | `/de/` | `/en/` | `/si/` | potvrditi sadržaj svih jezika |
| `contact` | `/contatti` | TBD iz inventara | TBD    | TBD    | TBD    | ne nagađati slugove           |

`TBD` se ne objavljuje kao hreflang niti se zamjenjuje početnom stranicom. Slugovi ostalih jezika moraju se izvući iz live inventara i potvrditi s vlasnikom sadržaja; ne prevode se algoritamski.

## Obvezni SEO izlaz po stranici

- jedinstveni title, description i jedan H1;
- pravilan `html lang`;
- apsolutni self-canonical;
- recipročne `hreflang` veze za postojeće ekvivalente i po potrebi `x-default` samo nakon odluke;
- dosljedni Open Graph/Twitter podaci i lokalizirani social asset kada postoji;
- strukturirani podaci iz potvrđenih poslovnih vrijednosti;
- language switcher prema ekvivalentnom page ID-u;
- redirect iz svake relevantne stare live rute prema semantički istom novom URL-u.

Konačna višejezična matrica i redirect tablica ostaju blokirane dok sadržaj/slugovi i poslovna pravila ne budu odobreni.
