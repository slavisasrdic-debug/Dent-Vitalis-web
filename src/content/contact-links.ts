import type { InlineContent } from './inner-pages';

// Approved href-only correction: the HR legal snapshot's dial target differs
// from its visible phone number. Do not alter the source or displayed text.
export function correctContactTarget(part: InlineContent): InlineContent {
  if (
    part.kind === 'link' &&
    ['tel:0038550371064', 'tel:0038551371064'].includes(part.href) &&
    part.children.length === 1 &&
    part.children[0]?.kind === 'text' &&
    part.children[0].text === '+38551371064'
  )
    return { ...part, href: 'tel:+38551371064' };
  return part;
}

// Presentation only: preserve every character; never infer a country code,
// replace legal contacts with current business values, or match dates/OIBs.
export function contactLinks(text: string): InlineContent[] {
  const pattern =
    /[\w.+-]+@[\w-]+(?:\.[\w-]+)+|https?:\/\/[^\s<>\u200b]+|\b(?:[a-z0-9-]+\.)+(?:com|hr|org|net|eu|it)\b(?:\/[^\s<>\u200b]*)?|\+\d(?:[\d ()-]*\d){6,14}|\b800[ \u00a0]?174[ \u00a0]?206\b/gi;
  const parts: InlineContent[] = [];
  let cursor = 0;
  for (const match of text.matchAll(pattern)) {
    const label = match[0].replace(/[.,;:!?]+$/, '');
    // Source mention retained, but this domain currently has no DNS record.
    // The research title separately links to its verified publisher DOI.
    if (label.toLowerCase() === 'dentiumeu.com') continue;
    const start = match.index;
    const phone = /^\+|^800/.test(label);
    const href = phone
      ? `tel:${label.replace(/[^+\d]/g, '')}`
      : label.includes('@') && !/^https?:/i.test(label)
        ? `mailto:${label}`
        : /^https?:/i.test(label)
          ? label
          : `https://${label}`;
    if (start > cursor)
      parts.push({ kind: 'text', text: text.slice(cursor, start) });
    parts.push({
      kind: 'link',
      href,
      variant: 'contact',
      children: [{ kind: 'text', text: label }],
    });
    cursor = start + label.length;
  }
  if (cursor < text.length)
    parts.push({ kind: 'text', text: text.slice(cursor) });
  return parts;
}
