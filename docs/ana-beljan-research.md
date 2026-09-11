# Rad dr. Ane Beljan — poveznica, 11. rujna 2026.

Korisnik je zatražio pronalazak rada u dokumentaciji i dodavanje linka uz profil. Rad je već spomenut u oba jezika, pa nije dodan drugi odlomak niti slobodan prijevod.

- Word `reference/Dentvitalis web tekstovi - it + hr (1).docx`: IT `t6.r4.c0.p4`, HR `t6.r4.c1.p5` u postojećem katalogu. Oba navode usporedbu All-on-4 protokola između implantoloških sustava s trogodišnjim praćenjem.
- Prihvaćeni Webflow IT profil ima naslov rada kao link s `href="#"`; HR je imao naslov unutar običnog teksta. Nije pronađen zaseban PDF rada u projektnoj dokumentaciji.
- [Zapis izdavača Wiley](https://onlinelibrary.wiley.com/doi/10.1111/clr.320_13042) u indeksiranom prikazu navodi Anu Beljan među šest autora te naslov “A comparative evaluation of All-on-4® concept between different implant systems- 3-year follow-up prospective study”. Clinical Oral Implants Research, 2017, 28(S14), 321; kategorija ABSTRACTS / PR-024 e-poster.
- [Crossref zapis](https://api.crossref.org/works/10.1111/clr.320_13042), provjeren 11. rujna 2026., potvrđuje DOI, naslov i listopad 2017. Crossref odgovor nije sadržavao autore; autorstvo je potvrđeno zapisom izdavača. Izravni automatizirani dohvat Wiley stranice vraća 403, dok je indeksirani izdavačev zapis dostupan. Ne tvrditi da je puni PDF preuzet ili da je rad samostalno autorstvo dr. Ane.
- Trajna poveznica: <https://doi.org/10.1111/clr.320_13042>. Ne objavljujemo tuđi PDF niti stvaramo kopiju članka.

`src/content/doctor-research.ts` mijenja samo IT prazno odredište i omata postojeći HR naslov linkom. Cijela vidljiva rečenica, naslov, biografija, kvalifikacije, pravni tekstovi i izvorni snapshotovi ostaju nepromijenjeni. Novi schema tip ili medicinske tvrdnje nisu dodani.

Izvorna rečenica spominje dentiumeu.com; neposredna kopija rada na tom portalu nije pronađena ciljanim pretraživanjem. Zato link vodi na provjereni DOI izdavača, ne na nagađanu adresu. Navod o portalu nije samostalno prepisan; za eventualnu uredničku promjenu biografije treba zasebna potvrda.

Provjere: check/lint/build prolaze; `tests/doctor-research.spec.ts` 2/2 u Chromiumu i 2/2 u WebKitu. Test potvrđuje isti odlomak iz Worda, točno jedan DOI link, bez horizontalnog overflowa na 320/390/820/1440px i Enter navigaciju. Vanjski odgovor u navigacijskom testu je presretnut, pa prolaz nije tvrdnja da Wiley dopušta svaki automatizirani pristup.
