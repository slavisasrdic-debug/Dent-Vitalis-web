# DentVitalis projektna načela

Ove upute vrijede za cijeli repozitorij.

- GitHub repozitorij je jedini izvor istine. Sve izmjene moraju biti jasne, pregledive i commitane.
- Binarne datoteke prema `.gitattributes` verzioniraju se kroz Git LFS. Prije rada u novom checkoutu izvršiti `git lfs pull`; prije pusha provjeriti LFS objekte i izuzeće izvornih ZIP-ova. Raspakirane reference ne ignorirati niti mijenjati njihove bajtove. Postupak obnove je u `docs/source-versioning-proposal.md`.
- Codespaces je razvojno okruženje. Ne pretpostavljati produkcijske pristupe, zaporke, API ključeve, DNS, hosting ili deployment.
- Ne izmišljati medicinske podatke, cijene, kontakte, bankovne podatke, kvalifikacije liječnika, recenzije, reference, fotografije ni prijevode.
- Ne kopirati Webflow HTML, CSS i JavaScript u produkcijski kod.
- Prije većih odluka o sadržaju, SEO-u, URL-ovima, schema podacima ili redirekcijama iznijeti pretpostavku i tražiti potvrdu.
- Vizualna vjernost Webflow referenci je obvezna, ali kod mora ostati čist, komponentan i održiv.
- Svaka nova komponenta mora imati jasnu odgovornost i ne smije duplicirati sadržaj ili poslovna pravila.

## Tehnički temelj

### Preview na početku svake radne sesije

- Prije ostalih zadataka provjeriti razvojni server na `0.0.0.0:4321`. Ako ne radi, pokrenuti ga u postojećem Astro projektu; ako radi, ne pokretati drugu instancu niti prebacivati preview na drugi port.
- Po korisničkom odobrenju razvojni Codespaces port **4321 mora biti public**, kako korisnik može pratiti rad. Provjeriti postoji li prosljeđivanje porta; nakon prekida/restarta obnoviti ga prema postupku u README-u.
- Potvrditi HTTP 200 i stvarnu DentVitalis stranicu na vanjskom preview URL-u, ne samo otvoren lokalni port. Korisniku odmah dati funkcionalni link prije nastavka duljeg rada. Ako obnova nije moguća, odmah jasno prijaviti točan problem.
- Server i potrebno prosljeđivanje ostaviti aktivnima tijekom rada i nakon predaje rezultata. Ovo odobrenje vrijedi samo za razvojni preview, ne za produkcijsku objavu, DNS, hosting ili slanje obrazaca.
- Korisnik je 2026-09-08 odobrio automatsko pokretanje previewa pri otvaranju Codespacea. `.devcontainer/devcontainer.json` poziva `scripts/ensure-preview.sh` pri startu i ponovnom spajanju; isti postupak ručno pokreće `npm run preview:ensure`. Skripta ne duplicira server, ne mijenja druge portove i provjerava lokalni i vanjski HTTP 200, DentVitalis sadržaj i `noindex`. Logovi i lock su u ignoriranom `.astro/preview/`.
- Nova devcontainer konfiguracija u postojećem Codespaceu zahtijeva jednokratni **Rebuild Container**; ne tvrditi da je lifecycle automatizacija aktivna dok konfiguracija nije primijenjena. Do tada asistent i dalje sam pokreće provjeru na početku sesije. Ne raditi rebuild usred pregleda bez najave; zatvoren/zaustavljen Codespace ne može posluživati preview. Bez commita/pusha konfiguracija još nije dostupna u novom Codespaceu.

### Komponente i implementacija

- Partiali imaju tri razine: layout/SEO okvir, zajedničke tipizirane komponente i sekcijske home kompozicije. Detaljna mapa propsa, varijanti i potrošača je u `docs/astro-component-map.md`.
- Prije proširenja komponente provjeriti svih 28 sastava u prihvaćenom handoffu; proposed Webflow nazivi nisu automatske Astro granice. Stvarne responsive/crop/spacing razlike definirati varijantom.
- Mobilni prikaz nije pretpostavljeno isti sadržaj s drugim stilom. Za svaku stranicu zasebno provjeriti desktop/mobile fotografije, prisutnost elemenata i redoslijed. Različite assete i sadržajne kompozicije modelirati izričitim varijantama/propsima; ne svoditi ih automatski na crop iste slike ili skrivanje proizvoljnog elementa.
- Poslovne vrijednosti su u `data/site.ts`; transkripcija reference sa statusom review nije produkcijsko odobrenje. Sadržaj i linkove prosljeđivati propsima/slotovima, ne duplicirati poslovna pravila u prikazu.
- Interakcije ograničiti na root instance, koristiti jedinstvene ID-eve i guard za inicijalizaciju. Page-specific directory animacije nikad ne smiju zahvatiti home.
- Nakon izmjene shared komponente provjeriti sve izrađene potrošače/varijante; viewport screenshotove sticky sekcija uspoređivati pri istom scrollu. Uspješan build nije dokaz vizualne jednakosti.

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

