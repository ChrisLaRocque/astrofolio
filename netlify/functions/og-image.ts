import type { Handler, HandlerEvent } from "@netlify/functions";
import { readFileSync } from "fs";
import path from "path";
import satori from "satori";

const handler: Handler = async (event: HandlerEvent) => {
	const { queryStringParameters } = event;
	const { title, subtitle } = queryStringParameters;

	/** Font file import */
	const interBold = readFileSync(path.resolve(`./public/Inter-Bold.ttf`));
	const spaceMono = readFileSync(
		path.resolve(`./public/SpaceMono-Regular.ttf`)
	);

	const body = await satori(
		{
			type: "div",
			key: "key",
			props: {
				children: [
					{
						type: "div",
						key: "wrapper",
						props: {
							children: [
								{
									type: "h1",
									key: "heading",
									props: {
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
							style: {
								display: "flex",
								flexDirection: "column",
								justifyContent: "space-around",
							},
						},
					},
				],
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
		{
			width: 600,
			height: 400,
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
