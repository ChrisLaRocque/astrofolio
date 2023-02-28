---
title: Generating open graph images with Netlify functions.
description: How to leverage Netlify functions and Satori to generate open graph images for your site.
tech: [nodejs, css, javascript, html, aws, netlify, npm, typescript]
updatedAt: 2023-02-28
---
## TLDR

I use a Netlify function to make OG images for every page on this site. I set the og-image URL of my Astro page templates to my Netlify function with query parameters added to set the text on the image. Once the request made it to my Netlify function I used Satori to render and return an SVG as the image; giving me unique, customized images for each of my pages with no additional setup as I create new posts.

## Netlify functions

### Why I like em

I remember when Netlify functions were new.
![Old man yells at cloud meme.](/old-man-yells.jpeg)

Now you can do a few different _kinds_ of Netlify functions (serverless, edge, and background), for generating OG images good ol' serverless does the job.

Netlify functions in terms of _DX_ are fantastic in my opinion, most notably in the fact that you can develop them alongside your front-end. Assumably folks agree because Next and Gatsby both introduced serverless API routes, and now it's basically standard practice in most frameworks to ship some version of a serverless function runtime.

### Function handler

Featuring extraneous inline comments

```typescript
import type { Handler, HandlerEvent } from "@netlify/functions";
import { readFileSync } from "fs";
import path from "path";
import satori from "satori";

const handler: Handler = async (event: HandlerEvent) => {
	// URL params provided as a decoded object
	const { queryStringParameters } = event;
	// I set the function call to always include these 2 parameters in my Astro template
	const { title, subtitle } = queryStringParameters;

	// Font file import
	const interBold = readFileSync(path.resolve(`./public/Inter-Bold.ttf`));
	const spaceMono = readFileSync(
		path.resolve(`./public/SpaceMono-Regular.ttf`)
	);

	// Pass elements to satori constructor
	const body = await satori(/** Satori stuff we'll get into below */);

	// Return that bad boy, including appropriate headers for showing an SVG
	return {
		statusCode: 200,
		headers: {
			"content-type": "image/svg+xml",
			"cache-control":
				"public, immutable, no-transform, max-age=31536000",
		},
		body: body,
	};
};

export { handler };
```

## Satori

[Satori](https://github.com/vercel/satori) is a package made by the folks at Vercel, used to power their [@vercel/og](https://www.npmjs.com/package/@vercel/og) package and unlocking similar results to what I achieved here directly within Next.js.

### Parent element

The 'main' or 'parent' component takes 2 arguments: an object declaring an element, incluing its children, and on object of options for the parent.

```typescript
const body = await satori(
	// Element definition
	{
		type: "div",
		key: "key",
		props: {
			// Can be just a string, or an array of more elements
			children: ["Super simple string"],
			// Style rules
			style: {
				backgroundColor: "#27272A",
				letterSpacing: "-1px",
				color: "white",
				width: "100%",
				height: "100%",
				display: "flex",
				padding: "40px",
				justifyContent: "center",
				alignItems: "flex-start",
				flexDirection: "column",
			},
		},
	},
	// Options
	{
		// Overall image dimenions
		width: 600,
		height: 400,
		// Load custom fonts
		fonts: [
			{
				name: "Inter",
				data: interBold,
				weight: 700,
				style: "normal",
			},
			{
				name: "Space Mono",
				data: spaceMono,
				weight: 400,
				style: "normal",
			},
		],
	}
);
```

### Child elements

In the above code the 'children' of the parent element is just a string, but the actual children definition looks like this:

```typescript
props: {
    children: [
        {
            // Wrap everything in a div
            type: "div",
            key: "wrapper",
            props: {
                children: [
                    // First element is an h1
                    {
                        type: "h1",
                        key: "heading",
                        props: {
                            // A string received from URL params above
                            children: title,
                            style: {
                                fontSize: "36px",
                                fontFamily: "Inter",
                                fontWeight: 700,
                                borderBottom: "1px solid white",
                                paddingBottom: "5px",
                                marginBottom: "5px",
                            },
                        },
                    },
                    // Second is a <p> tag containing the subtitle string
                    {
                        type: "p",
                        key: "subtitle",
                        props: {
                            children: subtitle,
                            style: {
                                fontSize: "24px",
                                fontFamily: "Space Mono",
                                marginTop: "3px",
                            },
                        },
                    },
                ],
                // Wrapper div styles
                style: {
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-around",
                },
            },
        },
    ],
    style: {
       // Parent style rules we looked at above
    },
},

```
I found myself occasionally getting lost between the 4 different-but-similar objects but once you get your bearings its easy enough to work with.

## Gotchas
The main 2 difficulties I faced were issues importing font files (my own fault) and getting used to Satori's syntax (also technically my fault).
### Font files

I had no issues getting things running locally, but when I pushed live I got a warning letting me know the font files couldn't be found. Some googling revealed that Netlify has a built in configuration option `included_files` that somehow I got into my head was only for specific file types. I posted my confusion in our Slack, and was promptly + politely corrected by [Marcus Weiner](https://github.com/mraerino), Sr. Staff Software Engineer at Netlify. Now fonts load!

### Satori syntax

Satori _does_ allow you to use JSX if you have a parser set up, but what am I, some kind of nerd with that kind of time? I relied on their fallback object-based syntax for defining elements (outlined above). Once you get used to it, its pretty easy to start putting together what you need, but there were a few moments spent on trial and error to get going.
