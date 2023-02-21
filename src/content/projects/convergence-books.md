---
title: Building theconvergencebooks.com with Astro
description: My partner and her sister are in the middle of writing and self-publishing a YA book series, and I got to build their website with Astro and Tailwind.
site: https://theconvergencebooks.com/
tech:
    [
        astro,
        netlify,
        tailwind-css,
        typescript,
        npm,
        github,
        html,
        css,
        javascript,
    ]
updatedAt: 2023-01-12
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

### Netlify redirects
