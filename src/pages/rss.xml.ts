import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getPublishedPosts, isNote, withPublishTime } from '../lib/content';
import { SITE } from '../consts';

export async function GET(context: APIContext) {
	const posts = await getPublishedPosts();
	const items = posts.map((post) => {
		const renderedContent = post.rendered?.html;
		if (!renderedContent && !post.filePath?.endsWith('.mdx')) {
			throw new Error(`Missing rendered HTML for blog post: ${post.id}`);
		}
		return {
			title: post.data.title,
			description: post.data.description,
			// MDX entries are rendered as components on their pages; RSS uses their summary.
			content: renderedContent ?? post.data.description,
			pubDate: withPublishTime(post.data.pubDate),
			link: `/blog/${post.id}/`,
			categories: [...post.data.tags],
			// Link-blog notes point outward; keep the permalink as the guid.
			...(isNote(post) && post.data.link ? { source: { url: post.data.link, title: '' } } : {}),
		};
	});

	return rss({
		title: `${SITE.title} — Blog`,
		description: SITE.description,
		site: context.site ?? SITE.url,
		trailingSlash: true,
		items,
		customData: '<language>en</language>',
	});
}
