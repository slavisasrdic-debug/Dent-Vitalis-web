# Prihvat izvora — 7. rujna 2026.

Oba ZIP-a su strukturno ispravna i raspakirana uz očuvana imena, strukturu i bajtove. Handoff odgovara svom manifestu. Standardni export i handoff podudaraju se u svih 28 talijanskih stranica, uspoređenom tekstu, metapodacima i konfiguraciji interakcija. Razlike su uglavnom način pakiranja, framework CSS, lokalizacija asset URL-ova i opseg uključenih medija. Ovo nije potvrda vizualne ekvivalencije u browseru niti potpunosti višejezičnog produkcijskog sadržaja.

## Integritet i raspakiravanje

| Paket          |  ZIP veličina |           Zapisi / datoteke |   Raspakirano | Provjera                                                                          |
| -------------- | ------------: | --------------------------: | ------------: | --------------------------------------------------------------------------------- |
| Handoff        | 180.578.370 B |               1.538 / 1.538 | 268.532.453 B | svi CRC-ovi prolaze; 1.537/1.537 manifestnih veličina i SHA-256 zbrojeva odgovara |
| Webflow export |  74.327.837 B | 305 / 297, uz 8 direktorija |  74.283.179 B | svi CRC-ovi prolaze; svi raspakirani bajtovi odgovaraju ZIP-u                     |

Raspakirane lokacije:

- `reference/webflow-handoff/2026-09-07/extracted/`
- `source-assets/webflow-export/2026-09-07/extracted/`

Handoff SHA-256:

```text
cb7d1c6a603e05ceaee480b981fa02612bee3839c045d59268684ae3ec7080dd
```

Webflow export SHA-256:

```text
4457b10d129e23c90a82bddec134a2cab31acc060da1c7f209b8f3201504f159
```

Manifest navodi svih 1.538 datoteka. `manifest.json` ima izričito `bytes: null`, `sha256: null` i obrazloženje izuzeća vlastitog hasha; preostalih 1.537 zapisa provjereno je pojedinačno. Nema nedostajućih, dodatnih ili dupliciranih manifestnih putanja. Svih 202 JSON i 10 CSV datoteka uspješno je parsirano; CSV redovi odgovaraju zaglavljima.

Standardni export nema dobavljačev manifest ni potpis. Njegov navedeni SHA-256 lokalni je otisak zaprimljenog ZIP-a; CRC i usporedba nakon raspakiravanja dokazuju integritet arhiva, ne neovisnu autentičnost pošiljatelja.

Prije ekstrakcije provjerene su apsolutne putanje, `..`, symlinkovi, posebne datoteke, šifrirani zapisi, kolizije imena i file/directory sukobi. Obje `extracted` mape bile su nove. Datoteke su stvarane ekskluzivno, bez prepisivanja; ponovni prolaz provjerio je postojeću ekstrakciju bez pisanja izvora.

Ponovljiva provjera: `python3 scripts/accept-webflow-sources.py`. Dokaz je `reference/webflow-handoff/2026-09-07/intake-verification.json`.

## Pročitani handoff i granice izvora

Pročitani su `README-HANDOFF.md`, cijeli strukturirani `manifest.json`, `coverage.csv` i `missing-data.md`, uz relevantne page/content, style, font, asset, locale i interaction zapise. Handoff snapshot je `dentvitalis-20260907T072711Z`, prikupljen od 07:27:11 do 08:20:14 UTC. Zabilježeni Webflow `lastPublished` je 07:21:32 UTC, a `lastUpdated` 07:21:41 UTC.

Komentar u standardnom export HTML-u kaže `Last Published: Mon Sep 07 2026 08:20:41 GMT+0000`. To je drugačija vremenska oznaka izvora; sama po sebi ne dokazuje promjenu sadržaja. Usporedba ispod nije utvrdila razliku u uspoređenim tekstovima, projektnim stilovima ili IX2 konfiguraciji. Neobjavljena Designer stanja koja handoff nije mogao dohvatiti i dalje nisu provjerena.

Napomene u izvornom handoffu da standardni ZIP još nije dostavljen povijesno su točne za trenutak nastanka paketa. Ovaj prihvat zatvara taj nedostatak; originalni README, manifest i coverage nisu prepisani.

## Usporedba verzija

