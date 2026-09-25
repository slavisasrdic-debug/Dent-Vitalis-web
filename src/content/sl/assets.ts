// Same accepted photographs and crops as HR, with Slovenian accessible descriptions.
const groups: [string[], string][] = [
  [
    ['Prima-visita-gratuita.webp'],
    'Prvi pregled v kliniki DentVitalis na Reki',
  ],
  [['Tempi-del-trattamento.webp'], 'Digitalni rentgenski posnetek zob'],
  [['Tempi-del-trattamento-3.webp'], 'Zdravljenje v kliniki DentVitalis'],
  [
    ['Pagamento-flessibile.webp', 'Pagamento-flessibile-4.webp'],
    'Pogovor o možnostih plačila v DentVitalisu',
  ],
  [
    ['Garanzie.webp'],
    'Zobozdravnik in pacient se pogovarjata o načrtu zdravljenja',
  ],
  [['Alloggio-hero-2600.webp'], 'Spalnica v nastanitvi klinike DentVitalis'],
  [['DV-cjenik.webp'], 'Cenik na recepciji klinike DentVitalis'],
  [['DV-cjenik-sl.webp'], 'Slovenski cenik na recepciji klinike DentVitalis'],
  [
    ['I-nostri-specialist-2i.webp', 'I-nostri-specialisti-mobile-2.webp'],
    'Dva zobozdravnika pregledujeta protetični izdelek v DentVitalisu',
  ],
  [
    ['Tutto-in-un-unico-luogo-1.webp', 'DV-44.webp'],
    'Ekipa DentVitalis s pacienti v čakalnici',
  ],
  [['Come-raggiungerci.webp'], 'Reka, lokacija klinike DentVitalis'],
  [['Laboratorio-odontotecnico.webp'], 'Zobotehnični laboratorij DentVitalis'],
  [
    ['Laboratorio-odontotecnico-1.webp'],
    'Zobotehnik pri delu v laboratoriju DentVitalis',
  ],
  [
    ['Materiali-e-apparecchiature-1.webp'],
    'Materiali in oprema klinike DentVitalis',
  ],
  [['Materiali-e-apparecchiature.webp'], 'Zobni vsadki najnovejše generacije'],
  [
    ['Sedazione-cosciente-1.webp', 'Sedazione-cosciente-mobile.webp'],
    'Pacientka med zdravljenjem v zavestni sedaciji',
  ],
  [
    ['ponte-fisso-su-impianti-2.webp', 'Dv-3.webp'],
    'Pacientka med zobozdravstvenim posegom v DentVitalisu',
  ],
  [
    [
      'Recenzija-detail-1.webp',
      'Recenzija-mobile.jpg',
      'image.webp',
      'Sbiancamento-dei-denti-3.webp',
    ],
    'Dve pacientki v kliniki DentVitalis na Reki',
  ],
  [['Dv-4-2.webp', 'Dv-4-1.webp'], 'Pacientka med zobozdravstvenim pregledom'],
  [['Sedazione.webp', 'Sedazione-mobile.webp'], 'Zavestna sedacija'],
  [
    ['Sbiancamento-dei-denti-2.webp', 'Sbiancamento-dei-denti-mobile.webp'],
    'Pacientka z zobozdravnico po beljenju zob',
  ],
  [['Contatti.webp'], 'Recepcija klinike DentVitalis na Reki'],
  [
    ['Domande-e-risposte-2.webp'],
    'Vprašanja in odgovori o kliniki DentVitalis',
  ],
  [
    ['Galleria-header-2600.webp'],
    'Primerjava pred zobozdravstvenim zdravljenjem in po njem',
  ],
  [['DV-Dr-Sime-Zivkocic-4.webp'], 'Šime Živković, dr. med. dent.'],
  [['Zvonimir-Zivkovic.webp'], 'Zvonimir Živković, dr. med. dent.'],
  [['Zoran-Jurković-dr.med.dent..jpg'], 'Zoran Jurković, dr. med. dent.'],
  [
    ['Ana-Beljan-dr.med.dent.webp'],
    'Ana Beljan, dr. med. dent. / inž. radiologije',
  ],
  [['Domagoj-Žalac-dr.med.dent..webp'], 'Domagoj Žalac, dr. med. dent.'],
];
export function alt(image: string): string {
  const description = groups.find(([images]) => images.includes(image))?.[1];
  if (!description)
    throw new Error(`Missing Slovenian photo description: ${image}`);
  return description;
}
