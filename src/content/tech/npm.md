---
title: NPM
description: Relied upon by more than 11 million developers worldwide, npm is committed to making JavaScript development elegant, productive, and safe.
homepage: https://www.npmjs.com/
---

Every project in my professional or personal life has involved npm.

## Publishing my own packages

I've created and maintained a few packages on NPM.

### gatsby-transformer-markdoc

Markdoc was built by the team at Stripe, and is designed to create documentation sites with React. Their file syntax similar to MDX, where you're able to use custom components alongside Markdown. Markdocs official examples all use their Next plugin which modifies their webpack config to make everything play nice. I built `gatsby-transformer-markdoc` to allow folks to achieve the same functionality in a Gatsby site, or render Markdoc content 'on the fly' via a built-in component.

### gatsby-update

Updating Gatsby dependencies had historically been a manual process. I wrote this script to allow folks to run the related npx command from their Gatsby site and have all their Gatsby specific plugins updated to `@latest`.

### gatsby-plugin-i18n-config

Gatsby has some excellent plugins for handling i18n, but I found none were as clear to implement as what Next.js has built in, so I created this plugin as a way to leverage the best of the various Gatsby i18n plugins while using the Next.js config format.

### gatsby-plugin-advanced-sitemap-modest

Took the `gatsby-plugin-advanced-sitemap` plugin built by the Ghost team and modified it a bit for Brightcove's needs. [https://www.gatsbyjs.com/plugins/gatsby-plugin-advanced-sitemap-modest/?=advanced-sitemap](https://www.gatsbyjs.com/plugins/gatsby-plugin-advanced-sitemap-modest/?=advanced-sitemap)

### slidev-theme-netlify

A Netlify specific theme for use with [Slidev](https://sli.dev/), a cool presentations-as-code tool built by [@antfu](https://github.com/antfu)

### gatsby-theme-\*

I've created a few Gatsby themes for customers, all of which inevitably end up published to NPM.
