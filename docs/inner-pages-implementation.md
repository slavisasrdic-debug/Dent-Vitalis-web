# Talijanske unutarnje stranice — 7. rujna 2026.

## Opseg i izvor

Korisnik je odobrio izradu preostalih 27 talijanskih stranica i zadržavanje Webflow URL-ova **za preview**, uključujući `/domande-e-risposte` za galeriju. To nije odobrenje konačnih produkcijskih slugova, SEO migracije, poslovnih podataka ili pravnog teksta. Bez commita/pusha i produkcijske objave.

Pregledani su `component-map.md`, svih 28 zapisa `components.json` i sastavi svih 28 stranica iz prihvaćenog handoffa. Zajednički layout, header, footer, obrazac i reveal ostaju višekratni. Directory, editorial/service detail i posebne sadržajne kompozicije imaju zasebne odgovornosti.

Sadržaj se transkribira iz prihvaćenog exporta u tipizirane podatke; Webflow markup, klase i runtime ne prenose se u produkciju. Ponovna provjera objavljenih izvora i desktop/mobile rendera: `scripts/audit-inner-pages.mjs`, dokazi u `reference/screenshots/2026-09-07-inner/`, izvan builda. Browser plugin not available; korišten je postojeći Playwright Chromium, uz mobilne i interakcijske provjere u WebKitu. Fizički iPhone/Android uređaji nisu dostupni u ovom okruženju.

## Uočene razlike koje se ne ispravljaju nagađanjem

- Tri directory stranice i dvije pravne stranice u prihvaćenom HTML-u nemaju Webflow `.body` klasu: stvarno se renderiraju u **Arial**, dok home i detalji koriste **Montserrat**. Nije neuspješno učitavanje fonta. Vjernost trenutačno znači zasebnu layout tipografsku varijantu; eventualno dizajnersko ujednačavanje traži odluku.
- Directory prve usluge koristi `Sedazione-cosciente-1.webp` na desktopu i `Sedazione-cosciente-mobile.webp` na mobitelu. To nije zamjena po medicinskoj procjeni; čuva se stvarni mapping reference.
- Mobilna fotografija, vidljivost, redoslijed i kompozicija provjeravaju se zasebno za svaku stranicu, ne izvode iz desktop screenshota.
- U biografijama izvora postoji izraz „Dr. XY”; skriven profil također postoji u exportu. Ne izmišljati identitet niti automatski otkrivati skriveni profil. Evidentirati stvarno prikazane podatke za sadržajnu provjeru.
- Pravni tekst sadrži kontaktne podatke koji se razlikuju od aktualnog footera. Čuvati njihove izvorne kontekste i status review, ne globalno zamjenjivati drugom adresom/brojem bez potvrde.

## Implementirano

- Svih 27 podstranica uz postojeću naslovnicu: tri directory liste, usluge/paketi, informacije, klinika/specijalisti, kontakti, FAQ, testimonijali, galerija i dvije pravne stranice. Točan inventar je u `page-inventory.md`.
- Zajednički layout/SEO, navigacija, breadcrumb, hero, sidebar, sadržajni blokovi, povezane kartice, kontakt i footer; propsi/varijante/potrošači u `astro-component-map.md`. Nema 27 kopija HTML predloška.
- Zasebne desktop/mobile fotografije i crop, source order sidebarova, skriveni izvorni profil, specifični grid spanovi, četiri related desktop stupca i izvorni završni razmaci.
- Svih 15 galerijskih parova sada ima odobrenu prije/poslije kontrolu: početnih 50/50, drag/klik native rangea, „Prima” → cijela prethodna slika, „Dopo” → cijela završna slika. Label prijelaz traje 300ms ease; dragging je neposredan. Instance su neovisne, tipkovnica/dodir rade, vertical scroll ostaje slobodan. Bez JS-a fotografije ostaju vidljive, bez aktivnih lažnih kontrola; reduced-motion uklanja prijelaz.
- 13 click-to-load YouTube komponenti s lokalnim posterima; iframe tek nakon aktivacije. FAQ koristi native details, karta lazy iframe i vidljivu link alternativu. Obrazac i nepotvrđeni WhatsApp ne šalju ništa.
- Svih 32 vanjska slikovna resursa je razriješeno; nedostajućih potrebnih slika/fontova/videa nema. Inner asset build dodaje 58 mastera, ponovno koristi 11 home mastera i ne povećava slike iznad izvornika; 13 YouTube postera je lokalno.

## Referenca i dokazi

Aktualni HTML svih 27 podstranica hash-identičan je prihvaćenom handoffu; `webflow/{slug}/{1440|390}.json` sadrži timestamp, HTTP status i oba SHA-256. Ponovni prihvat raspakiranih izvora potvrđuje svih 1538 handoff i 297 export datoteka bez izmjene bajtova.

Usporedbe koriste isti Chromium, 1440×900 i 390×900 viewport, učitane fontove/slike i jednak apsolutni scroll. Top/scroll-650 matrica obuhvaća svih 27 ruta; dodatne duboke snimke obuhvaćaju devet reprezentativnih sadržajnih obitelji, sredinu/kraj članka, povezane kartice i footer. Noviji deep/gallery capture smiruje ponavljajuće dekorativne CTA animacije i video na početni kadar; stariji top baseline može imati drugu fazu CTA ikone. To nije dokaz razlike tipografije niti certifikat pixel-identičnosti.

