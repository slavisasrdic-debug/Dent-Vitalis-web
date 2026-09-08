# Hrvatski sadržaj — odluke i prihvat 2026-09-08

## Mjerodavni izvori i granica zadatka

- Korisnik je potvrdio **hrvatski stupac** `reference/Dentvitalis web tekstovi - it + hr (1).docx` kao izvor HR sadržaja. Identična kopija u `reference/Upute za prijevode/` ne predstavlja novu verziju. SHA-256: `7b9273a1338415f095ec43e367e051afaa30df24de9a91b31ec3d7dc4ecc648e`.
- Naknadna uputa: talijanske izmjene iz DOCX-a već su riješene; ne vraćati stare IT tekstove niti ponovno provoditi žute IT korekcije. Za HR vrijede stvarni hrvatski tekstovi i urednička izuzeća, ne slobodan prijevod talijanskog weba.
- Korisnik je odbio privremene talijanske slugove pod `/hr/` i traži **dogovor hrvatskih slugova prije izrade podstranica**. `data/hr-routes.proposed.csv` je samo prijedlog, nije runtime routing, redirect tablica ni SEO odobrenje. Root `/hr/` već je odobren.
- Ova priprema ne objavljuje nove stranice, ne mijenja produkciju, talijanski copy, kontakte, cijene ili integracije.

## Vjeran unos bez ručnog pretipkavanja

`npm run content:extract:hr` izravno iz DOCX XML-a proizvodi `data/translations/hr-source.json`: 31 tablica, 2.424 odlomka ukupno, 1.082 odlomka HR ćelija (635 nepraznih), uključujući prazne odlomke, prijelome, naglaske i 315 žuto označenih runova u cijelom dokumentu. Samostalni HR odlomci izvan tablica također su sačuvani, uključujući recenzije.

Oznaka poput `t1.r0.c1.p4` znači tablica 1, red 0, HR stupac 1, odlomak 4; `p313` označuje samostalni izvorni odlomak. Numeriranje je vezano uz SHA-256 dokumenta: nova verzija mora dobiti ponovnu provjeru mapiranja. Ne tretirati broj odlomka kao semantički ID koji preživljava izmijenjeni DOCX.

Katalog je dokaz izvora, **nije sadržaj za automatsku objavu**. Ne smije se u cijelosti importati u javni client bundle: sadrži i IT ćelije i uredničke napomene. Implementacija bira eksplicitne HR ID-eve te ih mapira na postojeće tipizirane komponente. Ne poravnavati različite brojeve odlomaka između stupaca niti dopunjavati prazne HR ćelije talijanskim tekstom.

## Obvezna izuzeća

| Izvor                                                                       | Postupak za hrvatski                                                        |
| --------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| `p98`, cijela tablica `t18` — prijevoz samo za talijanski, HR stupac prazan | Bez HR stranice prijevoza, kartice, navigacijskog linka ili hreflanga       |
| `t8.r3.c1.p0` — „Nema prijevoda – ne nudimo drugima prijevoz”               | Izostaviti dio prijevoza na „Kako do nas”; napomena nije tekst za pacijenta |
| `t21` — pitanja o Rijeci, HR ćelije „Hrvatski ne”                           | Ne prenijeti FAQ grupu                                                      |
| `p319`–`p327`, napomena `p320`                                              | Ne prenijeti talijansku FAQ grupu o Hrvatskoj                               |
| `p340` i pripadajući talijanski odgovor                                     | Ne prenositi pitanje o usporedbi cijena Hrvatska/Italija                    |
| `t23.r0.c1.p0` — „Hrvatski ne”                                              | Izostaviti samo taj FAQ redak, sačuvati ostale potvrđene HR retke           |
| `t30` — HR ćelije prazne                                                    | Ne kopirati talijanske podatke za termine/kontrole u praznu HR sekciju      |

Žuto nije automatski „izbrisati”: postoje žuto označeni stvarni HR tekstovi, cijene i odgovori. Razlikovati sadržaj od eksplicitne uredničke napomene. Ne filtrirati sve žute runove niti brisati cijeli odlomak zbog obične riječi „nema”.

## Stvarne lokalizacijske razlike i otvorena mjesta

