# Verzioniranje izvora i obnova projekta

## Primijenjena odluka 2026-09-08

Korisnik je izričito odobrio commit/push postojećeg rada u GitHub. Primijenjen je raspored iz `.gitattributes`; povijesni prijedlog niže ostaje kao zapis prethodne faze, a ovaj odjeljak ima prednost. Odobrenje ne uključuje produkcijsku objavu, DNS, hosting ili aktiviranje obrazaca. Uspjeh konkretnog pusha provjerava se usporedbom lokalnog `HEAD` i `refs/heads/main` na originu, ne samo postojanjem lokalnog commita.

| Skup                                                                        | Primijenjena pohrana                                       |
| --------------------------------------------------------------------------- | ---------------------------------------------------------- |
| Astro, sadržaj, konfiguracije, dokumentacija, skripte, testovi i audit JSON | Obični Git                                                 |
| Handoff JSON/CSV/Markdown, `content/`, `raw/`; export HTML/CSS/JS           | Obični Git, nepromijenjeni izvorni bajtovi                 |
| Handoff `extracted/assets/`; export `images/`, `videos/`, `fonts/`          | Git LFS                                                    |
| Optimizirane slike, video i fontovi u `public/assets/`                      | Git LFS; build ne zahtijeva regeneriranje                  |
| Vanjski izvorni JPG/PNG posteri i dopunski WOFF2 fontovi                    | Git LFS; mali vanjski SVG-ovi i mapping u običnom Gitu     |
| Nove home/inner QA slike, usporedni parovi, overlayi i diffovi              | Git LFS; pripadajući JSON izvještaji u običnom Gitu        |
| Dva dostavljena DOCX dokumenta u `reference/`                               | Git LFS, obje korisničke putanje i nazivi sačuvani         |
| Već commitane starije snimke                                                | Postojeća obična Git povijest, bez migracije/preslagivanja |

Za ovaj potpuni checkpoint zadržane su **sve postojeće nove snimke**, ne samo odabrani baseline parovi: druga trajna artifact pohrana nije dogovorena, a ignoriranjem bi se izgubile provjere pri prelasku u drugi Codespace. Buduće serije dodavati namjerno uz razmatranje LFS potrošnje.

Dva nova DOCX-a imaju identične bajtove i dijele LFS objekt, ali se ne briše nijedna korisnička putanja. To su dodatni izvori za budući sadržaj/prijevode, ne odobrenje za automatsko mijenjanje talijanskog weba ili objavu hrvatskog prijevoda. Prihvaćeni Webflow handoff sam po sebi ostaje talijanski.

Oba izvorna ZIP-a ostaju lokalno sačuvana i ignorirana. **Cijele verificirane ekstrakcije** verzioniraju se; ZIP nije potreban za razvoj ni provjeru hashova nakon obnove. Lokalno ostaju i `node_modules/`, `dist/`, `.astro/`, testni runtime izvještaji, logovi, tajne `.env` datoteke i privremene provjere izvan repozitorija (`/tmp/`). Ništa od toga nije obrisano.

Izmjereni skup: 1.835 datoteka u ekstrakcijama (342.815.632 B), javni asseti približno 51,3 MiB, nove home/inner QA mape uključujući JSON približno 556,4 MiB. LFS identificira sadržaj hashom: identični izvori/izvedenice na više putanja dijele objekt. `.gitattributes` postavlja `-text` na oba cijela nepromjenjiva snapshota radi očuvanja CRLF/LF. Ne brisati ni preimenovati izvorne duplikate.

Velika lokalna `.git/objects` mapa uključuje i automatske radne snapshot reference. Push je ograničen na `main`; ne koristiti `--mirror`/`--all`, ne brisati interne reference niti prepisivati povijest radi backupa.

