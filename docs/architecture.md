# Arhitektura

## Trenutačni opseg

Repozitorij sadrži samo temelj projekta. Nema implementiranog dizajna, sadržajnih stranica, form backenda, redirect logike, deploymenta ni migriranih asseta.

## Odluke

- Astro generira potpuno statički output (`output: 'static'`).
- TypeScript koristi Astro `strictest` postavke.
- UI će koristiti native Astro komponente i običan CSS s centralnim tokenima.
- JavaScript se dodaje progresivno samo tamo gdje je potreban za interakciju.
- `@astrojs/sitemap` koristi potvrđeni production origin `https://www.dentvitalis.com`.
- Strukturirani sadržaj i statusi prijevoda žive u `/data`; komponente ih ne dupliciraju.
- Izvorni asseti ostaju izvan `/public`, a samo optimizirane izvedenice ulaze u `/public/assets`.
- Redirect inventar ostaje hosting-neutralan CSV dok produkcijski hosting nije potvrđen.

## Predviđene granice

- `src/components` — male komponente s jednom odgovornošću
- `src/layouts` — zajednički document shell, SEO i schema izlaz
- `src/pages` — isključivo potvrđene javne rute; mapa je zasad prazna kako se dokumentacija ne bi pretvorila u javnu Astro rutu
- `src/styles` — tokeni, reset i slojeviti obični CSS
- `data` — potvrđeni podaci, prijevodi, sadržajni statusi i redirecti
- `tests` — ugovori o rutama i podacima, zatim browser testovi i visual regression

## Kasnije odluke koje zahtijevaju potvrdu

- detaljni slugovi usluga i drugih podstranica
- form backend, upload ograničenja i obrada
- cookie/consent ponašanje za YouTube i Google Maps
- produkcijski hosting i format redirect pravila
- Analytics i Search Console integracije
- službeni kontakti, uključujući WhatsApp broj
