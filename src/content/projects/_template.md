---
# Duplicate this file, rename it to your project's slug, and fill in the fields below.
# draft: true keeps it out of production (see isVisible() in src/lib/content.ts)
# but still visible when running `astro dev`, so you can preview it locally.
title: 'Project Title'
summary: 'One sentence describing the project.'
# One of: software, music, instrument, writing, other (see PROJECT_KINDS in src/consts.ts).
# Controls the vocabulary used on the project page, e.g. "Built with" vs "Made with".
kind: software
# role: 'What you did on this project' # optional
year: 2026 # required; used to sort projects newest-first
# madeWith: ['Astro', 'TypeScript'] # optional; stack, instruments, materials, etc.
# links: # optional array of { label, url }
#   - label: 'Visit site'
#     url: 'https://example.com'
featured: false # set true to surface this on the featured projects list
draft: true # ⭐ flip to false (or remove) when ready to publish
# cover: ./cover.png # optional; path relative to this file
# coverAlt: 'Describe the image for screen readers' # required if cover is set
---

Describe the project here. Markdown or MDX (rename to `.mdx` for components).
