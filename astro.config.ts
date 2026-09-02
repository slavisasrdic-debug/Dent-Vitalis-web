import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://www.dentvitalis.com',
  output: 'static',
  integrations: [sitemap()],
});
