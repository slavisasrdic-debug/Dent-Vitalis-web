# WhatsApp panel — 11. rujna 2026.

Završne statičke provjere: `npm run check` (162 datoteke, bez grešaka/upozorenja), `npm run lint`, `npm run build` (56 stranica) uspješne. Ista WhatsApp matrica prošla je i 8/8 u WebKitu (`--browser=webkit`); konfiguracija nema imenovani WebKit projekt.

Korisnik je odobrio implementaciju na oba aktivna jezika, korištenje zajedničkog broja 385911100523 te naknadno izričito zatražio Jeleninu fotografiju i podatke. Drugi jezici nisu izmišljeni niti aktivirani.

Izvor: https://www.dentvitalis.com/ koristi Elfsight widget `97dc04b8-23e7-4eef-8c47-449554cf098f`. Njegova javna boot konfiguracija potvrđuje ime Jelena, telefon 385911100523, podnaslov „Chiedi a nostro staff” i poruku „Buongiorno! / Sono Jelena... / posso esserti d'aiuto?”. HR public Zendesk poruka je „Kako vam možemo pomoći?”; broj nije dobiven iz Zendeska. HR podnaslov je naziv Dentvitalis, bez izmišljene funkcije ili kvalifikacije.

Fotografija: https://files.elfsight.com/storage/b84ecf4b-9d3b-43e9-bc90-005569e31888/e6da8595-ad14-45b6-9acb-1b674934f918.jpeg

Originalni neizmijenjeni bajtovi u `source-assets/external-images/whatsapp/e6da8595-ad14-45b6-9acb-1b674934f918.jpg`, SHA256 `65c102f89c951edc9cf64e37d67c7ba76b2fdf219d53ed17eb6b79ea4098c6ae`. WebP `public/assets/images/jelena-chat.webp` nastaje Sharp resize(128,128).webp({quality:85}); SHA256 `6460daecd82778dc834d9b60d8a23b2579bd7be3d92e90faf44e6e3d738b8015`. Oba asseta u LFS-u. Ne učitava se vanjska fotografija niti third-party SDK u pregledniku.

`ContactWidgets` ostaje zajednički za sve stranice. Plavi header, okrugli portret 64px, bijeli panel, siva poruka i kontrastni zeleni gumb. Broj dolazi isključivo iz `data/site.ts`; jezični tekst iz `chatCopy`. Nema online točke, lažnog sata/odgovora, badgea niti automatskog otvaranja. Klik tek otvara WhatsApp; nije ugrađeni live chat. Bez JS-a postoji izravan link. Escape/close vraćaju fokus, vanjski klik zatvara. Niska visina koristi unutarnji scroll i čuva donji mobilni CTA.

QA: 8/8 Chromium testova nakon dodavanja portreta (home/FAQ IT/HR, 320–1440px, landscape, tipkovnica, no-JS, bez vanjskih chat zahtjeva). Prethodno 19/19 WhatsApp/pagespeed/sticky CTA testova. Vizualno pregledan HR 390×844 u Chromiumu i IT 1440×900 u WebKitu. Nije poslana testna poruka klinici.
