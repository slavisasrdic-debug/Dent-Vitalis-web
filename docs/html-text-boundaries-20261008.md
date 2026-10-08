# Razdvajanje HTML teksta — V21, 8. listopada 2026.

## Nalaz i odobreni opseg

Javni HR home vraća 200. Telefon i e-mail u footer `address.textContent`
stoje spojeno (`380it@dentvitalis.com`), iako ih `innerText` i CSS prikazuju
u zasebnim redovima. Meta opis nije izvor prikazanog Google isječka.
Vlasnik je odobrio generalno, ali ciljano razdvajanje stvarnih informacija
u svih pet jezika, bez izmjene sadržaja, dizajna, CRM-a ili drugih funkcija.
Google može birati drugi tekst ovisno o upitu; ne jamči se izgled isječka
ni rok promjene. Nema `data-nosnippet`, skrivenog teksta ni novih SEO tvrdnji.

## Implementacija

`src/middleware.ts` obrađuje samo HTML odgovore tijekom statičkog builda
i razvoja. `src/lib/html-text-boundaries.ts` umeće obične ASCII razmake
na stvarnim semantičkim granicama (odlomci/naslovi/liste/retci/tablice),
nakon `br` i između poznatih samostalnih footer/sidebar/kontakt stavki.
Ne razdvaja normalan inline tekst, naglašene dijelove riječi ili interpunkciju.
Ne ovisi o širini ekrana i ne dodaje razmak pri automatskom prelamanju.
Komentari i atributi čitaju se uz praćenje navodnika; JS/CSS/JSON-LD kopiraju
se doslovno, ne obrađuju kao HTML. Head, forme, pre/code, SVG/MathML i
template sadržaj zaštićeni su. Obrada je idempotentna.

Na cPanel se šalju obične HTML datoteke; ne instalira se middleware,
Node, biblioteka ili novi JavaScript. Nema novih dependencyja ili asseta.
Poslovni modeli, prevoditeljski izvori i sve komponente ostaju isti.

## Provjere

- Četiri ciljana unit testa: blokovi/br, samostalne stavke, inline riječi,
  byte-identični zaštićeni sadržaji te idempotencija.
- Usporedba svih 142 finalnih production HTML-a s verificiranim V20
  baznim ZIP-ovima V15/V16/V18/V19/V20: samo očekivani ASCII razmaci.
  Head, skripte, CSS, forme i SVG u svakom HTML-u byte-identični.
  UUID-jevi formulara/popupova sačuvani iz instaliranih bajtova.
- Svi generirani JS/CSS/font/slika/video asseti odgovaraju postojećim
  manifest hashovima. Stare datoteke koje build više ne generira ne brišu
  se; routing/XML ne regenerira se za ovaj deployment.
- 24 Chromium provjere: 12 reprezentativnih ruta × 390/1440px,
  svih pet kontaktnih jezika, home IT/HR, HR usluge/cjenik/FAQ/galerija/video.
  Prije/poslije geometrija **svih body elemenata** jednaka do 0,01px,
  forme identične, nema overflowa/pageerrora/overlaya, popup/Escape i
  FAQ rade; nema POST zahtjeva. Footer textContent ima stvarne razmake.
- Astro check 314 datoteka bez dijagnostike, ciljani lint/format i build
  142 stranice prolaze. Preview ostaje aktivan i noindex.
- Browser plugin/skill nisu dostupni: korišten postojeći Playwright.
  Desktop/mobilne HR footer snimke: `/tmp/dv-text-boundaries-v21-hr-1440.png`
  i `/tmp/dv-text-boundaries-v21-hr-390.png`; nisu pohranjene u Git.

Ne tvrdi se novi prihvat udaljenog CookieYes/GTM/YouTube ponašanja ili
slanja e-mail/CRM upita: taj kod nije mijenjan i upiti nisu slani.
Nije izvršena produkcijska objava niti Search Console reindeksiranje.

## Paket i nastavak

`scripts/package-text-boundaries-update.mjs` zahtijeva provjerene stare
ZIP-ove i uspješan production build. Svih 142 novih HTML-a generira samo
iz verificiranih instaliranih V20 bajtova pomoću iste funkcije razdvajanja.
Manifest nasljeđuje sve prethodne non-HTML hashove; mijenja samo HTML zapise.
Paket: `.astro/releases/dentvitalis-text-boundaries-20261008-v21.zip`.
Receipt: `data/seo/text-boundaries-v21-release-20261008.json`.

Javni V20 je instaliran prema vlasnikovu izvještaju od 7. listopada:
potvrđeni svih 16 hashova, 50 reprodukcija/titlova i 0700 backup.
Ta potvrda nije ponovno izvedena razvojnom automatizacijom.

V21: 142 HTML datoteke + manifest; README i privatni patch-manifest
sadrže točan popis i stare/nove SHA-256. Potreban backup istih 143 datoteka,
0700, te dovoljno prostora za ZIP/extract/backup/rezervu. Datoteke 0644,
korijen zadržati 0750, manifest posljednji. Bez rename/brisanja root-a,
zamjene cijelog `_pages`, backenda, asseta, konfiguracije ili XML/routing zahvata.
Rollback vraća samo tih 143 izvornika. Javni prihvat obavlja cPanel agent
prema README-u; do tada V21 nije instaliran.

Primarna dokumentacija:
[Google snippets](https://developers.google.com/search/docs/appearance/snippet),
[Astro middleware](https://docs.astro.build/en/guides/middleware/).
