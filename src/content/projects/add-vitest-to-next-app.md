---
title: Add Vitest to a Next app
description: Adding Vitest to a Next app and writing a simple test
tech:
  [next-js, typescript, npm, github, react, vitest]
updatedAt: 2023-12-09T00:00:00-05:00
---

How to add Vitest to an already existing Next app.

## Install packages

```bash
npm i @testing-library/react @vitejs/plugin-react jsdom vites
t --save-dev
```

## Add `test` scripts to your `package.json`

Inside your `package.json` add the following to your `scripts` object

```tsx
{
	// ...rest of package.json
	"scripts": {
		// ...rest of "scripts"
		"test": "vitest run",
		"test:dev": "vitest"
	}
}
```

## Create `vitest.config.ts`

```tsx
/// <reference types="vitest" />

import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
  },
	// Resolves Next's import alias "@"
	resolve: {
    alias: {
      "@": path.resolve(__dirname, "./"),
    },
  },
})
```

## Create `__tests__` directory and add `Home.test.tsx`

Create a `__tests__` directory with a new file in it called `Home.test.tsx`. Vitest (and most other JS-testing libraries) will automatically pick up on and run files in the `__tests__` directory. Inside `Home.test.tsx` put the following:

```tsx
import { expect, test } from "vitest";
import { render, screen, within } from "@testing-library/react";
import Home from "@/app/page";

test("Home h1 renders", () => {
  render(<Home />);
  const main = within(screen.getByRole("main"));
  const h1 = main.getByRole("heading", { level: 1, name: /hello test/i });
  expect(h1).toBeDefined();
});
```

### What is the test doing?

In `/app/page` we have an exported component `Home` that returns (basically)

```tsx
<main>
	<section>
		<h1>Hello test</h1>
	</section>
</main>
```

We want to test that the H1 renders and is readable by its [accessible name](https://www.tpgi.com/what-is-an-accessible-name/). Luckily `@testing-library/react`’s approach to querying the DOM forces a certain amount of accessibility compliance for your tests to pass. Going through the code above we:

- Declare our `test` function with 2 arguments: the test name, and the function to run as the test. In the test function we then…
- Render our `<Home />` component
- [Query](https://testing-library.com/docs/queries/about/) the rendered component for the `main` element
- Query the `main` element using [getByRole](https://testing-library.com/docs/queries/byrole/) to find a `heading` with a level of `1` (aka an `<h1>`), with the [accessible name](https://www.tpgi.com/what-is-an-accessible-name/) of `hello test`. The `name` attribute takes a regex like in this example, but could also just take a plain string of the text
- Declare an `expect` function, where we expect the h1 we queried to exist on the rendered page.

## Run the test

In your terminal, run the following command to run our test:

```bash
npm run test
```

You should see the output of our test in your terminal.

## Developing more tests

The `test:dev` command we added to `package.json` earlier will run `vitest` in ‘dev’ mode, meaning `vitest` will watch your tests for changes and re-run them as you save.

```bash
npm run test:dev
```