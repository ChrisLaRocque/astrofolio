---
title: Switching my site from Nuxt to Astro
description: The process of taking my site from Nuxt to Astro, and how content collections replaced Contentful.
github: https://github.com/ChrisLaRocque/astrofolio
site: https://www.larocque.dev/
updatedAt: 2023-11-25T00:00:00-05:00
tech: [tailwind-css, astro, github, netlify, html, css, typescript]
---

I can't promise this will truly be a guide on porting a Nuxt site to Astro and all the potential pitfalls one may need to look out for. This is moreso "I rebuilt my Nuxt site in Astro without looking at the old code all that much".

## Why Astro

I honestly really enjoyed working with Nuxt, and would gladly do it again. I've been leaning towards Astro lately, it seems to be a nice evolution of the ideas that drew me to Gatsby (performance as a default), and the release of their content collections seemed like a 'lite' version of the Gatsby datalayer.

I think its worth mentioning that my previous site was built with Nuxt 2 and I have yet to give Nuxt 3 a proper look, this post/site is in no way an indictment of Nuxt!

## Removing Contentful

### Why?

When I first set up my portfolio site I built it with Contentful, as it was the CMS I had used most at that point and I've been able to squeeze more than my fair share of free accounts out of their free plan for all the projects I cook up. Frankly, I love Contentful when I just need a simple CMS.

My reason for pulling my site content out of Contentful and into my site repo's filesystem was purely about my own personal workflow preference. When my portfolio content was in a CMS I found myself not incredibly motivated to author posts frequently. I felt that having my posts be alongside my codebase would encourage me to write more as well as prompt more creative projects to be done on my personal site.

### Migration

'Migration' in this context is a fancy word for 'copy and pasting', which is exactly what I did. The only slightly tricky bit was recreating the fields in Contentful that represented relationships between pieces of content, but Frontmatter and Astro's content collections helped a bit.

## Astro and Content Collections

### Content collections and the config.ts file

In Astro you can create directories in `src/content/` that contain Markdown files, each directory becomes its own `collection` you can fetch in your page and component templates.

The `config.ts` file is a way to extend and customize the schema used by Frontmatter in your collections. Astro uses [zod](https://github.com/colinhacks/zod) to define and parse the fields used by Frontmatter.

### Frontmatter vs content modeling

All the posts were already written in Markdown, so their body content was copied over 'as-is'. As alluded to above, Contentful makes it pretty easy to create relationships between your entries, in this new Astro content collection setup I attempted to get as close as possible with their `config.ts` file for collections.

### Hacking together relationships

The main relationship I needed to recreate was between the only two content types I had: `project` and `tech` where the `project` entries has related `tech` that was used on the project.

I had 2 collections, one for each content type. In an ideal world I'd be able to read the entires in the `tech` collection and create an enum in `config.ts` to limit the options available to Frontmatter, and I mean techncially I could do that with `fs` but it also took all of 30 seconds to manually type them out, and probably about 30s of confusion when adding new pieces of tech in the future.

Here is the function I used to relate projects to different tech used on them:

```typescript
export function relatedProjects(allTech, allProjects) {
  allTech.forEach((tech) => {
    let relatedProjectCount = 0;
    for (let i = 0; i < allProjects.length; i++) {
      if (allProjects[i]?.data.tech.includes(tech.slug)) {
        relatedProjectCount += 1;
      }
    }
    return (tech.relatedProjectCount = relatedProjectCount);
  });
}
```

## Building a front-end

Good old Astro and Tailwind, baby!

### My weird 'little-to-no-JS' obsession

I actually kinda cut corners and wrote some JS where I could have used CSS, but as of late I've been trying to only bring client-side JS into my Astro components when _absolutely_ necessary. Tailwind has been huge in making this pipedream an even slightly possible reality (see the link to group modifiers below).

### TailwindCSS

Tailwind once again was the tool of choice for me to style a website. In my opinion it's excellent for getting things done quickly, but discovering features like their [group modifiers](https://tailwindcss.com/docs/hover-focus-and-other-states#styling-based-on-parent-state) remind me why its so heckin hyped these days (because it does cool shit!).

#### heroicons

All the UI-related icons are from [heroicons](https://heroicons.com/), made by the makers of Tailwind! They have libraries available for React and Vue, but my unhinged pursuit of no runtime framework led me to just copy and paste the SVGs.

#### Simple Icons

For all the brand logo SVGs I snagged what I could from [simpleicons.org](https://simpleicons.org/)

### Astro components

#### Built-in components

I used Astro's `<Picture>` component to take advantage of the image optimizations it does at build time.

#### My Astro components

This site has 4 components: `Dialog.astro`, `Icon.astro`, `Layout.astro`, and `Nav.astro`.

##### Dialog.astro

Currently not in use until I figure out a way to index my collections with Algolia, but the Dialog component will show the search UI.

##### Footer.astro

Holds links to my social accounts at the bottom of every page

##### Icon.astro

Used exclusively on the tech cards on the homepage, a nauseatingly verbose component that returns an SVG given a 'name'. I believe the performant way to do this would be an SVG sprite

##### Layout.astro

Exactly what you might imagine, adds the `Nav` and `Footer` to every page, includes some top-level classes for the body, and contains all the SEO meta tags.

##### Nav.astro

Navbar across the top of the site. The hamburger menu is one of my shame points for not implementing purely in CSS but why go and fix it when I can just mention it 3 times in this post?

### Analytics with Partytown

I love seeing Partytown being as quickly and widely adopted as it has been.

In what are probably insultingly simple terms: Partytown takes your traditionally 'heavy' 3rd party scripts (usually analytics) off the main JS thread for your page, basically freeing up that main thread to load the page that much faster for the user. [Gatsby's Script API](https://www.gatsbyjs.com/docs/reference/built-in-components/gatsby-script/) implemented it funny enough.

[Astro has their own integration with Partytown](https://docs.astro.build/en/guides/integrations-guide/partytown/) that's incredibly simple to get going. I ended up using that to load ye olde gtag so I can tell what you, the reader, are thinking.

## Hosted on Netlify

I mean, seriously, where else would I host this garbage website?
