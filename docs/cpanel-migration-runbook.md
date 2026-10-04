# cPanel release runbook

## Važeća procedura — ažurirano 4. listopada 2026.

Ovo je jedina operativna procedura. Dokazi i statusi čuvaju se u
[data/migration-readiness.json](../data/migration-readiness.json), posebno
`procedure`. Prijašnji prijedlozi u Git povijesti nisu nalog za ponavljanje.
GitHub je izvor koda; produkcija ostaje na postojećem cPanelu, bez promjene DNS-a.
Cloudflare služi samo razvojnom pregledu.

**Aktualno — vlasnik dopušta kratki prekid za in-place zamjenu sadržaja:**
J0 je sada ispunjen: vlasnik javlja TXT stvoren s točnih 27 B i 0644, ali
Chrome blokira GET. Neovisni Codespaces GET u 20:31:03.815 UTC / 22:31:03 CEST
vraća 200, LiteSpeed, text/plain, 27 B i točan DV-STATIC-CHECK-20261004-A1.
To nije browser policy bypass nego odvojeni obični javni HTTPS GET bez tajni.
Ne ponavljati taj preflight; agent smije nastaviti J1–J7 prema uvjetnom nalogu.
Stari root radi prema vlasnikovu izvještaju; v8 in-place još nije izveden.
Uzrok ranijeg 404 i v8 runtime prihvat ostaju neprovjereni.

predlaže zamjenu/upload sadržaja umjesto renamea i kaže da nekoliko minuta
nedostupnosti nije problem. Pripremljena je jedna alternativna J0–J7 procedura
na vrhu agentove upute. Ona ima prednost nad starim I3 STOP-om samo ako neutralni
novi TXT GET prođe. To nije ponavljanje trećeg istog roota swapa ni dokaz uzroka.

Sam izvorni `/home2/dentvita/public_html/` ostaje: naziv, owner/group/ACL i
0750 ne mijenjaju se. Prije prekida provjeriti postojeći potpuni v8 u
`public_html-failed-20261004-galleria-v8-retry-01/` te napraviti dvije nove prazne
0700 mape u backups: `public-contents-before-inplace-v8-20261004/` i
`public-contents-failed-inplace-v8-20261004/`. Bez sukoba ili prepisivanja.
Sve stare stavke (uključujući skrivene i blog) Move u before; samo ako je
izvorni root prazan, sve nove v8 stavke Move u isti originalni root. Move ne
traži novu punu kopiju u maloj kvoti. Candidate folder potom više nije potpuna
druga kopija; ZIP i postojeći backupovi ostaju. Nema novog uploada ili brisanja.

Odmah direct /index.html s novim queryjem, cache-busted / i goli /: zahtijevati
novi sadržaj i 200. Potom B.9 runtime/SEO/GET token/consent prihvat, bez ponovnih
POST-ova. Kod greške Move novog javnog sadržaja u prazni failed backup, stari
sadržaj Move iz before u isti public_html. Kod djelomičnog Movea čuvati obje
polovice i vratiti samo na prazna mjesta, ne prepisivati. Ni application/data,
baza/CRM, DNS/PHP ni root chmod ne diraju se. Izvještaj mora razlikovati lokalnu
uputu od stvarno izvedene operacije i hosting prihvata. Ovo još nije izvedeno.

**Aktualni nastavak — neutralni statički preflight u izvornom rootu:** nakon
drugog neuspjeha vlasnik traži da pronađemo rješenje. Ne ponavljamo root swap.
Neovisni javni GET potvrđuje da postojeći root poslužuje Googleovu HTML
verifikaciju (200, 53 B) i Bing XML (200, 85 B) kao stvarne statičke datoteke.
To ne dokazuje čitanje NOVIH datoteka pa agentova uputa sada počinje I1–I3:
stvoriti jednu novu nepostojeću neutralnu `dv-static-check-20261004-a1.txt`
0644 s tekstom `DV-STATIC-CHECK-20261004-A1`, GET potvrditi 200/točan sadržaj i
očuvanu staru naslovnicu, zatim izvijestiti prije aktivacije. Jedino je taj
bezopasni dijagnostički zapis dopušten; nema novih root renamea, PHP probea,
chmoda, izmjene htaccessa ili cachea. Test ne sadrži privatne podatke.

Ako nova datoteka radi, alternativa je precizna in-place zamjena samo sadržaja
public_html uz očuvanje SAMOG izvornog korijena i owner/group/ACL/konteksta.
Stari sadržaj recoverable Move u novi privatni 0700 backup, v8 sadržaj Move na
prazna mjesta, kodni rollback sadržaja u ISTU mapu. Nema nove cijele kopije,
prepisivanja, vraćanja application/data ili korijenskog chmoda. To je prijedlog
ovisno o rezultatu preflighta, NE izvršena/provjerena metoda ili utvrđen uzrok.
Puni runtime prihvat i dokaz čitanja novog indexa ostaju obvezni. I1–I3 imaju
prednost nad ranijim potpunim read-only STOP-om samo za tu TXT datoteku; javna
v8 aktivacija ili treći isti root swap nisu odobreni ovom fazom.

**AKTUALNI STOP — odobreni retry potrošen, direktni index.html 404:** vlasnik
prenosi prvi GET `https://www.dentvitalis.com/index.html?dvcheck=20261004retry01`
HTTP 404, uz screenshot native LiteSpeed stranice. Odmah izveden rollback;
ostala dva GET-a i B.9 nisu izvršeni. Novi v8 sada je sačuvan u
`/home2/dentvita/public_html-failed-20261004-galleria-v8-retry-01/`, stari root
u `/home2/dentvita/public_html/` (0750 prema izvještaju). Neovisni GET u
20:09:44 UTC potvrđuje stari www root 200, stari naslov, bez listinga/Astroa.
Nisu prijavljene druge promjene ili POST-ovi. Vrijeme retry zahtjeva i njegovi
response headeri nisu dostavljeni; prikaz datoteka u samom aktivnom prozoru
nije zasebno potvrđen. Potrebni su samo postojeći rename/GET dokazi, ne novi swap.

Ovaj STOP i novi S1–S3 na vrhu agentove upute imaju prednost nad svim ranijim
R1–R5 i drugim aktivacijskim zapisima. Treći pokušaj nije odobren. Direktni
404 sužava dijagnozu: sam izbor DirectoryIndex ne objašnjava nedostupnost
izravnog /index.html. Ne dokazuje određeni uzrok ni da hosting nužno griješi;
stvarno mapiranje/pristup/rewrite/cache treba dokazati. Hostingu je pripremljen
dodatak za fizičku putanju tog GET-a i read-only usporedbu owner/group/ACL
korijena i dostupnosti datoteke za webserver proces. Ništa nije popravljeno
promjenom upute. Nema novog ZIP-a, chmoda ili spekulativnog purgea/restarta.

**Povijesno odobrenje — jedan kontrolirani pokušaj već je izveden:**
nakon read-only nalaza izričito traži "AJmo to dignuti". Uzrok prvog listinga
ostaje nedokazan; nema tvrdnje da je paket popravljen ili hosting potvrđen.
Odobrenje dopušta jedan instrumentirani pokušaj uz spreman kodni povratak,
ne nasumični chmod, prepisivanje konfiguracije, cache purge ili restart.
Ovaj odjeljak i R1–R5 na vrhu agentove upute imaju prednost nad povijesnim
STOP zapisom i ranijim B/N/H uputama ispod. Hosting audit ostaje preporuka,
ali vlasnik ovim nastavkom ne traži da ga čekamo prije jednog pokušaja.

Koristi već verificirani saved v8 root, ne novu kopiju ili djelomični stage.
Stari public_html sačuvati u slobodni public_html-before-20261004-galleria-v8-retry-01,
v8 saved root preimenovati u public_html. Javni GET-ovi tek poslije potvrđenog
uspjeha oba renamea: /index.html?dvcheck=20261004retry01, /?dvcheck=20261004retry01
i goli /. Provjeriti stvarni novi HTML i status, ne samo 200. Novi query nije
dokaz da je LiteSpeed cache zaobiđen. Ako ne radi, sačuvati minimalni dokaz bez
odgađanja i odmah rollback u failed-...-retry-01 pa before -> public_html.
Ne pokušavati treći put. Ako se pri drugom renameu neočekivano ponovno pojavi
public_html, ne brisati/prepisivati; sačuvati ga recoverable pod prethodno
slobodnim unexpected-...-retry-01 nazivom samo uz potvrđen identitet oba
poznata roota, zatim vratiti stari. Sve je ograničeno na te javne direktorije.

Ako tri početne provjere prođu, ostaje cijeli B.9 runtime prihvat pet jezika,
resursa, SEO/routinga, GET tokena i consenta. Nema novih stvarnih POST-ova ni
promjena backenda/DNS/PHP-a. Ovaj Codespaces rad ažurira uputu i odobrenje,
ne izvodi cPanel preimenovanja. Produkcija nije proglašena aktiviranom.

**Povijesni STOP i završeni nalazi — aktualni R1–R5 iznad imaju prednost:**

**STOP — pokušaj v8 aktivacije vraćen zbog "Index of /":** vlasnik prenosi
odmah izveden kodni povratak. Stari root je `/home2/dentvita/public_html/`
(0750); v8 sačuvan u `/home2/dentvita/public_html-failed-20261004-galleria-v8/`.
Stara naslovnica i `/hr/desinfekcija` ponovno rade prema agentu. Token GET
blokiran je u njegovu browseru; ostale v8 runtime provjere nisu izvršene.
Backend, DNS/PHP, privatni podaci i stvarne forme nisu mijenjani prema izvještaju.
Uzrok i HTTP status neuspjelog zahtjeva nisu potvrđeni.

**D1–D5 pregled završen prema vlasnikovu novom izvještaju:** sačuvani failed
root ima index.html/index.php/.htaccess neposredno u korijenu; početni HTML
sadrži novi web, a hash teksta .htaccessa iz Viewa odgovara manifestu. To nije
neovisni hash sirovih serverskih bajtova. Potvrđene su Options -Indexes i
DirectoryIndex index.html index.php; Domains pokazuje /home2/dentvita/public_html.
Listing je prijavljen na https://www.dentvitalis.com/ oko 4.10.2026. 21:46 CEST;
snimka vraćene naslovnice je iz 21:46:39. Snimka samog listinga i odnos trenutka
zahtjeva prema drugom preimenovanju nisu potvrđeni. Roditeljski .htaccess ima
samo kompresiju; dostupni Errors nisu objasnili incident, zona loga i owner/group
nisu dostupni. Ne ponavljati ovaj završeni File Manager pregled.

Neovisni javni GET u 19:59:40 UTC potvrđuje vraćeni stari www root (200, stari
naslov, bez listinga/Astro resursa). Odgovor ima Server: LiteSpeed; verzija i
topologija nisu potvrđeni. /index.html na VRAĆENOM STAROM rootu vraća 404 — to
ne govori o v8 failed rootu. Apex HTTPS daje staru 301 na HTTP www. Ništa nije
mijenjano i nisu slani POST-ovi ili zapisani cookie/token sadržaji.

Sljedeći korak nije novi ZIP ili slijepa aktivacija: vlasniku je pripremljen
read-only upit hostingu za stvarni HTTPS/www vhost, primjenu .htaccessa,
DirectoryIndex/Options/AllowOverride, cache/config metadata nakon renamea te
owner/group. Lokalni Apache test nije LiteSpeed runtime potvrda. Hosting nije
kontaktiran i promjena/restart/global purge nisu odobreni. Agent može iz
postojećih zapisa samo pojasniti je li listing zatražen poslije oba renamea;
ne reproducirati ga aktivacijom. Dok to ne donese dokaz, STOP ostaje na snazi.

Ovaj STOP ima prednost nad starim aktivacijskim uputama. Dokument agenta sada
počinje D1–D5: ciljano read-only pregledati sačuvani failed root, placement/
sadržaj index.html i .htaccess, stvarni Document Root, točan host zahtjeva,
roditeljske direktive i relevantne sanitizirane logove. Bez novog preimenovanja,
chmoda, uklanjanja pravila, PHP probe/deploy endpointa ili novih POST-ova.
Ne tražiti novi ZIP bez dokaza da je payload neispravan.

Nepromijenjeni lokalni v8 ZIP potvrđen je SHA-256-om. Pojačani Apache test sada
provjerava sadržaj korijena (ne samo 200), izravni `/index.html` i zabranu
listanja praznog direktorija; svih devet testova prolazi. `.htaccess` ima
Options -Indexes i DirectoryIndex index.html index.php. To upućuje na razliku
u hostingu/placementu/primjeni/cacheu, ali nijedan uzrok nije utvrđen lokalnim
fixtureom. Zapis: readiness `procedure.galleriaV8.activationAttemptAndRollback`.

**NAJNOVIJE — next root je v8 prema agentu; vlasnik odobrava nedostupnost bloga:**
preneseni izvještaj navodi završen Move, v8 revision/galleria.html, očuvani
bootstrap/resurse, bez starog dokumenta/nested _pages; 1.034 datoteke 0644,
24 podmape 0755, korijen 0750. Starih osam stavki je u privatnom
`displaced-originals/` (0700), izvorni ZIP ostaje. Ovo nije neovisna provjera
serverskih hashova. Produkcija ostaje stara prema izvještaju.

Agent je stao nakon otkrića da `blog.dentvitalis.com` koristi
`/home2/dentvita/public_html/blog`, koji next root nema. Vlasnik izričito kaže
"gasiimo i podomenu - ne treba nam": javna nedostupnost bloga namjerna je,
blog ne kopirati u novi root, a njegove datoteke/baza/backupovi ne brišu se.
Ovom nastavku nisu potrebne DNS promjene, cPanel domain deletion ili nove
sadržajne blog 301. Uputa sada kreće B.7–B.10; privatni Move/upload/backup ne
ponavljati. Odgovor blog hosta evidentirati poslije aktivacije, ne pretpostaviti
404/410 ili završen DNS removal. Ostale release gates/rollback ostaju obvezne.
Odobrenje nije dokaz izvršene objave ili runtime prihvata. Zapis je readiness
`procedure.galleriaV8.fileManagerContinuation.blogRetirementApproval`.

