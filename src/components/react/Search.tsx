import { useEffect, useRef, useState } from 'react';

interface PagefindResultData {
	url: string;
	meta: { title?: string };
	excerpt: string;
}

interface PagefindResult {
	id: string;
	data: () => Promise<PagefindResultData>;
}

interface PagefindApi {
	search: (term: string) => Promise<{ results: PagefindResult[] }>;
	init?: () => Promise<void>;
}

/** The index only exists in a production build, so it is loaded lazily. */
async function loadPagefind(): Promise<PagefindApi | null> {
	try {
		// Indirection keeps TypeScript from resolving a path that only exists post-build.
		const path = '/pagefind/pagefind.js';
		const mod = (await import(/* @vite-ignore */ path)) as PagefindApi;
		await mod.init?.();
		return mod;
	} catch {
		return null;
	}
}

const MAX_RESULTS = 20;

export default function Search() {
	const [query, setQuery] = useState('');
	const [results, setResults] = useState<PagefindResultData[]>([]);
	const [state, setState] = useState<'idle' | 'searching' | 'ready' | 'unavailable'>('idle');
	const pagefind = useRef<PagefindApi | null>(null);

	useEffect(() => {
		let cancelled = false;
		const term = query.trim();

		if (term.length < 2) {
			setResults([]);
			setState('idle');
			return;
		}

		setState('searching');
		const timer = setTimeout(async () => {
			pagefind.current ??= await loadPagefind();
			if (!pagefind.current) {
				if (!cancelled) setState('unavailable');
				return;
			}

			const search = await pagefind.current.search(term);
			const data = await Promise.all(search.results.slice(0, MAX_RESULTS).map((r) => r.data()));
			if (cancelled) return;
			setResults(data);
			setState('ready');
		}, 200);

		return () => {
			cancelled = true;
			clearTimeout(timer);
		};
	}, [query]);

	return (
		<div className="search">
			<label htmlFor="search-input">Search posts and pages</label>
			<input
				id="search-input"
				type="search"
				value={query}
				autoComplete="off"
				placeholder="e.g. accessibility"
				onChange={(event) => setQuery(event.target.value)}
			/>

			<p aria-live="polite" className="search__status">
				{state === 'searching' && 'Searching…'}
				{state === 'ready' &&
					`${results.length} ${results.length === 1 ? 'result' : 'results'} for “${query.trim()}”`}
				{state === 'unavailable' && 'Search index unavailable — it is generated at build time.'}
			</p>

			{results.length > 0 && (
				<ul className="search__results">
					{results.map((result) => (
						<li key={result.url}>
							<a href={result.url}>{result.meta.title ?? result.url}</a>
							<p dangerouslySetInnerHTML={{ __html: result.excerpt }} />
						</li>
					))}
				</ul>
			)}
		</div>
	);
}
