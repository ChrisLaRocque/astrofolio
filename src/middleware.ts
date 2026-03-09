import { defineMiddleware } from 'astro:middleware';

const mdFiles = import.meta.glob<string>('/src/content/projects/*.md', {
  query: '?raw',
  import: 'default',
});
const mdxFiles = import.meta.glob<string>('/src/content/projects/*.mdx', {
  query: '?raw',
  import: 'default',
});

function stripFrontmatter(raw: string): string {
  if (!raw.startsWith('---')) return raw;
  const end = raw.indexOf('\n---', 4);
  if (end === -1) return raw;
  return raw.slice(end + 4).replace(/^\r?\n/, '');
}

export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname } = context.url;
  const accept = context.request.headers.get('Accept') ?? '';

  if (pathname.startsWith('/projects/') && accept.includes('text/markdown')) {
    const slug = pathname.slice('/projects/'.length);
    const loader =
      mdFiles[`/src/content/projects/${slug}.md`] ??
      mdxFiles[`/src/content/projects/${slug}.mdx`];
    if (loader) {
      const raw = await loader();
      return new Response(stripFrontmatter(raw), {
        headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
      });
    }
  }

  return next();
});
