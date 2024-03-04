---
title: Building theconvergencebooks.com with Astro
description: Migrating theconvergencebooks.com from Wix to Astro+Tailwind
site: https://theconvergencebooks.com/
tech:
  [astro, netlify, tailwind-css, typescript, sanity, npm, github, html, css, javascript]
updatedAt: 2023-01-12T00:00:00-05:00
---

## Front end

This was my first real experience with Astro, and I quickly became a fan!

### Astro

I chose Astro for this project after tinkering with one of their starters a bit (prompted by what seems like a constant stream of new fans on webdev Twitter). My general ideology around building sites had been shifting towards 'as little client-side JS as possible' for the better part of the last year, and Astro seemed like a perfect way to head in that direction without forgoing some of the 'nice-to-haves' from modern framework DX.

### Tailwind

I had been using Tailwind for awhile to spin up pilot sites for folks at Gatsby, I knew I could quickly and easily spin up this site as well!

The built-in functionality and modifiers that Tailwind provides made it easy to do things like the splits on the homepage: the order of image vs text alternates on desktop, but matches when on mobile - all in 4 class names from Tailwind.

## Back end

I hosted the site on Netlify, partly because its a bitchin option, partly because I knew I could quickly and easily get redirects and forms up and running.

### Netlify forms

Netlify gives you the option to use their platform to [capture form submits](https://docs.netlify.com/forms/setup/). If you site is built on Netlify they crawl your rendered code for forms, and if any of those forms in clude the attribute `data-netlify` they set up the POST call and provision storage for your form submits.

I think this is maybe one of the most underrated featuers of Netlify. There are plenty of ways to build forms with JavaScript and get that information where it needs to go, and frameworks like [Remix are even trying to re-contextualize how most developers think of forms](https://remix.run/docs/en/v1/components/form), but for a basic 'contact' form I love Netlify forms for taking one more chunk of boilerplate of my literal plate.

### Netlify redirects

There were a few paths on the old site that while not 'incorrect', were just formatted in unexpected/inconsistent ways. As I 'slugified' the paths as part of this rebuild Netlify made it easy to make sure those old paths don't create 404s.
