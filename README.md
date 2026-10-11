# Youthy WANG · A personal corner

A redesigned GitHub Pages / Jekyll personal site. This is the **complete deployable source tree**, not a static screenshot or a partial overlay. The visual system follows the approved V8 layout with the V12 centered portrait correction.

## Site navigation

- `/` — About (English by default; EN / 中 switches only the About page).
- `/blog/` — Markdown blog index. The Coursework Notes entry is here, not in the header.
- `/vibe-coding/` — English-only interactive experiments.
- `/archive/` — three automatically generated coursework category cards.
- `/coursework/ug-math/`, `/coursework/ug-cs/`, `/coursework/ug-stat/` — original detailed course descriptions and direct PDF links. The third card is displayed as **Data Science**.
- `/cv/` — CV authored as Markdown.

Light mode is the default. The theme control remembers a visitor's preference. The About portrait starts with the approved illustrated avatar. Clicking the portrait (no visible hint) reveals the original photograph briefly, then automatically returns to the illustration.

## Add a blog post (unchanged workflow)

Create another `_posts/YYYY-MM-DD-slug.md`, with front matter and Markdown:

```markdown
---
title: "My New Note"
date: 2026-10-11
tags:
  - research
---

Write normal **Markdown** here, with tables and LaTeX as before.

Inline: $E[X]$.

$$
\sum_{i=1}^n i = \frac{n(n+1)}{2}
$$
```

Commit and push as before. Jekyll automatically lists the new post on `/blog/` and formats its full article with `_layouts/studio-post.html`; **no additional HTML or CSS editing required**.

## Add a Vibe Coding project (same idea as adding a blog post)

New projects are a native Jekyll collection, not manually added HTML cards.

1. Copy `_templates/vibe-project-example.md` into `_vibe_projects/` and rename it, e.g. `_vibe_projects/my-ai-experiment.md`.
2. Set `title`, `date`, and `summary` at the top, then write the project description below `---` using normal Markdown.
3. Optionally add `tech`, `status`, `image` (a cover image uploaded under `images/projects/`), `github_url`, and `demo_url`.
4. Commit and push **exactly as you would a blog post**. The card appears automatically in `/vibe-coding/` (newest first), and clicking it opens `/vibe-coding/my-ai-experiment/` with the same visual style and support for code blocks, tables and math.

The two existing interactive demos remain below the project cards. The empty Projects state automatically disappears after you add your first project. No change to `_pages/vibe-coding.html` is needed for new entries. The `_templates/` example is **not published** as a project.

Minimal example:

```markdown
---
title: "Exploring an AI Coding Agent"
date: 2026-10-11
summary: "A small learning experiment using AI-assisted programming."
tech: [Python, AI]
# github_url: https://github.com/YouthyWang/your-project
# image: /images/projects/agent.png
---

## What I tried
My project write-up goes here.
```

**Note:** this is only an example. There are no invented projects on the live site.


## Jekyll / GitHub Pages

This project uses the GitHub Pages–compatible `github-pages` gem with standard `_posts` and `_coursework` collections. GitHub Pages builds new Markdown posts automatically on push when **Settings → Pages → Deploy from a branch** is configured for the correct branch (e.g. `master` or `main`) and root `/`.

Local installation, if you have Ruby/Bundler:

```bash
bundle install
bundle exec jekyll serve
# Open http://127.0.0.1:4000/
```

Optional source-level content check (Python 3):

```bash
python3 scripts/verify_content.py
```

A minified local MathJax 3 TeX-to-SVG component and its license are in `assets/vendor/mathjax/`; math formulas do not require a third-party CDN. Blog Markdown tables remain ordinary GFM/Kramdown tables.

