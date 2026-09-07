// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

// https://astro.build/config
export default defineConfig({
	// Required for canonical URLs, RSS and the sitemap.
	site: 'https://tlxo.fi',
	trailingSlash: 'always',
	integrations: [mdx()],
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
	},
});
