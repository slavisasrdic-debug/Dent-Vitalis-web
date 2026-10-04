import source from '../../data/whatsapp-copy-20261004.json';

export function whatsappCopy(lang: keyof typeof source.locales) {
  const { team, responseTime, message } = source.locales[lang];
  return { team, responseTime, greeting: '', message };
}
