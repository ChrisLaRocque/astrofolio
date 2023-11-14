import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import image from "@astrojs/image";
import partytown from "@astrojs/partytown";
import serviceWorker from "astrojs-service-worker";

// https://astro.build/config
export default defineConfig({
  integrations: [
    tailwind(),
    image({
      serviceEntryPoint: "@astrojs/image/sharp",
    }),
    partytown(),
    serviceWorker(),
  ],
  site: "https://larocque.dev",
});
