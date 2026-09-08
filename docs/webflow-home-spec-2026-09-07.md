# Aktualna referenca naslovnice — 7. rujna 2026.

Ovaj dokument zamjenjuje **home** pretpostavke audita od 2. rujna. Povijesni audit nije izbrisan. Izvori su prihvaćeni export i handoff te ponovno renderirani objavljeni Webflow u istom Chromiumu kao Astro.

`reference/webflow-handoff/2026-09-07/home-reference-identity.json` bilježi da su objavljeni HTML i glavni CSS bajtno identični handoffu. `scripts/verify-home-reference.mjs` prekida provjeru ako se promijene. Razlike export/published relativnih asset putanja i inline loadera ostaju zabilježene u prihvatu; sadržaj i relevantna pravila nisu proizvoljno kombinirani.

## Fontovi i vrijednosti

Stack je **Montserrat, sans-serif**. Lokalno su stvarne handoff Google Fonts v31 TTF datoteke, ne zamjenski font: normal 300/400/500/600/700/800 te italic 400. Izvorna mapa je `raw/published/fonts/google-fonts.css`; identična imena su u `public/assets/fonts/` i skripti `prepare-home-assets.mjs`. Italic nije sintetiziran. Inter Tight i neupotrijebljeni Webflow custom fontovi nisu potrebni naslovnici.

Sačuvana je i **jedinica** line-height deklaracije: izvornih `120%`, `130%`, `140%` nije isto pretvarati u unitless vrijednosti pri pixel-QA. U testiranom Chromiumu `18px / 140%` daje line box 25.203125px, a `18px / 1.4` 25.1875px. To je uzrok kumulativnog pomaka od gotovo 2px u ranijoj mobilnoj iteraciji, a ne pogrešan font. Moderni inline form/contact stilovi zadržavaju izvorne unitless vrijednosti.

| Uloga               | Vrijednosti aktualne reference                                                                   |
| ------------------- | ------------------------------------------------------------------------------------------------ |
| Body                | 14px / 20px, 300, normal tracking, bez transformacije                                            |
| Hero eyebrow        | 18px / 140%; ≤479 16px, letter-spacing −.6px; accent strong 700                                  |
| H1                  | 3.6vw / 110%, 500; ≥1440 3.4vw; ≥1920 2.8vw; ≤991 5.4vw; ≤767 5.2vw; ≤479 9vw / 120%; strong 700 |
| Sekcijski H2        | 50px / 120%, 500; ≤767 42px; ≤479 9vw; margin 20px 0 10px, welcome donji margin 20px             |
| Kartični H3         | 28px / 120%; service/about 700, information 600; ≤479 24px                                       |
| Dokumentacija H3    | 26px / 120%, 600; ≤479 22px; ikona 16px prva / 12.8px ostale                                     |
| Veliki uvodni tekst | 22px / 140%, 400; ≤479 20px                                                                      |
| Tekst kartice       | 18px / 140%, 400; about 130%                                                                     |
| Izjava liječnika    | italic 20px / 30.8px; ≤479 em 18px / 28px u roditelju 20px (važan line box)                      |
| Desktop menu        | 12px / 100%, 500; ≥1280 16px; ≥1440 15px; link padding 3px → .8vw                                |
| Mobile menu         | 16px, 500, redovi 20px padding; ≤479 16px vertikalni padding                                     |
| Standard CTA        | 18px / 120%, 600; ≤479 16px; height/min-height 56px                                              |
| Header CTA          | 12px, 700; ≥1440 14px; mobile sticky label 17px / 120%, uppercase                                |
| Footer              | 14px; naslovi 600/16px, uppercase, letter-spacing 1px; linkovi 400/120%; kontakt 400/1.55        |

## Tokeni i geometrija

Doslovni mapping jedanaest Webflow varijabli nalazi se uz svaki token u `src/styles/tokens.css`: primary `#045a72`, hover `#057492`, accent `#afbc36`, crna/bijela, surface `#f7f7f7`, warm `#fff2d2`, border `#cdcfd0`, translucent border `#cdcfd080`, transparent i radius 8px. Kartice/gumbi stvarno imaju i 10px radius; video wrapper 14px, chat 20px/50%. Te razlike nisu ujednačene.

