# adamaltmejd.se

Personal academic website for [Adam Altmejd](https://adamaltmejd.se). Built with [Hugo](https://gohugo.io) using a custom theme ([`themes/researcher/`](themes/researcher/)).

## Build

```bash
uv run --with 'bibtexparser>=2.0.0b7' .github/scripts/bib2json.py  # generate citation data
hugo server                                                          # dev server
```

Publications are managed in `publications.bib` (Zotero) and converted to `data/publications.json` at build time.

## Deploy

Push to `master` triggers a GitHub Actions workflow that generates citation data, builds the site, renders a CV PDF (pandoc + typst), and deploys to Cloudflare Pages.

## License

Source code is distributed under the [MIT](http://opensource.org/licenses/MIT) license. Site content is available under [CC BY-SA 4.0](http://creativecommons.org/licenses/by-sa/4.0/).
