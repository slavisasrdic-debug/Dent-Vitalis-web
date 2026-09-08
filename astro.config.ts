import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://www.dentvitalis.com',
  output: 'static',
  server: { host: '0.0.0.0', port: 4321 },
  vite: { server: { strictPort: true } },
  devToolbar: { enabled: false },
  integrations: [sitemap()],
});
