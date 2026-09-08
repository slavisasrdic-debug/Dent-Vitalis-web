import type { ContentBlock } from './inner-pages';

// User-approved display labels; keep each language's original destination.
const parkingUrls = new Set([
  'https://share.google/71jvli5wQ7ylYdd8N', // HR DOCX
  'https://share.google/TJtLAKAVtTdLcpCDF', // IT Webflow href
]);
const labels = {
  hr: 'Lokacija parkirališta',
  it: 'Posizione del parcheggio',
};

export function labelParkingLinks(
  blocks: ContentBlock[],
  lang: keyof typeof labels,
): ContentBlock[] {
  return blocks.map((block) => {
    if (block.type === 'group')
      return { ...block, children: labelParkingLinks(block.children, lang) };
    if (block.type !== 'paragraph') return block;
    return {
      ...block,
      content: block.content.map((part) =>
        part.kind === 'link' && parkingUrls.has(part.href)
          ? {
              ...part,
              children: [{ kind: 'text', text: labels[lang] }],
              variant: 'underlined',
            }
          : part,
      ),
    };
  });
}
