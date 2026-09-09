# Favicon — javni DentVitalis

Korisnički odobren izvor, preuzet 9. rujna 2026.:

- Stranica: <https://www.dentvitalis.com/hr>
- Njezin `rel="shortcut icon"`: <https://www.dentvitalis.com/images/favicon.ico>
- Lokalna bajtno identična kopija: `public/assets/images/favicon.ico` (Git LFS).
- SHA-256: `47de59c5d0ac6e97ec3c58885f38f2334ccc04f16497c00b860aa04ffdc251db`.
- Format: ICO, jedna slika 16 × 16 px, 32 bita po pikselu.

`Favicon.astro` povezuje lokalnu kopiju u `SiteLayout` za sve jezike i u
zasebnoj 404 stranici. Nema vanjskog zahtjeva prema starom hostingu, JavaScripta,
uvećavanja ni promjene izvornog crteža. Webflow `favicon.ico` ima drukčije
bajtove i nije korišten; nepromjenjivi export ostaje netaknut.

Ovo je kartična ikona, ne izvor visoke rezolucije za Apple touch/PWA ikone.
Regresija: `tests/favicon.spec.ts` provjerava hash, HTTP odgovor, head oznaku,
dekodiranje u pregledniku, navigaciju i refresh.
