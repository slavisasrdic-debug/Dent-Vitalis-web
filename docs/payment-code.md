# Statični SEPA QR — 15. rujna 2026.

Korisnik odobrio zamjenu starog IT barkoda i dodavanje na HR, bez iznosa i bez posredničkog servisa. Ovo zamjenjuje prethodnu blokadu u handoffu. Stari originali i izvedenice nisu brisani niti mijenjani; više se ne prikazuju na platnim stranicama.

## Podaci i format

- EPC069-12 v3.1, verzija 002, UTF-8 (1), SCT, korekcija M, bijela margina 4 modula.
- Primatelj: Dentvitalis Fides d.o.o. (iz očitanog postojećeg koda i korisnikova odobrenja).
- IBAN HR1424020061100858111 i SWIFT ESBCHR22 dolaze iz `data/site.ts`.
- Iznos je PRAZAN, nije 0 ili 0,01 EUR. Namjena i strukturirana referenca također su prazni. Opis ostaje Ponuda/Preventivo.
- Adresa nije polje ovog EPC formata; ne ubacuje se u druga polja. Postojeće bankovne upute ostaju iznad koda.
- Službena specifikacija: https://www.europeanpaymentscouncil.eu/sites/default/files/kb/file/2024-03/EPC069-12%20v3.1%20Quick%20Response%20Code%20-%20Guidelines%20to%20Enable%20the%20Data%20Capture%20for%20the%20Initiation%20of%20an%20SCT.pdf

## Implementacija i sigurnosna granica

`payment-code.ts` dijeli podatke i lokalizirane upute, provjerava duljinu, nedopuštene prijelome/URL-ove i IBAN kontrolni zbroj. `PaymentCode.astro` generira SVG preko zaključane build-time ovisnosti `qrcode`. U HTML se ugrađuje inertni img data URI. Nema vanjskog zahtjeva, aplikacijskog backenda, promjenjivog odredišta, isteka niti izvršavanja plaćanja. Oba jezika dobivaju isti kod; upute i svi kodirani poslovni podaci prikazani su i tekstualno. Fallback je ručni unos u bankovnu aplikaciju.

Git i testni očekivani payload omogućuju pregled promjene, ali ne sprječavaju kompromitaciju GitHub/hosting računa. Koristiti 2FA, ograničene ovlasti i pregled promjena bankovnih podataka. Kontrolni zbroj IBAN-a nije potvrda njegova vlasništva. Podrška EPC skeniranju nije univerzalna; test skeniranja u stvarnim HR/IT bankovnim aplikacijama bez slanja novca ostaje zadatak klinike. Ne tvrditi da je bankovna interoperabilnost potvrđena.

## Provjere

`tests/payment-code.spec.ts`: fiksni očekivani payload, prazan iznos, ista slika oba jezika, vidljivi podaci, bez vanjskih linkova/skripti u bloku, bez starog PDF417, responsive 320/390/1440. Dodatno očitati screenshot slike neovisnim zxing-cpp dekoderom iz privremenog okruženja; ne dodaje se projektna Python ovisnost. Generator i dekoder nisu bankovna aplikacija.

Rezultat provjere: 6 Chromium testova (uključujući cjeloviti HR copy audit) i 5 WebKit testova prolaze. Neovisni zxing-cpp očitao je screenshot QR-a na HR 320/1440px i IT 390px: potpuni payload identičan očekivanom, iznos prazan, nema URL-a. `astro check`, ESLint i build prolaze. Decoder je instaliran samo u `/tmp/dent-payment-decode`; screenshots su privremeni `/tmp/payment-*.png`, izvan repozitorija. Nisu slani platni nalozi, upiti klinici ni bankovni zahtjevi.
