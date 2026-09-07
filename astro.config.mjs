// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
	// Required for canonical URLs, RSS and the sitemap.
	site: 'https://tlxo.fi',
	trailingSlash: 'always',
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
