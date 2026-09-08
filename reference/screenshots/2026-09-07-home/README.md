# Home visual QA — 7. rujna 2026.

Snimke su razvojni dokaz, izvan `public/` i Astro builda. Reference HTML/CSS identitet je u `../../webflow-handoff/2026-09-07/home-reference-identity.json`.

## Mjerodavni završni skupovi

- `comparisons/`: 1440×900 i 390×900, isti Chromium i DPR 1; Webflow, Astro, 50% overlay i pojačani RGB diff za svaku sekciju. Sve četiri fotografije obiju mobilnih sekvenci imaju zaseban viewport. `report.json` čuva datum, verziju browsera, stvarni scrollY, geometriju i MAE.
- `breakpoints/`: 25 širina, uključujući neposredno ispod/na/iznad svakog detektiranog prijelaza. Report sadrži fontove, menu/container/hero/form/footer geometriju, overflow i runtime greške. To nije pixel-diff svih sekcija na svih 25 širina.
- `interactions/`: desktop/mobile menu, dropdown, jezik, dialog, otvoreni FAQ i chat; lokalne/izvorne snimke i overlay. Mobilni dropdown koristi touch događaj, ne desktop hover+click. Obrazac se nikada ne šalje referentnom webu.
- `motion/`: četiri `.webm` snimke prirodnog prolaska kroz naslovnicu (desktop/mobile × Webflow/Astro), izračunate opacity/transform vrijednosti i autoplay/pause stanje. `report.json` navodi uvjete; snimke nisu vremenski sinkronizirani frame-by-frame pixel test.
- `text-geometry.json`: pomoćna usporedba elemenata s istim jedinstvenim tekstom. Element box uključuje padding; razlika boxa nakon semantičke promjene markup strukture nije sama po sebi razlika položaja slova. Koristiti zajedno sa screenshotom, ne kao samostalni pass/fail.

Za stabilne statične usporedbe videi se prikazuju izvornim posterima, fontovi i slike su učitani, reveal završen. Za scroll sekvence se čeka smirivanje smoothinga. Full-page snimka ne predstavlja sticky fotografije pri svim položajima skrola.

`webflow/` i `astro/` sadrže istraživačke full-page/sekcijske snimke iz ranijih iteracija istoga dana. Ostaju sačuvane, ali **nisu završni visual regression baseline**. Za pregled implementacije koristiti gornje mjerodavne skupove.

MAE je srednja apsolutna razlika RGB kanala u rasponu 0–255, a `changedPixelsOver16` udio piksela gdje barem jedan kanal odstupa više od 16. To nisu postotci “vizualne identičnosti”. Animirani fade, interpolacija slika i rasterizacija ikona razmatraju se odvojeno od geometrije.

## Ponoviti provjeru

```bash
npm run build
npm run preview -- --host 0.0.0.0 --port 4322
```

U drugom terminalu, sekvencijalno:

```bash
node scripts/verify-home-reference.mjs
node scripts/check-home-motion.mjs
node scripts/compare-home-visuals.mjs
node scripts/check-home-breakpoints.mjs
node scripts/capture-home-interactions.mjs
```

Ne mijenjati build usred snimanja. `QA_ORIGIN` može zamijeniti lokalni `http://localhost:4322/`. Browser plugin nije bio callable u ovom okruženju; korišten je postojeći Playwright/Chromium, bez instaliranja novog UI frameworka ili ponovnog Astro scaffolda.
