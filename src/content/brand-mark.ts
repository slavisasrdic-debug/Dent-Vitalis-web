export const brandMarkViewBox = '61 -2 23 27';

// Preserve the accepted V/triangle geometry. Use the existing logo's own blue,
// not an invented shade, and never edit the original full-logo source bytes.
export function brandMarkArtwork(original: string): string {
  const blue = original.match(/style="fill:(#[0-9a-f]{6});"/)?.[1];
  const elements = [...original.matchAll(/<(?:path|polygon)\b[^>]*\/>/g)]
    .map(([element]) => element)
    .filter(
      (element) =>
        element.startsWith('<path d="M70.63,22.23l-7.2-17.16') ||
        element.startsWith('<polygon points="68.3 0 72.4 11.87 76.48 0'),
    );
  if (!blue || elements.length !== 2)
    throw new Error(
      'Brand mark source changed; review the original geometry/colors.',
    );
  return elements
    .map((element) =>
      element.startsWith('<polygon')
        ? element.replace('fill:#afbc36;', `fill:${blue};`)
        : element,
    )
    .join('');
}
