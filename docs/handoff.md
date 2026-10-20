# Handoff — aktualni status i povijest

## V26 javna provjera widgeta i namjerni scroll 20. listopada 2026.

cPanel agent prijavio je instalirani V26 i 142/142 produkcijskih/backup hashova.
Javni manifest neovisno potvrđuje V26. Nakon zabrinutosti zbog nedostupnog
widgeta javni browser test potvrđuje rad CookieYes bannera, revisit ikone i
preference centra te WhatsApp nakon scrolla. Vlasnik je izričito potvrdio
da je on-scroll učitavanje namjerno podešeno u plugin/GTM integraciji.
Ne uklanjati lazy atribut ili mijenjati GTM/CookieYes radi neposrednog prikaza.
Lokalni prijedlog takve izmjene povučen je prije objave; V27 paket nije izrađen.
Runtime izvorni kod i testovi ostaju točno V26. Nije bilo produkcijskih izmjena,
slanja formi ili poruka niti brisanja server backupa. Nalaz i razlika između
stvarnog javnog stanja i browser-only eksperimenta su u
`docs/public-widgets-audit-20261020.md`. Pri daljnjim prihvatima provjeriti
stvarne widgete nakon potvrđenog okidača, a ne zahtijevati odmah vidljiv chat.

## Potpis Enter Internet i mobilni footer 20. listopada 2026. V26

Korisnik je odobrio lokalizirani vidljivi potpis izrađivača, brendiranu
`nofollow` poveznicu i preciznu Schema.org atribuciju. Dodatno je prijavio
da donji mobilni CTA prekriva završetak footera. Reprodukcija na 768/820/991px,
visina 500px, pri potpunom skrolu: footer padding 0, potpis završava oko
y=479, a CTA počinje na y=440. Na 390px već je postojalo 160px razmaka.
`WebsiteCredit.astro` sada taj donji razmak uz safe-area primjenjuje do 991px;
postojeći footer CSS, kontaktna traka, svi asseti i desktop ostaju isti.

`data/website-credit.ts` je zajednički izvor UI potpisa i Schema.org podataka.
`seo.ts` dodaje samo Organization s nazivom/URL-om/ID-jem Entera te
WebSite.creator i creditText; publisher ostaje Dentist DentVitalis.
Bez autorstva medicinskih tekstova, promjene schema usluga/ponuda/videa,
meta authora, skrivenih promotivnih tekstova, novih XML/AI datoteka ili JS-a.
Potpis ispod nepromijenjenog copyrighta je čitljiv bez JS-a, podcrtan i fokusabilan.

Read-only javni manifest 20.10.2026. potvrđuje V24
`20261015-cookie-position-v24`, commit `12ce667b13a550768efc0a48997defbd0aefbe32`.
To je jedini podržani baseline za V26; povučeni V25 se ne instalira.
Generator `scripts/package-website-credit-update.mjs` verificira V24 ZIP,
svih 142 HTML-a uspoređuje s dopuštenom transformacijom i zadržava izvorne
UUID-jeve. Jedini novi bajtovi su footer odlomak/inline CSS i schema atribucija.
141 HTML + manifest; 404 i svi ostali manifest zapisi ostaju nepromijenjeni.
Posebno se NE prepisuju XML i page-routes.json trenutnim build izvedenicama:
deployed sitemap.xml je raniji puni sitemap, dok build ruta daje sitemap index;
ova dorada ne mijenja njihovu strukturu, redoslijed ni bajtove na serveru.

Build 142 stranice, Astro check 323 datoteke bez dijagnostike, ciljani ESLint
i Prettier prolaze. Zajednički Playwright prolaz: 44 testa, dva workera,
uključuje cijeli `croatian.spec.ts`, 15 testova potpisa/no-JS i osam V24
CookieYes position regresija. Pet jezika na 390/1440, HR dodatno
768/820/991/992; naslov/URL/H1, bez framework overlaya, app console/pageerrora,
overflowa ili POST-a. Fokus i obična poveznica rade (odredište mockirano
u no-JS klik testu), kontaktni popup/Escape radi. Ovo nije ponovno slanje
upita/CRM test ni neovisna provjera živog Elfsight/CookieYes SDK-a.
Browser plugin/skill nije dostupan; korišten postojeći Playwright, bez instalacija.
Dodatno je stvarni produkcijski HTML iz `dist` (uz iste dist assete, presretnut
samo u testnom browseru bez novog servera) provjeren u Chromiumu i WebKitu
na 390×844, 820×390 landscape i 1440×900. Mobilni završetak potpisa ostaje
oko 121px iznad kontaktne trake pri potpunom skrolu; bez overflowa ili
pageerrora. Desktop footer padding ostaje 0. Šest provjera prolazi;
Chromium snimke `/tmp/dv-enter-credit-static-{390,820,1440}.png` pregledane.
To nije provjera na fizičkom iPhoneu niti tvrdnja o produkcijskoj objavi.

Nacrt zamjenskog članka za Enter je zasebno u
`docs/enter-dentvitalis-article-20261020.md`; NE ulazi u javni ZIP i nije objavljen.
Pročitan postojeći HR članak
https://www.enter-internet.com/uspjesne-price/dentvitalis i Enter naslovnica.
Sačuvane povijesne činjenice: prvi web/oglašavanje 2012., poslovno rješenje
2017., domaće/IT pa ostala EU tržišta i opseg dugogodišnje suradnje.
Jedini citat je postojeća kratka Šimina izjava, označena kao ranije objavljena,
ne kao nova ocjena redizajna. Stara tvrdnja o top 10 nije ponovljena bez
aktualne potvrde. Novi dio opisuje provjerljive mogućnosti weba na pet jezika,
usluge, galeriju, titlove i kontakt; nema tehnologija, implementacijskih i
marketinških postupaka, izmišljenih brojki rasta, novih citata ni ranking jamstava.

Za buduću zamjenu na Enteru zadržati postojeći URL članka i stvarni datum
prve objave; datum ažuriranja unijeti tek pri objavi. Predloženi SEO naslov:
`DentVitalis | Web i digitalna podrška klinici | Enter Internet`.
Predloženi opis: `Od prvog weba 2012. do novog nastupa na pet jezika: suradnja
Enter Interneta i DentVitalisa u izradi weba i digitalnoj komunikaciji klinike.`
Urednički nacrt traži korisnikov pregled prije objave na Enteru.

Pripremljeni update, nije uploadan ni objavljen:
`.astro/releases/dentvitalis-enter-credit-20261020-v26.zip`,
revision `20261020-enter-credit-v26`, source commit `f78bdab`.
ZIP 3.274.593 B, javni payload 13.779.997 B, 142 javne datoteke.
SHA-256 `2604194a9b9108fe5c14fe4ab65e1cc3fa687d831a3a997521229c17c0c47074`.
Receipt: `data/seo/website-credit-v26-release-20261020.json`.
README propisuje V24 baseline, svih 142 početnih/backup i novih hashova,
privatni backup `/home2/dentvita/backups/public-before-20261020-enter-credit-v26/`
(0700), pojedinačne zamjene HTML-a (0644), manifest posljednji i root 0750
bez rename-a. Backend/CRM, XML, routing, GTM i privole nisu u paketu.
Korisnik je ponovno izričito potvrdio odredište članka: isključivo Enter Internet.

## Najnovija dorada — CookieYes mobile ikona, 15. listopada 2026., V24

