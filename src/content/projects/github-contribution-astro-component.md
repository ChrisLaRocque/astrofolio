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
  <div class="flex flex-col items-center justify-center">
    <div id="contributions" class="flex gap-1">
      {
        Array.apply(null, Array(53)).map((week, i) => {
          return (
            <div
              id={`week-${i}`}
              class={`flex-col gap-1 ${i < 20 ? "hidden md:flex" : "flex"}`}
            >
              {Array.apply(null, Array(7)).map((day, j) => {
                return (
                  <div
                    id={`week-${i}-day-${j}`}
                    class="h-2 w-2 lg:h-5 lg:w-5"
                    style="background-color: rgba(235,	237,	240, 0.15);"
                  />
                );
              })}
            </div>
          );
        })
      }
    </div>
    <p class="my-1 hidden" id="contribution-error">
      Ooops, error fetching from GitHub.
    </p>
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
  console.log("data", data);

  /**
   * If there's an error with the fetch or the user doesn't exist, show error text
   */
  if (!data || !data.user) {
    const oops = document.getElementById("contribution-error");
    oops?.classList.remove("hidden");
    throw "Error fetching from Github";
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
  weeks.forEach(({ contributionDays }, i) => {
    // Loop through each week's days + add them to their week
    contributionDays.forEach(({ color, date, contributionCount }, j) => {
      const bgColor = color === "#ebedf0" ? "rgba(235,	237,	240, 0.15)" : color; // Make white squares a more pleasing gray
      // Get + update each day square
      const dayDiv = document.getElementById(`week-${i}-day-${j}`);
      dayDiv?.setAttribute("style", `background-color: ${bgColor}`);
      dayDiv?.setAttribute(
        "title",
        `${date} - ${contributionCount} public commits`
      );
    });
  });
</script>
```

## The Astro component

```astro
<section>
  <h3 class="">Commits to public GitHub repos</h3>
  <div class="flex flex-col items-center justify-center">
    <div id="contributions" class="flex gap-1">
      {
        Array.apply(null, Array(53)).map((week, i) => {
          return (
            <div
              id={`week-${i}`}
              class={`flex-col gap-1 ${i < 20 ? "hidden md:flex" : "flex"}`}
            >
              {Array.apply(null, Array(7)).map((day, j) => {
                return (
                  <div
                    id={`week-${i}-day-${j}`}
                    class="h-2 w-2 lg:h-5 lg:w-5"
                    style="background-color: rgba(235,	237,	240, 0.15);"
                  />
                );
              })}
            </div>
          );
        })
      }
    </div>
    <p class="my-1 hidden" id="contribution-error">
      Ooops, error fetching from GitHub.
    </p>
  </div>
</section>
```

### Server render a blank grid

To avoid a potential CLS penalty by having our grid 'pop-in' to the page, we'll render a blank grid on the server and have client-side Javascript simply update the color of each square. We know the GitHub API will always return 53 weeks. We use `Array.apply()` to create our 53 week columns, and then use `Array.apply()` again to create the 7 'day' squares in each column

### Hidden error message

At the bottom we also have a hidden error message that we'll show later on if our API request fails.

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

### Handling an error

Finally at the bottom of the API fetch we include a way to show our error message from above in the event something goes wrong with our API request.

```typescript
/**
 * If there's an error with the fetch or the user doesn't exist, show error text
 */
if (!data || !data.user) {
  const oops = document.getElementById("contribution-error");
  oops?.classList.remove("hidden");
  throw "Error fetching from Github";
}
```

## Updating each `day` div's colors

We write a loop inside a loop to get through all our data and update each square's background color to match the contributions for that day:

```typescript
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
weeks.forEach(({ contributionDays }, i) => {
  // Loop through each week's days + add them to their week
  contributionDays.forEach(({ color, date, contributionCount }, j) => {
    const bgColor = color === "#ebedf0" ? "rgba(235,	237,	240, 0.15)" : color; // Make white squares a more pleasing gray
    // Get + update each day square
    const dayDiv = document.getElementById(`week-${i}-day-${j}`);
    dayDiv?.setAttribute("style", `background-color: ${bgColor}`);
    dayDiv?.setAttribute(
      "title",
      `${date} - ${contributionCount} public commits`
    );
  });
});
```

## What's it do on mobile?

I realized I didn't know what the GitHub version of this grid did on mobile so I took a look, and they just hide some of the weeks, so I did the same!

In the code where we add a `div` square for each day we set a class dependent on what index the item is in the array. There are 53 weeks returned (current week + the last year), so our function cuts off the last 20 weeks to make it fit nice on a smaller screen.

```astro
<div id="contributions" class="flex gap-1">
  {
    Array.apply(null, Array(53)).map((week, i) => {
      return (
        <!--    This divs `class` hides older weeks on mobile -->
        <div
          id={`week-${i}`}
          class={`flex-col gap-1 ${i < 20 ? "hidden md:flex" : "flex"}`}
        >
          {Array.apply(null, Array(7)).map((day, j) => {
            return (
              <div
                id={`week-${i}-day-${j}`}
                class="h-2 w-2 lg:h-5 lg:w-5"
                style="background-color: rgba(235,	237,	240, 0.15);"
              />
            );
          })}
        </div>
      );
    })
  }
</div>
```

There's also a few other Tailwind classes you'll see throughout the markup to make the shift to mobile a bit nicer.
