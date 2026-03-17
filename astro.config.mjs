import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import partytown from '@astrojs/partytown';
import { remarkReadingTime } from './utils/remark-reading-time.mjs';
import mdx from '@astrojs/mdx';
import netlify from '@astrojs/netlify';

import expressiveCode from 'astro-expressive-code';

// https://astro.build/config
export default defineConfig({
  adapter: netlify(),
  integrations: [
    partytown({
      config: { forward: [['dataLayer.push', { preserveBehavior: true }]] },
    }),
    expressiveCode({
      themes: ['andromeeda'],
    }),
    mdx(),
  ],
  site: 'https://larocque.dev',
  markdown: { remarkPlugins: [remarkReadingTime] },
  vite: {
    plugins: [tailwindcss()],
  },
});