Javni manifest i dalje potvrđuje V22. Korisnik je uz pripremljeni V23 zatražio
podizanje CookieYes revisit ikone iznad mobilne kontaktne trake. Stvarni HR
public DOM potvrđuje `.cky-btn-revisit-wrapper.cky-revisit-bottom-left`,
ikonu 36px na bottom 8px i traku 60px. Preklapanje je reproducirano.
CSS iz `CookieConsentPosition.astro` primijenjen je SAMO u vlastitom testnom
public pregledniku: bottom 80px, ikona do y=764 i CTA od y=784 pri 390×844;
razmak 20px. Desktop 1440px zadržava bottom 15px. Stvarni CookieYes preference
centar ponovno otvoren/zatvoren nakon pomaka. U izoliranom profilu spremljene
su samo nužne postavke, bez prihvaćanja opcionalnih kategorija; administracija
CookieYesa/GTM-a nije uređivana. Web-forme i WhatsApp poruke nisu slane.

Nova komponenta u shared head-u sadrži samo označeni inline CSS, bez novog
asset zahtjeva, JS-a ili CMP instance. Media <=991px; donji lijevi/desni
CookieYes launcher bottom calc(80px + safe area) !important. Ne dira display,
z-index, left/right, veličinu, sadržaj, boje ili ponašanje privole. CTA ostaje isti.
Osam Chromium provjera prolazi: pet jezičnih homeova, 390/991/992/1440px,
naknadno ubačen real-class layout fixture, skrivanje ostaje učinkovito,
klik i kontaktni popup/Escape rade, nema overflowa/pageerrora ni lokalnih POSTova.
Fixture nije dokaz rada stvarnog SDK-a — zasebni public test iznad jest.
Dodatna WebKit provjera prolazi: bottom 80px pri 390px, izvornih 8px pri
992px na layout fixtureu; to nije tvrdnja o testu na fizičkom iPhoneu.
Browser plugin nije dostupan; korišten postojeći Playwright. Public prije/poslije
snimke u `/tmp/dv-cookie-revisit-before.png` i `...-after.png` vizualno pregledane.
Build 142 stranice, Astro check 319 datoteka i ciljani lint prolaze.

Paket `.astro/releases/dentvitalis-cookie-position-20261015-v24.zip` ZAMJENJUJE
pripremljeni V23: uključuje njegovo odobreno uklanjanje izravnog platform.js
taga. Ne vraćati ga radi chata; widget i dalje ovisi o drugom loaderu, ako postoji.
Paket ima 141 HTML + manifest; 404 i svi asseti ostaju isti. Svih 142 production
HTML-a uspoređeno s verificiranim V22/V23: samo novi označeni CSS blok i
već odobreno uklanjanje Elfsight taga; ostali bajtovi/UUID-jevi sačuvani.
Oba početna revisiona daju identičan finalni HTML. Podržani V22 ILI V23:
agent MORA koristiti `expectedBeforeSha256ByRevision[aktivniRevision]` za sve
izvornike, uključujući manifest. V22 default polje nije hash aktivnog V23.

Generator `scripts/package-cookie-position-update.mjs`; receipt
`data/seo/cookie-position-v24-release-20261015.json`. README propisuje novu
privatnu backup mapu 0700, svih 142 izvornih/novih hashova, svježu kvotu,
pojedinačne zamjene 0644 i manifest posljednji. Root 0750, bez rename-a ili
zamjene cijelog `_pages`. Backend/PHP/CRM, asseti, XML, redirecti, GTM/CookieYes
konfiguracija ne mijenjaju se. Povratak vraća stvarno početni V22 ili V23.
Produkcija ovom razvojnom doradom nije izmijenjena; javni prihvat radi agent.

## Najnovija dorada — uklanjanje Elfsight loadera, 15. listopada 2026., V23

Javni read-only manifest potvrđuje `20261012-navigation-text-v22`.
Vlasnik je izričito zatražio uklanjanje samo izravnog asinkronog
`https://elfsightcdn.com/platform.js` taga iz svih jezičnih stranica,
uz očuvanje widget divova/ID-jeva/lazy atributa i komentara. Jedna linija
uklonjena je iz zajedničkog `ElfsightWhatsApp.astro`, bez zamjenskog loadera.
No-JS izravni WhatsApp link, kontaktni popup, backend/CRM, GTM/CookieYes,
asseti, XML/routing i ostali sadržaj nisu dio izmjene.

Build 142 stranice, Astro check 316 datoteka i ciljani lint prolaze.
Svih 16 postojećih ciljnih WhatsApp regresija prolazi: svih pet widget
ID-jeva ostaje, nula lokalnih loader tagova/zahtjeva, nezavisni kontaktni
popup/Escape na 1440/390px, no-JS direktni link i legacy guard očuvani.
Nema pageerrora/neočekivanih konzolnih grešaka ni POST zahtjeva. Browser
plugin nije dostupan; korišten postojeći Playwright. HR desktop/mobilne
snimke u `/tmp/dv-elfsight-loader-v23-hr-*` vizualno su pregledane.
`scripts/package-elfsight-loader-removal.mjs` uspoređuje svih 142 finalnih
HTML-a s hash-verificiranim V22 bajtovima: samo jedan isti script tag manje
na 141 stranici; 404 nepromijenjen, svi generirani asset hashovi isti.
Paket gradi iz prethodnih verificiranih bajtova, pa čuva UUID-jeve i sve
ostale znakove/markup/skripte. Nema novih javnih asseta ili biblioteka.
Preview ostaje aktivan i noindex; produkcija ovim razvojnim radom nije mijenjana.

Paket `.astro/releases/dentvitalis-elfsight-loader-removal-20261015-v23.zip`:
141 HTML-a + manifest, očekivani stari/novi hashovi i privatni README.
Receipt: `data/seo/elfsight-loader-v23-release-20261015.json`.
Traži aktivni V22, svježu kvotu, backup 142 izvornika 0700, zamjenu samo
navedenih datoteka 0644 i manifest posljednji; root ostaje 0750, bez renamea.
README sadrži javne provjere i rollback samo tih izvornika.

Važno: div sam ne pokreće chat. Drugi izvor platform skripte nije potvrđen
ovom doradom i nije dodan. Ako GTM zasebno učitava loader, mrežni zahtjev
može ostati iako ga izvorni HTML više nema. Ne gasiti tagove niti obećavati
rad udaljenog widgeta bez drugog loadera. Forme/WhatsApp poruke ne slati.

## Najnovija dorada — navigacijski razmaci, 12. listopada 2026., V22

V21 je instaliran prema vlasnikovom izvještaju, svih 143 hashova potvrđeno.
Screenshot Google isječka otkrio je preostale spojene dropdown usluge;
verificirani V21 HTML potvrđuje da navigacijski linkovi nisu bili obuhvaćeni.
V22 dodaje samo njihove tekstualne razmake u svih pet jezika/sva tri dropdowna
i samostalnim glavnim nav linkovima, bez sadržajnih/JS/CSS/backend promjena.
Javni GET trenutačno vraća zaštitu, ne stvarni web; završni javni prihvat
obavlja cPanel agent. Opseg, QA, ZIP i ograničenje prostora:
[V22 evidencija](navigation-text-boundaries-20261012.md).

## Najnovija dorada — razdvajanje teksta, 8. listopada 2026., V21

Prema vlasnikovu izvještaju V20 je instaliran: svih 50 video zamjena,
reprodukcija/titlova i svih 16 server hashova potvrđeno; privatni backup 0700.
To ima prednost nad prethodnim zapisom o automatiziranoj YouTube blokadi.
Vlasnik je zatim odobrio ciljanu generalnu doradu HTML tekstualnih granica,
nakon spojenog telefona/e-maila u Google isječku. V21 dodaje samo razmake
u 142 HTML-a; nema promjene sadržaja, dizajna, schema, formi, CRM-a ili asseta.
Četiri unit testa i 24 Chromium geometrijske/interakcijske provjere prolaze;
svih 142 production HTML-a uspoređeno s instaliranim hash baselineovima.
V21 ZIP/receipt/privatni backup i javni prihvat:
[evidencija](html-text-boundaries-20261008.md). Produkcija se ovim radom ne mijenja.

## Najnovija dorada — video testimoniali, 7. listopada 2026., V20

