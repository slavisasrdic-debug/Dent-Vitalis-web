# Inventar asseta

## Aktualni home asseti — 7. rujna 2026.

### Proširenje za svih 27 podstranica

- `src/content/inner-assets.json`: **58** dodatnih izvornih naziva s SHA-256, izvornom putanjom i lokalnim izvedenicama; **11** potrebnih izvora ponovno koristi home manifest. Među njima su 15 galerijskih parova, portreti, posebne mobilne fotografije, Google oznake uz stvarne prepisane recenzije. Hash-identični aliasi dijele izvedenice.
- `scripts/prepare-inner-assets.mjs`: izvorni SVG ili WebP master; manje WebP izvedenice 320/500/800/1080/1400/2000 px samo do stvarne rezolucije. Nema zamjenskih fotografija, povećavanja ni Webflow hotlinkova.
- `source-assets/external-images/2026-09-07/youtube/manifest.json`: 13 originalnih YouTube `hqdefault.jpg` posterâ, točan video ID, naslov, izvorni URL i SHA-256. Produkcijske WebP izvedenice lokalne; nema početnog preuzimanja playera.
- Latin Extended Montserrat **v31** normal/italic WOFF2 u `source-assets/fonts/montserrat-v31/manifest.json`; originalni nazivi i SHA-256 sačuvani. Postojeći Latin TTF bajtovi ostali su nepromijenjeni. CSS deklarira svaku Extended težinu zasebno, kako varijabilni raspon ne bi potisnuo statične Latin faceove. `tests/fonts.spec.ts` provjerava stvarni custom font za Latin i ČĆŽŠĐ/čćžšđ u svih sedam korištenih težina/stilova.
- Ukupni trenutačni produkcijski direktoriji: slike približno **41 MiB**, fontovi **488 KiB**, videi **12 MiB**. Izvorni ZIP-ovi i screenshotovi ne ulaze u `dist`.

Za svih 28 talijanskih stranica nema nerazriješenog potrebnog slikovnog/font/video resursa. Izvorna **32/32** vanjska resursa ostaju razriješena; 29 galerijskih aliasa sada je i povezano s produkcijskim manifestom. Prava objave i privole nisu time automatski odobreni.

Prihvaćeni export i handoff imaju prednost nad starijim mrežnim auditom u nastavku. Izvori su očuvani bez preimenovanja i promjene bajtova.

- `reference/webflow-handoff/2026-09-07/external-assets-resolution.json`: svih **32/32** vanjskih slika razriješeno. **29** prije/poslije galerijskih URL-ova ima byte-identičan ekvivalent pod drugim nazivom u prihvaćenom paketu; nisu potrebni naslovnici i nisu dodatno kopirani u produkciju. **3** izvorna social SVG-a pribavljena su u `source-assets/external-images/2026-09-07/` s izvornim nazivima i hash mappingom.
- `src/content/home-assets.json`: izvorni naziv → putanja mastera, dimenzije i lokalni responsive `srcset` za **27** home/UI mastera. `scripts/prepare-home-assets.mjs` reproducira izvedenice; SVG ostaje izvorni, postojeći WebP master ostaje byte-identičan, manje izvedenice su WebP quality 95, bez povećavanja rezolucije. JPEG/PNG fotografije dobivaju WebP izvedenice. AVIF nije dodatno generiran u ovoj fazi.
- Točni Montserrat normal 300/400/500/600/700/800 i italic 400 preneseni su iz handoffovih Google Fonts datoteka, s izvornim imenima. Izvor, mapping i `@font-face` su u skripti, `src/styles/global.css` i aktualnoj vizualnoj specifikaciji. Nema zamjenskog niti sintetiziranog italic fonta.
- Oba videa imaju izvorni MP4, WebM i JPEG poster: `Dentvitalis_video-left_*` i `DV-MObile-video01_3_*`, lokalno u `public/assets/video/`. Prvotne Webflow/Astro usporedne snimke koriste izvorne JPEG postere. Naknadni korisnički zahtjev uvodi točan prvi kadar MP4-a i tamnoplavu podlogu; to je namjerna promjena učitavanja, ne druga verzija Webflow sadržaja.
- `scripts/prepare-video-posters.mjs` (`ffmpeg` CLI + postojeći Sharp) iz prihvaćenih originalnih MP4-a izvlači prvi dekodirani prezentacijski kadar, bez seeka/cropa, pa izrađuje WebP quality 78 / effort 6, bez povećavanja. Desktop 1280×720: širine 320/640/960/1280, 5.532/18.336/35.986/54.340 bajtova; mobile 406×720: širine 320/406, 26.060/38.166 bajtova. Najveći posteri su oko 34% / 18% manji od prethodnih JPEG-ova. Vizualno provjereno prema stvarnim prvim kadrovima. `src/content/video-posters.json` čuva izvorne nazive/putanje, dimenzije, SHA-256 izvora, dekodiranog kadra i svake izvedenice. PNG međukadar nije dodatno pohranjen u repozitorij.
- `src/content/background-videos.ts` dijeli isti izbor za `<picture>`, head preload i video: mobile do 479px, desktop od 480px (nije breakpoint kartica 991px). `transparent.svg` je samo prazan dekorativni fallback neaktivnog picture elementa, ne zamjenska fotografija. Bez JS/reduced-motion prikazuje se stvarni responsive poster bez preuzimanja videa.
- Pet originalnih zastava pohranjeno je u `source-assets/external-images/2026-09-07/flagcdn/`. `flags.json` čuva URL i SHA-256; ponovni asset build koristi te lokalne kopije, ne zahtijeva ponovni download.
- Produkcijski podskup približno: slike 8,6 MiB, fontovi 340 KiB, video 12 MiB. Reference/screenshotovi nisu u `public/` niti ulaze u `dist/`.

Za ovu fazu nema preostalog nedostajućeg slikovnog/font/video resursa. Nepotvrđeni su prava/privole za produkciju, aktualnost statičnog review badgea, social odredišta i konačna OG slika — to nisu zamijenjeni izmišljeni asseti. Prijedlog Git/LFS pohrane je u `source-versioning-proposal.md`.

## Povijesni inventar — 2. rujna 2026.

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
