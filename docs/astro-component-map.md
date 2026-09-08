# Astro komponente — 28 talijanskih stranica

Izvor granica: prihvaćeni `component-map.md`, svih 28 zapisa u `components.json` te sastav svih 28 stranica u `page-composition.md` i `pages.json`. Nazivi koje je handoff označio kao **proposed** nisu obvezni Astro nazivi. Jedan Webflow wrapper nije automatski komponenta.

## Tri razine

### Proširenje za unutarnje stranice

Zajednički `SiteLayout`, header, footer, kontakt i reveal koriste **svih 28** ruta. Layout prihvaća `typography: brand | reference-default` i `pageLanguages`; druge jezične stranice nisu izmišljene. `ResponsiveImage` sada provjerava ime u spojenom home/inner manifestu i prekida build za nepoznati asset.

| Komponenta            | Odgovornost i props                                                       | Varijante / potrošači                                                                                                                               |
| --------------------- | ------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Breadcrumb`          | `items: {label, href}[]`, semantička putanja                              | 27 podstranica; zadnji član se lomi unutar istog flex retka                                                                                         |
| `DetailHero`          | tipizirani `InnerPage.hero`: title, description rich text, eyebrow, photo | directory / photo / plain / specialists; 27 ruta; na ≤991 tekst prije fotografije; crop zaseban za specijaliste                                     |
| `PhotoCardSequence`   | `cards`, `variant`, `label`, opcionalni `directory`                       | home service/about kompozicije te 3 directory stranice; directory services/about/information imaju zaseban scroll initializer; about 7000px desktop |
| `home/TeaserSequence` | kompatibilni tanki home wrapper                                           | bez dupliciranog markupa/interakcija; dvije home sekvence                                                                                           |
| `TeaserCard`          | sadržaj kartice, service/about, reveal, headingLevel, context             | home / directory / related; related bez strelice/bordera i bez negativnog mobilnog overlapa, kao izvor                                              |
| `EditorialPage`       | `page: InnerPage`, sastavlja editorial/sidebar/related                    | 24 podstranice; 60/40 desktop, stvarni mobilePlacement iz CSS ordera + DOM redoslijeda                                                              |
| `PageSidebar`         | obvezni `id`, `content: PageSidebar`, current, variant                    | standard / legal / testimonials; navigation / package; mobitel ne pretpostavlja isti redoslijed                                                     |
| `ContentBlocks`       | `blocks: ContentBlock[]`, semantički AST bez HTML stringova               | tekst, naslovi, liste, callout, cjenik, kontakt, profili i posebni blokovi; 24 rute                                                                 |
| `InlineContent`       | tipizirani tekst/break/strong/em/link/sup/sub/qualification               | underlined URL i hero-phone namjerne varijante; bez `set:html`                                                                                      |
| `ContactRow`          | `cells: InlineContent[][]`, border                                        | 2/4 stupca, mobile 2.4/4; jedan element proteže cijeli red; /contatti                                                                               |
| `ReviewSource`        | izvorni label, stars niz, logo                                            | stvarne prepisane Google recenzije; ništa se ne računa/izmišlja za AggregateRating                                                                  |
| `GalleryComparison`   | before/after ContentPhoto, beforeLabel/afterLabel                         | 15 neovisnih parova, 1.46 omjer, početnih 50/50; native range i Prima/Dopo, 300ms ease samo za klik na oznake; bez JS-a statično, bez lightboxa     |
| `YouTubeVideo`        | `videoId`, `title`                                                        | 13 instanci; lokalni poster, bez JS-a watch link, jedna iframe instanca tek klikom/Enterom                                                          |
| `MapPanel`            | točan embed `src`; centralna adresa/maps link                             | /contatti, lazy 450px iframe + link alternativa                                                                                                     |
| `FAQ`                 | postojeći answer ili tipizirani richAnswer; variant                       | home / detail; native details i više root instanci na /faq                                                                                          |

`inner-pages-it.json` je generirana sadržajna transkripcija sa SHA-256 i `approval: review`. Prikaz dobiva podatke kroz `inner-pages.ts`. `reference-bindings.ts` veže izvorne poslovne literale na `data/site.ts`, čuva format razmaka/eura i ne dira medicinske brojeve bez valute, asset putanje ni dva povijesna pravna teksta. Sadržaj, imenovani linkovi i fotografije nisu ugrađeni u generički renderer.

Motion: `sidebar` profil prenosi desktop delay 1000ms/offset 0 iz IX2, na mobitelu koristi zajednički delay/offset. Navigation sidebar root animira samo desktop; package root oba prikaza, a stvarne `.prednost` stavke koriste standardni slide. `DetailHero` eyebrow koristi izvorni offset 0 (e-409), bez dodavanja nepostojeće animacije glavnom H1. Sve koristi isti initializer, pre-paint bootstrap, zajedničko trajanje i fail-open/reduced-motion pravila. Home nije potrošač sidebar profila.

Mobilni redoslijed: navigacijski sidebar iza članka na 17 standardnih informativnih/o-klinici i posebnih stranica; paketi, pravne stranice i testimonials prije članka. Točan per-route podatak je `sidebar.mobilePlacement`, provjeren prema renderiranoj referenci, ne samo redoslijedu HTML-a.

Dodatne potvrđene razlike varijanti:

- `DirectoryCard.mobilePosition` transkribira crop svakog mobilnog img-a; drugi i četvrti koriste 80% na ≤479px, a tablet 100%. `showArrow` čuva odsutnost vidljive strelice na kartici sedacije. `actionLayout: wide-arrow` (lista usluga) ima 44px strelicu i 14px odmak na ≤479px te bottom alignment; `standard` (Su di noi / Informazioni) i home čuvaju 40px varijantu. Directory price padding je 10px od 480px naviše; home breakpoint se time ne mijenja.
- `Breadcrumb` ima 14px vertikalni padding na desktopu, 10px do 991px i 8px do 479px. Ne spajati tablet i mali mobilni prikaz u jedan breakpoint.
- `EditorialPage.trailingSpace` čuva izvorni završni prostor 200px desktop / 140px do 991 / 120px do 767, uz redovni container padding. Podatak dolazi iz stvarnog sastava, ne dodaje se svim rutama.
- Related kartice su četiri jednaka stupca na ≥992px, jedan na ≤991px. `priceInset` ne prenosi dodatni unutarnji odmak u related kontekst.
- `PageSidebar.items.labelSpan/smallLabelSpan` i isti propsi bullet blokova čuvaju stvarno protezanje teksta preko stupaca. Prazna kolona u pravnim listama i razlike mobilnih stavki sedacije nisu automatski ujednačene.
- `ContentBlocks` varijanta `price-row-borderless` čuva četiri završna retka cjenika bez bordera. Postotni line-height ostaje postotan: zamjena s unitless vrijednošću mijenja naslijeđeni redak manjih liječničkih kvalifikacija.
- Galerija: `initializeComparisons()` registrira svaku root instancu samo jednom. Native range podržava drag, klik, Arrow/Home/End; label buttoni postavljaju 100/0 i imaju `aria-pressed`. `--comparison-duration: 300ms` i `--comparison-easing: ease` zasebni su od reveal ulaza. Crta i ručka ostaju sinkronizirane i tijekom prijelaza (u izvoru crta preskoči odmah). Bez JS-a kontrole su onemogućene uz vidljive fotografije; reduced-motion ukida prijelaz, `touch-action: pan-y` dopušta vertikalni scroll.

`RevealSetup` je zajednička head komponenta bez propsa, točno jednom u `SiteLayout`. Priprema reveal stanje prije prvog iscrtavanja; layout na kraju bodyja jednom pokreće odgođeni zajednički initializer. To nije sekcija niti drugi animacijski sustav. Svi postojeći i budući `Reveal` / `data-reveal` potrošači ovise o tom zajedničkom ugovoru, bez vlastitih startup skripti.

| Komponenta            | Namjena i props                                                                            | Varijante / uporaba                                                                                     |
| --------------------- | ------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------- |
| `layouts/SiteLayout`  | HTML, jezik, title, description, canonical, noindex preview, header/footer, glavni slot    | Svih 28 talijanskih ruta; ne koristiti za nepostojeći prijevod                                          |
| `Header`              | `groups`, `links`, `languages`, `lang`, `tagline`, `consultation`, `request`               | Desktop, mobile; promjene 992/1280/1440/1920; layout                                                    |
| `NavDropdown`         | Tipizirani `NavigationGroup`, parent link i children                                       | Desktop hover/keyboard, mobile disclosure; tri instance u headeru                                       |
| `LanguageSwitcher`    | `languages`, `current`, `variant`                                                          | Desktop/mobile; postojeći live home ekvivalenti, bez izmišljenih Astro prijevoda                        |
| `Button`              | `href`, `label`, `variant`, `inquiry`, opcionalni `reveal`                                 | more, hero, consultation, outline, menu; header, sekcije, sticky CTA                                    |
| `Footer`              | `business`, `groups`                                                                       | 4 stupca desktop; jedan stupac do 991; legal/contact imaju vlastite razmake                             |
| `ContactWidgets`      | `consultation`, nullable `whatsapp`, `content`                                             | Floating chat i mobile sticky CTA; ne šalje na nepotvrđeni broj                                         |
| `ContactSection`      | `content`, `lang`, opcionalni jedinstveni `id`                                             | Inline sekcija i native dialog; CTA `href` mora odgovarati ID-u sekcije                                 |
| `ContactForm`         | `content`, `lang`, `placement`                                                             | home_inline / home_popup; jedna premještana instanca čuva unesene vrijednosti                           |
| `ResponsiveImage`     | `image: string` (provjera manifesta pri buildu), obvezni `alt`, `sizes`, `eager`, `reveal` | Izvorni naziv → lokalne WebP izvedenice bez povećavanja; dekorativni `alt=""`                           |
| `BackgroundVideo`     | Tipizirani izvorni `name`, obvezni `media`, opcionalni `class`                             | Dvije home instance; plava podloga → prvi kadar → spreman muted/loop/playsinline video                  |
| `VideoPosterPreload`  | Isti `name`, `media` iz `BackgroundVideoSource`                                            | Head slot layouta, samo hero; isti srcset/sizes kao poster, bez dvostrukog desktop/mobile downloada     |
| `Reveal`              | `as` (uključujući `article`), `id`, `class`, `delay`, `offset`, `variant`, `media`, slot   | slide / fade / grow / card / sidebar; `media`: all / mobile / desktop; jedna zajednička inicijalizacija |
| `SectionHeading`      | `eyebrow`, `title`, `description`, `accent`, `variant`                                     | intro / spacious / compact; ne ujednačavati razmake varijanti                                           |
| `TeaserCard`          | `card: TeaserCardData`, `variant`, `reveal` (zadano `mobile`, ili all / desktop / false)   | service / about; zajednički card reveal; izvorni `priceInset` zadržava drukčiju geometriju cijene       |
| `FAQ`                 | Pitanja i niz tipiziranih tekstualnih dijelova odgovora                                    | Native details + 400ms proširenje / 700ms opacity, radi bez JS                                          |
| `TestimonialSlider`   | `slides`, `label`                                                                          | Tri slajda, strelice/točke/tipkovnica/swipe; bez autoplay; no-JS prikazuje sve                          |
| `Icon`                | `name`, `size`                                                                             | Native SVG simboli; bez icon font runtimea                                                              |
| `home/Hero`           | `content`, `price`, `benefits`, `maps`                                                     | Zaseban desktop/mobile video i mobilna benefit kartica                                                  |
| `home/TeaserSequence` | `cards`, `variant`, `label`                                                                | Dvije neovisne instance: usluge i o klinici; sticky fotografije desktop, fotografija po kartici mobile  |
| `home/Welcome`        | `content`                                                                                  | Izjava vlasnika, dokumentacija, desktop sticky/mobile fotografija                                       |
| `home/Testimonials`   | `heading`, `slides`, `actions`, `photo` (desktop/mobile/alt)                               | Sekcijska kompozicija oko zajedničkog slidera                                                           |
| `home/Information`    | `heading`, `cards`, `action`                                                               | Osam informativnih kartica i CTA                                                                        |
| `home/HomeFAQ`        | `heading`, `questions`, `action`                                                           | Šest izdvojenih FAQ pitanja i CTA                                                                       |

### Donji sticky CTA — korisnički dodatak 8. rujna 2026.

`ContactWidgets` zadržava postojeće propse `consultation`, `whatsapp`, `content`; njegov donji `Button` koristi postojeću varijantu `consultation`. Samo unutar `.mobile-contact` do **991px** tekst i SVG ikona zajedno mijenjaju opacity. Plava podloga, fokusni obrub, hitbox i geometrija ne animiraju se. `Header` i ostali CTA-i nisu potrošači ovog efekta. Primjena: svih 28 ruta kroz `SiteLayout`, potvrđeno prema handoff `components.json` i svih 28 sastava stranica.

Aktualni renderirani Webflow na 390/1440px i prihvaćeni export imaju isti blok `dv-mobile-sticky-cta-2026-09-03`: dva početna blinka u 1.8s, zatim petosekundni **cijeli ciklus**, a ne 5s mirovanja; početak je fade-out. To nije nova verzija izvora. Korisnikov novi zahtjev namjerno ima prednost: **dva blinka od po 1s + 5s mirovanja**, prvi prikaz počinje fade-inom. Preuzeti su opseg efekta (samo tekst/ikona), minimum opacity `.12` i `ease-in-out`, ali ne izvorni runtime ili CSS blok.

Jedna izvorno napisana CSS animacija, bez dodatnog JS-a/timera: `--sticky-cta-cycle-duration: 7000ms`, `--sticky-cta-min-opacity: .12`, `--sticky-cta-easing: ease-in-out` nalaze se u motion bloku `tokens.css`. Trajanje ciklusa proporcionalno mijenja ritam **2:5**; nije povezano s trajanjem scroll reveal ulaza. Faza je pomaknuta tako da je početni frame prigušen: maksimumi na 0.5s i 1.5s, konstantni opacity 1 od 1.5s do 6.5s, pa pola sekunde fade-outa spaja sljedeći ciklus bez skoka. Početno stanje dolazi iz CSS-a prije painta, ne od kasno učitanog modula.

Bez JavaScripta link i CSS efekt rade, bez skrivenog sadržaja ili ovisnosti o inicijalizaciji. `prefers-reduced-motion`, fokus tipkovnicom/dodirom i aktivni pritisak daju stalan opacity 1; na uređajima s pravim hoverom vrijedi i tijekom hovera. Novi ID-evi i listeneri nisu uvedeni. Provjere su u `tests/sticky-cta.spec.ts`, uključujući stvarni vremenski tijek, 991/992 granicu, više instanci, no-JS, promjenu motion preference i otvaranje postojećeg obrasca bez slanja upita.

QA 2026-09-08: novih **6/6 Chromium + 6/6 WebKit** provjera prošlo je zasebno s jednim workerom, uključujući svih 28 potrošača na 390/990/991/992/993/1440px. Statički build dodatno je otvoren u oba enginea: 7000ms ciklus i prigušeni/prikazani frameovi, ista geometrija, ispravan HTML/HTTP 200, bez error overlaya/console grešaka i bez poslanih upita. `check`, `lint`, `format:check`, `build` i `git diff --check` prošli su. Puni testni poziv nakon smanjenja paralelizma imao je 136 prolaznih postojećih testova prije SIGTERM prekida procesa; preostalih šest novih testova dovršeno je odvojeno, zato se taj puni poziv ne bilježi kao jedan uspješan exit. Prvi preopterećeni paralelni pokušaj imao je browser crash/timeout nalaze koji se nisu ponovili. Fizički iOS/Android uređaji nisu korišteni.

### Stabilna hover/focus stanja navigacije

`NavDropdown` ostaje jedna zajednička komponenta za Prestazioni, Su di noi i Informazioni. Na desktopu pomiče samo `.link-label` kroz `transform`, uz stalnu širinu teksta i nepomičan link/hitbox. Crtica `.line` nije vidljiva u mirovanju: na hover/focus izraste slijeva (`scaleX(0 → 1)`) na odredišnoj poziciji. Lokalni parametri su `--dropdown-link-shift: 20px` i `--dropdown-link-duration: 300ms`; postojeći desni padding panela ostavlja prostor za pomak. Hover se primjenjuje samo na uređajima koji ga podržavaju, a `:focus-visible` dobiva isto isticanje uz vidljiv outline. Do 991px nema bočnog pomaka ni crtice; dugi mobilni nazivi normalno se prelamaju. Reduced-motion isključuje prijelaze.

Aktualni renderirani Webflow ponovno je pregledan na korisnički dodatak: njegova je crtica u mirovanju odrezana unutarnjim `overflow: hidden` wrapperom te se otkriva pomakom cijelog linka. Astro reproducira skriveno → izvučeno stanje transformom samo dekoracije, bez pomicanja hitboxa ili dodatnog clippinga fokusnog obruba. To nije nova verzija sadržaja ni promjena fontova/panela.

Korisnički odobren popravak namjerno uklanja promjenu margine na hover: ona je na 1920px sužavala link s 480 na 460px i povećavala panel s 280 na 300px. Ne mijenjati izvorne širine panela 500/600/540px, fontove ni breakpointe kako bi se prikrio taj problem. Regresije svih triju instanci, rubova hitboxa, tipkovnice, mobilnih varijanti i jezičnog izbornika pokriva `tests/navigation-hover.spec.ts`.

## Što je pregled svih 28 stranica promijenio

- Navigacija, kontakt sekcija, footer, WhatsApp i sticky CTA imaju po 28 izvornih instanci; zato su zajedničke komponente, a ne dijelovi jednog home templatea. Jezični izbornik je ugniježđen u navigaciji.
- Handoffove Section Benvenuti, Tradizione, Testimonianze, Informazioni i FAQ imaju po jednu home instancu: ostaju pregledne sekcijske kompozicije, a unutar njih su izdvojeni kartica, heading, FAQ i slider.
- Tri directory stranice (`/prestazioni-dentali`, `/chi-siamo`, `/informazioni-per-pazienti`) imaju svoje komponente i posebno ograničeni `dvDirectoryFade`. Njihovo pravilo ne vrijedi za home. Ne dijeliti ga s homepage sekvencom samo zbog sličnog izgleda.
- Šest about detail i sedam information detail stranica dijele `EditorialPage` i `PageSidebar`; sedacija čuva poseban service sidebar. Njihove stvarne razlike modelirane su podacima i varijantama.
- Četiri glavna treatment detail prikaza koriste povezane kartice u `TeaserCard` kontekstu `related`, s vlastitom geometrijom, bez kopiranja home kartice.
- Breadcrumb/detail hero pojavljuju se u sastavu unutarnjih stranica i kada Webflow component API prijavljuje nula instanci. Zbog toga se broj component instanci ne koristi kao inventar javnih stranica.
- Dvije pravne stranice, kontakti, FAQ, galerija i testimonijali imaju implementirane posebne sadržajne kompozicije kroz `ContentBlocks` i specijalizirane partiale.

## Podaci, izolacija i pravila izmjena

`data/site.ts` je jedino mjesto za poslovne vrijednosti prepisane iz reference, sa statusom `review`. `src/content/site.ts` daje talijanske UI/navigacijske podatke i izvedene kontakte; `home.ts` je sadržaj sekcija. FAQ cijene koriste reference na centralne vrijednosti. Izvorna interpunkcija, uključujući dvostruku točku, ostaje sačuvana. `home-assets.json` je generirani mapping, ne ručno uređivani drugi katalog.

`TeaserCardData.copyLayout` razlikuje `stack` (prve dvije usluge: izvorni flex column bez collapsea margina) od zadanog `flow` (treća/četvrta usluga: normalni block tok). Ta razlika pomiče tekst 5px ako se pogrešno ujednači. `priceInset` čuva zasebnu strukturu treće cijene. Slider zadržava prirodnu visinu pojedinačnih slajdova unutar maske visoke kao najviši slajd; kraći treći slajd ne centrira se dodatno vertikalno.

Statične komponente ne trebaju klijentski framework. Interaktivne instance imaju lokalni root, jedinstvene ID-eve i guard protiv ponovne inicijalizacije. Scroll primitive može označiti postojeći media element `data-reveal` atributima kada bi dodatni wrapper promijenio sticky/crop geometriju; inicijalizacija i easing ostaju isti, bez drugog animacijskog sustava.

Nakon promjene zajedničke komponente treba pokrenuti `npm test` i vizualnu provjeru svih izrađenih potrošača. Matrica sada obuhvaća svih 28 ruta: `tests/inner-pages.spec.ts`, home i interakcijske regresije te screenshot/geometry/breakpoint audite. Home zadržava dvije teaser sekvence, dvije language varijante, pet button varijanti i dvije form pozicije.

## Zajednički ulaz kartica — korisnički dodatak 7. rujna 2026.

`TeaserCard` automatski koristi `card` reveal do 991px: pomak 48px odozdo, opacity 0→1, **1000ms** kao veliki naslovi, easing `cubic-bezier(.22,.61,.36,1)`, bez delayja i bez serijskog čekanja. Vrh kartice mora proći liniju 15% visine viewporta iznad donjeg ruba: efekt počinje kasnije tijekom skrola, ne nakon dodatnog timera. `--reveal-duration` je jedini duration token za sve slide/fade/grow/card ulaze; `--reveal-card-distance`, `--reveal-card-easing` i `--reveal-card-offset` čuvaju specifičnosti kartica. Tokeni su u `src/styles/tokens.css`, a jedna inicijalizacija u `src/scripts/reveal.ts`. `Reveal` bez eksplicitnog `offset` propa ne ispisuje `data-offset`, pa buduća `variant="card"` instanca automatski koristi isti token kao `TeaserCard`. Eksplicitni offset ostaje podržana iznimka.

Nema scroll listenera ni rAF petlje za ovaj efekt; `IntersectionObserver` aktivira native Web Animations samo jednom. Observer i media/focus listeneri uklanjaju se nakon završetka. Ne ostaje transform ni trajni `will-change`. Povijest korisničkog ugađanja: 24px/450ms → 48px/600ms → 48px/1000ms uz kasnije okidanje na 15%. Naslovi zadržavaju svoj postojeći easing, offset i stagger; usklađeno je trajanje ulaza, ne trajanje FAQ-a, menija ili video prijelaza.

### Jedno mjesto za ugađanje reveal animacija

Motion blok u `src/styles/tokens.css` jedini je izvor zajedničkih parametara. Brže/sporije: `--reveal-duration`; ranije/kasnije: `--reveal-offset` (veći broj = kasnije); manji/veći pomak: `--reveal-distance`; vremenska odgoda: `--reveal-delay`; grow početna veličina: `--reveal-grow-scale`; dinamika krivulje: `--reveal-easing`. Jedinice: trajanje/odgoda u **ms**, pomak u **px**, offset kao broj postotaka **visine viewporta** (ne postotak visine kartice).

| Parametar   | Zajednički profil            | Dogovorena card iznimka                             |
| ----------- | ---------------------------- | --------------------------------------------------- |
| Trajanje    | `--reveal-duration: 1000ms`  | isti token                                          |
| Pomak       | `--reveal-distance: 100px`   | `--reveal-card-distance: 48px`                      |
| Prag ulaska | `--reveal-offset: 10`        | `--reveal-card-offset: 15`                          |
| Odgoda      | `--reveal-delay: 200ms`      | `--reveal-card-delay: 0ms`                          |
| Easing      | `--reveal-easing: out-quart` | `--reveal-card-easing: cubic-bezier(.22,.61,.36,1)` |
| Grow skala  | `--reveal-grow-scale: .75`   | ne primjenjuje se                                   |

`out-quart` je imenovani preset zajedničkog initializera: ista izvorna krivulja uzorkovana u 101 točki, s postojećim cubic fallbackom za browser bez CSS `linear()` podrške. Ostale vrijednosti easing varijable mogu biti native CSS easing, npr. `ease-out` ili `cubic-bezier(...)`; za promjenu odabira ne treba uređivati TypeScript.

Izvorne vremenske tokene radi čitljivosti pišemo u ms, ali initializer mora pretvarati i **s → ms**: produkcijski CSS minifier pretvara `1000ms` u `1s` i `200ms` u `.2s`. Sam `parseFloat` nije dovoljan. Regresijski test promjene tokena namjerno koristi sekunde; završna vizualna provjera mora uključiti statički build, ne samo dev server.

WebKit može pokrenuti inline module prije dolaska vanjskog CSS-a. Initializer zato provjerava dostupnost motion tokena prije registriranja observera i označavanja elemenata spremnima; jedna zajednička load pretplata nastavlja inicijalizaciju nakon stylesheet loada. Ne pretvara odsutan token u trajni nulti prag. Postojeći 1500ms pre-paint fail-open i dalje vrijedi: zakašnjeli CSS/JS ne smije ponovno sakriti već otkriven sadržaj. Taj redoslijed pokriva `tests/reveal-startup.spec.ts`.

`Reveal` ne upisuje defaultni `data-delay` ili `data-offset` koji bi pregazio tokene. Isti initializer koristi vrijednosti naslijeđene iz CSS-a za wrapper i postojeće `data-reveal` rootove. Već postojeće referentne iznimke ostaju eksplicitne: hero offset 0 i njegov stagger 200/400/800/1000/1200ms, gumbi 600ms/offset 0, reveal slike 400ms/offset 0 i welcome izjava 400ms. To nisu drugi defaulti; nisu promijenjeni ovom doradom. Nove iznimke dokumentirati umjesto kopiranja animacijskog koda. FAQ, slider, menu i video prijelazi nisu obuhvaćeni reveal tokenima.

Trenutačni potrošači: četiri service i četiri about kartice te početna mobilna kartica pogodnosti (`home/Hero`, `.benefits-card`) na `/`. Kartica pogodnosti koristi isti `data-reveal="card" data-reveal-media="mobile"` na postojećem rootu, bez dodatnog wrappera, skripte ili lokalnih timing vrijednosti; cijela lista i CTA ulaze zajedno, bez dodatnih child animacija. Sadržaj i prop `benefits` ostaju isti; njezin postojeći layout do 991px i skrivena desktop varijanta nisu promijenjeni. Provjere: `tests/hero-benefits-reveal.spec.ts`.

Roditeljski `TeaserSequence` ima `data-reveal-media="desktop"`, kako mobitel ne bi čekao i reveal cijele sekcije. Sticky fotografije na desktopu nisu izmijenjene. Informativne tekstualne kartice na naslovnici nisu automatski preoblikovane niti obuhvaćene globalnim selektorom.

Buduće directory liste usluga, Informazioni i Su di noi koriste isti motion profil, ne kopiju home CSS-a. Kada geometrija odgovara `TeaserCard`, efekt dolazi automatski. Za drugu geometriju upotrijebiti `<Reveal as="article" variant="card" media="mobile">…</Reveal>` s vlastitim klasama/slotom; ako wrapper mijenja layout, označiti postojeći root s `data-reveal="card" data-reveal-media="mobile"` i pozvati istu zaštićenu inicijalizaciju. Ne prenositi directory page-ID selektore na home. `media="all"` je eksplicitna opcija, ne automatska promjena desktop reference.

Bez JS ili potrebnih API-ja kartice su odmah vidljive. Reduced-motion, uključujući promjenu tijekom animacije, prikazuje sve bez kretanja; keyboard focus odmah otkriva karticu. Promjena širine preko 991/992 uklanja neprimjenjivo čekanje. Ulaz već viđene kartice ne ponavlja se pri povratnom scrollu. Testovi: `tests/card-reveal.spec.ts`; Chromium i WebKit pokreću isti testni skup (`npx playwright test tests/card-reveal.spec.ts --browser webkit --workers 1`). Za novi Codespace WebKit se priprema s `npx playwright install --with-deps webkit`; nisu dodane npm ovisnosti.

## Pokretanje bez početnog bljeska

`RevealSetup.astro` ima mali sinkroni inline script u zajedničkom `<head>`; ništa ne preuzima s mreže. Samo kada su JS/API-ji dostupni i reduced-motion nije uključen, postavlja `data-reveal-boot="pending"`. CSS priprema sve još neinicijalizirane `[data-reveal]` elemente prije prvog painta, uz iste mobile/desktop media uvjete. Odgođeni `initializeReveals()` preuzima taj već pripremljeni prikaz i prelazi na `ready`. Opacity i čekanje ne uvode se naknadno na već prikazanom tekstu.

Ako modul kasni ili ne uspije, bootstrap nakon najviše 1500ms aktivnog timera prelazi na `off` i otkriva sadržaj. Kasni modul označava elemente spremnima, ali ih ne skriva niti naknadno animira. Isti vidljivi fallback vrijedi ako bootstrap nedostaje ili je blokiran. Fokus unutar pending sadržaja ili promjena reduced-motion preference odmah otkriva sadržaj. Na breakpoint promjeni već vidljiva kartica ne smije ponovno krenuti iz opacity 0. Novi dinamički dodani elementi koji nisu pripremljeni prije prikaza ostaju vidljivi.

Nije dovoljno dodati globalni `.js { opacity: 0 }` niti sakriti sadržaj na `DOMContentLoaded`. Ne uvoditi pojedinačne hero/section timeout popravke. `tests/reveal-startup.spec.ts` provjerava prve opacity frameove, sve primjenjive reveal elemente prije učitavanja modula, mobile/desktop izuzeća, timeout + kasni nastavak, neuspjelu skriptu, rano fokusiranje, reduced-motion i nedostupne API-je. Ostali potrošači dijele isti initializer, bez dupliciranja listenera ili animacijskog koda.

Startup testovi zadržavaju stvarne postere, ali uklanjaju video source tagove iz testnog HTML-a kako zasebno usporavanje modula ne bi ovisilo o pokretanju nativnog dekodera u headless WebKitu. Stvarno dekodiranje/reprodukcija pokriveni su odvojenim `background-video.spec.ts` testovima i vizualnom provjerom statičkog builda.

## Hero video bez praznog polja

`BackgroundVideo` ima trajni `--color-primary` (#045a72) background i SSR `<picture>` s točnim prvim kadrom odgovarajućeg izvornog MP4-a. Dimenzije, `object-fit: cover` i geometrija videa/fotografije su iste; nema layout promjene. To nije Webflow JPEG poster preimenovan u WebP. Izvor i svaka izvedenica provjerljivi su kroz `video-posters.json`; regeneracija: `node scripts/prepare-video-posters.mjs` uz instaliran `ffmpeg` CLI, bez novih npm ovisnosti.

`SiteLayout` uz glavni slot nudi imenovani `head` slot. Home u njemu koristi `VideoPosterPreload` za obje art-direction varijante; oba koriste isti `heroVideos` mapping kao `Hero`. Media ograničenje preloada i picture sourcea sprječava download neaktivne fotografije. Usklađeni srcset/sizes izbjegavaju dodatno preuzimanje istog postera.

Video izvori počinju kao `data-src`, `preload="none"`, opacity 0. Svaka instanca samostalno provjerava svoj media query, vidljivost i reduced-motion. Tek nakon dekodiranja/painta fotografije dodaje izvore aktivnog videa. `playing` + `requestVideoFrameCallback` otkriva dekodirani video preko postera (120ms opacity prijelaz); fallback bez tog API-ja koristi spreman `playing` kadar i dva rAF-a. Nema trajne rAF petlje. Neaktivna ili offscreen instanca ne reproducira video; pri povratku se nastavlja. Browser koji odbije autoplay ostavlja fotografiju. Poster ostaje i bez JS-a, uz reduced-motion od početka ili neuspjeli video; nije ovisan o nativnom poster rendereru videa. Izvorni mobilni 479/480 media prijelaz, crop, gradijent i tekstualna geometrija nisu izmijenjeni.

`tests/background-video.spec.ts`: 390/479/480/1440, namjerno zadržane slike/video odgovori, plava podloga, prvi kadar bez spremnog videa, identična geometrija, samo aktivni zahtjevi, no-JS, reduced-motion, odbijen autoplay/neuspjeli video te stvarni playback, offscreen pauza i nastavak.

Završna regresija brzog scroll-away → return → reduced-motion otkrila je da zakašnjeli dekodirani kadar može vidjeti novu motion preferencu prije odgovarajućeg change callbacka. `showFrame` sada ponovno provjerava cijeli `canPlay()` uvjet i pauzira video, umjesto da samo odustane od otkrivanja kadra. Isto pravilo vrijedi za `playing` i završetak play promisea. Deterministički test zadržava frame/change callbackove; 12 uzastopnih ciljanih provjera (četiri ponavljanja po tri scenarija) prošlo je nakon popravka.
