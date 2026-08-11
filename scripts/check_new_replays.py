#!/usr/bin/env python3
"""
Detect webinar replays (and upcoming webinars) that exist in the Google Sheet
but are missing from the LIVE sitemap.xml — i.e. added since the last deploy.

Prints the new URLs and, when running in GitHub Actions, writes them to
$GITHUB_OUTPUT as `new_urls=<space-separated list>` so the workflow can
trigger a rebuild and an IndexNow submission.

Exit code is always 0 (finding nothing new is not an error).
"""
import json
import os
import re
import sys
import urllib.request

HOST = "www.dentalmarketingsociety.com"
SHEET_ID = "1ZRLgCnOEvEO0hJo2kyUpl_yP3E6e8fdwvWJUUfcv5qY"


def slugify(value: str) -> str:
    """Mirror of lib/slug.ts — must produce identical slugs."""
    v = (value or "item").lower().replace("&", " and ")
    v = re.sub(r"[^a-z0-9]+", "-", v).strip("-")[:72]
    return v or "item"


def sheet_urls(tab: str, prefix: str):
    url = (
        f"https://docs.google.com/spreadsheets/d/{SHEET_ID}/gviz/tq"
        f"?tqx=out:json&headers=1&sheet={tab}"
    )
    raw = urllib.request.urlopen(url, timeout=30).read().decode("utf-8", "ignore")
    m = re.search(r"setResponse\(([\s\S]*)\)", raw)
    if not m:
        return []
    table = json.loads(m.group(1))["table"]
    cols = [(c.get("label") or "").strip().lower() for c in table["cols"]]

    def cell(row, name):
        try:
            i = cols.index(name)
        except ValueError:
            return ""
        c = row["c"][i] if i < len(row["c"]) else None
        return str(c["v"]).strip() if c and c.get("v") is not None else ""

    urls = []
    for r in table["rows"]:
        title = cell(r, "title")
        if not title:
            continue
        slug = cell(r, "slug") or slugify(title)
        urls.append(f"https://{HOST}/{prefix}/{slug}/")
    return urls


def live_sitemap_urls():
    with urllib.request.urlopen(f"https://{HOST}/sitemap.xml", timeout=30) as resp:
        xml = resp.read().decode("utf-8", "ignore")
    return set(re.findall(r"<loc>([^<]+)</loc>", xml))


def main():
    live = live_sitemap_urls()
    wanted = sheet_urls("webinar-replays", "replays") + sheet_urls("webinars", "webinars")
    new = [u for u in wanted if u not in live]

    if new:
        print(f"{len(new)} new URL(s) not yet in the live sitemap:")
        for u in new:
            print(f"  {u}")
    else:
        print("Sitemap is up to date — no new replays or webinars in the sheet.")

    out = os.environ.get("GITHUB_OUTPUT")
    if out:
        with open(out, "a", encoding="utf-8") as f:
            f.write(f"new_urls={' '.join(new)}\n")


if __name__ == "__main__":
    try:
        main()
    except Exception as e:  # network hiccups must not fail the cron run
        print(f"check failed (non-fatal): {e}", file=sys.stderr)
        out = os.environ.get("GITHUB_OUTPUT")
        if out:
            with open(out, "a", encoding="utf-8") as f:
                f.write("new_urls=\n")
