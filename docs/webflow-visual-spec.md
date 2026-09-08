# Webflow vizualna specifikacija

Aktualna naslovnica implementira se prema [izmjerenoj specifikaciji od 7. rujna](./webflow-home-spec-2026-09-07.md) i pripadajućim viewport usporedbama. Ona ima prednost pred povijesnim home mjerenjima ispod, posebno za mobile benefit karticu, nove kontakt/pravne elemente i animacije.

Napomena 2026-09-07: ova mjerenja i screenshotovi opisuju snapshot od 2. rujna. Novi handoff/export donose promjene; prije implementacije ažurirati vizualni baseline prema [prihvatu novih izvora](./source-intake-2026-09-07.md). Izvorna mjerenja ispod ostaju sačuvana kao povijesni dokaz.

## Status i metodologija

Ovo je izmjerena referentna specifikacija, a ne nova interpretacija dizajna. Izvor je renderirani [Webflow preview](https://dentvitalis33.webflow.io/) snimljen 2. rujna 2026. Playwright Chromium korišten je zato što Browser plugin nije bio dostupan u ovom okruženju. Fontovi su učitani prije mjerenja; za pune snimke stranica sadržaj je proscrollan radi aktiviranja lazy/reveal elemenata, a video i CSS animacije zatim su pauzirani.

Strojno čitljiv snapshot nalazi se u `reference/webflow-audit.json`, a vizualni dokazi u `reference/screenshots/`. Audit obuhvaća 26 valjanih povezanih Webflow ruta i eksplicitnu probu poznate 404 rute, devet traženih širina početne stranice te reprezentativne desktop/mobilne snimke sedam tipova stranica.

Webflow preview se može promijeniti. Prije implementacije treba usporediti datum audita s datumom odobrenog Webflow exporta. Export je konačan izvor za originalne datoteke fontova, slika i videa.

## Fontovi i tipografija

Webflow loader traži dvije Google obitelji:

- `Montserrat`: 100–900, normal i italic; stvarni font učitan za sav provjereni DentVitalis tekst;
- `Inter Tight`: 300, 400, 500, 600 i 700; datoteka je učitana, ali u provjerenim vidljivim elementima nije pronađena kao computed `font-family`.

Primarni stack je točno `Montserrat, sans-serif`. Izvor je Google Fonts CSS u HTML-u Webflowa. Chromium je povukao Montserrat WOFF2 datoteke `JTUQjIg1_i6t8kCHKm459WxRxy7mw9c.woff2`, `JTUQjIg1_i6t8kCHKm459WxRyS7m.woff2`, `JTUSjIg1_i6t8kCHKm459Wdhyzbi.woff2` i `JTUSjIg1_i6t8kCHKm459Wlhyw.woff2`, te Inter Tight `NGSwv5HMAFg6IuGlBNMjxLsH8ag.woff2`. Točan mapping tih subset/variable datoteka na lokalne `@font-face` deklaracije mora se preuzeti iz odobrenog exporta; ne smije se nagađati niti zamijeniti drugim fontom.

Graphik, Roboto i Google Sans datoteke zabilježene u mrežnom auditu pripadaju Webflow 404 stranici, YouTubeu ili Google Mapsu i nisu DentVitalis tipografija.

| Uloga                               | Desktop                                  | Mobilno                                     | Težina                         | Tracking / transform   |
| ----------------------------------- | ---------------------------------------- | ------------------------------------------- | ------------------------------ | ---------------------- |
| Body default                        | 14/20 px                                 | 14/20 px                                    | 300                            | normal / none          |
| Home hero H1                        | fluidno; 48.96/53.856 px na 1440         | `9vw/120%`; 35.1/42.12 px na 390            | 500                            | normal / none          |
| Detail-page H1 (`.naslov-detaljna`) | 46/55.2 px                               | 32/38.4 px na 390                           | 600                            | normal / none          |
| Section H2 (`.medjunaslov-h2`)      | 50/60 px                                 | 42/50.4 px na 767–480; `9vw/120%` ispod 480 | 500                            | normal / none          |
| Card H3 (`.medjunaslov-h3`)         | 28/33.6 px                               | 24/28.8 px ispod 480                        | 700                            | normal / none          |
| `.large-paragraph`                  | 18/25.2 px                               | 18/25.2 px                                  | 400                            | normal / none          |
| `.large-paragraph-2`                | 18/23.4 px                               | 18/23.4 px                                  | 400                            | normal / none          |
| `.huge-paragraph`                   | 22/30.8 px                               | 20/28 px ispod 480                          | nije potvrđeno za sve instance | normal / none          |
| `.banner-paragraph`                 | 18/25.2 px                               | 16/22.4 px ispod 480                        | 300                            | mobilno -0.6 px / none |
| Desktop nav                         | 15/15 px na 1440; 12/12 px na 1200 i 992 | skriveno                                    | 500                            | normal / none          |
| Primarni gumb                       | 14/20 px na 1440; 12/20 px na 1200/992   | 16/20 px                                    | 700                            | normal / none          |
| Input / textarea                    | 18/25.2 px                               | 16/22.4 px na 767 i niže                    | 400                            | -0.2 px / none         |
| Tekstualni/footer link              | tipično 14/20 px                         | 14/20 px                                    | 300–400 prema komponenti       | normal / none          |

Home H1 je posebno osjetljiv na breakpoint: 43.2/47.52 px na 1200, 35.712/39.2832 px na 992, 53.514/58.8654 px na 991, 41.472/45.6192 px na 768, 39.884/43.8724 px na 767, 24.96/27.456 px na 480, 43.11/51.732 px na 479 i 35.1/42.12 px na 390. Diskontinuiteti nisu tipografska preporuka nego zatečeno stanje koje traži potvrdu dizajnera.

## Dizajnerski tokeni

Webflow root varijable:

| Token u referenci         | Vrijednost  | Namjena opažena u renderu    |
| ------------------------- | ----------- | ---------------------------- |
| `--tamana-call`           | `#05617a`   | tamni teal, hero/CTA/tekst   |
| `--svijetla-call`         | `#afbc36`   | lime CTA i hover naglasak    |
| `--pozadina`              | `#f7f7f7`   | glavna svijetlosiva pozadina |
| `--svijtal-boja-podloga`  | `#fff2d2`   | topla svijetla podloga       |
| `--siva-crta`             | `#cdcfd0`   | razdjelnici i obrubi         |
| `--siva-crta-transparent` | `#cdcfd080` | prozirni razdjelnik          |
| `--crna`                  | `#000000`   | primarni tekst               |
| `--bijela`                | `#ffffff`   | plohe i tekst na tamnom      |
| `--transparent`           | `#00000000` | transparentno                |
| `--zakrivljenost`         | `8px`       | zadani radius gumba/kartica  |

Dodatno izmjereno:

- input obrub `#c8d9de`, radius 6 px, visina 60 px, padding 14 × 16 px;
- primarni gumb radius 8 px, bez sjene, s razmakom ikona/teksta 10 px; u mobilnom sticky CTA-u visina je 48 px ispod 480, odnosno 56 px na 480–991;
- provjereni glavni elementi nemaju box-shadow; eventualne sjene specifičnih kartica treba potvrditi po komponenti/exportu;
- uobičajeni container je `max-width: 1200px`; na 1440+ koristi se do 1400 px; tablet content container je do 728 px; na malom mobitelu sadržaj ide preko pune širine uz približno 7% bočnog odmaka (27.3 px na 390);
- tekst u hero sadržaju je na desktopu približno 36% širine viewporta (518.39 px na 1440); maksimalne širine drugih tekstualnih blokova ovise o komponenti i ne treba ih objediniti u jedan proizvoljni token;
- česti vertikalni ritam u computed pravilima je 10, 20, 30, 40, 60, 80 i 160 px; nije potvrđena jedinstvena matematička spacing skala.

Točni hero overlayi:

```css
/* desktop */
linear-gradient(270deg, rgba(25, 36, 46, 0.55), rgba(72, 123, 164, 0) 10%, rgba(227, 227, 227, 0) 38%, rgb(5, 97, 122))

/* mobile text area */
linear-gradient(rgb(5, 97, 122), rgb(34, 115, 142) 62%)

/* mobile media edge */
linear-gradient(0deg, rgba(85, 130, 163, 0) 84%, rgb(34, 115, 142))
```

Navigacija je sticky, bijela, `z-index: 999`, s prozirnim sivim donjim obrubom i `backdrop-filter: blur(10px)`. Visoka je 80 px na 1440+, inače 70 px. Na 1440 ima 5% bočni padding (72 px), a na 1200/992 20 px. Opaženi hover desktop nav linka mijenja crnu u `#afbc36`; label transition je 0.2 s. Opaženi CTA transition na jednoj varijanti je 0.35 s, a focus boja u CSS-u `#97a42d`. Potpuni hover/focus/active matrix svih varijanti još mora biti potvrđen iz exporta i keyboard snimke.

## Breakpointi i ponašanje

Webflow CSS sadrži stvarne granice `max-width: 991px`, `767px`, `479px` te `min-width: 768px`, `1280px`, `1440px`, `1920px`. Snimke postoje za svaku traženu širinu.

| Širina | Zatečeno ponašanje                                                                                                                                  |
| ------ | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1440   | desktop nav, 80 px; container do 1400; dvostupanjski hero s tekstom lijevo i videom preko cijele pozadine/desne strane; 1440 × 900 hero media       |
| 1200   | desktop nav, 70 px; max container 1200; smanjeni nav tekst i fluidni hero naslov                                                                    |
| 992    | zadnji desktop nav; desktop hero; H1 35.712 px                                                                                                      |
| 991    | prvi tablet/mobile nav s hamburgerom; sticky CTA pri dnu; hero tekst iznad velike slike/videa; H1 skače na 53.514 px                                |
| 768    | mobile nav i stacked hero, ali pravila `min-width: 768px` još vrijede za dio layouta; H2 50 px                                                      |
| 767    | pravila `max-width: 767px`; forme i tipografija se smanjuju, gridovi/kartice prelaze u jedan stupac, footer dobiva veći donji prostor za sticky CTA |
| 480    | još ne vrijedi `max-width: 479px`; H1 24.96 px, dio benefit kartice preklapa hero media, sticky CTA 56 px                                           |
| 479    | aktivira se najuži mobile set; H1 i H2 postaju `9vw`, H1 skače na 43.11 px, benefit blok u hero području nestaje, sticky CTA pada na 48 px          |
| 390    | ciljana mobilna kompozicija: 70 px header, 7% gutters, stacked text/video, 35.1 px H1, 48 px bottom CTA                                             |

Desktop navigacija postoji zaključno s 992 px. Na 991 px puna navigacija nestaje, a header zadržava logo, jezični odabir i hamburger. Otvoreni mobilni meni ispunjava viewport svijetlosivom plohom, linkovi su u redovima s razdjelnicima, a CTA je plav/teal. Desktop dropdown je široka bijela ploha neposredno ispod headera. Referentne snimke su `webflow-home-1440-nav-dropdown.png` i `webflow-home-390-mobile-menu.png`.

Desktop gridovi i content/media kartice uglavnom su višestupčani ili horizontalni; na 767 i niže slažu se vertikalno. Footer je na desktopu šestostupčani/flex raspored s 80 px gornjeg paddinga. Na 991 i niže prelazi u stupce, a na 767 i niže u jednokolonski grid s 60 px gornjeg i 160 px donjeg paddinga. Forme postaju pune širine sadržajnog containera.

## Slike, video i crop

- Home hero ima zaseban desktop i mobile MP4, oba `autoplay muted loop playsinline`.
- Desktop izvor je `Dentvitalis_video-left_mp4.mp4`; mobile izvor `DV MObile video01_3_mp4.mp4`.
- Desktop poster `Dentvitalis_video-left_poster.0000000.jpg` dolazi kao CSS background; DOM `poster` atribut nije postavljen. Mobile poster treba potvrditi iz exporta jer nije nedvosmisleno mapiran u mrežnom snapshotu.
- Video i hero fotografije koriste cover crop. Desktop fokus ostavlja lice desno, a tekst na teal overlayu lijevo. Mobilni kadar je portretni i nalazi se ispod tekstualnog bloka.
- Kartice s fotografijama koriste vlastite responsive varijante (`-p-1080`, `-p-1600`, `-p-2000`) i ne smiju se zamijeniti generičkim cropom.
- Galerija koristi prije/poslije parove. Parovi i redoslijed moraju se zadržati kao povezani podaci, ne kao neovisna lista slika.

## Interakcije

- desktop dropdown otvara se hoverom; treba osigurati i fokus/keyboard ekvivalent;
- mobilni hamburger otvara i zatvara full-width/full-height menu panel;
- FAQ koristi accordion: naslovni red, indikator i jedan proširivi odgovor; semantiku i početno otvoreno stanje potvrditi po stranici;
- kartice i navigacijski linkovi koriste promjenu boje/opacityja; točne transition/easing vrijednosti koje nisu izravno izmjerene ne treba izmišljati;
- sticky CTA je fiksiran uz donji rub na 991 i niže, s 6 px bočnog odmaka;
- WhatsApp kontrola pluta pri donjem desnom rubu, ali ciljni broj u previewu je neispravan placeholder;
- reveal-on-scroll animacije postoje. Audit ih je zaustavio radi stabilnih snimki; prije reprodukcije treba iz exporta izvući trajanje, easing, delay/stagger i reduced-motion ponašanje;
- YouTube testimoniali su iframeovi, a kontakt karta Google Maps iframe. Njihove loading i accessibility probleme bilježi `known-content-issues.md`.

## Što još nije pouzdano utvrđeno

Bez odobrenog Webflow exporta ne treba zaključiti:

- lokalni `@font-face` mapping i licencu/hosting fontova;
- puni popis Webflow IX2 animacija, točne easing krivulje i stagger;
- sve hover, focus-visible, active, error i success stateove;
- je li lom 480/479 namjeran ili greška;
- namjerni art-direction/crop za svaku sliku i sve jezike;
- konačnu veličinu i server-side pravila file uploada;
- konačne poslovne podatke, CTA ciljeve, tracking i map konfiguraciju.

To su blokatori za odgovarajući dio vizualne implementacije, ne poziv na improvizaciju.
