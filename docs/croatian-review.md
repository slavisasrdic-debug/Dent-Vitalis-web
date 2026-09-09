# Hrvatska verzija — zajednički pregled nakon implementacije

Datum: 8. rujna 2026. Ovo je jedna objedinjena lista za vlasnika sadržaja. Nalazi nisu samostalno ispravljeni niti predstavljaju nove medicinske ili pravne zaključke.

## Što je napravljeno

27 odobrenih HR stranica na `/hr/` i hrvatskim slugovima iz `data/hr-routes.proposed.csv`, uz 28 sačuvanih IT stranica. Zajednički Astro layout/partiali, CSS tokeni i interakcije, bez dupliciranja velikih fotografija/video datoteka i bez Webflow runtimea. Hrvatski prijevoz namjerno ne postoji prema uredničkoj napomeni.

Sadržaj: eksplicitni hrvatski DOCX ID-evi, uključujući drugačije pogodnosti, 36 rata, putovnicu implantata i izvorne HR recenzije. Medicinski/prodajni odlomci nisu slobodno prevedeni. Lokalizirane su tehničke oznake i opisi fotografija; to nije prijevod govora postojećih video-testimonijala. Primjer „Kućno izbjeljivanje zuba” nalazi se doslovno u `t4.r0.c1.p3`.

