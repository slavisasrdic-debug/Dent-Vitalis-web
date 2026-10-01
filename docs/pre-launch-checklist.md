# Kontrolna lista prije objave

Ova lista ne odobrava objavu. Svaki korak zahtijeva zaseban nalog i provjeru.

## Sadržaj i podaci

- [ ] Potvrđeni su naziv, adresa, telefon, e-mail i WhatsApp broj.
- [ ] Nema placeholdera, nepotvrđenih cijena ni medicinskih tvrdnji.
- [ ] Objavljuju se samo prijevodi sa statusom `published`.
- [ ] Autor, medicinska provjera, izvori i datum izmjene postoje gdje su potrebni.

## Tehnička provjera

- [ ] Instalirani privatni `/form-tokens` i upload guard odgovaraju hashovima
      release manifesta; postojeća sesija, CSRF/GCT i MIME limit su provjereni.
- [ ] Legacy JSON `ok` nije jedini dokaz dostave: stvarni inbox i CRM lead
      provjereni su zasebno, uz dogovorenu obradu neuspjele dostave.
- [ ] `npm run validate` prolazi.
- [ ] Sve stranice rade bez JavaScripta i tipkovnicom.
- [ ] Provjereni su responsive prikazi i `prefers-reduced-motion`.
- [ ] Slike imaju dimenzije, responsive izvedenice i ispravan alt.
- [ ] Video i third-party iframeovi ne blokiraju početno učitavanje.
- [ ] Forma i upload imaju potvrđenu sigurnu serversku obradu.
- [ ] `/send` na cPanel produkcijskom serveru prima potvrđeni ugovor postojeće
      forme, uključujući sigurnosne tokene koje izdaje server.
- [ ] Potvrđeni su primatelji, CRM/prosljeđivanje, obrada privitaka i zaštita
      od spama iz legacy handlera; nijedna vrijednost nije pretpostavljena iz
      frontenda.
- [ ] Kontrolni staging upit s ne-pacijentskim podacima dokazano stigne na
      odobreni testni inbox/CRM prije objave na `dentvitalis.com`.
- [ ] Prije svake objave na serveru postoje najmanje dvije vremenski označene,
      provjerljive prethodne verzije izvan javnog web-korijena, s postupkom
      povrata bez promjene baze ili konfiguracije na slijepo.

## SEO migracija

- [ ] Sačuvan `/sitemap.xml` uz novi sitemap index i produkcijski robots.
- [ ] Sačuvana postojeća Meta potvrda domene; CookieYes učitava samo GTM.
- [ ] Popis uklonjenih kampanja pregledan je prije dodatnih 410 pravila.
- [x] Newsletter nije dio novog weba po izričitoj odluci vlasnika 1. listopada.
- [ ] Redirect inventar je potpun i automatizirano testiran.
- [ ] Canonical, hreflang, sitemap, robots i 404 su provjereni.
- [ ] Napravljen je visual regression prema Webflow referenci.
- [ ] Nisu mijenjani DNS, domena, hosting, Search Console ili Analytics bez naloga.