- Home benefit lista ima šest HR stavki: uključuje 36 rata i putovnicu implantata, bez talijanske IRPEF dokumentacije. Ne ograničavati listu na pet talijanskih elemenata niti naslijediti array animacijskih odgoda koji pokriva samo pet stavki.
- Google recenzije u tablici `t20` imaju HR tekstove i drugačiji sadržaj od dijela IT stupca; ne prevoditi ili izmišljati ocjene, godine, recenzente ni video titlove. Tekstualne recenzije izvan tablica moraju biti zasebno mapirane.
- DOCX sadrži kontaktne vrijednosti, uključujući WhatsApp broj u `t29`; to nije nestali resurs. Ne uključivati integraciju ili globalno prepisivati talijanske poslovne podatke bez zasebne odluke. Prazne HR kontakte ne nadopunjavati iz IT stupca.
- FAQ uvod naziva `+385 51 688 380` „besplatnim brojem”; izvorni HR izraz ne ispravljati nagađanjem, označiti vlasniku za provjeru prije produkcije.
- Na nekim mjestima cijene/rangevi razlikuju se po kontekstu (npr. krunice 330 € i „Već od 220 €”). Sačuvati pojedinačni izvor i kontekst; ne ujednačavati sve pojave iste imenice na jednu cijenu.
- Hrvatski pravni/privacy tekstovi nisu u predanom dvojezičnom dokumentu. Postojeći live `/hr/polica-privatnosti` i `/hr/uvjeti-koristenja` nisu automatski odobrenje za preuzimanje pravnih tekstova u novi web.
- Naslovnice direktorija, navigacija, footer i tehničke UI oznake zahtijevaju eksplicitno mapiranje postojećih HR fragmenata; katalog nije dokaz da je preveden svaki novi UI string.

## Prijedlog URL-ova za potvrdu

Preporuka je **ravna hrvatska struktura ispod `/hr/`**, usklađena s postojećim javnim hrvatskim URL-ovima. Izbornici i breadcrumb mogu imati kategorije bez dodatnog segmenta u URL-u. Cijene, akcijski slogani i godine ne ulaze u slug.

| Stranica                             | Predloženi URL                           |
| ------------------------------------ | ---------------------------------------- |
| Naslovnica                           | `/hr/`                                   |
| Usluge                               | `/hr/usluge`                             |
| Proteza sidrena na 4 implantata      | `/hr/proteza-na-4-implantata`            |
| Fiksni most na implantatima          | `/hr/fiksni-most-na-implantatima`        |
| Kućno izbjeljivanje zuba             | `/hr/izbjeljivanje-zubi`                 |
| Krunice, ljuskice, mostovi i proteze | `/hr/krunice-ljuskice-mostovi-i-proteze` |
| Svjesna sedacija                     | `/hr/svjesna-sedacija`                   |
| O nama                               | `/hr/o-nama`                             |
| Naši specijalisti                    | `/hr/nasi-specijalisti`                  |
| Sve na jednom mjestu                 | `/hr/sve-na-jednom-mjestu`               |
| Kako do nas                          | `/hr/kako-do-nas`                        |
| Dentalni laboratorij                 | `/hr/dentalni-laboratorij`               |
| Materijali i oprema                  | `/hr/materijali-i-oprema`                |
| Implantati nove generacije           | `/hr/implantati-nove-generacije`         |
| Informacije za pacijente             | `/hr/informacije-za-pacijente`           |
| Besplatni prvi pregled               | `/hr/prvi-pregled`                       |
| Trajanje liječenja                   | `/hr/trajanje-lijecenja`                 |
| Plaćanje                             | `/hr/placanje`                           |
| Garancije / jamstva                  | `/hr/jamstva`                            |
| Smještaj                             | `/hr/smjestaj`                           |
| Cjenik                               | `/hr/cjenik`                             |
| Iskustva pacijenata                  | `/hr/iskustva-pacijenata`                |
| Najčešća pitanja                     | `/hr/faq`                                |
| Galerija                             | `/hr/galerija`                           |
| Kontakt                              | `/hr/kontakt`                            |

Ovo predviđa 25 sadržajnih HR stranica, ne preslikavanje svih 28 IT ruta. `/hr/polica-privatnosti` i `/hr/uvjeti-koristenja` ostaju rezervirani postojeći kandidati dok se ne odobri izvor pravnog sadržaja. Prijevoz nema HR ekvivalent.

Postojeće javne putanje `/hr/o-nama`, `/hr/prvi-pregled`, `/hr/jamstva`, `/hr/placanje`, `/hr/kontakt`, `/hr/faq` i `/hr/izbjeljivanje-zubi` ponovno su potvrđene HTTP 200 dana 2026-09-08. Prvi dohvat pregleda istekao je na mrežnom timeoutu; ponovljeni je HTTP 200 na istoj putanji.

Poseban slučaj: `/hr/iskustva-pacijenata` trenutačno vodi na `/hr/testimonials`. Predložen je hrvatski kanonski slug; eventualni produkcijski 301 u suprotnom smjeru zahtijeva usklađivanje s postojećom redirekcijom da ne nastane petlja. Sada se ne instalira nijedna redirekcija.

Postojanje stare URL putanje samo po sebi ne dokazuje sadržajnu ekvivalenciju za 301. Stare detaljne usluge (`/hr/krunice`, `/hr/ljuskice`, `/hr/all-on-four` itd.) ne spajati automatski na nove skupne stranice. Potpuna migracijska mapa ostaje zaseban zadatak prije objave.
