# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Personal academic website for Adam Altmejd (adamaltmejd.se). Hugo static site with a custom theme (`themes/researcher/`).

## Build & Develop

```bash
hugo server             # dev server with live reload
hugo                    # production build → public/
```

CV PDF is built by GitHub Actions (`.github/workflows/cv-pdf.yml`) on push when CV or research files change, and committed to `static/cv/cv.pdf`. Cloudflare Pages just runs `hugo`.

## Lint & Format (always run before committing)

```bash
bunx stylelint "themes/researcher/assets/scss/**/*.scss"       # lint SCSS
bunx stylelint "themes/researcher/assets/scss/**/*.scss" --fix  # auto-fix
djlint themes/researcher/layouts/ layouts/ --lint               # lint templates (use fd: fd -e html . themes/researcher/layouts/ layouts/ | xargs djlint --lint)
djlint themes/researcher/layouts/ layouts/ --reformat           # format templates
```

## Visual Testing

Playwright MCP is configured (`.mcp.json`, Firefox). Use it to visually verify changes via `hugo server` (default `http://localhost:1313`).

## Architecture

- **`themes/researcher/`** — reusable Hugo theme. Layouts, SCSS, collapse JS. No frameworks.
- **`content/research/`** — one markdown file per publication. Front matter has `authors`, `publication_type`, `projects` (taxonomy), `abstract`, `doi`, etc.
- **`content/projects/`** — taxonomy term pages. Auto-populated from `projects` field in research pages. Each `_index.md` adds descriptive content.
- **`themes/researcher/assets/scss/`** — `style.scss` imports `_variables`, `_base`, `_main`, `_cv`. All custom CSS.
- **`content/cv/_index.md`** — CV body in markdown. `<!-- PUBLICATIONS -->` marker splits static content from dynamically generated Publications/Working Papers sections. Outputs both HTML and `CVMD` (pandoc-compatible markdown at `/cv/cv.md`).
- **`cv/`** — typst template and fonts for PDF generation via `build.sh`.
- **`static/`** — images at `static/assets/img/`, papers at `static/assets/papers/`.
- **`layouts/cv/`** — `list.html` (HTML output, splits on marker + injects partial), `list.md` (pandoc markdown output with YAML front matter).
