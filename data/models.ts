import type { Thing, WithContext } from 'schema-dts';

export const localeCodes = ['it', 'hr', 'de', 'en', 'si'] as const;
export type LocaleCode = (typeof localeCodes)[number];

export const localeRoots: Readonly<Record<LocaleCode, string>> = {
  it: '/',
  hr: '/hr/',
  de: '/de/',
  en: '/en/',
  si: '/si/',
};

export type TranslationStatus = 'missing' | 'draft' | 'review' | 'published';

export interface LocalizedValue<T> {
  locale: LocaleCode;
  status: TranslationStatus;
  value: T | null;
}

export interface ContactDetails {
  email: string | null;
  phone: string | null;
  whatsapp: string | null;
  address: string | null;
  mapUrl: string | null;
}

export interface ClinicData {
  legalName: string | null;
  contact: ContactDetails;
}

export interface PageSeoData {
  title: string;
  description: string;
  canonicalPath: string;
  socialImage: string;
  indexable: boolean;
}

export interface ContentRecord<T> {
  id: string;
  translations: LocalizedValue<T>[];
  lastModified: string | null;
  authorId: string | null;
  medicalReviewerId: string | null;
  sourceIds: string[];
}

export type JsonLd = WithContext<Thing>;
