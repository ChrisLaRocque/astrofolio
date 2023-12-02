---
title: Astro component for a list of GitHub gists
description: Using the GitHub JS client Octokit to fetch all gists for a user and render them using an Astro component.
site: https://larocque.dev/me
tech: [astro, tailwind-css, typescript, npm, github, html, css, javascript]
updatedAt: 2023-12-02T00:00:00-05:00
---

## TLDR

Created an Astro component to list all the gists created by a specific GitHub user.

### How it looks

You can see it on the [about me page](/me) of this site, but here's a screenshot:
![Example of GitHub gists component](/gist-cards.png)
One day I'll set up MDX on this site and just put the actual component there...

### The code

```astro
<section>
  <h3>My GitHub Gists</h3>
  <div class="grid grid-cols-1 gap-2 lg:grid-cols-3" id="gists"></div>
</section>
<script>
  // https://github.com/octokit/octokit.js
  import { Octokit } from "octokit";

  // To generate token: https://docs.github.com/en/enterprise-server@3.9/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens
  const octokit = new Octokit({
    auth: import.meta.env.PUBLIC_GITHUB_TOKEN,
  });

  // Fetch our gists with Octokit + handle error if fetch fails
  async function getGists() {
    // Modify username here
    return await octokit
      .request("GET /users/ChrisLaRocque/gists", {
        headers: {
          "X-GitHub-Api-Version": "2022-11-28",
        },
      })
      .catch(() => {
        // Show error in UI if fetch fails
        const oops = document.createElement("p");
        oops.innerText = "Oops, couldn't fetch gists from GitHub";
        gistsDiv?.appendChild(oops);
      });
  }
  // Get the parent element we'll add our gists to
  const gistsDiv = document.getElementById("gists");

  // Run fetch above
  const { data } = await getGists();

  // Loop through each returned gist and create a card for it
  for (let i = 0; i < data.length; i++) {
    const { id, description, updated_at, html_url, files } = data[i];
    // The 'files' array contains objects where the key is the file name, so we get each key to show the names of the file
    const fileNames = Object.keys(files);

    // Create card as an anchor tag
    const gistCard = document.createElement("a");
    gistCard.setAttribute("id", id);
    gistCard.setAttribute("href", html_url);
    gistCard.setAttribute(
      "class",
      "p-4 border-2 border-white rounded flex flex-col justify-between"
    );

    // Create + append file name heading
    const heading = document.createElement("h4");
    heading.setAttribute(
      "class",
      "text-md font-bold tracking-tight text-slate-400"
    );
    heading.innerText = fileNames[0];
    gistCard.appendChild(heading);

    // Create + append description text
    const text = document.createElement("p");
    text.setAttribute("class", "text-sm");
    text.innerText = description;
    gistCard.appendChild(text);

    // Create + append update at text
    const updatedAt = document.createElement("small");
    updatedAt.setAttribute("class", "text-slate-400");
    updatedAt.innerText = new Date(updated_at).toLocaleDateString(undefined, {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
    gistCard.appendChild(updatedAt);

    // Add card div to parent
    gistsDiv?.appendChild(gistCard);
  }
</script>
```

## Fetching list of Gists with Oktokit

You'll need to install octokit if you haven't already:

```bash
npm install octokit
```

### Generating a token

To generate a token:

1. Make sure you already have a `.env` file already created to paste your token in
2. Go to https://github.com/settings/tokens
3. Click 'Generate new token' > 'Generate new token (classic)'
4. Select `read:user` from the available permissions. You can set whatever you like for expiry and note.
5. Copy + paste the token directly to your `.env` file.

In my example I named the token `PUBLIC_GITHUB_TOKEN`. Note that in Astro specifically if we want to use an environment variable on the client we need to prefix it with `PUBLIC_`, if using another framework you may need to follow a similar convention.

### The `getGists` function

```typescript
import { Octokit } from "octokit";

const octokit = new Octokit({
  auth: import.meta.env.PUBLIC_GITHUB_TOKEN,
});

// Fetch our gists with Octokit + handle error if fetch fails
async function getGists() {
  // Modify username here
  return await octokit
    .request("GET /users/ChrisLaRocque/gists", {
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    })
    .catch(() => {
      // Show error in UI if fetch fails
      const oops = document.createElement("p");
      oops.innerText = "Oops, couldn't fetch gists from GitHub";
      gistsDiv?.appendChild(oops);
    });
}
```

First we import octokit and initialize the client with our token from the step before.