| Područje             | Nalaz                                                                                                                                                                                                                                                                                                                                       |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Projekt i stranice   | 28/28 istih `data-wf-page` ID-ova i isti `data-wf-site`; nema stranice samo u jednom paketu                                                                                                                                                                                                                                                 |
| Tekstovi             | 28/28 jednakih nizova tekstualnih čvorova nakon normalizacije whitespacea; broj NBSP znakova odgovara na svih 28 stranica; sirovi HTML i uvlačenje nisu bajtno jednaki                                                                                                                                                                      |
| Naslovi i SEO        | 28/28 istih heading nizova, titleova, meta deklaracija, canonical i hreflang skupova; jednakost ne znači da su ti podaci potpuni ili odobreni za produkciju                                                                                                                                                                                 |
| Inline JavaScript    | 416/416 blokova ima jednaku parsiranu strukturu/literalne vrijednosti; JSON-LD je uspoređen kao JSON. Kod iz paketa nije izvršavan                                                                                                                                                                                                          |
| Inline CSS           | Na 28/28 stranica jednaka parsirana pravila u istom redoslijedu; razlike u izvornom zapisu su whitespace/uvlačenje                                                                                                                                                                                                                          |
| Projektni stylesheet | Objavljeni zajednički CSS sadrži 1.053 projektna pravila. `css/dentvitalis33.css` sadrži ista pravila istim redoslijedom i dodatno ponavlja isti custom `@font-face` na kraju; asset URL-ovi normalizirani su na naziv izvora za usporedbu                                                                                                  |
| Framework CSS        | Export razdvaja `normalize.css`, `components.css` i projektni CSS; public snapshot ima zajednički stylesheet. Ukupno je 1.415 naspram 1.427 parsiranih pravila i 90 skupina izvornih razlika: redoslijed deklaracija, prefiksi, kratice boja/brojeva, shorthand/longhand i dodatna reset pravila. To nije dokaz identičnog computed prikaza |
| IX2                  | Potpuno jednaki objekti: 276 događaja, 14 action lista i iste četiri media konfiguracije; nema dodanih, uklonjenih ili promijenjenih ključeva                                                                                                                                                                                               |
| Ostale interakcije   | Isti inline kod; vanjski typed.js, before/after booster, WebFont i jQuery ostaju vanjske reference u standardnom HTML-u. Handoff čuva dohvaćene runtime datoteke i semantičke bilješke                                                                                                                                                      |
| Lokalni resursi      | Nema nedostajućeg lokalnog `src`, `srcset`, `poster`, stylesheet/icon linka ni CSS `url()` resursa u exportu. Vanjski URL nije time potvrđen kao lokalno dostupan                                                                                                                                                                           |

Detaljna usporedba po stranici, file hash inventar i grupe identičnih bajtova nalaze se u `reference/webflow-handoff/2026-09-07/source-comparison.json`. Skripte `compare-webflow-sources.py`, `compare-inline-scripts.mjs` i `inspect-export-ix2.mjs` analiziraju izvor bez izvršavanja Webflow koda.

Python usporedba koristi dostupne `beautifulsoup4 4.14.3` i `tinycss2 1.4.0`; Node AST provjera koristi Acorn iz postojećeg zaključanog dependency stabla. Nije dodavan UI framework ni mijenjan Astro scaffold.

## Fontovi, slike i video

- Handoff sadrži 238/238 registriranih master asseta. Standardni export ima 253 datoteke u `images/`, 11 u `videos/` i jednu u `fonts/`; uključuje velik broj responsive izvedenica.
- Za 61 handoff master pronađeni su bajtno identični export asseti. To uključuje svih 59 master zapisa kojima handoff pripisuje uporabu u snimljenom public HTML-u. Preostalih 177 master zapisa nema identičnu export kopiju i nema zabilježenu statičku public uporabu; to ne dokazuje da nisu potrebni u Designer komponentama ili budućem sadržaju.
- Montserrat i Inter Tight traže se istim Google WebFont konfiguracijama. Standardni ZIP ne sadrži njihove Google font datoteke. Handoff `assets/fonts/` sadrži 23 TTF-a za te Google obitelji te originalni custom WOFF2. Fontovi se zato mogu pripremiti iz predanih izvora, uz provjeru stvarno korištenih težina, browser odabira i licence.
- Custom WOFF2 `3b19cb4818cacb8c8a21515464fc1167.woff2` identičan je u oba izvora (38.996 B). Njegova prisutnost i registracija ne dokazuju da se koristi za vidljivi tekst. Webflow ikone su zaseban embedded font.
- Export donosi desktop i mobile originalne MP4-e, MP4/WebM izvedenice i postere. Home i dalje referencira dva videa: `Dentvitalis_video-left_*` i `DV-MObile-video01_3_*`. Originalni desktop/mobile MP4-evi podudaraju se s handoff masterima; izvedenice i posteri dopunjuju handoff koji je čuvao njihove URL-ove.
- Handoff uključuje i pet drugih registriranih MP4 mastera bez identične export kopije. Nije ih opravdano automatski odbaciti na temelju ovog statičkog pregleda.
- **32 vanjska image resursa nisu lokalno mapirana u handoffu i ostaju udaljeni URL-ovi u exportu: 29 galerijskih prije/poslije slika s drugog Webflow projekta i 3 društvene SVG ikone.** Njihovi originali trebaju se pribaviti prije završetka tih komponenti. Ne zamjenjivati ih sličnim slikama.
- YouTube i Google Maps ostaju vanjski servisi, a ne lokalno izvezeni videosadržaji/karta. Njihove URL konfiguracije postoje; nisu testirani mrežna dostupnost, playback, pristanak ni forma.

