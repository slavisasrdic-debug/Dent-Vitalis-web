// Same accepted photographs and crops as HR, with German accessible descriptions.
const groups: [string[], string][] = [
  [
    ['Prima-visita-gratuita.webp'],
    'Erstuntersuchung in der DentVitalis Klinik in Rijeka',
  ],
  [['Tempi-del-trattamento.webp'], 'Digitale Röntgenaufnahme der Zähne'],
  [['Tempi-del-trattamento-3.webp'], 'Behandlung in der DentVitalis Klinik'],
  [
    ['Pagamento-flessibile.webp', 'Pagamento-flessibile-4.webp'],
    'Beratung zu den Zahlungsmöglichkeiten bei DentVitalis',
  ],
  [['Garanzie.webp'], 'Zahnarzt und Patient besprechen den Behandlungsplan'],
  [
    ['Alloggio-hero-2600.webp'],
    'Schlafzimmer in der Unterkunft der DentVitalis Klinik',
  ],
  [['DV-cjenik.webp'], 'Preisliste an der Rezeption der DentVitalis Klinik'],
  [
    ['I-nostri-specialist-2i.webp', 'I-nostri-specialisti-mobile-2.webp'],
    'Zwei Zahnärzte begutachten einen Zahnersatz bei DentVitalis',
  ],
  [
    ['Tutto-in-un-unico-luogo-1.webp', 'DV-44.webp'],
    'Das DentVitalis Team mit Patienten im Wartebereich',
  ],
  [['Come-raggiungerci.webp'], 'Rijeka, Standort der DentVitalis Klinik'],
  [['Laboratorio-odontotecnico.webp'], 'Das Dentallabor von DentVitalis'],
  [
    ['Laboratorio-odontotecnico-1.webp'],
    'Zahntechnikerin bei der Arbeit im DentVitalis Labor',
  ],
  [
    ['Materiali-e-apparecchiature-1.webp'],
    'Materialien und Ausstattung der DentVitalis Klinik',
  ],
  [['Materiali-e-apparecchiature.webp'], 'Implantate der neuesten Generation'],
  [
    ['Sedazione-cosciente-1.webp', 'Sedazione-cosciente-mobile.webp'],
    'Patient während einer Behandlung unter bewusster Sedierung',
  ],
  [
    ['ponte-fisso-su-impianti-2.webp', 'Dv-3.webp'],
    'Patient während einer zahnmedizinischen Behandlung bei DentVitalis',
  ],
  [
    [
      'Recenzija-detail-1.webp',
      'Recenzija-mobile.jpg',
      'image.webp',
      'Sbiancamento-dei-denti-3.webp',
    ],
    'Zwei Patienten in der DentVitalis Klinik in Rijeka',
  ],
  [
    ['Dv-4-2.webp', 'Dv-4-1.webp'],
    'Patient während einer zahnmedizinischen Untersuchung',
  ],
  [['Sedazione.webp', 'Sedazione-mobile.webp'], 'Bewusste Sedierung'],
  [
    ['Sbiancamento-dei-denti-2.webp', 'Sbiancamento-dei-denti-mobile.webp'],
    'Patientin mit ihrem Zahnarzt nach der Zahnaufhellung',
  ],
  [['Contatti.webp'], 'Rezeption der DentVitalis Klinik in Rijeka'],
  [
    ['Domande-e-risposte-2.webp'],
    'Fragen und Antworten zur DentVitalis Klinik',
  ],
  [
    ['Galleria-header-2600.webp'],
    'Zahnmedizinische Behandlungen im Vorher-Nachher-Vergleich',
  ],
  [['DV-Dr-Sime-Zivkocic-4.webp'], 'Dr. med. dent. Šime Živković'],
  [['Zvonimir-Zivkovic.webp'], 'Dr. med. dent. Zvonimir Živković'],
  [['Zoran-Jurković-dr.med.dent..jpg'], 'Dr. med. dent. Zoran Jurković'],
  [
    ['Ana-Beljan-dr.med.dent.webp'],
    'Dr. med. dent. / Dipl.-Ing. Radiologie Ana Beljan',
  ],
  [['Domagoj-Žalac-dr.med.dent..webp'], 'Dr. med. dent. Domagoj Žalac'],
];
export function alt(image: string): string {
  const description = groups.find(([images]) => images.includes(image))?.[1];
  if (!description)
    throw new Error(`Missing German photo description: ${image}`);
  return description;
}
