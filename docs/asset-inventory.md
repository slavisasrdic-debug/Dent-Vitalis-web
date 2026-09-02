# Inventar asseta

## Izvori i status

Završni mrežni audit renderiranog Webflow previewa zabilježio je 103 zahtjeva tipa image/font/media: 13 fontova, 88 slika i 2 videa. Od toga `cdn.prod.website-files.com` isporučuje 70 DentVitalis image zahtjeva i oba videa; dio su responsive varijante iste slike. Ostatak uključuje Google Fonts, Webflow 404 fontove, zastavu, YouTube thumbnaile i Maps. Broj mrežnih zahtjeva nije broj jedinstvenih source asseta i može varirati zbog lazy loada i vanjskih servisa; autoritativni popis za ovaj snapshot je `reference/webflow-audit.json`.

Ovaj inventar ne daje dopuštenje za hotlinkanje. Produkcijski asseti trebaju doći iz odobrenog Webflow exporta/source paketa, dobiti stabilna semantička imena i biti smješteni prema `source-assets/README.md` i `public/assets/README.md`. Ne preuzimati ili preimenovati prije nego što se mogu očuvati original, crop i licenca.

## Primarni brand i UI asseti

| Zatečeno ime                         | Tip            | Namjena             | Status                                                          |
| ------------------------------------ | -------------- | ------------------- | --------------------------------------------------------------- |
| `Dentvitalis logo color_21200px.svg` | SVG            | header/footer brand | preuzeti original iz exporta; provjeriti neobično ime/dimenzije |
| `arrow-right.svg`                    | SVG            | CTA/link ikona      | zadržati vektorski                                              |
| `whatsapp.svg`                       | SVG            | floating WhatsApp   | ikona je upotrebljiva tek uz potvrđen cilj                      |
| `facebook small.svg`                 | SVG            | društvena mreža     | potvrditi stvarni profil                                        |
| `linkedin small.svg`                 | SVG            | društvena mreža     | potvrditi stvarni profil                                        |
| `twitter small.svg`                  | SVG            | društvena mreža     | potvrditi treba li X/Twitter u novom footeru                    |
| flagcdn image                        | vanjski raster | language UI         | ne hotlinkati; provjeriti treba li zastava uopće ostati         |

## Hero video

| Zatečeno ime                                | Kontekst     | Renderirano ponašanje                                           |
| ------------------------------------------- | ------------ | --------------------------------------------------------------- |
| `Dentvitalis_video-left_mp4.mp4`            | home desktop | landscape, autoplay/muted/loop/playsinline, cover               |
| `Dentvitalis_video-left_poster.0000000.jpg` | home desktop | CSS background poster/fallback                                  |
| `DV MObile video01_3_mp4.mp4`               | home mobile  | portretni mobile art direction, autoplay/muted/loop/playsinline |

Za oba videa treba pribaviti originalnu rezoluciju, bitrate, trajanje, codec i eksplicitni poster. Produkcija treba imati reduced-motion/static fallback; ne koristiti desktop video kao improvizirani mobile crop.

## Fotografije po obitelji

### Prije/poslije galerija

Zabilježeni su parovi `DV-1-prije`/`DV-1-poslije`, `DV-2-prije`/`DV-2-poslije`, `DV-prije-3`/`DV-poslije-3`, `DV-prije-4`/`DV-poslije-4-2`, `DV-prije-5`/`DV-poslije-5`, `DV-prije-7`/`DV-poslije-7`, `DV-prije-13`/`DV-poslije-13`, `DV-prije-14`/`DV-poslije-14` i `DV-prije-15`/`DV-poslije-15`. Audit je zabilježio dio parova kroz DOM i responsive fetch; export mora potvrditi kompletan par, redoslijed, crop i privolu za objavu.

### Usluge

- `ponte-fisso-su-impianti (2)` — 1600/2000 responsive varijante;
- `Sbiancamento-dei-denti (3)` — 1600 varijanta;
- `Sedazione-cosciente (1)` — 1600/2000 varijante;
- `DV-cjenik` — 1600/2000 varijante;
- treatment/detail asseti za ostale rute moraju se mapirati iz exporta, ne iz samog imena datoteke.

### Klinika i tim

- `DV-specialisti (1)` — 1600/2000;
- `Zvonimir Zivkovic.webp`;
- `Zoran-Jurković,-dr.med.dent..jpg`;
- `DV-Dr-Sime-Zivkocic (4).webp`;
- `Tutto-in-un-unico-luogo (1)` — 1600/2000;
- `Laboratorio-odontotecnico` — 1600/2000;
- `Materiali-e-apparecchiature` i `Materiali-e-apparecchiature (1)` — 1600/2000;
- `DV-Zvone (2)` i `Dentvitalis-Dedo (1)` — velike portrait/detail fotografije;
- `GR-DV.webp`, `Dedo-p-1600.webp`, `Dv-4 (1)/(2)` — kontekst i konačni mapping treba potvrditi vizualno/exportom.

### Informacije i kontakt

- `Prima-visita-gratuita` — 1600/2000;
- `Tempi-del-trattamento` — 1080/2000 i dodatna `(3)` 1600 fotografija;
- `Pagamento-flessibile` — 1080/2000 i dodatna `(4)` 1600 fotografija;
- `Garanzie` — 1600/2000;
- `Alloggio hero 2600` — 1600/2000;
- `Galleria-header-2600` — 1600;
- `Contatti` — 1600;
- `Recenzija-detail (1)` — 1600/2000.

## Font asseti

Site fontovi su Montserrat i učitani, ali zasad neidentificirani Inter Tight. Točne WOFF2 nazive zabilježio je `reference/webflow-audit.json`; koristiti exportirani `@font-face` ili službeno odobren self-hosted paket. Graphik/Roboto/Google Sans nisu site asseti.

## Vanjski embedovi i izvedeni asseti

- `/testimonianze`: 13 YouTube embedova; thumbnailovi/iframe asseti nisu naši produkcijski source asseti;
- `/contatti`: Google Maps embed i tileovi; API/query vrijednosti u audit JSON-u moraju biti redaktirane;
- Google review badge: potvrditi izvor, aktualnost, logotip i smije li se vrijednost prikazivati statički;
- screenshotovi u `reference/screenshots/` služe samo kao razvojna referenca i ostaju izvan Astro produkcijskog builda.

## Obvezni metadata zapis pri importu

Za svaki produkcijski asset evidentirati: stabilni ID, originalno ime, izvor, vlasništvo/licencu, povezanu stranicu/komponentu, intrinsic dimenzije, aspect ratio, fokus/crop, alt po jeziku, je li dekorativan, datum odobrenja i izvedene formate. Ne generirati alt iz naziva datoteke.

## Nepotvrđeno

- kompletan export i originali pune rezolucije;
- prava i privole za fotografije pacijenata/prije-poslije;
- lokalizirani alt tekstovi;
- mobile poster;
- konačni social sharing asseti, favicon/app icons;
- stvarni social/profile URL-ovi;
- image compression/quality pragovi, koje treba postaviti tek nakon vizualne usporedbe.
