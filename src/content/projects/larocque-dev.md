---
title: LaRocque.dev v1
description: Building a portfolio site with Nuxt, Bulma, and Contentful.
tech: [nuxt, contentful, github, netlify, vue, bulma, html, css, npm, sass]
updatedAt: 2022-05-08
site: https://nuxt.larocque.dev/
gitHub: https://github.com/ChrisLaRocque/jortfolio
---

This one might be sloppy, trying to largely get everything up quick.

## Overview

Having recently used Nuxt/Netlify/Contentful for Wifeapedia and liking it, I stuck with it. I started with a 'projectPage' content type in Contentful that covered most of my bases, but eventually added a 'tech' content type as well so I could highlight/split out my experience by technology used. I could have technically merged these 2 down to the same 'workExperience' content type (arbitrary example name), with an 'experienceType' selection to differentiate but like I said: quick & dirty. I had a basic pages directory to cover a homepage, relevant 'list' and 'detail' pages for project and tech content types, and a general 'about' page.

## Defining and setting up content types

![identical-my-cousin-vinny](//images.ctfassets.net/i1trowbjm312/7o0ZBFDyBgPYkeqaj7h5Qq/d3b5ff633894622c8c130370832ebd49/identical-my-cousin-vinny.gif)
I had two essentially identical content types: `projectPage` and `tech`, where `projectPage` covered a development project I've worked on and `tech` was a more general page for the different technologies I used on the projects so prospective employers could see only my React stuff, etc.

### Project pages

Here's the content model I set up for project pages in Contentful:
![Project page content model in Contentful](//images.ctfassets.net/i1trowbjm312/7n1LTEiQzjqYHD6Ifogsbi/7a5142c787bcce6ac0b51df6e83cad74/Screen_Shot_2021-12-12_at_1.39.10_PM.png)

Here's a breakdown of the fields and their purpose:

| Field            | Description                                                  |
| ---------------- | ------------------------------------------------------------ |
| Title            | Name of the project                                          |
| Description      | Shorter overview for link card previews                      |
| Slug             | Used to define the url (larocque.dev/projects/_project-slug_ |
| Body             | Description of the work I did                                |
| Site             | Live example of the project                                  |
| Related projects | Projects using similar tech or on the same website           |
| Tech             | The tech used when building the project                      |
| Github link      | Link to github for project if available                      |

### Tech pages

Largely identical set of info to the project page, and I could have absolutely just used a `projectPage` with a new `infoType` field to select between `project` or `tech`, but I have something like 40 content types left before I have to pay Contentful, so I split them up.

Screenshot of the tech content type fields:
![Tech content model](//images.ctfassets.net/i1trowbjm312/5tXdYDyiXKblmXSU6lBdJk/bec37ec0df33a694073ba7c25a1c35c2/Screen_Shot_2021-12-12_at_2.34.02_PM.png)

And a table of the fields:

| Field         | Description                                                               |
| ------------- | ------------------------------------------------------------------------- |
| Title         | The title of the entry for internal search and reference                  |
| Name          | The 'display name', the actual name of the item as it appears on the site |
| Slug          | Used to define the url (larocque.dev/tech/_tech-slug_                     |
| Description   | Shorter overview for link card previews                                   |
| Experience    | More comprehensive breakdown of how I've used the technology              |
| Homepage      | Link to the homepage/general point of reference for the tech              |
| Related links | Unused at the moment                                                      |

## Pages and default layout

I set up the pages directory as follows:
![pages directory for larocque.dev](//images.ctfassets.net/i1trowbjm312/6VWm77pmrCnZLQRw26Wd2i/c4c94fddbae4a11a34dd72bc5b771358/Screen_Shot_2021-12-12_at_2.45.48_PM.png)

There's an `index.vue` for the homepage, and 3 directories: `/me`, `/projects`, and `/tech`, each with their own `index.vue` for their top-level pages. `/projects` and `/tech` also have dynamic page templates from Nuxt (`_project.vue` and `_tech.vue`) to account for slugs passed to those routes.

### Static/list pages

...'static' of course being a loose way for me to say 'not dependent on a dynamic slug' &#128526;

The homepage, `/projects`, and `/tech` have pretty similar markup, there's a Bulma hero component fed static props, and a tweaked Bulma card component fed data from the content types in Contentful.

Here's the `<template>` and `<script>` sections from my `index.vue`. Surprisingly simple! The Contentful client is set up basically precisely like their [integration guide](https://www.contentful.com/developers/docs/javascript/tutorials/integrate-contentful-with-vue-and-nuxt/ "Contentful Nuxt integration guide").
Homepage template:
![larocque.dev homepage index.vue template](//images.ctfassets.net/i1trowbjm312/6gLlRgOAMIKi93rFAYNph3/c030a61ad678fc69140570fbf180f574/homepageTemplate.png)
Homepage script:
![larocque.dev homepage index.vue scripts](//images.ctfassets.net/i1trowbjm312/4XUKaHFKEVTjXWOyOCtHfr/fbf8fb7c756c30f5f3894a081074a85b/homepageScript.png)

The script section gets the info for the 2 `Cards` components from Contentful, and I feed some strings to the `Hero`.

### Dynamic pages

## Bulma and components

I used Bulma on this guy after getting annoyed that Tailwind added _most_ of the file size to Wifeapedia, but this could definitely be something I configured wrong when adding Tailwind (update I didn't set up tree-shaking). I also believe Tailwind has since come out with v3 with does JIT to only build what you're using. Regardless I liked Bulma's naming conventions and default styling a bit more so here we are...

## Frickin' ESLint and Prettier

This was surprisingly more of a pain than I anticipated
