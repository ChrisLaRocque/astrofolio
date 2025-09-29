---
title: Add a copy button to code blocks in Astro
description: How to add a copy button to code blocks in your Astro project's markdown files.
tech: [astro, javascript, npm]
updatedAt: 2025-09-28T00:00:00-05:00
---

## TLDR: Use Expressive Code

I considered writing a client-side script that would find all my code blocks and use the [Navigator.clipboard API](https://developer.mozilla.org/en-US/docs/Web/API/Navigator) to add the block's content to the user's clipboard, but Expressive Code just does it for me so...

1. Run `npx astro add astro-expressive-code`. The `astro add` command will automatically install the package and add it to your config.
2. If you're using MDX the plugin may be added after your `mdx()` plugin definition. You'll need to move the `expressiveCode()` plugin above `mdx()`.
