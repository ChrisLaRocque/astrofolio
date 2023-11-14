---
title: Finding the nearest Tailwind color class given a hex code
description: A small little helper function I found useful in a recent project that allows you to get the Tailwind color closest to a given hex code.
tech: [nodejs, javascript, tailwind-css, typescript]
updatedAt: 2023-11-13
---

## TLDR

Here's the full finished code for this helper function:

```typescript
import colors from "tailwindcss/colors";
import { flatten } from "flat";

// Flattens the color object and adds a "-" delimiter for exact TailwindCSS match
const tailwindReference = flatten(colors, { delimiter: "-" });

// remove color names that aren't hex codes
delete tailwindReference.inherit;
delete tailwindReference.current;
delete tailwindReference.transparent;

// Initialized the color matcher on the flattened Tailwind colors object
const nearestColor = require("nearest-color").from(tailwindReference);

// Checks if the hex color is correctly formatted and returns the closest match, otherwise throws an error.
export function tailwindMatcher(color) {
  if (/^#([0-9A-F]{3}){1,2}$/i.test(color)) {
    return nearestColor(color).name;
  } else {
    throw new Error("Wrong Hex syntax. Please use #xxx or #xxxxxx.");
  }
}
```

## Why do this