**NAJNOVIJE — v8 je uploadan prema cPanel agentu; nastavak bez overwritea:**
vlasnik prenosi 692 datoteke/13 podmapa, 0644/0755, revision v8 i postojeću
privatnu kodnu kopiju 147 datoteka (0700). Slobodna kvota prijavljena je kao
78,67 MB; serverski SHA/točni bajtovi nisu potvrđeni. Copy je otkazan kod A.4;
next root ostao je v3, aktivni web netaknut. Vlasnik traži nastavak do online.

Uputa sada počinje N1–N6, koji imaju prednost nad starim A.1–A.5. Ne ponavljati
upload/Extract/backup ni zahtijevati 160 MB za već dovršeni upload. Premjestiti
osam starih stavki samo iz privatnog next roota u NOVI prazni poddirektorij
postojećeg backupa `displaced-originals/`; potom istih osam v8 stavki iz stagea
premjestiti na prazna mjesta next roota. Nema prepisivanja ni nove velike kopije.
Izvorni ZIP ostaje, a stage nakon Move nije potpuna ekstrakcija; to zabilježiti.
Ovo je uputa, ne izvedena operacija ovog Codespaces agenta. Obvezne provjere
pripremljenog roota i B.7–B.10 aktivacija/runtime/kodni rollback ostaju.
Aktualni izvještaj: readiness `procedure.galleriaV8.fileManagerContinuation`.

**AKTUALNO — galleria-v8, ima prednost nad povijesnim zapisima ispod:** vlasnik
je potvrdio SEO masterov zadnji pregledni prijedlog te odobrio talijanski
`/galleria`, usklađivanje svih potrošača i završnu migraciju nakon provjere.
Stari `/domande-e-risposte` dobiva točnu 301 na novi URL; osam dodatnih SEO
pravila više ne čeka potvrdu. Nema novih proizvoljnih medicinskih spajanja.
136 sitemap URL-ova/676 recipročnih jezičnih veza ostaje bez XML x-default.

Jedini aktualni puni paket je
`dentvitalis-web-production-candidate-20261004-galleria-v8.zip`.
57.925.698 B; SHA-256
`d92be1d1578e66b70aa4461fbce74ea43c6d3c85cbdec078345aa1a634d94f66`.
Završna neovisna provjera stvarnog ZIP-a prošla je: CRC, svih 691 payload
hashova, 692 datoteke/13 mapa i 0644/0755. 653 payload datoteke bajtno su
nepromijenjene prema v7; svih 142 HTML dokumenata mijenja samo odobreni URL.
Točni bajtovi, SHA-256, izvorni commit i promjene prema nepromjenjivom v7:
`data/seo/cpanel-galleria-v8-release-20261004.json`.
Uputa za cPanel agenta: `docs/seo/CPANEL-UPLOAD-GALLERIA-V8-20261004.txt`.
SEO handoff: `docs/seo/handoff-galleria-v8-20261004/`, u zasebnom malom ZIP-u.
Stari paketi/handoffovi ostaju povijesni, ne šalju se za novu objavu.

Lokalno je prošlo: check/build, form contract, sva tri page-routing testa,
devet Apache testova stvarnog završnog htaccessa i 40 browser testova.
Potpuni preview audit: 141 stranica, 11.961 link, 501 cilj, 160 resursa, bez
nalaza; desktop/mobile galerija i stvarni klikovi pregledani. To nije cPanel
runtime. V8 zadržava assete/form/WhatsApp bajtove iz v7; svi HTML-ovi smiju
promijeniti samo odobreni URL i ime galerijskog dokumenta. Arhivu neovisno
provjerava `scripts/verify-galleria-v8-release.py` poslije pakiranja.

Nema lokalnog pristupa cPanelu; upload/aktivacija nisu izvedeni ovim radom.
Privatni cilj: `/home2/dentvita/releases/20261004-galleria-v8/`.
Postojeći v3 next root ažurirati tek uz privatnu kopiju `_pages` i svih sedam
root datoteka u uputi; obvezno uključiti `page-routes.json` i `_redirects`.
Zastarjeli `_pages/domande-e-risposte.html` premjestiti samo iz privatnog next
roota u backup. Ne kopirati ZIP, blog ili backend. Kontrolirana zamjena i
kodni povratak opisani su u uputi; stvarni runtime/consent ostaje release gate.
Ne ponavljati pet prihvaćenih POST-ova niti vraćati novije privatne podatke.

**Trenutačni puni upload kandidat — ready-v7, čeka SEO potvrdu:**
`dentvitalis-web-production-candidate-20261004-ready-v7.zip`, 57.922.519 B;
SHA-256 `5d8e37c1af782ecf417ec2633422edd0803cc8aa57d6c9dff2dcd5a9fe250669`.
To je v6 s identičnim preglednim .htaccessom iz zadnjeg SEO handoffa i novim
manifestom; ostalih 690 payload datoteka, zadnji XML i WhatsApp ostaju isti.
692 datoteke/13 mapa; CRC, svih 691 hashova, 0644/0755 i nepromijenjenost
svih 142 HTML dokumenata uključujući 404 neovisno potvrđeni.
SEO potvrda i odobrenje javne aktivacije još nisu dobiveni. Ovaj zahtjev
odobrio je samo lokalnu pripremu. Receipt: `data/seo/cpanel-ready-v7-release-20261004.json`;
uputa: `docs/seo/CPANEL-UPLOAD-READY-V7-20261004.txt`. Privatni upload cilj
nakon SEO potvrde: `/home2/dentvita/releases/20261004-ready-v7/`.
Ne ponavljati cijelu v3 next-root pripremu; poslije zasebnog odobrenja sačuvati
pa ažurirati _pages i pet root datoteka navedenih u uputi, ne samo SEO datoteke.
Prije uploada provjeriti kvotu, bez automatskog brisanja. Ako SEO mijenja
htaccess ili IT galerija URL, potrebna je nova revizija. V6 i stariji ZIP-ovi
ostaju nepromijenjeni, ali nisu najnoviji upload kandidat.

**Čišćenje izvještaja na zahtjev vlasnika, 4. listopada:** u `.astro/reports/`
ostaje samo aktualni DentVitalis handoff `DentVitalis-htaccess-sitemap-20261004.zip`.
Tri stara SEO ZIP-a, dva stara Excela, v3 htaccess TXT i mapa
`htaccess-localized-v3` premješteni su, bez promjene bajtova, u
`.astro/archive/seo-handoff-20261004-before-cleanup/`; mogu se vratiti.
Osam hashova arhiviranih datoteka i hash aktualnog ZIP-a potvrđeni su.
Arhivirani ZIP putovi niže povijesni su zapisi, ne paketi za novo slanje.
Verzionirani izvori u `docs/seo/`, web releaseovi, backupovi i cPanel nisu dirani.

**Novi pregled čitljivosti .htaccessa, 4. listopada:** kandidat je u
`docs/seo/handoff-readable-20261004/`, uz zapis ciljane Apache provjere.
Čuva prethodna odredišta, uklanja sedam istih duplikata i ne usvaja
114 novih sadržajnih mapiranja ili 34 retargetiranja iz novog priloga.
Svih 11 lokalnih testova prolazi; cPanel/PHP runtime nije ponovno testiran.
To NIJE novi upload paket: v6 ZIP, pripremljeni next root i produkcija
ostaju neizmijenjeni. Ne zamjenjivati htaccess bez nove revizije manifesta
i potvrde preostalih sadržajnih odluka (uključujući osam review 301).

**Važeći XML kandidat — sitemap v6:** vlasnik je zatražio uklanjanje svih
`x-default` zapisa samo iz XML sitemapa. Uklonjeno je 136 zapisa; ostaje
136 URL-ova i 676 stvarnih jezičnih veza. Generator provodi istu odluku.
HTML hreflang, WhatsApp v5, URL-ovi, .htaccess, forme i asseti nisu mijenjani.
Predloženi IT `/galleria` još nije odobren; `/domande-e-risposte` ostaje,
a javna aktivacija nije odobrena. V5 i stariji ZIP-ovi su povijesni.

Novi puni ZIP: `dentvitalis-web-production-candidate-20261004-sitemap-v6.zip`,
57.922.189 B; SHA-256
`b36f33047593dd55e76b4e85a1d77cea1dce826c77d20d79f9acfb29079f1462`.
692 datoteke/13 mapa, 65.619.369 B raspakirano; CRC, svih 691 hashova i sve
dozvole 0644/0755 neovisno potvrđeni. Samo dva XML payload dokumenta i
manifest razlikuju se od v5; ostalih 689 datoteka bajtno je isto.
Upute: `docs/seo/CPANEL-UPLOAD-SITEMAP-V6-20261004.txt`;
receipt: `data/seo/cpanel-sitemap-v6-release-20261004.json`.
Stage `/home2/dentvita/releases/20261004-sitemap-v6/`, samo privatna priprema.
Za postojeći v3 next root i dalje treba `_pages` + pet root datoteka,
uz prethodni privatni backup i zasebno odobrenje; ne samo XML zamjena.
SEO kolegi: `.astro/reports/DentVitalis-SEO-bez-x-default-20261004.zip`,
isti četvero-dokumentni format, novi XML i usklađeni Excel; stari sitemap
ostaje original. Pet ciljanih XML/HTML/postbuild provjera prolazi.

**Arhivirani upload — WhatsApp v5 prije XML dopune:**
`dentvitalis-web-production-candidate-20261004-whatsapp-v5.zip` sadrži
točne nove WhatsApp poruke svih pet vlasnikovih javnih widget izvora,
prihvaćeni nativni panel i cjelokupni ispravljeni SEO v4 payload.
ZIP 57.922.603 B, SHA-256
`314d95593b9ef6515317af67b662a132f2ed49c6ace4370299f31df212c3df93`;
692 datoteke / 13 mapa, 65.644.083 B raspakirano. CRC, svih 691 payload
hashova i sve ZIP dozvole potvrđeni neovisnim pregledom stvarne arhive.
141 HTML panel provjeren prema source tekstu. HTML izvan panela identičan
v4 nakon normalizacije samo generiranih ARIA ID-jeva; svih ostalih 550
payload datoteka bajtno isto, uključujući kompletne assete i SEO konfiguraciju.
Sitemap zadržava 136 URL-ova i 812 provjerenih hreflang veza, svih pet jezika.
Gumbi ostaju već lokalizirani, broj i stvarna fotografija Jelene ne mijenjaju se.
Elfsight SDK, generičke fotografije i source trackeri nisu uvezeni.
Svih 14 preview browser testova i 10 zasebnih tokova stvarnog ZIP-a prolazi;
desktop/mobile snimke pregledane. Privatni ZIP server ne provjerava Apache
ili produkcijski consent, a tracking mreža namjerno je blokirana tijekom
lokalnog testa. Nema novih stvarnih POST-ova ili chat poruka.

Važeće upute: `docs/seo/CPANEL-UPLOAD-WHATSAPP-V5-20261004.txt`;
receipt: `data/seo/cpanel-whatsapp-v5-release-20261004.json`.
Privatni stage: `/home2/dentvita/releases/20261004-whatsapp-v5/`.
V3 i seo-v4 ostaju očuvani kao povijesne verzije, ali nisu novi upload.
Nakon zasebnog odobrenja ažurira se postojeći privatni v3 next root:
sačuvati pa zamijeniti `_pages/` i pet datoteka `index.html`, `.htaccess`,
`sitemap.xml`, `sitemap-0.xml`, `release-manifest.json`. Stari plan četiri
SEO datoteke nije dovoljan. Ne ponavljati kopiranje cijelog roota ili asseta.
Privatna priprema i lokalna provjera nisu produkcijska aktivacija;
backend, postojeći podaci i ranije prihvaćeni stvarni upiti ostaju netaknuti.

**Arhivirani korak — SEO v4 prije nove WhatsApp dopune:**
priprema se `dentvitalis-web-production-candidate-20261004-seo-v4.zip` iz
verificiranog nepromjenjivog localized-v3 ZIP-a, bez rebuilda prihvaćenih
stranica/slika/JS/CSS i bez ponavljanja stvarnih form testova. Zamjenjuju se
samo `.htaccess`, `sitemap.xml`, `sitemap-0.xml` i regenerirani manifest.
Oba sitemap urlseta sadrže svih 136 URL-ova i stvarni HTML hreflang.
Provenance razdvaja sadržajni commit v3, SEO reviziju i commit pakiranja.
Dokaz nakon pakiranja: `data/seo/cpanel-seo-v4-release-20261004.json`.
Pakiranje i nezavisna provjera stvarnog ZIP-a dovršeni: 57.920.124 B,
SHA-256 `938fc4142c6fa2ddc2af1eb7bd5992654fb7516af786e82e5cf312e8cd8ebd49`;
692 datoteke / 13 mapa, 65.633.294 B raspakirano. CRC, svih 691 payload
hashova i sve ZIP dozvole `0644/0755` potvrđeni. Točno četiri stavke razlikuju
se od nepromjenjivog v3; svi HTML/CSS/JS/asseti ostaju identični. `robots.txt`
ostaje nepromijenjen i upućuje na sitemap index koji sada ispravno vodi na
novi hreflang urlset; nije potrebno mijenjati robots ili indeksnu datoteku.
Četiri regresijska testa sigurnog ZIP pakiranja prolaze. Novi paket nije
uploadan ni aktiviran. Manifest razlikuje sadržajni commit `935e5bb7`,
SEO commit `bb08621` i pakiranje `fbeb3f6`.

