# Obvezna detaljna pravila projekta

Izdvojeno iz AGENTS.md 2026-09-08 bez ukidanja pravila. Učitati prema usmjeravanju u korijenskom AGENTS.md.

### Preview na početku svake radne sesije

- Prije ostalih zadataka provjeriti razvojni server na `0.0.0.0:4321`. Ako ne radi, pokrenuti ga u postojećem Astro projektu; ako radi, ne pokretati drugu instancu niti prebacivati preview na drugi port.
- Po korisničkom odobrenju razvojni Codespaces port **4321 mora biti public**, kako korisnik može pratiti rad. Provjeriti postoji li prosljeđivanje porta; nakon prekida/restarta obnoviti ga prema postupku u README-u.
- Potvrditi HTTP 200 i stvarnu DentVitalis stranicu na vanjskom preview URL-u, ne samo otvoren lokalni port. Korisniku odmah dati funkcionalni link prije nastavka duljeg rada. Ako obnova nije moguća, odmah jasno prijaviti točan problem.
- Server i potrebno prosljeđivanje ostaviti aktivnima tijekom rada i nakon predaje rezultata. Ovo odobrenje vrijedi samo za razvojni preview, ne za produkcijsku objavu, DNS, hosting ili slanje obrazaca.
- Korisnik je 2026-09-08 odobrio automatsko pokretanje previewa pri otvaranju Codespacea. `.devcontainer/devcontainer.json` poziva `scripts/ensure-preview.sh` pri startu i ponovnom spajanju; isti postupak ručno pokreće `npm run preview:ensure`. Skripta ne duplicira server, ne mijenja druge portove i provjerava lokalni i vanjski HTTP 200, DentVitalis sadržaj i `noindex`. Logovi i lock su u ignoriranom `.astro/preview/`.
- Nova devcontainer konfiguracija u postojećem Codespaceu zahtijeva jednokratni **Rebuild Container**; ne tvrditi da je lifecycle automatizacija aktivna dok konfiguracija nije primijenjena. Do tada asistent i dalje sam pokreće provjeru na početku sesije. Ne raditi rebuild usred pregleda bez najave; zatvoren/zaustavljen Codespace ne može posluživati preview. Bez commita/pusha konfiguracija još nije dostupna u novom Codespaceu.
