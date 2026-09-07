import { defineCollection, reference, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { PROJECT_KINDS } from './consts';

/**
 * Tags carry all the structural weight on this site (notes, work vs. personal,
 * topics), so casing and spacing drift would silently create orphan tag pages.
 * Enforcing kebab-case means a typo fails the build instead.
 */
const tag = z
	.string()
	.min(1)
	.regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Tags must be lowercase kebab-case, e.g. "web-performance"');

const tags = z.array(tag).default([]);

const blog = defineCollection({
	loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
	schema: ({ image }) =>
		z
			.object({
				title: z.string().min(1),
				description: z.string().min(1),
				pubDate: z.coerce.date(),
				updatedDate: z.coerce.date().optional(),
				tags,
				draft: z.boolean().default(false),
				heroImage: image().optional(),
				heroAlt: z.string().optional(),
				author: reference('authors').optional(),
				/** Set this and the entry renders as a link-blog note pointing elsewhere. */
				link: z.string().url().optional(),
			})
			.refine((data) => !data.heroImage || (data.heroAlt?.trim().length ?? 0) > 0, {
				message: 'heroAlt is required when heroImage is set',
				path: ['heroAlt'],
			}),
});

const projects = defineCollection({
	loader: glob({ base: './src/content/projects', pattern: '**/*.{md,mdx}' }),
	schema: ({ image }) =>
		z
			.object({
				title: z.string().min(1),
				summary: z.string().min(1),
				kind: z.enum(PROJECT_KINDS),
				role: z.string().optional(),
				year: z.number().int().min(1900).max(2100),
				/** Stack, instruments, timbers, whatever the project was made from. */
				madeWith: z.array(z.string()).default([]),
				links: z.array(z.object({ label: z.string().min(1), url: z.string().url() })).default([]),
				featured: z.boolean().default(false),
				draft: z.boolean().default(false),
				cover: image().optional(),
				coverAlt: z.string().optional(),
			})
			.refine((data) => !data.cover || (data.coverAlt?.trim().length ?? 0) > 0, {
				message: 'coverAlt is required when cover is set',
				path: ['coverAlt'],
			}),
});

const pages = defineCollection({
	loader: glob({ base: './src/content/pages', pattern: '**/*.{md,mdx}' }),
	schema: z.object({
		title: z.string().min(1),
		description: z.string().min(1),
		updatedDate: z.coerce.date().optional(),
		/** Lower numbers sort first where pages are listed. */
		order: z.number().int().default(0),
		draft: z.boolean().default(false),
	}),
});

const authors = defineCollection({
	loader: glob({ base: './src/content/authors', pattern: '**/*.json' }),
	schema: z.object({
		name: z.string().min(1),
		url: z.string().url().optional(),
	}),
});

export const collections = { blog, projects, pages, authors };
