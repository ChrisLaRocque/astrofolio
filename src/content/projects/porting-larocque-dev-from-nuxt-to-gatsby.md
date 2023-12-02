---
title: Porting LaRocque.dev from Nuxt to Gatsby
description: How to migrate a Nuxt app over to Gatsby.
tech:
  [
    gatsby,
    contentful,
    graphql,
    html,
    javascript,
    github,
    react,
    npm,
    nodejs,
    sass,
  ]
site: https://gatsby.larocque.dev/
updatedAt: 2022-01-31T00:00:00-05:00
gitHub: https://github.com/ChrisLaRocque/jortfolio-port
---

You can check out the progress + performance of these in the real world:
[https://gatsby.larocque.dev/](https://gatsby.larocque.dev/ "LaRocque.dev built on Gatsby and hosted on Gatsby Cloud")
[https://nuxt.larocque.dev/](https://nuxt.larocque.dev/ "LaRocque.dev built on Nuxt and hosted on Netlify")

## Porting

### Using gatsby-starter-default

I started with the [gatsby-starter-default](https://github.com/gatsbyjs/gatsby-starter-default "Gatsby starter default template on github") template to get things up and running quickly.
![Screen Shot 2022-01-28 at 3.14.57 AM](//images.ctfassets.net/i1trowbjm312/60HHw7E5JPKw2J28LJ4jgT/9f4b78a58f63ad0fa31fedf8e9e7c3bb/Screen_Shot_2022-01-28_at_3.14.57_AM.png)

### gatsby-source-contentful

I think normally at this point I would get a template to a tolerable level visually with static info before feeding it dynamic data, but I spend plenty of time in React templates all day so I started with the source plugin, which required me to get `.env` files set up for API keys. Add the config options to `gatsby-config.js` + restart the ol' dev server to suddenly see larocque.dev content in the graphql explorer!
![Screen Shot 2022-01-28 at 3.13.36 AM](//images.ctfassets.net/i1trowbjm312/swV9Tg8SatfTZqvF9l4ZH/817c079d1d2f40ebe58459428e7bfaa4/Screen_Shot_2022-01-28_at_3.13.36_AM.png)

### Templates - one offs vs programatic

There are a few 'one-offs' on larocque.dev - the homepage, about me, etc. There are though mostly repeated templates for projects and tech I use. Gatsby's two main ways to build pages are largely perfect for these exact use cases: the `/pages` directory allows you to create your 'one-off' pages as React components with full access to the data layer set up during the build process, and the `createPages` call in `gatsby-node.js` allows us to take large sets of content and feel them individually to templates we specify.

TLDR: one-off pages are going in `/pages`, repeated templates are going in a `createPages` call.

#### createPages

I queried all of my project pages and tech pages to have some identifying information to feed the createPages call in `gatsby-node.js`. That whole enchillada looks like this:
![code](//images.ctfassets.net/i1trowbjm312/3GbEwumlo0YXMkl2NjQ7ca/3a76e52a7253e983c5f3c688e266a27f/code.png)

Then my `Project.jsx` file has a query to get the full page information from the slug, as well as the markup for those fields. This was somehow my first time interacting with `gatsby-plugin-transformer-remark`, which was super convenient and therefore infuriating as Brightcove has been parsing our markdown like fools this whole time....
![code](//images.ctfassets.net/i1trowbjm312/5P0ydWXxjqINqhdbFUg92B/3ee6326e1c0f71a26cf1fea5d86143f3/code.png)

The templates are mostly just a matter of copy + pasting the markup from my Vue components and finding all the `v-` operators to be swapped out for their React-y counterparts. As I went through the show/hide logic I was mapping those elements to the fields needed in the query like so:
![code](//images.ctfassets.net/i1trowbjm312/SjXCnMF9BQ64PYyUcL6zv/15cefdfec3b064d9a00a51485d3fb737/code.png)

### Quick and dirty test

After getting the template recreated in Gatsby and loading extraneous 'website stuff' (Bulma and gtag), I essentially had a 1:1 of a static Nuxt site on netlify vs a Gatsby site on Gatsby Cloud, and wooooooweeeee I'll take the boost!
Nuxt on Netlify:
![Screen Shot 2022-01-29 at 1.14.23 AM](//images.ctfassets.net/i1trowbjm312/4zv22kWU9Imtb6XRFUP94N/8b45908466f9bd7fd78176487baa4892/Screen_Shot_2022-01-29_at_1.14.23_AM.png)

Gatsby on Gatsby Cloud:
![Screen Shot 2022-01-29 at 1.14.16 AM](//images.ctfassets.net/i1trowbjm312/4j6u1u2AcPHOtKeDoXOAlq/b27dfeee9e9c16b0a87c9ebe1180dbb3/Screen_Shot_2022-01-29_at_1.14.16_AM.png)

Again this was a quick test with the project somewhat in-progress to see if my hunch was in the right direction, but so far so good and now that I've got my site in both basic React and Vue components it will make it easier to compare frameworks within those ...frameworks?

## DX in Gatsby vs Nuxt

Frankly I really enjoyed working in both frameworks. Setting my personal site up initially in Nuxt while working Gatsby all day for my "9-5" was a nice change to get myself into the Vue world, but re-building the site inside of Gatsby reminded me why I think its the best solution for building things in a scalable way.

In a separate article I'll detail setting up this site on Next.js which I personally found the least intuitive of the 3 between Gatsby, Nuxt, and Next, but that's for another day!

## Hosting

For the initial Nuxt app I hosted on Netlify as its what I use at work. For the Gatsby site I got set up on Gatsby Cloud and cursed whomever signed us up for Netlify, or at least didn't think to send our builds to Gatsby Cloud then forward along.

Without doing a thorough dive, it seems like Gatsby Cloud includes all the features of Netlify I use in my day-to-day at Brightcove. I also _really_ liked the automatic environment variable import that took place when I hooked up my Contentful environment.

## Conclusion

TLDR: It's a great time to be a developer. If I was asked to build anything for anyone in React I would choose Gatsby - the unified data layer + plugin ecosystem compared to competitors give me confidence I could scale the app as needed.
