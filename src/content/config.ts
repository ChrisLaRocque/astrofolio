// 1. Import your utilities and schemas
import { z, defineCollection } from "astro:content";
const techItem = z.enum([
	"graphql",
	"html",
	"tailwind-css",
	"github",
	"gitlab",
	"npm",
	"css",
	"javascript",
	"nodejs",
	"aws",
	"netlify",
	"contentful",
	"nuxt",
	"vue",
	"react",
	"gatsby",
	"sass",
	"bulma",
]);
// 2. Define your collections
const projectCollection = defineCollection({
	schema: z.object({
		title: z.string(),
		description: z.string(),
		site: z.string().url(),
		tech: z.array(techItem),
	}),
});
const techCollection = defineCollection({
	schema: z.object({
		title: z.string(),
		description: z.string(),
		homepage: z.string().url(),
	}),
});
// 3. Export multiple collections to register them
export const collections = {
	projects: projectCollection,
	tech: techCollection,
};
