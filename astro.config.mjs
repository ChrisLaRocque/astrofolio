import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import partytown from "@astrojs/partytown";
import serviceWorker from "astrojs-service-worker";
import { remarkReadingTime } from "./utils/remark-reading-time.mjs";

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind(), partytown(), serviceWorker()],
  site: "https://larocque.dev",
  markdown: {
    remarkPlugins: [remarkReadingTime],
  },
});
