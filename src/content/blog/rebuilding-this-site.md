---
title: 'Rebuilding this site, like it was both 2005 and 2025'
description: 'Notes on moving tlxo.fi from a single hand-written page to something that can hold a blog, without giving up the plain-Markdown workflow.'
pubDate: 2026-09-07
tags: ['personal', 'meta', 'astro']
author: toni
---

This site was one page for a long time. A logo, a sentence, an email address. That was
deliberate: I wanted somewhere to point people, and I did not want a project.

The trouble with not wanting a project is that you also never write anything.

## The one rule

Whatever I built had to keep a single property: adding a post should mean adding a Markdown
file. No database, no admin panel to log into, no build step I have to run locally and
remember to commit. Edit a file on GitHub, and the site rebuilds itself.

Everything else was negotiable. That rule was not.

## What that ruled out

It ruled out most things, pleasantly. No CMS to host. No comments system. No server to keep
patched. What is left is a static site generator, a git repository, and a build hook, which
is roughly the 2005 version of a personal website with thirty years of better tooling
underneath it.

The parts I did want from 2025: typed content, so a malformed post fails the build instead
of rendering wrong; real accessibility rather than a plugin; and fast pages that do not ship
a framework to render text.
