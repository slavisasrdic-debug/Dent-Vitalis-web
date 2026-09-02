import { expect, test } from '@playwright/test';

import { localeCodes, localeRoots } from '../data/models';
import { clinic } from '../data/site';

test('keeps the approved public locale roots stable', () => {
  expect(localeCodes).toEqual(['it', 'hr', 'de', 'en', 'si']);
  expect(localeRoots).toEqual({
    it: '/',
    hr: '/hr/',
    de: '/de/',
    en: '/en/',
    si: '/si/',
  });
});

test('does not ship an unverified WhatsApp placeholder', () => {
  expect(clinic.contact.whatsapp).toBeNull();
});
