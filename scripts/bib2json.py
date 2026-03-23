"""Convert publications.bib to data/publications.json for Hugo."""

import json
import re
from pathlib import Path

import bibtexparser
from bibtexparser.middlewares import (
    LatexDecodingMiddleware,
    SeparateCoAuthors,
    SplitNameParts,
)

ROOT = Path(__file__).resolve().parent.parent
BIB_PATH = ROOT / "publications.bib"
OUT_PATH = ROOT / "data" / "publications.json"


def clean_braces(s: str) -> str:
    return re.sub(r"[{}]", "", s)


def raw_entry(key: str, bib_text: str) -> str:
    """Extract verbatim BibTeX block for an entry from the .bib source."""
    pattern = rf"(@\w+\{{{re.escape(key)}\s*,.*?(?=\n@|\n%\s*==|\Z))"
    m = re.search(pattern, bib_text, re.DOTALL)
    if m:
        return m.group(1).rstrip()
    return ""


def main():
    bib_text = BIB_PATH.read_text(encoding="utf-8")

    library = bibtexparser.parse_string(
        bib_text,
        append_middleware=[
            LatexDecodingMiddleware(),
            SeparateCoAuthors(),
            SplitNameParts(),
        ],
    )

    result = {}
    for entry in library.entries:
        fields = entry.fields_dict

        # Parse authors from SplitNameParts output
        authors = []
        author_field = fields.get("author")
        if author_field:
            val = author_field.value
            persons = val if isinstance(val, list) else [val]
            for p in persons:
                if hasattr(p, "last") and hasattr(p, "first"):
                    authors.append(
                        {"family": " ".join(p.last), "given": " ".join(p.first)}
                    )
                elif isinstance(p, str):
                    if "," in p:
                        last, first = p.split(",", 1)
                        authors.append(
                            {"family": last.strip(), "given": first.strip()}
                        )
                    else:
                        authors.append({"family": p.strip(), "given": ""})

        def field_val(key):
            f = fields.get(key)
            return f.value if f else None

        rec = {
            "type": entry.entry_type,
            "title": clean_braces(field_val("title") or ""),
            "authors": authors,
            "date": field_val("date") or "",
        }

        jt = field_val("journaltitle")
        if jt:
            rec["journal"] = jt
        for k in ("volume", "number", "pages", "doi", "url"):
            v = field_val(k)
            if v:
                rec[k] = v

        for k in ("series", "institution"):
            v = field_val(k)
            if v:
                rec[k] = clean_braces(v)
        if field_val("eprinttype") and entry.entry_type == "online":
            rec["publisher"] = field_val("eprinttype")

        rec["raw"] = raw_entry(entry.key, bib_text)

        result[entry.key] = rec

    OUT_PATH.write_text(json.dumps(result, indent=2, ensure_ascii=False) + "\n")
    print(f"Wrote {len(result)} entries to {OUT_PATH}")


if __name__ == "__main__":
    main()
