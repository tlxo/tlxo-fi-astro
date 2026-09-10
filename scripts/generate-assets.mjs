/**
 * Regenerates the static OG image and PWA icons from the brand palette.
 * Run with `npm run assets` after changing colours or wording.
 */
import { readFile } from 'node:fs/promises';
import sharp from 'sharp';

const OUT = new URL('../public/images/', import.meta.url);

const BG = '#020222';
const TEXT = '#dce6f2';
const ACCENT = '#d377b3';

// The wordmark is embedded so the OG card remains a single generated PNG.
const logo = await readFile(new URL('../public/images/icon.svg', import.meta.url));
const wordmark = (await readFile(new URL('../public/images/tlxo-logo.svg', import.meta.url)))
	.toString()
	.replaceAll('#101033', TEXT)
	.replaceAll('#ffffff', TEXT);
const wordmarkDataUri = `data:image/svg+xml;base64,${Buffer.from(wordmark).toString('base64')}`;

const ogSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="${BG}"/>
  <rect x="0" y="0" width="1200" height="10" fill="${ACCENT}"/>
	<rect x="80" y="96" width="72" height="8" fill="#7fb2dd"/>
	<text x="80" y="154" font-family="Helvetica, Arial, sans-serif" font-size="28" letter-spacing="2" fill="#7fb2dd">TONI LAAKSO</text>
	<image href="${wordmarkDataUri}" x="80" y="194" width="420" height="161" preserveAspectRatio="xMinYMid meet"/>
	<text x="80" y="435" font-family="Helvetica, Arial, sans-serif" font-size="38" fill="${ACCENT}">Welcome to the winter</text>
	<text x="80" y="481" font-family="Helvetica, Arial, sans-serif" font-size="38" fill="${ACCENT}">of my discontent.</text>
	<rect x="80" y="528" width="104" height="2" fill="#7fb2dd" opacity="0.8"/>
	<text x="80" y="570" font-family="Helvetica, Arial, sans-serif" font-size="32" fill="${TEXT}" opacity="0.7">tlxo.fi</text>
</svg>`;

await sharp(Buffer.from(ogSvg)).png().toFile(new URL('og-default.png', OUT).pathname);

for (const size of [192, 512]) {
	const padding = Math.round(size * 0.15);
	const inner = size - padding * 2;
	const mark = await sharp(logo)
		.resize(inner, inner, { fit: 'contain', background: BG })
		.toBuffer();

	await sharp({
		create: { width: size, height: size, channels: 4, background: BG },
	})
		.composite([{ input: mark, top: padding, left: padding }])
		.png()
		.toFile(new URL(`icon-${size}.png`, OUT).pathname);
}

// 32px PNG: every current browser accepts PNG favicons.
await sharp(logo)
	.resize(32, 32, { fit: 'contain', background: BG })
	.png()
	.toFile(new URL('favicon-32.png', OUT).pathname);

console.log('Generated og-default.png, icon-192.png, icon-512.png, favicon-32.png');