Container 1200px, ≥1440 1400px; teaser ≥1920 1600px. Header ima zasebnu širinu (1200 do 1279, 1400 od 1280) i gutter 20px do 1439, zatim 5%. Opći gutter 5%, mali mobilni sadržaj 7%. Tekstni maksimum: 900px section/FAQ/form, 600px welcome/slider scroll blok, hero 40% containera. Desktop sekcijski uvodi visoki su najmanje 80svh, pojedina kartica sekvence 100svh. Fotografija sekvence: sticky top 2svh, visina 98svh, širina 100vw. Welcome i testimonijali koriste sticky top 70px, fotografiju 100svh i tekstni padding 400px gore/dolje.

Spacing nije nova izmišljena ljestvica: ponavljaju se 10/20/40/60/100/160/400px, uz stvarne lokalne vrijednosti iz inline form/nav CSS-a. Section heading desktop padding 160px 40px 40px; mobile top 100px. Teaser kartica desktop padding 60px 40px i lijevi border 10px; mobile 40px 24px, border 6px, širina 90%, overlap −100px. Hero mobile benefit overlap −140px na ≤479, shadow `0 0 5px 6px #0003`.

Dropdown panel: 500px minimalno, ≥1280 600px, ≥1920 540px; do 991 fluidan. FAQ izvorni `inline-block` ostavlja 4px baseline razmaka iza svake stavke; native block komponente to eksplicitno čuvaju marginom. Otvoreni FAQ uklanja donji padding summaryja na >479, ali na ≤479 ostaje 20px. CTA je 40px ispod liste, sekcijski donji prostor 80px. Modal na mobitelu ima 24px donjeg prostora, ne desktop vrijednost.

Overlay hero desktop: 270° gradijent `#19242e8c`, transparent 10%/38%, primary. Mobile ≤479 tekstni gradijent primary → `#22738e` na 62%, video gradijent proziran 84% → `#22738e`. Kontakt: 135° `#055268` → `#0c7a99`. Teaser ploha `#ffffffe6` i blur 5px; slider `#ffffff80` i blur 7px. Z-index header 999, sticky CTA 998, kartice 10, chat 30; native dialog koristi top layer.

## Media uvjeti i obvezna mjerenja

Sačuvani uvjeti: `screen and (min-width:1280px)`, 1440, 1920; `screen and (max-width:991px)`, 767, 479; dodatni inline uvjeti 768/992 i narrow form 359. Nisu zaokruženi na izmišljene 1024/640 breakpointe.

Skripta `check-home-breakpoints.mjs` provjerava 358/359/360, 390, 478/479/480, 766/767/768/769, 990/991/992/993, 1200, 1279/1280/1281, 1439/1440/1441, 1919/1920/1921. Na 992 je puna desktop navigacija, na 991 hamburger. Font menuja prelazi 12→16 na 1280, zatim 16→15 na 1440. Veliki desktop breakpoint mijenja H1 i širinu teaser containera.

Do 991 sekvence prelaze na fotografiju uz svaku karticu; omjer 3:2, do 479 kvadrat. Crop se čuva po zapisu kartice (50%, 80% ili 90% horizontalno). Hero na ≤479 koristi drugi izvorni video, 2:3; šire mobile/tablet područje koristi desktop video 3:2. Testimonial mobile fotografija postaje kvadrat na ≤479. Footer prelazi u jedan stupac na 991, a na 767 dobiva 160px donjeg prostora. Form grid prelazi u jedan stupac na 767.

## Animacije

