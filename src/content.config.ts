// Content collections configuration using Content Layer API (Astro 6)
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

export const techItem = z.enum([
  'graphql',
  'html',
  'tailwind-css',
  'github',
  'gitlab',
  'npm',
  'css',
  'javascript',
  'nodejs',
  'aws',
  'netlify',
  'contentful',
  'nuxt',
  'vue',
  'react',
  'gatsby',
  'sass',
  'bulma',
  'next-js',
  'astro',
  'typescript',
  'yarn',
  'vitest',
  'sanity',
]);

// Define collections with glob loader
const projectCollection = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    site: z.string().optional(),
    tech: z.array(techItem),
    updatedAt: z.date(),
    gitHub: z.string().optional(),
    draft: z.boolean().optional(),
  }),
});
const techCollection = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/tech' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    homepage: z.string(),
  }),
});

export const collections = {
  projects: projectCollection,
  tech: techCollection,
};
