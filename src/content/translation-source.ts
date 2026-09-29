export interface TranslationParagraph {
  id: string;
  text: string;
  style: string | null;
  runs: Array<Record<string, string>>;
}

export interface TranslationTable {
  type: 'table';
  id: string;
  rows: TranslationParagraph[][][];
}

export interface TranslationBlock {
  type: string;
  id: string;
  text?: string;
  rows?: TranslationParagraph[][][];
}

export interface TranslationSource {
  blocks: TranslationBlock[];
}

export function isTranslationTable(
  block: TranslationBlock | undefined,
): block is TranslationTable {
  return block?.type === 'table' && Array.isArray(block.rows);
}
