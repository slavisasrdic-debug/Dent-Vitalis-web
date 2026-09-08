# DentVitalis projektna načela

Ove upute vrijede za cijeli repozitorij.

- GitHub repozitorij je jedini izvor istine. Sve izmjene moraju biti jasne, pregledive i commitane.
- Binarne datoteke prema `.gitattributes` verzioniraju se kroz Git LFS. Prije rada u novom checkoutu izvršiti `git lfs pull`; prije pusha provjeriti LFS objekte i izuzeće izvornih ZIP-ova. Raspakirane reference ne ignorirati niti mijenjati njihove bajtove. Postupak obnove je u `docs/source-versioning-proposal.md`.
- Codespaces je razvojno okruženje. Ne pretpostavljati produkcijske pristupe, zaporke, API ključeve, DNS, hosting ili deployment.
- Ne izmišljati medicinske podatke, cijene, kontakte, bankovne podatke, kvalifikacije liječnika, recenzije, reference, fotografije ni prijevode.
- Ne kopirati Webflow HTML, CSS i JavaScript u produkcijski kod.
- Prije većih odluka o sadržaju, SEO-u, URL-ovima, schema podacima ili redirekcijama iznijeti pretpostavku i tražiti potvrdu.
- Vizualna vjernost Webflow referenci je obvezna, ali kod mora ostati čist, komponentan i održiv.
- Svaka nova komponenta mora imati jasnu odgovornost i ne smije duplicirati sadržaj ili poslovna pravila.

## Obvezni početak sesije

- Prije ostalog rada izvršiti `npm run preview:ensure`: jedan server na `0.0.0.0:4321`, samo odobreni port 4321 public, lokalni i vanjski HTTP 200 + stvarni DentVitalis `noindex` sadržaj. Odmah dati korisniku funkcionalni link i ostaviti preview aktivnim.
- Ako skripta ne uspije ili se mijenja startup/Dev Container, pročitati cijeli `docs/rules/preview.md` i odgovarajući README postupak. Ne pokretati drugu instancu, ne prebacivati port i ne gasiti tuđi proces. Rebuild postojećeg Codespacea nije automatski obavljen commitom.
- Pregledati `git status --short`; očuvati postojeći rad. Pravilo o spremanju rada ne daje ovlasti za produkcijsku objavu.

## Učitaj samo pravila potrebna za zadatak

Ove povezane datoteke dio su obveznih projektnih uputa, ne opcionalna dokumentacija. Prije relevantne izmjene pročitati cijelu odgovarajuću datoteku; ako se zadatak proširi, prvo učitati dodatna pravila.

| Zadatak                                                                              | Obvezno pročitati                                                                                    |
| ------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------- |
| Komponente, stil, responsive prikaz, slike/fontovi/video, interakcije ili UI testovi | `docs/rules/frontend.md`; relevantne postojeće komponente iz `docs/astro-component-map.md`           |
| Tekstovi, jezici, URL-ovi, prevoditeljski izvori, SEO/schema/redirecti               | `docs/rules/content-and-seo.md`                                                                      |
| Hrvatski sadržaj i hrvatske putanje                                                  | Dodatno `docs/croatian-content-intake.md` — potvrđeni izvor, izuzeća i status odluka                 |
| Problem s portom, lifecycle automatizacija ili Dev Container                         | `docs/rules/preview.md`                                                                              |
| Git/LFS, backup ili obnova                                                           | `docs/source-versioning-proposal.md` — primijenjena odluka ima prednost pred arhiviranim prijedlogom |

## Brz i ponovljiv rad

- Ne ponavljati završeni prihvat niti čitati velike exporte/izvještaje od početka. Prvo provjeriti status, ciljane datoteke i postojeći sažetak; puni snapshot čitati samo za konkretan nedostajući dokaz.
- Izvore dohvatiti jednom po auditu; usporediti SHA-256. Ako se referenca nije promijenila, ponovno koristiti postojeći inventar/komponentnu mapu i vizualne baselineove. Promjenu ne miješati neprimjetno s prihvaćenom verzijom.
- Za tekstualni audit koristiti `npm run audit:copy:it`, za DOCX `npm run content:extract:hr`. Konzola prikazuje sažetak i različite stavke, ne cijele HTML/JSON dokumente. Raw mrežni cache ostaje u `.astro/audits/`, izvan builda i Gita; trajni nalazi u `docs/`.
- Hrvatski unos dohvaća tekst po stabilnom DOCX ID-u; ne ručno pretipkavati cijele odlomke niti automatski poravnavati stupce po rednom broju kada se razlikuju. Sačuvati žute oznake, napomene i izuzeća; ne objavljivati uredničke upute kao sadržaj.
- Najprije ciljane provjere izmijenjenih potrošača. Jedan završni zajednički test prolaz, bez paralelnog rebuilda/HMR regeneracije; zadano najviše dva Playwright workera. Ne ponavljati veliku screenshot matricu kad promjena ne utječe na geometriju.
- Uspješan build nije vizualna potvrda; UI izmjene provjeriti u browseru na relevantnom desktop/mobile prikazu i promijenjenim interakcijama. Štednja ne preskače integritet teksta, pristupačnost, responsive razlike ili sigurnosne provjere.
- Ne rješavati blokade nagađanjem. Bilježiti što traži odluku i nastaviti samo neovisni posao koji je unutar odobrenog opsega.
