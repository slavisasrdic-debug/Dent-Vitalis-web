# Handoff — stanje projekta 11. rujna 2026.

Najnovija dopuna: kontaktni linkovi na svih 55 IT/HR ruta i četiri pravna članka usklađeni su s potvrđenim izvorima. Korisnik je izričito odobrio zamjenu OBA IT pravna teksta aktualnim javnim tekstom nakon prijave sadržajnih razlika. HR tekstovi ostaju doslovno prethodno odobreni. Dokazi, iznimke, liste i postupak obnove u [legal-and-contact-audit.md](legal-and-contact-audit.md). Svi pravni članci sada koriste Montserrat; ovo ima prednost nad ranijim privacy-only pravilom o Arialu uvjeta.

FAQ pomicanje korisnik je naknadno izričito odobrio: `faq-scroll.ts` nakon završetka height animacija provjerava vidljivost summaryja i prvih 48px odgovora, koristi zajednički scroll-padding i donji mobile CTA. Pomak samo ako početak nije vidljiv; ne mijenja fokus/hash. Novi klik/ručno pomicanje poništavaju odgođenu korekciju. Zajednički `FAQ` pokriva oba jezika, home i detail; testovi `faq-scroll.spec.ts`. Povijesna istraga ispod opisuje stanje prije ove implementacije, ne aktualnu blokadu.

Chat: hrvatski public koristi Zendesk/Zopim preko GTM-a, ne Elfsight WhatsApp. Ranija provjera tražila je samo WhatsApp i propustila ovaj dodatak. Potvrđena HR poruka „Kako vam možemo pomoći?”, offline „Pošaljite poruku”; GTM sadrži i slovenski pozdrav „Kako vam lahko pomagamo?”. Iz toga nije potvrđen HR WhatsApp broj. Novi panel nije implementiran, postojeća chat UI ostaje nepromijenjena; ne izmišljati da Zendesk konfiguracija sadrži WhatsApp broj.

Rad dr. Ane: postojeći naslov u IT/HR profilu sada vodi na provjereni DOI `10.1111/clr.320_13042`, bez promjene biografskog teksta. Word ID-evi, izdavačev dokaz suautorstva, razlika između sažetka/e-postera i punog PDF-a te ograničenja dohvata dokumentirani su u [ana-beljan-research.md](ana-beljan-research.md). Izvorni IT `href="#"` zamijenjen je stvarnim linkom; HR naslov dobio je isti link.

Footer, 11. rujna: korisnik zatražio „Dentvitalis Fides”. Zajednički `data/site.ts:referenceBusiness.copyright` ispravljen iz „Dent Vitalis Fides” u „Dentvitalis Fides”, za HR i IT. Godina 2025, pravni tekstovi, kontaktni podaci i schema nisu mijenjani. Ovo je uska odobrena razlika prema referentnom footer tekstu.

FAQ istraga prije ove dorade: reproducirano da zatvaranje prethodnog dugog odgovora pomiče novo pitanje iznad viewporta, na HR FAQ-u i naslovnici, u Chromiumu/WebKitu te s animacijom i reduced-motion. Zajednički FAQ nema provjeru vidljivosti nakon promjene visine. Predložen uvjetni scroll ispod headera/breadcrumba samo ako pitanje/početak odgovora nisu vidljivi. **Popravak nije implementiran**; korisnik je zatražio istraživanje, nakon čega je zatražio ovu footer doradu.

Najnovija korisnička uputa: HR/IT politika privatnosti mora ostati doslovna, bez uredničkih ili pravnih ispravaka, uz font weba i pravilnu hijerarhiju međunaslova. `EditorialPage` koristi Montserrat i prelamanje dugih poveznica samo u članku privatnosti. `privacy-presentation.ts` prenosi postojeće nazive bez izmjene inline sadržaja: H2 za glavne cjeline/pravilnik, H3 za odjeljke pravilnika, H4 za osam prava. HR izvorni `question`, `policy-title`, `policy-section-title` odlomci postaju naslovi; IT postojeći naslovi dobivaju odgovarajuće razine. HR popis prava zadržava izvorne slovne oznake. Tekst, redoslijed, liste i hrefovi ostaju isti; uvjeti korištenja nisu obuhvaćeni. Regresija čuva SHA-256 teksta i DOM strukture s hrefovima uz normalizaciju jedino P/H2/H3/H4 tagova; zasebno provjerava hijerarhiju. To nije potvrda pravne ispravnosti niti noviji dohvat izvora. Izvorni IT Webflow snapshot i HR public snapshot od 8. rujna ostaju netaknuti. Ne popravljati ni očite tipfelere bez izričitog odobrenja.

