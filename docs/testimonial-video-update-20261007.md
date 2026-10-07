# Video testimoniali — 7. listopada 2026., V20

## Odobreni opseg

Vlasnikov prilog (SHA-256
`b582b6552222ef350a5c2f95443773004488f73c85f9ceb9445856e2f3437866`)
odobrava deset novih videa u svih pet jezika, ispravak Lucilla Cecchini i
jezične caption/player parametre. Izvorni sadržajni JSON/DOCX snapshotovi
nisu prepisani. Centralna odluka je
`data/testimonial-video-replacements-20261007.json`; IT runtime blokovi
primjenjuju točno deset zamjena, a ostali jezici dijele iste blokove.

| Pacijent                           | Stari ID    | Novi ID     |
| ---------------------------------- | ----------- | ----------- |
| Lucilla Cecchini                   | H-FtIARwy9o | z4sEEQUWAs4 |
| Anna Giacomin                      | Af4nKAWScLU | K78IOiDfiPs |
| Maria Garotti                      | 0FPxrnc8LgY | p02SmXADXCw |
| Maurizio Vegro                     | tOvIrmjGjxc | QBqpvcDtvx8 |
| Cinzia Caffarra, Fabrizio Gualerzi | hhyIS4OW1LY | KK5fPqNqo9c |
| Giacomo Muggianu                   | bqx36O-ctGg | 29kA08KzJHw |
| Gianna Masoni                      | vHh4413VRV0 | MIA-O7GdMjw |
| Lorena May Ruzol                   | Pf8xKv1UvzU | K6OtVri5zAw |
| Vito Mastromatteo                  | E_KlE7e9h-M | 452tZxIJT0o |
| Maria Alba Seddone                 | 9eoJ0-6wa4M | wiOuwYc_dzg |

Lorenzo Fabbro (`zyUCJSaCPgQ`), Valerio Catani (`Zs_gwP-7iuc`) i Nilo
Falchi (`fzDUHdfqXfo`) čuvaju iste kartice, postere, datume i player URL
`?autoplay=1`. Nove jezične parametre ne primjenjivati na njih.

| Jezik | Ruta                                | `cc_lang_pref` / `hl` |
| ----- | ----------------------------------- | --------------------- |
| IT    | `/testimonianze`                    | `it`                  |
| HR    | `/hr/iskustva-pacijenata`           | `hr`                  |
| EN    | `/en/testimonials`                  | `en`                  |
| DE    | `/de/erfahrungen-unserer-patienten` | `de`                  |
| SL    | `/si/izkusnje-pacientov`            | `sl` (ne `si`)        |

Svaki novi iframe ima `autoplay=1&cc_load_policy=1&cc_lang_pref=JEZIK&hl=JEZIK&playsinline=1&rel=0`,
patient title, traženi allow/allowfullscreen i
`referrerpolicy=strict-origin-when-cross-origin`. SSR `data-embed-src`
escapea ampersande; DOM vraća obični URL. Iframe postoji tek nakon klika
ili Entera. Nema novog SDK-a ni unaprijed učitanih playera.

## Izvori i schema

- `scripts/prepare-testimonial-replacement-posters.mjs`: deset stvarnih
  `maxresdefault.jpg` slika novih ID-jeva (1280×720), sačuvani originali u
  `source-assets/external-images/2026-10-07/youtube/`, SHA-256/veličine u
  manifestu. Deset novih WebP-ova u `public/assets/images/`; svaki se
  hashom razlikuje od starog postera. Postojećih trinaest asseta nije mijenjano.
- `node scripts/refresh-video-metadata.mjs --replacements`: deset novih
  `publishDate` vremenskih oznaka iz javnog YouTube microformata, sa stvarnom
  zonom; stare tri metadata stavke zadržane doslovno. Raw cache je privatni
  `.astro/audits/video-metadata-2026-10-07/`, izvan Gita/builda.
