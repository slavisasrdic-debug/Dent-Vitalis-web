import type { APIRoute } from 'astro';
import { productionOrigin, publicationSettings } from '../content/seo-urls';

export const GET: APIRoute = () => {
  const { indexable } = publicationSettings(process.env);
  // Crawlers must be able to read the preview's HTML/HTTP noindex directive.
  const lines = ['User-agent: *', 'Allow: /'];
  if (indexable) lines.push(`Sitemap: ${productionOrigin}/sitemap-index.xml`);
  else lines.push('# Preview: indexing is disabled in HTML and HTTP headers.');
  return new Response(lines.join('\n') + '\n', {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
