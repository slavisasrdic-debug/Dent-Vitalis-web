# Obvezna detaljna pravila projekta

Izdvojeno iz AGENTS.md 2026-09-08 bez ukidanja pravila. Učitati prema usmjeravanju u korijenskom AGENTS.md.

## Jezici i URL-ovi

Postojeća javna struktura jezika je obvezna i ne smije se mijenjati:

- Talijanski: `/`
- Hrvatski: `/hr/`
- Njemački: `/de/`
- Engleski: `/en/`
- Slovenski: `/si/`

Talijanski je glavni jezik i mora ostati u rootu.

- Ne koristiti `/it/`, `/sl/` niti query parametre poput `?locale=` za javne jezične verzije.
- Primarni production host je `https://www.dentvitalis.com`.
- Svaka prevedena stranica mora imati vlastiti stabilni URL, pravilan `html lang`, canonical i recipročni hreflang.
- `x-default` vodi na talijansku početnu stranicu.
- Jezični odabir mora voditi na ekvivalentnu prevedenu stranicu kada ona postoji.
- Ako prijevod ne postoji, ne stvarati lažni hreflang par niti prikazivati drugu stranicu kao da je prijevod.
- Navigacija, breadcrumb, CTA-i i interni linkovi moraju ostati u aktivnom jeziku.
- Ne raditi automatsko preusmjeravanje prema jeziku browsera, IP adresi ili lokaciji korisnika.
- Odobrene HR putanje nalaze se u `data/hr-routes.proposed.csv` (status `approved`, potvrda 2026-09-08). Ostale buduće putanje i produkcijske redirekcije ne pretpostavljati.
- Svaki jezik lokalizira i alt tekst sadržajnih fotografija, ARIA/UI oznake, SEO i Open Graph tekstove. Dekorativni alt ostaje prazan. Nazivi izvornog asseta nisu alt tekst; ista fotografija dijeli datoteku, ne nužno opis. JSON-LD nastaje iz istih vidljivih lokaliziranih podataka, bez izmišljene medicinske provjere, datuma, ocjena ili posebnog „AI” skrivenog teksta.

## SEO, AEO i čitljivost za AI sustave

- Stranice moraju biti statički renderirane, semantičke i potpuno čitljive bez JavaScripta.
- Svaka indeksabilna stranica mora imati jedinstven title, meta description, canonical, Open Graph podatke i društvenu sliku.
- Heading struktura mora biti stvarna i uredna: jedan H1, potom logični H2 i H3, bez preskakanja razina.
- Sadržaj mora dati jasne, izravne odgovore na stvarna pitanja pacijenata.
- Ne koristiti skriveni SEO tekst, nabacane ključne riječi, umjetne FAQ-ove ni tvrdnje koje sadržaj ne dokazuje.
- Predvidjeti podatke za autora, medicinsku provjeru, datum zadnje izmjene, liječnika i izvore kada ih vrsta sadržaja zahtijeva.
- Automatski generirati sitemap. Produkcijski `robots.txt` mora dopuštati indeksiranje; preview okruženja moraju biti `noindex`.
- Izraditi stvarnu 404 stranicu koja vraća HTTP 404 status.
- Osigurati pravilan semantic HTML, pristupačne linkove, labele formi, fokus stanja i tipkovničku navigaciju.

## Schema.org

JSON-LD mora se generirati iz strukturiranih sadržajnih podataka i odgovarati stvarnoj vrsti stranice:

- `Dentist` / `Organization` i `WebSite` globalno
- `BreadcrumbList` na unutarnjim stranicama
- `Service` i `Offer` samo za potvrđene usluge i stvarno prikazane cijene
- `FAQPage` samo kada su identična pitanja i odgovori vidljivi na toj stranici
- `VideoObject` za stvarne video-testimoniale
- `Person` i stručni podaci za profile liječnika gdje je primjenjivo

Ne koristiti lažne `AggregateRating` podatke, recenzije, FAQ odgovore, cijene ili medicinske tvrdnje.

## Centralizirani sadržaj

Cijene, kontakt podaci, bankovni podaci, CTA tekstovi, usluge, FAQ, liječnici i informacije o klinici ne smiju biti duplicirani u komponentama.

- Predvidjeti sadržajne modele po jezicima tako da se promjena jednog podatka automatski koristi svugdje gdje je potreban.
- Sadržaj mora podržati status prijevoda po jeziku, kako se nikada ne bi slučajno objavio nepotpun ili pogrešno povezan prijevod.
- WhatsApp broj mora biti centraliziran i potvrđen prije objave. Nikada ne objaviti placeholder poput `+ADDNUMBERHERE`.

## Migracija i očuvanje SEO snage

Prije objave napraviti potpuni inventar postojećih indeksabilnih URL-ova javnog `dentvitalis.com` za svih pet jezika. Redirect podatke voditi u `/data/redirects.csv`, a postupak u `/docs/seo-migration.md`.

- Za stvarno ekvivalentan sadržaj koristiti 301.
- Nikada ne preusmjeravati sve stare URL-ove na početnu stranicu.
- Za uklonjeni sadržaj bez stvarne zamjene donijeti odluku između relevantne zamjene i 410 Gone.
- Sačuvati UTM i druge query parametre pri preusmjeravanju.
- Redirect logiku najprije držati kao neutralne podatke. Hosting-specifičan format radi se tek kada je produkcijski hosting poznat.
- Prije prijelaza automatizirano provjeriti sve redirecte, canonicale, hreflang, sitemap, robots i 404 odgovore.
- Prije objave napraviti visual regression provjeru nove verzije u odnosu na Webflow referencu na dogovorenim desktop i mobilnim širinama.
