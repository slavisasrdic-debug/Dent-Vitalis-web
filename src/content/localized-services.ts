import { localizedPageRegistry, type NewLocale } from './localized-page-registry';

export interface LocalizedServiceDraft {
  locale: NewLocale;
  route: string;
  sourceTable: string;
  title: string;
  description: string;
  price: string;
  paragraphs: string[];
  bullets: string[];
}

const sources = {
  de: () => import('../../data/translations/de-source.json'),
  en: () => import('../../data/translations/en-source.json'),
  sl: () => import('../../data/translations/sl-source.json'),
} as const;

function tableRows(source: any, id: string): string[][] {
  const table = source.blocks.find((block: any) => block.id === id);
  if (!table || table.type !== 'table') throw new Error(`Missing source table ${id}`);
  return table.rows.map((row: any[]) =>
    row.flatMap((cell) => cell)
      .map((paragraph: any) => paragraph.text.trim())
      .filter(Boolean),
  );
}

/** Converts the supplied service tables into renderer-neutral content. */
export async function localizedServices(locale: NewLocale): Promise<LocalizedServiceDraft[]> {
  const source = (await sources[locale]()).default as any;
  return localizedPageRegistry[locale]
    .filter((page) => page.family === 'service')
    .map((page) => {
      const rows = tableRows(source, page.sourceTable);
      const [hero, ...body] = rows;
      const [eyebrow, title, description, price, ...rest] = hero ?? [];
      return {
        locale,
        route: page.route,
        sourceTable: page.sourceTable,
        title: title || eyebrow || '',
        description: description || '',
        price: price || '',
        paragraphs: body.flatMap((row) => row.slice(0, 1)),
        bullets: rest,
      };
    });
}
