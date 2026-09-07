/** Single source of truth for site metadata. Imported by SEO, feeds and nav. */

export const SITE = {
	title: 'Toni Laakso / tlxo',
	/** Used as the fallback <meta name="description"> and in the RSS feed. */
	description: 'Writing about UX, music, instruments, and whatever happens to float my boat.',
	tagline: 'My home on the web.',
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
	{ label: 'LinkedIn', href: 'https://linkedin.com/in/tonilaakso' },
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

/**
 * Projects are not all software. `kind` selects the vocabulary a project page uses,
 * so an instrument build does not get a "Built with" heading over a list of woods.
 */
export const PROJECT_KINDS = ['software', 'music', 'instrument', 'writing', 'other'] as const;
export type ProjectKind = (typeof PROJECT_KINDS)[number];

export const PROJECT_KIND_LABELS: Record<ProjectKind, { label: string; madeWith: string }> = {
	software: { label: 'Software', madeWith: 'Built with' },
	music: { label: 'Music', madeWith: 'Made with' },
	instrument: { label: 'Instrument', madeWith: 'Materials and tools' },
	writing: { label: 'Writing', madeWith: 'Written with' },
	other: { label: 'Other', madeWith: 'Made with' },
};

export const POSTS_PER_PAGE = 10;