Upload cilj je nova privatna mapa `/home2/dentvita/releases/20261004-seo-v4/`.
Upute: `docs/seo/CPANEL-UPLOAD-SEO-V4-20261004.txt`. Posljednja prijavljena
slobodna kvota 207,46 MB može pokriti približno 120 MB za ZIP i ekstrakciju;
prije uploada provjeriti aktualnu kvotu, ništa automatski brisati.
Ne ponavljati kopiranje 1.034 pripremljene next-root datoteke. Nakon zasebnog
odobrenja sačuvati i zamijeniti samo četiri gore navedene stavke u postojećem
privatnom v3 next rootu. `index.php`, legacy resursi i `application` ostaju.
Za upload pripremu nije odobreno javno preimenovanje/aktivacija; preostale
SEO/PHP/consent HTTP provjere i potvrda dodatnih 301 ostaju prije prihvata.
Ovaj novi zahtjev ne pretvara SEO pregled u odobrenje medicinskih spajanja.

**Najnoviji zahtjev — jednostavniji SEO handoff, 4. listopada:** vlasnik je
umjesto aktivacijskog odobrenja zatražio stari i novi sitemap te kraći
`.htaccess` po uzoru na dostavljeni stari. Datoteke su u
`docs/seo/handoff-simple-20261004/`. Stari XML dohvaćen je jednom javnim GET-om
sa stvarnog `www.dentvitalis.com/sitemap.xml` (200, 197 zapisa); SHA-256 je
isti kao prethodno sačuvani izvor, pa ne ponavljati kompletno dohvaćanje.
Novi ravni `sitemap-novi.xml` ima isti skup 136 indeksabilnih v3 URL-ova,
bez pet zahvalnih stranica koje ostaju dostupne s noindex. Ispravak nakon
vlasnikove primjedbe: XML sada ima 812 stvarnih HTML hreflang veza, uz
provjeru self/recipročnih parova za `it/hr/de/en/sl` i `x-default` na IT root.
IT prijevoz nema druge prijevode: samo IT i x-default. Popravljen je i
automatski postbuild generator; postojeći v3 build/ZIP nije ponovno izrađen.

Kraći `.htaccess` sada ima 8.008 B / 172 retka: 64 naslijeđene 301 pojave s
odobrenim korekcijama, osam ranije odobrenih novih 301 i osam dodatnih jasnih
premještanja pripremljenih na novi izričiti zahtjev vlasnika za SEO pregled.
Neutralna mapa dodatnih pravila: `data/seo/handoff-equivalent-redirects-20261004.json`.
Nije produkcijsko odobrenje; backend/cache/PHP ostaju očuvani.
140 internih pojedinačnih HTML rewritesa i dva golema popisa putanja zamijenjeni
su provjerom stvarne datoteke `_pages/<putanja>.html`, uz zaštitni slash 308.
Default v3 generator ostaje nepromijenjen; compact način izričito se odabire
za novi handoff. Izolirani Apache test svih 140 ruta, slash varijanti, queryja,
hosta, svih 16 novih 301, odobrenih 410, mock PHP endpointa i legacy direktorija
prolazi. XML/HTML hreflang i potpunost usporedbe također prolaze; postbuild
hook potvrđen je na izoliranoj kopiji, bez ponovnog builda prihvaćenog v3.
Prvi lokalni startup prijavio je ECONNRESET uz Syntax OK i aktivne procese;
sljedeći potpuni test prošao je. To nije cPanel runtime ni stvarno slanje.

Usporedba svih 197 starih sitemap zapisa: 46 ostaje na istoj indeksabilnoj
adresi, osam ima postojeću/odobrenu 301, osam dodatnu jasno ekvivalentnu 301
u review kandidatu, tri su izričito sačuvane PHP stranice, pet zahvalnih
stranica ostaje noindex, a 127 nema potvrđen novi statički ekvivalent/odobrenu 301. Sada svaki red ima konkretnu sadržajnu napomenu i mogući cilj kada je
utvrđen, ne samo generičku oznaku. Od tih 127, raniji inventar 9. rujna
bilježi 106 HTTP 200 i 21 već postojeći HTTP 404; to nije nova runtime provjera.
Za njih PHP fallback može ostati aktivan, ali stvarno
posluživanje nije provjereno. Ne zaključivati da su svi uklonjeni niti dodati
neodobrene 301 na nepovezane usluge ili naslovnicu. CSV označava te stavke za
SEO/vlasnički pregled; usporedba sitemapa ne zatvara sadržajne odluke.
Excel ima sažetak, 197 starih i 136 novih URL-ova te 80 redirect pojava.
Ispravljeni ZIP `.astro/reports/DentVitalis-SEO-ispravljeno-20261004.zip`
sadrži točno četiri dokumenta: oba XML-a, `.htaccess` i Excel. CRC i identitet
bajtova provjereni. Raniji `DentVitalis-SEO-4-dokumenta-20261004.zip` povučen
je iz upotrebe zbog izostavljenog XML hreflanga i nepotpune usporedbe.
Reprodukcija Excela/ZIP-a: `scripts/package-seo-review.py`, openpyxl 3.1.5.

Ovi su lokalni review dokumenti, ne izmjena uploadanog v3 paketa ili pripremljenog
next roota. Ne prepisivati `.htaccess` na serveru niti aktivirati v3 kao da već
sadrži reviziju. Nakon pregleda zasebno pripremiti odobrenu zamjenu i manifest;
preostali runtime/rollback/consent prihvat ostaje obvezan. Nema novih POST-ova,
DNS, backend ili produkcijskih promjena. Zapis: readiness `procedure.simpleSeoHandoff`.

**STOP — jezični URL/link audit, 4. listopada:** vlasnik je otkrio engleske
slugove na DE/SI stranicama. Izvor je fallback iz internog engleskog page ID-a,
ne njemački/slovenski sadržaj. Uploadani `20261004-redirects-v2` ne aktivirati.
Potrebni su provjera svih pet jezika i novi sadržajni build/paket, ne samo
revizija `.htaccess`. Stari ZIP/stage ostaju netaknuti. Vlasnik je zatražio
usklađivanje svih linkova i pojasnio da neobjavljene engleske adrese ne trebaju
301; zadržao je zaštitni 308 za stare slash varijante. Lokalizirane putanje
vodi `data/seo/localized-route-decisions-20261004.json`, a potpuni ponovljivi
GET/DOM audit `tests/site-integrity.spec.ts`. Objavljene stare adrese imaju
zaseban status i ne smiju se zamijeniti s neobjavljenim nacrtom. Nema nove
ovlasti za POST, prepisivanje produkcije ili vraćanje privatnih podataka.

Potvrđeno usklađivanje: 23 DE + 23 SI sluga koriste izvorne lokalizirane
nazive ili ekvivalentne već objavljene lokalizirane putanje. Interni engleski
page ID ostaje ključ modela, ne javni URL. Dodatno je uklonjen zasebno upisan
SI kontakt-link iz podnožja. Vlasnik je zasebno odobrio dvije povijesne 301:
`/de/testimonials → /de/erfahrungen-unserer-patienten` i
`/si/testimonials → /si/izkusnje-pacientov`. GET starog javnog weba 4. listopada
dao je 200 odnosno 404; druga adresa zabilježena je u ranijem SEO inventaru.
Ne dodavati alias 301 za ostalih 44 neobjavljena engleska sluga.

**Lokalni prihvat završen:** 141 stranica / 11.961 pojava internih linkova,
501 različit cilj uključujući fragmente i 160 referenciranih lokalnih slika/
skripti, bez preostalih nalaza. Canonical, hreflang, jezični odabir, forme bez
POST-a i svih 136 sitemap URL-ova usklađeni su. Playwright provjerava stvarne
desktop/mobile klikove i obvezan telefon; lokalni Apache test koristi vlasnikov
stari `.htaccess` i mock dinamičke handlere, ne stvarni e-mail/CRM. Detaljan
prihvat i granice: `data/seo/native-url-audit-20261004.json`.

Novi **sadržajni** paket, ne routing-only zamjena:
`.astro/releases/dentvitalis-web-production-candidate-20261004-localized-v3.zip`
(57.916.407 B; SHA-256
`ada0eed003483020c5b2d632a83f16f497aab0ae2a5dd6fdac667d75588200b1`).
CRC i svih 691 payload hashova nakon lokalne ekstrakcije potvrđeni; ukupno
692 datoteke `0644`, 13 mapa `0755`, 65.470.135 B raspakirano s manifestom.
Sadržajni commit je `935e5bb7c43def0d73a33fe3fc744a405acc1f8d`.
Novi privatni cilj je `/home2/dentvita/releases/20261004-localized-v3/`;
**upload i priprema stagea završeni su prema agentu; nije javno aktiviran**.
Ne prepisivati stage ni ZIP `redirects-v2`. Postojeći PHP/backend
prihvat ostaje važeći; ne ponavljati stvarne testne upite zbog promjene slugova.
Preostaju stvarni cPanel runtime/consent/SEO prihvat i kodni povratak prema
release gates; lokalni URL audit ih ne zamjenjuje.

**Najnovije — localized-v3 privatni stage završen prema agentu, 4. listopada:**
vlasnik je dostavio izvještaj i screenshot: upload 100 %, Extract bez
prijavljenih grešaka, 692 datoteke bez ZIP-a (691 payload + manifest),
13 podmapa; agent navodi pregled svih dozvola: datoteke `0644`, podmape i
release mapa `0755`. Manifest navodi sadržajni commit `935e5bb7`; pregledana
su pravila za DE/SI smještaj i dvije povijesne testimonials redirekcije.
To je prijavljeni serverski pregled, ne neovisna provjera SHA-256 i svih
payload hashova. Serverski SHA-256 i točni ZIP bajtovi ostaju neprovjereni.
Javni web, backend, DNS, PHP i backupovi nisu mijenjani prema izvještaju.
Ne ponavljati upload/Extract/dozvole bez novog konkretnog nalaza.

Najnovija prijavljena slobodna kvota je 283,75 MB. Rezerva od oko 50,6 MB
u agentovu izvještaju pretpostavlja kopiranje bloga. Prema već odobrenom
isključenju bloga iz novog roota, ranija procjena 231,5 MB smanjuje se za
155,19 MB na približno 76,31 MB, uz procijenjenu rezervu 207,44 MB.
To nije nova izmjera; prije pripreme provjeriti aktualnu kvotu i stvarni
sadržaj. Blog ostaje u prethodnom direktoriju i backupu, bez brisanja.
Izolirana priprema je naknadno odobrena i dovršena prema agentu za
`/home2/dentvita/public_html-next-20261004-localized-v3/`, uz očuvanje
navedenih bootstrap/verifikacijskih i legacy asset stavki, bez ZIP-a i bloga.
Postojanje novog direktorija potvrđuje dostavljeni screenshot. Stari `redirects-v2`
nazivi niže povijesni su prijedlog, ne nalog za pripremu ili aktivaciju v3.
Aktualni zapis: readiness `fileManagerProgress.localizedV3Stage`.

Vlasnik je zatim odgovorom „da” odobrio izoliranu pripremu navedenog v3
next roota bez bloga, uz očuvanje bootstrap/resursa. Ovo nije odobrenje
preimenovanja javnog direktorija, aktivacije, backend izmjena ili novih
POST-ova.

**Najnovije — v3 next root pripremljen prema agentu:** 1.034 datoteke i
24 podmape; pregled svih dozvola prijavljen kao `0644` / `0755`, korijen
`0750`. Tekstualno su uspoređeni `index.php` s aktivnim izvornikom te
`.htaccess` i `sitemap.xml` s v3 stageom. Kopirane su odobrene stare asset/
verifikacijske stavke, bez bloga, ZIP-a, starih pravila i dijagnostike/logova.
Prijavljena slobodna kvota sada je 207,46 MB; ranija rezerva 207,44 MB ostaje
procjena prije kopiranja, ne aktualna izmjera. Vlasništvo/grupa i hashovi nisu
provjereni. Stari javni direktorij nije mijenjan/preimenovan i stara naslovnica
je vidljiva prema izvještaju. Ne ponavljati dovršeno kopiranje i dozvole.
Zapis: readiness `fileManagerProgress.localizedV3NextRoot`.

**Privatna rename/return proba završena prema agentu:** vlasnik ju je zasebno
odobrio odgovorom „da”, bez javne aktivacije. Pripremni next direktorij bio je
preimenovan u `public_html-next-20261004-localized-v3-rename-check` pa vraćen
na izvorni naziv. Obje operacije završile su bez prijavljenih grešaka;
privremeni naziv više ne postoji, korijen je zadržao `0750`, svih šest
ključnih stavki je prisutno s očekivanim dozvolama. Stara naslovnica prikazana
je u pregledniku, aktivni `public_html` nije diran i forme nisu slane prema
izvještaju. Ne ponavljati uspješnu probu bez konkretnog novog nalaza.

Ovo potvrđuje prijavljenu File Manager operaciju i povrat naziva/dozvole,
ne HTTP posluživanje novog roota, vlasništvo/grupu, serverske hashove ili
stvarni produkcijski rollback. Sljedeći predloženi korak jest zasebno
odobren kontrolirani aktivacijski prozor s očuvanom starom javnom verzijom,
provjerama na stvarnom hostu i povratkom javnog koda ako obvezne provjere ne
prođu. Javna aktivacija još nije odobrena ovim korakom ni izvedena; preostale
release gates ne smiju se proglasiti zatvorenima privatnom probom. Nema novih
POST-ova, backend/DNS/PHP promjena niti vraćanja privatnih podataka backupom.

**Raniji read-only plan aktivacije i povratka, 4. listopada:** agent
prijavljuje 1.097,13 MB / 1.500 MB, odnosno 402,87 MB slobodne kvote;
prikaz može kasniti, filesystem i inodeovi nisu potvrđeni. Sadašnji
`public_html` je 167,63 MB, od čega blog 155,19 MB. Predloženi next root s
kopijom bloga procijenjen je na 231,5 MB uz 171,4 MB rezerve.

