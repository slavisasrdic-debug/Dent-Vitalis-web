import type { Graph, Thing } from 'schema-dts';
import { clinic, referenceBusiness, structuredBusiness } from '../../data/site';
import type { ContentBlock, InlineContent, ContentPhoto } from './inner-pages';
import homeAssets from './home-assets.json';
import innerAssets from './inner-assets.json';
import { videoPoster } from './background-videos';
import { canonicalUrl, productionOrigin } from './seo-urls';
import videoMetadata from '../../data/video-metadata.json';
export const origin = productionOrigin;
export const plain = (content: InlineContent[]): string =>
  content
    .map((item) =>
      item.kind === 'break'
        ? '\n'
        : item.kind === 'text'
          ? item.text
          : plain(item.children),
    )
    .join('');
export function flatten(blocks: ContentBlock[]): ContentBlock[] {
  return blocks.flatMap((b) => [
    b,
    ...(b.type === 'group'
      ? flatten(b.children)
      : b.type === 'list'
        ? flatten(b.items.flat())
        : []),
  ]);
}
export interface PageSEO {
  type?:
    'WebPage' | 'ContactPage' | 'AboutPage' | 'ImageGallery' | 'CollectionPage';
  breadcrumb?: { label: string; href: string }[];
  questions?: { question: string; answer: string }[];
  service?: { name: string; price?: string | undefined };
  people?: { name: string; description?: string }[];
  videos?: { videoId: string; title: string }[];
  photo?: ContentPhoto | undefined;
}
export function socialImage(photo?: ContentPhoto, assetOrigin = origin) {
  const assets: Record<
    string,
    { src: string; width?: number; height?: number }
  > = { ...homeAssets, ...innerAssets };
  const poster = videoPoster('Dentvitalis_video-left');
  const asset = photo ? assets[photo.image] : poster;
  if (!asset) throw new Error(`Unknown SEO image: ${photo?.image}`);
  return {
    ...asset,
    url: new URL(asset.src, assetOrigin).href,
    alt: photo?.alt ?? '',
  };
}
export function graph(
  title: string,
  description: string,
  lang: string,
  canonical: string,
  seo: PageSEO,
  assetOrigin = origin,
): Graph {
  canonical = canonicalUrl(canonical);
  const dentistId = `${origin}/#dentist`,
    siteId = `${origin}/#website`,
    pageId = `${canonical}#webpage`;
  const nodes: Thing[] = [
    {
      '@type': 'Dentist',
      '@id': dentistId,
      name: referenceBusiness.name,
      url: origin + '/',
      telephone: clinic.contact.phone,
      email: clinic.contact.email,
      address: { '@type': 'PostalAddress', ...structuredBusiness.address },
      logo: `${assetOrigin}/assets/images/Dentvitalis-logo-color_21200px.svg`,
      openingHoursSpecification: {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: [...structuredBusiness.openingDays],
        opens: structuredBusiness.opens,
        closes: structuredBusiness.closes,
      },
    },
    {
      '@type': 'WebSite',
      '@id': siteId,
      url: origin + '/',
      name: referenceBusiness.name,
      publisher: { '@id': dentistId },
      inLanguage: ['it', 'hr'],
    },
    {
      '@type': seo.type ?? 'WebPage',
      '@id': pageId,
      url: canonical,
      name: title,
      description,
      inLanguage: lang,
      isPartOf: { '@id': siteId },
      about: { '@id': dentistId },
      ...(seo.photo
        ? {
            primaryImageOfPage: {
              '@type': 'ImageObject',
              url: socialImage(seo.photo, assetOrigin).url,
              caption: seo.photo.alt,
              inLanguage: lang,
            },
          }
        : {}),
      ...(seo.breadcrumb?.length
        ? { breadcrumb: { '@id': `${canonical}#breadcrumb` } }
        : {}),
    },
  ];
  if (seo.breadcrumb?.length)
    nodes.push({
      '@type': 'BreadcrumbList',
      '@id': `${canonical}#breadcrumb`,
      itemListElement: seo.breadcrumb.map((item, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: item.label,
        item: item.href ? canonicalUrl(item.href) : canonical,
      })),
    });
  if (seo.questions?.length)
    nodes.push({
      '@type': 'FAQPage',
      '@id': `${canonical}#faq`,
      inLanguage: lang,
      mainEntity: seo.questions.map((q) => ({
        '@type': 'Question',
        name: q.question,
        acceptedAnswer: { '@type': 'Answer', text: q.answer },
      })),
    });
  if (seo.service)
    nodes.push({
      '@type': 'Service',
      '@id': `${canonical}#service`,
      name: seo.service.name,
      url: canonical,
      provider: { '@id': dentistId },
      ...(seo.service.price
        ? {
            offers: {
              '@type': 'Offer',
              price: seo.service.price,
              priceCurrency: 'EUR',
              url: canonical,
            },
          }
        : {}),
    });
  for (const [i, person] of (seo.people ?? []).entries())
    nodes.push({
      '@type': 'Person',
      '@id': `${canonical}#person-${i + 1}`,
      name: person.name,
      // The known source placeholder awaits editorial approval, not schema publication.
      ...(person.description && !/\bDr\.\s*XY\b/.test(person.description)
        ? { description: person.description }
        : {}),
      worksFor: { '@id': dentistId },
    });
  for (const video of seo.videos ?? []) {
    const metadata = videoMetadata.videos.find(
      (item) => item.videoId === video.videoId,
    );
    if (!metadata)
      throw new Error(`Missing verified publication date: ${video.videoId}`);
    nodes.push({
      '@type': 'VideoObject',
      '@id': `${origin}/#video-${video.videoId}`,
      name: video.title,
      uploadDate: metadata.uploadDate,
      embedUrl: `https://www.youtube-nocookie.com/embed/${video.videoId}`,
      thumbnailUrl: `${assetOrigin}/assets/images/youtube-${video.videoId}.webp`,
      isPartOf: { '@id': pageId },
    });
  }
  return { '@context': 'https://schema.org', '@graph': nodes };
}