V19 je instaliran prema vlasnikovu izvještaju; nema novih produkcijskih zahvata.
Vlasnik je zatim dostavio točnih deset video zamjena za svih pet jezika,
Lucilla Cecchini korekciju i caption parametre. Priprema se mali V20 update:
pet testimonial HTML-a, deset novih 1280×720 postera i manifest, bez
backend/CRM/form/GTM/Elfsight/redirect/XML promjena. Tri zadnja videa ostaju.
18 ciljnih Playwright provjera prolazi; svih 142 HTML-a uspoređeno s
verificiranim prethodnim bajtovima, samo odobrene video promjene.

YouTube automatizirani player blokira provjerom „niste bot”. Vlasnik je
sam kroz HR preview potvrdio reprodukciju prvog novog videa Lucille i
uključene hrvatske titlove; ne tvrditi da je potvrđeno svih 50 kombinacija.
Detaljni izvori/QA/paket/README i nastavak:
[video-update evidencija](testimonial-video-update-20261007.md).
Paket i receipt nazivi su navedeni ondje. Ne ponavljati testne upite klinici.

## Najnovija dorada — 7. listopada 2026., V19

Javni read-only manifest potvrđen kao `20261007-contact-address-v18`.
Korisnik je odobrio ispravak preostalih IT/HR footer adresa i oznaka karata.
IT: `Krešimirova 60, 51000 Rijeka (Fiume), Croazia`; HR:
`Krešimirova 60, 51000 Rijeka, Hrvatska`. DE/EN/SL su već ispravni.
Fizički/schema model (`Rijeka`, `HR`), sitemap/robots, metadata, kontaktni
odlomci, backend/CRM, forme, Elfsight i GTM nisu dio izmjene.

`scripts/package-footer-address-update.mjs` priprema
`dentvitalis-footer-address-20261007-v19.zip` iz SHA-256 verificiranih
V15/V16/V18 bajtova, samo 57 IT/HR HTML-a i manifest. Svih 142 HTML-a
uspoređuje s novim produkcijskim buildom; ranije form UUID-eve i sav ostali
kod čuva. Receipt s konačnim ZIP hashom je
`data/seo/footer-address-v19-release-20261007.json` nakon pakiranja.
README unutar ZIP-a sadrži precizan popis, privatni backup/rollback,
provjeru kvote i aktivnog V18, datoteke 0644, manifest posljednji.
Nikad ne zamjenjivati cijeli `_pages` niti preimenovati `public_html`.
Ova razvojna dorada nije produkcijska objava; postojeći javni V18 ostaje aktivan.

Provjere: Astro check 303 datoteke bez dijagnostike, ciljani lint/format,
9 izvornih sadržajnih testova i 11 Playwright Chromium provjera prolaze.
Kontakti svih pet jezika na 390/1440 px, bez overflowa/overlaya/pageerrora;
popup otvori/zatvori uz ispravan jezik, ništa nije poslano. IT/HR footer
snimke vizualno pregledane; Browser plugin nije dostupan, korišten postojeći
Playwright. Privremene snimke su u `/tmp/dentvitalis-footer-v19-*.png`.
Server quota/hashes i post-install javni prihvat ostaju obveza cPanel agenta.
Stariji migracijski statusi ispod su povijest, ne aktualna uputa.

## Aktualno za migraciju — 4. listopada 2026.

Jedina operativna procedura je [cPanel runbook](cpanel-migration-runbook.md),
uz statuse/dokaze u `data/migration-readiness.json`. Stariji prijedlozi niže
nisu uputa za ponavljanje završene provjere ili za produkcijsku aktivaciju.
GitHub ostaje izvor koda, produkcija na postojećem cPanelu; Pages je preview.

Vlasnik je 4. listopada odobrio šest sadržajnih 301, očuvanje tri postojeće
PHP stranice i `/vr_tour_eng.htm → /en` bez suprotne pojave. Neutralne odluke
su u `data/seo/cpanel-redirect-decisions.json`; izvorni aliasi dobivaju izravne
ciljeve. Priprema se lokalni `20261004-redirects-v2` paket iz provjerenog
`af6dc28-perms` builda: samo routing/manifest, bez promjene stranica, formi,
PHP backenda, GTM-a ili cPanela. Izvoz `redirects-candidate-20261004.csv`
ostaje snapshot PRETHODNOG paketa, ne popis novog odobrenog routinga.

Revizija je lokalno završena: `dentvitalis-web-production-candidate-20261004-redirects-v2.zip`,
57.909.892 B, SHA-256 `3e0ee5496a3379f56df1daf98a061e60bb06a699f5f6a642c528f7091cec9ba4`.
27/27 ciljanih provjera i izolirani Apache prolaze; lokalni Extract 0644/0755,
CRC i nepromijenjenih 690 payload hashova potvrđeni. Novi SEO popis je
`docs/seo/redirects-approved-20261004.csv`; detalji u
`data/seo/cpanel-routing-revision-20261004.json`. Produkcija nije dirana.
Koristiti samo novi privatni stage `20261004-redirects-v2`, uz provjeru
prostora/serverskog Extracta i bez preskakanja preostalih prihvata.

**Najnovije:** IT/DE/EN/SL TEST upiti poslani su po jednom 4. listopada,
12:20:38–12:20:43 UTC (14:20 Zagreb), nakon vlasnikova „krenimo”. Oznake:
`DV-MIG-20261004-{IT,DE,EN,SL}-122037Z`. Svaki je koristio svježe tokene iste
sesije, dobio 200 JSON `status:ok`, `no-store`, bez validacijskih grešaka,
uz jedan neutralni PDF od 640 B. Backend na cPanelu izvršava e-mail/CRM
slanje; Codespaces je samo uputio multipart `/send` na pravi www host.
Vlasnik je 4. listopada potvrdio „Stigli su emailovi”: prihvaćena je zajednička
potvrda primitka preostalih e-mailova, bez zasebnih screenshotova/neovisnog
mailbox pristupa. CRM zapisi i čitljivi privici još nisu potvrđeni.
Svih pet odobrenih POST-ova ukupno je izvršeno, bez retryja.
Ne slati novih pet niti ponavljati neki jezik bez nove izričite odluke.
Statusi/metadata u JSON-u; ne zapisivati kontakte/tokene ili raw odgovore.
Javni izgled/konfiguracija/DNS nisu mijenjani; ovo nije novi frontend/GTM test.

**Prethodno prihvaćeni HR:** vlasnik je odobrio pet označenih TEST upita (po jeziku) i jedan
bezopasni PDF; kontakt pošiljatelja nije pohranjen u repozitorij. Prvi HR POST
`DV-MIG-20261001-HR-152910Z` poslan je jednom, 15:29:10 UTC, kroz postojeći
backend sa svježim tokenima iste sesije, bez promjene primatelja/CRM-a.
640 B PDF je sintetički bez podataka pacijenta. Odgovor: 200 JSON `status:ok`,
`no-store`, bez vidljive PHP greške. Vlasnikov CRM screenshot od 2. listopada
potvrđuje ovaj lead/oznaku, HR, izvor Web, kontakte i TEST poruku. PDF link je
vidljiv, a vlasnik je zatim potvrdio da se CRM PDF otvara. Nije neovisno
provjeren njegov sadržaj/hash. Vlasnik je 2. listopada potvrdio primitak
e-maila i prikazao proslijeđenu poruku s
otvorenim PDF-om: točna TEST oznaka, odgovarajuće vrijeme i neutralni tekst.
HR inbox i e-mail PDF potvrđeni su vlasničkim dokazom, ne neovisnim mailbox
pristupom ili hashom preuzetog privitka. Screenshot/kontakti/mailbox adrese
nisu u repozitoriju. HR dostava i čitljivi privici sada su prihvaćeni.
Naknadni IT/DE/EN/SL poslani su kako je opisano iznad, bez auto-retryja ili switcha.
To nije end-to-end test novog frontend izgleda. Oznaka/metadata u JSON-u,
nikad kontakt ili vrijednosti tokena. Sljedeće: potvrditi CRM zapise i čitljive
privitke za preostala četiri jezika, bez ponavljanja HR-a ili bilo kojeg POST-a
i bez nove javne aktivacije.
Cloudflare Pages projekt nema custom domene prema vlasnikovu prikazu;
brisanje je blokirano brojem objava i nije završeno. Vlasnik je zatražio da
ga zasad ostavimo; ne ponavljati brisanje ili uvoditi novi pristup radi toga.

