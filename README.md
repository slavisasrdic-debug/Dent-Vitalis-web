# DentVitalis web

Statički Astro projekt s **28 talijanskih i 27 hrvatskih stranica**, rekonstruiranih prema prihvaćenoj Webflow referenci i potvrđenim hrvatskim izvorima. Native Astro komponente, centralizirani sadržaj i lokalni asseti; bez Webflow runtimea. Ovo je `noindex` klijentski preview, ne zamjena produkcijskog weba. IT/HR preview putanje su odobrene; DE/EN/SI prijevodi i konačna SEO migracija nisu dovršeni.

## Klijentski preview — Cloudflare Pages

- [Hrvatski preview](https://dent-vitalis-web.pages.dev/hr/)
- [Talijanski preview](https://dent-vitalis-web.pages.dev/)

Povezan je GitHub repozitorij `slavisasrdic-debug/Dent-Vitalis-web`, grana `main`, s Pages projektom `dent-vitalis-web`. Preview radi neovisno o pokrenutom Codespaceu. Push na `main` pokreće novi Cloudflare build; link prikazuje posljednju uspješno objavljenu verziju, ne nespremljene lokalne izmjene. Status se provjerava kroz GitHub check **Cloudflare Pages** i odgovarajući build log u Cloudflareu.

Postavke za ponavljanje deploymenta: preset `Astro`, korijen repozitorija (prazno polje Root directory), izlaz `dist`, `NODE_VERSION=24` (isto kao `.nvmrc`). Build naredba:

```bash
git lfs pull --include="public/assets/**" --exclude="" && npm run build
```

LFS korak dohvaća potrebne javne slike, video i fontove prije builda; asseti se ne regeneriraju iz Webflow exporta. Objavljuje se samo `dist/`, ne repozitorij, ZIP-ovi, izvorni dokumenti ni QA reference. Cloudflareov raniji clone korak može zasebno preuzeti LFS objekte; ova naredba ne jamči da je cijeli checkout ograničen samo na `public/assets/`.

Korisnik je 9. rujna 2026. odobrio ovaj javni klijentski preview. Sadržajne stranice zadržavaju `noindex, nofollow`; to nije zaštita pristupa — svatko s linkom može ih otvoriti. Obrasci i dalje ne šalju upite. `dentvitalis.com`, DNS, produkcijski canonicali i postojeći javni web nisu promijenjeni. Naziv **Production branch** u Pages postavkama označava granu ovog preview projekta, ne odobrenje produkcijske migracije.

`public/_headers` pojačava preview zabranu indeksiranja HTTP zaglavljem, uključujući deployment poddomene. Hashirani CSS/JS/fontovi i verzionirani videozapisi imaju jednogodišnji browser cache; HTML ostaje na zadanoj revalidaciji. `videoUrl()` tijekom builda računa SHA-256 stvarnih video bajtova i dodaje `?v=`, pa novi video dobiva novi cache ključ. Ne uklanjati taj parametar niti postavljati `immutable` globalno. [Cloudflare pravila za statička zaglavlja](https://developers.cloudflare.com/pages/configuration/headers/).

Razvojni Codespaces port 4321 i dalje služi za praćenje rada prije commita/pusha, prema postupku niže.

## Preduvjeti

- Node.js 24
- npm 11
- Git LFS 3 (slike, video, fontovi i nove vizualne reference)

## Pokretanje

```bash
git lfs install --local
git lfs pull
npm ci
npm run dev -- --host 0.0.0.0
```

Naslovnica je na `http://localhost:4321/`; Codespaces prosljeđuje port 4321. Obrazac ne šalje poruke, WhatsApp broj čeka potvrdu.

### Automatski Codespaces preview

Korisnik je odobrio automatsko pokretanje i **public port 4321**. `.devcontainer/devcontainer.json` zadržava postojeću Universal bazu, osigurava Node 24 i nakon kreiranja preuzima Git LFS datoteke te instalira ovisnosti iz lockfilea (`npm ci`). Pri svakom startu i ponovnom spajanju izvršava isti postupak:

```bash
npm run preview:ensure
```

Postupak pokreće Astro na `0.0.0.0:4321` samo ako port nije zauzet, obnavlja prosljeđivanje ako nedostaje, postavlja **samo 4321** na public i provjerava stvarnu DentVitalis `noindex` naslovnicu s HTTP 200 lokalno i na javnom URL-u. Ponovno pokretanje ne stvara dodatne servere. Ako na portu radi druga aplikacija, ne gasi je i ne prelazi na drugi port. Astro koristi `strictPort`, pa ni pri zauzetom portu ne prelazi neprimjetno na 4322.

**Jednokratna aktivacija za ovaj postojeći Codespace:** VS Code Command Palette → **Codespaces: Rebuild Container**. Sama izmjena datoteke ne aktivira nove lifecycle hookove u već pokrenutom containeru. Rebuild prekida trenutni preview/sesiju; rad unutar `/workspaces` ostaje, ali prije njega treba provjeriti da svi potrebni izvori postoje tamo. Rebuild ove izmjene još nije izveden. Korisnik je 2026-09-08 odobrio commit/push; novi Codespace treba otvoriti iz commita koji sadrži ovu konfiguraciju i `.gitattributes`. [GitHub upute za primjenu automatskog prosljeđivanja](https://docs.github.com/en/codespaces/developing-in-a-codespace/forwarding-ports-in-your-codespace#automatically-forwarding-a-port).

Logovi i lock su lokalno u `.astro/preview/` (već ignorirano u Gitu). `astro.log` bilježi pokretanje, `forward.log` eventualni CLI tunnel, a `*-error.log` i `visibility.log` razloge neuspjele provjere. Procesi ne ovise o otvorenom terminalu. Ako IDE još nije registrirao port, skripta koristi `gh codespace ports forward 4321:14321`; pomoćni 14321 ne označava se public niti se automatski prosljeđuje. GitHub CLI mora imati važeću Codespaces autentikaciju, a organizacijska pravila moraju dopuštati public port. Ne spremaju se tokeni. Neuspjeh pri ranom startu ostaje vidljiv u logovima; `postAttachCommand` ponavlja provjeru kada se editor spoji.

Bez Codespaces okruženja isti postupak pokreće samo lokalni server i ne mijenja javnu dostupnost. Automatizacija ne održava Codespace budnim niti mijenja idle timeout: dok je Codespace zaustavljen, preview nije dostupan. Konfiguracija i semantika start/attach događaja slijede [Dev Container specifikaciju](https://github.com/devcontainers/spec/blob/main/docs/specs/devcontainerjson-reference.md#lifecycle-scripts).

Pri prvom otvaranju javnog linka u browseru GitHub može prikazati **Codespaces Access Port** upozorenje s gumbom **Continue**. To nije pokvaren port niti DentVitalis greška; nakon potvrde otvara se web. Provjera preko `curl` ne prikazuje taj browser ekran, zato se dostupnost dodatno provjerava i u browseru.

Za pregled statičkog production builda:

```bash
npm run build
npm run preview
```

## Naredbe

| Naredba                        | Namjena                                             |
| ------------------------------ | --------------------------------------------------- |
| `npm run dev`                  | Astro razvojni server                               |
| `npm run build`                | Statički production build u `dist/`                 |
| `npm run preview`              | Lokalni pregled prethodno izrađenog builda          |
| `npm run preview:ensure`       | Pokretanje/provjera javnog Codespaces previewa      |
| `npm run reference:audit`      | Webflow render, breakpointi i screenshotovi         |
| `npm run reference:audit-live` | Crawl postojećih višejezičnih live URL-ova          |
| `npm run check`                | Astro i TypeScript provjera                         |
| `npm run lint`                 | ESLint provjera projekta                            |
| `npm run format`               | Prettier formatiranje                               |
| `npm run format:check`         | Provjera formatiranja bez izmjena                   |
| `npm test`                     | Playwright testovi projektnih temelja               |
| `npm run test:preview`         | Izolirane provjere pokretanja, locka i public porta |
| `npm run validate`             | Sve provjere i production build                     |

## Struktura

- `src/` — Astro komponente, layouti, sadržaj, stranice i CSS
- `data/` — centralizirani strukturirani podaci i redirect inventar
- `public/assets/` — samo optimizirani produkcijski asseti
- `source-assets/` — neobrađeni izvori koji se ne objavljuju
- `docs/` — arhitektura, sadržajna pravila, SEO migracija i kontrolne liste
- `reference/` — audit JSON i screenshotovi, izvan produkcijskog builda
- `scripts/` — ponovljive read-only referentne audit skripte
- `tests/` — Playwright provjere

Pravila projekta nalaze se u [AGENTS.md](./AGENTS.md), a arhitektonske odluke u [docs/architecture.md](./docs/architecture.md).

Aktualna [mapa komponenti](./docs/astro-component-map.md), [vizualna specifikacija](./docs/webflow-home-spec-2026-09-07.md), [otvorene sadržajne odluke](./docs/known-content-issues.md) i [verzioniranje i obnova izvora u drugom Codespaceu](./docs/source-versioning-proposal.md).

## Unutarnje stranice i ponovljivost

[Izvedba i nalazi unutarnjih stranica](./docs/inner-pages-implementation.md) bilježe i stvarne razlike desktop/mobile kompozicija. `src/content/inner-pages-it.json` je čista sadržajna transkripcija svih 27 podstranica sa SHA-256 izvora; `src/pages/[...path].astro` sastavlja tipizirane zajedničke komponente. Poslovne vrijednosti uređuju se u `data/site.ts`; izvorni pravni konteksti ostaju zasebno označeni za provjeru.

```bash
node scripts/extract-inner-content.mjs
node scripts/prepare-inner-assets.mjs
node scripts/prepare-testimonial-posters.mjs
node scripts/check-inner-breakpoints.mjs
npx playwright test tests/inner-pages.spec.ts tests/fonts.spec.ts
npx playwright test tests/gallery-comparison.spec.ts
```

Asset skripte ponovno koriste lokalne izvore; thumbnail skripta preuzima samo nedostajuće izvorne YouTube postere. Nijedna naredba ne šalje obrazac klinici. Usporedni screenshotovi, overlayi i diffovi nalaze se u `reference/screenshots/2026-09-07-inner/`, izvan produkcijskog builda.

## Hrvatska verzija

`/hr/` i 26 odobrenih podstranica koriste iste Astro partiale kao talijanski web. Putanje su u `data/hr-routes.proposed.csv` (status `approved`), sadržajni modeli u `src/content/hr/`, a izvor je hrvatski stupac odobrenog DOCX-a. Pravne stranice koriste zasebno odobrene public HTML snapshotove. Prijevoz ostaje samo na talijanskom; DE/EN/SI prijevodi ne izmišljaju se.

```bash
npm run test:content
npm run test:hr
npm run test:hr -- --browser webkit
npm run audit:copy:it -- --cached
```

Ponovljena ekstrakcija samo kada je potrebna: `content:extract:hr` za DOCX, `content:extract:hr-legal` za sačuvane pravne izvore. Obje su build-time; izvorni dokumenti i njihove uredničke napomene nisu client payload. Mrežni cache talijanskog audita nije u Gitu: u novom Codespaceu prvi poziv `audit:copy:it` pokrenuti bez `--cached`.

Jedna lista za zajednički pregled nakon izrade: [hrvatski sadržaj i preostale odluke](./docs/croatian-review.md). Preview je `noindex`, bez produkcijske objave i bez aktivnog slanja obrazaca.
