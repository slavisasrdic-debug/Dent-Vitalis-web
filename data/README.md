# Strukturirani podaci

Ova mapa je jedini izvor za ponovljive poslovne i sadržajne podatke: kontakte, cijene, bankovne podatke, CTA tekstove, usluge, FAQ, liječnike, kliniku, prijevode i redirecte.

- `models.ts` definira zajedničke TypeScript modele, jezike i status prijevoda.
- `site.ts` sadrži samo potvrđene globalne podatke. `null` znači da vrijednost još nije potvrđena; placeholder se ne smije objaviti.
- `redirects.csv` je neutralni inventar redirecta. Ne pretvarati ga u hosting-specifična pravila dok produkcijski hosting nije potvrđen.

Svaki podatak mora imati provjerljiv izvor. Nepotpuni prijevod ne smije dobiti status `published`.
