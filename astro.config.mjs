import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import partytown from '@astrojs/partytown';
import { remarkReadingTime } from './utils/remark-reading-time.mjs';
import mdx from '@astrojs/mdx';
import netlify from '@astrojs/netlify';
import sitemap from '@astrojs/sitemap';

import expressiveCode from 'astro-expressive-code';

// https://astro.build/config
export default defineConfig({
  adapter: netlify(),
  integrations: [
    tailwind(),
    partytown({
      config: { forward: [['dataLayer.push', { preserveBehavior: true }]] },
    }),
    expressiveCode({
      themes: ['andromeeda'],
    }),
    mdx(),
    sitemap({
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date(),
    }),
  ],
  site: 'https://larocque.dev',
  markdown: { remarkPlugins: [remarkReadingTime] },
});
