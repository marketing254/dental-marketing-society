#!/usr/bin/env python3
"""
Submit URLs to IndexNow (Bing, Yandex, Naver, Seznam — NOT Google).

Usage:
    python indexnow.py                 # submit the default URL list below
    python indexnow.py https://www.dentalmarketingsociety.com/about/  ...   # submit specific URLs

The key file must already be live at:
    https://www.dentalmarketingsociety.com/753d2483e668c125d1c29c3c0d573a9c.txt
"""
import json
import sys
import urllib.request

HOST = "www.dentalmarketingsociety.com"
KEY = "753d2483e668c125d1c29c3c0d573a9c"
KEY_LOCATION = f"https://{HOST}/{KEY}.txt"
ENDPOINT = "https://api.indexnow.org/indexnow"

# Default pages to submit (edit freely). Add replay/webinar URLs as needed.
DEFAULT_URLS = [
    f"https://{HOST}/",
    f"https://{HOST}/about/",
    f"https://{HOST}/events/",
    f"https://{HOST}/speakers/",
    f"https://{HOST}/reviews/",
    f"https://{HOST}/partners/",
    f"https://{HOST}/msm/",
    f"https://{HOST}/resources/",
    f"https://{HOST}/contact/",
    f"https://{HOST}/speaker/",
]


def submit(urls):
    payload = {
        "host": HOST,
        "key": KEY,
        "keyLocation": KEY_LOCATION,
        "urlList": urls,
    }
    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(
        ENDPOINT,
        data=data,
        headers={"Content-Type": "application/json; charset=utf-8"},
        method="POST",
    )
    print(f"Submitting {len(urls)} URL(s) to IndexNow...")
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            print(f"HTTP {resp.status} {resp.reason}")
            body = resp.read().decode("utf-8", "ignore").strip()
            if body:
                print(body)
        print("Done. 200/202 = accepted.")
    except urllib.error.HTTPError as e:
        print(f"HTTP {e.code} {e.reason}")
        print(e.read().decode("utf-8", "ignore"))
        print(
            "\nCommon causes:\n"
            "  403 = key file not found/mismatched (deploy it, open the .txt URL to check)\n"
            "  422 = a URL's host doesn't match HOST\n"
            "  400 = malformed request"
        )
        sys.exit(1)
    except Exception as e:
        print(f"Request failed: {e}")
        sys.exit(1)


if __name__ == "__main__":
    urls = sys.argv[1:] or DEFAULT_URLS
    submit(urls)