- Preseti `slideInBottom`, `growIn`, `fadeIn`: 1000ms `outQuart`, 100px translate / .75→1 scale / opacity. Easing se izvodi iz funkcije `1 − (1 − t)^4`, a ne pretpostavljenog CSS Béziera. Opažanje jednom; offseti 0 ili 10% **visine** viewporta, delay 200/400/600/800/1000/1200ms prema elementu.
- Dvije scroll sekvence `a-16`/`a-17`: smoothing 80; opacity 1→0 i scale 1→1.2 u rasponima 33–38, 53–58, 73–78%; treća skrivena slika vraća scale na 1 do 89%. Svaka Astro instanca izolirana je od druge.
- Slider 500ms ease, bez autoplay; mobilni menu ulaz 400ms ease; dropdown height 300ms, strelica 200ms; FAQ height 400ms ease, text opacity 700ms, indikator 300ms.
- Prvi i drugi service copy wrapper imaju flex column, treći i četvrti normalni tok s collapseom margina; sačuvano kao `copyLayout` varijanta. Footer logo je inline-block / vertical-align middle, što čuva izvorni line box bez izmišljenog pixel offseta. Kraći slider slajdovi poravnati su na vrh zajedničke maske.
- `prefers-reduced-motion` ne skriva sadržaj, isključuje nepotrebno pomicanje i pauzira video. Bez JS tekst, FAQ i sve tri recenzije ostaju dostupni.

## Dokazi i granice tvrdnje

### Naknadno odobrena razlika: mobilni ulaz kartice

Korisnički dodatak nakon prihvata naslovnice traži pojedinačni slide-from-bottom/fade, kraći i bez čekanja na mobitelu, dijeljen s budućim directory listama. To je **namjerna nadogradnja**, ne nova tvrdnja o izmjerenim Webflow vrijednostima: nakon početne probe 24px/450ms korisnik traži izraženiji ulaz pa `card` profil sada koristi 48px / 600ms / delay 0 / `cubic-bezier(.22,.61,.36,1)`. Prag je sam ulazak u viewport (offset 0), bez staggera. Do 991px animira se pojedinačna kartica, ne i cijela teaser sekcija; desktop preseti i sticky/fade sekvence ostaju izvorni. Konačna geometrija kartica nije promijenjena.

Vrijednosti su centralizirane u `--reveal-card-*` CSS tokenima. Zajednički initializer koristi [Intersection Observer](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API) i [native Web Animations](https://developer.mozilla.org/en-US/docs/Web/API/Element/animate), uz vidljivi fallback. Kartični easing ne ovisi o CSS `linear()` podršci; stariji Safari za ostale izvorne reveal presete dobiva Bézier fallback kada `linear()` nije podržan. Browser plugin nije dostupan (`Browser plugin not available`); provjera koristi postojeći Playwright te dodani WebKit browser binary. Emulacija nije fizički iOS/Android test.

### Izvorna provjera dovršene naslovnice

Naknadno ispravljen startup bljesak: prethodno je odgođeni reveal modul prvo ostavljao tekst vidljivim pa ga skrivao za animaciju. Na ponovljenom mobilnom cold-loadu zabilježeno je opacity 1 prije inicijalizacije, zatim 0. Zajednički `RevealSetup` sada priprema stanje u headu prije prvog painta; normalan slijed je 0→1, bez povratnog skrivanja. Ovo je ispravak Astro inicijalizacije, ne promjena izvornih tekstova, prijeloma ili vremenskih parametara animacija. Vidljivi fallback pri blokiranom/prekasnom JS-u ima prednost pred animacijom.

`reference/screenshots/2026-09-07-home/comparisons/` sadrži Webflow/Astro viewport parove, 50% overlay i pojačani RGB diff. Visina 900px, DPR 1, isti browser, učitani fontovi/slike, oba videa kontrolirana izvornim posterima. `report.json` sadrži stvarni scrollY i geometriju. Full-page snimke služe samo inventaru; ne dokazuju sticky/fade stanje.

Izvorni globalni selektori `.teaser-img._1/_2/_3` mogu prepisivati stanje druge sekvence; to nije preneseno u Astro zbog izričitog zahtjeva za izolacijom instanci. Izvorna 600ms directory animacija ograničena je na tri druge page-ID vrijednosti i ne vrijedi za home. Pregled svih fotografija mora se raditi u kretanju i kroz pojedinačne viewporte.
