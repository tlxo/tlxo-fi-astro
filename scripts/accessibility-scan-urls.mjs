import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { appendFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

export const defaultPaths = [
	'/about/',
	'/blog/',
	'/blog/vscode-keybindings/',
	'/cv/',
	'/search/',
	'/projects/',
	'/projects/tlxo-fi/',
];

export function selectPaths(changedFiles, availablePaths) {
	const files = changedFiles.filter(
		(file) => !file.split('/').some((part) => /^_template(?:\.|$)/.test(part)),
	);
	const shared = files.some(
		(file) =>
			(file.startsWith('src/') && !file.startsWith('src/content/')) ||
			file.startsWith('public/') ||
			file.startsWith('src/content/authors/') ||
			/^(?:astro\.config\.|package(?:-lock)?\.json$|tsconfig\.json$)/.test(file),
	);
	const blog = files.some((file) => file.startsWith('src/content/blog/'));
	const projects = files.some((file) => file.startsWith('src/content/projects/'));
	const pages = files.some((file) => file.startsWith('src/content/pages/'));

	return [...new Set(availablePaths)]
		.filter((route) => {
			if (shared) return true;
			if ((blog || projects) && (route === '/' || route === '/search/')) return true;
			if (blog && (route.startsWith('/blog/') || route.startsWith('/tags/'))) return true;
			if (projects && route.startsWith('/projects/')) return true;
			return (
				pages &&
				!route.startsWith('/blog/') &&
				!route.startsWith('/projects/') &&
				!route.startsWith('/tags/')
			);
		})
		.sort();
}

export function scanConfig(paths) {
	const urls = [...new Set(paths)].sort().map((route) => `https://tlxo.fi${route}`);
	const defaultUrls = [...defaultPaths].sort().map((route) => `https://tlxo.fi${route}`);
	const scope = createHash('sha256').update(urls.join('\n')).digest('hex');
	return {
		urls,
		cacheKey:
			JSON.stringify(urls) === JSON.stringify(defaultUrls)
				? 'cached-results-tlxo.fi-production.json'
				: `cached-results-tlxo.fi-production-${scope}.json`,
	};
}

function builtPaths(directory, prefix = '/') {
	return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
		if (entry.isDirectory()) {
			return builtPaths(path.join(directory, entry.name), `${prefix}${entry.name}/`);
		}
		return entry.name === 'index.html' ? [prefix] : [];
	});
}

function resolveCommit(ref) {
	return execFileSync('git', ['rev-parse', '--verify', '--end-of-options', `${ref}^{commit}`], {
		encoding: 'utf8',
	}).trim();
}

function main() {
	const baseRef = process.env.BASE_REF?.trim();
	const headRef = process.env.HEAD_REF?.trim();
	let paths = defaultPaths;
	if (baseRef || headRef) {
		const head = resolveCommit(headRef || 'HEAD');
		const base = resolveCommit(baseRef || `${head}^`);
		const changed = execFileSync('git', [
			'diff',
			'--name-only',
			'--no-renames',
			'-z',
			base,
			head,
			'--',
		])
			.toString('utf8')
			.split('\0')
			.filter(Boolean);
		paths = selectPaths(changed, builtPaths('dist'));
		console.log(`Changes: ${base}..${head}`);
	}
	const { urls, cacheKey } = scanConfig(paths);
	console.log(urls.length ? urls.join('\n') : 'No affected production pages to scan.');
	if (process.env.GITHUB_OUTPUT) {
		appendFileSync(
			process.env.GITHUB_OUTPUT,
			`has_urls=${urls.length > 0}\ncache_key=${cacheKey}\nurls<<SCAN_URLS\n${urls.join('\n')}\nSCAN_URLS\n`,
		);
	}
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
	main();
}