**Ispravak plana prema postojećoj odluci vlasnika:** blog ne kopirati u novi
javni direktorij. Ostaje u staroj verziji i backupu, bez brisanja. Odluka o
uklanjanju iz novog weba ne stvara automatski blog 301/410 pravila. Time se
izbjegava dodatna kopija približno 155 MB; to je procjena, ne nova izmjera.
Sačuvati neizmijenjeni `index.php`, `.well-known`, četiri stare javne asset
mape, `email/logo001.png`, `upitnik.pdf` i potvrđene verifikacijske datoteke.
Ne kopirati stare `.htaccess`/sitemap preko novih. `cgi-bin`, `.ftpquota` i
`.passwd` ne prenositi samo zato što postoje: prvo potvrditi ovisnosti i
aktivna zaštitna pravila, bez otvaranja vjerodajnica ili izvršavanja skripti.
Stari dijagnostički PHP, logovi, `robot.txt` i ZIP ne prenose se automatski.

Predložene, ali još neizrađene putanje:
`/home2/dentvita/public_html-next-20261004-redirects-v2/`,
`/home2/dentvita/public_html-before-20261004-redirects-v2/` i
`/home2/dentvita/public_html-failed-20261004-redirects-v2/`.
Nazivi nisu zauzeti prema agentu. Između dvaju budućih preimenovanja očekuje
se kratki prekid; ta radnja nije odobrena ni izvedena ovim read-only nalazom.
Za next root tek treba odobriti izoliranu pripremu, bez prepisivanja stagea
ili javnog weba. Sadašnji public root je `0750` prema agentu; vlasništvo i
grupa pri kopiranju još nisu provjereni, ne širiti dozvole naslijepo.
Povratak zamjenom samo javnog direktorija čuva susjedni `application` i
novije podatke, ali postojanje plana nije izvedbeni test povratka. Zapis:
`fileManagerProgress.activationReadOnlyPlan` u readiness JSON-u.

**Najnovije — petojezična backend dostava prihvaćena, 4. listopada:** vlasnik
je na pitanje o IT/DE/EN/SI CRM zapisima i otvaranju PDF-ova odgovorio
„Da potvrđujem, sve je ok.” Uz ranije potvrđene e-mailove i prihvaćeni HR
test to zatvara vlasnički prihvat primitka svih pet sintetičkih backend upita.
Ne ponavljati POST-ove niti tražiti iste potvrde ponovno. Za četiri preostala
jezika to je zajednička vlasnička potvrda CRM-a i čitljivih CRM PDF-ova, ne
neovisni pristup, hash provjera ili zasebna potvrda otvaranja PDF-a u mailboxu.
Novi frontend submit, konverzije, PHP/cookie prihvat, integritet stagea,
potpuni SEO prihvat i test kodnog povratka nisu time potvrđeni. Nema javne
aktivacije ni nove ovlasti za slanje. Izvor: readiness
`syntheticDeliveryTestProgress.remainingCrmAndPdfAcceptance`.

**Najnovije — routing-v2 privatni stage završen prema agentu, 4. listopada:**
vlasnik je dostavio izvještaj i cPanel screenshot za
`/home2/dentvita/releases/20261004-redirects-v2/`. Upload je 100 %, Extract
bez prijavljenih grešaka; agent navodi 692 datoteke i 13 mapa te pregled
korijena i svih podmapa: sve payload datoteke `0644`, sve mape `0755`, ZIP
`0644`. Screenshot podupire korijenski popis; puni JSON audit na vlasnikovu
Macu nije dostupan ovom Codespaceu i nije ovdje pročitan. Prihvatiti to kao
agentov izvještaj, ne neovisnu provjeru svih serverskih datoteka.

cPanel prikazuje ZIP `55,23 MB`, što odgovara zaokruženih 55,23 MiB za lokalnih
57.909.892 B, ali ne potvrđuje točnu veličinu ili integritet. Serverski SHA-256
i svi payload hashovi nisu provjereni; File Manager nema hash opciju prema
agentu. Ne ponavljati upload, Extract ni pregled dozvola bez novog razloga.
Ništa nije kopirano u `public_html` ili `application`; javni web nije aktiviran.
Slijedi priprema očuvanja bootstrap/verifikacijskih i potrebnih starih javnih
resursa te kodnog povratka, uz preostale release gates. Novi upiti nisu odobreni.
Aktualni nalaz je `fileManagerProgress.routingRevisionStage` u readiness JSON-u.
Lokalni routing audit i raniji Excel ostaju snimke trenutka prije uploada;
njihove oznake „nije uploadan” nisu aktualni status ovog stagea.

**Odobrene redirekcije — 4. listopada:** vlasnik je potvrdio šest 301 odluka u
`data/seo/cpanel-redirect-decisions.json`. Stari ciljevi i izvorni aliasi vode
izravno na nove slashless ciljeve; uklanja se samo suprotna pojava
`/vr_tour_eng.htm → /`, dok `/en` ostaje. Tri stranice ostaju u PHP-u:
dezinfekcija, produženje krune i keramički most na svim implantatima.
Njihov sadašnji produkcijski GET je 200; Edita i Zoran sada vraćaju 404.
Pri aktivaciji očuvati i stare javne CSS/JS, slike i fontove potrebne tim
trima PHP stranicama; statički ZIP ne sadrži njihov legacy frontend.
Zamjena javnog direktorija ne smije odbaciti postojeće potrebne assete.
Provjeriti učitavanje njihovih resursa uz stvarni produkcijski PHP prihvat.
Za Editu i Zorana vlasnik je odobrio zamjenu zbirkom iskustava, ne prijenos pojedinačnih
svjedočanstava. Dokazi i granice su u `data/seo/legacy-target-review-20261004.json`.

Revidirani paket priprema `scripts/revise-cpanel-routing-release.mjs` iz
prethodnog hash-provjerenog `-perms.zip`, bez rebuilda stranica ili formi.
Mijenjaju se samo `.htaccess` i `release-manifest.json`; manifest zasebno
bilježi izvorni commit sadržaja i commit routing revizije. Prije izvršavanja
commitati provjereni kod. ZIP se objavljuje isključivo lokalno, uz odbijanje
prepisivanja postojećeg izlaza i dozvole 0644/0755. Primjer:

```bash
node scripts/revise-cpanel-routing-release.mjs \
  --source-zip /workspaces/Dent-Vitalis-web/.astro/releases/dentvitalis-web-production-candidate-20261001-af6dc28-perms.zip \
  --output /workspaces/Dent-Vitalis-web/.astro/releases/dentvitalis-web-production-candidate-20261004-redirects-v2.zip
```

Novi privatni cPanel cilj je `/home2/dentvita/releases/20261004-redirects-v2/`.
Prije uploada potvrditi prostor za ZIP i ekstrakciju; ako cilj postoji, stati
bez prepisivanja. Stari izvori, ZIP-ovi, stage i backupovi ostaju netaknuti.
Ovo odobrenje nije nova instalacija PHP-a, ponavljanje upita ni zaobilaženje
preostalih CRM/PDF, transport, rollback i produkcijskih consent provjera.

**Novi paket lokalno dovršen:**
`dentvitalis-web-production-candidate-20261004-redirects-v2.zip`, 57.909.892 B,
SHA-256 `3e0ee5496a3379f56df1daf98a061e60bb06a699f5f6a642c528f7091cec9ba4`.
Lokalni Extract potvrđuje 692 datoteke 0644 i 13 mapa 0755; CRC prolazi.
Sadržaj ostaje `af6dc28`, routing commit `ac0b3ba`; svih 690 neizmijenjenih
payload zapisa ima iste hashove. Samo `.htaccess` i manifest su revidirani.
27/27 ciljanih provjera prolazi, uključujući stvarni izolirani Apache uz
izvorni `.htaccess`. Prvi startup imao je ECONNRESET, uzrok nije utvrđen;
dijagnostički i završni zajednički prolaz potom su prošli. To nije potvrda
novog PHP runtimea na produkciji. Sanitizirani zapis:
`data/seo/cpanel-routing-revision-20261004.json`. Za SEO kolegu koristiti
[aktualni CSV](seo/redirects-approved-20261004.csv) i
[tumačenje](seo/redirects-approved-20261004-README.txt), ne prethodni snapshot.
To je lokalna snimka prije uploada; naknadni serverski stage opisan je na vrhu.
Public aktivacija nije obavljena.

**Aktualni smjer:** bez zahtjeva hosting podršci i bez pretpostavljenog SSH-a.
API priprema je završena, ali prvi test veze nije prošao. Nastaviti pripremu
ručnim File Managerom; API automatizacija je pauzirana. Ni jedan put još nije izvedbeno
potvrđen za objavu. SSH nije opći preduvjet migracije. Jedna GitHub akcija za
produkcijsku objavu još nije implementirana; backup i forme ostaju release gates.

**Najnovije — preostala četiri TEST upita poslana 4. listopada 2026.:**
nakon prihvaćenog HR testa vlasnik je odgovorio „krenimo”. IT, DE, EN i SL
poslani su po jednom između 12:20:38 i 12:20:43 UTC (14:20 po Zagrebu).
Četiri svježe same-session token preflight provjere prošle su prije POST-ova.
Svaki `/send` POST vratio je HTTP 200 JSON `status:ok` i `no-store`, bez
validacijskih grešaka. Svaki je imao jedan neutralni PDF od 640 B.

| Jezik               | Oznaka testa                 | Primitak e-maila/CRM-a i čitljivih privitaka       |
| ------------------- | ---------------------------- | -------------------------------------------------- |
| IT                  | `DV-MIG-20261004-IT-122037Z` | E-mail, CRM i čitljiv CRM PDF potvrđeni vlasnikom. |
| DE                  | `DV-MIG-20261004-DE-122037Z` | E-mail, CRM i čitljiv CRM PDF potvrđeni vlasnikom. |
| EN                  | `DV-MIG-20261004-EN-122037Z` | E-mail, CRM i čitljiv CRM PDF potvrđeni vlasnikom. |
| SL, javni URL `/si` | `DV-MIG-20261004-SL-122037Z` | E-mail, CRM i čitljiv CRM PDF potvrđeni vlasnikom. |

Vlasnik je 4. listopada odgovorio „Stigli su emailovi”. Prihvaćena je ta
zajednička potvrda primitka preostalih e-mailova; nema zasebnih screenshotova,
neovisnog mailbox pristupa. Naknadnu CRM/PDF potvrdu opisuje najnoviji zapis
na vrhu; e-mail PDF otvaranje tih četiriju jezika nije zasebno potvrđeno.
Za SEO kolegu aktualni je [popis odobrenog paketa](seo/redirects-approved-20261004.csv),
uz [granice dokaza i otvorene odluke](seo/redirects-approved-20261004-README.txt).
Izvoz iz ZIP-a nije produkcijski HTTP test niti aktivacija redirekcija.

Ukupno je izvršeno svih pet odobrenih POST-ova, bez ponavljanja. Ne slati
nove testove/auto-retry samo zato što primitak još nije pronađen. Očekivano
slanje izvršava postojeći PHP backend na cPanelu: Codespaces je samo poslao
multipart zahtjev na pravi `https://www.dentvitalis.com/send`, nije slao SMTP
ili izravni CRM zahtjev. Primatelji, CRM, konfiguracija, DNS i javni izgled
nisu mijenjani. Ovo nije browser submit nove Astro forme niti GTM konverzija.
Detaljni sanitizirani rezultati/hashi su u `syntheticDeliveryTestProgress`.
Novi privatni upload završen je prema agentu; backend primitak svih jezika
prihvaćen je vlasnikom. Javna aktivacija čeka preostale release gates.

**Prvi odobreni stvarni sintetički POST — prihvaćeni HR:** vlasnik je odobrio
pet TEST upita (po jeziku), jedan bezopasni PDF i dostavio kontakt testnog
pošiljatelja. Kontakt vrijednosti nisu zapisane u repozitorij. Prvi HR upit
`DV-MIG-20261001-HR-152910Z` poslan je jednom u 15:29:10 UTC kroz postojeći
`/send`, multipart, svježi tokeni iste sesije, bez promjene primatelja/CRM-a.
Ime/poruka/privitak jasno označavaju TEST MIGRACIJE, nije upit pacijenta.
Odgovor u 15:29:11 UTC: HTTP 200, JSON `status:ok`, `no-store`, bez vidljive
PHP greške. PDF ima 640 B; naziv/hash u readiness JSON-u. To je izravni
backend test, ne end-to-end submit novog frontend izgleda ili dokaz dostave.
Vlasnikov CRM screenshot od 2. listopada potvrđuje upravo ovu oznaku, hrvatski
jezik, izvor Web, odgovarajuće kontaktne podatke i poruku označenu kao TEST.
CRM lead je potvrđen; vlasnik je naknadno potvrdio da se njegova PDF kopija
otvara. To je potvrda čitljivog privitka, ne neovisna provjera sadržaja/hasheva.
Vlasnik je 2. listopada potvrdio primitak e-maila
i dostavio screenshot proslijeđene poruke s otvorenim PDF-om: oznaka i
izvorno vrijeme odgovaraju HR testu, PDF prikazuje samo neutralni TEST tekst.
HR inbox i e-mail privitak potvrđeni su vlasničkim dokazom, bez neovisnog
pristupa mailboxu ili provjere preuzetog hasha. Screenshot/kontakti/adrese
primatelja ne pohranjuju se u repozitorij. HR dostava i čitljivi privici sada
su prihvaćeni. Naknadni IT/DE/EN/SL POST-ovi opisani su iznad; e-mailovi su
potvrđeni, CRM zapisi i čitljivi privici još čekaju potvrdu. HR ne
ponavljati. Cloudflare brisanje blokirano je brojem objava; vlasnik je zatražio
da ga zasad ostavimo. Projekt nije potvrđen kao obrisan, ne ponavljati brisanje.

