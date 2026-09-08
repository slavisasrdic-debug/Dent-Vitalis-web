// Croatian descriptions of the accepted photo inventory. Files/crops are shared;
// patient identities and outcomes are never inferred from a filename.
const descriptions: Record<string, string> = {
  'Prima-visita-gratuita.webp':
    'Prvi stomatološki pregled u klinici DentVitalis u Rijeci',
  'Tempi-del-trattamento.webp':
    'Digitalna rendgenska snimka zuba u klinici DentVitalis',
  'Tempi-del-trattamento-3.webp': 'Trajanje liječenja u klinici DentVitalis',
  'Pagamento-flessibile.webp':
    'Savjetovanje pacijentice o mogućnostima plaćanja',
  'Pagamento-flessibile-4.webp': 'Fleksibilno plaćanje u klinici DentVitalis',
  'Garanzie.webp': 'Stomatolog i pacijent pregledavaju plan liječenja',
  'Alloggio-hero-2600.webp': 'Spavaća soba u smještaju klinike DentVitalis',
  'DV-cjenik.webp': 'Cjenik na recepciji klinike DentVitalis u Rijeci',
  'I-nostri-specialist-2i.webp':
    'Dva stomatologa pregledavaju zubnu protezu u klinici DentVitalis',
  'I-nostri-specialisti-mobile-2.webp':
    'Dva stomatologa pregledavaju zubnu protezu u klinici DentVitalis',
  'Tutto-in-un-unico-luogo-1.webp':
    'Tim DentVitalisa s pacijentima u čekaonici klinike',
  'DV-44.webp': 'Tim DentVitalisa s pacijentima u čekaonici klinike',
  'Come-raggiungerci.webp': 'Rijeka, sjedište klinike DentVitalis',
  'Laboratorio-odontotecnico.webp': 'Dentalni laboratorij DentVitalis',
  'Laboratorio-odontotecnico-1.webp':
    'Dentalna tehničarka na radu u laboratoriju DentVitalis',
  'Materiali-e-apparecchiature-1.webp':
    'Materijali i oprema u klinici DentVitalis',
  'Materiali-e-apparecchiature.webp': 'Implantati nove generacije',
  'Sedazione-cosciente-1.webp': 'Pacijent tijekom zahvata uz svjesnu sedaciju',
  'Sedazione-cosciente-mobile.webp':
    'Pacijent tijekom zahvata uz svjesnu sedaciju',
  'ponte-fisso-su-impianti-2.webp':
    'Pacijent tijekom zahvata za fiksni most na implantatima',
  'Dv-3.webp': 'Pacijent tijekom stomatološkog zahvata u klinici DentVitalis',
  'Recenzija-detail-1.webp': 'Dva pacijenta u klinici DentVitalis u Rijeci',
  'Recenzija-mobile.jpg': 'Dva pacijenta u klinici DentVitalis u Rijeci',
  'image.webp': 'Dva pacijenta u klinici DentVitalis u Rijeci',
  'Dv-4-2.webp':
    'Pacijent tijekom stomatološkog pregleda u klinici DentVitalis',
  'Dv-4-1.webp':
    'Pacijent tijekom stomatološkog pregleda u klinici DentVitalis',
  'Sedazione.webp': 'Svjesna sedacija',
  'Sedazione-mobile.webp': 'Svjesna sedacija',
  'Sbiancamento-dei-denti-3.webp':
    'Dva pacijenta u klinici DentVitalis u Rijeci',
  'Sbiancamento-dei-denti-2.webp':
    'Pacijentica sa stomatologom nakon izbjeljivanja zuba',
  'Sbiancamento-dei-denti-mobile.webp':
    'Pacijentica sa stomatologom nakon izbjeljivanja zuba',
  'Contatti.webp': 'Recepcija klinike DentVitalis u Rijeci',
  'Domande-e-risposte-2.webp': 'Pitanja i odgovori o klinici DentVitalis',
  'Galleria-header-2600.webp': 'Galerija stomatoloških zahvata prije i poslije',
  'DV-Dr-Sime-Zivkocic-4.webp': 'Šime Živković, dr.med.dent.',
  'Zvonimir-Zivkovic.webp': 'Zvonimir Živković, dr.med.dent.',
  'Zoran-Jurković-dr.med.dent..jpg': 'Zoran Jurković, dr.med.dent.',
  'Ana-Beljan-dr.med.dent.webp': 'Ana Beljan, dr.med.dent. / Ing. radiologije',
  'Domagoj-Žalac-dr.med.dent..webp': 'Domagoj Žalac, dr.med.dent.',
};
export function alt(image: string): string {
  if (!(image in descriptions))
    throw new Error(`Missing Croatian photo description: ${image}`);
  return descriptions[image]!;
}