SEO kolega dobiva [CSV pravila stvarnog kandidata](seo/redirects-candidate-20261004.csv)
i [kratko tumačenje](seo/redirects-candidate-20261004-README.txt): 65 naslijeđenih
301 zapisa, 140 slash normalizacija 308, host obrasci, odobrena uklanjanja i
otvoreni rizici. To nije aktivacija niti runtime potvrda. Raniji inventar 206
URL-ova i proposal-only CSV ostaju zaseban izvor za dovršavanje sadržajnih odluka.

Prethodno je vlasnički odobrenu instalaciju dva privatna PHP dodatka i
minimalnog `/send` diffa agent je završio, read-back/`0644` potvrđeni prema
izvještaju. Kopija za povratak je
`/home2/dentvita/backups/php-before-delivery-v1-20261001/send.phtml`
(`0700` mapa / `0600` kopija; handler izvorno `0644`). Agentov Chrome blokirao
je token GET-ove `ERR_BLOCKED_BY_CLIENT`; uzrok nije utvrđen.
Neovisni Codespaces GET prihvat u 15:19:39 UTC prošao je: pet GET-ova 200,
neprazni JSON tokeni, `no-store`, isti GCT između endpointa, stabilan CSRF/GCT
i ista sesija, bez zapisivanja tokena/cookieja. Cookie ima Secure true,
HttpOnly false i SameSite nije eksplicitno naveden. Vlasnik je naknadno ručno
potvrdio obični Chrome GET `/form-tokens` (JSON s oba neprazna polja, bez blokade).
Zapisati samo rezultat, nikad token vrijednosti ili screenshot. Sigurnost/kompatibilnost
cookieja i end-to-end submit nove forme ostaju otvoreni. Tijekom tog GET
prihvata nije bilo POST-a; naknadni sintetički test je opisan iznad.
Javne aktivacije nema. PHP ekstenzije i CRM poslovni ugovor nisu time provjereni.
Privatni stage ostaje sačuvan; ne ponavljati instalaciju ili backup (vlasnik
je potvrdio lokalni integritet i dodatnu kopiju). Serverski source hashovi
nisu neovisno potvrđeni. Aktualni sljedeći korak je session pregled
i dovršetak već odobrenog prihvata ostalih jezika prije javnog uploada i switcha.

Prethodno je drugi browser agent završio read-only pregled stagea i formi.
Tada nije bilo instaliranih PHP token/upload dodataka; runtime/dostava nisu bili testirani,
legacy `ok` može prikriti neuspjelu dostavu. Lokalni dodaci odgovaraju javnom
manifestu; ne prepakirati javni web samo zbog njihove odsutnosti na serveru.
Vlasnik je zatražio objedinjavanje prije novih uploada: `-perms.zip` upload je
zasad zadržan. Redaktirani aktualni handler i Mail bool ugovor su pregledani;
nema jezičnih overrideova, `_send.phtml` ostaje netaknut. Pripremljen i lokalno
testiran je kirurgijski transport patch (SMTP bool/exception, cURL/HTTP/timeout,
503 + delivery_unconfirmed), bez promjene polja, ključeva ili primatelja.
SMTP true/CRM 2xx nisu dokaz inboxa/leada: poslovni CRM odgovor i stvarna
dostava još nisu potvrđeni. Naknadna instalacija je zabilježena iznad. Stari privatni ZIP ima
`0666` metadata i nije završni instalacijski paket. Prikaz prostora sada je
`978 MB / 1,46 GB`; server hash/inode/runtime/dostava i dalje otvoreni.
Detalji i aktualni sljedeći korak u runbooku i `preActivationReadOnlyReview`.
Mali privatni candidate `dentvitalis-private-backend-candidate-20261001-delivery-v1.zip`
je pripremljen: 4.977 B, 5 datoteka, CRC/hash/Extract 0644 potvrđeni lokalno,
bez handlera/konfiguracije/tajni. Kodni commit `25e0570`; veličina/hash u JSON-u.
Privatni stage i instalacija završeni su prema agentu; prvi odobreni sintetički
POST izvršen je naknadno kako je opisano iznad. Runtime prihvat privatne dopune
prethodi javnom uploadu/switchu uz zasebno odobrenje; ne ponavljati javni build.

Agent je potvrdio otvoreni **Manage API Tokens** (UI: API 2/UAPI) i 0 Git
repozitorija. Vlasnik je odobrio token, pohranu, test i nastavak migracije.
Browser agent je dovršio environment i token `dentvitalis-migration-20261001`,
s istekom 8. listopada u 23:59:59 prema cPanelu. GitHub zaštite neovisno su
potvrđene; vrijednost tokena nije dostupna ovoj sesiji. Run `36861772566` na
`44c2c9b` nije prošao transport, bez potvrđene autentifikacije/metapodataka.
Codespaces TCP test na 2083 timeouta prije TLS-a, ali točan uzrok na GitHub
runneru nije utvrđen. API automatizacija je pauzirana, bez ponavljanja testa
ili tokena. Sljedeći zadatak u runbooku: puni privatni backup i File Manager
stage izvan javnog weba, **bez aktivacije**. Odobrenje ne zatvara release gates.
Privatni backup `dentvitalis-full-files-20261001.zip` (224,79 MB prema cPanelu)
stvoren je prema agentu, uključujući `application/data`. Vlasnik je pokazao
lokalni ZIP istog naziva; naknadno je izričito potvrdio prolaz provjere integriteta
i dodatni backup. Prihvaćeno na temelju vlasnikove potvrde, ne neovisne lokalne
inspekcije. Restore nije izvedbeno potvrđen. Ne ponavljati CRC, download ili
backup bez konkretnog novog razloga. Vlasnik je naknadno odobrio upload/raspakiravanje samo u novi
privatni `/home2/dentvita/releases/20261001-af6dc28/`, bez prepisivanja datoteka
ili aktivacije. Taj stage može napredovati odvojeno od lokalne provjere backupa;
izmjene javnog weba/PHP-a i dalje čekaju zatvorene gates. Ne ponovno komprimirati
backup, ponavljati API/SSH ili zaobilaziti blokadu `chrome://downloads`.
Screenshot sada potvrđuje dovršen upload javnog ZIP-a `af6dc28` u tu privatnu
release mapu (zelenih 100 %, `55.26 MB complete`). Naknadni screenshot potvrđuje
Extract, vlasnik potvrđuje tri ključne datoteke u korijenu. Serverski hash nije
potvrđen. Ne ponavljati upload/Extract. Datoteke `0666` i mape `0777` potvrđene
su nalazom i lokalnim ZIP metadata; ispraviti na `0644`/`0755` samo unutar ovog
releasea prije aktivacije, bez symlinkova i promjena drugih direktorija.
Agent je potvrdio da File Manager nema rekurziju po vrsti; zatvorio je dijalog
bez promjena. Korijen je `0755`, sadržaj nije ispravljen. Ne ponavljati dijalog.
Pripremljen je novi `af6dc28-perms.zip`: svih 692 datoteke/manifest ostaju isti,
CRC i lokalni Extract potvrđuju datoteke `0644` i 13 mapa `0755`. Nema rebuilda.
Nakon dovršetka gornjeg backend plana browser agent nastavlja uploadom/Extractom u novoj privatnoj
`/home2/dentvita/releases/20261001-af6dc28-perms/`, bez prepisivanja stare mape;
serverske dozvole još nisu potvrđene. Hash/veličina i postupak u runbooku/JSON-u.
Chrome-only agent ne može lokalno provjeravati arhive. Lokalni integritet vlasnik
je potvrdio; ne ponavljati provjeru. Izvedbeni kodni povratak još nije potvrđen.
Raniji environment PUT ove integracije bio je 403; ne ponavljati ga.
Ovdje nema cPanel browser sesije/tokena. SSH stage je zaustavljen prije
povezivanja; ne tražiti SSH od hostinga kao uvjet. File Manager je ručni fallback,
upload i raspakiravanje su potvrđeni, ali korekcija dozvola nije. Symlink aktivacija nije potvrđena.

