import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

function removeDupsAndLowerCase(array: string[]) {
	return [...new Set(array.map((str) => str.toLowerCase()))];
}

const titleSchema = z.string().max(60);

const baseSchema = z.object({
	title: titleSchema,
});

const post = defineCollection({
	loader: glob({ base: "./content/posts", pattern: "**/*.{md,mdx}" }),
	schema: ({ image }) =>
		baseSchema.extend({
			description: z.string(),
			coverImage: z
				.object({
					alt: z.string(),
					src: image(),
				})
				.optional(),
			draft: z.boolean().default(false),
			ogImage: z.string().optional(),
			tags: z.array(z.string()).default([]).transform(removeDupsAndLowerCase),
			publishDate: z
				.string()
				.or(z.date())
				.transform((val) => new Date(val)),
			updatedDate: z
				.string()
				.optional()
				.transform((str) => (str ? new Date(str) : undefined)),
			pinned: z.boolean().default(false),
		}),
});

const tag = defineCollection({
	loader: glob({ base: "./content/tags", pattern: "**/*.{md,mdx}" }),
	schema: z.object({
		title: titleSchema.optional(),
		description: z.string().optional(),
	}),
});

/**
 * Ordered weakest to strongest. A paper only ever moves down this list, and only
 * when the move has already happened in the real world.
 */
const researchStatusSchema = z.enum(["in-preparation", "preprint", "under-review", "accepted"]);

const research = defineCollection({
	loader: glob({ base: "./content/research", pattern: "**/*.{md,mdx}" }),
	schema: ({ image }) =>
		baseSchema
			.extend({
				/** The finding, in one sentence a non-specialist understands. Not the method. */
				finding: z.string(),
				status: researchStatusSchema,
				/** e.g. "NeurIPS 2026". Required once a venue is claimed — see superRefine below. */
				venue: z.string().optional(),
				/** Full author list, in publication order. The name matching siteConfig.author is emphasised. */
				authors: z.array(z.string()).nonempty(),
				arxiv: z.url().optional(),
				code: z.url().optional(),
				figure: z
					.object({
						alt: z.string(),
						caption: z.string().optional(),
						src: image(),
					})
					.optional(),
				/** Lower sorts first on the index. */
				order: z.number().default(0),
				draft: z.boolean().default(false),
			})
			.superRefine((entry, ctx) => {
				const require = (field: "venue" | "arxiv", message: string) => {
					if (!entry[field]) ctx.addIssue({ code: "custom", message, path: [field] });
				};
				// Never imply acceptance, review, or a preprint that does not exist.
				if (entry.status === "accepted") {
					require("venue", "status 'accepted' requires the venue that accepted it.");
				}
				if (entry.status === "under-review") {
					require("venue", "status 'under-review' requires the venue reviewing it.");
				}
				if (entry.status === "preprint") {
					require("arxiv", "status 'preprint' requires the arXiv URL.");
				}
			}),
});

export const collections = { post, research, tag };
