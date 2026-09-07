import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getPublishedPosts, isNote } from '../lib/content';
import { SITE } from '../consts';

export async function GET(context: APIContext) {
	const posts = await getPublishedPosts();

	return rss({
		title: `${SITE.title} — Blog`,
		description: SITE.description,
		site: context.site ?? SITE.url,
		trailingSlash: true,
		items: posts.map((post) => ({
			title: post.data.title,
			description: post.data.description,
			pubDate: post.data.pubDate,
			link: `/blog/${post.id}/`,
			categories: [...post.data.tags],
			// Link-blog notes point outward; keep the permalink as the guid.
			...(isNote(post) && post.data.link ? { source: { url: post.data.link, title: '' } } : {}),
		})),
		customData: '<language>en</language>',
	});
}
