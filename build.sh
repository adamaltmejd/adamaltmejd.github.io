#!/usr/bin/env bash
set -euo pipefail

hugo

pandoc \
  --from markdown+smart+yaml_metadata_block+definition_lists \
  --to typst \
  --template=cv/cv.template.typ \
  --standalone \
  --variable=git-date:"$(git log -1 --format=%cs HEAD 2>/dev/null)" \
  --output public/cv/cv.typ \
  public/cv/cv.md

typst compile --font-path cv/fonts public/cv/cv.typ public/cv/cv.pdf
rm -f public/cv/cv.typ
