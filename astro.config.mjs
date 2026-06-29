import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Altere para o domínio real do cliente antes de publicar.
export default defineConfig({
  site: 'https://www.jrcars.pt',
  integrations: [sitemap()],
  compressHTML: true,
});
