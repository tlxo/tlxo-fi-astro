import { getCollection, type CollectionEntry } from 'astro:content';
import { NOTE_TAG } from '../consts';

export type Post = CollectionEntry<'blog'>;
export type Project = CollectionEntry<'projects'>;

/** Drafts stay visible in `astro dev` so you can preview them, but never ship. */
const isVisible = (entry: { data: { draft: boolean } }): boolean =>
	import.meta.env.PROD ? !entry.data.draft : true;

const byNewest = (a: Post, b: Post): number => b.data.pubDate.valueOf() - a.data.pubDate.valueOf();

/**
 * `getCollection()` order is non-deterministic, so every query sorts here.
 * Routes should never call `getCollection('blog')` directly.
 */
export async function getPublishedPosts(): Promise<Post[]> {
	const posts = await getCollection('blog', isVisible);
	return posts.sort(byNewest);
}

export const isNote = (post: Post): boolean => post.data.tags.includes(NOTE_TAG);

/** Long-form entries only. */
export async function getArticles(): Promise<Post[]> {
	return (await getPublishedPosts()).filter((post) => !isNote(post));
}

/** Short-form entries, tagged `note`. */
export async function getNotes(): Promise<Post[]> {
	return (await getPublishedPosts()).filter(isNote);
}

export async function getPostsByTag(tag: string): Promise<Post[]> {
	return (await getPublishedPosts()).filter((post) => post.data.tags.includes(tag));
}

/** Tag slug -> number of published posts carrying it, sorted by count then name. */
export async function getAllTags(): Promise<Array<{ tag: string; count: number }>> {
	const counts = new Map<string, number>();
	for (const post of await getPublishedPosts()) {
		for (const tag of post.data.tags) {
			counts.set(tag, (counts.get(tag) ?? 0) + 1);
		}
	}
	return [...counts.entries()]
		.map(([tag, count]) => ({ tag, count }))
		.sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}

/** Ranked by shared-tag overlap, falling back to recency for ties. */
export async function getRelatedPosts(post: Post, limit = 3): Promise<Post[]> {
	const own = new Set(post.data.tags);
	return (await getPublishedPosts())
		.filter((candidate) => candidate.id !== post.id)
		.map((candidate) => ({
			candidate,
			overlap: candidate.data.tags.filter((tag) => own.has(tag)).length,
		}))
		.filter(({ overlap }) => overlap > 0)
		.sort((a, b) => b.overlap - a.overlap || byNewest(a.candidate, b.candidate))
		.slice(0, limit)
		.map(({ candidate }) => candidate);
}

/** Chronological neighbours for prev/next links on a post page. */
export async function getAdjacentPosts(
	post: Post,
): Promise<{ newer: Post | undefined; older: Post | undefined }> {
	const posts = await getPublishedPosts();
	const index = posts.findIndex((candidate) => candidate.id === post.id);
	if (index === -1) return { newer: undefined, older: undefined };
	return { newer: posts[index - 1], older: posts[index + 1] };
}

export async function getPublishedProjects(): Promise<Project[]> {
	const projects = await getCollection('projects', isVisible);
	return projects.sort(
		(a, b) => b.data.year - a.data.year || a.data.title.localeCompare(b.data.title),
	);
}

export async function getFeaturedProjects(): Promise<Project[]> {
	return (await getPublishedProjects()).filter((project) => project.data.featured);
}
