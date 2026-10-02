# Migracija dostave upita

## Potvrđeni model objave

- GitHub je jedini izvor koda.
- Cloudflare služi samo razvojnom prikazu i nije dio produkcijske objave.
- Kada vlasnik to zasebno odobri, provjereni GitHub release objavljuje se na
  postojeći cPanel server za `dentvitalis.com`.
- Ne mijenjati domenu, DNS, cPanel produkciju ni primatelje poruka radi ove
  pripreme.

## Potvrđeni legacy tok

### Najnoviji objedinjeni pregled prije aktivacije — 1. listopada 2026.

Vlasnik je naknadno odobrio pet označenih TEST upita (po jeziku), jedan
bezopasni PDF i dostavio kontakt testnog pošiljatelja. Ti kontakti nisu u Gitu.
Prvi HR POST `DV-MIG-20261001-HR-152910Z` poslan je jednom u 15:29:10 UTC
na postojeći `/send`, sa svježim tokenima iste sesije, bez izmjene primatelja
ili CRM-a. HTTP 200 JSON `status:ok`, `no-store`; 640 B sintetički PDF.
Vlasnikov CRM screenshot od 2. listopada potvrđuje ovaj lead/oznaku, HR, izvor
Web, kontakte i TEST poruku. CRM PDF link je vidljiv, a vlasnik je naknadno
potvrdio njegovo otvaranje. Nije neovisno provjeren CRM sadržaj/hash.
Vlasnik je 2. listopada potvrdio dolazak
e-maila i prikazao proslijeđenu poruku s otvorenim PDF-om: točna oznaka,
odgovarajuće izvorno vrijeme i neutralni TEST tekst. HR inbox i e-mail PDF
potvrđeni su vlasničkim dokazom; nema neovisnog mailbox pristupa ni hasha
preuzetog privitka. Ne pohranjuju se screenshot, kontakti ili mailbox adrese.
HR dostava i čitljivi privici su prihvaćeni; nastaviti preostala četiri već
odobrena jezika, koji još nisu poslani. Nema auto-retryja ili javne aktivacije. Izravni
backend POST nije potvrda end-to-end novog frontend/thank-you/GTM toka.

Browser agent potvrđuje instalaciju oba PHP dodatka i minimalnog transport
patcha zajedničkog `/send`, bez izmjene konfiguracije ili ključeva, `0644`.
Handler je sačuvan za kodni povratak. Chromeovi token GET-ovi blokirani su
`ERR_BLOCKED_BY_CLIENT`; uzrok blokade nije utvrđen. Neovisni HTTP GET prihvat
iz Codespacesa u 15:19:39 UTC potvrđuje 200, JSON s oba tokena, `no-store`,
poklapanje GCT-a i stabilan CSRF/GCT unutar iste sesije. Tokeni nisu zapisani.
Cookie: Secure true, HttpOnly false, SameSite nije eksplicitno naveden.
Vlasnikov obični Chrome GET `/form-tokens` naknadno je potvrđen screenshotom
JSON-a s oba neprazna polja; u repozitorij se ne spremaju tokeni/screenshot.
End-to-end browser submit, cookie hardening, efektivne ekstenzije, CRM
poslovni odgovor i prihvat ostalih jezika ostaju neprovjereni. Naknadni HR
POST, inbox/lead i e-mail privitak imaju dokaze opisane iznad. Transport patch
za SMTP/cURL/HTTP greške nije dokaz CRM poslovne potvrde.
Novi javni upload je zadržan do backend prihvata;
operativni slijed je isključivo u cPanel runbooku.

Nalaz navodi validacijske provjere e-maila/URL-a i primatelje po jeziku.
To nije dokaz potpunosti uvjeta niti efektivnih vrijednosti konfiguracije;
raniji opis ograničenja treba usporediti s redaktiranim aktualnim kodom prije
promjene. Dodatne frontend oznake izvora/honeypot legacy ne obrađuje prema
nalazu; ne predstavljati ih kao CRM tracking ili serversku zaštitu od spama.
`test@example.com` preskače CRM, pa puni prihvat zahtijeva odobreni sintetički
test s zasebnom potvrdom e-maila i leada. Sam read-only pregled nije poslao
upite; naknadni odobreni HR test opisan je iznad.

### Dopuna prema detaljnom read-only nalazu 1. listopada 2026.

Mjerodavni sažetak i izričite vlasničke odluke su u
`data/migration-readiness.json`. Novi nalaz potvrđuje `/send-sconto` i zasebni
Mailchimp newsletter. Vlasnik je ukinuo newsletter; popis isteklih kampanja
još mora pregledati prije dodatnih 410 pravila. Obične registracijske stranice
ne uklanjaju se automatski.

