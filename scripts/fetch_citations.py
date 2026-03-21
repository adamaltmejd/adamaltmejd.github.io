"""Fetch citation counts from Semantic Scholar and write data/citations.json."""

import json
import sys
import time
from pathlib import Path
from urllib.request import Request, urlopen
from urllib.error import HTTPError, URLError

ROOT = Path(__file__).resolve().parent.parent
PUBLICATIONS_PATH = ROOT / "data" / "publications.json"
OUT_PATH = ROOT / "data" / "citations.json"

S2_API = "https://api.semanticscholar.org/graph/v1/paper/DOI:{doi}?fields=paperId,citationCount"
REQUEST_DELAY = 1.0  # seconds between requests to respect rate limits


def fetch_citation(doi: str) -> dict | None:
    url = S2_API.format(doi=doi)
    req = Request(url, headers={"User-Agent": "adamaltmejd.se citation fetcher"})
    try:
        with urlopen(req, timeout=10) as resp:
            return json.loads(resp.read())
    except HTTPError as e:
        print(f"  HTTP {e.code} for DOI {doi}", file=sys.stderr)
    except (URLError, TimeoutError) as e:
        print(f"  Network error for DOI {doi}: {e}", file=sys.stderr)
    return None


def main():
    publications = json.loads(PUBLICATIONS_PATH.read_text(encoding="utf-8"))

    # Load existing citations to preserve data for entries that fail to fetch
    existing = {}
    if OUT_PATH.exists():
        existing = json.loads(OUT_PATH.read_text(encoding="utf-8"))

    citations = {}
    dois = {key: entry["doi"] for key, entry in publications.items() if "doi" in entry}

    print(f"Fetching citations for {len(dois)} papers with DOIs...")
    for i, (key, doi) in enumerate(dois.items()):
        if i > 0:
            time.sleep(REQUEST_DELAY)
        print(f"  [{i+1}/{len(dois)}] {key}")
        data = fetch_citation(doi)
        if data and data.get("paperId"):
            citations[key] = {
                "paperId": data["paperId"],
                "citationCount": data.get("citationCount", 0),
            }
        elif key in existing:
            print(f"    Using cached data for {key}")
            citations[key] = existing[key]

    OUT_PATH.write_text(json.dumps(citations, indent=2, ensure_ascii=False) + "\n")
    print(f"Wrote citation data for {len(citations)} entries to {OUT_PATH}")


if __name__ == "__main__":
    main()
