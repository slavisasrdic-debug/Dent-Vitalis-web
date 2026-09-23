# Slovenska verzija — 23. rujna 2026.

Opseg: dovršiti i objaviti 27 slovenskih stranica prema dostavljenom SL prijevodu i prihvaćenoj hrvatskoj strukturi. Objavljuje se preko GitHub main → Cloudflare Pages noindex preview; produkcijska domena, DNS i slanje obrazaca ostaju netaknuti. Postojeći IT/HR/DE/EN sadržaj i putanje ostaju sačuvani.

## Izvor i mapiranje

- Izvor: `reference/Upute za prijevode/Dentvitalis web tekstovi za prijevod_SL.docx`, SHA-256 `3d337a17540b706c270ce905e64bd16a451cd22336c291cd1ec24e619c0916bd`; lossless katalog `data/translations/sl-source.json`.
- `src/content/sl/source.ts` čita izričite ID-jeve. Ne poravnava tablice ili odlomke automatski s drugim prijevodom. SL posebno odstupa kod home CTA-a, uvoda proteze, koraka izbjeljivanja, trajanja liječenja, bankovnih uputa, smještaja, FAQ-a i samostalnih naslova.
- Struktura: naslovnica, tri direktorija, pet usluga, šest stranica o klinici, šest informativnih stranica, iskustva, FAQ, galerija, kontakti i dva pravna članka. Sačuvano svih pet portreta, 15 parova fotografija prije/poslije i 13 videa. Ne izmišljaju se prijevodi izgovorenog sadržaja videa.
- Nepotpuni generički SL adapter više nije uključen u objavljene rute. Postojeće `/si/<page-id>` putanje ostaju, ostale prate isti obrazac. HTML `lang` i hreflang koriste ispravan kod `sl`, izbornik prikazuje SI. Nema novih redirekcija.
- Nav, footer, obrasci, popup, WhatsApp, alt/ARIA, metadata, breadcrumb i recipročni jezični parovi koriste vlastiti slovenski sadržaj. Urednički interlinkovi i dalje se odgađaju; navigacija, kontakti, pravne i potvrđene vanjske poveznice ostaju aktivni.
- Izostavljen je zaostali talijanski urednički naslov `p68` (Prima visita gratuita); koristi se slovenski `p69`. Dvojezični naslov galerije `p251` uzima slovenski dio nakon `/`. Ostali dostavljeni tekstovi ostaju sačuvani.
- Podnaslov logotipa je „Reka, Hrvaška”, u širini logotipa, bez rastezanja razmaka među riječima. Pravilo je ograničeno na SL.

## Prethodno potvrđene poslovne iznimke

- `t5.r0.c0.p10` navodi zastarjelih 330 €, dok naslovnica i FAQ imaju 220 €. Primijenjena je prethodno odobrena cijena krune od 220 €; DOCX nije mijenjan.
- `t15.r4.c0.p10` navodi stari SWIFT ZABAHR2X; koristi se već potvrđeni Erste ESBCHR22. IBAN, primatelj i izvorna PDF417 slika nisu mijenjani niti ponovno generirani.
- Iznosi imaju jedinstveni razmak prije €; četveroznamenkasti iznosi iz SL izvora normalizirani su na isti prikaz s točkom kao na HR. Vrijednosti su povezane s potvrđenim zajedničkim poslovnim podacima.
- Kontakti, uključujući it@dentvitalis.com i odvojene podatke za liječenje/kontrole, dolaze iz dostavljenog izvora. Povijesni pravni kontakti ostaju zasebni.
- Točan naslov rada dr. Ane povezan je na već potvrđeni DOI, bez promjene teksta izvora.

## Pravni izvor

Aktualni javni slovenski članci dohvaćeni su jednom. Izvorni HTML bajtovi i SHA-256 sačuvani su u `reference/legal-public/2026-09-23/`; `scripts/audit-legal-public.mjs --sl` izvlači sadržaj u `src/content/sl/legal-public.json`. Izvorni HTML/CSS/JS ne koristi se kao aplikacijski kod.

- `/si/politika-zasebnosti`: `b99064dfca30c77ab7c31d0e79641496e2f1ee03a4ff74c0150ebe91c4ce9516`.
- `/si/pogoji-uporabe`: `1f4e6619a9693a851e84a6e1b4c3d983cca1503cdd0adbd8b4efa29486692c37`.
- Sačuvani su cijeli tekst, isticanja, poveznice, hijerarhija i popisi. Privatnost ima 12 H2, 9 H3 i 8 H4 naslova, pet nenumeriranih i šest slovno numeriranih popisa. Koriste se postojeći fontovi i pune jednake točke. „Zavrnitev odgovornosti” je podnaslov uvjeta.
- Primjenjuje se postojeća zajednička korekcija pogrešnog izvornog telefonskog hrefa: odredište odgovara prikazanom +38551371064. Test usporedbe s izvornikom bilježi tu iznimku.

## Otvorene napomene izvora, bez samovoljnog mijenjanja

Slovenski `p224` opisuje +385 51 688 380 kao „brezplačno številko”, a izvor spominje pogodnosti plaćanja za hrvatske pacijente. To je dostavljeni prijevod; nije izmišljena niti proširena pogodnost za slovensko tržište. Za eventualnu sadržajnu korekciju potreban je vlasnik. Pravne članke tehnički vjerno prenosimo, što nije potvrda njihove pravne usklađenosti.

## Provjere

Namjenski SL testovi provjeravaju svih 27 ruta, svaki neprazni tablični odlomak i samostalna iskustva, fotografije, galeriju, videe, poveznice i sidra, telefonska obavezna polja, pet recipročnih jezika, stvarne klikove i mobilni/desktop prikaz. Pravni test uspoređuje puni sadržaj, popise, isticanja i linkove s nepromjenjivim izvorom. Postojeće HR/DE/EN provjere čuvaju regresije.

Lokalni rezultat: svih devet SL provjera prolazi nakon ispravke prikaza cijene u hero naslovu i preciznog podešavanja širine slovenskog podnaslova logotipa. Dodatne 42 HR/DE/EN/header/pravne regresijske provjere prolaze. Astro check: 218 datoteka, bez grešaka/upozorenja; ciljani ESLint i oba locale-source testa prolaze. Build: 137 stranica (136 sadržajnih + 404). Pregledano svih 27 SL stranica na 390 i 1440 px te desktop navigacija na 1200 px; 82 snimke hero/sadržajnih prikaza, bez konzolnih grešaka, horizontalnog overflowa ili prelijevanja naslova. SHA-256 izvornog DOCX-a i Git LFS integritet potvrđeni. Privremene QA snimke ostaju izvan builda i Gita. Nakon GitHub pusha slijedi zasebna provjera javnog deploymenta.
