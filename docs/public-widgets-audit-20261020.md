# Javna provjera CookieYes i WhatsApp nakon V26

## Zaključak nakon potvrde vlasnika

Vlasnik je 20.10.2026. potvrdio da je učitavanje/prikaz WhatsAppa nakon
scrolla namjerno podešen u postojećoj integraciji plugina/GTM-a.
Odgođeni prikaz zato nije regresija ni razlog za uklanjanje lazy atributa.
V26 ostaje aktivan; nema naloga za promjenu GTM-a, CookieYesa, Elfsighta
ili načina učitavanja. Lokalni prijedlog uklanjanja lazy atributa povučen je
prije commita/objave. V27 ZIP nije izrađen niti poslan agentu.

## Provjereno na javnom webu

Provjera je rađena na `https://www.dentvitalis.com/` i `/hr`, ne na razvojnom
previewu. Ne-www korijen i `/hr` preusmjeravaju na HTTPS/www i vraćaju 200.
Javni manifest potvrđuje `20261020-enter-credit-v26` i source commit
`f78bdab00a4bcfb9d37997570885acddc494e492`. Svi zapisi javnog manifesta
odgovaraju V26 paketu. To nije zasebno ponovno hashiranje svih javnih HTML
odgovora; 142/142 server i backup hashova prijavio je cPanel agent.

Usporedba arhiviranih V24/V26 HTML datoteka: svih 141 skupova izvršnih
skripti (bez namjerno promijenjenog JSON-LD-a) i svih 141 WhatsApp embed
blokova identični su. V26 nije dodao, uklonio ni promijenio GTM/CMP/SDK loader.

Na čistom Chromium profilu, desktop 1440×1000:

- IT naslovnica vraća 200 i stvarni sadržaj, bez framework overlaya.
- CookieYes banner vidljiv je prije izbora, s Personalizza/Rifiuta tutto/
  Accettare tutto kontrolama; Elfsight loader tada nije prisutan.
- Nakon prihvaćanja banner se zatvara i CookieYes revisit ikona postaje
  vidljiva, bottom 15px. Otvaranje preference centra i zatvaranje rade.
- GTM, CookieYes, Elfsight platform i resursi widgeta uspješno se učitavaju
  (200; dio cacheiranih CookieYes resursa pri reloadu 304).
- U početnom pogledu bez scrolla WhatsApp u testu nije odmah bio vidljiv.
  Na HR stranici nakon scrolla do footera prikazan je stvarni zeleni gumb.
- Nakon inicijalizacije i povratka na vrh/resize na 390×844 vidi se WhatsApp
  uz CookieYes, oba iznad kontaktnog CTA-a. Novi hladni reload ponovno može
  čekati predviđeni scroll. To je u skladu s naknadno potvrđenom namjerom.

Elfsight renderira stvarni floating UI kroz otvoreni shadow DOM. Nulta visina
izvornog embed diva nije dokaz nedostupnosti chata; provjera mora obuhvatiti
vidljivi gumb i interakciju, ne samo div ili HTTP 200 platform.js skripte.

Nema zabilježenih pageerror iznimaka. Postoji od ranije zasebno upozorenje
Meta Pixela `1535263856724182 is unavailable`; nije mijenjano mjerenje niti
je to dokaz problema s CookieYes/WhatsAppom. Prekinuti analytics zahtjevi
tijekom reload/navigacije nisu tretirani kao greška tih widgeta.

## Odvojeni eksperiment koji nije objavljen

U vlastitom testnom browseru uklonjen je samo `data-elfsight-app-lazy`, bez
promjene javnog servera ili GTM-a. Taj A/B pokus pokazao je da atribut utječe
na vrijeme prikaza: chat se nakon privole pojavio bez scrolla. Prije privole
i nakon Odbij sve SDK/chat nisu se učitali.

Browser-only odgovor s tom jednom izmjenom prošao je deset provjera:
pet jezika × 1440/390px, stvarni GTM/CookieYes/Elfsight, vidljivi chat na
scrollY=0, otvaranje/zatvaranje s odgovarajućim jezičnim poljem, preference
centar i kontaktni popup. Mobilni razmak od CTA-a najmanje 20px. To je dokaz
učinka razmatrane izmjene, NE produkcijska promjena niti potvrda da je takva
izmjena potrebna. Nakon vlasnikove potvrde namjernog scrolla prijedlog je povučen.

Nisu slane web-forme, e-mailovi ni WhatsApp poruke. Prihvaćanje/odbijanje
privola obavljeno je isključivo u izoliranim testnim profilima; normalni CMP
i analytics zahtjevi mogli su nastati. Administrativne postavke nisu mijenjane.
Browser plugin/skill nije dostupan; korišten postojeći Playwright/Chromium.
Ovo nije provjera na fizičkom mobitelu ili svih postojećih korisničkih profila.

## Obvezna interpretacija sljedećih prihvata

1. Prije instalacije utvrditi trenutno očekivane privole i namjerne okidače
   widgeta. Ne proglasiti namjerno odgođen prikaz kvarom.
2. Na javnom hostu potvrditi CookieYes banner, revisit i preference open/close.
3. Nakon odgovarajuće privole i konfiguriranog scroll okidača potvrditi
   stvarni WhatsApp gumb i njegovo otvaranje/zatvaranje na desktopu/mobitelu.
4. Ne dodavati drugi SDK loader i ne zaobilaziti privolu radi testa.
5. Nemogućnost testnog preglednika prijaviti kao nepotvrđenu stavku,
   ne kao dokaz regresije. Backup cleanup odvojiti od pitanja rada widgeta.

Dobavljač opisuje lazy učitavanje kao odgodu do interakcije i zasebne
okidače otvaranja chata; ta dva mehanizma ne treba poistovjećivati:
[lazy loading](https://help.elfsight.com/article/1099-how-to-improve-pagespeed-score-of-a-page-with-our-widget),
[display i open-chat postavke](https://help.elfsight.com/article/1541-step-3-adjust-whatsapp-chats-triggers-and-display-settings).

Privremeni mrežni sažeci/snimke ostaju izvan Gita u `/tmp/`:
`dv-v26-public-widget-results.json`, `dv-v26-public-widget-cause.json`,
`dv-v27-live-preflight.json`, `dv-v26-public-it-desktop-after-accept.png`,
`dv-v26-public-hr-desktop-footer.png`, `dv-v26-public-hr-mobile.png`.
Naziv v27 u eksperimentalnom izvještaju nije objavljeni release.
