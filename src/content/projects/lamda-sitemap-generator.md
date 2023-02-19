---
title: Lambda sitemap generator
description: Brightcove.com needed a reliable modern sitemap, and I didn't want it to add time to our Gatsby builds, so I made it a Netlify function!
site: https://www.brightcove.com/sitemap-index.xml
tech: [aws, contentful, gatsby, javascript, netlify, nodejs, npm]
updatedAt: 2021-12-20
---

When [migrating to Gatsby v3](https://larocque.dev/projects/gatsby-v3-migration "Gatsby v2 to v3 migration project") we ended up needing to swap our sitemap plugin because it was outdated both for our version of Gatsby, and Google had updated the fields they look for when crawling sitemaps. The `gatsby-plugin-advanced-sitemap-modest` Gatsby plugin I built during the v2 to v3 migration was a solid holdover, but if we ever want to move to v4 basically every convention the plugin relies upon will be deprecated, might as well fix it now.

## Netlify functions

Netlify offers [Netlify functions](https://www.netlify.com/products/functions/ "Netlify function product page"), which are (simply put) a more streamlined way to integrate AWS Lambda functions into your codebase and develop with them alongside your app (as well as a host of other things). Up to this point, Brightcove had already implemented them for form validation, site search, and most importantly for our blog's RSS feed, which is essentially a 'lite' version of what our sitemap is today.

## Sitemap city, population: me

Going into this project we had one `sitemap-index` with 4 sitemaps listed: `sitemap-posts`, `sitemap-press-releases`, `sitemap-pages`, and `sitemap-legacy-pages`. Previously we had 1 `sitemap-pages` covering all the content in these 4, but when we added [info about localized pages](https://developers.google.com/search/docs/advanced/crawling/localized-versions#sitemap "Google documentation on sitemap localization") to our sitemaps this sitemap file became huge. I wanted to break the sitemap into more manageable, organized directories, and felt like a sitemap index for each language, pointing to our various content types was the best path forward.

I feel like I'm pretty familiar with the Google sitemap docs, but anytime I have a question about something I'm _actually_ building it's in some engineer's tweeted response to someone looking for insight like when someone asks if nested sitemaps are supported:

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">No, it&#39;s not supported -- sorry :)</p>&mdash; 🧀 John 🧀 (@JohnMu) <a href="https://twitter.com/JohnMu/status/1326481165491048450?ref_src=twsrc%5Etfw">November 11, 2020</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

I wanted to essentially submit 6 sitemaps to Google via [Search Console](https://search.google.com/search-console/about "Google Search Console about page"), one for each language Brightcove.com is served in.

## Parsing content types and building feed

At a super high-level, Brightcove.com's content is either built from the `/pages/` directory, which usually contain a hodge-podge of content type queries to source all the appropriate and relevant info, or is fed 1:1 from a Contentful content type to a corresponding template via a `createPage` call in `gatsby-node.js`.

### Static(ish) pages

We had a small collection of pages in `/pages/` that I snagged the slugs for, as well as a set of archive webinar page info stored in a JSON object, so I declared and merged that info

![staticandwebinars](//images.ctfassets.net/i1trowbjm312/3KqxDaIxyPy55IHnG1izVL/0693f055252f33bcc3ec3ea0cef4d3d5/staticandwebinars.png)

### Everything else

For the rest of the pages the _actual_ process that happens when Gatsby builds our site is as follows:

1. We query a list of IDs for each published entry of a specific type
2. We feed those IDs (and a small subset of information including the page's path) to a `createPage` call
3. `createPage` calls a template made up of a React component and a GraphQL query and builds that page as HTML at the path specified

So I had to basically recreate up until the `createPage` call: use the path of the sitemap to determine what content type it was for (`sitemap-posts` vs `sitemap-pages`), query all published entries of that content, generate the appropriate URL information based on the type, slug, updated time, and lang. I had a pre-determined map of the content types I'd need to account for. Below is how I got the content type from the request path and fed the queried JSON content to a function that builds the XML feed. _Note: When doing this project I rendered all posts and press releases updated prior to October 20, 2020 as a static XML file, as they're largely old webpages that are not trafficked or updated, and there are such a large number that it significantly slowed the load time of these sitemaps_

![handler](//images.ctfassets.net/i1trowbjm312/74loZ7kCsnDHB4HRXqgxNC/57d28a4eee01be006f82ae2cafa56ef7/handler.png)

Here's that `buildFeed` function, which takes an array of entries and the content type, and gives you back the appropriate stringified XML:
![buildFeed](//images.ctfassets.net/i1trowbjm312/4ydIQRNKV63vdslW7SuEuc/9ad90c6fff5058af9131f065f2ac93e1/buildFeed.png)

And finally the 'under the hood' bit - the `stringify` function which is called on each entry passed to `buildFeed` to create the URL item for that entry in the sitemap, including the xhtml `alternate` fields to represent the localized version of each page.
![stringify](//images.ctfassets.net/i1trowbjm312/6Lt7rXPTPbwxQ4XQpbPKHj/df6143acaee411ad57161ce3b549ea59/stringify.png)

The main thing _not_ shown here is an entry parser that adds the `alts` field used in the `stringify` function. As every page that's _not_ in English on brightcove.com falls back to English if the specific lang is not translated, it's safe to assume every page published will have alternate versions, even if their translations have yet to be created.
