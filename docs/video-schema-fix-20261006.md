# Video structured data — 6. listopada 2026.

Vlasnik je odobrio ispravak tri Search Console upozorenja: nedostaje opis,
datum objave bez vremenske zone i neispravan datetime. Prethodni generator
objavljivao je samo potvrđeni dan `YYYY-MM-DD`, a nije dodavao `description`.
Prethodni test je pogrešno zahtijevao upravo day-only format.

## Izvori i granica promjene

- Svih 13 `uploadDate` vrijednosti u `data/video-metadata.json` sada doslovno
  dolazi iz javnog YouTube `playerMicroformatRenderer.publishDate`: vrijeme
  prve objave i originalna zona. Dan je provjeren prema prethodnom prihvatu;
  ni vrijeme ni zona nisu izmišljeni niti izvedeni iz vremena migracije.
- Svaki zapis čuva URL, izvorno polje, datum dohvata i SHA-256 cijelog izvora.
  Reproducibilan read-only dohvat: `node scripts/refresh-video-metadata.mjs`.
  Raw cache ostaje u `.astro/audits/video-metadata-2026-10-06/`, izvan Gita/builda.
- Opis je postojeći vidljivi jezični naslov video-sekcije i postojeći caption,
  npr. `Video iskustva pacijenata: Lucilla Cecchin`. Bez izmišljanja recenzije,
  medicinskih tvrdnji, novih prijevoda ili promjene vidljivog sadržaja.
- Generator odbija datum bez vremena/zone, nevaljan datum i prazan opis.

## Predaja V16

Provjereno: Astro check bez grešaka/upozorenja, ciljani ESLint, produkcijski
build 142 stranice i devet Playwright testova (13 izvornih datuma, odbijanje
nevaljanih datuma/opisa, svih 65 video oznaka na pet jezika, postojeći SEO
audit 55 stranica te HR FAQ/ponude/osobe/video). Nema slanja formi/poruka.
Završna usporedba 142 HTML-a s V15 potvrđuje samo dvije izmjene video oznaka;
postoji pet izmijenjenih stranica, sve ostale schema oznake ostaju iste.

`scripts/package-video-schema-update.mjs` uspoređuje svih 142 produkcijskih
HTML-a s hash-provjerenim V15 ZIP-om. Paket zamjenjuje samo JSON-LD u pet
postojećih HTML-a i ažurira manifest. Izvan JSON-LD bajtovi ostaju identični,
uključujući forme, widgete, tracking, CSS i sadržaj. Izmjena svih 65 oznaka
provjerava se prema 13 izvornih video zapisa. Assets ostaju hash-identični.
`--check-only` provjerava opseg bez izrade ZIP-a.

Instalacija i povratak po šest datoteka opisani su u README-u paketa; ne
mijenja se cijeli `_pages`, `public_html`, PHP, CRM, GTM, CMP ili sitemap.
Objava se radi zasebno kroz cPanel agenta, nije posljedica Git pusha.

Nakon objave: Google Rich Results Test za svih pet stranica i **Validate fix**
u Search Console Videos izvještaju. Lokalni test nije Googleova potvrda;
ponovni crawl i nestanak upozorenja nisu trenutačni niti zajamčuju rich result.
[Službena Google pravila](https://developers.google.com/search/docs/appearance/structured-data/video).
