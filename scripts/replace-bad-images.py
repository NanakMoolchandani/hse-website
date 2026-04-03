#!/usr/bin/env python3
"""
Replace ALL particle board product images with better quality ones.
Uses Bing Image Search with refined queries targeting clean product photos.
"""

import json, time, re, html, urllib.request, urllib.error, urllib.parse

SUPABASE_URL = "https://kwxkapanfkviibxjhgps.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt3eGthcGFuZmt2aWlieGpoZ3BzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzEyMDYwMywiZXhwIjoyMDg4Njk2NjAzfQ.K4qLj9niaFNHgfURLIGbTVEsrBuRt8LmH5bbg6M_pv0"
BUCKET = "catalog"
UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
MIN_IMAGE_SIZE = 15000  # 15KB minimum - skip tiny/error images

# Refined search queries - targeting clean product photos on white/lifestyle backgrounds
CAT_QUERIES = {
    "WARDROBES_ALMIRAHS": [
        "particle board wardrobe laminate finish product photo",
        "wooden almirah cupboard product white background",
        "modern laminate wardrobe design product",
        "pre laminated particle board wardrobe",
    ],
    "TV_UNITS": [
        "tv unit stand laminate particle board product",
        "modern tv cabinet wooden product photo",
        "wall mount tv unit particle board product",
        "tv entertainment unit design product",
    ],
    "STUDY_COMPUTER_TABLES": [
        "study table particle board laminate product photo",
        "computer desk modern product white background",
        "wooden study table with drawers product",
        "office desk laminate product photo",
    ],
    "BOOKSHELVES_DISPLAY": [
        "bookshelf wooden laminate product photo",
        "display shelf unit modern product white background",
        "bookcase particle board product",
        "wall shelf decorative product photo",
    ],
    "SHOE_RACKS": [
        "shoe rack cabinet particle board product photo",
        "shoe cabinet modern design product",
        "shoe storage unit wooden product white background",
        "shoe rack organizer modern product",
    ],
    "KITCHEN_PANTRY": [
        "kitchen cabinet modular particle board product",
        "pantry unit kitchen storage product photo",
        "kitchen trolley wooden product white background",
        "crockery unit glass door product",
    ],
    "BEDROOM_FURNITURE": [
        "bed with storage particle board product photo",
        "modern bed wooden design product",
        "bedside table product white background",
        "bed with headboard storage product photo",
    ],
    "DRESSING_TABLES": [
        "dressing table with mirror particle board product",
        "vanity table modern product photo",
        "dressing table wooden product white background",
        "makeup table drawers product photo",
    ],
    "OFFICE_WORKSTATIONS": [
        "office desk workstation particle board product",
        "executive desk modern product photo",
        "office workstation modular product",
        "office furniture desk product white background",
    ],
    "MODULAR_STORAGE": [
        "storage cabinet particle board product photo",
        "cube storage unit modular product",
        "multipurpose cabinet wooden product white background",
        "wall cabinet storage product photo",
    ],
}


def bing_search(query, count=40):
    url = f"https://www.bing.com/images/search?q={urllib.parse.quote_plus(query)}&first=1&count={count}&qft=+filterui:imagesize-large"
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            content = resp.read().decode("utf-8", errors="ignore")
    except Exception as e:
        print(f"    Search error: {e}")
        return []
    urls = re.findall(r'murl&quot;:&quot;(https?://[^&]+?)&quot;', content)
    if not urls:
        urls = re.findall(r'murl":"(https?://[^"]+?)"', content)
    cleaned = []
    seen = set()
    for u in urls:
        u = html.unescape(u)
        low = u.lower()
        # Skip bad formats and branded content
        if any(x in low for x in [".svg", ".gif", ".bmp", "logo", "icon", "favicon", "watermark", "brand"]):
            continue
        # Skip very small placeholder images
        if "1x1" in low or "pixel" in low or "tracking" in low or "analytics" in low:
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
            return data if len(data) >= MIN_IMAGE_SIZE else None
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


def get_all_particle_products():
    cats = ",".join(CAT_QUERIES.keys())
    url = f"{SUPABASE_URL}/rest/v1/catalog_products?select=id,name,slug,category&status=eq.PUBLISHED&category=in.({cats})&order=category,sort_order"
    req = urllib.request.Request(url, headers={
        "apikey": SUPABASE_KEY, "Authorization": f"Bearer {SUPABASE_KEY}"
    })
    with urllib.request.urlopen(req, timeout=15) as resp:
        return json.loads(resp.read().decode())


def main():
    print("=" * 60)
    print("  Replace ALL Particle Board Images with Better Quality")
    print("=" * 60)

    products = get_all_particle_products()
    print(f"\n  {len(products)} products to update\n")

    by_cat = {}
    for p in products:
        by_cat.setdefault(p["category"], []).append(p)

    # Pre-fetch image pools
    pools = {}
    for cat in sorted(by_cat.keys()):
        queries = CAT_QUERIES.get(cat, [])
        all_urls = []
        seen = set()
        for q in queries:
            print(f"  Searching: {q[:50]}...")
            urls = bing_search(q)
            for u in urls:
                if u not in seen:
                    seen.add(u)
                    all_urls.append(u)
            time.sleep(2)
        pools[cat] = all_urls
        print(f"  {cat}: {len(all_urls)} high-quality candidates\n")
        time.sleep(1)

    ok = fail = 0
    for cat in sorted(by_cat.keys()):
        prods = by_cat[cat]
        pool = pools.get(cat, [])
        print(f"\n--- {cat} ({len(prods)} products, {len(pool)} images) ---")

        if not pool:
            fail += len(prods)
            continue

        for i, p in enumerate(prods):
            print(f"  [{i+1}/{len(prods)}] {p['name']}", end="", flush=True)
            done = False
            for attempt in range(min(10, len(pool))):
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

    print(f"\n{'=' * 60}")
    print(f"  DONE!  OK: {ok}  |  Failed: {fail}  |  Total: {ok + fail}")
    print(f"{'=' * 60}")

if __name__ == "__main__":
    main()
