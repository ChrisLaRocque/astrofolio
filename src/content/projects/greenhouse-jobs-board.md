---
title: Greenhouse jobs board
description: How to create a client-side Greenhouse jobs board inside a Gatsby site.
tech: [gatsby, github, html, javascript, netlify, npm, react, sass]
site: https://www.brightcove.com/en/company/careers/open-positions/
updatedAt: 2021-12-09T00:00:00-05:00
---

Brightcove's talent acquisition team needed a way to update the [open positions page on brightcove.com](https://www.brightcove.com/en/company/careers/open-positions "Brightcove.com open positions page") automatically any time they made changes in Greenhouse. I technically _could_ have set up a build webhook in Netlify that watched Greenhouse for changes and built the site as things were published, but there are like 12 people in Greenhouse making updates at any one time, and Netlify bills per build minute so...

## Client route setup

Client side routes IT IS. Gatsby makes it pretty easy to handle this with [`@reach/router`](https://www.gatsbyjs.com/docs/reach-router-and-gatsby/ "Gatsby @reach/router docs"). `@reach/router` is similar to `react-router` is similar to the Nuxt file directory structure this site is built on. Below is a screenshot of the directory structure to generate https://brightcove.com/en/company/careers/open-positions, where `[lang]` is one of 6 we serve the site in, and `[...].jsx` acts as the index file for /open-positions, as well as a wildcard for anything that may follow that route (like the job listing IDs!).

![Screen Shot 2021-12-09 at 2.37.07 AM](//images.ctfassets.net/i1trowbjm312/7DPoaxMf0JCbyVTgHz1pzc/250039fb4edb197fa7ed0c9d9267828d/Screen_Shot_2021-12-09_at_2.37.07_AM.png)

And this is how the router is set up to account for that, an `OpenPositions` component at the `basepath`, and a `Job` component watching for any job ID number that gets appended to the basepath.

![router](//images.ctfassets.net/i1trowbjm312/1Sy6dLKYdVus4zcU001iIZ/b64673bf29d76822a353a12460e56b7a/router.png)

## Getting the jobs from Greenhouse

This `axios` call is basically it, chief; then we update the `allJobs` state value. Is this web development?

![getJobs](//images.ctfassets.net/i1trowbjm312/2FJ1OLeJPav4HsOU609l0S/fe75e3219ad2b8fa0b2beb5ade35c2c8/getJobs.png)

## Mapping the jobs to a component

There's some global context management going on in the brightcove Gatsby app around setting and updating our filtered content (as this job board has filters for job department, location, etc), which while cool is not the point of this page - essentially a rambling way of saying for all intents and purposes `filteredContent` in this code === `allJobs`.

![contentList](//images.ctfassets.net/i1trowbjm312/4wq1vX37gmlQktYs2ZDCB0/cbd67e4fd8768e91bb14838e6fa08a6d/contentList.png)

Essentially I'm just mapping each job to a `Col`. We use `react-grid-system` throughout brightcove.com, so I place the `ContentList` in a `Row` and auto-magically things are mostly responsive (even though these `Col`'s are all set to 12 🤦). The built-in Gatsby `Link` component is used to point to the deeper individual job's page. The departments and offices come back from Greenhouse as an array of objects, so I'm accessing the name of each and `.join()`ing them all together with commas if there's more than 1. The component above ends up rendering this:

![Screen Shot 2021-12-09 at 11.06.43 AM](//images.ctfassets.net/i1trowbjm312/465DEFIiFykqGjVy0nletE/feb147cbc21b351ef5578521212dc78c/Screen_Shot_2021-12-09_at_11.06.43_AM.png)

For reference here's the component markup for the entire `OpenPositions` page:

![openPositions](//images.ctfassets.net/i1trowbjm312/HLKUrs5OSD9T8Yo65Nw3K/fd373058ef30009ce527b57b660bde98/openPositions.png)

The `Hero` is a component used throughout our site, it's exactly what it sounds like. `ContentFilter` again is a component used in several places that's relying on a more global context provider, but essentially it takes an array of items to sort and an array of `filterConfig` containing the values to filter the items by, and sets `filteredContent` based on those parameters. The following `Container`, `Row`, and `Col` components are tied to the `react-grid-system` pacakge I mentioned before, within which you can see the `<ContentList />` component I described above.

Bada-bing thats how you make a job board and get paid for it.