`GET /gct` vraća **samo GCT**, a stari PHP HTML ispisuje CSRF u input.
Novi statički frontend zato prije slanja koristi novi **`GET /form-tokens`**,
koji vraća oba tokena iz istog postojećeg PHP sessiona. Privatni predložak je
u `server/application/view/template/form-tokens.phtml`; mora se posebno
instalirati u application direktorij i provjeriti na serveru. Nije u `dist/`.
Ne ugrađivati tokene u build i ne koristiti nevaljani prvi POST za njihov dohvat.

`pos` se šalje kao stvarna pozicija (`home_inline` / `home_popup`) i legacy
handler ga dodaje uz izvorni URL. `action` ostaje prazan za obični upit;
`conference_call` nije ponuđen. Slovenščina koristi `lang=sl`, putanje `/si`.
CRM ne prima URL ni poziciju: ti podaci ostaju u e-mailu. Novo bilježenje URL-a
u CRM zahtijevalo bi zasebnu promjenu ugovora i nije pretpostavljeno.

Nalaz ispravlja raniji opis validacije: legacy kod nema pouzdanu provjeru
obveznog e-maila, whiteliste jezika, izvornog URL-a ni stvarnog MIME-a privitka.
Greška uploada može biti prešućena. Privatni dodatak
`server/application/view/template/form-request-guard.php` priprema provjeru
e-maila, jezika, HTTPS izvora i stvarnog PDF/JPEG/PNG MIME-a do 8 MiB,
prije e-mail/CRM obrade. Nakon backupa i pregleda stvarnog `send.phtml`, dodati
`require __DIR__ . '/form-request-guard.php';` prije njegove obrade ulaza.
To nije zamjena za legacy CSRF/GCT provjere ni dokaz da je dodatak instaliran.
`fileinfo` mora stvarno biti uključen; bez njega upload se odbija.

Sigurnosni i dostavni problemi starog handlera nisu riješeni frontend testom:
JSON `ok` još nije dokaz SMTP/CRM primitka. Taj gate ostaje otvoren.

Lokalna provjera ove dopune: 47 Playwright testova (cijeli hrvatski skup,
zahvalne rute, uspjeh/obnova tokena i greške svih pet jezika, GTM izolacija),
2 PHP fixture testa tokena i stvarnog multipart uploada na PHP 8.4.15 CLI,
5 deployment testova uključujući izolirani Apache HTTP/TLS, te 2 testa
statičkih ruta i sitemapa. Form preflight potvrđuje 141 zaštićenu formu.
Desktop 1280×720 i mobile 390×900 popup vizualno su pregledani.
Nije provjerena stvarna PHP 7.4/FPM sesija niti poslano išta SMTP-u ili CRM-u.

Read-only pregled cPanela 29. rujna 2026. potvrdio je da se obrazac ne izvršava
izravno iz `public_html`, nego kroz postojeći PHP application bootstrap.

- `public_html/.htaccess` šalje dinamičke rute na `public_html/index.php`.
- Bootstrap učitava `/home2/dentvita/application`, Composer autoload i privatni
  `config/local.php`.
- Rute `/send` i `/gct` koriste `application/view/template/send.phtml` i
  `application/view/template/gct.phtml`.
- Session-based `getCsrf()` i `getGct()` dolaze iz `Application.php`.
- E-mail se šalje kroz PHPMailer konfiguraciju, a lead se zatim šalje internom
  DentVitalis CRM-u. Tajne ostaju isključivo u cPanel konfiguraciji.

Stari javni obrazac koristi klijentski tok:

1. `GET /gct`.
2. `multipart/form-data` `POST /send`.
3. U zahtjevu su `name`, `email`, `phone`, `message`, `file`, dva
   `form_agreement` zapisa (`0` i, kada je označeno, `1`), `url`, `lang`,
   `csrf` i odgovor `/gct` pod imenom `gct`.
4. Poslužitelj vraća JSON; uspjeh vodi na jezičnu zahvalnu rutu, a greške se
   prikazuju uz polja.

`/send` provjerava ime, telefon, privolu, CSRF i GCT; nedostatke ostalih
provjera opisuje aktualna dopuna iznad.
Prihvaća opcionalni `file` do 8 MiB. E-mail dobiva URL, poziciju obrasca i
vrijeme/IP; CRM dobiva `name`, `email`, `phone`, `message`, `action`, `lang`,
`form_agreement` i, kada postoji, `file`. Trenutačni `mail.to` je jedna lista
primatelja, iako kod podržava i mapu po jeziku.

