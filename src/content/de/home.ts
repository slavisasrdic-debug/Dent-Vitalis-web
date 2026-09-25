import {
  home as itHome,
  services as itServices,
  aboutCards as itAbout,
} from '../home';
import { t, faq } from './source';
import { route } from './routes';
import { alt } from './assets';
import { ui } from '../ui';
import { withAccentedPhrase } from '../home-heading-accent';

export const home = {
  ...itHome,
  metadata: {
    title: 'DentVitalis – Zahnärzte in Kroatien',
    description: t(1, 6, 4)
      .split(/(?<=[.!?])\s+/)
      .slice(0, 2)
      .join(' '),
  },
  translations: {
    it: 'review',
    hr: 'review',
    de: 'review',
    en: 'missing',
    si: 'missing',
  },
  hero: {
    ...itHome.hero,
    eyebrowAccent: 'Premium-Paket',
    eyebrow: t(1, 0, 0).replace('Premium-Paket ', ''),
    title: t(1, 0, 2).split(',').slice(1).join(',').trim(),
    pricePrefix: 'Festpreis von',
    priceText: t(1, 0, 2).split(',')[0]!,
    href: route('fixed-implant-bridge'),
    cta: t(1, 0, 11),
    ratingAlt: ui('de').rating,
  },
  benefits: [4, 5, 6, 7, 8, 9].map((p) => t(1, 0, p)),
  intro: {
    eyebrow: t(1, 1, 1),
    title: t(1, 1, 3).split(' ').slice(2).join(' '),
    accent: t(1, 1, 3).split(' ').slice(0, 2).join(' '),
    description: t(1, 1, 4),
  },
  about: {
    eyebrow: t(1, 7, 0),
    ...withAccentedPhrase(t(1, 7, 2), 'Fachkompetenz'),
    description: t(1, 7, 3),
  },
  testimonials: {
    eyebrow: t(1, 8, 0),
    ...withAccentedPhrase(t(1, 8, 2), 'Vertrauen'),
    description: t(1, 8, 4),
  },
  testimonialPhoto: {
    ...itHome.testimonialPhoto,
    alt: alt(itHome.testimonialPhoto.desktop),
  },
  testimonialActions: [
    { href: route('testimonials'), label: t(1, 8, 18) },
    { href: route('gallery'), label: t(1, 8, 20) },
  ],
  information: {
    eyebrow: t(1, 9, 0),
    ...withAccentedPhrase(t(1, 9, 2), 'interessieren'),
    description: t(1, 9, 4),
  },
  informationAction: { href: '#contatti', label: t(1, 9, 27) },
  faq: { eyebrow: t(1, 10, 0), title: t(1, 10, 2) },
  faqAction: { href: route('faq'), label: t(1, 10, 2) },
};
export const services = itServices.map((card, i) => ({
  ...card,
  eyebrow: t(1, i + 2, 1),
  title: t(1, i + 2, 3),
  description: t(1, i + 2, i === 2 ? 4 : 5),
  price: t(1, i + 2, i === 2 ? 6 : 7),
  href: route(
    [
      'four-implant-denture',
      'fixed-implant-bridge',
      'whitening',
      'crowns-veneers-bridges',
    ][i]!,
  ),
  alt: alt(card.mobileImage),
}));
export const aboutCards = itAbout.map((card, i) => ({
  ...card,
  title: t(1, 7, 4 + i * 4),
  description: t(1, 7, 6 + i * 4),
  href: route(['specialists', 'all-in-one', 'directions', 'laboratory'][i]!),
  alt: alt(card.mobileImage),
}));
export const welcome = {
  eyebrow: t(1, 6, 1),
  title: t(1, 6, 2),
  statement: t(1, 6, 4),
  thanks: t(1, 6, 6),
  author: t(1, 6, 8),
  documentation: t(1, 6, 10),
  cta: { href: '#contatti', label: t(1, 6, 28) },
  items: [12, 16, 20, 24].map((p) => ({
    title: t(1, 6, p),
    text: t(1, 6, p + 2),
  })),
};
export const testimonials = [6, 10, 14].map((p) => ({
  text: t(1, 8, p),
  name: t(1, 8, p + 1),
  year: t(1, 8, p + 2),
}));
export const informationCards = [
  'first-visit',
  'accommodation',
  'directions',
  'payment',
  'guarantees',
  'treatment-duration',
  'sedation',
  'new-implants',
].map((id, i) => ({
  title: t(1, 9, [6, 9, 12, 15, 17, 20, 22, 24][i]!),
  text: t(1, 9, [7, 10, 13, 16, 18, 21, 23, 25][i]!),
  href: route(id),
}));
export const homeQuestions = [
  faq(1, 10, 4, [5, 7, 9, 11]),
  faq(1, 10, 13, [14]),
  faq(1, 10, 16, [18, 20]),
].map((q) => ({ question: q.question, answer: [], richAnswer: q.answer }));
