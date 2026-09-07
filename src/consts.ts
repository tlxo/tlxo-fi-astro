/** Single source of truth for site metadata. Imported by SEO, feeds and nav. */

export const SITE = {
	title: 'Toni Laakso / tlxo',
	/** Used as the fallback <meta name="description"> and in the RSS feed. */
	description: 'Writing about accessible, inclusive digital products — and things I make for fun.',
	tagline: 'Accessible, inclusive digital products — and things I make for fun.',
	url: 'https://tlxo.fi',
	locale: 'en',
	/** BCP 47 tag for <html lang>. */
	lang: 'en',
	email: 'toni@lxo.fi',
	defaultOgImage: '/images/og-default.png',
} as const;

export const AUTHOR = {
	id: 'toni',
	name: 'Toni Laakso',
	url: 'https://tlxo.fi',
} as const;

export const NAV: ReadonlyArray<{ label: string; href: string }> = [
	{ label: 'Blog', href: '/blog/' },
	{ label: 'Projects', href: '/projects/' },
	{ label: 'About', href: '/about/' },
	{ label: 'CV', href: '/cv/' },
	{ label: 'Search', href: '/search/' },
];

/** rel="me" links for IndieWeb identity verification. */
export const SOCIAL: ReadonlyArray<{ label: string; href: string }> = [
	{ label: 'GitHub', href: 'https://github.com/tlxo' },
];

/**
 * Tags that carry structural meaning: they drive routing, filtering and layout.
 * Enforced by the content schema so a typo fails the build instead of silently
 * creating an orphan tag page. Topic tags stay free-form alongside these.
 */
export const STRUCTURAL_TAGS = ['note', 'work', 'personal'] as const;
export type StructuralTag = (typeof STRUCTURAL_TAGS)[number];

/** Entries carrying this tag render as short-form notes rather than full articles. */
export const NOTE_TAG: StructuralTag = 'note';

export const POSTS_PER_PAGE = 10;
