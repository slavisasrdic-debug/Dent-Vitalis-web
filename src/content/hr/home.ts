import {
  home as itHome,
  services as itServices,
  aboutCards as itAbout,
} from '../home';
import { t, faq } from './source';
import { route } from './routes';
import { alt } from './assets';
import { ui } from '../ui';

export const home = {
  ...itHome,
  metadata: {
    title: t(1, 6, 2),
    description: t(1, 6, 4)
      .split(/(?<=[.!?])\s+/)
      .slice(0, 2)
      .join(' '),
  },
  translations: {
    it: 'review',
    hr: 'review',
    de: 'missing',
    en: 'missing',
    si: 'missing',
  },
  hero: {
    ...itHome.hero,
    eyebrowAccent: t(1, 0, 0).split(' – ')[0]!,
    eyebrow: '– ' + t(1, 0, 0).split(' – ')[1],
    title: t(1, 0, 1).split(', ')[1]!,
    pricePrefix: 'Fiksna cijena od',
    priceText: t(1, 0, 1).split(', ')[0]!,
    href: route('fixed-implant-bridge'),
    cta: t(1, 0, 8),
    ratingAlt: ui('hr').rating,
  },
  benefits: [2, 3, 4, 5, 6, 7].map((p) => t(1, 0, p)),
  intro: {
    eyebrow: t(1, 1, 1),
    title: t(1, 1, 3),
    accent: '',
    description: t(1, 1, 4),
  },
  about: { eyebrow: t(1, 7, 0), title: t(1, 7, 2), description: t(1, 7, 3) },
  testimonials: {
    eyebrow: t(1, 8, 0),
    title: t(1, 8, 2),
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
    title: t(1, 9, 2),
    description: t(1, 9, 4),
  },
  informationAction: { href: '#contatti', label: t(1, 9, 30) },
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
  cta: { href: route('contact'), label: t(1, 6, 28) },
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
  title: t(1, 9, 6 + i * 3),
  text: t(1, 9, 7 + i * 3),
  href: route(id),
}));
export const homeQuestions = [
  faq(1, 10, 4, [5, 7, 9, 11]),
  faq(1, 10, 13, [14]),
  faq(1, 10, 16, [18, 20]),
].map((q) => ({ question: q.question, answer: [], richAnswer: q.answer }));