- Po stranici i dalje 13 VideoObject zapisa: novih deset `@id`, embed,
  thumbnail, datum i Lucillin naziv/opis; opisi koriste postojeći lokalni
  naslov sekcije + pacijentov natpis, bez preuzimanja punih YouTube opisa.
  Ostali schema podaci, lokalizirani copy, Google/tekstualne recenzije,
  kontakti i forme ostaju isti.

Službeni parametri:
[YouTube player documentation](https://developers.google.com/youtube/player_parameters).
`cc_lang_pref` traži odgovarajuću traku, `cc_load_policy=1` uključuje titlove;
stvarnu dostupnost/personalizaciju određuje YouTube. `rel=0` ne uklanja
sve završne preporuke, nego ih ograničava na isti kanal.
[Google video structured data](https://developers.google.com/search/docs/appearance/structured-data/video).

## Dokazi i granice prihvata

18 ciljnih Playwright Chromium provjera prolazi: svih 13 kartica u svih
pet jezika na 390/1440 px, svih 50 novih URL-ova, no-iframe-before-click,
Enter/klik → jedan iframe, lokalne slike/decode/16:9, localized ARIA/title,
bez overflowa, framework overlaya ili relevantnih lokalnih konzolnih grešaka.
Schema svih pet ruta i datumi s vremenskom zonom provjereni. Test iframe
odgovor je presretnut radi determinističke provjere našeg koda — to nije
potvrda stvarne reprodukcije niti svih ručnih titlova.

Live pokušaj iz HR stranice s ispravnim Refererom prikazuje YouTube
„Prijavite se kako biste potvrdili da niste bot”; reprodukcija iz
automatiziranog okruženja nije potvrđena. Izravno otvaranje embed URL-a
bez referera vraća 153 i nije mjerodavna reprodukcijska provjera.
Vlasnik je 7. listopada kroz HR public Codespaces preview izričito potvrdio
da **prvi novi video Lucilla Cecchini radi i hrvatski titlovi su uključeni**.
To nije dokaz za preostalih 49 video/jezik kombinacija. Ni bot-check ni 153
se ne zaobilaze skrivanjem/podmetanjem korisničkih identifikatora.

Browser skill/plugin nije dostupan; korišten postojeći Playwright. Desktop
IT i mobilna HR snimka prve kartice vizualno pregledane, bez rastezanja;
privremeni `/tmp/dv-v20-*-poster.png` nisu trajna artifact pohrana.

## Paket i cPanel

`scripts/package-testimonial-video-update.mjs` SHA-256 verificira V15/V16/
V18/V19 ZIP-ove i za svih 142 HTML-a dopušta samo deset video kartica,
player initializer i odgovarajuće VideoObject promjene u pet testimonial
stranica. Koristi prethodne HTML bajtove, pa i form UUID-evi ostaju isti.
Tri zadržane kartice moraju biti bajtno iste. Postojeći `_astro` i svi
stari image asseti hashom ostaju isti.

Paket `dentvitalis-testimonial-videos-20261007-v20.zip`: **16 javnih datoteka**
(pet HTML-a, deset novih WebP-a, manifest), payload **1.652.059 B**, plus
privatni README/patch manifest. Novi asseti prvo, pet HTML-a zatim,
manifest posljednji. Backup samo šest postojećih datoteka 0700, postojeći
`public_html` ostaje 0750, bez renamea/zamjene cijelog `_pages`.
Precizan kvota/backup/hash/rollback i javni prihvat u README-u unutar ZIP-a;
receipt `data/seo/testimonial-videos-v20-release-20261007.json` nakon pakiranja.

Ova dorada je pripremljena za update, **nije instalirana na produkcijski
cPanel**. Ne dirati backend/CRM/forme, GTM, CookieYes, Elfsight, PHP,
`.htaccess`, sitemap/robots ili DNS. Ne slati nove TEST upite.
