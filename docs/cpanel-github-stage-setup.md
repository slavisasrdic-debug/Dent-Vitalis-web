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
Browser agent je dovršio environment i pohranu tokena. GitHub zaštite neovisno
su potvrđene; secret vrijednost nije dostupna ovoj sesiji.
[Prvi run](https://github.com/slavisasrdic-debug/Dent-Vitalis-web/actions/runs/36861772566)
na `44c2c9b` završio je transportnom greškom, bez potvrđene autentifikacije.
Credential-free TCP test iz Codespacea timeouta na 2083 prije TLS-a; nije dokaz
točnog uzroka na GitHub runneru. API put je pauziran; ne ponavljati run ili token
bez novog dokaza. Nastaviti privatnim backupom i File Manager stageom iz runbooka.
Raniji environment PUT ove integracije bio je 403; ne ponavljati taj poziv.
To nije produkcijski deploy niti dokaz upload/backup/activation/rollback uspjeha.
Konfiguracija, odobrenje i sljedeći test opisani su samo u runbooku.
Ako API operacije ne prođu prihvat, nastaviti File Managerom uz iste gates;
SSH i symlink nisu obvezni.

GitHub ostaje izvor koda; svaki push nije objava. Produkcija ostaje na istom
cPanel hostingu. Privatni backupovi, SMTP/CRM tajne i `application/data`
nikada nisu GitHub artifacti.
