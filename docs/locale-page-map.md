# DE/EN/SL page mapping — 23. rujna 2026.

Ovaj inventar veže prevedene DOCX blokove uz postojeće semantičke rute. ID-jevi su source evidence; ne predstavljaju automatsko poravnanje odlomaka.

| Existing route family | DE source | EN source | SL source | Mapping status |
| --- | --- | --- | --- | --- |
| home | `p1`, `t1` | `p1`, `t1` | `p1`, `t1` | ready for adapter |
| services directory | `p4`, `t2`–`t5` | `p3`, `t2`–`t5` | `p3`, `t2`–`t5` | ready for adapter |
| about directory | `p16`, `t6`–`t11` | `p16`, `t6`–`t11` | `p17`, `t6`–`t11` | ready for adapter |
| information directory | `p64`, `t13`–`t17` | `p67`, `t13`–`t17` | `p66`, `t13`–`t17` | ready for adapter |
| price list | `p92`, `t18` | `p97`, `t18` | `p96`, `t18` | inspect price semantics |
| testimonials | `p98`–`p197`, `t19` | `p103`–`p222`, `t19` | `p102`–`p222`, `t19` | preserve testimonial identity/media mapping |
| FAQ | `p197`, `t20`–`t21` | `p222`, `t20`–`t21` | `p222`, `t20`–`t21` | inspect excluded Croatia questions |
| gallery | `p212`–`p230`, `t22`–`t24` | `p240`–`p258`, `t22`–`t24` | `p242`–`p261`, `t22`–`t24` | ready for adapter |
| contact | `p231`–`p250`, `t25`–`t29` | `p259`–`p278`, `t25`–`t29` | `p262`–`p281`, `t25`–`t29` | verify language-specific email/contact wording |

## Known differences requiring explicit handling

- DE contains an Italian heading at `p66` (`Prima visita gratuita`) inside otherwise German content; preserve only if it is confirmed as a visible source label, otherwise flag for review.
- EN and SL have extra standalone paragraphs compared with DE/HR. These must be assigned to their source page, not discarded because the paragraph index differs.
- SL table row counts differ in tables 15 and 16; do not reuse a fixed row index from HR/IT.
- Testimonial blocks contain names, locations and media associations. They require identity-based mapping, not translation-only replacement.
- Contacts and payment/legal blocks must be checked against the supplied language document and existing approved business values before publication.

No DE/EN/SL route or hreflang is enabled by this document. It is a mapping contract for the next implementation step.
