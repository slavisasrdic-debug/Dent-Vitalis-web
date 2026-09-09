import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';
import { canonicalUrl, productionOrigin } from './src/content/seo-urls';

export default defineConfig({
  site: productionOrigin,
  output: 'static',
  build: { format: 'directory' },
  server: { host: '0.0.0.0', port: 4321 },
  vite: { server: { strictPort: true } },
  devToolbar: { enabled: false },
  integrations: [
    sitemap({
      filter: (page) => !new URL(page).pathname.startsWith('/404'),
      serialize: (item) => ({ ...item, url: canonicalUrl(item.url) }),
    }),
  ],
});
