import type { ClinicData } from './models';

/**
 * Potvrđene vrijednosti dodaju se tek nakon provjere izvora.
 * Nullable polja sprječavaju objavu izmišljenih podataka i placeholdera.
 */
export const clinic: Readonly<ClinicData> = {
  legalName: null,
  contact: {
    email: null,
    phone: null,
    whatsapp: null,
    address: null,
    mapUrl: null,
  },
};
