# Inventar komponenti

Ovaj inventar opisuje ponavljajuće kompozicije zatečene na renderiranom Webflow previewu. Granice Astro komponenti još nisu zaključane: potvrđuju se tek usporedbom svih jezika i odobrenog exporta. Cilj je izbjeći i jedan golemi page template i prerano stvaranje apstrakcija koje ne odgovaraju dizajnu.

## Globalni elementi

| Kandidat            | Varijante i stanje                                              | Sadržaj / podaci                                                                                          | Napomena                                                                                     |
| ------------------- | --------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| Site header         | desktop 1440+, compact desktop 992–1439, mobile ≤991, open menu | logo, primarna navigacija, dropdown grupe, language switcher, CTA                                         | sticky; desktop/mobile prijelaz 992/991                                                      |
| Navigation dropdown | zatvoren, hover/focus otvoren                                   | naslov grupe, linkovi na detail/overview rute                                                             | desktop bijela mega/dropdown ploha                                                           |
| Language switcher   | IT, HR, DE, EN, SI                                              | ekvivalentni prevedeni URL ili bez linka                                                                  | javne rute moraju biti `/`, `/hr/`, `/de/`, `/en/`, `/si/`; `html lang` za slovenski je `sl` |
| Mobile sticky CTA   | 480–991 visina 56, ≤479 visina 48                               | lokalizirani label i stvarni odobreni cilj                                                                | 6 px bočni odmak; ne koristiti placeholder                                                   |
| WhatsApp action     | floating                                                        | stvarni broj i lokalizirana accessible oznaka                                                             | trenutačni Webflow cilj je nevažeći                                                          |
| Footer              | desktop višestupčani, tablet/mobile stacked                     | adresa, kontakti, kategorije, pravni linkovi, društvene mreže                                             | poslovne podatke potvrditi, ne prepisivati naslijepo                                         |
| Contact/lead form   | common form na svim 200 stranicama                              | Webflow: ime, email, telefon, poruka, datoteka, privola, tracking, honeypot; ciljna shema traži i prezime | action/backend i upload pravila nisu odobrena                                                |

## Sekcijske kompozicije

| Kandidat                       | Gdje se pojavljuje                                                      | Varijante                                                                                         |
| ------------------------------ | ----------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| Home split-video hero          | početna                                                                 | desktop landscape video/overlay; mobile stacked copy + portrait video; review badge; CTA/benefits |
| Detail hero                    | usluge, o nama, informacije, FAQ, galerija, kontakti, overview stranice | fotografija + teal overlay + breadcrumb/H1; zasebni cropovi po stranici                           |
| Centered statement             | početna                                                                 | eyebrow/tekst, veliki H2, ograničena širina teksta                                                |
| Alternating content-media card | početna i detail sadržaj                                                | slika lijevo/desno; svijetla ili bijela ploha; jedan ili više CTA linkova                         |
| Overview card grid             | `/prestazioni-dentali`, `/chi-siamo`, `/informazioni-per-pazienti`      | responsive grid kartica s fotografijom, H3, tekstom i linkom                                      |
| Specialist profile             | `/su-di-noi/i-nostri-specialisti`                                       | portret, ime, titula/opis; redoslijed je sadržajni podatak                                        |
| Trust/review block             | početna i testimonijali                                                 | Google/review sažetak i povezani dokaz                                                            |
| YouTube testimonial grid       | `/testimonianze`                                                        | 13 video kartica/iframeova                                                                        |
| FAQ accordion                  | početna (6 izdvojenih), `/faq` (18 pitanja)                             | closed/open; pitanje, odgovor, indikator                                                          |
| Before/after gallery           | `/domande-e-risposte` i home primjeri                                   | uparene fotografije, label prije/poslije, responsive crop                                         |
| Contact information cards      | `/contatti`                                                             | telefon, email, adresa/radno vrijeme prema potvrđenim podacima                                    |
| Map block                      | `/contatti`                                                             | embed + vanjski route/directions link                                                             |
| Lead form section              | sve 200 rute                                                            | lokalizirani heading, copy, fieldovi, validation, success/error                                   |

## Kompozicije početne stranice

Redoslijed zatečen u Webflowu:

1. sticky header;
2. video hero s cijenom, benefitima, CTA-om i review signalom;
3. “Grandi risparmi…” statement;
4. “Benvenuti a Dentvitalis Croazia” sadržaj;
5. “Tradizione e competenza” i četiri kartice o klinici;
6. “Rapporto di fiducia” testimonial/trust sadržaj;
7. “Questo potrebbe interessarti” povezani sadržaj;
8. FAQ teaser sa šest pitanja;
9. lead forma;
10. footer, floating WhatsApp i mobilni sticky CTA.

Točan broj dekorativnih wrappera nije komponentna granica. Komponentu izdvojiti kada dijeli semantiku, podatkovni model i ponašanje na više ruta.

## Podatkovne granice

- navigacija i footer: lokalizirani strukturirani podaci, bez hardkodiranja u layout;
- jezične alternative: eksplicitna mapa ekvivalentnih stranica, nikad konkatenacija prefiksa;
- services/about/information cards: referenca na stabilni page ID i lokalizirani slug;
- gallery item: jedan zapis s before/after assetima i alt tekstovima;
- testimonial: provider/video ID, lokalizirani naslov, osoba i thumbnail; iframe se ne mora učitati prije interakcije;
- FAQ: stabilni ID, lokalizirano pitanje/odgovor i opcionalna kategorija;
- form: shema fieldova odvojena od odobrenog server endpointa i tracking integracije;
- business identity: jedna potvrđena konfiguracija za naziv, adresu, telefone, email, radno vrijeme i profile.

## Accessibility i ponašanje koje komponenta mora nositi

- header ima keyboard dostupne dropdownove, focus-visible i ispravno upravljanje fokusom mobilnog menija;
- menu button i accordion imaju stvarni `button`, `aria-expanded` i vezu prema kontroliranom panelu;
- dekorativne slike imaju prazan alt, sadržajne lokalizirani alt; Webflowov velik broj praznih altova nije specifikacija;
- video poštuje `prefers-reduced-motion`, a ključni sadržaj ne ovisi o autoplayu;
- forme imaju label, opis greške, status slanja i potvrđenu privacy vezu;
- vanjski embedovi imaju specifičan title i ne blokiraju početni prikaz;
- CTA i language switcher nikad ne vode na neekvivalentnu stranicu predstavljenu kao prijevod.

## Ne zaključavati prije potvrde

- jedan univerzalni hero za home i detail stranice;
- jednu karticu za sve content/media, profile i overview slučajeve;
- automatizirani slug builder između jezika;
- univerzalni image aspect ratio;
- animacijski primitive prije pregleda Webflow IX2 exporta.
