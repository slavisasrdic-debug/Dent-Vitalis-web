// Same accepted photographs and crops as HR, with English accessible descriptions.
const groups: [string[], string][] = [
  [
    ['Prima-visita-gratuita.webp'],
    'Initial consultation at the DentVitalis clinic in Rijeka',
  ],
  [['Tempi-del-trattamento.webp'], 'Digital dental X-ray'],
  [['Tempi-del-trattamento-3.webp'], 'Treatment at the DentVitalis clinic'],
  [
    ['Pagamento-flessibile.webp', 'Pagamento-flessibile-4.webp'],
    'Discussing payment options at DentVitalis',
  ],
  [['Garanzie.webp'], 'Dentist and patient discussing the treatment plan'],
  [
    ['Alloggio-hero-2600.webp'],
    'Bedroom in the accommodation at the DentVitalis clinic',
  ],
  [['DV-cjenik.webp'], 'Price list at the DentVitalis clinic reception'],
  [
    ['I-nostri-specialist-2i.webp', 'I-nostri-specialisti-mobile-2.webp'],
    'Two dentists examining a dental restoration at DentVitalis',
  ],
  [
    ['Tutto-in-un-unico-luogo-1.webp', 'DV-44.webp'],
    'The DentVitalis team with patients in the waiting area',
  ],
  [['Come-raggiungerci.webp'], 'Rijeka, location of the DentVitalis clinic'],
  [['Laboratorio-odontotecnico.webp'], 'The DentVitalis dental laboratory'],
  [
    ['Laboratorio-odontotecnico-1.webp'],
    'Dental technician working in the DentVitalis laboratory',
  ],
  [
    ['Materiali-e-apparecchiature-1.webp'],
    'Materials and equipment at the DentVitalis clinic',
  ],
  [['Materiali-e-apparecchiature.webp'], 'Latest-generation implants'],
  [
    ['Sedazione-cosciente-1.webp', 'Sedazione-cosciente-mobile.webp'],
    'Patient receiving treatment under conscious sedation',
  ],
  [
    ['ponte-fisso-su-impianti-2.webp', 'Dv-3.webp'],
    'Patient receiving dental treatment at DentVitalis',
  ],
  [
    [
      'Recenzija-detail-1.webp',
      'Recenzija-mobile.jpg',
      'image.webp',
      'Sbiancamento-dei-denti-3.webp',
    ],
    'Two patients at the DentVitalis clinic in Rijeka',
  ],
  [['Dv-4-2.webp', 'Dv-4-1.webp'], 'Patient during a dental examination'],
  [['Sedazione.webp', 'Sedazione-mobile.webp'], 'Conscious sedation'],
  [
    ['Sbiancamento-dei-denti-2.webp', 'Sbiancamento-dei-denti-mobile.webp'],
    'Patient with her dentist after teeth whitening',
  ],
  [['Contatti.webp'], 'Reception at the DentVitalis clinic in Rijeka'],
  [
    ['Domande-e-risposte-2.webp'],
    'Questions and answers about the DentVitalis clinic',
  ],
  [
    ['Galleria-header-2600.webp'],
    'Before-and-after dental treatment comparison',
  ],
  [['DV-Dr-Sime-Zivkocic-4.webp'], 'Šime Živković, DMD'],
  [['Zvonimir-Zivkovic.webp'], 'Zvonimir Živković, DMD'],
  [['Zoran-Jurković-dr.med.dent..jpg'], 'Zoran Jurković, DMD'],
  [['Ana-Beljan-dr.med.dent.webp'], 'Ana Beljan, DMD / Radiographer'],
  [['Domagoj-Žalac-dr.med.dent..webp'], 'Domagoj Žalac, DMD'],
];
export function alt(image: string): string {
  const description = groups.find(([images]) => images.includes(image))?.[1];
  if (!description)
    throw new Error(`Missing English photo description: ${image}`);
  return description;
}
