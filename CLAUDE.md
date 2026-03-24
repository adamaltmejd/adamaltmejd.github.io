# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Personal academic website for Adam Altmejd (adamaltmejd.se). Hugo static site with a custom theme (`themes/researcher/`).

## Build & Develop

```bash
hugo server             # dev server with live reload
hugo                    # production build → public/
```

Deployment is handled by GitHub Actions (`.github/workflows/deploy.yml`): builds Hugo site, generates CV PDF (pandoc → typst), and deploys to Cloudflare Pages via `wrangler pages deploy`.

## Citation data

`publications.bib` (managed in Zotero) is the source of truth for citation metadata. `.github/scripts/bib2json.py` converts it to `data/publications.json`, which Hugo reads at build time. A GitHub Action (`.github/workflows/bib2json.yml`) runs bib2json automatically on push when `publications.bib` changes. To run locally:

```bash
uv run --with 'bibtexparser>=2.0.0b7' .github/scripts/bib2json.py
```

Content files in `content/research/` are page bundles named by bib citekey (e.g., `Altmejd_ea_2021_BrotherWhereStart/index.md`). Templates look up bib data via `partial "citekey.html" .` which resolves the bundle directory name. Pages without a bib entry (WIP) render fine — bib fields are guarded with `{{ with }}`. To add a figure to a paper page, place a `figure.*` image file in the page bundle directory.

## Lint & Format (always run before committing)

```bash
bunx stylelint "themes/researcher/assets/scss/**/*.scss"       # lint SCSS
bunx stylelint "themes/researcher/assets/scss/**/*.scss" --fix  # auto-fix
djlint themes/researcher/layouts/ --lint               # lint templates (use fd: fd -e html . themes/researcher/layouts/ | xargs djlint --lint)
djlint themes/researcher/layouts/ --reformat           # format templates
```

## Visual Testing

Playwright MCP is configured (`.mcp.json`, Firefox). Use it to visually verify changes via `hugo server` (default `http://localhost:1313`).

## Architecture

- **`themes/researcher/`** — reusable Hugo theme. Layouts, SCSS, collapse JS. No frameworks.
- **`content/research/`** — page bundles per publication, directory named by bib citekey. Each contains `index.md` and optionally a `figure.*` image. Front matter has `authors`, `publication_type`, `projects` (taxonomy), `abstract`, `status`, `figure_caption`, etc. Citation metadata (journal, doi, volume, etc.) comes from `data/publications.json`, not front matter.
- **`data/publications.json`** — structured citation data keyed by citekey, generated from `publications.bib`.
- **`content/projects/`** — taxonomy term pages. Auto-populated from `projects` field in research pages. Each `_index.md` adds descriptive content.
- **`themes/researcher/assets/scss/`** — `style.scss` imports `_variables`, `_base`, `_main`, `_cv`. All custom CSS.
- **`content/cv/_index.md`** — CV body in markdown. `<!-- PUBLICATIONS -->` marker splits static content from dynamically generated Publications/Working Papers sections. Outputs both HTML and `CVMD` (pandoc-compatible markdown at `/cv/cv.md`).
- **`themes/researcher/cv-pdf/`** — typst template and fonts for CV PDF generation (used by CI, not Hugo).
- **`static/`** — images at `static/assets/img/`, papers at `static/assets/papers/`.
