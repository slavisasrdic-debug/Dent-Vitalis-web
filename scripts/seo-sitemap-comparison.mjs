import groups from '../data/seo/redirect-groups.json' with { type: 'json' };
import inventory from '../data/seo/url-inventory.json' with { type: 'json' };

const origin = 'https://www.dentvitalis.com';
const normalize = (path) => (path === '/' ? '/' : path.replace(/\/+$/, ''));
const pathname = (url) => normalize(new URL(url, origin).pathname);
const clearGroups = new Set([
  'same-purpose',
  'hr-reviews-alias',
  'hr-reviews-canonical',
  'hr-home-alias',
  'it-accommodation',
  'it-first-visit',
  'it-payment',
  'it-guarantees',
  'it-laboratory',
  'it-transport',
]);
const shortReasons = {
  'whitening-method':
    'Staro ordinacijsko izbjeljivanje i novo kućno izbjeljivanje udlagama nisu ista metoda; prije 301 potrebna stručna odluka.',
  'all-on-four':
    'Stari All-on-4 je fiksni most. Nova proteza na 4 implantata nije njegova zamjena; kandidat za fiksni most traži stručnu potvrdu.',
  'implant-denture':
    'Stara prečka na 2/4 implantata i novi locatori na 4 implantata nisu ista konstrukcija; odluka liječnika prije 301.',
  'crowns-and-bridges':
    'Nova skupna stranica ima srodne odjeljke; prije spajanja potvrditi očuvanje detalja stare pojedinačne usluge.',
  'full-arch-bridge':
    'Stari keramički most za cijelu čeljust i novi OnX paket razlikuju se u materijalu/opsegu; stručna potvrda prije 301.',
  'other-prosthetics':
    'Nije potvrđeno da skupna nova stranica zamjenjuje ovu posebnu protetsku konstrukciju; očuvati stari članak do odluke.',
  'implantology-education':
    'Stari opći edukativni članak nije isti kao novi članak o odabranim implantatima; bez automatske 301.',
  technology:
    'Stari sadržaj podijeljen je između materijala i laboratorija; treba odabrati primarnu zamjenu.',
  sterilization:
    'Novi kratki opis sterilizacije ne zamjenjuje detaljni stari članak; očuvati ga do odluke.',
  'no-dedicated-equivalent':
    'Nema novog detaljnog članka za ovu uslugu; očuvati stari sadržaj. Nije dodana 301 ni 410.',
  'destination-guide':
    'Turistički članak o Hrvatskoj/Rijeci nije jednak novom FAQ-u; ne preusmjeravati bez sadržajne odluke.',
  'booking-form':
    'Kontakt je predložena zamjena stare prijave; puni novi frontend tijek s privitkom/privolom još treba potvrditi.',
  campaigns:
    'Stara kampanja; potvrditi aktivne oglase i odluku o gašenju/zamjeni. Nije dodana neodobrena 301 ni 410.',
};

/** Reuse reviewed subject groups and actual language pairs; never translate slugs. */
export function compareSitemapSubjects(oldEntries, newPages) {
  const current = new Map(newPages.map((page) => [pathname(page.url), page]));
  const oldTitles = new Map(
    inventory.pages.map((page) => [pathname(page.url), page.title ?? '']),
  );
  const oldResponses = new Map(
    inventory.pages.map((page) => [pathname(page.url), page]),
  );
  return new Map(
    oldEntries.map((entry) => {
      const path = pathname(entry.url);
      const ownLanguage = entry.alternates.find(
        (link) => pathname(link.url) === path,
      )?.lang;
      const anchors = [
        path,
        ...entry.alternates.map((link) => pathname(link.url)),
      ];
      const group = groups.groups.find((item) =>
        item.paths.some((source) => anchors.includes(normalize(source))),
      );
      // The old collection incorrectly grouped a single Slovenian patient's story.
      const individualStory = /testimoni(?:anze|als|las)-/.test(path);
      let targetPages = [];
      if (!individualStory && group && clearGroups.has(group.id)) {
        const anchorsWithTarget = [group.target, ...anchors]
          .filter(Boolean)
          .map(pathname);
        const equivalent = anchorsWithTarget
          .map((key) => current.get(key))
          .find(Boolean);
        if (equivalent) {
          const href = equivalent.alternates.find(
            (link) => link.lang === ownLanguage,
          )?.url;
          if (href && current.has(pathname(href)))
            targetPages = [current.get(pathname(href))];
        }
      } else if (group?.candidates) {
        const candidates = group.candidates.it ?? group.candidates.hr ?? [];
        targetPages = candidates.flatMap((candidate) => {
          const page = current.get(pathname(candidate));
          const href = page?.alternates.find(
            (link) => link.lang === ownLanguage,
          )?.url;
          return href && current.has(pathname(href))
            ? [current.get(pathname(href))]
            : [];
        });
      } else if (individualStory) {
        const collection = current.get('/testimonianze');
        const href = collection?.alternates.find(
          (link) => link.lang === ownLanguage,
        )?.url;
        if (href) targetPages = [current.get(pathname(href))];
      }
      let reason =
        shortReasons[group?.id] ??
        group?.reason ??
        'Nema novog istovjetnog članka; očuvati stari sadržaj do odluke o zamjeni ili uklanjanju.';
      if (individualStory)
        reason =
          'Pojedinačna priča pacijenta nije automatski jednaka zbirnoj stranici. Potvrditi da je isto svjedočanstvo očuvano prije 301.';
      if (/\/(?:404|errore|napaka|mistake|fehler|greska)$/.test(path)) {
        reason =
          'Stara stranica greške ne pripada sitemapu; ne preusmjeravati je na naslovnicu. Provjeriti stvarni HTTP 404.';
        targetPages = [];
      }
      if (path === '/decisione-implantologia') {
        reason =
          'Poseban stari edukativni članak o odluci za implantologiju; nema potvrđene istovjetne nove stranice.';
      }
      if (group && clearGroups.has(group.id) && !individualStory) {
        reason = targetPages.length
          ? 'Ista namjena stranice; nova adresa i jezična verzija potvrđene iz prikazanih HTML hreflang parova. Ne mijenja poslovne uvjete.'
          : reason;
      }
      return [
        path,
        {
          language: ownLanguage ?? '',
          oldTitle: oldTitles.get(path) ?? '',
          oldHttpStatus: oldResponses.get(path)?.status ?? null,
          oldHttpCheckedAt: oldResponses.get(path)?.checkedAt ?? null,
          group: individualStory
            ? 'individual-testimonial'
            : (group?.id ?? 'no-confirmed-equivalent'),
          proposalTargets: targetPages.map((page) => page.url),
          reason:
            oldResponses.get(path)?.status === 404
              ? 'U inventaru od 9.9.2026. već je vraćala HTTP 404 (nije nova migracijska greška). ' +
                reason
              : reason,
          clearEquivalent: Boolean(
            group &&
            clearGroups.has(group.id) &&
            !individualStory &&
            targetPages.length === 1,
          ),
        },
      ];
    }),
  );
}
