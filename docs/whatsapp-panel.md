# WhatsApp panel — 11. rujna 2026.

## Aktualna dopuna nakon aktivacije v8 — 4. listopada 2026.

Vlasnik traži DentVitalis znak kao na faviconu umjesto Jelenine fotografije
u WhatsApp panelu svih pet jezika. `BrandLogo` varijanta `mark` koristi točno
zeleni V i gornji trokut izvornog SVG logotipa, bez izmjene izvornog asseta.
To izbjegava mutno povećanje ICO-a koji sadrži samo 16 × 16 px. Znak je
ugrađen u HTML, ima oznaku `DentVitalis` i bijeli kružni okvir od 64px.
Jezični tekstovi i Jelenin potpis u poruci, broj, layout i interakcije
ostaju nepromijenjeni. Izvorna fotografija ostaje sačuvana; nije obrisana.

Produkcijska read-only browser provjera utvrdila je zaseban Zendesk launcher
u iframeu `launcher` s natpisom `Pošljite sporočilo`, uz učitane
`static.zdassets.com/web_widget/classic/` skripte i
`dentvitalis.zendesk.com/embeddable/config`. To nije naš native WhatsApp
gumb. Postojeći GTM `GTM-K3QGWS` sadrži Zopim/Zendesk kod; projekt ga
ne učitava izravno. Uklanjanje tog vanjskog widgeta zahtijeva zasebnu
odluku/izmjenu GTM-a, ne gašenje GTM-a ili CookieYesa. Nije mijenjan GTM.

Neovisni javni GET-ovi nakon prijavljene aktivacije potvrđuju HTTP 200 za
robots, sitemap/index te oba token endpointa; JSON ima neprazna oba tokena,
`private, no-store, max-age=0`, a GCT i ponovljeni JSON podudaraju se u
istoj sesiji. Vrijednosti tokena nisu zapisane. Nisu slani POST-ovi ni poruke.
To ne predstavlja potpuni prihvat ponašanja privola.

Provjera izmjene: `astro check` 275 datoteka, bez grešaka/upozorenja;
ciljani lint i format prolaze. Završnih 17 Playwright provjera (WhatsApp
i favicon) prolazi bez istodobnog checka/builda: pet naslovnica i IT/HR FAQ,
320/390/1440 px, otvaranje/Escape/fokus, no-JS, izvorni tekstovi/broj i
nepromijenjeni favicon. Vizualno pregledani IT desktop i HR mobile paneli.
Produkcijski build ima 142 HTML datoteke. Usporedba s verificiranim v8 svih
142 HTML-a potvrđuje da se izvan znaka mijenjaju samo generirani ID-jevi i
CSS scope/hash oznake, ne sadržaj, SEO, forme ili linkovi.
`scripts/package-whatsapp-brand-update.mjs` pakira samo 141 promijenjeni HTML,
jedan novi CSS i ažurirani puni manifest. Konfiguracija i XML ostaju v8;
paket nije puni release i ne sadrži backend. Nije instaliran na produkciju.

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

Gotovi v5 ZIP prošao je još 10 zasebnih Chromium tokova (pet jezika ×
390/1440 px) poslužen iz same arhive na privatnom lokalnom HTTP portu:
HTTP 200, pravi sadržaj/jezik, jedna instanca, točna poruka i broj,
otvaranje/Escape, bez JS runtime grešaka, lokalnih HTTP grešaka ili
vanjskih chat zahtjeva. Prvi pomoćni server nije dekodirao `%20` u tri
postojeća asset naziva; ispravljen je samo testni harness, ne projekt/ZIP,
zatim je cijeli prolaz uspješan. Vanjske tracking veze blokirane su radi
izbjegavanja sintetičkih produkcijskih događaja; consent se provjerava na
produkciji odvojeno. Receipt čuva nalaze i SHA gotove arhive. Source/HTML
usporedba svih 141 panela potvrđuje da izvan chata nema izmjene osim novih
generiranih ARIA ID-jeva; svih ostalih 550 payload datoteka bajtno je isto.

## Arhivirani prihvat iz rujna

Završne statičke provjere: `npm run check` (162 datoteke, bez grešaka/upozorenja), `npm run lint`, `npm run build` (56 stranica) uspješne. Ista WhatsApp matrica prošla je i 8/8 u WebKitu (`--browser=webkit`); konfiguracija nema imenovani WebKit projekt.

Korisnik je odobrio implementaciju na oba aktivna jezika, korištenje zajedničkog broja 385911100523 te naknadno izričito zatražio Jeleninu fotografiju i podatke. Drugi jezici nisu izmišljeni niti aktivirani.

Izvor: https://www.dentvitalis.com/ koristi Elfsight widget `97dc04b8-23e7-4eef-8c47-449554cf098f`. Njegova javna boot konfiguracija potvrđuje ime Jelena, telefon 385911100523, podnaslov „Chiedi a nostro staff” i poruku „Buongiorno! / Sono Jelena... / posso esserti d'aiuto?”. HR public Zendesk poruka je „Kako vam možemo pomoći?”; broj nije dobiven iz Zendeska. HR podnaslov je naziv Dentvitalis, bez izmišljene funkcije ili kvalifikacije.

Fotografija: https://files.elfsight.com/storage/b84ecf4b-9d3b-43e9-bc90-005569e31888/e6da8595-ad14-45b6-9acb-1b674934f918.jpeg

Originalni neizmijenjeni bajtovi u `source-assets/external-images/whatsapp/e6da8595-ad14-45b6-9acb-1b674934f918.jpg`, SHA256 `65c102f89c951edc9cf64e37d67c7ba76b2fdf219d53ed17eb6b79ea4098c6ae`. WebP `public/assets/images/jelena-chat.webp` nastaje Sharp resize(128,128).webp({quality:85}); SHA256 `6460daecd82778dc834d9b60d8a23b2579bd7be3d92e90faf44e6e3d738b8015`. Oba asseta u LFS-u. Ne učitava se vanjska fotografija niti third-party SDK u pregledniku.

`ContactWidgets` ostaje zajednički za sve stranice. Plavi header, okrugli portret 64px, bijeli panel, siva poruka i kontrastni zeleni gumb. Broj dolazi isključivo iz `data/site.ts`; jezični tekst iz `chatCopy`. Nema online točke, lažnog sata/odgovora, badgea niti automatskog otvaranja. Klik tek otvara WhatsApp; nije ugrađeni live chat. Bez JS-a postoji izravan link. Escape/close vraćaju fokus, vanjski klik zatvara. Niska visina koristi unutarnji scroll i čuva donji mobilni CTA.

QA: 8/8 Chromium testova nakon dodavanja portreta (home/FAQ IT/HR, 320–1440px, landscape, tipkovnica, no-JS, bez vanjskih chat zahtjeva). Prethodno 19/19 WhatsApp/pagespeed/sticky CTA testova. Vizualno pregledan HR 390×844 u Chromiumu i IT 1440×900 u WebKitu. Nije poslana testna poruka klinici.
