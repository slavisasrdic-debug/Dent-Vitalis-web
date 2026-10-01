# cPanel release runbook

Ovaj runbook priprema prelazak statičkog Astro releasea na postojeći
`dentvitalis.com` cPanel. Nije nalog za objavu. GitHub ostaje izvor koda;
Cloudflare preview nije dio produkcijskog toka.

Za jednokratno povezivanje GitHuba i cPanela, bez ikakve objave javnog weba,
slijediti [cPanel-github-stage-setup.md](cPanel-github-stage-setup.md).

## Potvrđeni postojeći raspored

- Web-korijen: `/home2/dentvita/public_html`.
- Aplikacija za postojeće forme: `/home2/dentvita/application`.
- Dinamičke rute `/send` i `/gct` sada ulaze kroz `public_html/index.php` i
  postojeći application bootstrap.
- Mail i CRM tajne su u privatnoj cPanel konfiguraciji, ne u repozitoriju.

Statički build ne smije zamijeniti application direktorij, vendor, mail
konfiguraciju, PHP handler niti postojeći bootstrap dok se forme ne potvrde na
stagingu.

## Release gates

Prije promjene servera treba postojati:

1. Točan commit na `main` i provjeren paket. `npm run release:prepare` zadano
   izrađuje preview paket; za aktivaciju na domeni koristiti zasebnu
   `release:prepare:production` naredbu opisanu niže. Naredbe grade `dist/`,
   provjeravaju ugovor obrazaca i dodaju `dist/release-manifest.json`
   (SHA-256 i veličina svake objavljive datoteke). Manifest je zapis releasea,
   ne tajni i ne commitira se.
2. Dvije provjerene, vremenski označene verzije izvan `public_html`:
   kompletan trenutačni `public_html` i kompletan `application` direktorij.
3. SHA-256 manifest backupa i provjeren postupak vraćanja posljednje verzije.
4. Potvrđen PHP runtime, `curl`, `mbstring`, session, `upload_max_filesize` i
   `post_max_size` za produkcijski handler.
5. Potvrđena odluka o form bridgeu: za ovaj release zadržava se postojeći
   application bootstrap. Statični klijent na stvarnoj domeni uzima `/gct`,
   šalje `/send` i vodi na postojeće thank-you rute. Ne uvoditi drugu
   implementaciju bez zasebne specifikacije.

## Produkcijski HTTPS + www paket

Pages preview ostaje na `https://dent-vitalis-web.pages.dev/`, bez dodanog `www`.
`www.dent-vitalis-web.pages.dev` nije adresa našeg Pages projekta i vraća
Cloudflareovu 404 stranicu. To se ne popravlja preusmjeravanjem u našem HTML-u.

Za produkciju postoji zasebna, lokalna naredba:

```bash
npm run release:prepare:production -- --legacy-htaccess /absolute/path/to/server-backup/.htaccess
```

Ulaz mora biti kopija stvarnog `public_html/.htaccess` iz server backupa,
izvan `dist/` i `public/`; server konfiguraciju ne commitati u Git. Naredba
uključuje production SEO režim, gradi web, provjerava ugovor forme, stavlja
HTTPS/www pravilo **ispred** sačuvanih legacy pravila te hashira sve zajedno
u release manifest. Bez ulaza odbija graditi paket. Ništa ne uploadira ni
objavljuje; postojeći GitHub stage workflow i `release:prepare` nisu ovom
dopunom pretvoreni u produkcijski deploy.

Pravilo koristi zajednički `productionOrigin`: oba produkcijska hosta na HTTP-u
i host bez `www` na HTTPS-u vode izravno na `https://www.dentvitalis.com`, bez
povratka na HTTP. Putanja i query parametri ostaju isti. Trajni status **308**
čuva i HTTP metodu/tijelo POST zahtjeva. Testni i nepoznati hostovi nisu zahvaćeni;
već ispravna HTTPS/www adresa nema novu redirekciju.

Izvorni legacy bajtovi ostaju iza našeg označenog bloka. To nije dokaz da je
cjelokupni static/PHP bridge spreman: prije aktivacije treba pregledati stvarni
bootstrap, redoslijed ostalih pravila i postojeće Force HTTPS postavke na hostingu.
Testirati stvarni HTTPS status u Apacheu; ne vjerovati klijentskom
`X-Forwarded-Proto` zaglavlju. Ako hosting ima reverse proxy, prvo potvrditi kako
sigurno prenosi HTTPS status, inače postoji rizik redirect petlje.

Provjere: `npm run test:deployment`; stvarni Apache HTTP/TLS testovi u izoliranom
Dockeru: `npm run test:deployment:apache`. Ne šalju ništa klinici ni CRM-u.
URL migracije iz `data/redirects.csv` ostaju zasebne, neodobrene odluke.

## Form bridge acceptance

Bridge mora omogućiti isti-origin tok bez izlaganja tajni klijentu:

1. `GET /gct` vraća token vezan uz server-side session.
2. Obrazac šalje `multipart/form-data` na `POST /send` s imenima polja:
   `name`, `email`, `phone`, `message`, `file`, `form_agreement`, `url`,
   `lang`, `csrf`, `gct`.
3. Poslužitelj vraća JSON: `status: ok` ili `status: error` s greškama po
   polju.
4. Uspjeh ide na IT `/grazie`, HR `/hr/hvala`, DE `/de/dank`, EN `/en/thanks`
   ili SI `/si/hvala`.

Klijent je namjerno aktivan samo pod `dentvitalis.com` ili
`www.dentvitalis.com`; razvojni/Pages preview ne dohvaća tokene niti može
poslati upit.

Za statični release nije dovoljno kopirati `send.phtml`: treba legacy
bootstrap, session, mail konfiguracija, PHPMailer, e-mail predložak, vendor i
lokalizacije. Točan `.htaccess` merge radi se tek uz kopiju postojećeg
`index.php` i dry-run na stagingu; ne zamjenjuje se generičkim pravilom.

## Kontrolirani test

- Ne koristiti podatke pacijenta niti slati poruku klinici.
- Legacy `test@example.com` aktivira testni e-mail primatelj i ne šalje CRM
  lead; time se provjerava frontend, tokeni i SMTP test.
- CRM zahtijeva potvrđeni testni endpoint ili eksplicitno odobren testni lead.
  Provjeriti HTTP odgovor i stvarni zapis, jer legacy handler ne vraća CRM/SMTP
  neuspjeh korisniku.
- Testirati svaki jezik, upload unutar stvarnog PHP limita, inbox, CRM, success
  rutu i rollback.

## Zabrane

- Ne commitati `local.php`, SMTP vjerodajnice, CRM ključ, logove ili mail spool.
- Ne objavljivati prije uspješnog rollback testa.
- Ne uklanjati postojeći form backend prije potvrđenog ekvivalenta.
