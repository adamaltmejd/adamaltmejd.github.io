# CLAUDE.md

Personal academic website for Adam Altmejd (adamaltmejd.se). Hugo static site with a custom theme (`themes/researcher/`).

## Build & Develop

```bash
hugo server             # dev server with live reload
hugo                    # production build → public/
```

## Deployment

Push to `master` triggers `.github/workflows/deploy.yml`: generates `publications.json` from bib, builds Hugo site, generates CV PDF (pandoc → typst), deploys to Cloudflare Pages via `bunx wrangler pages deploy`. Requires `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` secrets.

## Citation data

`publications.bib` (managed in Zotero) is the source of truth for citation metadata. `.github/scripts/bib2json.py` converts it to `data/publications.json` (gitignored build artifact), which Hugo reads at build time. CI generates it automatically; for local dev:

```bash
uv run --with 'bibtexparser>=2.0.0b7' .github/scripts/bib2json.py
```

Content files in `content/research/` are page bundles named by bib citekey (e.g., `Altmejd_ea_2021_BrotherWhereStart/index.md`). Templates look up bib data via `partial "citekey.html" .` which resolves the bundle directory name. Pages without a bib entry (WIP) render fine — bib fields are guarded with `{{ with }}`. To add a figure to a paper page, place a `figure.*` image file in the page bundle directory.

## Lint & Format (always run before committing)

```bash
bunx stylelint "themes/researcher/assets/scss/**/*.scss"       # lint SCSS
bunx stylelint "themes/researcher/assets/scss/**/*.scss" --fix  # auto-fix
fd -e html . themes/researcher/layouts/ | xargs djlint --lint        # lint templates
fd -e html . themes/researcher/layouts/ | xargs djlint --reformat   # format templates
```

## Visual Testing

Playwright MCP is configured (`.mcp.json`, Firefox). Use it to visually verify changes via `hugo server` (default `http://localhost:1313`).

## Architecture

- **`content/research/`** — page bundles named by bib citekey. Front matter has `authors`, `publication_type`, `projects` (taxonomy), `abstract`, `status`, etc. Citation metadata (journal, doi, volume) comes from `data/publications.json`, not front matter.
- **`content/cv/_index.md`** — `<!-- PUBLICATIONS -->` marker splits static content from dynamically generated publication lists. Outputs both HTML and `CVMD` (pandoc-compatible markdown at `/cv/cv.md`).
- **`themes/researcher/`** — custom Hugo theme. Layouts, SCSS, collapse JS. No frameworks.