Novi frontend koristi `/form-tokens` za CSRF/GCT iste PHP sesije i `/send` za
postojeći e-mail/CRM backend; privatni dodaci su instalirani prema agentu,
GET token prihvat prošao neovisno. Preview ne šalje upite. Lokalni kandidat `af6dc28` nije dokaz stvarne
dostave. Lokalni ZIP starog weba bez `application/data` nije potpuni backup.
Puni privatni backup/povratak i odobrena stvarna provjera e-maila i CRM-a
ostaju preduvjeti aktivacije. Rutinske kodne objave čuvaju dvije prethodne
verzije, bez vraćanja privatnih podataka starom kopijom.

## Povijesni zapisi — novije datirane odluke imaju prednost

**2026-09-29 — aktualizacija pripreme.** Novi web ima IT, HR, DE, EN i SI
putanje. Statični obrazac na stvarnoj domeni sada uzima legacy `/gct` token,
šalje `/send` i koristi postojeće thank-you rute; na Pages/local previewu ne
šalje upite. `npm run release:prepare` radi build, provjeru ugovora obrazaca i
stvara ignorirani `dist/release-manifest.json` sa SHA-256 popisom releasea.
Detalji/rollback: [cpanel-migration-runbook.md](cpanel-migration-runbook.md).

**2026-09-29 — objava i forme.** GitHub je radni izvor. Cloudflare ostaje samo
razvojni prikaz i ukida se pri migraciji; produkcijska objava ide iz GitHuba na
cPanel server za `dentvitalis.com`. Prije svake objave na serveru se izrađuju i
provjeravaju najmanje dvije prethodne verzije izvan `public_html`. Statični build
ne smije pregaziti server-side `/send`: prije prijelaza treba ga pronaći,
sigurnosno kopirati i potvrditi primatelje, eventualni CRM, upload, `csrf` i
`gct` tok. Novi frontend već čuva determinističke parametre `url`, dupli
`form_agreement` (`0`/`1`), tracking polja i honeypot `company`; stvarna dostava
ostaje isključena do provjere legacy handlera. Detalji:
[form-delivery-migration.md](form-delivery-migration.md).

23. rujna — zaprimljeni su DE/EN/SL prijevodni DOCX izvori. Dodani su u Git LFS i iz njih su izrađeni lossless katalozi `data/translations/{de,en,sl}-source.json`; struktura i razlike dokumentirane su u [locale-translation-intake.md](locale-translation-intake.md). Jezici još nisu uključeni u javne rute, navigaciju ili hreflang; slijedi semantičko mapiranje prema HR modelu.

24. rujna — kartice naslovnice i skupnih stranica sada dijele eksplicitne `TeaserCard` tipografske tokene: naslov 28px/700, opis 18px/400, cijena 22px/500, uz zajednički Montserrat. Mobilni naslov i postojeći layout breakpointi ostaju isti; sadržaj i iznosi nisu mijenjani. Regresija uspoređuje HR/IT home i directory kartice.

25. rujna — cijene HR/IT: korisnik pojasnio da naslovnica treba veću cijenu kao cjenik, ne samo uklanjanje bolda, te da skupne stranice ne smiju zadržati staru veličinu. `TeaserCard` sada za `home` i `directory` koristi Montserrat 22px/500, kao cjenik; related kartice i iznosi ostaju nepromijenjeni.

26. rujna — standardiziran je prikaz bez rezanja riječi: zajednički linkovi, kontaktni redci/forma, breadcrumb i pravni tekst koriste `word-break: normal` i `overflow-wrap: normal`; prijelom se događa samo između cijelih riječi.

27. rujna — FAQ poveznice HR/IT: uklonjen je `word-break: break-all` iz zajedničke `.underlined` varijante, koji je na uskim ekranima mogao lomiti riječ „ovdje” između slova. Sada se riječi ne lome usred riječi; dugi kontaktni podaci zadržavaju vlastiti `overflow-wrap`.

28. rujna — na izričiti nalog korisnika vraćen izvorni PDF417 na HR i IT plaćanje, bez generiranja/promjene kodiranih podataka (uključujući izvornih 0,01 EUR). Prikazuje se neizmijenjena postojeća slika 512px, bez lošije 320px izvedenice. Uklonjen EPC QR generator i njegove upute; IT uvodni tekst vraćen iz izvornog članka. SWIFT ESBCHR22 i razmak prije € ostaju. Ova odluka zamjenjuje ranije odobrenje SEPA QR-a.

29. rujna — platni kod završen po novoj korisničkoj uputi: statični EPC/SEPA QR bez iznosa zamjenjuje IT PDF417 s 0,01 EUR i dodaje se na HR ispod bankovnih uputa. Isti kod, lokalizirane upute i vidljivi podaci, bez URL-a/posrednika/client skripti. Pojedinosti i sigurnosne granice: [payment-code.md](payment-code.md). Stvarne bankovne aplikacije treba zasebno provjeriti, bez uplate. Ova odluka ima prednost nad ranijim zapisima čekanja. IT hero cijena sada ima nerastavljivi razmak prije €, kao ostali prikazi; iznos nije mijenjan.

QA dopuna breadcrumb testa: očekivanje jednog retka vrijedi za IT plaćanje na 390px i dulju HR putanju na 767px; HR na 390px opravdano koristi dva retka. Ne smanjivati font radi prisilnog jednog retka.

15. rujna — nepotreban prijelom breadcrumb putanje: `li:last-child` imao je `flex-basis: 12rem`, zbog čega kratki naslov prelazi u novi red i kada ima mjesta. Zajednički `Breadcrumb` sada koristi `flex: 1 1 auto`, odnosno stvarnu širinu teksta, uz postojeći wrap/max-width i sigurni prijelom dugih naslova. Oba jezika; bez promjene fonta, naziva, linkova, guttera ili scroll-offset logike. Regresija: svi potrošači u `breadcrumb-alignment.spec.ts`, dodatna provjera jednog retka na HR/IT plaćanju pri 390px.

16. rujna — FAQ krunice: uklonjena samo druga točka nakon 220 € na IT naslovnici kroz `faq.ts`; izvorni `faq-it.json` nije mijenjan. Provjerena četiri prikaza (IT/HR home i FAQ): preostala tri odgovora već imaju jednu točku i ostaju nepromijenjena. Cijena i ostali tekstovi ostaju isti.

17. rujna — cijene naslovnice HR/IT: korisnik traži font kao na cjeniku. Zadržan zajednički Montserrat, a težina home teaser cijena i cjenovnog dijela hero H1 usklađena je na 500 kao `.content-paragraph.price` na cjeniku. Postojeće responsive veličine, raspored, iznosi, oznake valute i directory/related kartice nisu mijenjani.