Ovo je ulazna točka za drugog agenta, ne odobrenje novih sadržajnih ili produkcijskih promjena. GitHub i datirane odluke u povezanim dokumentima imaju prednost pred sjećanjem iz razgovora. Pri nastavku provjeriti noviji Git log i radno stablo; ovaj zapis nije automatski ažuriran.

## Okruženje i ovlasti

- Repozitorij: `slavisasrdic-debug/Dent-Vitalis-web`, grana `main`; native statički Astro, Node 24, npm 11, Git LFS.
- 28 IT + 27 HR sadržajnih stranica, zasebna 404. DE/EN/SI nisu implementirani niti su lažni hreflang parovi.
- Klijentski preview: <https://dent-vitalis-web.pages.dev/> i <https://dent-vitalis-web.pages.dev/hr/>. Push na `main` automatski pokreće Pages; link prikazuje posljednji uspješni build, ne lokalni rad.
- Preview ostaje `noindex, nofollow`. Ne uklanjati zaštitu radi PageSpeed SEO ocjene. To nije autentikacija; link je javan.
- Produkcijski `dentvitalis.com`, DNS, hosting, Search Console, Analytics i backend nisu promijenjeni niti odobreni za aktivaciju. Pages naziv “Production branch” nije odobrenje migracije.
- Obrazac/upload nema serversko slanje; WhatsApp/social/consent integracije čekaju odvojene odluke. Ne slati testne pacijentske upite.

## Obvezni početak sljedeće sesije

1. Pročitati `AGENTS.md`; prije ostalog rada `npm run preview:ensure`. Zadržati jedan server na `0.0.0.0:4321`, provjeriti lokalni i public HTTP 200/noindex i dati korisniku link. Ne gasiti tuđi proces ni mijenjati port.
2. `git status --short` i `git log -10 --oneline`; sačuvati tuđe izmjene. U novom checkoutu `git lfs pull` prije builda. Detalji: [obnova](source-versioning-proposal.md), [preview pravila](rules/preview.md), korijenski README.
3. Učitati samo relevantna obvezna pravila iz `docs/rules/`. Za HR dodatno [intake](croatian-content-intake.md). Za UI relevantni dio [komponentne mape](astro-component-map.md).
4. Ne preuzimati ponovno nepromijenjene izvore niti ponavljati cijeli prihvat. Koristiti datirane hashove, postojeće audite i ciljane testove.
5. Check/build/generatori odvojeno od browser testova; najviše dva Playwright workera. Browser emulacija nije fizički iPad/iPhone test.
6. Korisnik je odobrio commit/push dovršenog rada. Prije pusha `git lfs fsck`, provjera ignoriranja izvornih ZIP-ova i `git diff --check`; stageati samo vlastiti opseg. Usporediti lokalni HEAD s origin/main i provjeriti Cloudflare Pages check. Bez force-pusha i produkcijskih zahvata.

## Završene dorade i gdje su dokumentirane

