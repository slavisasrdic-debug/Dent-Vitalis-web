import type { ContentBlock, InnerPage, InlineContent } from './inner-pages';
import {
  localizedPageRegistry,
  type NewLocale,
} from './localized-page-registry';
import { localizedHome } from './localized-home';
import { labels as germanLabels } from './de/site';

const sources = {
  de: () => import('../../data/translations/de-source.json'),
  en: () => import('../../data/translations/en-source.json'),
  sl: () => import('../../data/translations/sl-source.json'),
} as const;

const routePrefix: Record<NewLocale, string> = {
  de: '/de',
  en: '/en',
  sl: '/si',
};

function text(value: string): InlineContent[] {
  return [{ kind: 'text', text: value }];
}

type TranslationSource =
  typeof import('../../data/translations/de-source.json');
function rows(source: TranslationSource, tableId: string): string[][] {
  const table = source.blocks.find((block) => block.id === tableId);
  if (!table || table.type !== 'table' || !table.rows)
    throw new Error(`Missing ${tableId}`);
  return table.rows.map((row) =>
    row
      .flatMap((cell) => cell)
      .map((paragraph) => paragraph.text.trim())
      .filter(Boolean),
  );
}

function pageBlocks(
  source: TranslationSource,
  tableId: string,
): ContentBlock[] {
  return rows(source, tableId)
    .slice(1)
    .flatMap((row, index) => {
      const [heading, ...copy] = row;
      const blocks: ContentBlock[] = [];
      if (heading)
        blocks.push({
          type: 'heading',
          rank: index === 0 ? 2 : 3,
          variant: 'subsection',
          flush: false,
          content: text(heading),
        });
      for (const paragraph of copy)
        blocks.push({
          type: 'paragraph',
          variant: 'body',
          content: text(paragraph),
        });
      return blocks;
    });
}

export async function localizedPages(locale: NewLocale): Promise<InnerPage[]> {
  const source = (await sources[locale]()).default;
  return localizedPageRegistry[locale].map((entry) => {
    const sourceRows = rows(source, entry.sourceTable);
    const heroRow = sourceRows[0] ?? [];
    const route = `${routePrefix[locale]}/${entry.route}`;
    const german = locale === 'de';
    const service = entry.family === 'service';
    const title = german
      ? germanLabels[entry.route]!
      : heroRow[1] || heroRow[0] || entry.route;
    const description =
      german && !service ? heroRow[0] || '' : heroRow[2] || '';
    // The previous adapter silently discarded most of the first table row.
    // Retain every remaining source paragraph; do not infer lists or medical copy.
    const introduction: ContentBlock[] = german
      ? heroRow.slice(service ? 3 : 1).map((value) => ({
          type: 'paragraph',
          variant: 'body',
          content: text(value),
        }))
      : [];
    return {
      route,
      lang: locale === 'sl' ? 'sl' : locale,
      title: german ? `${title} | DentVitalis` : title,
      description,
      typography: 'brand',
      breadcrumb: [
        {
          label: german ? 'DentVitalis' : locale.toUpperCase(),
          href: `${routePrefix[locale]}/`,
        },
        { label: title, href: route },
      ],
      hero: {
        title,
        eyebrow: german && !service ? '' : heroRow[0] || '',
        description: text(description),
        variant: 'plain',
      },
      blocks: [...introduction, ...pageBlocks(source, entry.sourceTable)],
      trailingSpace: false,
      directory: [],
      related: [],
      source: {
        file: source.source,
        sha256: source.sha256,
        approval: 'review',
      },
      hiddenSourceSections: [],
    };
  });
}

export async function localizedHomePage(locale: NewLocale): Promise<InnerPage> {
  const home = localizedHome(locale);
  const route = `${routePrefix[locale]}/`;
  return {
    route,
    lang: locale === 'sl' ? 'sl' : locale,
    title: home.metadata.title,
    description: home.metadata.description,
    typography: 'brand',
    breadcrumb: [{ label: home.metadata.title, href: route }],
    hero: {
      title: home.hero.title,
      eyebrow: home.hero.eyebrowAccent,
      description: text(home.intro.description),
      variant: 'plain',
    },
    blocks: [],
    trailingSpace: false,
    directory: [],
    related: [],
    source: {
      file: `data/translations/${locale}-source.json`,
      sha256: '',
      approval: 'review',
    },
    hiddenSourceSections: [],
  };
}