**Najnovije — privatni PHP instaliran, neovisni GET prihvat prošao:** agent
potvrđuje oba helpera i patch zajedničkog `send.phtml`, sve `0644`, read-back
prema diffu. Kopija handlera za povratak je
`/home2/dentvita/backups/php-before-delivery-v1-20261001/send.phtml`
(`0700` mapa / `0600` kopija, izvorni handler `0644`). Agentovi GET-ovi
naslovnice i `/send` su 200; `/form-tokens` i `/gct` njegov Chrome blokira
`ERR_BLOCKED_BY_CLIENT`. Uzrok te klijentske blokade nije utvrđen.

Neovisna provjera iz Codespacesa 2026-10-01 u 15:19:39 UTC koristi samo pet
GET-ova (`/`, `/send`, `/form-tokens`, `/gct`, opet `/form-tokens`), provjeren
TLS i cookie jar samo u memoriji. Svi vraćaju 200. `/form-tokens` vraća JSON
s nepraznim CSRF/GCT i `private, no-store, max-age=0`, bez CORS allow-origin.
GCT se poklapa između endpointa, oba tokena ostaju ista pri ponovnom dohvatu
u nepromijenjenoj sesiji. Vrijednosti tokena/cookieja nisu zapisane.
Cookie: Secure true, HttpOnly false, SameSite nije eksplicitno naveden, path `/`,
host-only. Vlasnik je naknadno ručno otvorio `/form-tokens` u običnom Chromeu
i screenshotom potvrdio JSON s obje neprazne oznake, bez klijentske blokade.
U repozitorij je zapisan samo rezultat, ne tokeni ili screenshot. Screenshot
ne potvrđuje HTTP headere, sesijsko poklapanje ili end-to-end submit nove forme.
To nije prihvat sigurnosti cookieja niti punog browser submit toka.
Bez pregleda kompatibilnosti ne mijenjati session postavke.

Tijekom tog GET prihvata nije izveden POST ili javna aktivacija; naknadni
odobreni sintetički POST opisan je iznad. GET `/send`
potvrđuje odsutnost vidljive parse greške, ne izvršenje POST grane. Efektivna
PHP verzija/ekstenzije, browser submit nove forme, session hardening, CRM poslovni odgovor
i prihvat ostalih jezika ostaju otvoreni. HR inbox/lead potvrđeni su naknadno
vlasničkim dokazima iznad. Ne ponavljati instalaciju ili
GET audit bez promjene; ne zaobilaziti browser alatnu sigurnosnu politiku.

### Evidencija — što ne ponavljamo bez novog razloga

| Stavka                                                     | Dokaz/status                                                                                    | Kada ponoviti                                                                                  |
| ---------------------------------------------------------- | ----------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| Lokalni produkcijski paket, manifest, CRC, routing i forme | Lokalno prošlo za kandidat `af6dc28`; nije dokaz dostave                                        | Promjena koda, paketa ili stvarnih serverskih pravila                                          |
| Lokalni ZIP starog weba                                    | CRC prošao prema agentu; nema `application/data` ni baze bloga                                  | Promjena arhive ili prihvat novog kompletnog backupa                                           |
| File Manager / Extract                                     | Stari paket uploadan/raspakiran; UI nema rekurziju po vrsti; dozvole sadržaja nisu ispravljene  | Ne ponavljati dijalog ili stari ZIP; novi `-perms.zip` testirati u novoj privatnoj mapi        |
| SSH/shell i SSH stage                                      | Panel traži administratorsko omogućavanje; bez prijave i ključeva                               | Samo nova izričita odluka i dokaz da je pristup omogućen                                       |
| Symlink switch                                             | Postojeći `www → public_html` nije dokaz; switch nije testiran                                  | Samo ako odabrani postupak stvarno zahtijeva link i postoji novi dokaz                         |
| cPanel API tokeni                                          | Token stvoren/pohranjen prema agentu; prvi run nije prošao vezu. Autentifikacija nije potvrđena | Novi dokaz o transportu prije novog pokušaja; ne stvarati novi token i ne ponavljati isti test |
| Git Version Control                                        | Agentov prikaz: 0 repozitorija; raniji “Upload pa Deploy” nije identificiran                    | Samo novi dokaz ili odluka o odabranom postupku                                                |
| JetBackup restore, PHP/FPM, cookieji, e-mail i CRM         | Prikaz/izvor postoji; stvarni prihvat još nije proveden                                         | Odobreni test s dokazom, ne ponovno čitanje istih statistika                                   |
| Dvije dodatne pune kopije                                  | Procjena `813,96 MB` gotovo troši prijavljenih `866 MB`                                         | Nova izmjera ili promjena politike/prostora; ne pokušavati isti raspored                       |

Ne označavati `nije provjereno` kao `ne radi`, niti UI/prikaz kao uspješnu
operaciju. Nakon svakog koraka zapisati datum, točan release/input hash,
izvedenu radnju, vrstu dokaza, rezultat, otvorene stavke i uvjet ponavljanja.
Ne prepisivati ranije read-only nalaze novim tvrdnjama o produkcijskom testu.

Lokalna provjera procedure: `npm run test:migration-procedure` provjerava API
ograničenja i zaustavljanje SSH puta na testnim odgovorima, bez pristupa cPanelu.
Workflow datoteke provjeriti kao YAML; njihov prolazak lokalnih provjera nije
dokaz izvršavanja na GitHubu ili dostupnosti serverskih operacija.

### API — priprema završena, prvi test veze nije prošao

Vlasnik je odobrio token, sigurnu pohranu, read-only test i nastavak migracije.
Odobrenje ne zatvara release gates, ne mijenja DNS niti dopušta prepisivanje
privatnih podataka. Ne ponavljati potvrđene korake pripreme.

- Agent: `dentvitalis-migration-20261001` stvoren i spremljen samo u environment
  secret `cpanel-api-readonly/CPANEL_API_TOKEN`; istek `8. 10. 2026. 23:59:59`
  prema cPanelu, vremenska zona nepotvrđena. Vrijednost tokena nije dostavljena
  ovom agentu. Secret metadata API i dalje vraća 403; pohrana je agentov nalaz.
- Neovisni GitHub GET potvrđuje reviewer-a `slavisasrdic-debug`, dopušten
  vlastiti review, `can_admins_bypass=false`, samo branch `main`, bez tagova.
