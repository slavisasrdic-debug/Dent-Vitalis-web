import type { ImageKey } from '../components/ResponsiveImage.astro';
import type { TeaserCardData } from './home';
import { localizedHome } from './localized-home';

type Locale = 'de' | 'en' | 'sl';

const directoryImages: Record<
  'about' | 'information',
  [ImageKey, ImageKey][]
> = {
  about: [
    ['I-nostri-specialist-2i.webp', 'I-nostri-specialisti-mobile-2.webp'],
    ['Tutto-in-un-unico-luogo-1.webp', 'DV-44.webp'],
    ['Come-raggiungerci.webp', 'Come-raggiungerci.webp'],
    ['Laboratorio-odontotecnico-1.webp', 'Laboratorio-odontotecnico-1.webp'],
  ],
  information: [
    ['Prima-visita-gratuita.webp', 'Prima-visita-gratuita.webp'],
    ['Alloggio-hero-2600.webp', 'Alloggio-hero-2600.webp'],
    ['Come-raggiungerci.webp', 'Come-raggiungerci.webp'],
    ['Pagamento-flessibile.webp', 'Pagamento-flessibile.webp'],
    ['Garanzie.webp', 'Garanzie.webp'],
    ['Tempi-del-trattamento.webp', 'Tempi-del-trattamento.webp'],
    ['Sedazione-cosciente-1.webp', 'Sedazione-cosciente-mobile.webp'],
    ['Tempi-del-trattamento-3.webp', 'Tempi-del-trattamento-3.webp'],
  ],
};

const directoryRoutes = {
  about: ['specialists', 'all-in-one', 'directions', 'laboratory'],
  information: [
    'first-visit',
    'accommodation',
    'directions',
    'payment',
    'guarantees',
    'treatment-duration',
    'sedation',
    'new-implants',
  ],
} as const;

const sourceByLocale = {
  de: () => import('../../data/translations/de-source.json'),
  en: () => import('../../data/translations/en-source.json'),
  sl: () => import('../../data/translations/sl-source.json'),
};

/**
 * Builds directory cards from the supplied translation source. This adapter is
 * intentionally not wired into public routes until detail-page mapping and
 * localized navigation are complete.
 */
export async function localizedDirectory(
  locale: Locale,
  kind: 'about' | 'information',
) {
  const source = (await sourceByLocale[locale]()).default as any;
  const tableId = kind === 'about' ? 't7' : 't9';
  const table = source.blocks.find((block: any) => block.id === tableId);
  if (!table || table.type !== 'table')
    throw new Error(`Missing ${locale} ${tableId} translation table`);
  const rows = table.rows as any[][][];
  const images = directoryImages[kind];
  const routes = directoryRoutes[kind];
  const fallback = localizedHome(locale).services[0]!;
  return rows.slice(0, routes.length).map((row, index) => {
    const values = row
      .flatMap((cell) => cell)
      .filter((paragraph) => paragraph.text.trim())
      .map((paragraph) => paragraph.text.trim());
    const [title, description] = values;
    const [desktopImage, mobileImage] = images[index]!;
    return {
      title: title || fallback.title,
      description: description || '',
      href: `/${routes[index]}`,
      desktopImage,
      mobileImage,
      alt: title || fallback.title,
    } satisfies TeaserCardData;
  });
}
