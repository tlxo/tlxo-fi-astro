# What is this

This is the current repo to serve [tlxo.fi](https://tlxo.fi).

## Purpose

Building a personal blog with Astro, like it was both 2006 and 2026.

## Deployment status

The site lives at [Statichost](https://www.statichost.eu/) and you can access it at [tlxo.fi](https://tlxo.fi).

Pushing to `main` triggers production builds. Pull requests run GitHub Actions
checks for types, lint, formatting and build output. Statichost does not
currently provide automatic pull request deploy previews.

Local development and GitHub Actions use the exact Node version in `.nvmrc`.
Keep it aligned with the `node:` image tag in `statichost.yml` when updating Node.
The minimum supported Node version is declared in `package.json`; npm rejects
installs when the runtime does not meet project or dependency engine requirements.
Dependabot's npm updates do not update the hosting image or `.nvmrc`, so dependency
updates that raise the Node minimum require a coordinated runtime update.

## Accessibility scans

[![Accessibility Scanner](https://github.com/tlxo/tlxo-fi-astro/actions/workflows/accessibility-scan.yml/badge.svg)](https://github.com/tlxo/tlxo-fi-astro/actions/workflows/accessibility-scan.yml)

Run **Actions > Accessibility Scanner > Run workflow** to scan the deployed site.
With both inputs empty, the scan uses the seven representative URLs defined in
`scripts/accessibility-scan-urls.mjs`.

- Set only `head_ref` to a commit SHA or Git ref to scan changes against its first parent.
- Set both `base_ref` and `head_ref` to compare two commits or refs.
- Set only `base_ref` to compare it with the selected workflow commit.

References select changed files, not a historical deployment. The scanner always visits
the current `https://tlxo.fi` site, so wait for the relevant deployment to finish first.
Use the workflow's default branch selection to discover currently available routes;
the optional refs do not change the checked-out version or the deployed site.

Targeted runs build the checked-out site to discover public routes, excluding drafts and
deleted pages. Blog changes include all posts, blog listings, pagination, tags, home and
search because related-post and adjacent-post links can change. Project changes include
all project routes, home and search. Standalone-page changes include all standalone
routes. Shared components, styles, routes, authors, public assets and build configuration
select all built pages. Documentation-only changes skip the scan.

Scans create issues grouped by accessibility rule, without assigning Copilot. Each URL set
has its own persistent cache so a partial scan cannot close findings on unscanned pages.
Overlapping URL sets can create duplicate issues, and only rerunning the same URL set
reconciles its previous findings. Default scans keep their existing cache.

## Publishing a post

Add a Markdown file to `src/content/blog/` and commit it. That is the whole
workflow. It works from the GitHub web editor without a local checkout;
Statichost rebuilds on push.

The filename becomes the URL: `src/content/blog/my-post.md` is served at `/blog/my-post/`.

```md
---
title: 'Post title'
description: 'One or two sentences. Used in listings and social previews.'
pubDate: 2026-09-07
tags: ['work', 'accessibility']
author: toni
---

Body content here.
```

### Frontmatter reference

| Field         | Required | Notes                                                             |
| :------------ | :------- | :---------------------------------------------------------------- |
| `title`       | yes      |                                                                   |
| `description` | yes      | Shown in listings and `og:description`                            |
| `pubDate`     | yes      | `YYYY-MM-DD`                                                      |
| `updatedDate` | no       | Shown on the post when set                                        |
| `tags`        | no       | Lowercase kebab-case only — the build fails otherwise             |
| `draft`       | no       | `true` hides it from the production build, still visible in `dev` |
| `author`      | no       | Must match a file in `src/content/authors/`                       |
| `heroImage`   | no       | Path relative to the post; requires `heroAlt`                     |
| `heroAlt`     | no       | Required when `heroImage` is set                                  |
| `link`        | no       | Set it and the post renders as a link-blog note                   |

### Notes vs. posts

There is one `blog` collection. A short-form note is just a post tagged `note`, usually with
a `link` pointing at whatever prompted it. Everything else — professional vs. hobby — is
separated by tags (`work`, `personal`), not by folders or URLs.

Tags must be lowercase kebab-case. This is enforced by the content schema, so a typo like
`Note` or `web performance` fails the build rather than quietly creating an orphan tag page.

### Embedding audio

Rename a post to `.mdx` to embed the reusable player. Supply the title and artist shown
alongside the player; provider embeds also show their own playback metadata. Artwork is
optional and decorative when the title is already present. SoundCloud takes a track URL,
Bandcamp takes the `src` URL from its official small-player embed code, and `file` takes a
direct audio file URL or site path.

```mdx
import AudioPlayer from '../../components/AudioPlayer.astro';

<AudioPlayer
  provider="soundcloud"
  src="https://soundcloud.com/artist/track"
  title="Track title"
  artist="Artist name"
  artwork="https://example.com/cover.jpg"
  transcriptUrl="/transcripts/track/"
/>
```

Use `provider="bandcamp"` with its official `https://bandcamp.com/EmbeddedPlayer/...` URL,
or `provider="file"` with a direct audio source. File playback uses the browser's native
controls and does not preload the audio. Players do not autoplay. Provide a transcript or
equivalent text alternative when needed for prerecorded audio-only content. MDX posts use
their description as the RSS content.

MDX supports executable components and is not passed through the Markdown HTML sanitizer.
Only use trusted MDX source.

SoundCloud and Bandcamp playback controls are third-party iframes. The site labels each
iframe and presents author-supplied title, artist and artwork, but cannot ensure that
third-party controls meet WCAG 2.2. Verify keyboard and assistive-technology behavior with
the actual embed before relying on it.

### Other content

- `src/content/pages/` — standalone pages, served at `/<filename>/`
- `src/content/projects/` — project entries, served at `/projects/<filename>/`
- `src/content/authors/` — author records referenced by `author`

### Projects

Projects are not all software, so `kind` selects the vocabulary a project page uses. An
instrument build gets "Materials and tools" where a web app gets "Built with".

| Field      | Required | Notes                                                                |
| :--------- | :------- | :------------------------------------------------------------------- |
| `title`    | yes      |                                                                      |
| `summary`  | yes      | One or two sentences, used in the list and social previews           |
| `kind`     | yes      | `software`, `music`, `instrument`, `writing` or `other`              |
| `year`     | yes      | Number                                                               |
| `role`     | no       | Free text, e.g. `Design and development`, `Writing and production`   |
| `madeWith` | no       | Stack, instruments, timbers — whatever it was made from              |
| `links`    | no       | List of `{ label, url }`; covers source code, Bandcamp, photos, etc. |
| `featured` | no       | `true` surfaces it on the home page                                  |
| `draft`    | no       | `true` hides it from the production build                            |
| `cover`    | no       | Requires `coverAlt`                                                  |

```md
---
title: 'Tenor ukulele #2'
summary: 'A concert-scale tenor built from a storm-felled birch.'
kind: instrument
role: 'Design and build'
year: 2026
madeWith: ['Birch', 'Spruce top', 'Hide glue', 'Shellac']
links:
  - label: 'Build photos'
    url: 'https://example.com/album'
---
```

## Commands

| Command           | Action                                                    |
| :---------------- | :-------------------------------------------------------- |
| `npm install`     | Install dependencies                                      |
| `npm run dev`     | Dev server at `localhost:4321` (drafts visible)           |
| `npm run build`   | Build to `./dist/` and generate the Pagefind search index |
| `npm run preview` | Serve the built site, including working search            |
| `npm run check`   | Astro + TypeScript type check                             |
| `npm run lint`    | ESLint                                                    |
| `npm run format`  | Prettier, write                                           |
| `npm run assets`  | Regenerate the OG image and app icons                     |

Search only works against a production build, since the index is generated from the built
HTML. Use `npm run preview` to test it.

## How it fits together

- **Astro 7**, static output, no adapter. Pages ship no JavaScript unless they need it.
- **Content collections** with Zod schemas in `src/content.config.ts` — malformed frontmatter
  fails the build instead of rendering wrong.
- **`src/lib/content.ts`** holds every content query. Pages never call `getCollection()`
  directly, because its ordering is not deterministic.
- **React islands** for search (`/search/`) and tag filtering (`/blog/`) only. The theme
  toggle is deliberately vanilla so the React runtime does not load site-wide.
- **Pagefind** builds the search index from `dist/` after each build.
- **`src/consts.ts`** is the single source of truth for site metadata and navigation.
