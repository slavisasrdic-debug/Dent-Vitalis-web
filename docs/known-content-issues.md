# Poznati sadržajni i referentni problemi

Ovo nije lista zadataka koje treba automatski “popraviti” nagađanjem. Svaka stavka traži potvrdu vlasnika sadržaja, dizajna, SEO-a ili integracije.

## Blokatori prije produkcijske implementacije

| Problem                            | Dokaz                                                                                              | Potrebna odluka                                                                                |
| ---------------------------------- | -------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| Webflow export nije dostavljen     | audit može izmjeriti render, ali ne potvrđuje source assete/IX2                                    | pribaviti odobreni export i datum verzije                                                      |
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
