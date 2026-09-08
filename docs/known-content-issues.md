# Poznati sadržajni i referentni problemi

Ovo nije lista zadataka koje treba automatski “popraviti” nagađanjem. Svaka stavka traži potvrdu vlasnika sadržaja, dizajna, SEO-a ili integracije.

## Aktualizacija 7. rujna 2026. — naslovnica

- Prihvat exporta i handoffa je završen, manifest verificiran; HTML i glavni CSS objavljene naslovnice ponovno su potvrđeni kao identični handoffu. Stari nedostatak exporta je **riješen**.
- Sva 32 vanjska slikovna resursa su razriješena: 29 hash-identičnih aliasa unutar prihvaćenih izvora i tri pribavljene social SVG ikone. Desktop/mobile videi, posteri i fontovi su lokalni. Detalji su u `asset-inventory.md`.
- Postoji 28 prihvaćenih talijanskih stranica, uključujući dvije pravne koje nisu bile u starijem crawlu. Svih 28 sada ima Astro prikaz. Korisnik je odobrio postojeće Webflow putanje **za preview**, uključujući galeriju na `/domande-e-risposte`; to nisu konačno odobreni migracijski slugovi. Nema hrvatskog ni drugih prijevoda u paketu.
- Cijene, kontakti, radno vrijeme i copyright `2025` reproducirani su doslovno iz reference, centralizirano sa statusom `review`. To nije produkcijsko odobrenje poslovnih/medicinskih podataka. Razlika **65 km / 60 km od Triestea** i dvostruka točka u FAQ-u nisu samovoljno ispravljene.
- Backend obrasca nije potvrđen. Preview ne šalje zahtjeve i ne prikazuje lažan uspjeh. Prati izvor upita te lokalno provjerava PDF/JPG/PNG i 8 MB, ali to nije serverska zaštita.
- Izvedeni Webflow obrazac uklanja prezime i čini telefon opcionalnim; to je vjerno preneseno. Zasebno prezime ostaje poslovna/backend odluka.
- WhatsApp broj je `null`, gumb za vanjski chat je onemogućen uz objašnjenje. Izvorni social linkovi i mobilni menu CTA imaju `href="#"`; nisu izmišljeni profili ni zamjenske destinacije. Social ikone su statične/onemogućene, izvorni menu anchor je sačuvan.
- Izbornik koristi zadani prikaz `SI` umjesto izvornog koda `SL`; URL ostaje `/si/`, jezični standard `sl`. Ostali jezici vode samo na postojeće live naslovnice. Nema lažnih hreflang parova s neizrađenim Astro prijevodima.
- Izvor nema potvrđenu Open Graph sliku; ne dodajemo proizvoljnu. Preview je `noindex`; strukturirani poslovni podaci, puna SEO migracija i konačni OG asset moraju biti odobreni prije produkcije.
- Home scroll sekvence imaju iste parametre, ali izolirane instance. Izvorni globalni IX2 selektori povremeno prepisuju fotografije druge sekvence; ta interferencija nije prenesena. Page-specific directory fade nije primijenjen na naslovnicu.

Aktualna vizualna specifikacija: `webflow-home-spec-2026-09-07.md`. Donji nalazi audita od 2. rujna su povijesni; status iz ove aktualizacije ima prednost.

## Unutarnje stranice — dodatni nalazi 7. rujna