Pravni tekstovi: korisnički odobrene [Polica privatnosti](https://www.dentvitalis.com/hr/polica-privatnosti) i [Uvjeti korištenja](https://www.dentvitalis.com/hr/uvjeti-koristenja). Izvorni HTML bajtovi, datum i kontrolni zbrojevi sačuvani su, zajedno s ponovljivom ekstrakcijom. Nestandardni originalni HTML pretvoren je u semantičke blokove i ugniježđene liste, bez izvršavanja skripti starog weba.

SEO: lokalizirani title/description/OG/Twitter/alt/ARIA, canonical i recipročni IT/HR hreflang samo za stvarne ekvivalente, statički sadržaj i sitemap. Schema dolazi iz vidljivog sadržaja i centralnih vrijednosti; nema izmišljenih ocjena, datuma ili liječničke provjere. Preview ostaje `noindex`; produkcijska migracija nije uključena.

## Lista za odluku vlasnika

| Prioritet              | Nalaz i izvor                                                                                                            | Što provjeriti prije objave                                                                                                                                        |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Visok — plaćanja       | HR navodi **SWIFT ZABAHR2X** (`t15.r3.c1.p11`), a banku **Erste&Steiermärkische** (`p9`); IT izvor ima **ESBCHR22**      | Potvrditi cjelinu banka/IBAN/SWIFT. HR prikazuje dostavljeni tekst, nije tiho preuzet drugi kod. Izvorni IT QR za plaćanje nije preslikan u HR.                    |
| Visok — cijene         | „Zubne krunice **330 €**” u sidebaru (`t5.r0.c1.p10`), a „Već od **220 €**” u članku (`t5.r1.c1.p1`) i drugim prikazima  | Jesu li različite vrste ili uvjeti? Ne ujednačavati bez objašnjenja.                                                                                               |
| Visok — opis paketa    | Cjenik kućnog izbjeljivanja uključuje **„Anestezija”** (`t19.r5.c1.p12`)                                                 | Potvrditi da pripada baš tom paketu. Tekst je sačuvan; ne donosimo medicinski zaključak.                                                                           |
| Kontakt                | FAQ opis naziva `+385 51 688 380` **„besplatnim brojem”** (`p313`)                                                       | Potvrditi izraz, broj i tarifiranje.                                                                                                                               |
| Kontakt                | HR kontakt koristi **it@dentvitalis.com** (`t29.r0.c1.p1`)                                                               | Potvrditi da je to željeni zajednički inbox. WhatsApp broj postoji u DOCX-u, ali njegovo postojanje nije automatska aktivacija integracije.                        |
| Pravni izvor           | Polica privatnosti ispisuje **www.dentivitalis.com**, iako poveznica vodi na dentvitalis.com                             | Potvrditi ispravak tipfelera; trenutno je sačuvan tekst izvora.                                                                                                    |
| Pravni izvor           | Ispisan telefon **+38551371064**, a pripadajući izvorni link je **tel:0038550371064**                                    | Potvrditi točan broj prije zamjene teksta ili linka.                                                                                                               |
| Pravni izvor           | Povijesni tekstovi spominju `info@dentvitalis.com`, `dpo@dentvitalis.com` i pravila/datum iz 2018.                       | Provjeriti aktualnost, kontakt za prava ispitanika i usklađenost s budućom obradom obrazaca/kolačića. Ne zamjenjivati sve kontakte automatski trenutačnim inboxom. |
| Jezična dorada         | „Nakon prethodnom tretmana” (`t4.r1.c1.p8`), „Digitalnizirani” (`t10.r3.c1.p4`), „tempistici liječenja” (`t13.r3.c1.p2`) | Dostaviti ili odobriti uredničke ispravke. Doslovni prijepis nije uredničko odobrenje.                                                                             |
| Recenzija              | Flora Dusi (`p260`) ima tekst u muškom rodu (`p261`)                                                                     | Potvrditi izvorni potpis/tekst. Ne prepravljati svjedočanstvo nagađanjem.                                                                                          |
| Zajednički IT/HR izvor | Google badge prikazuje izvorni **4.9 / 152**, footer copyright **2025**                                                  | Provjeriti aktualnost. Badge je statički referentni asset, ne live API; nije dodan `AggregateRating`.                                                              |
| Prethodni IT nalaz     | Biografija Domagoja Žalca u IT referenci sadrži „Dr. XY”; zasebni profil Tomislava skriven je u izvoru                   | Potvrditi imena, kvalifikacije i odobrenje biografija. HR nije automatski preuzeo skriveni IT profil.                                                              |
| Prethodni IT nalaz     | Različitih **60/65 km od Trsta** i različiti vidljivi/ciljni parking linkovi u IT izvoru                                 | Potvrditi namjeravane podatke; ne mijenjati već prihvaćeni IT copy kroz HR unos.                                                                                   |

## Tehničke granice prije produkcije

- Obrazac nema odobren backend. Nema lažnog uspjeha, testnih upita klinici ni aktiviranog uploada na server. Treba odobriti endpoint, privole, retention, zaštitu i polja.
- WhatsApp, social destinacije i consent za YouTube/Google Maps ostaju zasebne integracijske odluke.
- Dopuna 9. rujna: za svih 13 stvarnih videa dohvaćen je datum javne objave iz YouTube `videoPrimaryInfoRenderer.dateText`. `data/video-metadata.json` čuva URL, izvorni naslov/datum, datum dohvata i SHA-256 odgovora; `uploadDate` ima samo potvrđenu preciznost dana, bez izmišljenog vremena/zone. Trajanje nije dohvaćeno; indeksiranje videa nije zajamčeno samim JSON-LD-om. Medicinski autor/reviewer/datum i dalje se ne izmišljaju.
- Poznati IT „Dr. XY” ostaje u izvornom članku do uredničkog odobrenja. Taj nepotvrđeni opis više se ne prenosi u `Person.description`; ime liječnika i ostali potvrđeni podaci ostaju. Ovo ne zatvara biografsku stavku gornje liste.
- Sadržaj je semantički i čitljiv bez JS-a; nema posebnog skrivenog „AI” teksta ni obećanja rangiranja. Standardna [Google pravila za AI značajke](https://developers.google.com/search/docs/appearance/ai-features) primjenjuju iste temeljne SEO zahtjeve.
- Potpuna stara URL → nova URL migracija, 301/410 odluke, produkcijski robots/indexiranje i hosting čekaju zasebnu fazu. Posebno uskladiti staro `/hr/iskustva-pacijenata` → `/hr/testimonials` preusmjerenje prije obrata smjera. Nema DNS promjena ni produkcijske objave.
- DE/EN/SI prijevodi nisu dostavljeni; njihove stavke nisu lažni prijevodi HR/IT stranica. Fizički iOS/Android uređaji nisu obuhvaćeni headless Chromium/WebKit provjerom.

## Ponovljive provjere

`npm run test:content` čuva hash DOCX-a, sva izuzeća i pravne izvore. `npm run test:hr` provjerava SSR odlomke, SEO, jezične putanje i interakcije; WebKit: `npm run test:hr -- --browser webkit`. `npm run audit:copy:it -- --cached` ponovno provjerava Astro prema ranije dohvaćenom hash-identičnom Webflowu; nije novi mrežni dohvat reference. Standardni `check`, `lint`, `format:check`, `test:preview`, `test` i `build` ostaju relevantni.

Za ponovni unos pravnih tekstova koristiti `npm run content:extract:hr-legal`; ne formatirati immutable HTML ni generated JSON. Mapa komponenti: `docs/astro-component-map.md`. Runtime kopija DOCX kataloga ostaje isključivo build-time, ne u klijentskom bundleu.

### Završna QA evidencija

- `check`: 112 datoteka, 0 errors/warnings/hints; `lint`, `format:check` i statički build prolaze. `test:content` 5/5, `test:preview` 7/7. Build ima 55 sadržajnih stranica i zasebnu 404; sitemap 55 URL-ova.
- Zajednički Playwright prolaz: 161/162. Jedini preostali test očekivao je Tab fokus na sada nedostupnim DE/EN/SI prijevodima; očekivanje je usklađeno s neaktivnim stavkama i ciljani ponovni test prolazi. Nakon završnih gallery/anchor dorada ciljani skup prolazi **25/25**, uključujući 17 HR slučajeva i gallery Chromium/WebKit kontrole. Ovo nisu rezultati jednog naknadnog punog `validate` poziva.
- WebKit je provjerio svih 17 HR slučajeva. Nakon uklanjanja praznog pravnog sidebara prilagođena je usporedba pravnog izvora: H1 pripada hero sekciji, a cijeli pravni body i dalje mora ostati neprekinut i neizmijenjen. Ponovljena ta provjera prolazi; ne brišu se pravni odlomci radi prolaznog testa.
- Statički HTML audit: svih 55 ruta ima valjane lokalne assete, ciljeve internih fragmenata i recipročne postojeće hreflang parove. Svi HR naslovi i opisi jedinstveni su; nema nedostajućih alt atributa. IT copy audit prema ranije hash-verificiranom cacheu: 28/28 izvora nepromijenjeno, bez novih nerazvrstanih razlika ili meta razlika.
- Pregledano 16 statičkih screenshotova: home, paket, cjenik, galerija i pravna stranica na 390/1440px u Chromiumu i WebKitu, nakon fontova, decodea vidljivih slika i painta. Bez app/console upozorenja i bez POST upita. Videi su za stabilne screenshotove u reduced-motion poster stanju; stvarno kretanje/video/reveal/glifovi obuhvaćeni su postojećim regresijama. Browser plugin nije dostupan; korišten je postojeći Playwright, bez instaliranja novih browser ovisnosti.
- Svih 27 HR ruta provjereno je na 390/1440px; navigacija posebno na 991/992/1279/1280/1281/1439/1440/1441/1920px. Ovo ne predstavlja fizičko testiranje svih modela telefona niti tvrdnju da je prevedeni tekst pixel-identičan drugačijem talijanskom tekstu.

Privremene snimke i runtime logovi su u `/tmp/dentvitalis-hr-*`, izvan produkcijskog builda i Gita. Izvori, kod, ponovljivi testovi i trajne odluke verzioniraju se; nisu dodane nove kopije velikih fotografija/videa.