- [Run #1](https://github.com/slavisasrdic-debug/Dent-Vitalis-web/actions/runs/36861772566)
  na commitu `44c2c9b` neovisno je potvrđen kao `failure` u metadata koraku:
  `Read-only cPanel request failed: network, timeout or TLS.` Nije ponovljen.
  **Autentifikacija i metapodaci nisu potvrđeni.** Deprecation upozorenje Node
  action runtimea samo po sebi nije dokaz uzroka ove greške.
- Jedan credential-free Codespaces test: DNS radi; `dentvitalis.com` i `www`
  imaju IPv4 `89.201.174.71`; HTTPS javnog weba vraća 200. TCP na port 2083
  završava curl greškom 28 nakon 5 sekundi, bez uspostavljene veze/TLS-a.
  To nije test s GitHub runnera i ne utvrđuje njegov točan uzrok ili firewall
  politiku. Ne tvrditi da je token neispravan ili da je potvrđena TLS greška.

API automatizacija je pauzirana. Ne ponavljati isti autentificirani run,
stvarati/zamjenjivati token, isključivati TLS ili slati token alternativnom
hostu. Novi pokušaj traži novi dokaz o transportu ili promjenu dostupnosti.
Ne pokretati SSH niti tražiti promjene hostinga kao automatski preduvjet.
Raniji GitHub environment PUT s ovom integracijom bio je 403; browser agent je
naknadno dovršio postavke. Razlikovati ta dva nalaza i ne ponavljati PUT.
Token ostaje osjetljiv račun-wide pristup, ne read-only ključ. Opoziv ili
produljenje nakon odluke o API putu zasebno evidentirati; ne raditi ih prešutno.

### Aktualna pauza novog uploada — pripremljena PHP dopuna

Vlasnik je zatražio cjelovit pregled prije novog uploada. Novi browser agent
potvrdio je sadržaj stagea i `.htaccess`/PHP routing iz koda, svih pet zahvalnih
datoteka/noindex/sitemapa i postojeći GTM bez zasebnog CookieYes loadera.
Nije proveo sve serverske hashove, runtime, POST ili dostavu. To ne zatvara gates.
Prikaz potrošnje sada je `978 MB / 1,46 GB`, približno `0,5 GB` rezerve,
bez dokaza inodeova/slobodnog filesystema. Stare procjene nisu aktualna garancija.

**Novi javni upload zadržati dok se ne dovrši backend prihvat.** Mali privatni
paket za kontroliranu instalaciju/runtime test dolazi prije javnog switcha,
ali zahtijeva zasebno odobrenje i verificirani backup. Nedostajući
`form-tokens.phtml` i `form-request-guard.php` već su lokalno pripremljeni i
njihovi bajtovi/hashi odgovaraju manifestu; u tom ranijem auditu nisu bili
instalirani. Naknadna instalacija i GET prihvat opisani su na vrhu runbooka.
Guard rješava zasebnu validaciju privitka, ne SMTP/CRM rezultat. Izvorni mali
privatni ZIP također nosi `0666` metadata; ne koristiti ga kao završni paket.
Pripremiti završnu privatnu dopunu s sigurnim dozvolama nakon pregleda slanja.
Nije potreban novi javni build samo zato što PHP dodatak nije instaliran.

Legacy `/send` može vratiti `ok` nakon neuspjele dostave. Za siguran konkretan
patch treba **redaktirani aktualni** `application/view/template/send.phtml` i
relevantni kod `application/src/Application/Mail/Mail.php` (return/exception
ugovor). Izlaz ne smije sadržavati API/SMTP ključeve, vrijednosti primatelja,
`local.php`, postojeće logove ni podatke pacijenata. Ne nagađati strukturu CRM
potvrde ili prepisivati privatni handler generičkim kodom. Sljedeći zadatak
agentu bio je samo dohvat redaktiranog koda, bez instalacije/POST-a/aktivacije.
`test@example.com` preskače CRM prema nalazu; nije valjan puni delivery test.

**Redaktirani kod sada je pregledan i spremljen** u
`reference/cpanel-redacted/2026-10-01/`; nema jezičnih `send.phtml` overrideova
prema agentu. Zasebni `_send.phtml` nije predmet izmjene. Source attachment
SHA-256: `3d54153f7e3597d11227658428bb5ff7b829508a2619f655056b647a9ae3ddad`.
`Mail::send()` vraća bool; SMTP neuspjeh nije ulazio u `$errors`, a CRM
rezultat je prepisivao istu `$result` varijablu bez provjere HTTP statusa.

`scripts/legacy-send-delivery-patch.mjs` priprema **samo kirurgijski diff**,
ne cijeli redaktirani handler za instalaciju. Dodaje require postojećeg
upload guarda prije obrade, zasebno čuva SMTP rezultat, provjerava cURL
grešku/HTTP status, ne slijedi redirecte, uključuje TLS provjeru i rokove
10/30 s. CRM se i dalje pokušava nakon SMTP neuspjeha. Tehnički nepotvrđena
dostava vraća 503 + `status:error/code:delivery_unconfirmed`, što postojeći
frontend prikazuje odobrenom porukom bez auto-retryja. Namjerni test/spam
CRM bypass, konfiguracija, ključevi i postojeće mapiranje ostaju sačuvani.
Ne mijenja `Mail.php`, SMTP debug ili privatne poruke/dozvole data direktorija.

Lokalni PHP 8.4.15 fixture test pokreće stvarni redaktirani handler s
isključivo lokalnim SMTP mockom i lokalnim CRM-om: bool/exception SMTP,
302/400/500 CRM, timeout, privitak, polja, CSRF i test/spam bypass.
`npm run test:legacy-delivery-patch` prolazi; to nije PHP 7.4/FPM runtime
ni stvarna dostava. Diff SHA-256:
`f7061a935d943a8f09c6eb6f9dbfc2485f0e513b33699438ddd1532ab7c266ea`.

**Preostalo ograničenje:** SMTP `true` znači prihvat transporta, ne inbox;
CRM 2xx znači HTTP prihvat, ne potvrđen lead. Poslovni sadržaj stvarnog CRM
odgovora nije dostavljen. Ne izmišljati njegovu shemu niti označiti ovaj
patch kao potpuno rješenje svih CRM lažnih uspjeha. Prije aktivacije mora se
potvrditi API ugovor i odobreni sintetički lead (uključujući obradu eventualne
poslovne greške uz HTTP 2xx), uz zasebnu inbox provjeru.

Pripremiti mali privatni candidate ZIP s dva neizmijenjena PHP dodatka,
diffom, uputom i vlastitim manifestom, sve datoteke `0644` / mape `0755`.
Ni redaktirani `send.phtml` ni konfiguracija/ključevi ne smiju u taj ZIP.
Agent pri odobrenoj instalaciji prvo verificira privatni backup i čuva
zasebnu kopiju **samo starog `send.phtml` koda** izvan web root-a, zatim
postavlja dodatke privatno i ručno primjenjuje diff na stvarni handler.
Ako kod ne odgovara anchorima, stati za novi pregled. Ne prepisivati handler
redaktiranim sourceom, ne mijenjati ključ/primatelje ili `_send.phtml`.
Do izričitog odobrenja instalacije/testa nema cPanel zapisa, POST-a ili switcha.

**Mali privatni paket je pripremljen i lokalno verificiran:**
`dentvitalis-private-backend-candidate-20261001-delivery-v1.zip`, `4.977 B`,
SHA-256 `4140276484fb4c19ea758b4d1e436c74e192efde0ec605f3ea9c5b2b53ff1d9b`.
Kodna verzija `25e0570b74ece78c85704179aef33802e62158f2`. Ima 5 datoteka
(2 PHP dodatka, diff, README, manifest), `9.503 B` raspakirano. CRC, svi
hashovi i stvarni lokalni Extract `0644` potvrđeni. Nema cijelog handlera,
konfiguracije, tajni ili privatnih podataka.
Javni `-perms.zip` nije regeneriran: frontend već podržava ovaj error tok.

**Privatni stage je sada završen prema agentu i screenshotima vlasnika:**
paket je uploadan i raspakiran bez prijavljenih grešaka u
`/home2/dentvita/releases/20261001-private-backend-delivery-v1/`.
Svih pet payload datoteka postoji i ima `0644`; mapa ima `0755` prema agentu.
README je pročitan. Potpuni serverski hashovi nisu neovisno potvrđeni.
U toj stage fazi ništa nije bilo kopirano u `application` ili `public_html`;
patch nije bio primijenjen. Naknadna instalacija opisana je iznad.
POST/dostava i dalje nisu testirani. Ne ponavljati upload/Extract ovog paketa.
Vlasnik je naknadno potvrdio provjeru lokalnog backupa i dodatnu kopiju.
Vlasnik je zatim odgovorio **„Potvrđujem”** na zasebni zahtjev za instalaciju
dva PHP dodatka, minimalnu izmjenu `/send` i provjeru tokena. To odobrenje ne
uključuje POST/stvarno slanje ni aktivaciju novog izgleda. Instalacija je zatim
prijavljena kao izvršena. Ne ponavljati provjeru backupa bez novog razloga.
Instalacija patcha mijenja zajednički `/send`, dakle utječe i na stare forme.

### Odobrena privatna instalacija — provedeno prema agentu, ne ponavljati

1. File Manager: koristiti već raspakirani
   `/home2/dentvita/releases/20261001-private-backend-delivery-v1/`.
   Ne ponavljati upload/Extract. Provjeriti da stvarni `send.phtml` odgovara
   originalnim dijelovima diffa; ako je već izmijenjen ili ne odgovara, stati.
2. Sačuvati samo aktualni `application/view/template/send.phtml` u novoj
   privatnoj `/home2/dentvita/backups/php-before-delivery-v1-20261001/`,
   mapu postaviti `0700`, kopiju `0600`, ne prepisivati postojeći backup.
   Kopija handlera sadrži ključ: ne prikazivati ga u izvještaju/screenshotu.
3. Ako dva helpera već postoje u odredištu, stati i usporediti/prijaviti prije
   prepisivanja. Inače kopirati samo `form-tokens.phtml` i
   `form-request-guard.php` u `/home2/dentvita/application/view/template/`,
   zadržati `0644`. Diff/README/manifest ne kopirati u taj direktorij.
4. Ručno kroz File Manager Editor primijeniti samo hunkove
   `legacy-send-delivery.patch` na postojeći `send.phtml`. Ne zamijeniti
   handler redaktiranom datotekom, ne upisivati diff markere, ne mijenjati
   ključeve, primatelje, mapiranje, `Mail.php`, `_send.phtml` ili konfiguraciju.
   Ponovno pročitati spremljeni kod; postojeća dozvola handlera ne širi se.
5. Bez submit/POST-a: otvoriti postojeću naslovnicu i `GET /send` radi PHP
   parse-error provjere; to nije provjera obrade POST-a ili dostave. Na
   `https://www.dentvitalis.com` provjeriti `GET /form-tokens` (200, JSON s
   nepraznim `csrf`/`gct`, `no-store`, bez CORS dozvole) i postojeći `GET /gct`
   u istoj sesiji. Zabilježiti cookie atribute i kontinuitet sesije, bez
   vrijednosti tokena/cookieja. Ne dodavati javni `phpinfo` ili debug endpoint.
6. Na grešku stati i prijaviti redaktirani nalaz. Ako je izmjena handlera
   izazvala regresiju, vratiti samo njegovu upravo sačuvanu kodnu kopiju;
   ne raspakirati puni backup preko podataka. Na uspjeh stati prije POST-a i
   switcha. Report: instalirane datoteke/dozvole, scope diffa, GET statusi,
   JSON oblik i cache/cookie atributi, rollback kopija i otvoreni runtime/CRM
   prihvat. Ne izvještavati tokenima, tajnama ili privatnim porukama.

Nakon pregleda: pripremiti jedan kontrolirani skup PHP izmjena i finalne
pakete; vlasnički odobrena instalacija uz verificirani backup prethodi
token/runtime i zasebno odobrenom sintetičkom testu inboxa + CRM-a. Tek potom
javna aktivacija. Sadržaj `_pages` u privatnoj mapi sam po sebi nije javni test.
Rutinski rollback vraća samo javni kod; ako se mijenja PHP, vratiti samo
njegove izmijenjene kodne datoteke iz posebne kopije. Nikad ne vraćati novije
`application/data`, log/mail podatke, bazu ili CRM starim punim backupom.

### File Manager, backup i privatni stage — provedeno i pripremljeno

Vlasnik je izričito odabrao File Manager. Ovaj zadatak nastavlja odobrenu
migraciju, ali **ne aktivira novi web**.
Ako browser alat zahtijeva neposrednu potvrdu prije zapisa, navesti točnu
radnju i privatnu ciljnu putanju. Ne zaobilaziti njegovu sigurnosnu potvrdu.

**Aktualno:** agent je napravio privatni
`backups/pre-migration-20261001/dentvitalis-full-files-20261001.zip` (224,79 MB
prema cPanelu), s cijelim `application/data` prema nalazu, bez prijavljene
greške kompresije. Ne ponavljati kompresiju. Agentov download bio je nedovršen;
vlasnik je naknadno screenshotom pokazao lokalni `dentvitalis-full-files-20261001.zip`.
Vlasnik je zatim izričito potvrdio da je ta lokalna arhiva prošla provjeru
integriteta i da postoji dodatni backup. To prihvatiti kao vlasnikov dokaz;
točna metoda, veličina/hash i lokacija dodatne kopije nisu neovisno provjereni.
Ne ponavljati CRC, download ili izradu backupa bez novog konkretnog razloga.
Izvedbeni restore nije time potvrđen; kodni povratak čuva zasebni stari handler
i ne vraća privatne podatke. Chrome-only browser agent nema pristup lokalnim naredbama;
ne zadavati mu CRC, hash ili lokalno raspakiravanje koje ne može izvršiti.
Agent ne zaobilazi blokadu `chrome://downloads`; vlasnik provjerava preuzimanje
osobno. Privatni backup ne slati u chat, GitHub ili javnu mapu.

Vlasnik je naknadno izričito zatražio upload novog weba. **Dopušten je samo
izolirani stage u novoj privatnoj mapi**, bez prepisivanja postojećih datoteka,
javnog weba ili PHP-a. Taj stage može prethoditi dovršetku lokalne provjere
backupa jer ne zamjenjuje postojeći web. To ne zatvara backup gate: javna
aktivacija i backend izmjene i dalje čekaju sve niže navedene preduvjete.
Novi javni ZIP agentu je lokalno prošao veličinu/hash/CRC i 692 datoteke/
65.436.532 B prema ranijem nalazu, ne kao nova provjera Chrome-only agenta.
Vlasnikov screenshot potvrđuje upload točnog javnog ZIP-a u
`/home2/dentvita/releases/20261001-af6dc28/`: zelenih 100 % i `55.26 MB complete`.
Naknadni screenshot potvrđuje Extract, a vlasnik potvrđuje `index.html`,
`.htaccess` i `release-manifest.json` u korijenu. Serverski SHA-256 nije potvrđen.
Uočene su dozvole datoteka `0666` i mapa `0777`; lokalni ZIP metadata potvrđuje
te načine. Prije aktivacije sve obične datoteke tog statičkog releasea trebaju
biti `0644`, sve njegove mape `0755`. Provjeriti mogućnosti File Managera;
ne pretpostavljati odvojene rekurzivne opcije za datoteke i direktorije.
Ne postaviti sve stavke na isti mode, ne slijediti symlinkove i ne mijenjati
`public_html`, `application`, backupove ili roditeljske direktorije. Ako UI ne
omogućuje pouzdanu korekciju cijelog opsega, stati i prijaviti ograničenje.

**Novo potvrđeno ograničenje:** agent je pregledao dijalog; nema rekurzivne
primjene uz razlikovanje datoteka i mapa. Zatvoren je bez promjena. Korijenska
release mapa već je `0755`, sadržaj ostaje neispravljen. Ne ponavljati taj put.

**Rješenje pripremljeno lokalno:** novi
`dentvitalis-web-production-candidate-20261001-af6dc28-perms.zip`,
`57.909.363 B`, SHA-256
`bee2a78a94ff223a1e8c008f97886632b43d7de2fc6853a230d5de9432c19a1b`.
Bez rebuilda: svih 692 datoteke, uključujući manifest, bajtno su iste kao u
starom ZIP-u (`65.436.532 B`). CRC i stvarno lokalno raspakiravanje potvrđuju
sve datoteke `0644` i svih 13 mapa `0755`. Stara arhiva nije promijenjena.
To ne dokazuje serverske dozvole prije novog cPanel Extract testa.

Pripremljeni korak browser agentu **nakon gornje pauze i završnog backend plana**:

1. Provjeriti aktualni prostor za približno 123,4 MB dodatnih logičnih bajtova
   (novi ZIP + ekstrakcija), uz rezervu za stvarnu alokaciju/inodeove.
   Ne brisati staru mapu, ZIP ili backupove radi prostora.
2. Napraviti **novu** `/home2/dentvita/releases/20261001-af6dc28-perms/`.
   Ako postoji, stati bez prepisivanja. Korijenska mapa `0755`.
3. Uploadati samo novi `-perms.zip`, pa Extract u tu istu novu mapu.
   Vlasnik odabire lokalnu datoteku ako Chrome plugin nema pristup odabiru.
4. Prije daljnjeg rada provjeriti korijen i podmape: obične datoteke `0644`,
   direktoriji `0755`, uključujući skrivenu `.htaccess`, `_pages/hr` i assete.
   Prijaviti opseg pregleda; uzorci nisu dokaz svih 692 dozvola. Ako cPanel
   opet pokaže `0666/0777`, stati: serverski Extract još nije prihvaćen.
5. Stara `/releases/20261001-af6dc28/`, `public_html`, `application` i backupovi
   ostaju netaknuti. **Ne aktivirati** i ne instalirati privatne PHP dodatke.

Za buduće ZIP-ove koristiti `npm run release:zip -- --source /apsolutni/build
--output /apsolutni/novi.zip`. Skripta provjerava payload prema manifestu,
odbija symlinkove/nepoznate datoteke i postojeći output, pakira izoliranu
kopiju s `0644/0755`, bez promjene izvornog builda. Test: `npm run test:release-zip`.

1. Ne stvarati token niti pokretati GitHub API/SSH testove. Prije kompresije i
   uploada provjeriti aktualni prostor, kvotu i dostupni inode prikaz; zadnja
   procjena nije aktualna garancija. Ako podatak nije dostupan, prijaviti to.
   Ne oslobađati prostor brisanjem bloga, poruka, logova, koša ili backupa.
2. **Završeno prema agentu — ne ponavljati.** U privatnom `/home2/dentvita/backups/pre-migration-20261001/` napraviti
   arhivu trenutačnih `public_html`, cijelog `application` **uključujući `data`**,
   i roditeljskog `.htaccess`. Postojeću arhivu ne prepisivati. Ne otvarati
   poruke pacijenata ili prikazivati konfiguraciju/tajne. ZIP bez `data` nije
   dovoljan; JetBackup prikaz nije zamjena za provjeren privatni backup.
3. Vlasnik ili ovlašteni lokalni alat: koristiti postojeći lokalni backup, provjeriti CRC i obnovljivost
   lokalnim raspakiravanjem u odvojenu privatnu mapu, uz ključne datoteke i
   direktorije. Ne raspakiravati dodatnu punu kopiju na ograničeni hosting.
   Vratiti putanje, veličine i SHA-256 gdje je alat dostupan, ne sadržaj poruka
   ili konfiguracije. Ne slati privatni backup u chat, GitHub ili javni artifact.
   To je backup weba/backenda, ne dokaz kompletnog cPanel računa ili baze bloga;
   baze i druge servise ne mijenjati.
4. **Stari upload i Extract završeni prema screenshotu/nalazu — ne ponavljati isti ZIP.** Prema naknadnom odobrenju izoliranog stagea prenijeti **javni statički ZIP**
   `dentvitalis-web-production-candidate-20261001-af6dc28.zip` u novi privatni
   `/home2/dentvita/releases/20261001-af6dc28/`, pa raspakirati tamo. Arhiva:
   `57.946.023 B`, SHA-256
   `33096bf3b41bae18a408f4e0ada7ccd2ba3563098111dd289bc4b04fc7f1c7a9`.
   Ne prenijeti preview artifact ili privatni PHP ZIP kao javni web. Ako cilj
   postoji, ne prepisivati ga. Ne premještati/prepisivati `public_html`.
   Ovaj stari paket zadržati kao dokaz; zbog dozvola slijediti novi `-perms`
   postupak iznad, u novoj mapi, ne prepisivati ovu ekstrakciju.
5. Potvrditi ispravan korijen s `index.html`, `.htaccess`,
   `release-manifest.json`, 691 payload datotekom + manifestom, ukupno
   `65.436.532 B` logičnih bajtova. Ne pribrajati uploadani ZIP ekstrakciji.
   Provjeriti integritet dostupnim sigurnim alatom; ako server hash provjera
   nije moguća, to ostaje otvoreno — UI popis nije SHA-256 potvrda.
   Potvrditi korekciju `0666/0777` na datoteke `0644` i mape `0755` u cijelom
   privatnom statičkom releaseu, uključujući skrivene datoteke i podmape.
6. Vratiti rezultat backupa i stagea, što je zaista provjereno, otvorene
   stavke i potvrdu da javni web/backend nisu mijenjani. **Stati prije aktivacije**,
   instalacije PHP dodataka i testnih upita. Slijedi zaseban prihvat PHP/sesije,
   stvarne dostave e-maila/CRM-a i procedure povratka iz ostatka runbooka.

Dokumentacija cPanela potvrđuje [API tokene](https://docs.cpanel.net/cpanel/security/manage-api-tokens-in-cpanel/)
i [UAPI upload](https://api.docs.cpanel.net/guides/quickstart-development-guide/tutorial-use-uapis-fileman-upload-files-function-in-custom-code).
Za [Fileman fileop](https://api.docs.cpanel.net/cpanel-api-2/cpanel-api-2-modules-fileman/cpanel-api-2-functions-fileman-fileop)
kopiranje/premještanje/raspakiranje dokumentirano je u zastarjelom API 2,
bez navedenog ekvivalentnog UAPI-ja. Zato puni deploy/rollback ne proglašavati
spremnim samo na temelju dostupnosti tokena. Ne slijediti primjere koji
isključuju TLS provjeru. Ne spremati account lozinku ili token u kod, artifact
ili chat. Ne stvarati javni PHP “deploy” endpoint kao zaobilazno rješenje.
Za GitHub zaštite koristiti [environment postavke](https://docs.github.com/en/rest/deployments/environments)
i [branch policy](https://docs.github.com/en/rest/deployments/branch-policies).

### Postupak prve objave i redovnih izmjena

1. Odabrati provjereni GitHub commit i produkcijski paket, ne preview artifact.
2. Verificirati puni privatni backup starog javnog weba i backenda, uključujući
   podatke, te zaštićenu kopiju izvan servera. Potvrditi povratak i rezervu kvote/inodeova.
3. Kontrolirano pripremiti privatne PHP dodatke i testirati tokene/sesiju,
   runtime, e-mail i CRM prema niže navedenom prihvatu. Stvarno slanje traži
   zasebno odobrenje; JSON `ok` nije dokaz dostave.
4. Prenijeti paket u `/home2/dentvita/releases/<release-id>`, izvan javnog weba,
   potvrditi integritet i instalacijsku listu. Ako nema API-ja, to radi agent
   kroz File Manager uz odobreni opseg. Postojeći web ostaje aktivan tijekom prijenosa.
5. Nakon zatvorenih gates i vlasničkog odobrenja aktivirati odabranim,
   testiranim postupkom. Sačuvati bootstrap, privatni backend, konfiguraciju
   i potrebne verifikacijske datoteke. Ne prepisivati cijeli `public_html` naslijepo.
6. Provjeriti sve jezike, forme, potvrde, redirekcije, sitemap, consent i tracking.
   Za automatske provjere koristiti potvrđena očekivanja; predvidjeti ručni
   prihvat stvari koje HTTP status ne dokazuje. Na grešku vratiti kodnu verziju
   i provjeriti da je povratak stvarno uspio.
7. Za kasnije javne izmjene čuvati dvije prethodne verificirane statičke
   verzije. Nepromijenjeni PHP ostaje zajednički uz zaseban privatni backup.
   Ne brisati povratne verzije prije prihvata nove niti automatski vraćati podatke.

### Potvrđeni raspored, veličine i zaštita podataka

- `/home2/dentvita/public_html`: javni web; `index.php` učitava privatni
  `../application`. Odabrani način aktivacije mora sačuvati tu vezu.
- `/home2/dentvita/application`: PHP, vendor, konfiguracija i `data/`.
  `/send`, `/gct` i novi `/form-tokens` moraju ostati pod PHP bootstrapom.
- Kandidat `af6dc28`: ZIP `57.946.023 B`; 691 payload datoteka
  `65.311.606 B` + manifest `124.926 B` = 692 datoteke/`65.436.532 B`.
  Dokumentacijski commit ne regenerira taj ZIP niti mijenja njegov commit.
- Agentov Disk Usage: `public_html 167,63 MB` (blog `155,19 MB`),
  `application 239,35 MB` (`data 234,61 MB`: log `82,78 MB`, mail
  `151,83 MB`). Vrijednosti mogu kasniti i nisu byte/inode inventar.
- JetBackup: 12 prikazanih kopija, najnovija `1. 10. 2026. 02:35`, vremenska
  zona nepotvrđena, “Local backup SATA”. Snapshot sadrži javni i privatni
  direktorij, ali restore i off-server kopija nisu potvrđeni.
- PHP za domenu je 7.4/FPM; sustavni default 8.1 i prikaz INI limita nisu
  dokaz efektivnog runtimea. Ne nadograđivati PHP usput.
- Backup privatnih podataka nije isto što i rollback koda. Automatski povratak
  ne prepisuje `application/data`, SMTP/CRM konfiguraciju ni vanjski CRM.
  Povratak PHP koda zahtijeva zaseban kompatibilan postupak.
- Ne brisati blog, logove, poruke, koš ili backupove radi prostora bez
  zasebnog odobrenja. Arhive u `.trash/` nisu pouzdani trajni backupovi.

## Release gates

Detaljna dopuna od 1. listopada nalazi se u `data/migration-readiness.json`
i `docs/form-delivery-migration.md`. Statički paket nije samodostatan za forme:
`/form-tokens` i upload guard posebno se instaliraju u privatni `application`.
Release manifest čuva njihove očekivane SHA-256 i jasno označuje da ih nije
instalirao. Ti PHP izvori nikada ne idu u `public_html` ili Pages build.

Prije zamjene javnog weba ili promjene privatnog PHP backenda treba postojati
sljedeće. Izričito odobren privatni stage novih datoteka bez prepisivanja nije
aktivacija i ne zatvara ove gates:

1. Točan commit na `main` i provjeren paket. `npm run release:prepare` zadano
   izrađuje preview paket; za aktivaciju na domeni koristiti zasebnu
   `release:prepare:production` naredbu opisanu niže. Naredbe grade `dist/`,
   provjeravaju ugovor obrazaca i dodaju `dist/release-manifest.json`
   (SHA-256 i veličina svake objavljive datoteke). Manifest je zapis releasea,
   ne tajni i ne commitira se.
2. Prije prve migracije verificiran kompletan backup trenutačnog `public_html`
   i `application`, uključujući privatne podatke, izvan javnog direktorija.
   Za kasnije rutinske objave dvije prethodne provjerene kodne verzije izvan
   javnog direktorija, uz zaseban zaštićeni backup privatnog backenda i podataka.
   Statički rollback ne prepisuje `application/data`.
3. SHA-256 manifest backupa i provjeren postupak vraćanja posljednje verzije.
4. Potvrđen PHP runtime, `curl`, `mbstring`, session, `upload_max_filesize` i
   `post_max_size` za produkcijski handler.
5. Potvrđena odluka o form bridgeu: za ovaj release zadržava se postojeći
   application bootstrap. Statični klijent na stvarnoj domeni uzima `/form-tokens`,
   šalje `/send` i vodi na postojeće thank-you rute. Ne uvoditi drugu
   implementaciju bez zasebne specifikacije.

## Produkcijski HTTPS + www paket

Pages preview ostaje na `https://dent-vitalis-web.pages.dev/`, bez dodanog `www`.
`www.dent-vitalis-web.pages.dev` nije adresa našeg Pages projekta i vraća
Cloudflareovu 404 stranicu. To se ne popravlja preusmjeravanjem u našem HTML-u.

Za produkciju postoji zasebna, lokalna naredba:

```bash
npm run release:prepare:production -- --legacy-htaccess /absolute/path/to/server-backup/.htaccess
```

Ulaz mora biti kopija stvarnog `public_html/.htaccess` iz server backupa,
izvan `dist/` i `public/`; server konfiguraciju ne commitati u Git. Naredba
uključuje production SEO režim, gradi web, provjerava ugovor forme, stavlja
HTTPS/www pravilo **ispred** sačuvanih legacy pravila te hashira sve zajedno
u release manifest. Bez ulaza odbija graditi paket. Ništa ne uploadira ni
objavljuje; postojeći GitHub stage workflow i `release:prepare` nisu ovom
dopunom pretvoreni u produkcijski deploy.

Pravilo koristi zajednički `productionOrigin`: oba produkcijska hosta na HTTP-u
i host bez `www` na HTTPS-u vode izravno na `https://www.dentvitalis.com`, bez
povratka na HTTP. Putanja i query parametri ostaju isti. Trajni status **308**
čuva i HTTP metodu/tijelo POST zahtjeva. Testni i nepoznati hostovi nisu zahvaćeni;
već ispravna HTTPS/www adresa nema novu redirekciju.

Legacy bajtovi ostaju iza našeg označenog bloka, osim izričito odobrenih
uklanjanja opisanih ispod. To nije dokaz da je
cjelokupni static/PHP bridge spreman: prije aktivacije treba pregledati stvarni
bootstrap, redoslijed ostalih pravila i postojeće Force HTTPS postavke na hostingu.
Testirati stvarni HTTPS status u Apacheu; ne vjerovati klijentskom
`X-Forwarded-Proto` zaglavlju. Ako hosting ima reverse proxy, prvo potvrditi kako
sigurno prenosi HTTPS status, inače postoji rizik redirect petlje.

Provjere: `npm run test:deployment`; stvarni Apache HTTP/TLS testovi u izoliranom
Dockeru: `npm run test:deployment:apache`. Ne šalju ništa klinici ni CRM-u.
URL migracije iz `data/redirects.csv` ostaju zasebne, neodobrene odluke.

### Dostavljena konfiguracija — 1. listopada 2026.

Vlasnik je dostavio tekst postojećeg `.htaccess`: 5.129 B, 67 redirekcija,
SHA-256 `ffe96dfc4c95363b3eb8a155e4b1da71b0aba5c4e92a2fd0e5e378b726d6fbd5`.
Prije instalacije usporediti dostavljenu kopiju sa stvarnom server datotekom.
Izvor ostaje izvan Gita i ne mijenja se. Vlasnik je zasebno odobrio uklanjanje
dviju istih redirekcija `/hr/iskustva-pacijenata` → `/hr/testimonials` samo iz
novog paketa, jer presreću novu odobrenu stranicu. Ostali bajtovi ostaju isti.
Odluka i broj dopuštenih uklanjanja nalaze se u `data/migration-readiness.json`.
Novi neodobreni `Redirect` koji presreće poznatu stranicu ili form handler
prekida pripremu paketa, umjesto da se tiho briše.

Stari `ExpiresDefault` dodavao je `max-age=604800` i odgovorima formi.
Naše pravilo zato isključuje `mod_expires` samo za četiri dinamičke form rute,
uz `no-store`; cache slika, fontova i ostalih datoteka nije ovom dopunom mijenjan.

Regression s dostavljenom konfiguracijom:

```bash
DENTVITALIS_LEGACY_HTACCESS=/absolute/path/to/server-backup/.htaccess npm run test:deployment:apache
```

Izolirani standardni Apache nema cPanel PHP handler ni mod_pagespeed: samo u
testnoj kopiji `ModPagespeed off` zamjenjuje se komentarom, a lažni `index.php`
poslužuje se kao tekst. Produkcijski paket zadržava oba serverska direktiva.
Ovaj test potvrđuje routing/cache, ne stvarni PHP runtime ili SMTP/CRM dostavu.
Deset starih odredišta nema novu statičku stranicu; njihov popis ostaje u
readiness podacima za pregled, bez automatskih novih 301/410 odluka.

## Form bridge acceptance

### Serverska dopuna prije aktivacije

1. Sačuvati i verificirati cijeli `public_html` i `application` izvan javnog
   direktorija. Ne arhivirati poruke u javni release niti slati tajne u GitHub.
2. Privatne dodatke iz `server/application/view/template/` postaviti u isti
   `application/view/template/` direktorij. U stvarni `/send` uključiti guard
   tek nakon usporedbe izvora i backupa; ne prepisivati cijeli handler.
3. Provjeriti `GET /form-tokens` bez slanja upita: JSON, postojeći session,
   ne-prazni CSRF/GCT, `no-store`, zabrana cross-site čitanja. Provjeriti
   instalirani hash i efektivne cookie postavke, bez zapisivanja tokena.
4. Potvrditi PHP 7.4/FPM i `curl`, `mbstring`, `session`, `openssl`, `fileinfo`.
   Lokalni PHP testovi nisu dokaz tog produkcijskog runtimea. Ne nadograđivati
   PHP usput bez zasebnog audita kompatibilnosti starog koda.
5. Provedba naših Apache pravila eksplicitno bira `index.html` prije očuvanog
   `index.php`, te `/send`, `/gct`, `/send-sconto` i `/form-tokens` šalje na PHP
   bootstrap bez static shadowinga i s `no-store` zaglavljem. `/send-sconto`
   privremeno ostaje sačuvan dok se ne potvrdi popis kampanja.
6. Tek uz zasebno odobrenje izvršiti stvarne testove dostave i rollback.
   `mail.test` i razvojni CRM hostovi nisu sami po sebi dokaz sigurnog testnog
   okruženja; prvo potvrditi vlasništvo i primatelje. Nikakav upit nije poslan
   ovom pripremom.

### CookieYes kroz postojeći GTM — odobreno 1. listopada 2026.

`TrackingBootstrap` učitava samo postojeći `GTM-K3QGWS`, i to samo na
`dentvitalis.com` / `www.dentvitalis.com`. Objavljeni GTM već sadrži CookieYes
za račun `d7e1f5db5a6fc013962bcb2d` i Consent Mode postavke. Po izričitoj
odluci vlasnika uklonjen je dodatni CookieYes loader iz novog weba. Ne dodavati
zasebne CookieYes, GA4 ili Ads skripte. Preview ne učitava ove integracije.
Mockirani browser test provjerava loader, ne potvrđuje stvarne privole ni
konverzije; to ostaje dio produkcijskog prihvata prije migracije.

### Thank-you adrese — provjera 1. listopada 2026.

Read-only pregled obuhvatio je 205 javnih odgovora: sitemap, linkane unutarnje
stranice i poznate kampanje. Potvrđeno je pet glavnih odredišta obrazaca:

| Jezik | Isti produkcijski URL                   | Izvorni obrasci                            |
| ----- | --------------------------------------- | ------------------------------------------ |
| IT    | `https://www.dentvitalis.com/grazie`    | Talijanske stranice; 40 pregledanih izvora |
| HR    | `https://www.dentvitalis.com/hr/hvala`  | Hrvatske stranice; 32 izvora               |
| DE    | `https://www.dentvitalis.com/de/dank`   | Njemačke stranice; 33 izvora               |
| EN    | `https://www.dentvitalis.com/en/thanks` | Engleske stranice; 33 izvora               |
| SI    | `https://www.dentvitalis.com/si/hvala`  | Slovenske stranice; 32 izvora              |

Javni GTM `GTM-K3QGWS`, objavljena verzija 94, sadrži **točne** Page Path
usporedbe tih pet adresa bez završnog `/`. Zato `thank-you-routes.ts` zajednički
definira odredišta formi. Vlasnik je zatim odobrio slashless URL-ove za sve
stranice. Postbuild prenosi sve generirane unutarnje HTML dokumente iz
directory outputa u `dist/_pages/`,
bez promjene bajtova. cPanel ih poslužuje internim rewriteom bez promjene browser
URL-a i bez DirectorySlash redirekcije. Build generira ista Pages proxy pravila
u `dist/_redirects`. Varijante sa završnim `/` vode na izvorni slashless URL.
Pages proxy odredište mora biti extensionless (`/_pages/hr/hvala`), dok Apache
koristi fizički dokument (`_pages/hr/hvala.html`). Inače Pages vraća dodatni
308 na internu adresu; ovaj rubni slučaj utvrđen je javnim HTTP auditom.
To ne dodaje zasebne conversion evente, GA4 ni Ads skripte.

`dist/page-routes.json` nastaje iz stvarnih build dokumenata i služi pripremi
istih cPanel pravila; ne smije se ručno održavati paralelan popis. Početni
`index.html`, `404.html` i asseti ostaju na svojim mjestima. Legacy `.htaccess`
dodaje se nakon našeg bloka uz samo zabilježena odobrena uklanjanja. PHP rute `/send` i
`/gct` nisu dio statičkog popisa i ostaju pod postojećim backend routerom.
Astro dev prihvaća obje varijante radi kompatibilnosti QA-a; stvarne 308
redirekcije provjeravaju se na Apache fixtureu i javnom Pages previewu.
Na Apacheu `RewriteOptions AllowNoSlash` i URI-ograničeni `DirectorySlash Off`
štite poznate statičke/uklonjene adrese čak i kada postoji stara fizička mapa.
Ostale direktorije i backend rute taj izuzetak ne zahvaća. Regresija uključuje
zaostale mape i potvrđuje da nepovezani legacy direktorij zadržava svoj 301.
Stariji `proposal-only` redirect izvještaji nisu aktivna konfiguracija; prije
migracije njihove sadržajne odluke i slashless odredišta treba ponovno potvrditi.

Pet Astro entry datoteka koristi jednu komponentu `ThankYouPage`, naše postojeće
stilove, layout i produkcijski tracking bootstrap. Potvrde su noindex i izvan
sitemapa; popup kontakt ostaje dostupan, bez drugog vidljivog inline obrasca.
Izvorni tekstovi, SHA-256 i odluke nalaze se u `data/thank-you-content.json`.
Vlasnik je odobrio njemački prijevod umjesto pogrešnog engleskog izvornog bodyja.

Pronađene su i dvije potvrde stare akcije, povezane iz
`/hr/registration-fb` i `/si/registracija-fb`. Vlasnik je izričito zatražio
**uklanjanje**, ne zamjenu: `/hr/hvala-akcija` i `/si/hvala-akcija` nemaju nove
HTML stranice niti preusmjeravanje na običnu potvrdu. Pages preview vraća 404,
a produkcijski cPanel blok vraća 410 Gone prije legacy fallbacka.
Ovaj rad ne briše ništa na sadašnjoj produkciji.

`form:preflight` odbija release bez svih pet potvrda i provjerava njihove
točne canonical putanje te noindex i success odredište svake forme.
Regresija `tests/thank-you.spec.ts` provjerava desktop/mobile, popup i pet
potpuno mockiranih submit → CSRF retry → success tokova. To nije dokaz stvarne
SMTP/CRM dostave ili Ads konverzije: prihvat stvarnih integracija ostaje prije
produkcijske objave, na način opisan niže.

### Legacy backend ugovor

Bridge mora omogućiti isti-origin tok bez izlaganja tajni klijentu:

1. `GET /form-tokens` vraća CSRF i GCT vezane uz isti postojeći server-side
   session. Legacy `/gct` ostaje radi starih potrošača.
2. Obrazac šalje `multipart/form-data` na `POST /send` s imenima polja:
   `name`, `email`, `phone`, `message`, `file`, `form_agreement`, `url`,
   `lang`, `csrf`, `gct`.
3. Poslužitelj vraća JSON: `status: ok` ili `status: error` s greškama po
   polju.
4. Uspjeh ide na IT `/grazie`, HR `/hr/hvala`, DE `/de/dank`, EN `/en/thanks`
   ili SI `/si/hvala`.

Klijent je namjerno aktivan samo pod `dentvitalis.com` ili
`www.dentvitalis.com`; razvojni/Pages preview ne dohvaća tokene niti može
poslati upit.

Za statični release nije dovoljno kopirati `send.phtml`: treba legacy
bootstrap, session, mail konfiguracija, PHPMailer, e-mail predložak, vendor i
lokalizacije. Točan `.htaccess` merge radi se tek uz kopiju postojećeg
`index.php` i dry-run na stagingu; ne zamjenjuje se generičkim pravilom.

## Kontrolirani test

- Ne koristiti podatke pacijenta. Stvarni upiti prema postojećim primateljima
  dopušteni su samo u izričito odobrenom, označenom sintetičkom testu.
- Vlasnik je odobrio najviše pet upita ukupno, po jedan za svaki jezik,
  uz bezopasni testni PDF.
  HR POST je izvršen jednom; inbox/CRM su potvrđeni, e-mail PDF otvoren.
  Vlasnik je potvrdio otvaranje CRM PDF-a. Ostali jezici naknadno su poslani
  po jednom i čekaju potvrdu primitka/privitaka. Svih pet odobrenih POST-ova
  je iskorišteno, ne ponavljati ih. Otvaranje nije provjera hasha.
- Legacy `test@example.com` aktivira testni e-mail primatelj i ne šalje CRM
  lead; time se provjerava frontend, tokeni i SMTP test.
- CRM zahtijeva potvrđeni testni endpoint ili eksplicitno odobren testni lead.
  Provjeriti HTTP odgovor i stvarni zapis, jer legacy handler ne vraća CRM/SMTP
  neuspjeh korisniku.
- Testirati svaki jezik, upload unutar stvarnog PHP limita, inbox, CRM, success
  rutu i rollback.

## Zabrane

- Ne commitati `local.php`, SMTP vjerodajnice, CRM ključ, logove ili mail spool.
- Ne objavljivati prije uspješnog rollback testa.
- Ne uklanjati postojeći form backend prije potvrđenog ekvivalenta.

## Kratki SEO/tracking prihvat — 2. listopada 2026.

Ovo je aktualni sažetak za vlasnika i SEO kolegu, ne odobrenje aktivacije.
Javni web nije mijenjan ovom provjerom i nije poslan novi POST. HR test je
potvrđen u CRM-u i e-mailu, uz otvoreni e-mail PDF i vlasničku potvrdu
otvaranja CRM PDF-a. Raniji redirect
prijedlozi nisu aktivna konfiguracija niti potvrda migracije svih URL-ova.

### Dosad provjereno

| Predmet                                                 | Dokaz i rezultat                                                                                                                                     | Granica dokaza                                                                                   |
| ------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| Produkcijski host/PHP routing i očuvanje starih pravila | `npm run test:deployment`: 5/5 prolazi; test stvarnog Apachea preskočen u ovom prolazu.                                                              | Nije runtime potvrda sadašnjeg cPanela ili buduće aktivacije.                                    |
| Putanje, canonical, slashless linkovi i sitemap         | `node --test scripts/page-routing.test.mjs`: 2/2 prolazi na postojećem lokalnom buildu, bez rebuilda.                                                | Ne provjerava HTTP odgovore produkcijskog servera ni sadržajnu ekvivalenciju starih URL-ova.     |
| Identitet paketa                                        | SHA-256 `bee2a78a94ff223a1e8c008f97886632b43d7de2fc6853a230d5de9432c19a1b`; 140 unutarnjih statičkih ruta, uz početni `index.html`.                  | Ispravljeni `-perms.zip` još nije potvrđen kao uploadan/raspakiran na serveru.                   |
| Tracking u stvarnom ZIP-u                               | Naslovnica sadrži `GTM-K3QGWS`, bez zasebne CookieYes ili GA/gtag script-src integracije; zajednički loader aktivan samo na produkcijskim hostovima. | Pregled koda, ne potvrda stvarnih consent događaja, kolačića ili mjerenja.                       |
| Naslijeđena redirect odredišta                          | Svih deset ranije zabilježenih odredišta i dalje nedostaje u statičkoj mapi ovog ZIP-a.                                                              | PHP fallback može odgovoriti; izostanak HTML-a nije sam po sebi dokaz 404 niti ispravne zamjene. |

Odredišta za ciljanu provjeru i sadržajnu odluku:

```text
/en/about-us
/alloggio
/hr/testimonials-edita-karadole-glumica
/hr/desinfekcija
/hr/testimonials-zoran-roje-sportski-direktor
/hr/technologija
/hr/klinicko-produzenje-krune-prirodnog-zuba
/hr/keramicki-most-na-prirodnim-zubima
/hr/testimonials
/hr/keramicki-most-na-svim-implantatima
```

### Sljedeći read-only zadatak za cPanel/browser agenta

1. Ne instalirati, preimenovati, brisati, aktivirati release ili mijenjati
   `.htaccess`, PHP, DNS, GTM ni CookieYes. Ne stvarati nove API/SSH pristupe.
   Ne slati forme, ne ponavljati HR upit i ne otvarati privatne poruke/tajne.
2. U File Manageru usporediti sadašnji `public_html/.htaccess` s prihvaćenom
   izvornom kopijom i pripremljenom release konfiguracijom. Zabilježiti
   eventualne nove/izmijenjene redirekcije, prioritete i konflikt s novim
   rutama. Dopuštene promjene slijede najnovije odobrene odluke na početku
   ovog runbooka i `data/seo/cpanel-redirect-decisions.json`.
   Stari nesigurni stage `20261001-af6dc28` nije paket za aktivaciju.
   Dvije ranije odobrene HR pojave i naknadno odobrena suprotna VR pojava
   uklanjaju se u novom kandidatu; odobreni aliasi imaju nove izravne ciljeve.
3. Običnim GET-om provjeriti deset navedenih odredišta na sadašnjem javnom
   webu: ulazni URL, status, lanac/konačni URL, title, canonical i jezik.
   Odvojiti postojeće ponašanje od očekivanog ponašanja novog releasea.
   Ako alat blokira pristup ili ne prikazuje statuse, označiti neprovjereno;
   ne zaobilaziti sigurnosnu blokadu niti zaključivati status iz izgleda.
4. Provjeriti HTTP/HTTPS i www/non-www te primjer sa slashom i bez slasha,
   uz neutralni query `?dv_migration_check=1` (ne reklamni UTM). Potvrditi
   očuvanje queryja i odsutnost petlje. To je baseline starog servera.
5. Izvještaj vratiti kao kratku tablicu: `provjera | očekivano | opaženo |
dokaz/datum | prolazi/ne prolazi/neprovjereno | sljedeći korak`. Bez
   cookie/token vrijednosti, tajni ili podataka pacijenata. Stani nakon
   jednog prolaza; ne popravljaj sadržajne odluke samostalno.

### Jedan zajednički prihvat novog weba, bez ponavljanja migracije

- Prije aktivacije: mapirati sve poznate stare URL-ove, ne samo deset gore.
  SEO kolega dopunjuje postojeći inventar važnim Search Console/backlink
  URL-ovima ako ima pristup. Svaki red dobiva odluku: ostaje, ekvivalentni
  301, prethodno odobreni 410 ili odluka vlasnika. Ne slati sve na naslovnicu.
- Na dostupnom, zasebno odobrenom stagingu s istim Apache pravilima ili u
  kontroliranom aktivacijskom prozoru: jedan GET prolaz kroz cijelu mapu,
  uz statuse, završne ciljeve, petlje/lance, query, canonical/hreflang,
  sitemap/robots, pravi 404 i odobrene 410. Privatna release mapa nije javni
  staging; njezin pregled ne dokazuje HTTP ponašanje budućeg weba.
- GTM/CookieYes: na novom produkcijskom webu provjeriti samo jedan loader
  istog kontejnera, početno consent stanje, odbijanje, prihvaćanje i promjenu
  izbora. U Tag Assistantu pratiti `analytics_storage`, `ad_storage`,
  `ad_user_data` i `ad_personalization`; provjeriti stvarne kolačiće i događaje
  prema postojećem basic/advanced režimu. Sama mrežna aktivnost prije privole
  nije dovoljna za zaključak: advanced mode može slati cookieless pingove.
- Pet thank-you adresa ostaje nepromijenjeno. Konverziju provjeriti tijekom
  već odobrenog sintetičkog toka nakon zatvaranja prethodnog inbox/PDF koraka,
  bez dodatnog HR ponavljanja ili ručnog stvaranja konverzija. GTM postavke
  ne objavljivati niti dodavati GA/Ads/CookieYes skripte radi testa.
- Završni izvještaj odvojeno označava lokalne provjere, server/browser
  dokaze i neprovjereno. Aktivaciju ne proglasiti uspješnom samo zbog 200
  naslovnice. Ako obvezne provjere ne prođu, upotrijebiti odobren postupak
  povratka javnog koda, bez vraćanja novih podataka/CRM-a starim backupom.

Metoda prati [Googleov migracijski postupak](https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes)
i [provjeru Consent Modea kroz Tag Assistant](https://developers.google.com/tag-platform/security/guides/consent-debugging).