18. rujna — provjera plaćanja: korisnik odobrio isti barkod za HR i usklađenje SWIFT-a s Erste bankom. HR sada koristi centralni `referenceBusiness.swift` ESBCHR22 kao IT (izvorni DOCX ZABAHR2X ostaje nepromijenjen). Erste potvrda: https://cdn0.erstegroup.com/content/dam/hr/ebc/www_erstebank_hr/gradani/downloads/stednja-i-investicije/investicije/Popis_trecih_osoba.pdf?forceDownload=1 . Lokalno očitan izvorni PDF417 preko zxing-cpp: HRVHUB30, EUR, iznos `000000000000001` (0,01 EUR), primatelj Dentvitalis Fides d.o.o., Krešimirova 60, Rijeka, IBAN HR1424020061100858111, model HR00, prazan poziv na broj, namjena OTHR, opis Ponuda/Preventivo. Nema SWIFT polja. IBAN se podudara s obje stranice; to nije bankovna potvrda vlasništva. HUB euro specifikacija: https://hub.hr/sites/default/files/inline-files/2DBK_EUR_Uputa_1.pdf . Zbog novootkrivenog iznosa 0,01 EUR dodavanje slike u HR zaustavljeno do odluke vlasnika; IT postojeći barkod nije mijenjan. Decoder instaliran samo u /tmp/dent-barcode-venv, bez nove projektne ovisnosti.

19. rujna: HR prvi pregled, odjeljak „Pregled i dijagnostika”: korisnik dostavio doslovnu zamjenu odlomka `t13.r2.c1.p2`. Pohranjena u `data/editorial-corrections.json:croatianFirstVisit`, primjenjuje se uz provjeru starog teksta. DOCX ostaje neizmijenjen, IT i ostali tekst nisu mijenjani. Zadatak koda za bankovne doznake i dalje čeka potvrdu uporabe IT slike na HR zbog zabilježene SWIFT razlike.

20. rujna: aktivni link u bijelom headeru (`.nav-link[aria-current]`) koristi Dentvitalis `--color-primary` plavu umjesto zelene. Zajednički HR/IT header; hoveri, gumbi i zelene oznake na plavoj podlozi nisu mijenjani.

21. rujna, dodatno usklađenje Mingione bloka: citat smanjen na 18px/500 u oba jezika i na svim širinama; atribucija i tri stavke ostaju 16px/400. Sve tri stavke imaju jednake crne točkice 5px, umjesto HR zelenih i IT izostavljenih oznaka. Tekst ostaje isti. Ovo zamjenjuje prethodne veličine citata 22/20px.

22. rujna: korisnik zatražio jedinstven font na skupnim stranicama Usluge/O nama/Informacije, kao home/detail. Uklonjen naslijeđeni Arial iz `body.reference-default`; koristi zajednički `--font-body` (Montserrat + njegov Extended podskup). Klasa ostaje zbog postojećih boja/podloge/težine; kartice zadržavaju svoje veličine i težine. Vrijedi za oba jezika, uključujući pravne stranice koje su već imale lokalni Montserrat. Ovo ima prednost nad povijesnim pravilom o Arial directory/body referenci.

23. rujna: korisnik odobrio naglašavanje izjave Manuela Mingionea na HR/IT specijalistima, uz manje nepodebljano ime, titule i tri stručne stavke. `specialistEndorsement` je SSR prezentacijska transformacija samo tog callouta; ne mijenja izvorni tekst ni schema podatke. Citat 22px/600 (mobile 20px), potpis i stavke 16px/400; zajednički stil oba jezika.

24. rujna: FAQ odgovor o prvom pregledu sada povezuje samo IT „Qui” na `/informazioni/prima-visita-gratuita`, odnosno HR „ovdje” na `/hr/prvi-pregled`. HR poveznica više ne obuhvaća cijeli odgovor. Izvorni tekstovi i ostale FAQ poveznice nepromijenjeni; transformacija izvan izvornog JSON/DOCX-a.

HR privacy: korisnik izričito potvrdio „Izbaci samo riječ Dječje”. Runtime mijenja samo naslov „Dječje Online Privacy Protection Act Compliance” u „Online Privacy Protection Act Compliance”. Odjeljak/odlomak ostaju, IT/COPPA ostaju netaknuti. Snapshoti i hashovi izvora nepromijenjeni; legal regresije dopuštaju samo ovu usku razliku.

HR `/hr/kontakt/`: korisnik izričito dostavio i odobrio novi odjeljak „Termini za liječenje i kontrole”: +385 51 688 381, booking@dentvitalis.com, WhatsApp +385 91 912 2071. Koristi postojeće `referenceBusiness.ongoingTreatment*` vrijednosti, `contact-card`/`contact-row` i native tel/mailto/wa.me linkove. Ovo ukida ranije izuzeće prazne HR tablice t30 samo za ovaj sada odobreni sadržaj; DOCX nije dopunjavan. Globalni WhatsApp za opće upite nije promijenjen.

HR detalj fiksnog mosta: korisnik screenshotom odobrio naslov/opis identične kartici usluge. `fixed-implant-bridge` sada koristi `t1.r3.c1.p3` i `t1.r3.c1.p5` umjesto `t3.r0.c1.p2`/`p4` za hero i iz njih izvedene meta podatke. „Premium paket”, cijena, sidebar, tijelo članka, fotografija i IT ostaju nepromijenjeni. Stari DOCX nije mijenjan.

HR home intro: korisnik zatražio „Velike uštede” zeleno i bold poput IT „Grandi risparmi”. `homeCopy.intro` izdvaja prve dvije riječi istog DOCX odlomka `t1.r1.c1.p3` u postojeći `SectionHeading.accent`; ostatak ostaje title. Nema novog CSS-a niti promjene teksta.

Welcome CTA „Fissa un appuntamento” i hrvatski par sada vode na `#contatti`, formu pri dnu iste naslovnice, na izričiti korisnikov zahtjev. Nema promjene teksta, dizajna ni popup/WhatsApp ponašanja. Regresija: `tests/welcome-contact.spec.ts`, IT/HR desktop/mobile klik, isti URL + hash, inline forma u viewportu.

**WhatsApp — korisnikov naknadni dodatak ima prednost:** zaglavlje sada prikazuje Jelenu i njezinu izvornu fotografiju, ne logo. IT podnaslov „Chiedi a nostro staff” i predstavljanje „Sono Jelena...” preuzeti su iz javne Elfsight konfiguracije; HR zadržava potvrđeni pozdrav i oznaku Dentvitalis bez izmišljanja funkcije. Izvor, asseti i QA: [whatsapp-panel.md](whatsapp-panel.md). Stariji opis logotipa u sljedećem odlomku opisuje prvu, zamijenjenu iteraciju.

WhatsApp sada implementiran na naknadni korisnikov „Ajde napravi da riješimo to”, kao odgovor na pitanje o zajedničkom IT/HR broju. Korištenje **385911100523** za oba jezika izričito je navedeno korisniku prije rada; nije izvučeno iz Zendesk konfiguracije. `data/site.ts` je jedini broj za widget. Panel ima plavo zaglavlje, postojeći logo, HR/IT poruke iz potvrđenog javnog chata i zeleni native wa.me link. Nema lažnog online statusa, badgea, osobe ili obećanja vremena odgovora. Ne učitava Elfsight/Zendesk/WhatsApp skripte niti šalje poruku; link se otvara tek korisnikovim klikom. Raniji chat zapisi niže povijesni su i ne označuju trenutačni status.

Najnovija dopuna: kontaktni linkovi na svih 55 IT/HR ruta i četiri pravna članka usklađeni su s potvrđenim izvorima. Korisnik je izričito odobrio zamjenu OBA IT pravna teksta aktualnim javnim tekstom nakon prijave sadržajnih razlika. HR tekstovi ostaju doslovno prethodno odobreni. Dokazi, iznimke, liste i postupak obnove u [legal-and-contact-audit.md](legal-and-contact-audit.md). Svi pravni članci sada koriste Montserrat; ovo ima prednost nad ranijim privacy-only pravilom o Arialu uvjeta.

