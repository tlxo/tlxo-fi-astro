// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import pagefind from 'astro-pagefind';

// https://astro.build/config
export default defineConfig({
	// Required for canonical URLs, RSS and the sitemap.
	site: 'https://tlxo.fi',
	trailingSlash: 'always',
	integrations: [mdx(), react(), pagefind()],
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
