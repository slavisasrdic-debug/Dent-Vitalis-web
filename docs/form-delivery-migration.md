# Migracija dostave upita

## Potvrđeni model objave

- GitHub je jedini izvor koda.
- Cloudflare služi samo razvojnom prikazu i nije dio produkcijske objave.
- Kada vlasnik to zasebno odobri, provjereni GitHub release objavljuje se na
  postojeći cPanel server za `dentvitalis.com`.
- Ne mijenjati domenu, DNS, cPanel produkciju ni primatelje poruka radi ove
  pripreme.

## Potvrđeni legacy tok

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

`/send` validira ime, telefon, e-mail, URL izvora, privolu, CSRF i GCT.
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
- prazni honeypot `company`.

Telefon ostaje obvezan prema izričitoj aktualnoj odluci za novi web, iako ga
stari javni HTML tehnički ne označava obveznim. Upload klijentski dopušta PDF,
JPG i PNG do 8 MB; server mora ponovno provesti istu ili strožu provjeru.

`csrf` i `gct` se ne smiju unaprijed ugraditi ili izmišljati. Prije aktivacije
klijent ih mora dobiti iz istog cPanel session konteksta kao `/send`, ili novi
handler mora izdati potvrđenu ekvivalentnu zaštitu. `npm run form:preflight`
provjerava statični form payload na svih pet jezičnih rootova, dok je slanje u
previewu i dalje isključeno.

## Obvezni koraci prije aktivacije

1. Prije promjene sačuvati dvije vremenski označene verzije `public_html` i
   cijelog `application` direktorija izvan web-korijena, uz checksum i postupak
   povrata.
2. Sačuvati postojeći bootstrap, vendor, jezične datoteke i privatni
   `config/local.php`; tajne ne ulaze u Git, build artefakt ni klijentski kod.
3. Statični release ne smije pregaziti `/send` i `/gct`: cPanel rewrite mora
   te rute proslijediti potvrđenom legacy bootstrapu ili provjerenoj zamjeni.
4. Frontend se prebacuje na stvarni `multipart/form-data` tek kada je token tok
   dostupan na istoj domeni.
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
