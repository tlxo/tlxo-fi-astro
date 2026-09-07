---
title: 'tlxo.fi'
summary: 'This site. A static Astro build with typed content collections, deployed from a Markdown-only authoring workflow.'
role: 'Design and development'
year: 2026
tech: ['Astro', 'TypeScript', 'React', 'Netlify']
url: 'https://tlxo.fi'
repo: 'https://github.com/tlxo/tlxo-fi-astro'
featured: true
---

A deliberately small personal site, rebuilt so that publishing a post means committing a
Markdown file and nothing else.

Content lives in typed collections validated with Zod, so a malformed post fails the build
rather than rendering incorrectly. Pages ship no JavaScript unless a specific feature needs
it.
