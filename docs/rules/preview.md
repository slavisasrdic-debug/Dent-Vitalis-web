# Obvezna detaljna pravila projekta

Izdvojeno iz AGENTS.md 2026-09-08 bez ukidanja pravila. Učitati prema usmjeravanju u korijenskom AGENTS.md.

### Javni klijentski preview — odobreno 2026-09-09

- Cloudflare Pages projekt `dent-vitalis-web` povezan je s GitHub granom `main`: IT `https://dent-vitalis-web.pages.dev/`, HR `https://dent-vitalis-web.pages.dev/hr/`. Postavke obnove i LFS build naredba su u README-u. Ne stvarati drugi projekt niti mijenjati hosting/DNS bez novog naloga.
- Push na `main` sada pokreće i javni preview build. Prije tvrdnje da je promjena dostupna klijentima provjeriti Cloudflare Pages check za točan commit i stvarni javni odgovor. Neuspjeli build ne znači da je prethodni preview nestao. Lokalni Codespaces prikaz može sadržavati još nepushane izmjene; ne predstavljati ga kao istu objavljenu verziju.
- Odobrenje vrijedi samo za ovaj `pages.dev` preview: sačuvati `noindex`, ne aktivirati slanje obrazaca, ne mijenjati produkcijsku domenu, canonical/hreflang ni DNS. Javni link nije privatan; `noindex` nije kontrola pristupa. Objavljivati isključivo `dist/`, bez izvornih dokumenata i referenci.
- `public/_headers` dodatno postavlja `X-Robots-Tag: noindex, nofollow` samo na ovaj Pages host i njegove deployment/branch poddomene. Ne uklanjati zaštitu radi PageSpeed SEO ocjene. `immutable` cache vrijedi za hashirane `_astro`/Montserrat pakete i video URL-ove s automatskim SHA-256 `?v=` iz `videoUrl()`; ne hardkodirati neverzionirani video URL niti dodavati dugi cache HTML-u ili proizvoljnim slikama. Izmjena videa + build automatski mijenja njegov cache ključ bez dupliranja asseta.
- Codespaces postupak ispod ostaje obvezan za razvojne sesije; Pages preview ne zahtijeva aktivan Codespace.

### Preview na početku svake radne sesije

- Prije ostalih zadataka provjeriti razvojni server na `0.0.0.0:4321`. Ako ne radi, pokrenuti ga u postojećem Astro projektu; ako radi, ne pokretati drugu instancu niti prebacivati preview na drugi port.
- Po korisničkom odobrenju razvojni Codespaces port **4321 mora biti public**, kako korisnik može pratiti rad. Provjeriti postoji li prosljeđivanje porta; nakon prekida/restarta obnoviti ga prema postupku u README-u.
- Potvrditi HTTP 200 i stvarnu DentVitalis stranicu na vanjskom preview URL-u, ne samo otvoren lokalni port. Korisniku odmah dati funkcionalni link prije nastavka duljeg rada. Ako obnova nije moguća, odmah jasno prijaviti točan problem.
- Server i potrebno prosljeđivanje ostaviti aktivnima tijekom rada i nakon predaje rezultata. Ovo odobrenje vrijedi samo za razvojni preview, ne za produkcijsku objavu, DNS, hosting ili slanje obrazaca.
- Korisnik je 2026-09-08 odobrio automatsko pokretanje previewa pri otvaranju Codespacea. `.devcontainer/devcontainer.json` poziva `scripts/ensure-preview.sh` pri startu i ponovnom spajanju; isti postupak ručno pokreće `npm run preview:ensure`. Skripta ne duplicira server, ne mijenja druge portove i provjerava lokalni i vanjski HTTP 200, DentVitalis sadržaj i `noindex`. Logovi i lock su u ignoriranom `.astro/preview/`.
- Nova devcontainer konfiguracija u postojećem Codespaceu zahtijeva jednokratni **Rebuild Container**; ne tvrditi da je lifecycle automatizacija aktivna dok konfiguracija nije primijenjena. Do tada asistent i dalje sam pokreće provjeru na početku sesije. Ne raditi rebuild usred pregleda bez najave; zatvoren/zaustavljen Codespace ne može posluživati preview. Bez commita/pusha konfiguracija još nije dostupna u novom Codespaceu.
