# cPanel release runbook

## Važeća procedura — 1. listopada 2026.

Ovo je jedina operativna procedura. Dokazi i statusi čuvaju se u
[data/migration-readiness.json](../data/migration-readiness.json), posebno
`procedure`. Prijašnji prijedlozi u Git povijesti nisu nalog za ponavljanje.
GitHub je izvor koda; produkcija ostaje na postojećem cPanelu, bez promjene DNS-a.
Cloudflare služi samo razvojnom pregledu.

**Aktualni smjer:** bez zahtjeva hosting podršci i bez pretpostavljenog SSH-a.
API priprema je završena, ali prvi test veze nije prošao. Nastaviti pripremu
ručnim File Managerom; API automatizacija je pauzirana. Ni jedan put još nije izvedbeno
potvrđen za objavu. SSH nije opći preduvjet migracije. Jedna GitHub akcija za
produkcijsku objavu još nije implementirana; backup i forme ostaju release gates.

### Evidencija — što ne ponavljamo bez novog razloga

| Stavka                                                     | Dokaz/status                                                                                    | Kada ponoviti                                                                                  |
| ---------------------------------------------------------- | ----------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| Lokalni produkcijski paket, manifest, CRC, routing i forme | Lokalno prošlo za kandidat `af6dc28`; nije dokaz dostave                                        | Promjena koda, paketa ili stvarnih serverskih pravila                                          |
| Lokalni ZIP starog weba                                    | CRC prošao prema agentu; nema `application/data` ni baze bloga                                  | Promjena arhive ili prihvat novog kompletnog backupa                                           |
| File Manager / Extract                                     | Read-only pregled UI-ja; upload i raspakiravanje nisu izvršeni                                  | Zasebno odobren kontrolirani test izvan javnog direktorija                                     |
| SSH/shell i SSH stage                                      | Panel traži administratorsko omogućavanje; bez prijave i ključeva                               | Samo nova izričita odluka i dokaz da je pristup omogućen                                       |
| Symlink switch                                             | Postojeći `www → public_html` nije dokaz; switch nije testiran                                  | Samo ako odabrani postupak stvarno zahtijeva link i postoji novi dokaz                         |
| cPanel API tokeni                                          | Token stvoren/pohranjen prema agentu; prvi run nije prošao vezu. Autentifikacija nije potvrđena | Novi dokaz o transportu prije novog pokušaja; ne stvarati novi token i ne ponavljati isti test |
| Git Version Control                                        | Agentov prikaz: 0 repozitorija; raniji “Upload pa Deploy” nije identificiran                    | Samo novi dokaz ili odluka o odabranom postupku                                                |
| JetBackup restore, PHP/FPM, cookieji, e-mail i CRM         | Prikaz/izvor postoji; stvarni prihvat još nije proveden                                         | Odobreni test s dokazom, ne ponovno čitanje istih statistika                                   |
| Dvije dodatne pune kopije                                  | Procjena `813,96 MB` gotovo troši prijavljenih `866 MB`                                         | Nova izmjera ili promjena politike/prostora; ne pokušavati isti raspored                       |

Ne označavati `nije provjereno` kao `ne radi`, niti UI/prikaz kao uspješnu
operaciju. Nakon svakog koraka zapisati datum, točan release/input hash,
izvedenu radnju, vrstu dokaza, rezultat, otvorene stavke i uvjet ponavljanja.
Ne prepisivati ranije read-only nalaze novim tvrdnjama o produkcijskom testu.

Lokalna provjera procedure: `npm run test:migration-procedure` provjerava API
ograničenja i zaustavljanje SSH puta na testnim odgovorima, bez pristupa cPanelu.
Workflow datoteke provjeriti kao YAML; njihov prolazak lokalnih provjera nije
dokaz izvršavanja na GitHubu ili dostupnosti serverskih operacija.

### API — priprema završena, prvi test veze nije prošao

Vlasnik je odobrio token, sigurnu pohranu, read-only test i nastavak migracije.
Odobrenje ne zatvara release gates, ne mijenja DNS niti dopušta prepisivanje
privatnih podataka. Ne ponavljati potvrđene korake pripreme.

- Agent: `dentvitalis-migration-20261001` stvoren i spremljen samo u environment
  secret `cpanel-api-readonly/CPANEL_API_TOKEN`; istek `8. 10. 2026. 23:59:59`
  prema cPanelu, vremenska zona nepotvrđena. Vrijednost tokena nije dostavljena
  ovom agentu. Secret metadata API i dalje vraća 403; pohrana je agentov nalaz.
