import type { APIRoute } from 'astro';
import { productionOrigin } from '../content/seo-urls';

// Preserve the existing submitted sitemap address as an XML sitemap index.
export const GET: APIRoute = () =>
  new Response(
    `<?xml version="1.0" encoding="UTF-8"?><sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><sitemap><loc>${productionOrigin}/sitemap-0.xml</loc></sitemap></sitemapindex>`,
    { headers: { 'Content-Type': 'application/xml; charset=utf-8' } },
  );
