import type { Handler, HandlerEvent } from "@netlify/functions";
import { tailwindMatcher } from "../../utils/tailwind-hex";

const handler: Handler = async (event: HandlerEvent) => {
  const { queryStringParameters } = event;
  const hex = queryStringParameters?.hex;

  if (!hex) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing hex query parameter" }),
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ twClass: tailwindMatcher(hex) }),
  };
};

export { handler };
