# What is this

This is the current repo to serve [tlxo.fi](https://tlxo.fi).

## Purpose

Building a personal blog with Astro, like it was both 2005 and 2025.

## Deployment status

The site lives on Netlify and you can access it at [tlxo.fi](https://tlxo.fi).

[![Netlify Status](https://api.netlify.com/api/v1/badges/c86f0f42-b4ff-4d7b-a178-53f5375f2c26/deploy-status)](https://app.netlify.com/sites/tlxo-fi/deploys)

Pushing to `main` triggers a production build. Pull requests get a deploy preview, plus a
GitHub Actions run that type-checks, lints and builds.

## Publishing a post

Add a Markdown file to `src/content/blog/` and commit it. That is the whole workflow — it
works from the GitHub web editor, no local checkout needed. Netlify rebuilds on push.

The filename becomes the URL: `src/content/blog/my-post.md` is served at `/blog/my-post/`.

```md
---
title: 'Post title'
description: 'One or two sentences. Used in listings, the RSS feed and social previews.'
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
| `description` | yes      | Shown in listings, RSS and `og:description`                       |
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

### Other content

- `src/content/pages/` — standalone pages, served at `/<filename>/`
- `src/content/projects/` — project entries, served at `/projects/<filename>/`
- `src/content/authors/` — author records referenced by `author`

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
