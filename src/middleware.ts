import { defineMiddleware } from 'astro:middleware';
import { separateHtmlText } from './lib/html-text-boundaries';

// Static build + development only: cPanel receives plain HTML, no new runtime or JS.
export const onRequest = defineMiddleware(async (_context, next) => {
  const response = await next();
  if (!response.headers.get('content-type')?.includes('text/html'))
    return response;
  const html = separateHtmlText(await response.text());
  const headers = new Headers(response.headers);
  headers.delete('content-length');
  return new Response(html, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
});
