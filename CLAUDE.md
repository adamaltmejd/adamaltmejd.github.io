# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Personal academic website for Adam Altmejd (adamaltmejd.se). Hugo static site. Zero external build dependencies.

## Build & Development

```bash
hugo server             # dev server with live reload
hugo                    # production build → public/
```

Hugo Pipes compiles SCSS via built-in Dart Sass. No Node, npm, Gulp, or other tooling needed.

To update the CV submodule: `git submodule update --remote`
To rebuild CV PDFs: `cd cv && make` (requires pandoc, xelatex, latexmk)

## Architecture

- **`data/research.yml`** — single source of truth for all publications and working papers. Drives the homepage and project pages via `layouts/partials/publication-list.html`. Each entry has `id`, `type` (Publications / Work in Progress), `project` tag, and metadata (coauthors, DOI, abstract, media coverage).
- **`content/projects/`** — project pages (College Choice, Reproducibility, COVID-19). The `project` front-matter field filters entries from `research.yml`.
- **`assets/scss/`** — SCSS source. `style.scss` imports `_variables`, `_base` (minimal reset), `_main`, `_cv`. No frameworks — all custom CSS.
- **`cv/`** — git submodule (`adamaltmejd/cv`). Built separately with `make`. The CV page layout reads `cv/cv.html` via `readFile`.
- **`static/`** — files copied as-is to output. Images at `static/assets/img/`, papers at `static/assets/papers/`.
- **Layouts**: `_default/baseof.html` (base) → `index.html` (homepage with full pub list), `projects/single.html` (project with filtered pub list), `projects/list.html` (project index), `cv/list.html` (CV page).
