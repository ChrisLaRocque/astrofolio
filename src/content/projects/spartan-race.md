---
title: Spartan.com rebuild
description: Rebuilding Spartan.com from a legacy Angular app to Phoenix(Elixir) + Vue.
tech: [gitlab, vue, sass, javascript, html]
updatedAt: 2020-05-01T00:00:00-05:00
---

## The new spartan.com

I was the most junior member on the team that rebuilt spartan.com from headless Wordpress with an Angular front-end to:

- Contentful for content
- A new proprietary in-house event management app for all event data
- Phoenix front-end with Vue+SASS for the UI

Looking at their site now it seems that's all gone, but it was a fun project with an excellent team who I learned a ton from.

### Vue

Phoenix ran most of the configuration and logic behind the front-end of the site, but the actual components were all written in Vue. This time in my life kicked off a love for Vue that lasts to this day, despite all my professional work for the last ~5 years being primarily React focused.

### SASS

This project implemented the best organization for component styles I've seen to date. It was incredibly easy to look at markup or stylesheets and know exactly where you were and what something did. Part of the ease of use for this repo was definitely the syntax offered by SASS, most of which has been rolled into CSS by now. It also helped that the design lead paid close attention when folks modified the stylesheets to ensure everything stayed up to snuff.

#### BEM

Another reason why this project was so easy to navigate was every component having scoped styles written following the [BEM methodology](https://getbem.com/introduction/).