FAQ pomicanje korisnik je naknadno izričito odobrio: `faq-scroll.ts` nakon završetka height animacija provjerava vidljivost summaryja i prvih 48px odgovora, koristi zajednički scroll-padding i donji mobile CTA. Pomak samo ako početak nije vidljiv; ne mijenja fokus/hash. Novi klik/ručno pomicanje poništavaju odgođenu korekciju. Zajednički `FAQ` pokriva oba jezika, home i detail; testovi `faq-scroll.spec.ts`. Povijesna istraga ispod opisuje stanje prije ove implementacije, ne aktualnu blokadu.

Chat: hrvatski public koristi Zendesk/Zopim preko GTM-a, ne Elfsight WhatsApp. Ranija provjera tražila je samo WhatsApp i propustila ovaj dodatak. Potvrđena HR poruka „Kako vam možemo pomoći?”, offline „Pošaljite poruku”; GTM sadrži i slovenski pozdrav „Kako vam lahko pomagamo?”. Iz toga nije potvrđen HR WhatsApp broj. Novi panel nije implementiran, postojeća chat UI ostaje nepromijenjena; ne izmišljati da Zendesk konfiguracija sadrži WhatsApp broj.

Rad dr. Ane: postojeći naslov u IT/HR profilu sada vodi na provjereni DOI `10.1111/clr.320_13042`, bez promjene biografskog teksta. Word ID-evi, izdavačev dokaz suautorstva, razlika između sažetka/e-postera i punog PDF-a te ograničenja dohvata dokumentirani su u [ana-beljan-research.md](ana-beljan-research.md). Izvorni IT `href="#"` zamijenjen je stvarnim linkom; HR naslov dobio je isti link.

Footer, 11. rujna: korisnik zatražio „Dentvitalis Fides”. Zajednički `data/site.ts:referenceBusiness.copyright` ispravljen iz „Dent Vitalis Fides” u „Dentvitalis Fides”, za HR i IT. Godina 2025, pravni tekstovi, kontaktni podaci i schema nisu mijenjani. Ovo je uska odobrena razlika prema referentnom footer tekstu.

FAQ istraga prije ove dorade: reproducirano da zatvaranje prethodnog dugog odgovora pomiče novo pitanje iznad viewporta, na HR FAQ-u i naslovnici, u Chromiumu/WebKitu te s animacijom i reduced-motion. Zajednički FAQ nema provjeru vidljivosti nakon promjene visine. Predložen uvjetni scroll ispod headera/breadcrumba samo ako pitanje/početak odgovora nisu vidljivi. **Popravak nije implementiran**; korisnik je zatražio istraživanje, nakon čega je zatražio ovu footer doradu.

Najnovija korisnička uputa: HR/IT politika privatnosti mora ostati doslovna, bez uredničkih ili pravnih ispravaka, uz font weba i pravilnu hijerarhiju međunaslova. `EditorialPage` koristi Montserrat i prelamanje dugih poveznica samo u članku privatnosti. `privacy-presentation.ts` prenosi postojeće nazive bez izmjene inline sadržaja: H2 za glavne cjeline/pravilnik, H3 za odjeljke pravilnika, H4 za osam prava. HR izvorni `question`, `policy-title`, `policy-section-title` odlomci postaju naslovi; IT postojeći naslovi dobivaju odgovarajuće razine. HR popis prava zadržava izvorne slovne oznake. Tekst, redoslijed, liste i hrefovi ostaju isti; uvjeti korištenja nisu obuhvaćeni. Regresija čuva SHA-256 teksta i DOM strukture s hrefovima uz normalizaciju jedino P/H2/H3/H4 tagova; zasebno provjerava hijerarhiju. To nije potvrda pravne ispravnosti niti noviji dohvat izvora. Izvorni IT Webflow snapshot i HR public snapshot od 8. rujna ostaju netaknuti. Ne popravljati ni očite tipfelere bez izričitog odobrenja.

Ovo je ulazna točka za drugog agenta, ne odobrenje novih sadržajnih ili produkcijskih promjena. GitHub i datirane odluke u povezanim dokumentima imaju prednost pred sjećanjem iz razgovora. Pri nastavku provjeriti noviji Git log i radno stablo; ovaj zapis nije automatski ažuriran.

## Okruženje i ovlasti

- Repozitorij: `slavisasrdic-debug/Dent-Vitalis-web`, grana `main`; native statički Astro, Node 24, npm 11, Git LFS.
- 28 IT + 27 HR sadržajnih stranica, zasebna 404. DE/EN/SI nisu implementirani niti su lažni hreflang parovi.
- Klijentski preview: <https://dent-vitalis-web.pages.dev/> i <https://dent-vitalis-web.pages.dev/hr/>. Push na `main` automatski pokreće Pages; link prikazuje posljednji uspješni build, ne lokalni rad.
- Preview ostaje `noindex, nofollow`. Ne uklanjati zaštitu radi PageSpeed SEO ocjene. To nije autentikacija; link je javan.
- Produkcijski `dentvitalis.com`, DNS, hosting, Search Console, Analytics i backend nisu promijenjeni niti odobreni za aktivaciju. Pages naziv “Production branch” nije odobrenje migracije.
- Obrazac/upload nema serversko slanje; WhatsApp/social/consent integracije čekaju odvojene odluke. Ne slati testne pacijentske upite.

## Obvezni početak sljedeće sesije

1. Pročitati `AGENTS.md`; prije ostalog rada `npm run preview:ensure`. Zadržati jedan server na `0.0.0.0:4321`, provjeriti lokalni i public HTTP 200/noindex i dati korisniku link. Ne gasiti tuđi proces ni mijenjati port.
2. `git status --short` i `git log -10 --oneline`; sačuvati tuđe izmjene. U novom checkoutu `git lfs pull` prije builda. Detalji: [obnova](source-versioning-proposal.md), [preview pravila](rules/preview.md), korijenski README.
3. Učitati samo relevantna obvezna pravila iz `docs/rules/`. Za HR dodatno [intake](croatian-content-intake.md). Za UI relevantni dio [komponentne mape](astro-component-map.md).
4. Ne preuzimati ponovno nepromijenjene izvore niti ponavljati cijeli prihvat. Koristiti datirane hashove, postojeće audite i ciljane testove.
5. Check/build/generatori odvojeno od browser testova; najviše dva Playwright workera. Browser emulacija nije fizički iPad/iPhone test.
6. Korisnik je odobrio commit/push dovršenog rada. Prije pusha `git lfs fsck`, provjera ignoriranja izvornih ZIP-ova i `git diff --check`; stageati samo vlastiti opseg. Usporediti lokalni HEAD s origin/main i provjeriti Cloudflare Pages check. Bez force-pusha i produkcijskih zahvata.

## Završene dorade i gdje su dokumentirane

