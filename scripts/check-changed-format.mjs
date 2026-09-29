import { execFileSync, spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const base = process.argv[2];

if (!base) {
	console.error('Usage: node scripts/check-changed-format.mjs <base-commit>');
	process.exit(1);
}

const changed = execFileSync('git', [
	'diff',
	'--name-only',
	'-z',
	'--diff-filter=ACMR',
	base,
	'HEAD',
	'--',
]);
const files = changed.toString('utf8').split('\0').filter(Boolean);

if (files.length === 0) {
	console.log('No changed files to format-check.');
	process.exit(0);
}

const prettier = fileURLToPath(
	new URL('../node_modules/prettier/bin/prettier.cjs', import.meta.url),
);
const result = spawnSync(
	process.execPath,
	[prettier, '--check', '--ignore-unknown', ...files.map((file) => `./${file}`)],
	{ stdio: 'inherit' },
);

if (result.error) throw result.error;
process.exit(result.status ?? 1);
