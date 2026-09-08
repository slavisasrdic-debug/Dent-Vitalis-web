import type { InnerPage, PageCard } from './inner-pages';

/** Use the complete service directory, not the smaller home-page selection. */
export function completeRelatedServices(
  pages: InnerPage[],
  directoryRoute: string,
): InnerPage[] {
  const directory = pages.find((page) => page.route === directoryRoute);
  if (!directory?.directory.length)
    throw new Error(`Missing service directory: ${directoryRoute}`);
  const serviceRoutes = new Set(directory.directory.map((card) => card.href));
  if (serviceRoutes.size !== directory.directory.length)
    throw new Error(`Duplicate service in directory: ${directoryRoute}`);
  // Related and directory variants have different copyLayout/priceInset values.
  // Reuse existing related cards, including their exact source text and variants.
  const existing = new Map(
    pages.flatMap((page) =>
      page.related.map((card) => [card.href, card] as const),
    ),
  );
  const catalogue: PageCard[] = directory.directory.map(
    ({ title, href, eyebrow, description, price, copyLayout, priceInset }) =>
      existing.get(href) ?? {
        title,
        href,
        eyebrow,
        description,
        price,
        copyLayout,
        priceInset,
      },
  );
  return pages.map((page) =>
    serviceRoutes.has(page.route)
      ? {
          ...page,
          related: catalogue
            .filter((card) => card.href !== page.route)
            .map(
              (card) =>
                page.related.find((item) => item.href === card.href) ?? card,
            ),
        }
      : page,
  );
}
