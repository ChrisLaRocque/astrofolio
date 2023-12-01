---
title: GitHub
description: Harnessed for productivity. Designed for collaboration. Celebrated for built-in security. GitHub is the platform developers love.
homepage: https://github.com/
---

Basically everyone in tech has been thrown through the gears of GitHub.

## GitKraken + GitHub Desktop

I feel like the discourse on CLI vs GUI for git has died down enough for me to say: I love having a GUI for git and for major merges/refactoring I will never go back - they've dug me out of so many holes in my career.

## GitHub API

I used the GitHub API to show my contribution and gist info on my ["me" page](/me)

## GitHub Actions

No project has dug into it, but I used GitHub actions at Gatsby and Netlify to trigger cron jobs for sites.

### Ping webhook to bypass cold starts

Gatsby Cloud's CMS Preview infrastructure would keep the Gatsby build engine "hot and fresh" to be able to quickly respond to incoming content changes and rebuild the appropriate pages in response to those changes. After 60 minutes of inactivity this service would spin down to save Gatsby operating costs, but if you're on a team making edits every 45 minutes to an hour, this just meant you had a frustratingly slow time previewing content.

By setting up a cronjob that pinged the preview server webhook every hour we were able to allow teams to bypass this spinning down and still get the super fast content previews we sold them on.

### Automate branch parity

For various customers at Netlify it was useful to have a long-lived branch that was effectively a direct copy of their `main` branch. You can set up GitHub actions to automatically merge branch `a` into branch `b` anytime a commit is made to branch `a`. You can do a lot more like merging based on label or author, too.
