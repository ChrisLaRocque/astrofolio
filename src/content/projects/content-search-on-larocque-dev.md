---
title: Content search with Nuxt, Algolia, and Contentful
description: I wanted folks to be able to search for pages on my website
site: https://larocque.dev
tech:
    [
        vue,
        bulma,
        contentful,
        css,
        github,
        html,
        javascript,
        netlify,
        npm,
        nuxt,
        sass,
    ]
updatedAt: 2022-11-03
gitHub: https://github.com/ChrisLaRocque/jortfolio
---

## Intro

If you&apos;re looking to cut to the nitty gritty of indexing Contentful content in Aloglia and then searching that index in your Nuxt site I've included the links to the guides I followed below. There should also be a &quot;Github for project&quot; link in the sidebar.

-   [Index Contentful content with Algolia](https://www.contentful.com/developers/docs/tutorials/general/enhancing-search-experience-with-algolia/)
-   [Getting started with Vue Instantsearch](https://www.algolia.com/doc/guides/building-search-ui/getting-started/vue/#build-a-simple-ui)

## How I'd seen search done before

I'd inherited 2 sections of brightcove.com with search functionality on them, both implemented entirely different ways...

Approach #1 was just a little helper script written by the team that essentially said 'given a search query and an array of page data nodes, return the id of the nodes where the body text includes the query text'. It was hacky, poor in terms of performance, and not super thorough, but the scope of what was being searched was limited enough that it worked well for the use case.

Approach #2 was using a service called Swiftype. Switftype crawls your live site content, indexes it, and allows you to access that index via their API. This approach is nice because its automated. Its not so nice because it indexes everything on the front end of my site, so common elements (navigation for example) get indexed for every page unless I explicitly add attributes to their markup.

I wanted to find a service that did the best of both and test it out on [larocque.dev](https://www.larocque.dev/). When I say best of both I mean automated, but with a limited-by-default and easily defineable scope of what to index.

I can't say I did a ton of research into search engine services to find the absolute best, I just happened to find information about integrating Aloglia quickly into the process and their integration seemed simple to get running. Also they had a continually free plan so here we go!

## Implementing Algolia

At the time of writing this (May 2022) [Algolia's pricing page](https://www.algolia.com/pricing/) says 'Forever free', so I snagged an account

### Getting Contentful entries indexed by Algolia

I ended up using the webhook approach outlined in [this doc](https://www.contentful.com/developers/docs/tutorials/general/enhancing-search-experience-with-algolia/). The Contentful webhooks page for your space has 'Webhook Templates', one of which lets you send content to Algolia as it gets published. Now all new entries will get indexed as they come online, and a simple batch unpublish+republish indexed the current content.

### Setting searchable parameters

With the webhook set up, Algolia will automatically index everything sent to it from Contentful, but you configure what fields it searches through when you start sending requests to their API. By going to the 'Configure' tab in Algolia I was able to specify that I care about my entry `title`, `body`, and `relatedTech`, the rest can be ignored.

## Getting and showing results

Algolia has an SDK similar to Contentful, you just initialize a client with an API key and then can reuse the client for requests to their API.

### SearchBox component

The component for search itself was built with the [`algoliasearch/lite`](https://www.npmjs.com/package/algoliasearch) for the client and [`vue-instantsearch`](https://www.algolia.com/doc/guides/building-search-ui/what-is-instantsearch/vue/) for the components.

#### `<script>`

![script-tag](//images.ctfassets.net/i1trowbjm312/15MZfqNdEEHHo3Gzl4Czd3/33c47426fd33b5090e157816f600cad4/script-tag.png)

##### imports

Starting out we import 3 components from `vue-instantsearch`, the 'lite' search client from `algoliasearch/lite`, and the base styles for the 3 `vue-instantsearch` components:

```javascript
import { AisInstantSearch, AisSearchBox, AisHits } from "vue-instantsearch";
import algoliasearch from "algoliasearch/lite";
import "instantsearch.css/themes/satellite-min.css";
```

##### `components`

In the export script we include those 3 components as-is

```javascript
export default {
	components: {
		AisInstantSearch,
		AisSearchBox,
		AisHits,
	},
	///
};
```

##### `data()`

The returned `data()` function includes the search client, and a small object to lookup 'human' names for Contentful content types.

```javascript
data() {
  return {
    searchClient: algoliasearch(
      "APP_ID",
      "API_KEY"
    ),
    contentTypeLookup: {
      chrisProjectPage: "Project",
      tech: "Tech",
    },
  };
},
```

##### `methods`

The returned methods object includes a lookup similar to `contentTypeLookup` for getting the link paths based on the content type returned. Looking at this now I realize I could probably roll contentTypeLookup into this and return both pieces of info in an object.

```javascript
methods: {
  linkLookup: function (slug, contentType) {
    switch (contentType) {
      case "chrisProjectPage":
        return `projects/${slug}`;
      case "tech":
        return `tech/${slug}`;
      default:
        "/";
    }
  },
},
```

#### `<template>`

![template-tag](//images.ctfassets.net/i1trowbjm312/20yZFgASc2PCEN3j3WyBYV/77b62b259bec79dd980a03247dc77dd8/template-tag.png)

##### `<AisInstantSearch>`

```javascript
<AisInstantSearch :search-client="searchClient" index-name="larocque.dev">
```

The `<AisInstantSearch>` component is a wrapper for the suite of Algolia instant search components in `vue-instantsearch`. In my site I just imported `AisSearchBox` and `AisHits` but they have several other components available to extend functionality and UI.

`<AisInstantSearch>` takes a search cient (initialized in our `<script>`) and an index name. Now we have a component wired up to our Algolia index that can take children components that interact with and show that data.

##### `<AisSearchBox />`

```javascript
<AisSearchBox class="mt-3" />
```

The `<AisSearchBox />` component is super straightforward, passed as a child component it queries your Algolia index based on whatever text the user inputs.

##### `<AisHits>`

```javascript
<AisHits>
  <template #item="{ item }">
    <div class="card">
      <div class="card-content">
        <p class="subtitle has-text-grey is-size-5">
          {{ contentTypeLookup[item.sys.contentType.sys.id] }}
        </p>
        <p class="title has-text-weight-bold is-size-4">
          {{ item.fields.title["en-US"] }}
        </p>
        <div class="content">
          {{ item.fields.description["en-US"] }}
        </div>
      </div>
      <footer class="card-footer">
        <NuxtLink
          :to="
            linkLookup(
              item.fields.slug['en-US'],
              item.sys.contentType.sys.id
            )
          "
          class="card-footer-item"
          >{{
            `${contentTypeLookup[item.sys.contentType.sys.id]} page for ${
              item.fields.title["en-US"]
            }`
          }}</NuxtLink
        >
      </footer>
    </div>
  </template>
</AisHits>
```

`<AisHits>` besides being a descriptor for futuristic robotic waste, serves as a way to define a template to be used for each of your search results. Here you can see how `contentTypeLookup` and `linkLookup()` end up being used.

### Search page

![searchpage](//images.ctfassets.net/i1trowbjm312/xE4FjGBpXk6tcSj3nmg3t/a6841a1808d08473f403f2b8668e999f/searchpage.png)

The page this is all rendered on is super simple, just a `<Hero>` and the `<SearchBox />` component we just build. Bada bing!
