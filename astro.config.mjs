import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import partytown from '@astrojs/partytown';
import { remarkReadingTime } from './utils/remark-reading-time.mjs';
import mdx from '@astrojs/mdx';

// https://astro.build/config
export default defineConfig({
  integrations: [
    tailwind(),
    partytown({
      config: { forward: [['dataLayer.push', { preserveBehavior: true }]] },
    }),
    mdx(),
  ],
  site: 'https://larocque.dev',
  markdown: { remarkPlugins: [remarkReadingTime] },
});
