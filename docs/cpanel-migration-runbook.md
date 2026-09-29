# cPanel release runbook

Ovaj runbook priprema prelazak statičkog Astro releasea na postojeći
`dentvitalis.com` cPanel. Nije nalog za objavu. GitHub ostaje izvor koda;
Cloudflare preview nije dio produkcijskog toka.

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

1. Točan commit na `main`, uspješan `npm run build` i
   `npm run form:preflight`.
2. Dvije provjerene, vremenski označene verzije izvan `public_html`:
   kompletan trenutačni `public_html` i kompletan `application` direktorij.
3. SHA-256 manifest backupa i provjeren postupak vraćanja posljednje verzije.
4. Potvrđen PHP runtime, `curl`, `mbstring`, session, `upload_max_filesize` i
   `post_max_size` za produkcijski handler.
5. Potvrđena odluka o form bridgeu: postojeći application bootstrap ili nova
   samostalna implementacija. Ne miješati oba bez specifikacije.

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
