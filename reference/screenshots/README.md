# Webflow screenshotovi

Screenshotovi su snimljeni headless Chromiumom preko Playwrighta, nakon učitavanja fontova i aktiviranja elemenata koji se otkrivaju pri scrollu. Naziv datoteke sadrži rutu, širinu viewporta i vrstu snimke.

- `viewport` snimke bilježe prvi viewport na 1440, 1200, 992, 991, 768,
  767, 480, 479 i 390 px.
- `full` snimke bilježe cijelu stranicu na reprezentativnih 1440 i 390 px.
- `nav-dropdown`, `mobile-menu` i `interaction` bilježe otvorena stanja.

Obuhvaćeni su home, usluga, specialisti, informativna detail stranica,
testimonijali, FAQ, galerija i kontakti. Strojno čitljiv par snimkama je
`reference/webflow-audit.json`; live URL inventar je
`reference/live-site-audit.json`.

Datum i izvor svake serije moraju biti zabilježeni u `docs/webflow-visual-spec.md` jer se Webflow preview može naknadno promijeniti.