| Područje                    | Implementirano                                                                                                                                                                                | Dokaz / detalji                                                                                              |
| --------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| Izvori i jezici             | Prihvaćen Webflow referentni snapshot; originalni bajtovi sačuvani. HR tekst iz stabilnih DOCX ID-eva, pravni tekst iz odobrenog public HR weba; zasebni HR kontakti.                         | `croatian-content-intake.md`, `croatian-review.md`, `source-intake-2026-09-07.md`; `test:content`, `test:hr` |
| Odobreni sadržajni ispravci | Krunice “već od 220 €”; “Dr. XY” zamijenjen s “Il Dr. Domagoj Žalac” prema Wordu. Nisu otvoreni nalazi. Skriveni profil nije otkriven.                                                        | commit `fb00635`, `data/editorial-corrections.json`                                                          |
| Logo i favicon              | Inline izvorni logo bez kasnog zahtjeva; HR “STOMATOLOG RIJEKA”; favicon s javnog weba.                                                                                                       | `BrandLogo`, `favicon-source.md`, commit `1ce23d6`                                                           |
| Navigacija                  | Čitljivi razmaci, desktop meni od 1200px, miš/touch odvojeni; prvi klik otvara grupu, klik otvorenog naziva vodi na parent.                                                                   | komponentna mapa, `tests/navigation-click.spec.ts`, `tests/navigation-hover.spec.ts`                         |
| Sidebar i kartice           | Smanjen razmak naslova sidebara; pravni sidebar na HR; uvijek četiri ostale usluge, unutar margina, 2×2 desktop / jedan stupac mobile; uklonjena nepotrebna prazna visina kratkih kartica.    | `astro-component-map.md`, `legal-sidebar`, `sidebar-spacing`, `related-services`, `directory-layout` testovi |
| Kontaktna kontrola          | Upload layout inline/popup, oba jezika, duge datoteke i greške; kratki HR CTA “Pitaj stomatologa”; parking linkovi imaju opisne oznake, izvorni različiti hrefovi sačuvani.                   | `upload-layout.spec.ts`, `parking-links.spec.ts`, komponentna mapa                                           |
| Učitavanje                  | Kritični fontovi prije prvog layouta, isti Latin/Extended fontovi; first-screen eager slike, responsive hero preload, statična geometrija direktorija; spriječen pomak pri streamingu HTML-a. | `font-loading.spec.ts`, `fonts.spec.ts`, `hero-streaming.spec.ts`, komponentna mapa                          |
| Izgled/pristupačnost        | Zelene hero poveznice/hover na plavoj podlozi, lijevo poravnanje; kontrast/cache i semantičke dorade.                                                                                         | `astro-component-map.md`, commitovi `e61be94`, `ee80681`                                                     |
| SEO/schema/XML              | Lokalizirani metapodaci i alt/ARIA, stvarni IT/HR parovi, canonical s `/`, tipovi stranica iz sadržaja, provjereni datumi 13 videa. Bez izmišljenih ocjena/reviewera ili skrivenog AI teksta. | `seo-migration.md`, `data/video-metadata.json`                                                               |
| Sidra i breadcrumb          | Zajednički offset header + stvarna visina breadcrumba; roditeljski linkovi se ne stišću ispod širine teksta, dugi nazivi se prelamaju.                                                        | commitovi `d46766f`, `5c8cea7`; `anchor-offsets.spec.ts`, `breadcrumb-alignment.spec.ts`                     |

Potpuna povijest je u `git log`, a propsi, responsive varijante, namjerna odstupanja i testovi u [komponentnoj mapi](astro-component-map.md). Gornja tablica nije potvrda da je cijeli web spreman za produkciju.

## Najnoviji zadatak: mobilni razmak H1/podnaslov

Na zahtjev korisnika zajednički `DetailHero` do 991px mijenja razmak s 20 na 12px. Postavljene su obje susjedne margine jer kolabiraju. Desktop od 992px, fontovi, tekstovi, fotografije, eyebrow i home hero nisu promijenjeni. Nova regresija: `tests/detail-hero-spacing.spec.ts`, svih 53 unutarnjih stranica na sedam širina 320–1440px, uz reload i breadcrumb navigaciju. Rezultat provjere ove izmjene zabilježen je niže nakon izvršavanja.

## Što još čeka odluku (ne popravljati nagađanjem)

- Jedna aktualna sadržajna lista: [croatian-review.md](croatian-review.md). Banka/IBAN/SWIFT, anestezija u paketu izbjeljivanja, kontaktni i pravni tipfeleri, medicinske/uredničke potvrde i neprimjeren biografski odlomak u “Cosa portare alla visita”. Povijesni nalazi u `known-content-issues.md` nisu svi aktualni.
- [Redirect prijedlog](redirect-proposal.md), commit `812430e`: svih 206 inventariziranih URL-ova, 24 predložena 301, 2 ista URL-a, 180 otvorenih odluka (50 IT/HR, 105 DE/EN/SI, 25 starih 404). **CSV nije aktivan niti generira server pravila.** Nema odabranih 410. Ne poistovjećivati različite implantološke konstrukcije po broju implantata.
- Prije konačne migracije dopuniti inventar Search Console/server-log/backlink dokazima ako ih vlasnik omogući; potvrditi nove sadržajne ekvivalente i sudbinu DE/EN/SI.
- Potvrditi hosting i deploy/rollback, odobriti backend i sigurnost uploada, consent za vanjske servise, poslovne/pravne/medicinske podatke. Tek zasebnim odobrenjem uključiti produkcijsko indeksiranje. [Pre-launch lista](pre-launch-checklist.md) ostaje otvorena.

## QA evidencija i ograničenja

- Završna provjera privatnosti nakon vraćanja izvornog slovnog HR popisa: ciljani skup 3/3 Chromium i 3/3 WebKit; početni Chromium pokušaj nakon rebuilda imao je prekid navigacijskog konteksta, stabilni ponovni prolaz je uspješan. Mobilne HR i desktop IT snimke vizualno pregledane; privremeni PNG-ovi u `/tmp/privacy-*` nisu trajna pohrana dokaza. Originalni sadržajni snapshotovi ostaju nepromijenjeni u Gitu.

- Privatnost 11. rujna: 6/6 provjera sadržajnih izvora, check/lint/build prolaze. Novi checksum testovi potvrđuju nepromijenjen tekst, inline sadržaj, redoslijed i hrefove uz dopuštenu promjenu heading tagova; 11 HR / 12 IT H2, devet H3 i osam H4 bez preskakanja razina. Ciljani Chromium skup 8/9 u prvom prolazu (jedan prekid navigacijskog konteksta); ponovljeni pogođeni test prolazi. WebKit 9/9, uključujući pravni sidebar i tipkovničku/no-JS navigaciju. Nije rađen novi pravni audit ni slobodno uređivanje izvora.

- Mobilni razmak: `check` (150 datoteka, bez grešaka/upozorenja), `lint` i build (56 stranica) prolaze. Sve 53 rute × sedam širina prolaze u Chromiumu i WebKitu. Chromium interakcijski test isprva je imao pogrešan očekivani parent URL `/su-di-noi`; usklađen je sa stvarnim, nepromijenjenim `/chi-siamo` i ponovljeni test prolazi. WebKit 3/3 u zajedničkom prolazu. Nije mijenjana navigacija radi testa. Git LFS fsck i izuzeća ZIP-ova provjereni su prije pusha.

- Breadcrumb izmjena `5c8cea7`: 63/63 Chromium provjere; WebKit 62/63 u prvom prolazu zbog vanjske Google Places mrežne greške, zatim ciljani HR test prolazi. Sve geometrijske provjere prošle. Dodatno 7/7 cold-font/tablet testova u svakom engineu. Cloudflare check uspješan i novi CSS vizualno potvrđen na online previewu.
- Povijesni rezultati HR/SEO/performance audita ostaju datirani u svojim dokumentima. Nije tvrđeno da je posljednja izmjena prošla novi puni `npm run validate` niti novi PageSpeed audit.
- Privremene snimke `/tmp/` i raw cache `.astro/audits/` nisu jamčeni u novom Codespaceu. Ponovljivi testovi, izvori i odluke jesu verzionirani. Novi agent treba ponoviti samo relevantne provjere, ne oslanjati se na postojanje privremenih PNG-ova.
- Browser plugin nije dostupan u ovoj sesiji; koristi se postojeći Playwright Chromium/WebKit. Fizički uređaji, stvarno slanje obrasca i budući produkcijski server nisu testirani.

Korisnik traži da se daljnje dovršene promjene dokumentiraju, commitaju i pošalju na GitHub. Ažurirati ovaj sažetak kada se promijene status, blokatori ili sljedeći zadatak; detaljnu implementaciju držati u pripadajućem dokumentu, ne duplicirati cijelu povijest razgovora.
