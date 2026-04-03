#!/usr/bin/env python3
"""Direct fix: fetch images from Bing for all products missing images, upload to Supabase."""

import json, time, re, html, urllib.request, urllib.error, urllib.parse

SUPABASE_URL = "https://kwxkapanfkviibxjhgps.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt3eGthcGFuZmt2aWlieGpoZ3BzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzEyMDYwMywiZXhwIjoyMDg4Njk2NjAzfQ.K4qLj9niaFNHgfURLIGbTVEsrBuRt8LmH5bbg6M_pv0"
BUCKET = "catalog"
UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"

# Category -> search terms for Bing
CAT_SEARCH = {
    "WARDROBES_ALMIRAHS": "modern wooden wardrobe almirah furniture",
    "TV_UNITS": "modern tv unit stand wooden furniture",
    "STUDY_COMPUTER_TABLES": "modern study table desk wooden furniture",
    "BOOKSHELVES_DISPLAY": "modern wooden bookshelf display shelf",
    "SHOE_RACKS": "modern shoe rack cabinet wooden",
    "KITCHEN_PANTRY": "modular kitchen cabinet pantry wooden",
    "BEDROOM_FURNITURE": "modern wooden bed bedroom furniture",
    "DRESSING_TABLES": "modern dressing table vanity mirror wooden",
    "OFFICE_WORKSTATIONS": "modern office desk workstation wooden",
    "MODULAR_STORAGE": "modern storage cabinet modular wooden",
}

def bing_search(query, count=40):
    url = f"https://www.bing.com/images/search?q={urllib.parse.quote_plus(query)}&first=1&count={count}"
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            content = resp.read().decode("utf-8", errors="ignore")
    except Exception as e:
        print(f"  Search error: {e}")
        return []
    urls = re.findall(r'murl&quot;:&quot;(https?://[^&]+?)&quot;', content)
    if not urls:
        urls = re.findall(r'murl":"(https?://[^"]+?)"', content)
    cleaned = []
    seen = set()
    for u in urls:
        u = html.unescape(u)
        if any(x in u.lower() for x in [".svg", ".gif", ".bmp", "logo", "icon", "favicon"]):
            continue
        if u not in seen:
            seen.add(u)
            cleaned.append(u)
    return cleaned

def download(url):
    try:
        req = urllib.request.Request(url, headers={"User-Agent": UA})
        with urllib.request.urlopen(req, timeout=15) as resp:
            data = resp.read()
            return data if len(data) > 2000 else None
    except:
        return None

def upload(data, slug):
    url = f"{SUPABASE_URL}/storage/v1/object/{BUCKET}/particle-board/{slug}.jpg"
    req = urllib.request.Request(url, data=data, headers={
        "apikey": SUPABASE_KEY, "Authorization": f"Bearer {SUPABASE_KEY}",
        "Content-Type": "image/jpeg", "x-upsert": "true",
    }, method="POST")
    try:
        with urllib.request.urlopen(req, timeout=30):
            return f"{SUPABASE_URL}/storage/v1/object/public/{BUCKET}/particle-board/{slug}.jpg"
    except Exception as e:
        print(f" upload-err:{e}")
        return None

def update_db(pid, url):
    data = json.dumps({"raw_photo_urls": [url], "processed_photo_urls": [url]}).encode()
    req = urllib.request.Request(
        f"{SUPABASE_URL}/rest/v1/catalog_products?id=eq.{pid}",
        data=data, headers={
            "apikey": SUPABASE_KEY, "Authorization": f"Bearer {SUPABASE_KEY}",
            "Content-Type": "application/json", "Prefer": "return=minimal",
        }, method="PATCH")
    try:
        with urllib.request.urlopen(req, timeout=15):
            return True
    except:
        return False

def get_products():
    cats = ",".join(CAT_SEARCH.keys())
    url = f"{SUPABASE_URL}/rest/v1/catalog_products?select=id,name,slug,category,raw_photo_urls&status=eq.PUBLISHED&category=in.({cats})&order=category,sort_order"
    req = urllib.request.Request(url, headers={
        "apikey": SUPABASE_KEY, "Authorization": f"Bearer {SUPABASE_KEY}"
    })
    with urllib.request.urlopen(req, timeout=15) as resp:
        products = json.loads(resp.read().decode())
    return [p for p in products if not p.get("raw_photo_urls") or len(p["raw_photo_urls"]) == 0]

def main():
    print("=" * 55)
    print("  Fix Remaining Images (Bing -> Supabase)")
    print("=" * 55)

    products = get_products()
    print(f"\n  {len(products)} products need images\n")

    # Group by category
    by_cat = {}
    for p in products:
        by_cat.setdefault(p["category"], []).append(p)

    # Pre-fetch image pools per category
    pools = {}
    for cat in sorted(by_cat.keys()):
        base_query = CAT_SEARCH.get(cat, cat.lower().replace("_", " "))
        print(f"  Searching Bing for {cat}...")
        urls = bing_search(base_query, count=40)
        # Also search with a variant
        variant = base_query.split()
        if len(variant) > 3:
            urls2 = bing_search(" ".join(variant[:3]) + " design", count=20)
            seen = set(urls)
            urls.extend(u for u in urls2 if u not in seen)
        pools[cat] = urls
        print(f"    {len(urls)} images found")
        time.sleep(2)

    print()
    ok = fail = 0

    for cat in sorted(by_cat.keys()):
        prods = by_cat[cat]
        pool = pools.get(cat, [])
        print(f"\n--- {cat} ({len(prods)} products, {len(pool)} images) ---")

        if not pool:
            print("  No images available!")
            fail += len(prods)
            continue

        for i, p in enumerate(prods):
            print(f"  [{i+1}/{len(prods)}] {p['name']}", end="", flush=True)

            done = False
            for attempt in range(min(6, len(pool))):
                img_url = pool[(i + attempt) % len(pool)]
                data = download(img_url)
                if data:
                    pub = upload(data, p["slug"])
                    if pub and update_db(p["id"], pub):
                        print(f" -> OK ({len(data)//1024}KB)")
                        ok += 1
                        done = True
                        break
            if not done:
                print(" -> FAILED")
                fail += 1
            time.sleep(0.2)

    print(f"\n{'=' * 55}")
    print(f"  DONE!  OK: {ok}  |  Failed: {fail}  |  Total: {ok + fail}")
    print(f"{'=' * 55}")

if __name__ == "__main__":
    main()
