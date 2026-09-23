import type { ImageKey } from '../components/ResponsiveImage.astro';
import type { TeaserCardData } from './home';
import de from '../../data/translations/de-source.json';
import en from '../../data/translations/en-source.json';
import sl from '../../data/translations/sl-source.json';

type Locale = 'de' | 'en' | 'sl';
type Source = { blocks: any[] };

const sources: Record<Locale, Source> = { de, en, sl };
const routeByService = [
  'four-implant-denture',
  'fixed-implant-bridge',
  'whitening',
  'crowns-veneers-bridges',
] as const;
const serviceImages: [ImageKey, ImageKey][] = [
  ['Sedazione-cosciente-1.webp', 'Sedazione-cosciente-mobile.webp'],
  ['ponte-fisso-su-impianti-2.webp', 'Dv-3.webp'],
  ['Recenzija-detail-1.webp', 'Recenzija-mobile.jpg'],
  ['Dv-4-2.webp', 'Dv-4-2.webp'],
];

function table(source: Source, id: string) {
  const block = source.blocks.find((candidate) => candidate.id === id);
  if (!block || block.type !== 'table')
    throw new Error(`Missing translation table ${id}`);
  return block.rows as any[][][];
}

export function localizedHome(locale: Locale) {
  const source = sources[locale];
  const hero = table(source, 't1')[0]!.flatMap((cell) => cell);
  const intro = table(source, 't1')[1]!.flatMap((cell) => cell);
  const serviceRows = table(source, 't1').slice(2, 6);
  const cards: TeaserCardData[] = serviceRows.map((row, index) => {
    const values = row.flatMap((cell) => cell).filter((item) => item.text.trim()).map((item) => item.text.trim());
    const [eyebrow, title, description, price] = values;
    const [desktopImage, mobileImage] = serviceImages[index]!;
    return {
      eyebrow,
      title,
      description,
      price,
      href: `/${routeByService[index]}`,
      desktopImage,
      mobileImage,
      alt: title,
      copyLayout: 'stack',
    };
  });
  return {
    metadata: {
      title: hero[0]?.text.trim() ?? 'DentVitalis',
      description: intro[0]?.text.trim() ?? '',
    },
    hero: {
      eyebrowAccent: hero[0]?.text.split(' – ')[0] ?? '',
      eyebrow: hero[0]?.text.split(' – ').slice(1).join(' – ') ?? '',
      title: hero[1]?.text.trim() ?? '',
      pricePrefix: hero[1]?.text.includes('€') ? '' : 'Fixed price',
      href: '/prestazioni/premium-ponte-fisso-su-impianti',
      cta: hero.at(-1)?.text.trim() ?? '',
      ratingAlt: 'DentVitalis patient rating',
    },
    benefits: hero.slice(2, 8).map((item) => item.text.trim()),
    intro: {
      eyebrow: intro[0]?.text.trim() ?? '',
      accent: intro[1]?.text.trim() ?? '',
      title: intro[1]?.text.trim() ?? '',
      description: intro[2]?.text.trim() ?? '',
    },
    services: cards,
  } as const;
}
