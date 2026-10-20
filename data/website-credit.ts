// Owner-approved website production attribution, 20 October 2026.
// This is not authorship of the clinic's medical or editorial content.
export const websiteProducer = {
  name: 'Enter Internet',
  url: 'https://www.enter-internet.com/',
  id: 'https://www.enter-internet.com/#organization',
} as const;

const labels = {
  it: 'Realizzazione sito web',
  hr: 'Izrada web stranice',
  de: 'Website erstellt von',
  en: 'Website by',
  sl: 'Izdelava spletne strani',
} as const;

export function websiteCredit(lang: string) {
  const label = labels[lang as keyof typeof labels];
  if (!label) throw new Error(`Unknown website credit language: ${lang}`);
  return { label, text: `${label}: ${websiteProducer.name}` };
}
