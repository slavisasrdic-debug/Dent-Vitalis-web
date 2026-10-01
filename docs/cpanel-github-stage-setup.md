# GitHub → cPanel: status prijenosa

Važeći postupak nalazi se samo u [cPanel runbooku](cpanel-migration-runbook.md).
Dokazi i uvjeti ponavljanja su u `data/migration-readiness.json`.
Ovaj dokument objašnjava postojeći workflow; nije zasebna procedura objave.

## Što je trenutno moguće u projektu

`.github/workflows/stage-cpanel-release.yml` ručno gradi **preview artifact**
i odvojeni artifact dvaju privatnih PHP dodataka. Preview nema produkcijski
`.htaccess` i ostaje `noindex`; ne aktivirati ga na domeni.
Privatni dodaci ne uključuju konfiguraciju ili podatke pacijenata i ne idu u
`public_html`. Produkcijski paket priprema se zasebnom naredbom iz runbooka.

## SSH put je pauziran, ne ponavljati bez novog dokaza

Panel traži administratorsko omogućavanje shella; nisu potvrđeni hostname,
port, pristup ni ključevi. SSH login i stage nisu testirani. `sshd: up` nije
dokaz pristupa računu. Postojeći stage kod ostaje sačuvan, ali zahtjev
`stage_to_cpanel=true` zaustavlja se prije builda i povezivanja.
Zadani `false` izrađuje samo preview artifact i ne pristupa cPanelu.

Ne generirati ključeve, tražiti SSH od podrške ili unositi SSH tajne kao
preduvjet migracije. Put se ponovno razmatra samo uz novu izričitu odluku
vlasnika i dokaz dostupnog pristupa, nakon izmjene zaštite i testova.
Nema koraka koji automatski prepisuje `public_html` ili `application`.

## Trenutačni smjer bez zahtjeva hostingu

Agent je potvrdio otvoreni **Security → Manage API Tokens** i navedenu podršku
za API 2/UAPI. Ta provjera je završena; token nije stvoren, API pozivi nisu testirani.
Git Version Control prikazuje 0 repozitorija; prethodni način objave nije utvrđen.

Pripremljen je zaseban ručni `.github/workflows/probe-cpanel-api.yml`:
jedan API 2 metadata GET, bez čitanja sadržaja i serverskih izmjena.
Vlasnik je odobrio token, zaštićenu pohranu, read-only test i nastavak migracije.
Workflow još nije pokrenut. Pokušaj stvaranja GitHub environmenta iz ove sesije
vratio je **403: Resource not accessible by integration**; ne ponavljati isti
poziv bez promjene pristupa. Agent u browseru treba dovršiti postavke i token
prema odobrenom zadatku u runbooku. Ovdje nema cPanel browser sesije ni tokena.
To nije produkcijski deploy niti dokaz upload/backup/activation/rollback uspjeha.
Konfiguracija, odobrenje i sljedeći test opisani su samo u runbooku.
Ako API operacije ne prođu prihvat, nastaviti File Managerom uz iste gates;
SSH i symlink nisu obvezni.

GitHub ostaje izvor koda; svaki push nije objava. Produkcija ostaje na istom
cPanel hostingu. Privatni backupovi, SMTP/CRM tajne i `application/data`
nikada nisu GitHub artifacti.