Legacy handler prijavi uspjeh i kad SMTP ili CRM poziv ne uspije. Zato inbox i
CRM moraju biti zasebno potvrđeni tijekom prihvata migracije.

## Pripremljeni frontend ugovor

Zajednička Astro forma sada nosi sve parametre koje može vjerodostojno stvoriti
bez servera:

- `name`, `email`, `phone`, `message`, `file`;
- `form_agreement=0` i checkbox `form_agreement=1`;
- `url`, `lang`, prazni `csrf` i `gct`, `source_page_url`, `source_page_path`,
  `source_page_title`, `form_placement`;
- `pos` i prazni `action`;
- prazni honeypot `company`.

Telefon ostaje obvezan prema izričitoj aktualnoj odluci za novi web, iako ga
stari javni HTML tehnički ne označava obveznim. Upload klijentski dopušta PDF,
JPG i PNG do 8 MB; server mora ponovno provesti istu ili strožu provjeru.

`csrf` i `gct` se ne smiju unaprijed ugraditi ili izmišljati. Klijent na
`dentvitalis.com` i `www.dentvitalis.com` ih dohvaća iz istog cPanel session
konteksta kao `/send`, zatim šalje postojeći `multipart/form-data` ugovor i
jednom ponavlja dohvat oba tokena ako legacy handler zatraži novi CSRF. Na svakom drugom
hostu (lokalni i Pages preview) slanje je i dalje isključeno. `npm run
form:preflight` provjerava statični payload i lokaliziranu success rutu na svih
pet jezičnih rootova.

## Obvezni koraci prije aktivacije

Raniji read-only nalaz od 1. listopada potvrđuje privatni `application/data`;
prvotni lokalni ZIP ga ne sadrži. Naknadno je stvoren puni privatni
`dentvitalis-full-files-20261001.zip` s `data` prema agentu, a vlasnik je pokazao
lokalnu kopiju. Integritet/obnova te kopije još nisu potvrđeni.
JetBackupov prikaz nije test obnovljivosti. Prije promjene potreban je
zaštićeni backup tih podataka i potvrđena kopija izvan servera. Pri rutinskoj
objavi ili automatskom rollbacku ne vraćati `application/data` starom kopijom
niti mijenjati vanjski CRM: noviji upiti i privitci moraju ostati sačuvani.
Povratak PHP koda i povratak privatnih podataka zasebni su kontrolirani postupci.
Kapacitet kvote, inodeovi, PHP/FPM ekstenzije i cookie postavke još nisu
efektivno provjereni. Detalji su u cPanel runbooku i readiness podacima.

1. Prije prve migracije sačuvati kompletan `public_html` i `application`,
   uključujući privatne podatke, izvan web-korijena i potvrditi zasebnu
   zaštićenu kopiju izvan servera, checksum i postupak povrata. Za redovne
   objave zadržavati dvije prethodne provjerene kodne verzije, uz zaseban
   backup privatnog sustava i podataka; statički rollback ne vraća stare upite.
2. Sačuvati postojeći bootstrap, vendor, jezične datoteke i privatni
   `config/local.php`; tajne ne ulaze u Git, build artefakt ni klijentski kod.
3. Statični release ne smije pregaziti `/send` i `/gct`: cPanel rewrite mora
   te rute proslijediti potvrđenom legacy bootstrapu ili provjerenoj zamjeni.
4. Prije switcha potvrditi da je token tok dostupan na istoj domeni; klijent je
   već pripremljen, ali se aktivira samo pod stvarnim produkcijskim hostnameom.
5. Test s `test@example.com` provjerava legacy testni e-mail put bez CRM leada.
   CRM se provjerava samo kroz potvrđeni testni endpoint ili odobreni testni
   zapis bez podataka pacijenta.
6. Prihvat obuhvaća svih pet jezika, inbox, CRM, privitak, validaciju,
   localized success rutu i evidenciju izvora.
7. Tek nakon pisanog rezultata testa i potvrde backupa može se odobriti objava
   na `dentvitalis.com`.

## Izričite zabrane

- Ne slati testne poruke klinici niti koristiti stvarne podatke pacijenata.
- Ne unositi CRM ključ, mailbox ili SMTP vjerodajnice u Git ili klijentski kod.
- Ne koristiti stari `/send` kao trajni cross-origin prečac nakon prijelaza
  domene bez zasebne sigurnosne odluke.
