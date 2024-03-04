---
title: Remove 404 error for /service-worker.js in local development
description: Various frameworks will show a 404 in the console for a /service-worker.js file, here's how to remove that lil jerk.
tech:
  [next-js, astro, javascript, nuxt]
updatedAt: 2024-03-04T00:00:00-05:00
---
## TLDR: How to remove the 404
All credit to [sourcegr on GitHub](https://github.com/sveltejs/kit/issues/3159#issuecomment-1314986378) for the fix
1. Navigate to [`chrome://serviceworker-internals/`](chrome://serviceworker-internals/) in your browser
2. CMD+F for the port you're seeing the 404 on (in my case localhost:4321).
3. Click 'Unregister'

Bada-bing! If you restart your dev server that 404 should now be gone from the console. If some part of your app is actually using the service worker it will be re-added to the list when you start the server back up, but your dev server will spin up and look to the correct service worker so you no longer see a 404.

## Background
When developing locally in different frameworks, I kept seeing a pesky 404 showing up in my logs:
```bash
13:48:23 [404] /service-worker.js 3ms
```

This 404 started popping up after I upgraded my site from Astro v2 to v4, and was slighly anxiety inducing! In my Astro site I was using [Partytown](https://partytown.builder.io/), which I know leverages service workers for loading 3rd party scripts performantly. However it wasn't just my Astro site, NextJS apps running at `localhost:3000` were also showing this 404, and some research showed it wasn't just me getting this type of error, so what the heck was up?
### Only happening locally
I took a peek at my Chrome dev tools Network tab on my live site, and there were no 404s to be seen, and Google analytics was getting info from Partytown just fine!
### Chrome stores past service workers
Chrome keeps a record of all the service workers it's interacted with at [`chrome://serviceworker-internals/`](chrome://serviceworker-internals/). Because I had used service workers with Partytown in both v2 and v4 of Astro, I had 2 past service workers; one for each localhost port (before v4 Astro used port 3000, v4 switched to port 4321). Astro previously using port 3000 explained why I was seeing the service worker 404 when using NextJS apps at port 3000.
### Unregistering service workers
Each service worker in the list at `chrome://serviceworker-internals/` should include an 'Unregister' button which will allow you to remove the service worker from being queried when you visit the URL depending on it. If your app is relying on a service worker, it will be recreated and added back to the list when you restart your app. 