| Područje                    | Implementirano                                                                                                                                                                                | Dokaz / detalji                                                                                              |
| --------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| Izvori i jezici             | Prihvaćen Webflow referentni snapshot; originalni bajtovi sačuvani. HR tekst iz stabilnih DOCX ID-eva, pravni tekst iz odobrenog public HR weba; zasebni HR kontakti.                         | `croatian-content-intake.md`, `croatian-review.md`, `source-intake-2026-09-07.md`; `test:content`, `test:hr` |
| Odobreni sadržajni ispravci | Krunice “već od 220 €”; “Dr. XY” zamijenjen s “Il Dr. Domagoj Žalac” prema Wordu. Nisu otvoreni nalazi. Skriveni profil nije otkriven.                                                        | commit `fb00635`, `data/editorial-corrections.json`                                                          |
| Logo i favicon              | Inline izvorni logo bez kasnog zahtjeva; HR “STOMATOLOG RIJEKA”; favicon s javnog weba.                                                                                                       | `BrandLogo`, `favicon-source.md`, commit `1ce23d6`                                                           |
| Navigacija                  | Čitljivi razmaci, desktop meni od 1200px, miš/touch odvojeni; prvi klik otvara grupu, klik otvorenog naziva vodi na parent.                                                                   | komponentna mapa, `tests/navigation-click.spec.ts`, `tests/navigation-hover.spec.ts`                         |
| Sidebar i kartice           | Smanjen razmak naslova sidebara; pravni sidebar na HR; uvijek četiri ostale usluge, unutar margina, 2×2 desktop / jedan stupac mobile; uklonjena nepotrebna prazna visina kratkih kartica.    | `astro-component-map.md`, `legal-sidebar`, `sidebar-spacing`, `related-services`, `directory-layout` testovi |
| Kontaktna kontrola          | Upload layout inline/popup, oba jezika, duge datoteke i greške; kratki HR CTA “Pitaj stomatologa”; parking linkovi imaju opisne oznake, izvorni različiti hrefovi sačuvani.                   | `upload-layout.spec.ts`, `parking-links.spec.ts`, komponentna mapa                                           |
| Učitavanje                  | Kritični fontovi prije prvog layouta, isti Latin/Extended fontovi; first-screen eager slike, responsive hero preload, statična geometrija direktorija; spriječen pomak pri streamingu HTML-a. | `font-loading.spec.ts`, `fonts.spec.ts`, `hero-streaming.spec.ts`, komponentna mapa                          |
| Izgled/pristupačnost        | Zelene hero poveznice/hover na plavoj podlozi, lijevo poravnanje; kontrast/cache i semantičke dorade.                                                                                         | `astro-component-map.md`, commitovi `e61be94`, `ee80681`                                                     |
| SEO/schema/XML              | Lokalizirani metapodaci i alt/ARIA, stvarni IT/HR parovi, canonical s `/`, tipovi stranica iz sadržaja, provjereni datumi 13 videa. Bez izmišljenih ocjena/reviewera ili skrivenog AI teksta. | `seo-migration.md`, `data/video-metadata.json`                                                               |
| Sidra i breadcrumb          | Zajednički offset header + stvarna visina breadcrumba; roditeljski linkovi se ne stišću ispod širine teksta, dugi nazivi se prelamaju.                                                        | commitovi `d46766f`, `5c8cea7`; `anchor-offsets.spec.ts`, `breadcrumb-alignment.spec.ts`                     |

Potpuna povijest je u `git log`, a propsi, responsive varijante, namjerna odstupanja i testovi u [komponentnoj mapi](astro-component-map.md). Gornja tablica nije potvrda da je cijeli web spreman za produkciju.

## Najnoviji zadatak: mobilni razmak H1/podnaslov

Na zahtjev korisnika zajednički `DetailHero` do 991px mijenja razmak s 20 na 12px. Postavljene su obje susjedne margine jer kolabiraju. Desktop od 992px, fontovi, tekstovi, fotografije, eyebrow i home hero nisu promijenjeni. Nova regresija: `tests/detail-hero-spacing.spec.ts`, svih 53 unutarnjih stranica na sedam širina 320–1440px, uz reload i breadcrumb navigaciju. Rezultat provjere ove izmjene zabilježen je niže nakon izvršavanja.

## Što još čeka odluku (ne popravljati nagađanjem)

