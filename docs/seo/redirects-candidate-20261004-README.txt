DENTVITALIS - POPIS REDIREKCIJA ZA SEO PREGLED
Datum: 4. listopada 2026.

IZVOR I GRANICA DOKAZA
Paket: dentvitalis-web-production-candidate-20261001-af6dc28-perms.zip
SHA-256 ZIP-a: bee2a78a94ff223a1e8c008f97886632b43d7de2fc6853a230d5de9432c19a1b
SHA-256 .htaccess: 9fb7ac6fe504ea68f32a65ab8d3a761c3e2584386a2e10129a9b417aa42bf7cf
Ovo je PRIPREMLJENI KANDIDAT, ne dokaz aktivacije novog weba.
CSV nije deploy konfiguracija i ne ucitava se u aplikaciju.
Nije bilo novih GET/POST audita ni izmjena cPanela pri ovom izvozu.
HTTP stupac = status u kodu, NE izmjereni odgovor; runtime_provjeren = ne.

CSV SADRZI 214 REDAKA (BEZ ZAGLAVLJA)
65 naslijedjenih Redirect 301 zapisa, ukljucujuci duplikate.
140 konkretnih normalizacija zavrsnog slasha na unutarnjim stranicama (308).
3 obrasca canonical hosta (HTTP/non-www -> HTTPS/www, 308).
2 sacuvana naslijedjena host RewriteRule pravila (302 i 301).
2 uklanjanja s 410 Gone - to NISU redirekcije.
2 odobrene izbrisane pojave starog HR pravila - NEAKTIVNE.
Korijen / zadrzava slash. Interni rewrites na _pages/index.php nisu
redirekcije. PHP /send, /gct, /send-sconto, /form-tokens ostaju dinamicki.
Host pravilo pokriva dentvitalis.com i www varijante (case-insensitive
ulaz, opcionalni port); CSV prikazuje tri osnovna ulazna obrasca.

VAZNO
- Apache Redirect je prefiksno pravilo, ne samo jedan tocni URL; ostatak
  putanje prenosi se na cilj. Provjeriti i /sl i /sl/ te podputanje.
- KONFLIKT: /vr_tour_eng.htm ima dva razlicita cilja: / i /en.
  Nismo birali zamjenu ili brisali pravila; treba odluka/runtime provjera.
- Izvorni redoslijed i duplikati su sacuvani: 67 izvornih zapisa minus
  dvije odobrene pojave /hr/iskustva-pacijenata -> /hr/testimonials = 65.
- Novi canonical 308 prethodi starim host pravilima; stari 302/301 nisu
  preporucena nova shema. Host + slash + legacy mogu dati vise koraka.
- Staticki cilj nije dokaz sadrzajne ekvivalencije; nedostatak statickog
  HTML-a nije dokaz 404, jer postoji PHP fallback. Query/UTM treba izmjeriti.

NASLIJEDJENA ODREDISTA BEZ NOVOG STATICKOG HTML-a (9)
https://www.dentvitalis.com/en/about-us
https://www.dentvitalis.com/alloggio
https://www.dentvitalis.com/hr/testimonials-edita-karadole-glumica
https://www.dentvitalis.com/hr/desinfekcija
https://www.dentvitalis.com/hr/testimonials-zoran-roje-sportski-direktor
https://www.dentvitalis.com/hr/technologija
https://www.dentvitalis.com/hr/klinicko-produzenje-krune-prirodnog-zuba
https://www.dentvitalis.com/hr/keramicki-most-na-prirodnim-zubima
https://www.dentvitalis.com/hr/keramicki-most-na-svim-implantatima
/hr/testimonials je u ranijem popisu deset rizika; nakon uklanjanja dvaju
odobrenih HR pravila vise nije cilj sacuvanih redirekcija u ovom CSV-u.

SEO MASTER - PRIJE AKTIVACIJE
Usporediti inventar svih 206 poznatih URL-ova (data/seo/url-inventory.json),
uz vazne Search Console/backlink adrese. data/redirects.csv je raniji
PROPOSAL-ONLY prijedlog, NE popis svih odobrenih/aktivnih pravila.
Za svaki URL: ostaje; ekvivalentni 301; odobreni 410; ili otvorena odluka.
Ne preusmjeravati automatski sve stare URL-ove na naslovnicu.
Runtime provjera: status, Location, lanac/petlja, konacni URL, query,
sadrzaj/jezik cilja, canonical/hreflang, sitemap/robots i stvarni 404/410.
Ne mijenjati sadrzajne ciljeve/rute prije potvrde vlasnika.
GTM-K3QGWS/CookieYes imaju zaseban runtime prihvat; CSV nije dokaz
consent stanja ili konverzija. Izvoz ne mijenja release niti produkciju.
