import { getCollection, getEntry } from 'astro:content';
import type { APIRoute, GetStaticPaths } from 'astro';

export const getStaticPaths: GetStaticPaths = async () => {
  const projects = await getCollection('projects', ({ data }) => !data.draft);
  return projects.map((entry) => ({
    params: { slug: entry.slug },
  }));
};

export const GET: APIRoute = async ({ params }) => {
  const entry = await getEntry('projects', params.slug as string);
  return new Response(entry!.body, {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  });
};
