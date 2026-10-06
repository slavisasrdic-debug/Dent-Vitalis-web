// Owner-supplied Elfsight WhatsApp Chat IDs, approved 2026-10-06.
// Slovenian uses html lang="sl" and the existing public /si URL prefix.
export const whatsappWidgets = {
  it: '97dc04b8-23e7-4eef-8c47-449554cf098f',
  hr: 'dbe233ee-6fca-45db-81da-30ab0413a3b6',
  de: '72199004-e373-4537-9de3-0fa41d4e27ea',
  en: '47c668f9-630d-4579-9ff0-0ae419db8879',
  sl: 'c0e50881-1c15-433d-a012-18c1b3d36fcb',
} as const;

export function whatsappWidgetId(lang: string): string {
  if (!Object.hasOwn(whatsappWidgets, lang)) {
    throw new Error(`No approved WhatsApp widget for language: ${lang}`);
  }
  return whatsappWidgets[lang as keyof typeof whatsappWidgets];
}
