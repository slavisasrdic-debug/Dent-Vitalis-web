# Pravni članci i kontaktne poveznice — 11. rujna 2026.

## Opseg i odobrenje

Korisnik je zatražio klikabilne e-mailove, telefone i web-adrese na cijelom novom webu, potom usporedbu privatnosti i uvjeta korištenja s aktualnim javnim sajtom, uz novi dizajn. Novi projekt ima 55 sadržajnih ruta (28 IT, 27 HR); DE/EN/SI nisu implementirani niti se ovim zadatkom izrađuju ili mijenjaju na starom javnom serveru.

Nakon prijave razlika korisnik je izričito potvrdio: **„Da, javni tekst je mjerodavan za oba članka”** — za oba talijanska pravna članka. To je novo odobrenje sadržaja koje ima prednost nad prethodnim IT Webflow pravnim blokovima. Nije odobrenje slobodnog pravnog uređivanja niti potvrda pravne usklađenosti.

## Izvori i reproduciranje

Četiri javna članka sačuvana su bez izmjene bajtova u `reference/legal-public/2026-09-11/`. `src/content/legal-public.json` sadrži izvedeni AST i SHA-256 svakog izvora. `.gitattributes` čuva bajtove, a Prettier izuzima snapshot i generirani JSON. `node scripts/audit-legal-public.mjs` ponovno koristi postojeće snapshote bez mrežnog dohvata/prepisivanja; parsira ih inertno, bez izvođenja skripti ili obrazaca.

- IT privatnost: https://www.dentvitalis.com/informativa-sulla-privacy
- IT uvjeti: https://www.dentvitalis.com/condizioni-di-utilizzo
- HR privatnost: https://www.dentvitalis.com/hr/polica-privatnosti
- HR uvjeti: https://www.dentvitalis.com/hr/uvjeti-koristenja

HTML cijele javne stranice sadrži promjenjivi okvir/tokenizaciju, pa hash cijelog HTML-a može varirati i bez izmjene članka. Pri sadržajnoj usporedbi test zasebno provjerava tekst, popise, naglaske i linkove izdvojenog članka. Izvorni Word, prethodni Webflow i HR legal snapshotovi ostaju netaknuti.

## Nalazi i implementacija

- IT privatnost iz Webflowa izgubila je stvarne popise/ugnježđivanja i link na uvjete, imala ručno ispisane brojeve/asteriske i manje tekstualne razlike prema public izvoru. `applyPublicLegal` sada koristi doslovni odobreni public tekst, popise `ol type="a"`/`ul`, osam naglašenih prava te izvorne linkove. Semantički H2/H3/H4 slijede izvorne nazive; ne izmišljaju se novi naslovi.
- IT uvjeti sadržajno su se razlikovali (uključujući starog nositelja Dentvitalis d.o.o. i odlomak o privatnim ordinacijama). Odobreni novi izvor navodi Dentvitalis Fides d.o.o.; preuzet je cijeli članak, ne parcijalna zamjena naziva.
- HR članci tekstualno odgovaraju javnima (zanemarujući HTML whitespace). Zadržan je prethodni potvrđeni HR izvor. Svi uređeni popisi privatnosti dobivaju izvorne slovne oznake, ne samo osam prava. Naslovi ostaju postojeća odobrena prezentacijska hijerarhija.
- Sva četiri pravna članka koriste `--font-body` i prelamanje dugih poveznica, u postojećem novom layoutu i s pravnim sidebarom. Uvjeti više ne ostaju na Arialu; ovo je nova korisnička dopuna ranijoj privacy-only tipografiji.
- `contact-links.ts` na SSR razini prepoznaje zapisana e-mail/URL/telefonska polja. `InlineContent` nikad ne stvara link unutar postojećeg linka. `SectionHeading` koristi isti renderer za uvodne telefonske pozive. Vidljivi tekst, interpunkcija i whitespace ostaju isti; novi linkovi su podcrtani, nasljeđuju font i prelamaju se.
- OIB, datumi, poštanski brojevi i cijene nisu telefoni. Brojevima se ne izmišlja pozivni broj. E-mailovi s postojećim predmetom poruke ostaju netaknuti.
- U HR privatnosti zapisani `+38551371064` imao je pogrešan href `tel:0038550371064`. Odredište je usklađeno na `tel:+38551371064`, bez promjene prikazanog broja. Ekvivalentni IT `0038551371064` normalizira se na isti `+` format.
- Tipfeler `www.dentivitalis.com` u HR pravnom tekstu ostaje doslovan; njegov postojeći ispravni link na `/hr/` ostaje sačuvan. Ne pretvarati ga u odredište s pogrešno napisanom domenom.
- `dentiumeu.com` iz obje biografije ne može se razriješiti u DNS-u pri provjeri. Ne izmišljati zamjenski portal niti linkati nefunkcionalnu domenu. Zadržati doslovnu spomenutu domenu kao tekst; naslov rada već ima provjereni DOI (vidi `ana-beljan-research.md`).

## Provjere i granice

`tests/contact-links.spec.ts`: svih 55 ruta, preostali neklikabilni kontaktni literali uz dokumentiranu neaktivnu domenu; literalni tokenizer i negativni primjeri; mobilno prelamanje/no-JS; aktivacija tipkovnicom presretnuta bez otvaranja poziva ili slanja pošte.

`tests/legal-public.spec.ts`: hash izvora, cijeli tekst/redoslijed bez promjene slova/interpunkcije/brojeva, broj/tip/ugnježđivanje popisa, podebljani nazivi, izvorni linkovi uz dokumentiranu telefonsku korekciju, hijerarhija i Montserrat na 320/390/820/1440px za sva četiri članka.

`tests/privacy-presentation.spec.ts` zadržava stari HR checksum, uz isključivo odmotavanje novih linkova i normalizaciju jedne odobrene href korekcije za usporedbu. Stari IT checksum više nije mjerodavan: zamijenjen je usporedbom s novim izričito odobrenim public izvorom. `tests/doctor-research.spec.ts` dobio je eksplicitni `return undefined` radi stroge TS provjere, bez promjene sadržaja.

Browser plugin nije dostupan; koristi se postojeći Playwright Chromium/WebKit. Nema pravnog mišljenja, provjere stvarne isporuke e-maila/poziva ili promjene consent/backenda. Noindex preview ostaje; DNS i produkcija nisu mijenjani. FAQ scroll i WhatsApp panel nisu dio ove izmjene.

Završni rezultati: check (161 datoteka, 0 grešaka), lint, šest testova izvora i build (56 stranica uključujući 404) prolaze. Ciljani Chromium prolaz: 12/12 pravni/kontaktni/DOI testovi; zasebno 14/14 naknadno odobrenih FAQ scroll testova. WebKit zajednički prolaz 26/26. Puni HR regresijski skup prošao je 21/21 prije naknadnog FAQ popravka; nije ponavljan kao novi puni prihvat. Početni QA otkrio je test koji pokušava vezati click listener uz isključen JS (razdvojeno na no-JS fokus i JS aktivaciju) te razliku u IT naslovu uvjeta; naslov sada doslovno prati novi izvor „Condizioni d’utilizzo”.

Vizualno pregledane snimke: mobilni kontaktni dio IT privatnosti i desktop popis prava (`/tmp/legal-contacts-mobile.png`, `/tmp/legal-lists-desktop.png`). Privremene snimke nisu trajna pohrana; ponovljivi testovi i izvorni snapshotovi jesu. FAQ naknadno odobren i implementiran u istom završnom checkpointu, odvojeno od pravnog sadržaja (vidi handoff i komponentnu mapu).
