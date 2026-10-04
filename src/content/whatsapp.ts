import source from '../../data/whatsapp-copy-20261004.json';
import { referenceBusiness } from '../../data/site';

export function whatsappCopy(lang: keyof typeof source.locales) {
  const { responseTime, message } = source.locales[lang];
  // Owner requested the clinic, not a staff member, in every panel heading.
  return { team: referenceBusiness.name, responseTime, greeting: '', message };
}
