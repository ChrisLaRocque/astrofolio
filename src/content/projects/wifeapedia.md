---
title: Wifeapedia
description: Building a wiki for TV show Wifeswap in Nuxt backed by Contentful.
updatedAt: 2022-01-17T00:00:00-05:00
gitHub: https://github.com/ChrisLaRocque/wifeapedia
site: https://wifeapedia.com/
tech:
  [
    contentful,
    css,
    github,
    html,
    javascript,
    netlify,
    npm,
    nuxt,
    tailwind-css,
    vue,
    sass,
  ]
---

I hit a bit of a reality TV kick in the summer of 2021. After being impressed by the [Love Island UK wiki](https://loveisland.fandom.com/wiki/Love_Island_Wiki) I was deeply disappointed to find Wife Swap had yet to be given the wiki treatment.

<div style="width:100%;height:0;padding-bottom:57%;position:relative; margin-bottom:15px"><iframe src="https://giphy.com/embed/5bHIZ3ok4UpJS" width="100%" height="100%" style="position:absolute" frameBorder="0" class="giphy-embed" allowFullScreen></iframe></div>

Working on statically generated React (Gatsby) all day at Brightcove I figured it would be a fun change-up to do client-side Vue (Nuxt). I'm comfortable wiring Contentful up to pretty much anything JS based so figured might as well remove another few hours of learning and go with what I know.

## Setting up content types

The current wifeapedia.com has _several_ content types all cross-referencing each other, but I started with 2 initial content types: Episodes and Seasons. Both have an assortment of text fields (name, description, dates aired, number), and then each season references the collection of episodes it covers. Getting the info from Contentful into Nuxt was straightforward, [Contentful has a handy guide](https://www.contentful.com/developers/docs/javascript/tutorials/integrate-contentful-with-vue-and-nuxt/ "Integrating Contentful with Nuxt"), so once I got the API response showing up in my templates it was a matter of parsing + feeding that data to my components.

## Nuxt
