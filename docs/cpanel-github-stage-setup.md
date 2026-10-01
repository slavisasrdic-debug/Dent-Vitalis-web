# GitHub → cPanel priprema bez objave

Ovaj postupak samo šalje provjereni statični release u cPanel direktorij
`releases/`. Ne mijenja `public_html`, domenu, DNS, postojeći web, PHP obrazac,
e-mail ni CRM.

Workflow `.github/workflows/stage-cpanel-release.yml` radi isključivo ručno.
Ako se ne odabere `stage_to_cpanel`, izradi se samo GitHub artifact za ručni
download; nema mrežnog pristupa cPanelu.

Ovo je **preview stage**, ne produkcijski deploy. Artifact ostaje `noindex` i
bez produkcijskog `.htaccess`; ne aktivirati ga na domeni. Produkcijski paket
zahtijeva stvarni backup `.htaccess` i zaseban postupak iz runbooka.
Privatni backend dodaci preuzimaju se kao odvojeni artifact i nikada se ne
raspakiravaju u `public_html`.

## Odobrena buduća produkcijska objava — 1. listopada 2026.

Vlasnik je odabrao ručno pokrenutu GitHub objavu bez ručnog ZIP uploada.
Ovaj postojeći stage workflow time nije postao produkcijski deploy.
Prije izrade i povezivanja produkcijske automatizacije treba potvrditi
SSH/shell pristup, alate, prostor i inodeove za dva prethodna releasea i
backupe te način sigurnog switcha na tom hostingu. Dopunjeni nalaz je u
`data/migration-readiness.json` i runbooku. Ne uključivati objavu na svaki push.
Zaštita rollbacka mora sačuvati novije podatke u `application/data` i vanjski
CRM; privatni backupovi nikada nisu GitHub artifacti.

Završna read-only dopuna potvrđuje da cPanel traži administratorsko omogućavanje
shell pristupa i da nema prikazanih instaliranih SSH ključeva. `sshd: up` i
postojeći `www → public_html` ne potvrđuju pristup računu ni dopušteni release
switch. Sljedeći korak je zahtjev hosting podršci iz runbooka; ovaj workflow
ne pokretati s `stage_to_cpanel` dok pristup i ovlasti nisu potvrđeni.

## Jednokratna priprema pristupa

1. U cPanelu potvrditi da je SSH/SFTP pristup uključen za račun `dentvita`.
   Ne koristiti glavni cPanel password kao GitHub tajnu.
2. Na sigurnom administratorovom računalu stvoriti poseban deploy ključ:

   ```bash
   ssh-keygen -t ed25519 -f dentvitalis-cpanel-deploy -C "github-deploy"
   ```

3. U cPanelu otvoriti **SSH Access → Manage SSH Keys → Import Key**, uvesti
   samo javni sadržaj datoteke `dentvitalis-cpanel-deploy.pub` i autorizirati
   ga. Ključ služi samo za ovaj deployment.
4. U GitHub repozitoriju otvoriti **Settings → Environments**, izraditi
   environment `cpanel-staging` i postaviti obveznu manualnu potvrdu prije
   njegova korištenja.
5. U GitHub **Settings → Secrets and variables → Actions** dodati ove tajne:

   | Naziv                    | Vrijednost                                   |
   | ------------------------ | -------------------------------------------- |
   | `CPANEL_DEPLOY_KEY`      | privatni sadržaj `dentvitalis-cpanel-deploy` |
   | `CPANEL_SSH_HOST`        | hostname cPanel SSH servera                  |
   | `CPANEL_SSH_USER`        | `dentvita`                                   |
   | `CPANEL_SSH_KNOWN_HOSTS` | provjereni redak servera iz `known_hosts`    |

   Dodati i varijablu `CPANEL_DEPLOY_ROOT` s vrijednošću
   `/home2/dentvita`.

Za `CPANEL_SSH_KNOWN_HOSTS` ne prihvaćati neprovjereni otisak. Usporediti
fingerprint koji pokaže cPanel/hosting podrška s rezultatom vlastitog
`ssh-keyscan -H SSH_HOST` prije spremanja retka.

## Što se događa pri stageu

1. Ručno se pokrene **Actions → Stage cPanel release → Run workflow** te se
   odabere `stage_to_cpanel`.
2. GitHub iz istog commita radi `npm ci` i `npm run release:prepare`.
3. Artifact se prije prijenosa hashira, a server ponovno provjerava hash.
4. Release se raspakira u
   `/home2/dentvita/releases/<git-commit>/`; `backups/` se samo stvara ako ne
   postoji.
5. Workflow provjerava `index.html` i `release-manifest.json`, potom staje.

Nema koraka koji prepisuje `public_html`, `application`, `.htaccess`, mail
konfiguraciju ili CRM. Ako stage ne uspije, postojeći javni web nije zahvaćen.

## Što nije dio ove pripreme

Objava javnog releasea radi se tek zasebnim postupkom: backup postojećeg
`public_html` i `application`, pregled stvarnog `.htaccess` pravila, kontrolirani
switch te test obrazaca i rollback. Taj postupak je u
[cPanel-migration-runbook.md](cpanel-migration-runbook.md).
