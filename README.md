# DentVitalis web

Statički Astro projekt s **28 talijanskih stranica**, rekonstruiranih prema prihvaćenoj Webflow referenci. Native Astro komponente, centralizirani sadržaj i lokalni asseti; bez Webflow runtimea. Ovo je `noindex` razvojni preview, ne objavljen novi web. Webflow URL-ovi odobreni su za preview; ostali jezici i konačna SEO migracija nisu izrađeni niti odobreni.

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
