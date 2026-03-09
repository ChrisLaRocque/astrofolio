---
title: Serve markdown versions of Astro pages for agents
description: How to serve raw markdown from static Astro pages for AI agents using HTTP content negotiation and Netlify Edge Functions.
tech: [astro, typescript, netlify]
updatedAt: 2026-03-08T00:00:00-05:00
gitHub: https://github.com/ChrisLaRocque/astrofolio
site: https://www.larocque.dev/
---

## TLDR

Project pages on this site now return raw markdown (no frontmatter) when you send `Accept: text/markdown`. Same URL, different content — the project pages themselves didn't need to change at all.

```bash
curl -H "Accept: text/markdown" https://larocque.dev/projects/larocque-dev-astro
```

## Why bother

Honestly this started as a "wouldn't it be neat" thought. LLMs and other tooling that wants to consume the content of a page without dealing with HTML would have a much better time getting back clean markdown. [Content negotiation](https://developer.mozilla.org/en-US/docs/Web/HTTP/Content_negotiation) — using the [`Accept` header](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept) to serve different formats from the same URL — felt like the right pattern: the URL stays canonical, and clients just ask for what they want.

## The constraint: this site is static

The project pages are [prerendered at build time by Astro](https://docs.astro.build/en/basics/rendering-modes/#pre-rendered). Static pages don't receive HTTP requests at runtime — they're just files on a CDN. So there's no place to check an incoming `Accept` header in a static `.astro` file.

The obvious fix would be to convert project pages to SSR (server-side rendering), but that felt like overkill. I'd be moving all that page-rendering complexity into a serverless function just to add a header check. There's a better way.

## Two pieces that work together

### A static markdown endpoint

First, generate the markdown at build time. A [static API endpoint](https://docs.astro.build/en/guides/endpoints/#static-file-endpoints) in Astro with the right filename becomes a prerendered file served from the CDN:

```typescript
// src/pages/projects/[...slug].md.ts
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
```

`entry.body` is [Astro's built-in property on content collection entries](https://docs.astro.build/en/reference/modules/astro-content/#body) — raw markdown with frontmatter already stripped. This generates `/projects/[slug].md` files at build time, accessible as static assets on the CDN.

### A Netlify Edge Function to intercept requests

Static files are served before any server-side logic runs. The fix: a [Netlify Edge Function](https://docs.netlify.com/edge-functions/overview/) that intercepts requests to `/projects/*`, checks the `Accept` header, and fetches the pre-built `.md` file if markdown was requested.

```typescript
// netlify/edge-functions/markdown-negotiation.ts
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
```

The edge function runs before Netlify's CDN serves any response, so it can intercept requests to fully prerendered static pages. If `Accept` doesn't include `text/markdown` — or if no `.md` file exists for the slug — it falls through to `context.next()` and the normal HTML page is served.

## What this required from the Astro config

Adding [`@astrojs/netlify`](https://docs.astro.build/en/guides/integrations-guide/netlify/) as an adapter. That's it — in Astro 5, `output: 'static'` is the default and already supports a mix of prerendered pages and edge functions. No hybrid mode flag, no opting individual pages into SSR.

```js
// astro.config.mjs
import netlify from '@astrojs/netlify';

export default defineConfig({
  adapter: netlify(),
  // ...everything else unchanged
});
```

The project pages themselves are untouched.
