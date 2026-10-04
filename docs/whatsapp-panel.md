# WhatsApp panel — 11. rujna 2026.

## Važeća dopuna — 4. listopada 2026.

Vlasnik je dostavio novih pet javnih Elfsight ID-jeva. Njihove stvarne
konfiguracije dohvaćene su jednom za ovaj audit i spremljene u mrežni cache
`.astro/audits/whatsapp-20261004/`, izvan Gita i builda. Izvorni ID, URL,
SHA-256 odgovora, jezik, ime, prilagođeni podnaslov, poruka i broj dokumentirani
su u `data/whatsapp-copy-20261004.json`. `scripts/extract-whatsapp-copy.mjs`
ponovno koristi cache; ne izvršava izvorni HTML ni SDK.

Svih pet jezika sada koristi zajednički adapter `src/content/whatsapp.ts`.
Tekstovi poruka i podnaslova preuzeti su točno, uključujući prijelome redaka.
Slovenski `sl` ide na `/si`; `en-gb` iz izvora odgovara postojećem `en`.
Broj ostaje potvrđeni `385911100523`. Inaktivne tvrdnje o brzini odgovora,
automatsko otvaranje, badgeovi, source trackeri i SDK nisu preuzeti.
Izvorni gumbi „Start Chat”/„Chat on WhatsApp” u nekim jezicima nisu prevedeni:
zadržani su već prihvaćeni lokalizirani gumbi našeg weba. HR/DE/SL source
avatar je generički; nije zamijenio ranije odobrenu stvarnu fotografiju Jelene.
Alt fotografije ostaje „Jelena”, ne novo zaglavlje „DENTVITALIS”.

Ova dopuna zamjenjuje stare WhatsApp tekstove ispod, ne mijenja dizajn,
kontakte klinike, forme, GTM ili CookieYes. Posjetitelj sam otvara panel i
sam bira WhatsApp poveznicu; nema slanja poruke ni mrežnog Elfsight učitavanja.
Browser plugin nije dostupan; provjera koristi postojeći Playwright.

Prihvat dopune: `astro check` — 267 datoteka, bez grešaka/upozorenja;
lint i ciljano formatiranje prolaze. Svih 14 WhatsApp Playwright testova
prolazi na pet naslovnica i IT/HR FAQ-u: 320/390/1440 px, točan tekst,
prevedeni gumb, broj, jedna instanca, otvaranje/zatvaranje, fokus/Escape,
bez JS-a i bez vanjskih chat zahtjeva. Vizualno pregledane snimke
`/tmp/dentvitalis-whatsapp-v5-it-1440.png` i
`/tmp/dentvitalis-whatsapp-v5-hr-390.png`; nema preklapanja mobilnog CTA-a.
14 ciljanih Node provjera source/SEO/ruta/sigurnog ZIP-a prolazi;
form preflight potvrđuje 141 zaštićenu formu i pet zahvalnih ruta.
Produkcijski build ima 142 HTML datoteke. Nije slana WhatsApp poruka ili
POST, niti je cPanel mijenjan. Ovo nije produkcijski runtime prihvat.

## Arhivirani prihvat iz rujna

Završne statičke provjere: `npm run check` (162 datoteke, bez grešaka/upozorenja), `npm run lint`, `npm run build` (56 stranica) uspješne. Ista WhatsApp matrica prošla je i 8/8 u WebKitu (`--browser=webkit`); konfiguracija nema imenovani WebKit projekt.

Korisnik je odobrio implementaciju na oba aktivna jezika, korištenje zajedničkog broja 385911100523 te naknadno izričito zatražio Jeleninu fotografiju i podatke. Drugi jezici nisu izmišljeni niti aktivirani.

Izvor: https://www.dentvitalis.com/ koristi Elfsight widget `97dc04b8-23e7-4eef-8c47-449554cf098f`. Njegova javna boot konfiguracija potvrđuje ime Jelena, telefon 385911100523, podnaslov „Chiedi a nostro staff” i poruku „Buongiorno! / Sono Jelena... / posso esserti d'aiuto?”. HR public Zendesk poruka je „Kako vam možemo pomoći?”; broj nije dobiven iz Zendeska. HR podnaslov je naziv Dentvitalis, bez izmišljene funkcije ili kvalifikacije.

Fotografija: https://files.elfsight.com/storage/b84ecf4b-9d3b-43e9-bc90-005569e31888/e6da8595-ad14-45b6-9acb-1b674934f918.jpeg

Originalni neizmijenjeni bajtovi u `source-assets/external-images/whatsapp/e6da8595-ad14-45b6-9acb-1b674934f918.jpg`, SHA256 `65c102f89c951edc9cf64e37d67c7ba76b2fdf219d53ed17eb6b79ea4098c6ae`. WebP `public/assets/images/jelena-chat.webp` nastaje Sharp resize(128,128).webp({quality:85}); SHA256 `6460daecd82778dc834d9b60d8a23b2579bd7be3d92e90faf44e6e3d738b8015`. Oba asseta u LFS-u. Ne učitava se vanjska fotografija niti third-party SDK u pregledniku.

`ContactWidgets` ostaje zajednički za sve stranice. Plavi header, okrugli portret 64px, bijeli panel, siva poruka i kontrastni zeleni gumb. Broj dolazi isključivo iz `data/site.ts`; jezični tekst iz `chatCopy`. Nema online točke, lažnog sata/odgovora, badgea niti automatskog otvaranja. Klik tek otvara WhatsApp; nije ugrađeni live chat. Bez JS-a postoji izravan link. Escape/close vraćaju fokus, vanjski klik zatvara. Niska visina koristi unutarnji scroll i čuva donji mobilni CTA.

QA: 8/8 Chromium testova nakon dodavanja portreta (home/FAQ IT/HR, 320–1440px, landscape, tipkovnica, no-JS, bez vanjskih chat zahtjeva). Prethodno 19/19 WhatsApp/pagespeed/sticky CTA testova. Vizualno pregledan HR 390×844 u Chromiumu i IT 1440×900 u WebKitu. Nije poslana testna poruka klinici.
