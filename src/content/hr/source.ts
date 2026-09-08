import catalogue from '../../../data/translations/hr-source.json';
import type { ContentBlock, InlineContent } from '../inner-pages';
import { bindReferenceBusiness } from '../reference-bindings';
import { croatianBusinessReview } from '../../../data/site';

// Build-time only. IDs refer to the approved, SHA-256 locked DOCX, not row alignment.
interface Paragraph {
  id: string;
  text: string;
  runs: { text: string; b?: string; i?: string }[];
}
const paragraphs = new Map<string, Paragraph>();
for (const block of catalogue.blocks) {
  const items =
    block.type === 'table' ? block.rows!.flatMap((row) => row.flat()) : [block];
  for (const paragraph of items)
    paragraphs.set(paragraph.id, paragraph as Paragraph);
}
export const source = {
  file: catalogue.source,
  sha256: catalogue.sha256,
  approval: 'review' as const,
};
export const usedSourceIds = new Set<string>();
export function text(id: string): string {
  const paragraph = paragraphs.get(id);
  if (!paragraph || !paragraph.text.trim())
    throw new Error(`Missing Croatian source: ${id}`);
  if (
    /^Hrvatski\s*[–-]?\s*ne|^Nema prijevoda/.test(paragraph.text.trim()) ||
    id.includes('.c0.')
  )
    throw new Error(`Excluded Croatian source: ${id}`);
  usedSourceIds.add(id);
  return bindReferenceBusiness(paragraph.text.trim())
    .replaceAll('ZABAHR2X', croatianBusinessReview.swift)
    .replaceAll(
      'do 36 rata',
      `do ${croatianBusinessReview.maxCardInstallments} rata`,
    );
}
export const ref = (table: number, row: number, paragraph: number) =>
  `t${table}.r${row}.c1.p${paragraph}`;
export const t = (table: number, row: number, paragraph: number) =>
  text(ref(table, row, paragraph));
export const bilingual = (id: string) => text(id).split('/').at(-1)!.trim();
export const inline = (value: string): InlineContent[] =>
  value.split('\n').flatMap((line, i) => {
    const parts: InlineContent[] = i ? [{ kind: 'break' }] : [];
    let offset = 0;
    for (const match of line.matchAll(
      /https?:\/\/[^\s\u200b]+|[\w.+-]+@[\w.-]+\.[a-z]+|\+385(?: \d{1,4}){3}/g,
    )) {
      const value = match[0];
      if (match.index > offset)
        parts.push({ kind: 'text', text: line.slice(offset, match.index) });
      parts.push({
        kind: 'link',
        href: value.startsWith('+')
          ? 'tel:' + value.replaceAll(' ', '')
          : value.includes('@')
            ? 'mailto:' + value
            : value,
        children: [{ kind: 'text', text: value }],
      });
      offset = match.index + value.length;
    }
    if (offset < line.length)
      parts.push({ kind: 'text', text: line.slice(offset) });
    return parts;
  });
export const p = (id: string, variant = 'body'): ContentBlock => ({
  type: 'paragraph',
  content:
    id === 't8.r2.c1.p10'
      ? [
          {
            kind: 'link',
            href: 'https://www.kekspay.hr/',
            children: inline(text(id)),
          },
        ]
      : inline(text(id)),
  variant,
});
export const h = (
  id: string,
  rank: 2 | 3 = 2,
): Extract<ContentBlock, { type: 'heading' }> => ({
  type: 'heading',
  content: inline(text(id)),
  rank,
  variant: rank === 2 ? 'section' : 'subsection',
  flush: false,
});
export const bullet = (id: string): ContentBlock => {
  const value = text(id),
    hasMarker = /^[•-]/.test(value);
  return {
    type: 'bullet',
    content: inline(value),
    variant: 'dot',
    icon: !hasMarker,
    labelSpan: hasMarker ? 2 : 1,
    smallLabelSpan: hasMarker ? 2 : 1,
  };
};
export const group = (
  children: ContentBlock[],
  variant = 'paragraphs',
): ContentBlock => ({ type: 'group', variant, children });
// Explicit ordered paragraph selections; h/h3/b/$ prefixes assign semantic roles.
export function row(
  table: number,
  rowIndex: number,
  selection: string,
): ContentBlock[] {
  return selection
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => {
      const match = /^(h3:|h:|b:|\$:)?(\d+)$/.exec(part);
      if (!match) throw new Error(`Invalid Croatian selection: ${part}`);
      const id = ref(table, rowIndex, Number(match[2]));
      return match[1] === 'h:'
        ? h(id)
        : match[1] === 'h3:'
          ? h(id, 3)
          : match[1] === 'b:'
            ? bullet(id)
            : p(id, match[1] === '$:' ? 'price' : 'body');
    });
}
export function faq(
  table: number,
  rowIndex: number,
  question: number,
  answers: number[],
): Extract<ContentBlock, { type: 'faq' }> {
  return {
    type: 'faq',
    question: t(table, rowIndex, question),
    answer: answers.flatMap((n, i) => [
      ...(i ? [{ kind: 'break' as const }, { kind: 'break' as const }] : []),
      ...inline(t(table, rowIndex, n)),
    ]),
  };
}
