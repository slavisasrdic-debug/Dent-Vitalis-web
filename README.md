# DentVitalis web

Temelj novog službenog weba DentVitalis, izrađen kao statički Astro projekt. Projekt je trenutačno namjerno bez dizajna, javnih stranica i produkcijskog sadržaja; prvi korak postavlja samo arhitekturu, alate i pravila za buduću migraciju.

## Preduvjeti

- Node.js 24
- npm 11

## Pokretanje

```bash
npm install
npm run dev
```

Lokalni razvojni server prema zadanim postavkama radi na `http://localhost:4321`. Budući da javne stranice još nisu izrađene, root URL zasad namjerno vraća 404.

Za pregled statičkog production builda:

```bash
npm run build
npm run preview
```

## Naredbe

| Naredba                | Namjena                                    |
| ---------------------- | ------------------------------------------ |
| `npm run dev`          | Astro razvojni server                      |
| `npm run build`        | Statički production build u `dist/`        |
| `npm run preview`      | Lokalni pregled prethodno izrađenog builda |
| `npm run check`        | Astro i TypeScript provjera                |
| `npm run lint`         | ESLint provjera projekta                   |
| `npm run format`       | Prettier formatiranje                      |
| `npm run format:check` | Provjera formatiranja bez izmjena          |
| `npm test`             | Playwright testovi projektnih temelja      |
| `npm run validate`     | Sve provjere i production build            |

## Struktura

- `src/` — buduće Astro komponente, layouti, stranice i CSS
- `data/` — centralizirani strukturirani podaci i redirect inventar
- `public/assets/` — samo optimizirani produkcijski asseti
- `source-assets/` — neobrađeni izvori koji se ne objavljuju
- `docs/` — arhitektura, sadržajna pravila, SEO migracija i kontrolne liste
- `tests/` — Playwright provjere

Pravila projekta nalaze se u [AGENTS.md](./AGENTS.md), a arhitektonske odluke u [docs/architecture.md](./docs/architecture.md).
