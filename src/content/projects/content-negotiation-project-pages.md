---
title: Content negotiation on project pages
description: Returning raw markdown from Astro project pages when the Accept header asks for it.
tech: [astro, typescript, netlify]
updatedAt: 2026-03-08T00:00:00-05:00
gitHub: https://github.com/ChrisLaRocque/astrofolio
site: https://www.larocque.dev/
---

## TLDR

Project pages on this site now return raw markdown (no frontmatter) when you send `Accept: text/markdown`. Implemented with Astro middleware — project pages themselves didn't need to change at all.

```bash
curl -H "Accept: text/markdown" https://larocque.dev/projects/larocque-dev-astro
```

## Why bother

Honestly this started as a "wouldn't it be neat" thought. LLMs and other tooling that wants to consume the content of a page without dealing with HTML would have a much better time getting back clean markdown. Content negotiation — using the `Accept` header to serve different formats from the same URL — felt like the right pattern: the URL stays canonical, and clients just ask for what they want.

## The constraint: this site is static

The project pages are prerendered at build time by Astro. Static pages don't receive HTTP requests at runtime — they're just files on a CDN. So there's no place to check an incoming `Accept` header in a static `.astro` file.

The obvious fix would be to convert project pages to SSR (server-side rendering), but that felt like overkill. I'd be moving all that page-rendering complexity into a serverless function just to add a header check. There's a better way.

## Middleware to the rescue

Astro has a middleware system that lets you intercept requests before they hit your pages. When you use the `@astrojs/netlify` adapter, that middleware gets deployed as a Netlify Edge Function — meaning it runs at the edge, before Netlify serves any response, including responses from the CDN for prerendered static files.

That's the key insight: middleware can intercept requests to fully static pages.

```typescript
// src/middleware.ts
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
```

`import.meta.glob` is a Vite feature that bundles all matching files at build time — the file contents are embedded in the edge function bundle, so there's no filesystem access needed at runtime. This matters because the Netlify Edge Runtime is Deno-based and Astro's content collection runtime (`getEntry`) isn't available there. Stripping frontmatter manually takes about four lines.

If no loader is found for the slug, the middleware falls through to `next()` and the normal page handles it.

The project pages themselves are untouched.

## What this required from the Astro config

Adding `@astrojs/netlify` as an adapter. That's it — in Astro 5, `output: 'static'` is the default and already supports a mix of prerendered pages and middleware. No hybrid mode flag, no opting individual pages into SSR.

```js
// astro.config.mjs
import netlify from '@astrojs/netlify';

export default defineConfig({
  adapter: netlify(),
  // ...everything else unchanged
});
```