- Font nije potvrđen samo zato što `font-family` i `document.fonts.check()` navode Montserrat. Za svaku korištenu težinu/stil provjeriti stvarne glifove ČĆŽŠĐ/čćžšđ i font kojim su iscrtani. Latin i Latin Extended podskupovi moraju pripadati istoj izvornoj verziji; proširenje ne smije neprimjetno zamijeniti postojeće latinične glifove ili izazvati sintetizirane/fallback znakove.
  - Uz postojeće statične Latin faceove Latin Extended deklarirati zasebno za svaku istu težinu; jedan preklapajući variable raspon `300 800` može spriječiti odabir Latin facea. Regresija mora provjeriti oba podskupa stvarnim browser font tracingom (`tests/fonts.spec.ts`), ne samo dijakritike.

## Animacije i interakcije

Vizualno reproducirati odobrene Webflow animacije, ali najmanjom mogućom količinom koda.

- Scroll reveal animacije iz reference izraditi kao jednu ponovno iskoristivu Astro komponentu: opacity i blagi translate, aktivirano `IntersectionObserver`om.
- Reveal animacije aktiviraju se pri ulasku u viewport i nakon prikaza ostaju vidljive, kao u trenutačnoj Webflow referenci.
- Zabranjen je početni bljesak „vidljivo → skriveno → animacija”. Zajednički `RevealSetup` u `<head>` mora pripremiti početno stanje prije prvog iscrtavanja; ne skrivati već prikazan sadržaj tek u odgođenom JS-u. Bez JS-a, uz reduced-motion ili nakon isteka sigurnosnog roka sadržaj ostaje vidljiv, a kasno učitana skripta ne smije ga ponovno sakriti. Novi reveal potrošači koriste isti mehanizam. Provjeravati hladno učitavanje, usporenu/neuspjelu skriptu i prve frameove, ne samo završni screenshot.
- Svi reveal ulazi (slide/fade/grow/card) koriste jedno trajanje `--reveal-duration: 1000ms`, jednako velikim naslovima; ne uvoditi zasebno trajanje po kartici. Ostali interakcijski prijelazi (menu, FAQ, video, desktop sticky/fade) nisu reveal ulazi i zadržavaju vlastite parametre.
- Zajednički reveal parametri (trajanje, pomak, odgoda, prag ulaska, grow skala i easing) uređuju se samo u motion bloku `src/styles/tokens.css`, ne kao brojke u initializeru ili zadanim propsima. `Reveal` props `delay`/`offset` služe samo eksplicitnim iznimkama. `--reveal-card-*` je dogovorena varijanta; nove razlike uvoditi samo namjerno i dokumentirati ih u mapi komponenti.
- Pri čitanju CSS vremenskih tokena podržati i `ms` i `s`: minifier može pretvoriti `1000ms` u `1s`. Običan `parseFloat` bez pretvorbe jedinice skraćuje animaciju. Observere inicijalizirati tek kada su CSS tokeni dostupni (WebKit može pokrenuti modul prije stylesheet loada), uz postojeći fail-open rok. Provjeriti stvarno trajanje i prag ulaska u statičkom buildu.
- Mobilne teaser/directory kartice (usluge, Su di noi, Informazioni) dijele `Reveal` profil `card` i `--reveal-card-*` tokene: 48px, bez vremenske odgode, okidanje kada vrh kartice uđe 15% visine viewporta od donjeg ruba (`--reveal-card-offset`). `TeaserCard` ga uključuje zadano do 991px. Buduće liste koriste isti profil uz vlastitu geometriju; ne duplicirati animacijski kod niti istodobno animirati roditeljsku sekciju na mobitelu. Desktop sticky/fade ponašanje ostaje zasebno.
- Sadržaj mora ostati vidljiv i čitljiv ako JavaScript nije dostupan.
- Poštovati `prefers-reduced-motion`: sadržaj se odmah prikazuje bez kretanja.
- Ne koristiti animacije koje uzrokuju layout shift, skrivaju važan sadržaj ili usporavaju početno učitavanje.
- Hover/focus navigacije ne smije mijenjati širinu teksta, prijelome, visinu redaka ni područje za klik. Pomak raditi transformom unutarnjeg sadržaja uz prostor unutar panela, ne animiranjem margina/paddinga. Provjeriti najduže stavke na obje strane breakpointa, fokus tipkovnicom i dodirnu varijantu.
- Ne koristiti GSAP za obične fade-in/reveal efekte.
- Donji sticky CTA do 991px animira samo tekst i ikonu, ne podlogu, hitbox ili fokusni obrub. Zajednički `ContactWidgets` koristi `--sticky-cta-*` tokene i korisnički ritam dva blinka po 1s + 5s mirovanja, s prvim fade-inom. Efekt je CSS-only, odvojen od reveal trajanja; reduced-motion i fokus/pritisak prikazuju sadržaj bez treptanja. Ne proširivati taj efekt na sve `consultation` gumbe ili header.
- Prije izrade svake složenije animacije provjeriti Webflow referencu na desktopu i mobitelu.