Next with a bit of light Googling we can [find the GitHub API endpoint](https://docs.github.com/en/rest/gists/gists?apiVersion=2022-11-28#list-gists-for-a-user) for listing all the gists from a given user. The `X-GitHub-Api-Version` header was just part of the oktokit boilerplate, assumably to version lock the API to prevent future breaking changes.

Finally we add a `.catch()` to update the UI if there's some issue with our fetch, so the user isn't left with a blank component.

## Adding gist cards to the `gists` div

Here's the full block of code responsible for taking our data and making it HTML. The high-level flow is:

1. Get our array of gists (`data` fetched in the last step)
2. Loop through each the array to create a card for each gist
3. Add each card to the parent `gistsDiv` element

```typescript
// Drill down to response from `getGists` above
const { data } = await getGists();

// Loop through each returned gist and create a card for it
for (let i = 0; i < data.length; i++) {
  const { id, description, updated_at, html_url, files } = data[i];
  // The 'files' array contains objects where the key is the file name, so we get each key to show the names of the file
  const fileNames = Object.keys(files);

  // Create card as an anchor tag
  const gistCard = document.createElement("a");
  gistCard.setAttribute("id", id);
  gistCard.setAttribute("href", html_url);
  gistCard.setAttribute(
    "class",
    "p-4 border-2 border-white rounded flex flex-col justify-between"
  );

  // Create + append file name heading
  const heading = document.createElement("h4");
  heading.setAttribute(
    "class",
    "text-md font-bold tracking-tight text-slate-400"
  );
  heading.innerText = fileNames[0];
  gistCard.appendChild(heading);

  // Create + append description text
  const text = document.createElement("p");
  text.setAttribute("class", "text-sm");
  text.innerText = description;
  gistCard.appendChild(text);

  // Create + append update at text
  const updatedAt = document.createElement("small");
  updatedAt.setAttribute("class", "text-slate-400");
  updatedAt.innerText = new Date(updated_at).toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  gistCard.appendChild(updatedAt);

  // Add card div to parent
  gistsDiv?.appendChild(gistCard);
}
```

### Destructure each gist item

As we loop through the array of gists in our `data` response, use destructuring to access the object values of each gist. These values will populate our elements in the next steps.

```typescript
const { id, description, updated_at, html_url, files } = data[i];
```

### Get names of files

GitHub's UI shows the first file in each gist's filename as the 'title' for their version of these cards, but that singular 'title' isn't available in the API.

The API _does_ however return the array of files in the gist, where each item in the array is an object with the key being the file name and the value being the contents of the file. To get just the filenames we use `Object.keys()` to get the keys (file names) of our object.

```typescript
const fileNames = Object.keys(files);
```

In this component we're just going to get the first file name for the heading, but this files array could be used to do a lot of cool things to enhance this component! You could:

- Show the languages used in the gist on the card
- Show previews of your code

### Creating the cards

#### Creating the a tags for each card

First we create our 'card' element that we'll eventually add to our `gistsDiv`, but first we'll use the data we fetched to populate the card with information about each gist.

To start we:

1. Create an `a` tag
2. Set the `id` to the `id` provided by the GitHub API response. Not necessary for this example but doesn't hurt us to have DOM elements be uniquely identifiable.
3. Set the `href` to the `html_url` value from our GitHub data. The `html_url` is the URL you hit as a user to view a gist.
4. Set `class` with some Tailwind classes.

```typescript
// Create card as an anchor tag
const gistCard = document.createElement("a");
gistCard.setAttribute("id", id);
gistCard.setAttribute("href", html_url);
gistCard.setAttribute(
  "class",
  "p-4 border-2 border-white rounded flex flex-col justify-between"
);
```

#### Adding the file name heading

Next we:

1. Create an `h4` element
2. Set the class to some Tailwind classes
3. Set the text for the element to the first file in the gist (as shown in "Get names of files" step above)
4. Add the element to our parent card

```typescript
// Create + append file name heading
const heading = document.createElement("h4");
heading.setAttribute(
  "class",
  "text-md font-bold tracking-tight text-slate-400"
);
heading.innerText = fileNames[0];
gistCard.appendChild(heading);
```

#### Adding the description text

Adding the description is similar to adding the heading:

1. Create a `p` element
2. Set the class to some Tailwind classes
3. Set the text for the element to the description
4. Add the element to our parent card

```typescript
// Create + append description text
const text = document.createElement("p");
text.setAttribute("class", "text-sm");
text.innerText = description;
gistCard.appendChild(text);
```

#### Adding `updatedAt` text

Finally (and similarly to our last 2 steps), we add the `updatedAt` date to our card:

1. Create a `small` element
2. Set the class to some Tailwind classes
3. Set the text for the element to a JS `Date` object with our `updatedAt` string. We then parse that `Date` object as a locale string with some formatting options.
4. Add the element to our parent card

```typescript
// Create + append update at text
const updatedAt = document.createElement("small");
updatedAt.setAttribute("class", "text-slate-400");
updatedAt.innerText = new Date(updated_at).toLocaleDateString(undefined, {
  day: "numeric",
  month: "short",
  year: "numeric",
});
gistCard.appendChild(updatedAt);
```

### Adding the card to the parent `gists` div

Finally with all our child elements added, we add the card to the parent `gistsDiv`

```typescript
gistsDiv?.appendChild(gistCard);
```