- Svih 27 ponovno dohvaćenih HTML-ova podstranica hash-identično je prihvaćenom handoffu. Nema neprimjetnog spajanja sadržaja različitih verzija.
- Tri directory stranice i dvije pravne stranice stvarno koriste Arial (izvor nema `.body` klasu). Sačuvano zasebnom layout varijantom, ne automatski pretvoreno u Montserrat.
- Na `/su-di-noi/i-nostri-specialisti` biografija Domagoja Žalca sadrži „Dr. XY”. Profil Tomislava Živkovića skriven je u izvoru i nije otkriven u previewu. Potrebna je provjera autora, identiteta, kvalifikacija i privola.
- Stari kontaktni podaci u pravnim tekstovima razlikuju se od aktualnih kontakata. Pravni tekst nije globalno prevezan na nove vrijednosti. Bankovni i dodatni kontaktni podaci iz detalja dodani su u `data/site.ts` kao `review`, bez poslovne potvrde.
- Prikazani link za parking na `/su-di-noi/come-raggiungerci` i njegov `href` imaju različite Google share identifikatore. Oba su prepisana; ne birati cilj nagađanjem. U jednom telefonskom linku kontakt stranice postoji izvorni nevidljivi U+200B; potvrditi normalizaciju prije objave.
- Unutarnji language switcher ne vodi na tuđe početne stranice kao prijevode: nepotvrđeni ekvivalenti su onemogućeni, nema lažnih hreflang parova.
- Galerija: 15 točnih parova lokalnih fotografija. Korisnik je naknadno izričito odobrio prije/poslije kontrolu kao na Webflowu; ranija odluka o statičnom prikazu time je razriješena. Zajednički native range, povlačenje i tipke „Prima”/„Dopo”, bez lightboxa; bez JS-a ostaje statičan 50/50 prikaz.
- YouTube: 13 točnih ID-eva i lokalnih originalnih thumbnailova; iframe se učitava tek aktivacijom. Razlika u početnom UI-u playera je namjerna optimizacija. Cookie/consent odluka prije produkcije ostaje otvorena.
- Google Maps dobio je pristupačan naslov i vidljivu link alternativu; dodatni redak ispod karte namjerno povećava visinu u odnosu na referencu.
- Izvan script tagova u objavljenom Webflow bodyju ostale su dvije tehničke upute za uključivanje/inicijalizaciju Typed.js. Nisu sadržaj za pacijente i nisu prenesene u Astro. Zbog tih slučajnih tekstualnih čvorova izvor ima dodatni završni redak (oko 20px desktop / 40px mobile); ta razlika nije nadoknađena proizvoljnim praznim prostorom.

## Blokatori i nalazi izvornog audita (2. rujna)

| Problem                            | Dokaz                                                                                              | Potrebna odluka                                                                                |
| ---------------------------------- | -------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| Webflow export nije bio dostavljen | riješeno prihvatom 7. rujna; vidi aktualizaciju iznad                                              | bez preostale blokade prihvata                                                                 |
| Nisu potvrđeni poslovni podaci     | preview nije autoritativan izvor za telefon, email, adresu, radno vrijeme, cijene i pravne podatke | dostaviti odobren business/content sheet                                                       |
| WhatsApp vodi na placeholder       | `https://api.whatsapp.com/send?phone=+ADDNUMBERHERE`                                               | potvrditi broj, format i lokalizirani prefilled text                                           |
| Form backend nije odobren          | Webflow šalje POST na `/send`; postoji file upload i tracking polja                                | potvrditi endpoint, obradu, retention, anti-spam, privolu, success/error copy i limit datoteke |
| Webflow forma nema zasebno prezime | DOM ima samo obvezni `name`, dok ciljna arhitektura traži ime i prezime                            | potvrditi zasebna polja, labele i backend mapping                                              |
| Nema pune jezične ekvivalencije    | Webflow je pretežno talijanski, live ima širi postojeći inventar                                   | odobriti page-ID/slug matricu za svih pet jezika                                               |
| Redirect plan nije odobren         | live audit ima 174 requested putanje i 168 finalnih pathnameova                                    | ručno mapirati stare URL-ove prije migracije                                                   |

## Linkovi i informacijska arhitektura

