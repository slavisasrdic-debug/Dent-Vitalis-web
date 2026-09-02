# DentVitalis projektna načela

Ove upute vrijede za cijeli repozitorij.

- GitHub repozitorij je jedini izvor istine. Sve izmjene moraju biti jasne, pregledive i commitane.
- Codespaces je razvojno okruženje. Ne pretpostavljati produkcijske pristupe, zaporke, API ključeve, DNS, hosting ili deployment.
- Ne izmišljati medicinske podatke, cijene, kontakte, bankovne podatke, kvalifikacije liječnika, recenzije, reference, fotografije ni prijevode.
- Ne kopirati Webflow HTML, CSS i JavaScript u produkcijski kod.
- Prije većih odluka o sadržaju, SEO-u, URL-ovima, schema podacima ili redirekcijama iznijeti pretpostavku i tražiti potvrdu.
- Vizualna vjernost Webflow referenci je obvezna, ali kod mora ostati čist, komponentan i održiv.
- Svaka nova komponenta mora imati jasnu odgovornost i ne smije duplicirati sadržaj ili poslovna pravila.

## Tehnički temelj

- Koristiti Astro sa strogim TypeScriptom i statičkim outputom.
- Prednost imaju native Astro komponente i organizirani obični CSS s varijablama/tokenima.
- Ne uvoditi React, Vue, Tailwind, GSAP, veliki UI framework ni nepotrebne biblioteke bez konkretnog razloga i prethodnog objašnjenja.
- Webflow export služi samo kao referenca za sadržaj, strukturu i assete; nikada nije baza produkcijskog koda.
- Postojeći javni web i Webflow ostaju aktivni dok nova verzija nije potpuno provjerena.
- Ne objavljivati web i ne mijenjati DNS, hosting, domenu, Google Search Console, Analytics ni produkcijske forme bez izričitog naloga.

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
- Detaljni budući URL-ovi usluga i podstranica još nisu odlučeni. Ne pretpostavljati ih.

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

## Asseti i Webflow export

- `/source-assets/webflow-export/` — budući sirovi Webflow export; originalna imena datoteka moraju ostati sačuvana.
- `/source-assets/original-images/` — najbolje dostupne izvorne fotografije.
- `/public/assets/` — samo optimizirane produkcijske slike, fontovi i ostale datoteke.
- `/docs/` — arhitektura, SEO migracija, sadržajna pravila i kontrolne liste.
- `/data/` — strukturirani podaci, uključujući redirect tablicu.

Produkcijske slike moraju imati optimalne dimenzije, WebP/AVIF izvedenice, responsive `srcset` gdje je potreban i smislen alt tekst. Dekorativne slike moraju imati `alt=""`.

Najveće dostupne fotografije iz Webflow exporta koristit će se kao izvor za sve optimizirane izvedenice. Ne povećavati fotografije iznad stvarne rezolucije.

## Animacije i interakcije

Vizualno reproducirati odobrene Webflow animacije, ali najmanjom mogućom količinom koda.

- Scroll reveal animacije iz reference izraditi kao jednu ponovno iskoristivu Astro komponentu: opacity i blagi translate, aktivirano `IntersectionObserver`om.
- Reveal animacije aktiviraju se pri ulasku u viewport i nakon prikaza ostaju vidljive, kao u trenutačnoj Webflow referenci.
- Sadržaj mora ostati vidljiv i čitljiv ako JavaScript nije dostupan.
- Poštovati `prefers-reduced-motion`: sadržaj se odmah prikazuje bez kretanja.
- Ne koristiti animacije koje uzrokuju layout shift, skrivaju važan sadržaj ili usporavaju početno učitavanje.
- Ne koristiti GSAP za obične fade-in/reveal efekte.
- Prije izrade svake složenije animacije provjeriti Webflow referencu na desktopu i mobitelu.

## Funkcije koje arhitektura mora podržati

1. Desktop i mobilna navigacija s dropdown izbornicima za Prestazioni, Su di noi i Informazioni.
2. Jezični odabir za IT, HR, DE, EN i SI.
3. Zajednički kontaktni obrazac: ime, prezime, e-mail, telefon, poruka, upload dokumenta ili fotografije, privacy privola i tracking izvora upita.
4. Upload mora kasnije ograničiti vrstu i veličinu datoteka te imati sigurnu serversku obradu. Ne implementirati backend bez odluke.
5. WhatsApp chat widget s centraliziranim i potvrđenim brojem.
6. Naslovnica ima lokalne autoplay, muted i loop video elemente za desktop i mobitel. Koristiti `playsinline`, poster gdje je potreban i ne kvariti LCP.
7. Naslovnica ima slider svjedočanstava s tri slajda, strelicama, točkama i swipe podrškom; nije autoplay.
8. FAQ koristi pristupačne harmonike koji rade tipkovnicom.
9. Kontakt stranica ima Google Maps prikaz i jasnu link alternativu prema karti.
10. Stranica svjedočanstava koristi laganu click-to-load YouTube komponentu. Ne učitavati svih 13 iframeova odmah; koristiti poster, naslov i pristupačan gumb te iframe učitati tek nakon interakcije ili pristanka ako cookie politika to zahtijeva.
11. Galerija tretmana je statični vizualni grid; ne uvoditi lightbox bez posebne odluke.
12. Sve interakcije moraju raditi na mobitelu, tipkovnici i bez nepotrebnog JavaScripta.

## Migracija i očuvanje SEO snage

Prije objave napraviti potpuni inventar postojećih indeksabilnih URL-ova javnog `dentvitalis.com` za svih pet jezika. Redirect podatke voditi u `/data/redirects.csv`, a postupak u `/docs/seo-migration.md`.

- Za stvarno ekvivalentan sadržaj koristiti 301.
- Nikada ne preusmjeravati sve stare URL-ove na početnu stranicu.
- Za uklonjeni sadržaj bez stvarne zamjene donijeti odluku između relevantne zamjene i 410 Gone.
- Sačuvati UTM i druge query parametre pri preusmjeravanju.
- Redirect logiku najprije držati kao neutralne podatke. Hosting-specifičan format radi se tek kada je produkcijski hosting poznat.
- Prije prijelaza automatizirano provjeriti sve redirecte, canonicale, hreflang, sitemap, robots i 404 odgovore.
- Prije objave napraviti visual regression provjeru nove verzije u odnosu na Webflow referencu na dogovorenim desktop i mobilnim širinama.
