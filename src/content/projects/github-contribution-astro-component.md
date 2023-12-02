---
title: Astro component for a GitHub contribution graph
description: Using the GitHub GraphQL API to recreate their contribution graph in an Astro component with Tailwind CSS.
site: https://larocque.dev/me
tech:
  [astro, tailwind-css, typescript, npm, github, html, css, graphql, javascript]
updatedAt: 2023-12-01T00:00:00-05:00
---

## TLDR

I built a component that fetches contribution for a given user from the GitHub GraphQL API and recreates their contribution grid seen on user pages on github.com. The only thing you'd need to do to make the following code run is generate a personal access token in GitHub with `read:user` permissions.

### How it looks

You can see it on the [about me page](/me) of this site, but here's a screenshot:
![Screenshot of custom Astro GitHub contribution component](/contribution-grid.png)
One day I'll set up MDX on this site and just put the actual component there...

### The code

```astro
<section>
  <h3 class="">Commits to public GitHub repos</h3>
  <div class="flex items-center justify-center">
    <div id="contributions" class="flex gap-1"></div>
  </div>
</section>
<script>
  /**
   * Types for our data
   */
  type ContributionDay = {
    color: string;
    contributionCount: number;
    date: string;
    weekday: number;
  };
  type Week = {
    contributionDays: ContributionDay[];
    firstDay: string;
  };
  type Weeks = Week[];
  type GraphQLRes = {
    user: {
      contributionsCollection: {
        contributionCalendar: {
          weeks: Weeks;
        };
      };
    };
  };

  /**
   * Get container for our grid
   */
  const contributions = document.getElementById("contributions");

  /**
   * Fetch against GitHub GraphQL API
   */
  async function getContributions(token: string, username: string) {
    const headers = {
      Authorization: `bearer ${token}`,
    };
    const body = {
      query: `query {
              user(login: "${username}") {
                name
                contributionsCollection {
                  contributionCalendar {
                    colors
                    totalContributions
                    weeks {
                      contributionDays {
                        color
                        contributionCount
                        date
                        weekday
                      }
                      firstDay
                    }
                  }
                }
              }
            }`,
    };
    const response = await fetch("https://api.github.com/graphql", {
      method: "POST",
      body: JSON.stringify(body),
      headers: headers,
    });
    const data = await response.json();
    return data;
  }

  /**
   * Run fetch from above
   */
  const { data } = await getContributions(
    import.meta.env.PUBLIC_GITHUB_TOKEN, // token in .env file
    "ChrisLaRocque" // your GitHub account name
  );

  /**
   * If there's an error with the fetch or the user doesn't exist, show error text
   */
  if (!data || !data.user) {
    const oops = document.createElement("p");
    oops.innerText = "Oops, couldn't load commits from GitHub";
    contributions?.appendChild(oops);
    throw "Error fetching from Github";
  }

  /**
   *  Helper to add our new elements into their parent at the correct spot
   */
  function insertAtIndex(
    parent: HTMLDivElement,
    child: HTMLDivElement,
    i: number
  ) {
    if (i >= parent.children.length) {
      parent.appendChild(child);
    } else {
      parent.insertBefore(child, parent.children[i]);
    }
  }

  /**
   * Drill down to data from fetch request
   */
  const {
    user: {
      contributionsCollection: {
        contributionCalendar: { weeks },
      },
    },
  }: GraphQLRes = data;

  /**
   * Loop through the weeks + add them to the parent div
   */
  weeks.forEach(({ contributionDays, firstDay }, i) => {
    // Create + modify a div per week
    const weekDiv = document.createElement("div");
    weekDiv.setAttribute("id", `week-${i}`);
    weekDiv.setAttribute(
      "class",
      `flex-col gap-1 ${i < 20 ? "hidden md:flex" : "flex"}`
    ); // Add tailwind classes + hide older weeks on mobile
    weekDiv.setAttribute("title", firstDay); // Allow folks to see date on hover

    // Loop through each week's days + add them to their week
    contributionDays.forEach(({ color, date }, i) => {
      const bgColor = color === "#ebedf0" ? "rgba(235,	237,	240, 0.15)" : color; // Make white squares a more pleasing gray
      // Create + modify a div per day
      const dayDiv = document.createElement("div");
      dayDiv.setAttribute("id", date);
      dayDiv.setAttribute("class", `lg:w-5 lg:h-5 w-2 h-2`);
      dayDiv.setAttribute("style", `background-color: ${bgColor}`);
      dayDiv.setAttribute("title", date);
      // Add day to parent week div
      insertAtIndex(weekDiv, dayDiv, i);
    });
    // Add week to parent div
    insertAtIndex(contributions, weekDiv, i);
  });
</script>
```

## Fetching contribution information from the GitHub GraphQL API

