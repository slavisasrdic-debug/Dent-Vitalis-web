import raw from './faq-it.json';
import { referenceBusiness } from '../../data/site';

// Price references retain exactly the source punctuation, including its double period.
export const homeQuestions = raw.map((item) => ({
  ...item,
  answer: item.answer.map((part) =>
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
