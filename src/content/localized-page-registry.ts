export type NewLocale = 'de' | 'en' | 'sl';

export interface LocalizedPageSource {
  route: string;
  sourceTable: string;
  sourceMarker: string;
  family: 'service' | 'about' | 'information' | 'collection' | 'legal';
}

/**
 * The route contract for the supplied translations. Content adapters consume
 * this registry instead of inferring routes from paragraph order.
 */
export const localizedPageRegistry: Record<
  NewLocale,
  LocalizedPageSource[]
> = {
  de: [
    { route: 'four-implant-denture', sourceTable: 't2', sourceMarker: 'p4', family: 'service' },
    { route: 'fixed-implant-bridge', sourceTable: 't3', sourceMarker: 'p16', family: 'service' },
    { route: 'whitening', sourceTable: 't4', sourceMarker: 'p26', family: 'service' },
    { route: 'crowns-veneers-bridges', sourceTable: 't5', sourceMarker: 'p38', family: 'service' },
    { route: 'specialists', sourceTable: 't6', sourceMarker: 'p17', family: 'about' },
    { route: 'all-in-one', sourceTable: 't7', sourceMarker: 'p26', family: 'about' },
    { route: 'directions', sourceTable: 't8', sourceMarker: 'p31', family: 'about' },
    { route: 'laboratory', sourceTable: 't9', sourceMarker: 'p38', family: 'about' },
    { route: 'materials', sourceTable: 't10', sourceMarker: 'p45', family: 'about' },
    { route: 'new-implants', sourceTable: 't11', sourceMarker: 'p49', family: 'about' },
    { route: 'first-visit', sourceTable: 't13', sourceMarker: 'p66', family: 'information' },
    { route: 'treatment-duration', sourceTable: 't14', sourceMarker: 'p71', family: 'information' },
    { route: 'payment', sourceTable: 't15', sourceMarker: 'p75', family: 'information' },
    { route: 'guarantees', sourceTable: 't16', sourceMarker: 'p81', family: 'information' },
    { route: 'accommodation', sourceTable: 't17', sourceMarker: 'p87', family: 'information' },
  ],
  en: [
    { route: 'four-implant-denture', sourceTable: 't2', sourceMarker: 'p3', family: 'service' },
    { route: 'fixed-implant-bridge', sourceTable: 't3', sourceMarker: 'p16', family: 'service' },
    { route: 'whitening', sourceTable: 't4', sourceMarker: 'p27', family: 'service' },
    { route: 'crowns-veneers-bridges', sourceTable: 't5', sourceMarker: 'p39', family: 'service' },
    { route: 'specialists', sourceTable: 't6', sourceMarker: 'p17', family: 'about' },
    { route: 'all-in-one', sourceTable: 't7', sourceMarker: 'p27', family: 'about' },
    { route: 'directions', sourceTable: 't8', sourceMarker: 'p32', family: 'about' },
    { route: 'laboratory', sourceTable: 't9', sourceMarker: 'p39', family: 'about' },
    { route: 'materials', sourceTable: 't10', sourceMarker: 'p46', family: 'about' },
    { route: 'new-implants', sourceTable: 't11', sourceMarker: 'p51', family: 'about' },
    { route: 'first-visit', sourceTable: 't13', sourceMarker: 'p69', family: 'information' },
    { route: 'treatment-duration', sourceTable: 't14', sourceMarker: 'p75', family: 'information' },
    { route: 'payment', sourceTable: 't15', sourceMarker: 'p80', family: 'information' },
    { route: 'guarantees', sourceTable: 't16', sourceMarker: 'p86', family: 'information' },
    { route: 'accommodation', sourceTable: 't17', sourceMarker: 'p92', family: 'information' },
  ],
  sl: [
    { route: 'four-implant-denture', sourceTable: 't2', sourceMarker: 'p3', family: 'service' },
    { route: 'fixed-implant-bridge', sourceTable: 't3', sourceMarker: 'p17', family: 'service' },
    { route: 'whitening', sourceTable: 't4', sourceMarker: 'p26', family: 'service' },
    { route: 'crowns-veneers-bridges', sourceTable: 't5', sourceMarker: 'p38', family: 'service' },
    { route: 'specialists', sourceTable: 't6', sourceMarker: 'p18', family: 'about' },
    { route: 'all-in-one', sourceTable: 't7', sourceMarker: 'p26', family: 'about' },
    { route: 'directions', sourceTable: 't8', sourceMarker: 'p31', family: 'about' },
    { route: 'laboratory', sourceTable: 't9', sourceMarker: 'p38', family: 'about' },
    { route: 'materials', sourceTable: 't10', sourceMarker: 'p45', family: 'about' },
    { route: 'new-implants', sourceTable: 't11', sourceMarker: 'p50', family: 'about' },
    { route: 'first-visit', sourceTable: 't13', sourceMarker: 'p68', family: 'information' },
    { route: 'treatment-duration', sourceTable: 't14', sourceMarker: 'p74', family: 'information' },
    { route: 'payment', sourceTable: 't15', sourceMarker: 'p79', family: 'information' },
    { route: 'guarantees', sourceTable: 't16', sourceMarker: 'p85', family: 'information' },
    { route: 'accommodation', sourceTable: 't17', sourceMarker: 'p91', family: 'information' },
  ],
};