LFS pohrana i preuzimanja ulaze u potrošnju vlasnika repozitorija. Ne pretpostavljati preostalu kvotu niti mijenjati naplatu/budžete. Ako GitHub odbije prijenos zbog kvote/prava, prijaviti blokadu, ne zaobilaziti je slanjem velikih binarnih datoteka u obični Git. [GitHub LFS dokumentacija](https://docs.github.com/en/repositories/working-with-files/managing-large-files/about-git-large-file-storage) i [obračun potrošnje](https://docs.github.com/en/billing/concepts/product-billing/git-lfs).

### Aktualni postupak obnove

```bash
git lfs install --local
git lfs pull
git lfs fsck
python3 scripts/accept-webflow-sources.py --extracted-only
npm ci
npm run check
npm run build
npm run preview:ensure
```

LFS pull mora završiti prije builda: pointer tekst nije slika ni font. Dev Container `postCreateCommand` zato najprije preuzima LFS, a zatim pokreće `npm ci`. Postojeći Codespace treba jednokratni **Rebuild Container** za aktivaciju novih hookova; Git sinkronizacija ne obavlja rebuild niti prekida preview. Za browser provjere dodatno `npx playwright install --with-deps chromium webkit` i `npm run validate`.

## Arhivirani prijedlog iz faze prihvata (prije odobrenja commita/pusha)

Status: prijedlog za pregled. Git LFS nije konfiguriran, datoteke nisu stageane/commitane ni poslane. Dva izvorna ZIP-a lokalno su sačuvana i izričito izuzeta u `.gitignore`; raspakirane specifikacije i source datoteke nisu ignorirane.

## Dopuna nakon implementacije svih 28 stranica

`public/assets/` sada sadrži upotrijebljeni podskup za svih 28 stranica: približno 41 MiB slika, 488 KiB fontova i 12 MiB videa. `scripts/prepare-home-assets.mjs`, `prepare-inner-assets.mjs`, `prepare-video-posters.mjs`, `prepare-font-extensions.mjs` i `prepare-testimonial-posters.mjs` reproduciraju ga iz sačuvanih originala. JSON manifesti u `src/content/` i `source-assets/` čuvaju izvorni naziv, mapping, dimenzije i hashove. Inner asset build ponovno koristi 11 postojećih home mastera umjesto dupliciranja. Tri vanjska social SVG-a i pet malih zastava treba sačuvati u običnom Gitu uz mapping i skriptu; 13 lokalnih YouTube originalnih postera također treba trajno sačuvati za neovisni restore.

Za produkcijske video datoteke i veće slike preporučen je isti LFS režim kao za mastere. Byte-identični video/font/WebP masteri ne stvaraju drugi LFS objekt samo zato što imaju i `public/` putanju. Male SVG-ove i fontove moguće je držati u običnom Gitu. Alternativa je verzionirati samo mastere i deterministički asset build, uz obvezan restore/build korak u novom Codespaceu; ne ignorirati javne assete bez toga.

QA snimke s overlayima, diffovima i izračunatim stilovima sada prelaze 560 MiB (oko 200 MiB home i više od 360 MiB inner; veličina raste regeneracijom matrice). Preporuka: odabrani baseline parovi u LFS, ostale izvedene snimke u datiranom CI/artifact paketu s hash manifestom; skripte, report JSON i identitet reference u običnom Gitu. Ne slati sve prolazne PNG-ove u običnu Git povijest. Ovaj prijedlog **nije** automatski primijenjen; ništa nije obrisano, stageano ni pushano.

Nastavak nakon prihvaćene pohrane: `npm ci`, `python3 scripts/accept-webflow-sources.py --extracted-only`, asset generatori, `npx playwright install --with-deps chromium webkit`, `npm run validate`. Za galeriju vrijedi `npx playwright test tests/gallery-comparison.spec.ts`. Aktualne inner vizualne skripte koriste zasebni lokalni statički preview na 4173; javni razvojni port ostaje 4321. Home skripte podržavaju `QA_ORIGIN` / imaju dokumentirani privatni QA port 4322. Ne pokretati rebuild dok skripta snima `dist/`, niti regenerirati sadržaj za vrijeme interakcijskih testova na dev serveru: HMR/rebuild mijenja otvorene stranice i poništava usporedbu. Potrebne mrežne veze su read-only prema Webflow referenci; ne šalju se klinički upiti.

## Preporučeni raspored

| Skup                                                             | Predložena pohrana                                                                | Razlog                                                                                                                   |
| ---------------------------------------------------------------- | --------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| Astro/data/docs/scripts/config i postojeći auditi                | obični Git                                                                        | postojeći rad i ponovljive provjere                                                                                      |
| Handoff `extracted/*.json`, `*.csv`, `*.md`, `content/` i `raw/` | obični Git, sa sačuvanim originalnim bajtovima                                    | native struktura, izvori, reference i manifest mogu se ponovno provjeriti u drugom Codespaceu                            |
| Handoff `extracted/assets/**`                                    | Git LFS                                                                           | veliki masteri i fontovi ostaju uz originalna imena bez napuhavanja obične Git povijesti                                 |
| Export HTML, `css/`, `js/`                                       | obični Git, samo izvorna referenca                                                | potrebno za usporedbu i razumijevanje exporta, izvan produkcijskog koda                                                  |
| Export `images/**`, `videos/**`, `fonts/**`                      | Git LFS                                                                           | originali, responsive izvedenice i posteri; identični bajtovi dijele isti content-addressed LFS objekt                   |
| Dva ZIP-a                                                        | lokalna/arhivska kopija izvan običnog Git commita                                 | već sadrže datoteke koje su raspakirane i verificirane; verzionirati obje reprezentacije nepotrebno udvostručuje payload |
| Upotrijebljene optimizirane produkcijske izvedenice              | LFS za veće binarne datoteke ili deterministički restore iz verzioniranih mastera | sačuvati generatore i mapping; bez nepotrebne dodatne kopije svih mastera u `original-images/`                           |

Git LFS 3.7.1 dostupan je u ovom Codespaceu. Dostupnost LFS pohrane i kapacitet udaljenog repozitorija nisu provjereni niti pretpostavljeni; to treba provjeriti prije prihvaćanja i slanja ovog rasporeda. Ako LFS nije opcija, treba dogovoriti jednu trajnu verzioniranu pohranu binarnih izvora s hash manifestom i restore naredbom. Samo ignoriranje asseta bez dostupnog restore izvora ne omogućuje nastavak rada iz drugog Codespacea.

## Izmjerena veličina i duplikati

- Obje ekstrakcije ukupno: **342.815.632 B**, približno 326,9 MiB.
- Jedinstveni SHA-256 sadržaj svih datoteka: **290.409.190 B**, približno 277,0 MiB.
- Ponavljajući sadržaj: **52.406.442 B**, približno 50,0 MiB; od toga je **46.743.707 B** export datoteka već bajtno prisutno u handoffu.
- Skupovi `handoff/assets` i `export/images|videos|fonts` imaju ukupno **247.408.919 B**, a **200.499.432 B** jedinstvenih bajtova (oko 191,2 MiB) za predložene LFS objekte.
- Handoff ima registrirane mastere bez potvrđene statičke uporabe. Njihovim automatskim brisanjem izgubili bismo dio potpunog izvora; trenutačno ih treba očuvati kao snapshot, bez uključivanja u production build.

Git i LFS identificiraju objekte sadržajem. Zadržavanje dvaju izvornih putanja s identičnim sadržajem ne zahtijeva dva različita objekta. **Ne mijenjati ni brisati duplikate unutar verificiranih `extracted/` mapa:** tako ostaju valjani manifest, izvorna struktura i buduća provjera. U implementaciji će asset katalog pokazivati na jednu od tih kopija prema hash mappingu u `source-comparison.json`.

## Konkretan prijedlog `.gitattributes`

Sljedeći sadržaj nije primijenjen; predstavlja pregledljiv prijedlog za sljedeći odobreni korak:

```gitattributes
# Preserve exact snapshot bytes across platforms (including CRLF).
reference/webflow-handoff/2026-09-07/extracted/** -text
source-assets/webflow-export/2026-09-07/extracted/** -text

# Binary source content, with identical files sharing the same LFS object ID.
reference/webflow-handoff/2026-09-07/extracted/assets/** filter=lfs diff=lfs merge=lfs -text
source-assets/webflow-export/2026-09-07/extracted/images/** filter=lfs diff=lfs merge=lfs -text
source-assets/webflow-export/2026-09-07/extracted/videos/** filter=lfs diff=lfs merge=lfs -text
source-assets/webflow-export/2026-09-07/extracted/fonts/** filter=lfs diff=lfs merge=lfs -text
```

Postojeći screenshotovi ostaju u postojećoj povijesti. Ne prepisivati Git povijest niti ih sada migrirati bez posebne odluke.

Prettier i ESLint sada izuzimaju nepromjenjivi handoff `extracted/`, kao što već izuzimaju `source-assets/`. TypeScript/Astro provjera također izuzima obje mape izvornih referenci. To su izuzeća razvojnih alata, **ne Git izuzeća**: sprečavaju da `npm run format` promijeni izvorne bajtove i poništi manifest te da checker analizira tuđi Webflow runtime kao aplikacijski kod.

## Nastavak iz drugog Codespacea

Nakon budućeg odobrenog commita i pusha:

1. Checkout odgovarajućeg commita i `git lfs pull` vraćaju tekstualne i binarne raspakirane izvore na iste putanje.
2. `python3 scripts/accept-webflow-sources.py --extracted-only` provjerava sve raspakirane datoteke prema veličinama i hashovima verificiranog prihvata, uključujući sam handoff manifest. Originalni ZIP nije nužan za razvoj. `intake-verification.json` čuva njegove lokalno izračunate kontrolne zbrojeve.
3. `npm ci` vraća zaključani Astro/Node dependency skup. Za offline usporedbu izvora trebaju `beautifulsoup4==4.14.3` i `tinycss2==1.4.0`; prihvat ZIP-a koristi samo Python standardnu biblioteku.
4. Manifest i snapshot datoteke ostaju neformatirani. Ažurirani izvori dobivaju novu datiranu mapu i novi prihvat.

Trenutačno nijedna od novih ekstrakcija nije commitana/pushana. Novi Codespace zato još ne može dohvatiti ovaj prihvat iz udaljenog repozitorija; to je očekivano prema izričitom nalogu da ovaj korak ne radi commit/push.
