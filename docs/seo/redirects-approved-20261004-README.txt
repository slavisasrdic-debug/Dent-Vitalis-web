DENTVITALIS - ODOBRENE REDIREKCIJE, 4. LISTOPADA 2026.

AKTUALNI NOVI PAKET: dentvitalis-web-production-candidate-20261004-redirects-v2.zip
SHA-256: 3e0ee5496a3379f56df1daf98a061e60bb06a699f5f6a642c528f7091cec9ba4
Routing commit: ac0b3ba5f5999287d5f0e0e62c76fb1785696ed8
Sadrzaj/forme/mediji: nepromijenjeni af6dc2881c2f0ec09672764a2a52b83b675a61a3.
Ovaj CSV zamjenjuje raniji redirects-candidate-20261004.csv za NOVI paket.
Stari CSV ostaje povijesni snapshot prethodnog ZIP-a.

STO JE ODOBRENO I IMPLEMENTIRANO LOKALNO
Sest novih 301 starih ciljeva i izravni ciljevi njihovih postojecih aliasa.
VR /vr_tour_eng.htm vodi samo na /en; suprotna pojava uklonjena.
Edita/Zoran: sada postojece stranice vracaju 404. Vlasnik je odobrio zbirku
iskustava kao zamjenu; pojedinacna svjedocanstva nisu na novoj stranici.
Tri stranice ostaju kroz postojeci PHP, bez 301 na nepotpunu zamjenu:
/hr/desinfekcija
/hr/klinicko-produzenje-krune-prirodnog-zuba
/hr/keramicki-most-na-svim-implantatima
Njihov stari produkcijski GET je 200; novi PHP fallback prolazi izolirani
Apache fixture, ali stvarni PHP/HTTP prihvat nakon aktivacije tek slijedi.

CSV (220 REDAKA BEZ ZAGLAVLJA)
64 sacuvana Redirect 301 retka, ukljucujuci osam retargetiranih pojava
za sedam jedinstvenih aliasa i preostale nepromijenjene duplikate.
6 novih tocnih 301 pravila za stare ciljeve (opcionalni slash).
140 normalizacija zavrsnog slasha 308 (korijen / je izuzet).
3 obrasca canonical hosta 308 (HTTP/non-www -> HTTPS/www).
2 sacuvana naslijedjena host pravila (302/301, novi canonical ima prednost).
2 vlasnicki odobrena 410 - NISU redirekcije.
3 uklonjene pojave - NEAKTIVNE (dvije HR i jedna suprotna VR).
Interni rewrite na _pages i index.php nije redirekcija.
Apache Redirect retci su prefiksna pravila, ne iskljucivo tocni URL-ovi.

PROVJERE I GRANICE
27/27 ciljanih provjera prolazi, ukljucujuci stvarni izolirani Apache
sa supplied original .htaccess. Novi 301, aliasi, konacni 200, query,
vr-tour i tri PHP fallback rute prolaze lokalno. CSV HTTP stupac je status
u konfiguraciji; runtime_produkcije_novog_paketa_provjeren = ne.
Paket NIJE uploadan/aktiviran. public_html, application, DNS i GTM nisu dirani.
Lokalni Extract: 692 datoteke 0644 i 13 mapa 0755. CRC prolazi.
Promijenjeni samo .htaccess i manifest; ostalih 690 payload zapisa identicno.
Prvi Apache startup imao je ECONNRESET, uzrok nije utvrdjen; dijagnosticki
ponovljeni test i zavrsni zajednicki prolaz zatim prolaze.

OSTAJE PRIJE PRIHVATA MIGRACIJE
CSV je potpuni popis pravila OVOG ZIP-a, ne dokaz odluke za svih 206 poznatih
starih URL-ova. data/redirects.csv i dalje je proposal-only, ne deploy ulaz.
Provjeriti ostatak inventara/bitne Search Console i backlink adrese.
Na cPanelu nakon zasebnog odobrenja: integritet i dozvole Extracta, PHP rute,
statusi/Location, lanci/petlje, query, canonical/hreflang, sitemap/robots,
404/410 te GTM/CookieYes i konverzije. Backup/rollback ne prepisuje nove
application/data ili CRM podatke. Preostale CRM/PDF potvrde jos nisu dobivene.
Jedina procedura: docs/cpanel-migration-runbook.md.
