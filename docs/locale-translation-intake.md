# DE/EN/SL translation intake — 23. rujna 2026.

U repozitorij su stigla tri nova DOCX izvora:

- `reference/Upute za prijevode/Dentvitalis web tekstovi za prijevod_DE.docx`
- `reference/Upute za prijevode/Dentvitalis web tekstovi za prijevod_EN.docx`
- `reference/Upute za prijevode/Dentvitalis web tekstovi za prijevod_SL.docx`

Izvorni bajtovi ostaju u Git LFS-u. Sadržaj je prvo izvučen u lossless kataloge:
`data/translations/de-source.json`, `en-source.json` i `sl-source.json`. Katalogi čuvaju tekst, odlomke, tablice, redke, ćelije i run-formatiranje; ne objavljuju se izravno kao stranice.

## Početna analiza

Sva tri dokumenta imaju 29 tablica i zajednički kostur weba, ali nisu sigurno poravnata po ukupnom broju odlomaka:

| Jezik | Odlomci ukupno / neprazni | Redci tablica |
| --- | ---: | --- |
| DE | 227 / 116 | 12, 2, 2, 3, 6, 6, 6, 3, 3, 4, 3, 3, 4, 5, 5, 3, 4, 10, 1, 3, 7, 2, 1, 2, 1, 1, 1 |
| EN | 255 / 118 | kao DE |
| SL | 258 / 118 | kao DE, uz razliku u tablicama 15 i 16 |

Zato se prije implementacije moraju mapirati semantički blokovi prema HR strukturi i postojećim komponentama. Ne koristiti globalno poravnanje po rednom broju.

## Plan implementacije

1. Usporediti naslove, stranice, CTA-e, kontakte, cijene, FAQ i pravne odlomke s hrvatskim katalogom; evidentirati prazne/izostavljene blokove po jeziku.
2. Izraditi lokalizirane sadržajne module koji koriste postojeće komponente i odobrene jezične putanje `/de/`, `/en/` i `/si/`.
3. Dodati samo stvarne recipročне hreflang parove; ne stvarati par za stranicu koja nema prevedeni ekvivalent.
4. Provjeriti lokalizirane SEO/OG/ARIA/alt tekstove, kontakte, pravne tekstove i cijene prije uključivanja jezika u navigaciju.
5. Pokrenuti ciljane content/route/schema testove i jednu desktop/mobile provjeru po jeziku prije commita.

Katalozi se obnavljaju naredbom `python3 scripts/extract-locale-source.py`; integritet se provjerava s `--check`.
