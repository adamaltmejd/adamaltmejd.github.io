# Researcher

A clean, minimal Hugo theme for academic personal websites. Designed for researchers who want to showcase publications, projects, and a CV — with optional PDF generation.

Requires Hugo extended edition >= 0.136.0.

## Features

- Publication pages driven by BibTeX data (`data/publications.json`)
- Collapsible abstracts, coauthor lists, and BibTeX entries (vanilla JS, no frameworks)
- Project taxonomy for grouping papers
- CV page with both HTML and pandoc-compatible markdown output
- Optional CV PDF generation via Typst (template and fonts included)
- Responsive layout, custom SCSS (no CSS framework)
- Lightbox for paper figures

## Installation

Add the theme to your Hugo site:

```bash
git submodule add https://github.com/adamaltmejd/adamaltmejd.se.git themes/researcher
```

Set in `hugo.yaml`:

```yaml
theme: researcher
```

## Configuration

### Site params

```yaml
params:
  description: "Site meta description"
  author:
    name: "Full Name"
    givenName: "Given"
    familyName: "Family"
    email: "email@example.com"
    phone: "+1 234 567 890"
    photo: "/assets/img/photo.jpg"  # sidebar photo
    github: "username"
    twitter: "username"
    linkedin: "username"
    orcid: "0000-0000-0000-0000"
    gscholarid: "scholar-id"
```

### Menu

```yaml
menu:
  main:
    - name: "Curriculum Vitae"
      url: /cv/
      weight: 10
      params:
        icon: "fas fa-file-alt"
    - name: "Research"
      url: /projects/
      weight: 20
      params:
        icon: "fas fa-pencil-alt"
```

### Taxonomies

```yaml
taxonomies:
  project: projects
```

### Required Hugo config

The CV markdown output format needs:

```yaml
mediaTypes:
  text/markdown:
    suffixes: ["md"]

outputFormats:
  CVMD:
    mediaType: text/markdown
    baseName: cv
    isPlainText: true
    notAlternative: true

markup:
  goldmark:
    renderer:
      unsafe: true  # needed for <!-- PUBLICATIONS --> marker in CV content
```

## Content structure

### Research pages

Page bundles in `content/research/`, named by BibTeX citekey:

```
content/research/
  AuthorName_2024_PaperTitle/
    index.md
    figure.png  # optional
```

Front matter:

```yaml
title: "Paper Title"
date: 2024-01-15
authors:
  - name: "First Author"
    site: "https://example.com"
  - name: "Second Author"
publication_type: "Publications"  # or "Work in Progress"
projects: ["project-slug"]
abstract: "The abstract text."
status: "Submitted"  # for working papers
figure_caption: "Caption for figure"
pdf: "paper.pdf"
ungated: "ungated-url"
appendix: "appendix.pdf"
```

Citation metadata (journal, DOI, volume, etc.) is read from `data/publications.json`, not front matter. Generate this file from a `.bib` file however you prefer — the expected structure is an object keyed by citekey with fields: `type`, `authors` (array of `{given, family}`), `title`, `journal`, `volume`, `number`, `pages`, `date`, `doi`, `url`, `raw` (BibTeX string).

### CV page

Create `content/cv/_index.md` with your CV in markdown. Use `<!-- PUBLICATIONS -->` as a marker — the template splits on it and injects publication lists from `data/publications.json` between the two halves.

### Projects

Add `_index.md` files in `content/projects/<slug>/` to provide descriptions for project taxonomy pages. Papers are automatically listed based on their `projects` front matter.

## CV PDF generation

The theme ships a Typst template and fonts in `cv-pdf/` for generating a PDF version of the CV. This requires a CI pipeline since Hugo can't run Typst.

### Pipeline overview

1. Hugo builds the site, producing a markdown CV at `/cv/cv.md` (via the CVMD output format)
2. Pandoc converts the markdown to Typst using `cv-pdf/cv.template.typ`
3. Typst compiles the `.typ` file to PDF using fonts from `cv-pdf/fonts/`

### CV params for PDF header

The markdown output template reads these for the PDF header:

```yaml
params:
  cv:
    homepage: "yoursite.com"
    mobile: "+1 234 567 890"
    address:
      affiliation: "University Name"
      online: "https://university.edu/profile"
      street: "Street Address"
      city: "City, Country"
```

### Build steps

After `hugo` builds the site (producing `public/cv/cv.md` via the CVMD output format):

```bash
pandoc \
  --from markdown+smart+yaml_metadata_block+definition_lists \
  --to typst \
  --template=themes/researcher/cv-pdf/cv.template.typ \
  --standalone \
  --variable=git-date:"$(git log -1 --format=%cs HEAD)" \
  --output public/cv/cv.typ \
  public/cv/cv.md

typst compile --font-path themes/researcher/cv-pdf/fonts \
  public/cv/cv.typ public/cv/cv.pdf
```

This produces `public/cv/cv.pdf`, ready to deploy alongside the rest of the site. Requires pandoc >= 3.0 and typst >= 0.12.

## License

MIT