## Stvarna jezična pokrivenost

Oba nova izvora sadrže **samo talijanski**: 28 sadržajnih stranica s `lang="it"`, jedan primarni locale i nijedan sekundarni locale. `content/hr.json` je zapis `status: not-present`, `content: null`; nije hrvatski prijevod. DE/EN/SI novog sadržaja također nema.

Handoff dodatno sadrži stare live jezične URL-ove radi konteksta i generički Webflow error HTML na engleskom; to ne predstavlja novu englesku verziju. Postojeći jezični linkovi vode na stari javni web.

Handoffovi predloženi `/hr`, `/de`, `/en`, `/si` zapisi ne mijenjaju obvezne projektne korijene `/`, `/hr/`, `/de/`, `/en/`, `/si/`. Za slovenski je `html lang`/hreflang `sl`. Ne stvarati hreflang parove ni prijevode iz odsutnog sadržaja.

## Razlike prema auditu od 2. rujna

Postojeći screenshotovi i JSON auditi ostaju sačuvani kao povijesni dokaz. Za početak vizualne implementacije treba obnoviti baseline prema novom snapshotu:

- sada postoje dvije dodatne talijanske pravne stranice: `/condizioni-di-utilizzo` i `/informativa-sulla-privacy`;
- aktualni tamni teal token je `--tamana-call: #045a72` (ranije dokumentirano `#05617a`), a postoji i `--svjetlija-plava: #057492`;
- handoff otkriva i granice 359, 992 i druga zasebna CSS/JS pravila, uz ranije poznate breakpointe; prethodna tablica nije potpuni aktualni skup;
- HTML sada sadrži zasebno obvezno prezime (`Last-Name-2`); telefon je također obvezan, što se razlikuje od starog audita;
- dodani su globalni/page custom kod, inquiry modal, kontrola sticky CTA-a, form/upload izmjene, alt tekstovi i promjene asseta;
- WhatsApp placeholder `+ADDNUMBERHERE` i dalje postoji;
- zabilježeni robots iz novog paketa je doslovno `User-agent: *\nDisallow: /`. Raniji navod `/404` u dokumentaciji nije primjenjiv; snapshot blokira cijeli staging host. To ne određuje produkcijsku politiku;
- izvor sadrži 15 interaktivnih before/after usporedbi, dok AGENTS.md predviđa statički galerijski grid. Prije izrade galerije treba razriješiti tu konkretnu razliku zahtjeva; ovaj prihvat ne mijenja dogovor.

## Što ostaje otvoreno i spremnost za rad

Prihvat izvora je prošao. Može se započeti sljedeća faza: osvježiti renderiranu vizualnu specifikaciju i potom izrađivati talijanske komponente prema novim izvorima. Nema osnove za početak hrvatskih ili drugih prijevoda kao da su već dostavljeni.

Otvoreno ostaje:

1. ažurna browser provjera breakpointa, cropa, fontova, modala, sticky CTA-a, tipkovnice, reduced-motion/no-JS i precedencea animacijskog koda;
2. 82 IX2 događaja bez statički pronađenog targeta i neprovjerena unpublished Designer stanja;
3. 32 vanjska image izvora te odluka o galerijskom ponašanju;
4. novi HR/DE/EN/SI sadržaji i odobrena matrica ekvivalentnih URL-ova;
5. CMS schema/items, postojeće redirect postavke i native utility/404 Designer podaci, koje handoff označava nedostupnima; njihova nedostupnost nije dokaz nepostojanja;
6. potvrđen WhatsApp broj, poslovne/sadržajne nedoumice iz `content-inconsistencies.md`, backend forme/uploada i integracijske odluke prije odgovarajućeg produkcijskog povezivanja.

Nije izrađena nijedna stranica, nije ponovno inicijaliziran Astro, nije izvršen commit/push ni deployment. Postojeći Git index ostao je nepromijenjen.