- Neovisni GitHub GET potvrđuje reviewer-a `slavisasrdic-debug`, dopušten
  vlastiti review, `can_admins_bypass=false`, samo branch `main`, bez tagova.
- [Run #1](https://github.com/slavisasrdic-debug/Dent-Vitalis-web/actions/runs/36861772566)
  na commitu `44c2c9b` neovisno je potvrđen kao `failure` u metadata koraku:
  `Read-only cPanel request failed: network, timeout or TLS.` Nije ponovljen.
  **Autentifikacija i metapodaci nisu potvrđeni.** Deprecation upozorenje Node
  action runtimea samo po sebi nije dokaz uzroka ove greške.
- Jedan credential-free Codespaces test: DNS radi; `dentvitalis.com` i `www`
  imaju IPv4 `89.201.174.71`; HTTPS javnog weba vraća 200. TCP na port 2083
  završava curl greškom 28 nakon 5 sekundi, bez uspostavljene veze/TLS-a.
  To nije test s GitHub runnera i ne utvrđuje njegov točan uzrok ili firewall
  politiku. Ne tvrditi da je token neispravan ili da je potvrđena TLS greška.

API automatizacija je pauzirana. Ne ponavljati isti autentificirani run,
stvarati/zamjenjivati token, isključivati TLS ili slati token alternativnom
hostu. Novi pokušaj traži novi dokaz o transportu ili promjenu dostupnosti.
Ne pokretati SSH niti tražiti promjene hostinga kao automatski preduvjet.
Raniji GitHub environment PUT s ovom integracijom bio je 403; browser agent je
naknadno dovršio postavke. Razlikovati ta dva nalaza i ne ponavljati PUT.
Token ostaje osjetljiv račun-wide pristup, ne read-only ključ. Opoziv ili
produljenje nakon odluke o API putu zasebno evidentirati; ne raditi ih prešutno.

### Sljedeći zadatak agentu — File Manager, backup i privatni stage

Vlasnik je izričito odabrao File Manager. Ovaj zadatak nastavlja odobrenu
migraciju, ali **ne aktivira novi web**.
Ako browser alat zahtijeva neposrednu potvrdu prije zapisa, navesti točnu
radnju i privatnu ciljnu putanju. Ne zaobilaziti njegovu sigurnosnu potvrdu.

1. Ne stvarati token niti pokretati GitHub API/SSH testove. Prije kompresije i
   uploada provjeriti aktualni prostor, kvotu i dostupni inode prikaz; zadnja
   procjena nije aktualna garancija. Ako podatak nije dostupan, prijaviti to.
   Ne oslobađati prostor brisanjem bloga, poruka, logova, koša ili backupa.
2. U privatnom `/home2/dentvita/backups/pre-migration-20261001/` napraviti
   arhivu trenutačnih `public_html`, cijelog `application` **uključujući `data`**,
   i roditeljskog `.htaccess`. Postojeću arhivu ne prepisivati. Ne otvarati
   poruke pacijenata ili prikazivati konfiguraciju/tajne. ZIP bez `data` nije
   dovoljan; JetBackup prikaz nije zamjena za provjeren privatni backup.
3. Preuzeti backup na vlasnikovo privatno računalo, provjeriti CRC i obnovljivost
   lokalnim raspakiravanjem u odvojenu privatnu mapu, uz ključne datoteke i
   direktorije. Ne raspakiravati dodatnu punu kopiju na ograničeni hosting.
   Vratiti putanje, veličine i SHA-256 gdje je alat dostupan, ne sadržaj poruka
   ili konfiguracije. Ne slati privatni backup u chat, GitHub ili javni artifact.
   To je backup weba/backenda, ne dokaz kompletnog cPanel računa ili baze bloga;
   baze i druge servise ne mijenjati.
4. Tek nakon verificiranog backupa prenijeti **javni statički ZIP**
   `dentvitalis-web-production-candidate-20261001-af6dc28.zip` u novi privatni
   `/home2/dentvita/releases/20261001-af6dc28/`, pa raspakirati tamo. Arhiva:
   `57.946.023 B`, SHA-256
   `33096bf3b41bae18a408f4e0ada7ccd2ba3563098111dd289bc4b04fc7f1c7a9`.
   Ne prenijeti preview artifact ili privatni PHP ZIP kao javni web. Ako cilj
   postoji, ne prepisivati ga. Ne premještati/prepisivati `public_html`.
5. Potvrditi ispravan korijen s `index.html`, `.htaccess`,
   `release-manifest.json`, 691 payload datotekom + manifestom, ukupno
   `65.436.532 B` logičnih bajtova. Ne pribrajati uploadani ZIP ekstrakciji.
   Provjeriti integritet dostupnim sigurnim alatom; ako server hash provjera
   nije moguća, to ostaje otvoreno — UI popis nije SHA-256 potvrda.
6. Vratiti rezultat backupa i stagea, što je zaista provjereno, otvorene
   stavke i potvrdu da javni web/backend nisu mijenjani. **Stati prije aktivacije**,
   instalacije PHP dodataka i testnih upita. Slijedi zaseban prihvat PHP/sesije,
   stvarne dostave e-maila/CRM-a i procedure povratka iz ostatka runbooka.

Dokumentacija cPanela potvrđuje [API tokene](https://docs.cpanel.net/cpanel/security/manage-api-tokens-in-cpanel/)
i [UAPI upload](https://api.docs.cpanel.net/guides/quickstart-development-guide/tutorial-use-uapis-fileman-upload-files-function-in-custom-code).
Za [Fileman fileop](https://api.docs.cpanel.net/cpanel-api-2/cpanel-api-2-modules-fileman/cpanel-api-2-functions-fileman-fileop)
kopiranje/premještanje/raspakiranje dokumentirano je u zastarjelom API 2,
bez navedenog ekvivalentnog UAPI-ja. Zato puni deploy/rollback ne proglašavati
spremnim samo na temelju dostupnosti tokena. Ne slijediti primjere koji
isključuju TLS provjeru. Ne spremati account lozinku ili token u kod, artifact
ili chat. Ne stvarati javni PHP “deploy” endpoint kao zaobilazno rješenje.
Za GitHub zaštite koristiti [environment postavke](https://docs.github.com/en/rest/deployments/environments)
i [branch policy](https://docs.github.com/en/rest/deployments/branch-policies).

### Postupak prve objave i redovnih izmjena

1. Odabrati provjereni GitHub commit i produkcijski paket, ne preview artifact.
2. Verificirati puni privatni backup starog javnog weba i backenda, uključujući
   podatke, te zaštićenu kopiju izvan servera. Potvrditi povratak i rezervu kvote/inodeova.
3. Kontrolirano pripremiti privatne PHP dodatke i testirati tokene/sesiju,
   runtime, e-mail i CRM prema niže navedenom prihvatu. Stvarno slanje traži
   zasebno odobrenje; JSON `ok` nije dokaz dostave.
4. Prenijeti paket u `/home2/dentvita/releases/<release-id>`, izvan javnog weba,
   potvrditi integritet i instalacijsku listu. Ako nema API-ja, to radi agent
   kroz File Manager uz odobreni opseg. Postojeći web ostaje aktivan tijekom prijenosa.
5. Nakon zatvorenih gates i vlasničkog odobrenja aktivirati odabranim,
   testiranim postupkom. Sačuvati bootstrap, privatni backend, konfiguraciju
   i potrebne verifikacijske datoteke. Ne prepisivati cijeli `public_html` naslijepo.
6. Provjeriti sve jezike, forme, potvrde, redirekcije, sitemap, consent i tracking.
   Za automatske provjere koristiti potvrđena očekivanja; predvidjeti ručni
   prihvat stvari koje HTTP status ne dokazuje. Na grešku vratiti kodnu verziju
   i provjeriti da je povratak stvarno uspio.
7. Za kasnije javne izmjene čuvati dvije prethodne verificirane statičke
   verzije. Nepromijenjeni PHP ostaje zajednički uz zaseban privatni backup.
   Ne brisati povratne verzije prije prihvata nove niti automatski vraćati podatke.

### Potvrđeni raspored, veličine i zaštita podataka

- `/home2/dentvita/public_html`: javni web; `index.php` učitava privatni
  `../application`. Odabrani način aktivacije mora sačuvati tu vezu.
- `/home2/dentvita/application`: PHP, vendor, konfiguracija i `data/`.
  `/send`, `/gct` i novi `/form-tokens` moraju ostati pod PHP bootstrapom.
- Kandidat `af6dc28`: ZIP `57.946.023 B`; 691 payload datoteka
  `65.311.606 B` + manifest `124.926 B` = 692 datoteke/`65.436.532 B`.
  Dokumentacijski commit ne regenerira taj ZIP niti mijenja njegov commit.
- Agentov Disk Usage: `public_html 167,63 MB` (blog `155,19 MB`),
  `application 239,35 MB` (`data 234,61 MB`: log `82,78 MB`, mail
  `151,83 MB`). Vrijednosti mogu kasniti i nisu byte/inode inventar.
- JetBackup: 12 prikazanih kopija, najnovija `1. 10. 2026. 02:35`, vremenska
  zona nepotvrđena, “Local backup SATA”. Snapshot sadrži javni i privatni
  direktorij, ali restore i off-server kopija nisu potvrđeni.
- PHP za domenu je 7.4/FPM; sustavni default 8.1 i prikaz INI limita nisu
  dokaz efektivnog runtimea. Ne nadograđivati PHP usput.
- Backup privatnih podataka nije isto što i rollback koda. Automatski povratak
  ne prepisuje `application/data`, SMTP/CRM konfiguraciju ni vanjski CRM.
  Povratak PHP koda zahtijeva zaseban kompatibilan postupak.
- Ne brisati blog, logove, poruke, koš ili backupove radi prostora bez
  zasebnog odobrenja. Arhive u `.trash/` nisu pouzdani trajni backupovi.

## Release gates

Detaljna dopuna od 1. listopada nalazi se u `data/migration-readiness.json`
i `docs/form-delivery-migration.md`. Statički paket nije samodostatan za forme:
`/form-tokens` i upload guard posebno se instaliraju u privatni `application`.
Release manifest čuva njihove očekivane SHA-256 i jasno označuje da ih nije
instalirao. Ti PHP izvori nikada ne idu u `public_html` ili Pages build.

Prije promjene servera treba postojati:

1. Točan commit na `main` i provjeren paket. `npm run release:prepare` zadano
   izrađuje preview paket; za aktivaciju na domeni koristiti zasebnu
   `release:prepare:production` naredbu opisanu niže. Naredbe grade `dist/`,
   provjeravaju ugovor obrazaca i dodaju `dist/release-manifest.json`
   (SHA-256 i veličina svake objavljive datoteke). Manifest je zapis releasea,
   ne tajni i ne commitira se.
2. Prije prve migracije verificiran kompletan backup trenutačnog `public_html`
   i `application`, uključujući privatne podatke, izvan javnog direktorija.
   Za kasnije rutinske objave dvije prethodne provjerene kodne verzije izvan
   javnog direktorija, uz zaseban zaštićeni backup privatnog backenda i podataka.
   Statički rollback ne prepisuje `application/data`.
3. SHA-256 manifest backupa i provjeren postupak vraćanja posljednje verzije.
4. Potvrđen PHP runtime, `curl`, `mbstring`, session, `upload_max_filesize` i
   `post_max_size` za produkcijski handler.
5. Potvrđena odluka o form bridgeu: za ovaj release zadržava se postojeći
   application bootstrap. Statični klijent na stvarnoj domeni uzima `/form-tokens`,
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

Legacy bajtovi ostaju iza našeg označenog bloka, osim izričito odobrenih
uklanjanja opisanih ispod. To nije dokaz da je
cjelokupni static/PHP bridge spreman: prije aktivacije treba pregledati stvarni
bootstrap, redoslijed ostalih pravila i postojeće Force HTTPS postavke na hostingu.
Testirati stvarni HTTPS status u Apacheu; ne vjerovati klijentskom
`X-Forwarded-Proto` zaglavlju. Ako hosting ima reverse proxy, prvo potvrditi kako
sigurno prenosi HTTPS status, inače postoji rizik redirect petlje.

Provjere: `npm run test:deployment`; stvarni Apache HTTP/TLS testovi u izoliranom
Dockeru: `npm run test:deployment:apache`. Ne šalju ništa klinici ni CRM-u.
URL migracije iz `data/redirects.csv` ostaju zasebne, neodobrene odluke.

### Dostavljena konfiguracija — 1. listopada 2026.

Vlasnik je dostavio tekst postojećeg `.htaccess`: 5.129 B, 67 redirekcija,
SHA-256 `ffe96dfc4c95363b3eb8a155e4b1da71b0aba5c4e92a2fd0e5e378b726d6fbd5`.
Prije instalacije usporediti dostavljenu kopiju sa stvarnom server datotekom.
Izvor ostaje izvan Gita i ne mijenja se. Vlasnik je zasebno odobrio uklanjanje
dviju istih redirekcija `/hr/iskustva-pacijenata` → `/hr/testimonials` samo iz
novog paketa, jer presreću novu odobrenu stranicu. Ostali bajtovi ostaju isti.
Odluka i broj dopuštenih uklanjanja nalaze se u `data/migration-readiness.json`.
Novi neodobreni `Redirect` koji presreće poznatu stranicu ili form handler
prekida pripremu paketa, umjesto da se tiho briše.

Stari `ExpiresDefault` dodavao je `max-age=604800` i odgovorima formi.
Naše pravilo zato isključuje `mod_expires` samo za četiri dinamičke form rute,
uz `no-store`; cache slika, fontova i ostalih datoteka nije ovom dopunom mijenjan.

Regression s dostavljenom konfiguracijom:

```bash
DENTVITALIS_LEGACY_HTACCESS=/absolute/path/to/server-backup/.htaccess npm run test:deployment:apache
```

Izolirani standardni Apache nema cPanel PHP handler ni mod_pagespeed: samo u
testnoj kopiji `ModPagespeed off` zamjenjuje se komentarom, a lažni `index.php`
poslužuje se kao tekst. Produkcijski paket zadržava oba serverska direktiva.
Ovaj test potvrđuje routing/cache, ne stvarni PHP runtime ili SMTP/CRM dostavu.
Deset starih odredišta nema novu statičku stranicu; njihov popis ostaje u
readiness podacima za pregled, bez automatskih novih 301/410 odluka.

## Form bridge acceptance

### Serverska dopuna prije aktivacije

1. Sačuvati i verificirati cijeli `public_html` i `application` izvan javnog
   direktorija. Ne arhivirati poruke u javni release niti slati tajne u GitHub.
2. Privatne dodatke iz `server/application/view/template/` postaviti u isti
   `application/view/template/` direktorij. U stvarni `/send` uključiti guard
   tek nakon usporedbe izvora i backupa; ne prepisivati cijeli handler.
3. Provjeriti `GET /form-tokens` bez slanja upita: JSON, postojeći session,
   ne-prazni CSRF/GCT, `no-store`, zabrana cross-site čitanja. Provjeriti
   instalirani hash i efektivne cookie postavke, bez zapisivanja tokena.
4. Potvrditi PHP 7.4/FPM i `curl`, `mbstring`, `session`, `openssl`, `fileinfo`.
   Lokalni PHP testovi nisu dokaz tog produkcijskog runtimea. Ne nadograđivati
   PHP usput bez zasebnog audita kompatibilnosti starog koda.
5. Provedba naših Apache pravila eksplicitno bira `index.html` prije očuvanog
   `index.php`, te `/send`, `/gct`, `/send-sconto` i `/form-tokens` šalje na PHP
   bootstrap bez static shadowinga i s `no-store` zaglavljem. `/send-sconto`
   privremeno ostaje sačuvan dok se ne potvrdi popis kampanja.
6. Tek uz zasebno odobrenje izvršiti stvarne testove dostave i rollback.
   `mail.test` i razvojni CRM hostovi nisu sami po sebi dokaz sigurnog testnog
   okruženja; prvo potvrditi vlasništvo i primatelje. Nikakav upit nije poslan
   ovom pripremom.

### CookieYes kroz postojeći GTM — odobreno 1. listopada 2026.

`TrackingBootstrap` učitava samo postojeći `GTM-K3QGWS`, i to samo na
`dentvitalis.com` / `www.dentvitalis.com`. Objavljeni GTM već sadrži CookieYes
za račun `d7e1f5db5a6fc013962bcb2d` i Consent Mode postavke. Po izričitoj
odluci vlasnika uklonjen je dodatni CookieYes loader iz novog weba. Ne dodavati
zasebne CookieYes, GA4 ili Ads skripte. Preview ne učitava ove integracije.
Mockirani browser test provjerava loader, ne potvrđuje stvarne privole ni
konverzije; to ostaje dio produkcijskog prihvata prije migracije.

### Thank-you adrese — provjera 1. listopada 2026.

Read-only pregled obuhvatio je 205 javnih odgovora: sitemap, linkane unutarnje
stranice i poznate kampanje. Potvrđeno je pet glavnih odredišta obrazaca:

| Jezik | Isti produkcijski URL                   | Izvorni obrasci                            |
| ----- | --------------------------------------- | ------------------------------------------ |
| IT    | `https://www.dentvitalis.com/grazie`    | Talijanske stranice; 40 pregledanih izvora |
| HR    | `https://www.dentvitalis.com/hr/hvala`  | Hrvatske stranice; 32 izvora               |
| DE    | `https://www.dentvitalis.com/de/dank`   | Njemačke stranice; 33 izvora               |
| EN    | `https://www.dentvitalis.com/en/thanks` | Engleske stranice; 33 izvora               |
| SI    | `https://www.dentvitalis.com/si/hvala`  | Slovenske stranice; 32 izvora              |

Javni GTM `GTM-K3QGWS`, objavljena verzija 94, sadrži **točne** Page Path
usporedbe tih pet adresa bez završnog `/`. Zato `thank-you-routes.ts` zajednički
definira odredišta formi. Vlasnik je zatim odobrio slashless URL-ove za sve
stranice. Postbuild prenosi sve generirane unutarnje HTML dokumente iz
directory outputa u `dist/_pages/`,
bez promjene bajtova. cPanel ih poslužuje internim rewriteom bez promjene browser
URL-a i bez DirectorySlash redirekcije. Build generira ista Pages proxy pravila
u `dist/_redirects`. Varijante sa završnim `/` vode na izvorni slashless URL.
Pages proxy odredište mora biti extensionless (`/_pages/hr/hvala`), dok Apache
koristi fizički dokument (`_pages/hr/hvala.html`). Inače Pages vraća dodatni
308 na internu adresu; ovaj rubni slučaj utvrđen je javnim HTTP auditom.
To ne dodaje zasebne conversion evente, GA4 ni Ads skripte.

`dist/page-routes.json` nastaje iz stvarnih build dokumenata i služi pripremi
istih cPanel pravila; ne smije se ručno održavati paralelan popis. Početni
`index.html`, `404.html` i asseti ostaju na svojim mjestima. Legacy `.htaccess`
dodaje se nakon našeg bloka uz samo zabilježena odobrena uklanjanja. PHP rute `/send` i
`/gct` nisu dio statičkog popisa i ostaju pod postojećim backend routerom.
Astro dev prihvaća obje varijante radi kompatibilnosti QA-a; stvarne 308
redirekcije provjeravaju se na Apache fixtureu i javnom Pages previewu.
Na Apacheu `RewriteOptions AllowNoSlash` i URI-ograničeni `DirectorySlash Off`
štite poznate statičke/uklonjene adrese čak i kada postoji stara fizička mapa.
Ostale direktorije i backend rute taj izuzetak ne zahvaća. Regresija uključuje
zaostale mape i potvrđuje da nepovezani legacy direktorij zadržava svoj 301.
Stariji `proposal-only` redirect izvještaji nisu aktivna konfiguracija; prije
migracije njihove sadržajne odluke i slashless odredišta treba ponovno potvrditi.

Pet Astro entry datoteka koristi jednu komponentu `ThankYouPage`, naše postojeće
stilove, layout i produkcijski tracking bootstrap. Potvrde su noindex i izvan
sitemapa; popup kontakt ostaje dostupan, bez drugog vidljivog inline obrasca.
Izvorni tekstovi, SHA-256 i odluke nalaze se u `data/thank-you-content.json`.
Vlasnik je odobrio njemački prijevod umjesto pogrešnog engleskog izvornog bodyja.

Pronađene su i dvije potvrde stare akcije, povezane iz
`/hr/registration-fb` i `/si/registracija-fb`. Vlasnik je izričito zatražio
**uklanjanje**, ne zamjenu: `/hr/hvala-akcija` i `/si/hvala-akcija` nemaju nove
HTML stranice niti preusmjeravanje na običnu potvrdu. Pages preview vraća 404,
a produkcijski cPanel blok vraća 410 Gone prije legacy fallbacka.
Ovaj rad ne briše ništa na sadašnjoj produkciji.

`form:preflight` odbija release bez svih pet potvrda i provjerava njihove
točne canonical putanje te noindex i success odredište svake forme.
Regresija `tests/thank-you.spec.ts` provjerava desktop/mobile, popup i pet
potpuno mockiranih submit → CSRF retry → success tokova. To nije dokaz stvarne
SMTP/CRM dostave ili Ads konverzije: prihvat stvarnih integracija ostaje prije
produkcijske objave, na način opisan niže.

### Legacy backend ugovor

Bridge mora omogućiti isti-origin tok bez izlaganja tajni klijentu:

1. `GET /form-tokens` vraća CSRF i GCT vezane uz isti postojeći server-side
   session. Legacy `/gct` ostaje radi starih potrošača.
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