## Funkcije koje arhitektura mora podržati

1. Desktop i mobilna navigacija s dropdown izbornicima za Prestazioni, Su di noi i Informazioni.
2. Jezični odabir za IT, HR, DE, EN i SI.
3. Zajednički kontaktni obrazac: ime, prezime, e-mail, telefon, poruka, upload dokumenta ili fotografije, privacy privola i tracking izvora upita.
4. Upload mora kasnije ograničiti vrstu i veličinu datoteka te imati sigurnu serversku obradu. Ne implementirati backend bez odluke.
5. WhatsApp chat widget s centraliziranim i potvrđenim brojem.
6. Naslovnica ima lokalne autoplay, muted i loop video elemente za desktop i mobitel. Koristiti `playsinline`, poster gdje je potreban i ne kvariti LCP.
   - Hero video mora imati tri sloja: tamnoplavu `--color-primary` podlogu, optimiziranu fotografiju stvarnog prvog kadra izvornog videa i video koji postaje vidljiv tek nakon dekodiranog kadra. Poster ostaje ispod videa; ne dopustiti sivo/crno prazno polje, ni uz sporu vezu, no-JS, reduced-motion ili odbijen autoplay. Preload i responsive izvor moraju koristiti isti mapping i media uvjet; ne preuzimati neaktivni desktop/mobile video. Izvedenice i SHA-256 mapping reproducirati iz sačuvanih originala.
   - Na svakom odgođenom video callbacku (playing, play promise, dekodirani kadar/rAF) ponovno provjeriti vidljivost, aktivni media uvjet i reduced-motion. Ako reprodukcija više nije dopuštena, pauzirati video; samo preskakanje vizualnog otkrivanja kadra nije dovoljno. Provjeriti i brzi scroll-away → return → reduced-motion.
7. Naslovnica ima slider svjedočanstava s tri slajda, strelicama, točkama i swipe podrškom; nije autoplay.
8. FAQ koristi pristupačne harmonike koji rade tipkovnicom.
9. Kontakt stranica ima Google Maps prikaz i jasnu link alternativu prema karti.
10. Stranica svjedočanstava koristi laganu click-to-load YouTube komponentu. Ne učitavati svih 13 iframeova odmah; koristiti poster, naslov i pristupačan gumb te iframe učitati tek nakon interakcije ili pristanka ako cookie politika to zahtijeva.
11. Galerija tretmana koristi zajedničku prije/poslije kontrolu, izričito odobrenu korisničkim dodatkom: početnih 50/50, native range za povlačenje te „Prima”/„Dopo” za cijelu fotografiju. Sve instance moraju biti neovisne, podržavati dodir i tipkovnicu, ne blokirati vertikalni scroll i poštovati reduced-motion. Bez JavaScripta ostaje vidljiv statični prikaz, bez lažno aktivnih kontrola. Ne uvoditi lightbox bez posebne odluke.
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
