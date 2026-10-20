import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { defaultPaths, scanConfig, selectPaths } from './accessibility-scan-urls.mjs';

const routes = [
	'/',
	'/about/',
	'/cv/',
	'/blog/',
	'/blog/first/',
	'/blog/second/',
	'/blog/page/2/',
	'/tags/',
	'/tags/work/',
	'/projects/',
	'/projects/example/',
	'/search/',
];

test('blog changes include related posts, listings, pagination, tags, home and search', () => {
	assert.deepEqual(
		selectPaths(['src/content/blog/first.md'], routes),
		routes
			.filter((route) => !['/about/', '/cv/', '/projects/', '/projects/example/'].includes(route))
			.sort(),
	);
});

test('project changes include projects, home and search', () => {
	assert.deepEqual(selectPaths(['src/content/projects/new.mdx'], routes), [
		'/',
		'/projects/',
		'/projects/example/',
		'/search/',
	]);
});

test('standalone changes conservatively include standalone routes', () => {
	assert.deepEqual(selectPaths(['src/content/pages/about.md'], routes), [
		'/',
		'/about/',
		'/cv/',
		'/search/',
	]);
});

test('shared changes cover every built page', () => {
	for (const file of [
		'src/components/Header.astro',
		'src/styles/global.css',
		'src/pages/[...slug].astro',
		'src/content/authors/toni.json',
		'public/images/logo.png',
		'astro.config.mjs',
		'package-lock.json',
	]) {
		assert.deepEqual(selectPaths([file], routes), [...routes].sort());
	}
});

test('docs, workflows and content templates do not select pages', () => {
	assert.deepEqual(
		selectPaths(['README.md', '.github/workflows/ci.yml', 'src/content/blog/_template.md'], routes),
		[],
	);
});

test('unbuilt drafts and deleted pages are not selected', () => {
	const selected = selectPaths(
		['src/content/blog/deleted.md', 'src/content/blog/draft.md'],
		routes,
	);
	assert.ok(!selected.includes('/blog/deleted/'));
	assert.ok(!selected.includes('/blog/draft/'));
	assert.ok(selected.includes('/blog/'));
});

test('default scans retain their existing cache and deduplicate URLs', () => {
	const result = scanConfig([...defaultPaths, defaultPaths[0]]);
	assert.equal(result.urls.length, 7);
	assert.equal(result.cacheKey, 'cached-results-tlxo.fi-production.json');
});

test('targeted caches are stable per URL set and isolated from other scopes', () => {
	const first = scanConfig(['/about/', '/cv/']);
	assert.equal(first.cacheKey, scanConfig(['/cv/', '/about/']).cacheKey);
	assert.notEqual(first.cacheKey, scanConfig(['/about/']).cacheKey);
	assert.notEqual(first.cacheKey, scanConfig(defaultPaths).cacheKey);
});

test('CLI resolves refs, selects built routes and writes GitHub outputs', (context) => {
	const directory = mkdtempSync(path.join(tmpdir(), 'accessibility-scan-'));
	context.after(() => rmSync(directory, { recursive: true, force: true }));
	const git = (...args) => execFileSync('git', args, { cwd: directory, stdio: 'pipe' });
	const commit = () => {
		git('add', '.');
		git(
			'-c',
			'user.name=Scanner Test',
			'-c',
			'user.email=scanner@example.invalid',
			'commit',
			'-m',
			'Fixture',
		);
	};
	git('init');
	writeFileSync(path.join(directory, 'README.md'), 'Initial');
	commit();
	mkdirSync(path.join(directory, 'src/content/blog'), { recursive: true });
	writeFileSync(path.join(directory, 'src/content/blog/new.md'), 'Published post');
	commit();
	writeFileSync(path.join(directory, 'README.md'), 'Documentation update');
	commit();
	for (const route of ['/', '/blog/', '/blog/new/', '/search/']) {
		const output = path.join(directory, 'dist', route);
		mkdirSync(output, { recursive: true });
		writeFileSync(path.join(output, 'index.html'), '<html></html>');
	}
	const script = fileURLToPath(new URL('./accessibility-scan-urls.mjs', import.meta.url));
	const outputFile = path.join(directory, 'github-output');
	const run = (baseRef = '', headRef = '') => {
		writeFileSync(outputFile, '');
		const result = spawnSync(process.execPath, [script], {
			cwd: directory,
			encoding: 'utf8',
			env: { ...process.env, BASE_REF: baseRef, HEAD_REF: headRef, GITHUB_OUTPUT: outputFile },
		});
		return { ...result, output: readFileSync(outputFile, 'utf8') };
	};
	const defaults = run();
	assert.equal(defaults.status, 0, defaults.stderr);
	assert.ok(defaults.output.includes('cache_key=cached-results-tlxo.fi-production.json\n'));
	assert.ok(defaults.output.includes('https://tlxo.fi/cv/'));
	for (const refs of [
		['', 'HEAD~1'],
		['HEAD~2', 'HEAD~1'],
		['HEAD~2', ''],
	]) {
		const result = run(...refs);
		assert.equal(result.status, 0, result.stderr);
		assert.ok(result.output.includes('has_urls=true\n'));
		assert.ok(result.output.includes('https://tlxo.fi/blog/new/\n'));
		assert.ok(!result.output.includes('https://tlxo.fi/cv/'));
	}
	const docs = run('', 'HEAD');
	assert.equal(docs.status, 0, docs.stderr);
	assert.ok(docs.output.includes('has_urls=false\n'));
	for (const invalidRef of ['nonexistent-ref', '--help']) {
		assert.notEqual(run('', invalidRef).status, 0);
	}
});