- Webflow ruta `/su-di-noi/sedazione-cosciente` vraća 404; bila je povezana u prvom prolazu, više nije u aktualnom link grafu, a valjana referentna ruta je `/prestazioni/sedazione-cosciente`.
- Ruta `/domande-e-risposte` prikazuje H1 “Galleria”; slug i naslov nisu semantički usklađeni. Ne mijenjati bez SEO/redirect odluke.
- Language switcher u previewu vodi na live `/hr`, `/de`, `/en`, `/si` umjesto na ekvivalentne preview stranice. To nije model za novu implementaciju.
- Talijanski mora ostati u rootu; za javne verzije su zabranjeni `/it/`, `/sl/` i `?locale=`. Slovenska ruta je `/si/`, ali `html lang` ostaje standardni `sl`.
- Ako prijevod stranice ne postoji, ne dodavati hreflang niti linkati neekvivalentnu stranicu kao prijevod.

## SEO i indeksiranje

- svih 26 Webflow 200 stranica nema canonical i hreflang;
- Webflow preview `robots.txt` trenutačno blokira samo `/404`, a `/sitemap.xml` vraća 404; produkcijska robots/sitemap pravila moraju biti eksplicitna;
- svih 174 zapisa u live crawl snapshotu nema canonical ni hreflang;
- live URL-ovi i neki redirecti koriste nedosljedne jezike/slugove; npr. hrvatski alias završava na engleskom `/hr/testimonials`;
- ne objavljivati sitemap, canonical, hreflang ili structured data iz nepotvrđene automatske slug transformacije.

## Sadržaj i copy

- u postojećim live titleovima pronađeni su tipfeleri i duplikati poput “Cearmica”, “DentVtalis” i ponovljenog “- DentVitalis - DentVitalis”; prije migracije treba proći editorial QA svih jezika;
- cijena i tvrdnja u home H1 (“4.990€”, “nessun limite di impianti”) poslovno su osjetljive i moraju imati datum/uvjete odobrenja;
- navodi o uštedama, garancijama, “besplatnom” pregledu, transportu, smještaju i plaćanju trebaju potvrdu opsega i uvjeta po jeziku;
- nazivi liječnika, titule i biografije moraju se potvrditi, uključujući dijakritike i aktualnost;
- footer i pravni/privacy sadržaj ne prepisivati iz previewa bez potvrde vlasnika i pravne revizije.

## Accessibility i media

- na početnoj je u auditiranom DOM-u 38 od 43 `img src` instance bez alta; velik dio je zajednički/dekorativan, ali svaku sliku treba klasificirati;
- testimonijali imaju 13 iframeova učitanih kao `loading=auto`, svi s generičkim titleom “YouTube video player”; koristiti specifične naslove i odgođeno učitavanje/poster pristup ako dizajn dopušta;
- Google Maps iframe je lazy, ali nema `title`;
- autoplay hero mora imati statični fallback i reduced-motion ponašanje;
- reveal animacije mogu ostaviti sadržaj na opacity 0 dok JS/scroll ne proradi; osnovni sadržaj mora biti dostupan i bez animacije;
- forme trebaju eksplicitne labele, povezane greške i status slanja; DOM audit sam ne potvrđuje da je sadašnja izvedba dovoljna.

## Vizualne nedoumice

- između 992 i 991 px namjerno ili nenamjerno dolazi do velikog skoka hero tipografije i potpune promjene kompozicije;
- između 480 i 479 px H1 skače s 24.96 na 43.11 px, benefit overlay nestaje i CTA mijenja visinu; potvrditi treba li vjerno reproducirati baš taj lom ili je to Webflow bug za korekciju;
- Inter Tight se učitava, ali nije pronađen na provjerenim vidljivim elementima;
- nisu potvrđene sve IX2 transition/easing/stagger vrijednosti;
- responsive varijante iste fotografije ne jamče da je automatski center crop dizajnerski ispravan.

## Sigurnost i privatnost audita

Google Maps zahtjevi mogu sadržavati javne API/query vrijednosti. Audit skripta ih redaktira prije spremanja. Audit JSON i screenshotovi su razvojni dokaz, ne produkcijski sadržaj i ne smiju završiti u `public/` ili `dist/`.
