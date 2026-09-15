import raw from './faq-it.json';
import { referenceBusiness } from '../../data/site';

// User-approved punctuation correction; retain the original source snapshot.
export const homeQuestions = raw.map((item) => ({
  ...item,
  answer: item.answer
    .filter(
      (part, index) =>
        !(
          item.question === 'Quanto costa una corona dentale?' &&
          index === 2 &&
          'text' in part &&
          part.text === '.'
        ),
    )
    .map((part) =>
      'text' in part
        ? {
            ...part,
            text: part.text
              .replace(
                '{{singleImplantPrice}}',
                referenceBusiness.singleImplantPrice,
              )
              .replace('{{crownPrice}}', referenceBusiness.crownPrice),
          }
        : part,
    ),
}));