- Jedna aktualna sadržajna lista: [croatian-review.md](croatian-review.md). Banka/IBAN/SWIFT, anestezija u paketu izbjeljivanja, kontaktni i pravni tipfeleri, medicinske/uredničke potvrde i neprimjeren biografski odlomak u “Cosa portare alla visita”. Povijesni nalazi u `known-content-issues.md` nisu svi aktualni.
- [Redirect prijedlog](redirect-proposal.md), commit `812430e`: svih 206 inventariziranih URL-ova, 24 predložena 301, 2 ista URL-a, 180 otvorenih odluka (50 IT/HR, 105 DE/EN/SI, 25 starih 404). **CSV nije aktivan niti generira server pravila.** Nema odabranih 410. Ne poistovjećivati različite implantološke konstrukcije po broju implantata.
- Prije konačne migracije dopuniti inventar Search Console/server-log/backlink dokazima ako ih vlasnik omogući; potvrditi nove sadržajne ekvivalente i sudbinu DE/EN/SI.
- Potvrditi hosting i deploy/rollback, odobriti backend i sigurnost uploada, consent za vanjske servise, poslovne/pravne/medicinske podatke. Tek zasebnim odobrenjem uključiti produkcijsko indeksiranje. [Pre-launch lista](pre-launch-checklist.md) ostaje otvorena.

## QA evidencija i ograničenja

- Završna provjera privatnosti nakon vraćanja izvornog slovnog HR popisa: ciljani skup 3/3 Chromium i 3/3 WebKit; početni Chromium pokušaj nakon rebuilda imao je prekid navigacijskog konteksta, stabilni ponovni prolaz je uspješan. Mobilne HR i desktop IT snimke vizualno pregledane; privremeni PNG-ovi u `/tmp/privacy-*` nisu trajna pohrana dokaza. Originalni sadržajni snapshotovi ostaju nepromijenjeni u Gitu.

- Privatnost 11. rujna: 6/6 provjera sadržajnih izvora, check/lint/build prolaze. Novi checksum testovi potvrđuju nepromijenjen tekst, inline sadržaj, redoslijed i hrefove uz dopuštenu promjenu heading tagova; 11 HR / 12 IT H2, devet H3 i osam H4 bez preskakanja razina. Ciljani Chromium skup 8/9 u prvom prolazu (jedan prekid navigacijskog konteksta); ponovljeni pogođeni test prolazi. WebKit 9/9, uključujući pravni sidebar i tipkovničku/no-JS navigaciju. Nije rađen novi pravni audit ni slobodno uređivanje izvora.

- Mobilni razmak: `check` (150 datoteka, bez grešaka/upozorenja), `lint` i build (56 stranica) prolaze. Sve 53 rute × sedam širina prolaze u Chromiumu i WebKitu. Chromium interakcijski test isprva je imao pogrešan očekivani parent URL `/su-di-noi`; usklađen je sa stvarnim, nepromijenjenim `/chi-siamo` i ponovljeni test prolazi. WebKit 3/3 u zajedničkom prolazu. Nije mijenjana navigacija radi testa. Git LFS fsck i izuzeća ZIP-ova provjereni su prije pusha.

- Breadcrumb izmjena `5c8cea7`: 63/63 Chromium provjere; WebKit 62/63 u prvom prolazu zbog vanjske Google Places mrežne greške, zatim ciljani HR test prolazi. Sve geometrijske provjere prošle. Dodatno 7/7 cold-font/tablet testova u svakom engineu. Cloudflare check uspješan i novi CSS vizualno potvrđen na online previewu.
- Povijesni rezultati HR/SEO/performance audita ostaju datirani u svojim dokumentima. Nije tvrđeno da je posljednja izmjena prošla novi puni `npm run validate` niti novi PageSpeed audit.
- Privremene snimke `/tmp/` i raw cache `.astro/audits/` nisu jamčeni u novom Codespaceu. Ponovljivi testovi, izvori i odluke jesu verzionirani. Novi agent treba ponoviti samo relevantne provjere, ne oslanjati se na postojanje privremenih PNG-ova.
- Browser plugin nije dostupan u ovoj sesiji; koristi se postojeći Playwright Chromium/WebKit. Fizički uređaji, stvarno slanje obrasca i budući produkcijski server nisu testirani.

Korisnik traži da se daljnje dovršene promjene dokumentiraju, commitaju i pošalju na GitHub. Ažurirati ovaj sažetak kada se promijene status, blokatori ili sljedeći zadatak; detaljnu implementaciju držati u pripadajućem dokumentu, ne duplicirati cijelu povijest razgovora.
