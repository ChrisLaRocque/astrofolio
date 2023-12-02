---
title: Gatsby v3 migration
description: Migrating a Gatsby v2 site to v3 and pitfalls to look out for.
site: https://www.brightcove.com/en/
tech:
  [
    contentful,
    css,
    gatsby,
    github,
    html,
    javascript,
    netlify,
    nodejs,
    npm,
    react,
    sass,
  ]
updatedAt: 2021-12-12T00:00:00-05:00
---

The migration from Gatsby v2 to v3 was mostly a matter of following the [migration guide](https://www.gatsbyjs.com/docs/reference/release-notes/migrating-from-v2-to-v3/ "Gatsby v2 to v3 migration guide") with some surprises sprinkled in to make me feel alive/doubt everything I am.

The primary 'gotchas' were around the new minimal node version required for Gatsby v3, which triggered the need for a new sitemap package among other tweaks. The site was on 12.9.1, whereas v3 required 12.13.0 minimum. Updating the node version and related dependencies was relatively simple, just a matter of running `npm outdated` and going through the list. Some packages like fs and node-fetch needed to remain at their "outdated" version to maintain compatibility.

### gatsby-plugin-image

One of the primary selling points of v3 was the introduction of the new `gatsby-plugin-image` from the initial `gatsby-image`. Gatsby provided a codemod to scan through queries it could find and update them appropriately, but for whatever reason it missed most of our in-page and component level queries. Luckily both plugins were/are still supported in Gatsby, so we were able to leave the old plugin in place and make the migration of image serving a ticket for another time.

### New sitemap package

The v3 migration broke our usage of `gatsby-plugin-sitemap`. Previously I had set up custom serializers for sitemap generation based on our content types in Contentful, but it was a pretty basic mapping, largely just making sure names of fields matched up and went where the plugin was expecting. Diving into the sitemap errors revealed 3 issues:

1. During the build process we weren't passing the right set of info to the `createPage` call, we'd need to remedy these first.
2. Gatsby had unified the naming convention of the context passed to `createPage`, breaking the current sitemap plugin.
3. Our sitemap at that time was lacking fields Google calls out as helpful in their [documentation](https://developers.google.com/search/docs/advanced/sitemaps/build-sitemap "Google sitemap documentation").

Issue 1 was simple enough. Gatsby prefers 'lighter' queries of identifiable info to take place in `gatsby-node.js`, with the 'heavier' content queries taking place in the page JSX template and its children components. Up until this point Brightcove had been querying everything in `gatsby-node.js` and passing that info along to the templates. I compared the queries in `gatsby-node.js` with what was put in the templates (for reasons that evade me!), made sure everything was showing up in the page-level queries, and then stripped the `gatsby-node.js` queries to just the fields needed to build the pages and generate the sitemap. Refactoring our queries helped carve out about 1/3 of our site build time. We ended up passing the page's slug, updatedAt, and locale to the `createPage` context, along with all the typical Gatsby info (template, path, etc...).

Issue 2 was as simple as updating my serializer. Previously the `pageContext` and `context` objects were interchangeable in the build process, but v3 unified the naming convention to 'pageContext'.

Issue 3 led me to finding the `gatsby-plugin-advanced-sitemap` made by the Ghost team, which I forked and used as a starting point for the new Brightcove.com sitemap. The package was already in the direction of Google's docs - changefreq and priority were omitted as they are not considered when being crawled, but lastmod and image info were present. I took the Ghost version of the plugin, modified the queries it was using to more closely match our Contentful environment, and added the ability to include all the language versions of our pages (brightcove.com is served in English, German, Spanish, French, Japanese, and Korean) per [Google's reccomendations for localized sitemaps](https://developers.google.com/search/docs/advanced/crawling/localized-versions "Google's reccomendations for localized sitemaps"). This led to a somewhat obvious uptick in discovered URLs in Google search console, as all of our multi-language pages were more easily being indexed when crawled.
