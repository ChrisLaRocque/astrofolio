import colors from "tailwindcss/colors";
import { flatten } from "flat";

type TailwindColorMap = Record<string, string>;

function tailwindReference(): TailwindColorMap {
  const colorPalette = colors as unknown as Record<string, unknown>;

  const flattened = flatten<Record<string, unknown>, Record<string, unknown>>(colorPalette, {
    delimiter: "-",
  });

  const hexColors: TailwindColorMap = {};

  for (const [key, value] of Object.entries(flattened)) {
    if (
      typeof value === "string" &&
      /^#([0-9A-F]{3}){1,2}$/i.test(value) &&
      key === key.toLowerCase()
    ) {
      hexColors[key] = value;
    }
  }

  return hexColors;
}

function tailwindMatcher(color: string) {
  const nearestColor = require("nearest-color").from(tailwindReference());

  if (/^#([0-9A-F]{3}){1,2}$/i.test(color)) {
    return nearestColor(color).name;
  }

  throw new Error("Wrong Hex syntax. Please use #xxx or #xxxxxx.");
}

export { tailwindReference, tailwindMatcher };
