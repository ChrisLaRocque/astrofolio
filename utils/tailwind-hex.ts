import colors from "tailwindcss/colors";
import { flatten } from "flat";

function tailwindReference() {
  // Flattens the color object and adds a "-" delimiter for exact TailwindCSS match
  const flat = flatten(colors, { delimiter: "-" });
  // Collect all colors that aren't hex codes
  const notHex = Object.entries(flat).filter(
    ([key, value]) =>
      !/^#([0-9A-F]{3}){1,2}$/i.test(value) || key !== key.toLowerCase()
  );

  // Delete colors without matching hex codes
  notHex.forEach(([key]) => delete flat[key]);

  return flat;
}

function tailwindMatcher(color: string) {
  // Initialize the color matcher on the flattened Tailwind colors object
  const nearestColor = require("nearest-color").from(tailwindReference());

  // Check if the hex color is correctly formatted and return the closest match, otherwise throw an error.
  if (/^#([0-9A-F]{3}){1,2}$/i.test(color)) {
    return nearestColor(color).name;
  } else {
    throw new Error("Wrong Hex syntax. Please use #xxx or #xxxxxx.");
  }
}
export { tailwindReference, tailwindMatcher };
