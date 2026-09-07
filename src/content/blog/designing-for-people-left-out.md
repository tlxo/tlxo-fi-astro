---
title: 'Designing for the people usually left out'
description: 'Accessibility is not a checklist you run at the end. It is a set of decisions you make at the start, and most of them are cheap if you make them early.'
pubDate: 2026-08-14
tags: ['work', 'accessibility', 'design']
author: toni
---

Most accessibility work I get called in for arrives late. The design is signed off, the
build is nearly done, and someone has run an automated scan that returned four hundred
issues. The scan is not wrong, but it is measuring the wrong thing at the wrong time.

## The expensive problems are structural

Automated tools are good at catching contrast ratios and missing alt attributes. Those are
real, and they are also the cheapest things to fix. What tools cannot tell you is that the
navigation makes no sense when you cannot see the whole page at once, or that a form asks
for information in an order nobody thinks in.

Those problems are structural. By the time there is a build to scan, fixing them means
undoing decisions rather than making different ones.

## What actually helps

- Decide the heading structure before the visual design. If the outline does not read
  sensibly as a table of contents, the page is not organised yet.
- Write the error states first. They are where interfaces fail people under pressure, and
  they are always the last thing anyone designs.
- Use real content early. Lorem ipsum hides every problem that long words, long names and
  empty states will cause later.

None of this is expensive. It is just earlier than most processes allow for.
