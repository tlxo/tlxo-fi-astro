// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import pagefind from 'astro-pagefind';
import { unified } from '@astrojs/markdown-remark';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';

// Allowlist a few semantic inline tags on top of rehype-sanitize's GitHub-based defaults,
// and keep Shiki's inline-styled spans/classes intact since they flow through the same sanitizer.
const markdownSanitizeSchema = {
	...defaultSchema,
	tagNames: [...(defaultSchema.tagNames ?? []), 'mark', 'abbr'],
	attributes: {
		...defaultSchema.attributes,
		abbr: [...(defaultSchema.attributes?.abbr ?? []), 'title'],
		pre: [
			...(defaultSchema.attributes?.pre ?? []),
			'style',
			'className',
			'tabIndex',
			'dataLanguage',
		],
		code: [...(defaultSchema.attributes?.code ?? []), 'style', 'className'],
		span: [...(defaultSchema.attributes?.span ?? []), 'style', 'className'],
	},
};

// https://astro.build/config
export default defineConfig({
	// Required for canonical URLs, RSS and the sitemap.
	site: 'https://tlxo.fi',
	trailingSlash: 'always',
	integrations: [
		mdx(),
		react(),
		sitemap({
			// Paginated and noindex routes add nothing for crawlers.
			filter: (page) => !page.includes('/blog/page/') && !page.includes('/search/'),
		}),
		pagefind(),
	],
	build: {
		format: 'directory',
	},
	prefetch: {
		prefetchAll: true,
		defaultStrategy: 'viewport',
	},
	markdown: {
		shikiConfig: {
			themes: {
				light: 'github-light',
				dark: 'github-dark',
			},
			wrap: true,
		},
		// rehype-raw turns raw HTML text nodes into real elements so rehype-sanitize can allowlist them.
		processor: unified({
			rehypePlugins: [rehypeRaw, [rehypeSanitize, markdownSanitizeSchema]],
		}),
	},
});