| Dokaz u `reference/screenshots/2026-09-07-inner/` | Sadržaj                                                                                                  |
| ------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| `comparison/{slug}/`                              | 108 desktop/mobile parova, overlayi, diffovi, agregatne metrike                                          |
| `body/{slug}/`                                    | article-start/middle/end, footer-start i related; zasebni Webflow/Astro, pair/overlay/diff               |
| `gallery-controls/`                               | početnih 50/50, drag, cijela Prima/Dopo i klik na fotografiju, 1440/390; jednaki scroll 1254/1519        |
| `breakpoint-report.json`                          | 675 mjerenja: 27 ruta × 25 širina, overflow i prijelaz navigacije                                        |
| `geometry-report.json`                            | hero, H1/description, članci i sidebarovi na 1440/390                                                    |
| `directory-geometry.json`                         | svih 18 kartica triju lista na 1440/991/480/479/390, visine, položaji, mobile crop i prisutnost strelica |

Matrica rubova: 390; 478/479/480/481; 766/767/768/769; 990/991/992/993; 1199/1200/1201; 1279/1280/1281; 1439/1440/1441; 1919/1920/1921. Navigacija prelazi na mobilnu do uključivo 991px.

## Funkcionalni QA i ponavljanje

`npm test -- --workers=2`: **136/136 prošlo** u završnom punom prolazu. Obuhvaća sve talijanske rute na desktopu i mobitelu, mobile WebKit, stvarne Latin/Latin Extended glifove, gallery drag/label/keyboard/touch, neovisnost instanci, no-JS/reduced-motion, nav hover/focus bez promjene geometrije, FAQ, modal bez slanja, click-to-load player, directory crop/arrow varijante te home video/reveal regresije. Otkriveni video race pri brzom scroll povratku i promjeni motion preference ispravljen je provjerom playback uvjeta i u zakašnjelom dekodiranom kadru; dodan je deterministički test redoslijeda callbackova.

675/675 breakpoint uzoraka bez overflowa ili pogrešnog nav prijelaza. Dodatnih 90 directory usporedbi potvrđuje jednake visine/širine svih 18 kartica i točne mobile crop/arrow varijante; najveća razlika koordinata je 0,078px. `static-runtime.json` potvrđuje stvarnu 1000ms reveal animaciju i 300ms galerijski prijelaz u minificiranom statičkom buildu, u Chromiumu i WebKitu, bez page errora. `astro check`: 92 datoteke, 0 grešaka/upozorenja; ESLint, Prettier i build 28 ruta prolaze.

Dodatna završna WebKit video matrica: **10/10 prošlo**. Test prisilnog frame-before-change redoslijeda izričito modelira novu vrijednost motion preference i zadržava event; ne ovisi o WebKitovu cacheu postojećeg MediaQueryLista tijekom browser emulacije. Dev port 4321 potvrđen public, vanjski HTTP 200 i stvarni title galerije provjereni pri predaji. Nema commita/pusha ni produkcijske objave.

Ne pokretati sadržajni generator/rebuild tijekom interakcijskih testova ili snimanja `dist/`. Prethodni takav preklop uzrokovao je HMR navigacije i prolazni 404 tijekom uklanjanja starog builda; ponovljeni stabilni run prolazi. Capture skripte sada odbijaju spremati ne-200 stranicu kao vizualni dokaz.

## Preostale razlike i granica ove faze

- Namjerne razlike: YouTube poster/privatnost UI, pristupačna link alternativa karte (oko +39px), onemogućene nepotvrđene integracije, sinkronizirana galerijska crta tijekom label animacije, neprepisane slučajne Typed.js tehničke upute na kraju izvornog bodyja.
- Optimizirane WebP izvedenice nisu byte-identični prikaz svake izvorne responsive kompresije; stvarne fotografije, art direction, omjeri i crop ostaju iz izvora. Metrike slika uključuju antialiasing i kompresiju; build i niski diff nisu sami po sebi potvrda vizualne jednakosti.
- U izmjerenoj geometriji hero/članaka/sidebarova ostaju subpixel razlike (uglavnom ispod 0,35px), oko 1px širine H1/uvoda na desktop cjeniku te namjernih +39px za map link. Sitne razlike crteža ručno izrađenih SVG kontrola nisu proglašene pixel-identičnima.
- Fizički uređaji, svi OS/browseri i sve moguće faze scrolla nisu certificirani. Uobičajene interakcije i rubovi su automatizirano provjereni; korisnički preview je sljedeća vizualna potvrda.
- Ekvivalentne unutarnje stranice drugih jezika nisu potvrđene: nema lažnih prijevoda/hreflang parova. Ostali jezici nisu izrađeni ovom fazom.
- Obrazac ostaje neslan; WhatsApp broj, cookie/consent pravila, medicinska/poslovna/pravna provjera (uključujući „Dr. XY”), konačni URL/SEO/redirect/schema/OG podaci i produkcijska 404 izvedba ostaju prije objave. Sve je `noindex` razvojni preview; izrada 28 ruta nije odobrenje produkcijske objave.
