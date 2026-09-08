# Obvezna detaljna pravila projekta

Izdvojeno iz AGENTS.md 2026-09-08 bez ukidanja pravila. Učitati prema usmjeravanju u korijenskom AGENTS.md.

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

## Asseti i Webflow export

- `/source-assets/webflow-export/` — budući sirovi Webflow export; originalna imena datoteka moraju ostati sačuvana.
- `/source-assets/original-images/` — najbolje dostupne izvorne fotografije.
- `/public/assets/` — samo optimizirane produkcijske slike, fontovi i ostale datoteke.
- `/docs/` — arhitektura, SEO migracija, sadržajna pravila i kontrolne liste.
- `/data/` — strukturirani podaci, uključujući redirect tablicu.

Produkcijske slike moraju imati optimalne dimenzije, WebP/AVIF izvedenice, responsive `srcset` gdje je potreban i smislen alt tekst. Dekorativne slike moraju imati `alt=""`.

- Izvorne nazive datoteka sačuvati, ali segmente URL-a kodirati pri ispisu `src` i osobito `srcset`: neescapani razmak razdvaja URL od width descriptora. Provjeriti decode i browser upozorenja, ne samo HTTP odgovor osnovne slike.

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
- Header mora zadržati vlastiti Montserrat i čitljive `--header-nav-*` tokene neovisno o body fontu stranice. Puni meni je od 1200px; CSS svih header partiala, JS `desktopNavigationQuery` i no-JS prikaz moraju ostati usklađeni. Sadržaj i sticky CTA i dalje koriste 991/992px. Ne vraćati sitni 12px meni, negativne razmake ili neograničeni `vw` padding da bi više stavki stalo u red; provjeriti oba jezika i stvarne granice djece, ne samo container.
- Naziv zatvorene nav grupe na prvi klik/Enter otvara stavke, a naziv već otvorene vodi na stvarni parent URL; strelica uvijek samo otvara/zatvara. Vrijedi za sve jezike i širine. Hover reagira na stvarni miš (`pointerType`), ne na touch-emulirane mouse događaje. Sačuvati native child linkove, modificirane klikove i no-JS navigaciju.
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
