import { useEffect, useMemo, useState } from 'react';

interface Props {
	/** Tag slugs with their post counts, rendered as toggle buttons. */
	tags: Array<{ tag: string; count: number }>;
	totalPosts: number;
}

/**
 * Filters the server-rendered post list rather than re-rendering it, so the
 * full list is present in the HTML and this component is purely additive.
 */
export default function TagFilter({ tags, totalPosts }: Props) {
	const [active, setActive] = useState<string | null>(null);
	const [visible, setVisible] = useState(totalPosts);
	const [enabled, setEnabled] = useState(false);

	useEffect(() => setEnabled(true), []);

	const items = useMemo(
		() => (enabled ? Array.from(document.querySelectorAll<HTMLElement>('[data-post-tags]')) : []),
		[enabled],
	);

	useEffect(() => {
		if (!enabled) return;
		let shown = 0;
		for (const item of items) {
			const itemTags = (item.dataset['postTags'] ?? '').split(' ').filter(Boolean);
			const show = active === null || itemTags.includes(active);
			item.hidden = !show;
			if (show) shown += 1;
		}
		setVisible(shown);
	}, [active, items, enabled]);

	if (!enabled) return null;

	return (
		<div className="tag-filter">
			<p id="tag-filter-label">Filter by tag</p>

			<ul aria-labelledby="tag-filter-label">
				<li>
					<button type="button" onClick={() => setActive(null)} aria-pressed={active === null}>
						All
					</button>
				</li>
				{tags.map(({ tag, count }) => (
					<li key={tag}>
						<button
							type="button"
							onClick={() => setActive(active === tag ? null : tag)}
							aria-pressed={active === tag}
						>
							#{tag} <span aria-hidden="true">({count})</span>
						</button>
					</li>
				))}
			</ul>

			<p aria-live="polite" className="tag-filter__count">
				{visible} of {totalPosts} posts shown
				{active ? ` — tagged ${active}` : ''}
			</p>
		</div>
	);
}
