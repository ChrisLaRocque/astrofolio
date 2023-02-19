---
title: Gatsby
description: Build a fast, secure, and powerful website using Gatsby's React-based, open-source framework.
homepage: https://www.gatsbyjs.com/
---

Building with Gatsby daily since 2020. If you _need_ to be using React but want a site that feels snappy + gives you bomb Lighthouse scores, Gatsby is the way. Things may have changed but when I tested around 2021 building the same site with Next vs Gatsby I got a higher Lighthouse score on the Gatsby site.

## GraphQL datalayer

Gatsby's datalayer is definitely one of the major DX perks of the platform I most often find myself missing when building with other tools. You tell Gatsby what 'source-plugins' you care about, and it dumps all that content into a queryable virtual database for all your statically rendered components. I find the datalayer helps in 2 major ways:

1. **Clearer DX mental model:** Your queries and fragments show up directly in the code for your page + component templates. Instead of traversing your components to find where the 'parent' page fetches and feeds data to its children, you can see exactly what from your sources your components are relying on.
2. **No more `/api` folder for fetching from your CMS:** Most sites have repeated boilerplate for fetching against their CMS. Some folks like having that hands-on control of how data comes back from your CMS, but for most folks just looking to get going on building UIs the datalayer allows you to skip the setup and maintenance of these API connections. It also helps that the source plugin ecosystem is maintained by the vendors for these platforms - you literally have the subject matter experts writing your data fetching code for you.

## Plugins

Arguably Gatsby's biggest feature/contribution to the framework ecosystem. 99% of the time if you're looking to do something with Gatsby somebody has hit the same issue and made a plugin for it. Not only are plugins great for getting you further faster, but they're composable: you can build plugins that leverage other plugins to give your site superpowers.