From what I can tell according to [this Stack Overflow discussion](https://stackoverflow.com/questions/18262288/finding-total-contributions-of-a-user-from-github-api), GitHub's REST/Javascript client response does not include contribution information for users, but their GraphQL API does.

### Generating a token

To generate a token:

1. Make sure you already have a `.env` file already created to paste your token in
2. Go to https://github.com/settings/tokens
3. Click 'Generate new token' > 'Generate new token (classic)'
4. Select `read:user` from the available permissions. You can set whatever you like for expiry and note.
5. Copy + paste the token directly to your `.env` file.

In my example I named the token `PUBLIC_GITHUB_KEY`. Note that in Astro specifically if we want to use an environment variable on the client we need to prefix it with `PUBLIC_`, if using another framework you may need to follow a similar convention.

### The `getContributions` function and fetch request

We start by defining the header to pass our token, followed by the query. I happened to steal the query from the Stack Overflow discussion linked above.

```typescript
async function getContributions(token: string, username: string) {
  const headers = {
    Authorization: `bearer ${token}`,
  };
  const body = {
    query: `query {
              user(login: "${username}") {
                name
                contributionsCollection {
                  contributionCalendar {
                    colors
                    totalContributions
                    weeks {
                      contributionDays {
                        color
                        contributionCount
                        date
                        weekday
                      }
                      firstDay
                    }
                  }
                }
              }
            }`,
  };
  // ... rest of function below
}
```

From there we construct a fetch request with our query as the body and our token passed in the headers, and finally return that request response.

```typescript
const response = await fetch("https://api.github.com/graphql", {
  method: "POST",
  body: JSON.stringify(body),
  headers: headers,
});
const data = await response.json();
return data;
```

## Adding elements to the `contributions` div

Now that we have our data (`weeks`) and an element on the page to target (`contributions`), lets create some new child elements!

To start I used the `flex` class on the `contributions` div so all our weeks would appear in one row, and then when we make the weeks and days we will give each 7 rows for the days. I also added `gap-1` for some spacing.

```html
<div id="contributions" class="flex gap-1"></div>
```

### A helper function for placing our elements in the right spot

It was an arbitrary decision, but I used `forEach` loops for both arrays we need to loop through in this component, which doesn't necessarily put our elements into the DOM in the same order as they are in the array if using `appendChild`. There are 2 solutions:

1. Use a different loop (`for`)
2. Write a lil helper function to place the elements in the right place

I hadn't ever been in a position of needing to put an element in a specific order in its parent, so I was curious what that looked like. This Stack Overflow discussion proved helpful, and I stole the 2nd answer's implementation for my own helper function:

```typescript
function insertAtIndex(
  parent: HTMLDivElement,
  child: HTMLDivElement,
  i: number
) {
  if (i >= parent.children.length) {
    parent.appendChild(child);
  } else {
    parent.insertBefore(child, parent.children[i]);
  }
}
```

### Creating the weeks

You might already be able to tell from the GraphQL query or the type declarations above, but our `weeks` data contains an array of objects representing the days of that week like so:

```typescript
/**
 * Types for our data
 */
type ContributionDay = {
  color: string;
  contributionCount: number;
  date: string;
  weekday: number;
};
type Week = {
  contributionDays: ContributionDay[];
  firstDay: string;
};
type Weeks = Week[];
```

So we'll loop through the array of `weeks`, and then loop through each week's `contributionDays`.

Let look at the loop for weeks first:

```typescript
/**
 * Loop through the weeks + add them to the parent div
 */
weeks.forEach(({ contributionDays, firstDay }, i) => {
  // Create + modify a div per week
  const weekDiv = document.createElement("div");
  weekDiv.setAttribute("id", `week-${i}`);
  weekDiv.setAttribute(
    "class",
    `flex-col gap-1 ${i < 20 ? "hidden md:flex" : "flex"}`
  ); // Add tailwind classes + hide older weeks on mobile
  weekDiv.setAttribute("title", firstDay); // Allow folks to see date on hover

  // Loop through each week's days + add them to their week
  contributionDays.forEach(({ color, date }, i) => {
    // We'll cover this in the next step
  });
  // Add week to parent div
  insertAtIndex(contributions, weekDiv, i);
});
```

We essentially do the following:

1. Create a div for each week `weekDiv`
2. Add an `id` to each `weekDiv`
3. Add some Tailwind classes, including logic to hide some weeks on mobile
4. Give each `weekDiv` a `title` attribute so the user can hover to see the date of the contribution
5. Loop through the `contributionDays` array to add each day as a child to our `weekDiv` (we'll cover this logic in the next step)
6. Once we've added the days, add the entire `weekDiv` to our parent `contributions` div

### Adding each day to each week

The following `forEach` loop adds the days to each `weekDiv` we created above:

```typescript
// Loop through each week's days + add them to their week
contributionDays.forEach(({ color, date }, i) => {
  const bgColor = color === "#ebedf0" ? "rgba(235,	237,	240, 0.15)" : color; // Make white squares a more pleasing gray
  // Create + modify a div per day
  const dayDiv = document.createElement("div");
  dayDiv.setAttribute("id", date);
  dayDiv.setAttribute("class", `lg:w-5 lg:h-5 w-2 h-2`);
  dayDiv.setAttribute("style", `background-color: ${bgColor}`);
  dayDiv.setAttribute("title", date);
  // Add day to parent week div
  insertAtIndex(weekDiv, dayDiv, i);
});
```

We essentially do the same for the days as we did for the weeks: create an element, add some attributes, and add that new element to its parent.

## What's it do on mobile?

I realized I didn't know what the GitHub version of this grid did on mobile so I took a look, and they just hide some of the weeks, so I did the same!

In the code where we add a `div` for each week we set a class dependent on what index the item is in the array. There are 53 weeks returned (current week + the last year), so our function cuts off the last 20 weeks to make it fit nice on a smaller screen.

```typescript
weekDiv.setAttribute(
  "class",
  `flex-col gap-1 ${i < 20 ? "hidden md:flex" : "flex"}`
); // Add tailwind classes + hide older weeks on mobile
```

There's also a few other Tailwind classes you'll see throughout the markup to make the shift to mobile a bit nicer.
