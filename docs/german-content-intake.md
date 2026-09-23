# Njemačka verzija — dovršavanje 23. rujna 2026.

Korisnik je nakon javnog audita zatražio dovršavanje svih DE nedostataka, objavu kroz GitHub i vizualnu provjeru stvarnog Pages previewa. Opseg je njemačka verzija; EN/SI nisu ovime dovršeni ni omogućeni u jezičnom izborniku. Produkcijska domena, DNS i slanje obrazaca ostaju nepromijenjeni.

## Izvori i struktura

- Nepravni tekst: neizmijenjeni dostavljeni DE DOCX, njegov SHA-256 i odlomci u `data/translations/de-source.json`.
- `src/content/de/source.ts`: dohvat po eksplicitnim ID-ovima (DE koristi c0), bez indeksnog poravnavanja s HR. Semantičke selekcije u `inner.ts` i `special.ts` pregledane su prema njemačkim tablicama; razlike su posebno mapirane.
- Sastav prati HR: 27 stranica, zajednički HomePage i inner komponente, iste fotografije i cropovi, 5 portreta liječnika, 5 usluga i po 4 povezane kartice, 15 prije/poslije parova te 13 postojećih videa. Video identiteti i izvorni jezik snimki nisu promijenjeni niti su izmišljeni titlovi.
- Naslovnica uključuje svih 12 izvornih skupina: hero, uvod, četiri usluge, osnivačevu poruku/dokumentaciju, o klinici, recenzije, osam informacijskih kartica, FAQ i kontakt.
- Posebno mapirani izvori: t12 sedacija, t18 cjenik, t19 Google recenzije, p111–p195 post-treatment recenzije, t20–t21 FAQ, t22–t24 galerija, t25–t29 kontakt.
- Talijanski zaostali urednički naslovi p66/p99 nisu objavljeni kao njemački tekst. Koriste se potvrđeni njemački naslov p67 i njemačka UI oznaka Google-Bewertungen. Ostale rečenice nisu samovoljno redigirane.

## Poslovni podaci i iznimke

- Postojeći PDF417 platni kod koristi se bez promjene bajtova ili podataka, uz njemačke oznake. Nije generiran novi kod, nije dodan redirect servis niti tvrdnja da kod nema iznos.
- Zastarjeli SWIFT ZABAHR2X iz t15.r3.c0.p11 zamijenjen je već potvrđenim Erste SWIFT-om ESBCHR22 iz centralnog poslovnog izvora. IBAN i primatelj ostaju postojeći.
- T5.r0.c0.p10 ima zaostalu cijenu krunice 330 €. Primijenjena je ranije odobrena usklađena vrijednost „već od 220 €”; sam DOCX nije promijenjen. Test vodi eksplicitnu iznimku, ne skriva neslaganje.
- Hero fiksnog mosta koristi njemački naslov s home kartice t1.r3.c0.p3 (kao odgovarajući HR sastav), a podnaslov iz t3.r0.c0.p4. Kraće UI oznake navigacije nisu zamjena za pune naslove u sadržaju.
- Njemački izvorni kontakti ostaju očuvani, uključujući it@dentvitalis.com, booking@dentvitalis.com te posebne brojeve prvog pregleda i kontrola. Telefoni/e-mail/WhatsApp imaju odgovarajuće linkove.
- DOI rada dr. Ane je postojeći potvrđeni izvor; povezan je točan njemački naslov rada.

## Pravne stranice

Izvor je javni njemački Dentvitalis, izričito odobren korisnikovim nalogom. Neizmijenjeni HTML snapshotovi su u `reference/legal-public/2026-09-23/`; izvučeni tipizirani tekst je `src/content/de/legal-public.json`.

- `/de/datenschutzerklarung`: SHA-256 `4e4a92010ddb912832768d691e274a63b41702490802787dd5300646f0947d91`.
- `/de/nutzungsbedingungen`: SHA-256 `e3115585c8b2a0f6660a31edcfcfa6f467bf0939a8baa714b8a6a6ce1f254561`.
- Parser prenosi tekst, naglaske, poveznice, izvorne liste i hijerarhiju u postojeće komponente; stari HTML/CSS/JS ne ulazi u aplikaciju. `Haftungsausschluss` je podnaslov, a prava ispitanika H4 pod izvorno označenim H3 odjeljkom.
- Članak, kontaktna privola, footer, sidebar i jezični parovi vode na stvarne DE pravne stranice. Povijesni kontakti u pravnom izvorniku nisu zamijenjeni poslovnim kontaktima drugih stranica.

## URL-ovi i UI

`de/routes.ts` je jedan registar svih 27 DE odredišta. Postojećih 15 detaljnih adresa ostaje nepromijenjeno; nedostajuće stranice slijede postojeću ravnu /de/ konvenciju. Nema produkcijskih redirekcija. IT/HR/DE koriste stvarne recipročne parove za svih 27 stranica; talijanski prijevoz nema izmišljeni DE ekvivalent.

Njemački složeni nazivi zahtijevaju ograničene tipografske prilagodbe: desktop hero ima nešto širi tekstualni stupac i prilagodljivi H1, mobilni H1 i odabrani naslovi kartica/članaka imaju manje veličine. Font, boje i zajedničke komponente ostaju iste. Nema dijeljenja riječi, skrivanja teksta ili odsijecanja naslova. Pravila su ograničena na html[lang=de].

## Ponovljive provjere

`tests/german-completeness.spec.ts`: svih 27 ruta, izvorni odlomci, fotografije, portreti, galerija, povezane kartice, validna interna odredišta, vidljiva obveznost telefona, desktop/mobile prikaz i interakcije. Dodatna provjera naslova mjeri stvarni tekst unutar tekstualnog stupca, ne samo overflow cijelog dokumenta.

`tests/german-navigation.spec.ts`: recipročne IT/HR/DE poveznice, pravi klikovi jezičnog i glavnog menija. `tests/german-legal.spec.ts`: SHA-256 izvora te jednakost cijelog pravnog teksta, popisa, naglasaka i poveznica s originalnim HTML-om. `tests/croatian.spec.ts` zadržava HR regresije i očekuje svih 27 DE jezičnih parova.

Javni testovi koriste `QA_ORIGIN=https://dent-vitalis-web.pages.dev`; lokalni i javni rezultat ne smiju se poistovjećivati. Vizualni dokazi i radne snimke ostaju u /tmp, ne u produkcijskom buildu. Slanje upita klinici i stvarna bankovna transakcija ne izvode se tijekom QA-a.
