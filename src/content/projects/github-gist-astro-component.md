---
title: Astro component for a list of GitHub gists
description: Using the GitHub JS client Octokit to fetch all gists for a user and render them using an Astro component.
site: https://larocque.dev/me
tech: [astro, tailwind-css, typescript, npm, github, html, css, javascript]
updatedAt: 2023-12-02
draft: true
---

## TLDR

### How it looks

### The code

```astro
<>yes</>
```

## Fetching list of Gists with Oktokit

### Generating a token

To generate a token:

1. Make sure you already have a `.env` file already created to paste your token in
2. Go to https://github.com/settings/tokens
3. Click 'Generate new token' > 'Generate new token (classic)'
4. Select `read:user` from the available permissions. You can set whatever you like for expiry and note.
5. Copy + paste the token directly to your `.env` file.

In my example I named the token `PUBLIC_GITHUB_KEY`. Note that in Astro specifically if we want to use an environment variable on the client we need to prefix it with `PUBLIC_`, if using another framework you may need to follow a similar convention.

### The `getGists` function

```typescript
const yes = "yes";
```

## Adding gist cards to the `gists` div

### Get names + extensions of files

### Creating the cards

#### Creating the a tags for each card

#### Adding the file name

#### Adding the description text

#### Adding `updatedAt` text

### Adding the card to the parent `gists` div
