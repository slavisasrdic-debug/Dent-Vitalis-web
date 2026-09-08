# Isporuka talijanske naslovnice

Faza obuhvaća samo `/`, sa zajedničkim zaglavljem, navigacijom, jezičnim izbornikom i podnožjem. Nisu izrađene unutarnje stranice, učinjeni commit/push, deployment ni promjene produkcije.

## Preview

[Codespaces preview](https://obscure-cod-qvppwp6vwwjcxpg9-4321.app.github.dev/) — lokalni server sluša na `0.0.0.0:4321`, vraća HTTP 200. Zadnja read-only provjera `gh codespace ports` tijekom dorade učitavanja navodi port 4321 kao `public` (pri prvotnoj isporuci bio je `private`). Vidljivost porta nije mijenjana ovom doradom. Ako se Codespace zaustavi, ponovno pokrenuti `npm run dev -- --host 0.0.0.0` i otvoriti port 4321 u Ports panelu.

## Implementirano

- Čisti statički Astro + strogi TypeScript, bez Webflow runtimea, jQueryja, GSAP-a, Reacta ili iframea.
- Tipizirane višekratne komponente i odvojene home kompozicije, sadržaj u `src/content`, poslovne vrijednosti u `data/site.ts`. Pregled svih 28 handoff sastava i API komponenti prethodio je odabiru granica. [Detaljna mapa](./astro-component-map.md) sadrži props, varijante i potrošače; trajna pravila su u `AGENTS.md`.
- Oba izvorna hero videa, posteri, točni fontovi/weightovi i responsive lokalne fotografije; usluge i about sticky/fade sekvence, welcome, slider s tri recenzije, osam informativnih kartica, šest FAQ odgovora, kontakt i footer.
- Dropdownovi, tipkovnica/Escape, mobilni menu, jezik, swipe/strelice/točke bez autoplay slidera, native FAQ i zajednički inline/modal obrazac. Ponavljane instance ne dijele ID-eve ni stanje.
- Reveal po izvornim parametrima s laganim IntersectionObserverom; native video se pauzira kad nije vidljiv. Reduced-motion i no-JS sadržaj ostaju dostupni.
- Samo talijanski sadržaj, `/`, `lang=it`, canonical i self/x-default hreflang, preview `noindex`. Nema lažnih prijevoda niti automatskih jezičnih redirecta.

## Provjere i dokaz

Prethodna faza centralizacije završila je zelenim provjerama iz `npm run validate`: Astro/TypeScript **0 grešaka/upozorenja/hintova**, ESLint, Prettier, **42/42 Playwright testova**, statički build (prvotna isporuka imala je 15 testova). Rezultati novije dorade početne kartice, uključujući jedan nestabilan test videa, navedeni su na kraju dokumenta. Dodatni load test provjerava konzolu, HTTP greške i dekodiranje svih lokalnih slika. Testovi uključuju tipkovnicu, mobile menu, modal/fokus, swipe, upload ograničenja bez mrežnog slanja, no-JS i reduced-motion.

Vizualna usporedba nije zamijenjena buildom. [Indeks dokaza](../reference/screenshots/2026-09-07-home/README.md) objašnjava viewport parove, overlay/diff, 25 graničnih širina, interakcijske snimke i snimke skrola. Snimke su na istom Chromiumu, uz učitane fontove/slike i kontrolirane video postere. 25 širina provjereno je bez horizontalnog overflowa. Nalaz preciznog line-height zaokruživanja i izvornih FAQ baseline razmaka ugrađen je u komponente.

Brzi pregled: [desktop Webflow/Astro](../reference/screenshots/2026-09-07-home/comparisons/desktop-top-pair.png), [mobile Webflow/Astro](../reference/screenshots/2026-09-07-home/comparisons/mobile-top-pair.png). Referenca je lijevo, Astro desno. U istom direktoriju su dodatni `*-services-pair`, `*-contact-pair` i `*-footer-pair` te svi pojedinačni overlay/diffovi.

Identitet ponovno dohvaćenog home HTML-a i glavnog CSS-a jednak je prihvaćenom handoffu. Završna provjera nepromijenjenih ekstrakcija: **1538 handoff datoteka + 297 export datoteka**, svi hashovi odgovaraju. Nema neprimjetnog miješanja objavljenih verzija.

## Preostale razlike i blokatori

- Nije proglašena apsolutna pixel-identičnost. Ostaju sitne rasterske razlike u responsive fotografijama i ručno izrađenim SVG/CSS ikonama; prihvaćeni veći masteri imaju drugačije resampliranje od ponekih Webflow CDN izvedenica. Završni `report.json` navodi stvarne razlike po viewportu, ne marketinški postotak podudarnosti.
- Izvorno poravnanje logotipa uklonilo je **1px** odstupanje podnožja. Mobilni kontakt zadržava oko **0,08px** line-box odstupanja. U mobilnim teaser mjerenjima završni 40px margin pripada vanjskom toku umjesto visini wrappera; početak sljedeće sekcije se poklapa — ne radi se o nestalom razmaku.
- Izvorni IX2 globalni selektori povremeno interferiraju između dviju sticky sekvenci. Astro instance su namjerno izolirane prema zadanim pravilima, pa taj slučaj ne reprodukuje pogrešnu fotografiju druge sekcije. Fade provjera u kretanju nije tvrdnja o sinkronizaciji svakog framea u različito opterećenom runtimeu.
- Forma nema odobren backend; ne šalje podatke i izričito ne tvrdi uspjeh. WhatsApp broj i social destinacije nisu potvrđeni. Izvorni mobilni menu CTA `href="#"` ostaje nefunkcionalni referentni anchor, dok potvrđeni “Consulta il dentista” i home inquiry CTA otvaraju obrazac.
- Poslovni/medicinski i pravni sadržaj je `review`, ne produkcijsko odobrenje. Nema hrvatskog ni ostalih prijevoda u izvorima. Unutarnji referentni linkovi čekaju izradu i konačnu SEO URL odluku. OG slika, puna schema/redirect migracija i produkcijska integracija nisu odobrene ovom fazom.

Za naslovnicu, header i footer **nema nedostajućih slikovnih, video ni font resursa**. Svih **32/32** ranije vanjskih slika je razriješeno (29 hash-identičnih aliasa, 3 pribavljena originalna SVG-a). [Asset inventar](./asset-inventory.md) i [Git/LFS prijedlog](./source-versioning-proposal.md) sadrže mapping i način nastavka iz drugog Codespacea bez nepotrebnog dupliciranja ZIP-ova/mastera.

## Naknadna dorada: zajednički mobilni ulaz kartica

Nakon prihvata naslovnice dodan je `card` profil zajedničkog `Reveal` sustava. Po korisničkom isprobavanju početni 24px/450ms profil prvo je pojačan na 48px/600ms. Aktualno trajanje je **1000ms**, usklađeno s velikim naslovima kroz jedan `--reveal-duration` token. Pomak ostaje **48px**, delay **0**, easing `cubic-bezier(.22,.61,.36,1)`; okidanje je pomaknuto na **15% visine viewporta od donjeg ruba** (`--reveal-card-offset`). Vrijedi za svih osam teaser kartica na mobitelu i buduće directory liste. Desktop sticky/fade nije mijenjan. Za ponovno isprobavanje treba osvježiti stranicu: već prikazane kartice ne ponavljaju ulaz.

`tests/card-reveal.spec.ts` dodaje šest provjera: stvarni međukadrovi obje varijante bez promjene layouta, granice/rotacija, reduced-motion tijekom ulaza, fokus, no-JS te brzi/povratni scroll. Isti skup provjerava se u Chromiumu i WebKitu (mobilni viewport/touch emulacija); to nije test fizičkih iOS/Android uređaja. Browser plugin nije dostupan, pa se koristi postojeći Playwright. Detaljni ugovor budućih potrošača je u [mapi komponenti](./astro-component-map.md#zajednički-ulaz-kartica--korisnički-dodatak-7-rujna-2026).

Po dodatnom zahtjevu svi zajednički reveal parametri centralizirani su u motion bloku `src/styles/tokens.css`: trajanje, pomak, odgoda, prag ulaska, grow skala i easing. `Reveal` ne duplicira zadane vrijednosti kroz props; dogovorene card i referentne stagger iznimke dokumentirane su u mapi. Kartični testovi prošireni su na devet: kasniji 15% prag, jednako trajanje velikog H2 i kartice te stvarno ugađanje isključivo promjenom CSS tokena. Potonji test koristi sekunde, jer produkcijski minifier smije pretvoriti ms u s. CSS readiness regresija dodatno pokriva WebKit koji pokreće module prije učitanog stylesheeta.

Završno: `npm test` **42/42**, dodatni `card-reveal` + `reveal-startup` u WebKitu **18/18**; check/lint/format/build bez grešaka. Renderirani statički build pregledan u Chromiumu i WebKitu na 390×844 i 1440×844, sa stvarnim posterima i kontrolirano zaustavljenim video downloadom radi izolacije animacije. Pri vrhu kartice na 90% visine ekrana još nema animacije; nakon prijelaza dogovorene linije izmjereni su opacity međukadrovi i stvarno trajanje **1000ms** u oba browsera. Završni opacity 1, bez zaostalog transforma, horizontalnog overflowa, error overlaya ili console grešaka; desktop kartice zadržavaju svoj izgled. Snimke ove dorade su u `/tmp`, izvan repozitorija. To nije test fizičkog iOS/Android uređaja.

## Ispravak početnog bljeska animiranog sadržaja

Naknadno otkriveni slijed „tekst vidljiv → skriven → ulaz” riješen je zajedničkim pre-paint bootstrapom u layout headu. Obuhvaćeni su hero, sekcijski naslovi/tekstovi, reveal slike/gumbi i kartice; ne samo jedan H1. Sam ispravak bljeska nije mijenjao timing; kasnije korisničko usklađivanje kartica na 1000ms opisano je iznad. Skripta koja stigne nakon sigurnosnog otkrivanja sadržaja ne smije ga ponovno sakriti. Trajno pravilo dodano je u `AGENTS.md`, a startup ugovor u mapu komponenti. Testovi `tests/reveal-startup.spec.ts` uključuju hladno/usporeno učitavanje, blokirani modul, prve frameove, fokus i reduced-motion. Završni screenshot sam nije dokaz uklanjanja ovog buga.

## Hero: tamnoplava podloga, prvi kadar, pa video

Po naknadnom korisničkom zahtjevu siva `#515346` podloga zamijenjena je brend tamnoplavom `--color-primary` (#045a72). Stalni `<picture>` ispod videa prikazuje točan prvi dekodirani kadar odgovarajućeg izvornog MP4-a. Responsive WebP fotografije imaju 38.166 bajtova za najveći mobile i 54.340 za najveći desktop poster, uz manje izvedenice. Media-aware preload i video dijele tipizirani mapping; samo aktivni video dobiva `src`, nakon dekodiranja/painta slike. Video se otkriva tek kad stvarni kadar bude spreman, kratkim 120ms prijelazom; bez promjene croppa, položaja ili teksta. Spor/neuspjeli video ili odbijen autoplay ostavljaju fotografiju, a prije same fotografije ostaje tamnoplava podloga. Bez JS-a/reduced-motion od početka video se ne preuzima.

Originalni video/JPEG izvori nisu prepisani. Razlika prema prvotnim Webflow usporednim snimkama je namjerna dorada učitavanja po korisničkom zahtjevu; nije neprimjetno miješanje reference. Izvori/SHA-256 mapping i reprodukcija opisani su u [inventaru asseta](./asset-inventory.md), API/lifecycle u [mapi komponenti](./astro-component-map.md#hero-video-bez-praznog-polja).

Završna provjera ove dorade:

- `npm run validate`: 58 Astro/TS datoteka bez dijagnostike, lint/format, 38/38 testova i statički build.
- `npx playwright test tests/background-video.spec.ts tests/reveal-startup.spec.ts tests/card-reveal.spec.ts --browser webkit --workers 1`: **23/23**; prave video datoteke provjerene odvojeno od kontroliranog odgađanja reveal modula. Test pauze koristi eksplicitni instant scroll i potvrdu offscreen geometrije, kako ne bi ovisio o CSS smooth-scroll trajanju i lazy sadržaju.
- Ručni Playwright pregled statičkog builda (`http://127.0.0.1:4322/`) u Chromiumu 151.0.7922.34 i WebKitu 26.5, **390×844 i 1440×844**: ispravan URL/title/H1, bez prazne stranice, error overlaya, relevantnih console grešaka ili horizontalnog overflowa. Snimke sa zadržanim video odgovorom pokazuju stvarnu fotografiju; nakon nastavka mreže vidljiv je video istog croppa. Prve uzorkovane opacity vrijednosti hero naslova su 0, završne 1, bez pada iz vidljivog u skriveno u sva četiri slučaja.
- Video granice dodatno provjerene na 479/480px; postojeća home/card breakpoint matrica ostaje u testovima. Nova QA snimanja su privremena, izvan repozitorija i produkcijskog builda.
- Browser plugin nije dostupan; korišten je postojeći Playwright prema frontend-testing-debugging postupku. WebKit/Chromium mobilna emulacija nije provjera fizičkog iPhonea ili Android uređaja, posebno njihovih konkretnih low-power/data-saver politika. Odbijen autoplay simuliran je testom i sigurno ostavlja fotografiju.

## Početna kartica pogodnosti koristi isti card reveal

Na korisnički zahtjev `.benefits-card` u `home/Hero.astro` dobila je samo zajedničke `data-reveal="card" data-reveal-media="mobile"` atribute na postojećem rootu. Lista pogodnosti i CTA ulaze kao jedna cjelina; nema zasebne skripte, lokalnih parametara, novog wrappera, izmjene sadržaja ni CSS geometrije. Parametri ostaju zajednički: 1000ms / 48px / offset 15% / delay 0. Postojeća vidljivost do 991px i desktop hero lista nisu promijenjene.

- Četiri nova testa `tests/hero-benefits-reveal.spec.ts` prolaze u Chromiumu i WebKitu: stvarni međukadrovi i one-shot ulaz bez layout pomaka, responsive granice, fokus/reduced-motion te no-JS sadržaj i CTA.
- Statički build dodatno provjeren u oba browsera: izmjereno 1000ms / delay 0 / početni `translateY(48px)`, završno opacity 1 / transform none. Stabilizirani prije/poslije screenshotovi na 390/991/992/1440×844 imaju **0 promijenjenih piksela** unutar svakog browsera; geometrija je identična. Nema console grešaka, error overlaya, prazne stranice niti horizontalnog overflowa. Privremene snimke su u `/tmp`, izvan produkcije.
- Check, lint, format i build prolaze. Puni `npm test`: **45/46** u ovom prolazu. Postojeći test videa jednom nije potvrdio pauzu nakon uključivanja reduced-motion unutar 5s; taj izdvojeni test zatim je prošao **3/3 ponavljanja**. Uzrok povremenog rezultata nije potvrđen i video kod nije mijenjan ovom doradom. Ne predstavljati ovaj puni prolaz kao potpuno zelen.
- Browser plugin nije dostupan pa je korišten Playwright. Fizički iOS/Android uređaji nisu testirani.

## Navigacija: stabilan hover i crtica koja se izvlači

Reproduciran korisnički problem na 1920px: promjena `margin-left` sužavala je link s 480 na 460px, najduža stavka prelazila je u drugi red, a panel rastao s 280 na 300px. Zajednički `NavDropdown` sada pomiče samo tekst/dekoraciju, uz stalni hitbox i geometriju. Izvorni fontovi, širine panela i breakpointi nisu promijenjeni.

Na dodatni korisnički zahtjev ponovno je pregledan renderirani aktualni Webflow: crtica je u mirovanju skrivena clippingom unutarnjeg wrappera, a pomakom linka se otkriva. Astro zadržava skriveno → izvučeno stanje s `scaleX(0 → 1)` dekoracije, pomakom teksta 20px i zajedničkih 300ms, bez clippinga fokusa. Na mobitelu nema crtice ni bočnog pomaka; reduced-motion isključuje prijelaze. Pravilo protiv hover reflowa dodano je u `AGENTS.md`; detalji su u mapi komponenti.

- `tests/navigation-hover.spec.ts`: 21 provjera u Chromiumu; u WebKitu provjerene iste desktop granice i zasebno 9 motion/mobile/language provjera nakon prekida sesije. Sva tri dropdowna, sve stavke, hover na lijevom rubu, Tab/Escape, fokus, rast/nestanak crtice, top-level linkovi i jezični izbornik.
- Širine: 390/479/480/767/768/990/991/992/993/1279/1280/1281/1439/1440/1441/1919/1920/1921/2560px. Stvarni međuokviri potvrđuju 300ms, pomak 0→20px i rast 0→1 bez promjene visine redaka/panela.
- Statički build u Chromiumu 151 i WebKitu 26.5: 1920×900 te 390×844. Ispravan URL/title/H1, bez prazne stranice, Vite overlaya, console grešaka ili mobilnog overflowa. Panel na 1920px ostaje 540×280px u oba stanja. Privremeni screenshotovi mirovanja/hovera/mobitela su u `/tmp`, izvan repozitorija i builda.
- Uzorkovanje nav animacije zadržava stvarni poster i blokira video podatke samo u tom testu: pokretanje nativnog headless WebKit dekodera pri promjeni reduced-motion preference može preskočiti cijeli 300ms prozor snimanja. Stvarna reprodukcija/pauza videa provjerava se zasebnim postojećim video testovima; video kod nije mijenjan.
- Browser plugin nije dostupan; korišten je postojeći Playwright. Fizički iOS/Android uređaji nisu testirani. Check, lint, format i build prolaze.
- Završno je prošlo svih **67 testova** u dvije grupe: 21 nova navigacijska provjera i 46 postojećih testova naslovnice. U ovom prolazu prolaze i oba testa stvarne reprodukcije/pauze videa; ranija zabilježena povremena nestabilnost time nije proglašena riješenom. Nema commit/pusha ni produkcijske objave.
- Nakon prekida Codespacea ponovno je pokrenut dev server na `0.0.0.0:4321` i registrirano prosljeđivanje porta. Na izričit korisnički zahtjev 4321 postavljen je na **public**; lokalni i vanjski preview vraćaju HTTP 200. Postupak provjere/obnove opisan je u README-u.
