# Prijedlog migracije URL-ova — 10. rujna 2026.

**Status: prijedlog za pregled, ništa nije aktivirano.** Korisnik je odobrio
izradu mape, ne produkcijske redirekcije, uklanjanje stranica ni izmjenu
medicinskog sadržaja. Glavni host ostaje `https://www.dentvitalis.com`.

## Rezultat

Svih **206** adresa iz inventara ima redak u [CSV mapi](../data/redirects.csv).
Izvor je javni sitemap, stari snapshot i otkriveni interni linkovi, a ne
potpuni popis iz Search Consolea ili server logova. Brojevi uključuju aliase.
Stari odgovori su od **9. rujna**, hash-provjereni iz cachea; nije ponovljen
mrežni crawl. Dana 10. rujna provjereno je **38 lokalnih ciljeva/kandidata**:
HTTP 200, jezik, title, H1, canonical i noindex.

| Skup                                | Adresa | Prijedlog                                                                                    |
| ----------------------------------- | -----: | -------------------------------------------------------------------------------------------- |
| Jasna namjena i odredište           |     26 | 2 ostaju na točno istoj adresi; 16 kanonskih 301 (završni `/`); 8 sadržajnih preseljenja 301 |
| IT/HR sadržajne ili poslovne odluke |     50 | Kandidati i razlozi su zabilježeni, ali HTTP status i cilj u CSV-u ostaju prazni             |
| Dostupne DE/EN/SI stranice          |    105 | Nema novih prijevoda; odluka o očuvanju ili izradi prije migracije                           |
| Stare nedostupne adrese             |     25 | U starom inventaru HTTP 404; ne pretvarati automatski u 301 ili 410                          |

**Zbroj: 206.** Prazna polja znače otvorenu odluku, ne preusmjeravanje na
naslovnicu. `http_status` je predloženi budući odgovor na **točnu** staru
adresu, ne trenutačno izmjereni status. Zato i zadržana stranica bez završnog
`/` ima prijedlog 301 prema svojoj kanonskoj verziji. Svi `test_status` zapisi
počinju s `proposal-only`; nijedan ne tvrdi da je redirect objavljen ili
provjeren na budućem produkcijskom serveru.

## Osam sadržajnih preseljenja za potvrdu

| Stara putanja                | Predloženi novi cilj                    |
| ---------------------------- | --------------------------------------- |
| `/alloggio`                  | `/informazioni/alloggio/`               |
| `/accommodation`             | `/informazioni/alloggio/`               |
| `/prima-visita`              | `/informazioni/prima-visita-gratuita/`  |
| `/pagamento`                 | `/informazioni/pagamento-flessibile/`   |
| `/garanzie`                  | `/informazioni/garanzie/`               |
| `/laboratorio-odontotecnico` | `/su-di-noi/laboratorio-odontotecnico/` |
| `/trasferta`                 | `/informazioni/trasporto/`              |
| `/hr/testimonials`           | `/hr/iskustva-pacijenata/`              |

Namjena ovih stranica ostaje ista; to nije potvrda identičnih cijena,
bankovnih podataka ili pravnih uvjeta. Posebno provjeriti informacije za
ranije pacijente na stranici jamstava: stari tekst navodi konkretne rokove.
Odobrenje mape ne mijenja uvjete već obavljenih radova.

## Odluke o sadržaju, ne automatske redirekcije

| Skup starih stranica                              | Kandidat / preporučeni sljedeći korak                                                                                                                                 |
| ------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| All-on-4                                          | Pregledati novi **fiksni most**, ne protezu s locatorima na 4 implantata. Broj implantata nije dokaz iste konstrukcije.                                               |
| Proteza na implantatima                           | Kandidat je nova proteza na 4 implantata, ali stari opis govori o 2/4 implantata i prečki, novi o locatorima. Potrebna stručna odluka.                                |
| Krunice, ljuskice i pojedini mostovi              | Nova skupna stranica ima srodne odjeljke. Potvrditi pokrivenost pojedinačnih indikacija; parcijalne mostove ne slati na paket za cijelu čeljust.                      |
| Mostovi za cijelu bezubu čeljust                  | Kandidat je novi paket fiksnog mosta; razlikuju se materijali, konstrukcija i tijek. Bez automatskog 301.                                                             |
| Teleskopske, metalne i kombinirane proteze        | Opći odjeljak proteza nije sam po sebi zamjena za svaki poseban postupak. Očuvati ili dopuniti sadržaj uz odobrenje.                                                  |
| Izbjeljivanje                                     | Stari tekst naglašava ordinacijski zahvat u 45 minuta; novi kućno izbjeljivanje. HR putanja je već ista, ali sadržajna razlika ostaje. IT kandidat zahtijeva potvrdu. |
| Opća implantologija                               | Novi članak o implantatima nove generacije nije potpuna zamjena za opće informacije i upute nakon zahvata.                                                            |
| CEREC/tehnologija                                 | Novi sadržaj podijeljen je na materijale/opremu i laboratorij. Odabrati primarni cilj nakon provjere sadržaja i prometa.                                              |
| Sterilizacija, bruksizam, inlay, produženje krune | Nema dokazano potpune zamjene. Razmotriti očuvanje zasebnih edukativnih stranica. Puko spominjanje u cjeniku nije ekvivalent.                                         |
| Hrvatska/Rijeka                                   | Stari vodič nije automatski ekvivalent novoj FAQ zbirci; pregledati zastarjele turističke informacije.                                                                |
| Prijave, kampanje i zahvale                       | Prvo dogovoriti aktivne oglase, stvarno slanje/privitke, privole i konverzije. Ne prikazivati zahvalu bez uspješnog upita.                                            |

