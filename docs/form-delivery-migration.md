# Migracija dostave upita

## Potvrđeni model objave

- GitHub je jedini izvor koda.
- Cloudflare služi samo razvojnom prikazu i nije dio produkcijske objave.
- Kada vlasnik to zasebno odobri, provjereni GitHub release objavljuje se na
  postojeći cPanel server za `dentvitalis.com`.
- Ne mijenjati domenu, DNS, cPanel produkciju ni primatelje poruka radi ove
  pripreme.

## Trenutačno provjereno

Stari javni obrazac na `dentvitalis.com` koristi klijentski tok:

1. `GET /gct`.
2. `multipart/form-data` `POST /send`.
3. U zahtjevu su `name`, `email`, `phone`, `message`, `file`, dva
   `form_agreement` zapisa (`0` i, kada je označeno, `1`), `url`, `lang`,
   `csrf` i odgovor `/gct` pod imenom `gct`.
4. Poslužitelj vraća JSON; uspjeh vodi na jezičnu zahvalnu rutu, a greške se
   prikazuju uz polja.

Javni kod ne otkriva e-mail primatelje, CRM, obradu privitaka ni svrhu tokena.
To su server-side činjenice i ne smiju se pretpostaviti.

## Pripremljeni frontend ugovor

Zajednička Astro forma sada nosi sve parametre koje može vjerodostojno stvoriti
bez servera:

- `name`, `email`, `phone`, `message`, `file`;
- `form_agreement=0` i checkbox `form_agreement=1`;
- `url`, `lang`, `source_page_url`, `source_page_path`,
  `source_page_title`, `form_placement`;
- prazni honeypot `company`.

Telefon ostaje obvezan prema izričitoj aktualnoj odluci za novi web, iako ga
stari javni HTML tehnički ne označava obveznim. Upload klijentski dopušta PDF,
JPG i PNG do 8 MB; server mora ponovno provesti istu ili strožu provjeru.

`csrf` i `gct` se ne smiju unaprijed ugraditi ili izmišljati: novi handler ih
mora izdati ili ih mora zamijeniti potvrđenom ekvivalentnom zaštitom.

## Obvezni koraci prije aktivacije

1. Vlasnik legacy cPanel servera dostavlja kod/konfiguraciju `/send` ili potvrđuje:
   primatelje, CRM integraciju, mapiranje polja, privitke, odgovor, `csrf` i
   `gct` tok.
2. `/send` se čuva kao postojeća server-side ruta ili se na istom cPanel serveru
   migrira nakon potvrđenog ekvivalenta. Tajne ne ulaze u Git ni klijentski
   JavaScript.
3. Implementiraju se server-side validacija, anti-spam, ograničenja datoteka i
   sigurno prosljeđivanje/premještanje privitka prema potvrđenoj integraciji.
4. Frontend se prebacuje s trenutačne iskrene preview poruke na stvarni
   `multipart/form-data` tok tek kada je endpoint dostupan.
5. Staging test s ne-pacijentskim podacima potvrđuje cijeli put: forma,
   endpoint, inbox/CRM, privitak, lokalizirani odgovor i evidencija izvora.
6. Prije svake cPanel objave stvaraju se najmanje dvije prethodne, vremenski
   označene verzije izvan javnog web-korijena. Backup obuhvaća web datoteke,
   server-side `/send`, konfiguraciju, preusmjeravanja i bazu ako je koristi.
   Potrebni su checksum i dokumentiran postupak brzog povrata.
7. Tek nakon pisanog rezultata testa i potvrde backupa može se odobriti objava
   na `dentvitalis.com`.

## Izričite zabrane

- Ne slati testne poruke klinici niti koristiti stvarne podatke pacijenata.
- Ne pretpostavljati CRM dobavljača, mailbox, API ključ ili e-mail adresu.
- Ne koristiti stari `/send` kao trajni cross-origin prečac nakon prijelaza
  domene bez zasebne sigurnosne odluke.
