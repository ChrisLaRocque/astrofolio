import type { Config, Context } from '@netlify/edge-functions';

export default async function handler(request: Request, context: Context) {
  const accept = request.headers.get('Accept') ?? '';
  if (!accept.includes('text/markdown')) {
    return context.next();
  }

  const url = new URL(request.url);
  const slug = url.pathname.replace(/^\/projects\//, '').replace(/\/$/, '');
  const mdUrl = new URL(`/projects/${slug}.md`, url.origin);

  const mdResponse = await fetch(mdUrl.toString());
  if (!mdResponse.ok) {
    return context.next();
  }

  return new Response(await mdResponse.text(), {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  });
}

export const config: Config = { path: '/projects/*' };