Za svaki pojedini URL razlog je u CSV-u; konkretni tematski kandidati su u
`data/seo/redirect-groups.json`. Kandidati nisu upisani kao odobreni ciljevi.
Za stranice bez zamjene 410 je samo moguća **naknadna** odluka, nikad zadani
ishod ovog prijedloga. DE/EN/SI ne preusmjeravaju se na drugi jezik.

## Posebne opasnosti pri objavi

- Stari `/hr/iskustva-pacijenata` vodi na `/hr/testimonials`. Taj stari smjer
  ukloniti prije uključivanja suprotnog 301, inače nastaje petlja.
- Stari `/hr/` završava na `/hr`. Buduća kanonska adresa je `/hr/`: ukloniti
  staro pravilo skidanja završne kose crte. Isto provjeriti na budućem hostu
  za sve putanje i njihove obje varijante.
- `/accommodation` već završava na `/alloggio`. Oba stara ulaza trebaju
  voditi **izravno** na novi cilj, bez dva ili tri skoka.
- Upitne parametre, uključujući `utm_*`, `gclid`, `fbclid` i ponovljene
  parametre, sačuvati bez prepisivanja/dekodiranja. Ovaj podatkovni prijedlog
  nema server resolver; očuvanje queryja još nije testirano na hostingu.
- Zadržati `/`, `/hr/`, `/de/`, `/en/`, `/si/`; nema `/it/`, `/sl/`, IP/browser
  preusmjeravanja ni masovnog preusmjeravanja na naslovnicu.
- Prije konačne odluke dodati Search Console, backlink i log izvore,
  query-varijante i postojeću konfiguraciju servera. Inventar nije dokaz
  svih indeksiranih, povijesnih ili oglasnih URL-ova.

## Ponovljivost i provjere

- `data/seo/redirect-groups.json`: ručno pregledane grupe, razlozi i kandidati.
- `npm run proposal:redirects`: deterministički proizvodi neutralni CSV;
  `npm run proposal:redirects -- --check` provjerava da nije ručno odlutao.
- `npm run audit:redirects`: potvrđuje svih 206 sačuvanih SHA-256, izdvaja
  76 IT/HR isječaka te GET-om provjerava 38 lokalnih ciljeva/kandidata.
  Ne izvršava izvorni JS, ne šalje obrasce i ne dohvaća ponovno javni web.
  Cache mora postojati; ako nedostaje, prvo napraviti zaseban novi inventar
  i pregledati razliku, ne tvrditi da je stari izvor ponovno potvrđen.
- `data/seo/redirect-target-evidence.json`: isječci, datumi i hashovi koji
  povezuju pregled s konkretnim izvorima i ciljevima. Isječci nisu automatski
  dokaz medicinske ekvivalencije niti puni tekstovi članaka.
- `npm run test:redirects`: pokrivenost, jedinstvenost, reproducibilni CSV,
  postojeći ciljevi, isti jezik, bez lanaca/petlji u **prijedlogu**, zaštita
  neriješenih adresa i poznatih aliasa te podudarnost dokaza s verzijom mape.

Nije izmijenjen nijedan runtime route, `_redirects`, `.htaccess`, robots,
DNS ni konfiguracija hostinga. CSV se ne učitava u aplikaciju/deploy.
Završne 301/410, query i slash provjere na pravom serveru ostaju obvezne
nakon potvrde sadržajnih odluka i hostinga.
