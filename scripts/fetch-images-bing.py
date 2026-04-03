#!/usr/bin/env python3
"""
Fetch product images via Bing Image Search (NO API key needed!)
Downloads images and uploads to Supabase Storage, then updates product records.

Usage:
  python3 scripts/fetch-images-bing.py
  python3 scripts/fetch-images-bing.py --category=TV_UNITS
  python3 scripts/fetch-images-bing.py --dry-run
"""

import os, sys, json, time, re, html
import urllib.request, urllib.error, urllib.parse

# ── Config ────────────────────────────────────────────────────────────────

SUPABASE_URL = "https://kwxkapanfkviibxjhgps.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt3eGthcGFuZmt2aWlieGpoZ3BzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzEyMDYwMywiZXhwIjoyMDg4Njk2NjAzfQ.K4qLj9niaFNHgfURLIGbTVEsrBuRt8LmH5bbg6M_pv0"
BUCKET = "catalog"
DRY_RUN = "--dry-run" in sys.argv
CATEGORY_FILTER = ""
for arg in sys.argv:
    if arg.startswith("--category="):
        CATEGORY_FILTER = arg.split("=", 1)[1]

USER_AGENT = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"

# ── Search queries per category ──────────────────────────────────────────

SEARCH_QUERIES = {
    "WARDROBES_ALMIRAHS": [
        "modern wooden wardrobe furniture design",
        "wooden almirah cupboard modern design",
        "sliding door wardrobe bedroom modern",
    ],
    "TV_UNITS": [
        "modern tv unit stand wooden design",
        "tv entertainment center wooden living room",
        "wall mounted tv unit wooden modern",
    ],
    "STUDY_COMPUTER_TABLES": [
        "wooden study table desk modern furniture",
        "computer desk with drawers modern design",
        "home office desk wooden contemporary",
    ],
    "BOOKSHELVES_DISPLAY": [
        "modern wooden bookshelf design furniture",
        "display shelf unit modern wooden",
        "wall bookcase modern wooden interior",
    ],
    "SHOE_RACKS": [
        "modern shoe rack cabinet wooden furniture",
        "shoe storage cabinet entryway design",
        "shoe cabinet with doors modern wooden",
    ],
    "KITCHEN_PANTRY": [
        "modular kitchen cabinet wooden modern design",
        "kitchen pantry storage unit wooden furniture",
        "kitchen trolley microwave stand modern",
    ],
    "BEDROOM_FURNITURE": [
        "modern wooden bed storage design furniture",
        "bedroom furniture set wooden contemporary",
        "bed with headboard storage modern",
    ],
    "DRESSING_TABLES": [
        "modern dressing table mirror wooden furniture",
        "vanity table bedroom modern design",
        "makeup table drawers modern wooden",
    ],
    "OFFICE_WORKSTATIONS": [
        "modern office desk workstation wooden furniture",
        "executive office desk modern design",
        "L shaped desk office wooden contemporary",
    ],
    "MODULAR_STORAGE": [
        "modular storage cabinet modern wooden furniture",
        "cube storage shelf organizer modern",
        "wall storage unit modern design furniture",
    ],
}

# ── Bing Image Search ────────────────────────────────────────────────────

def search_bing_images(query, count=30):
    """Search Bing Images and extract direct image URLs"""
    encoded = urllib.parse.quote_plus(query)
    url = f"https://www.bing.com/images/search?q={encoded}&first=1&count={count}"

    req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            content = resp.read().decode("utf-8", errors="ignore")
    except Exception as e:
        print(f"    Search error: {e}")
        return []

    # Extract murl (media URL) from Bing's HTML
    urls = re.findall(r'murl&quot;:&quot;(https?://[^&]+?)&quot;', content)
    if not urls:
        urls = re.findall(r'murl":"(https?://[^"]+?)"', content)

    # Decode HTML entities and filter
    cleaned = []
    seen = set()
    for u in urls:
        u = html.unescape(u)
        # Skip unwanted formats
        if any(ext in u.lower() for ext in [".svg", ".gif", ".webp", ".bmp"]):
            continue
        if any(bad in u.lower() for bad in ["logo", "icon", "favicon", "brand", "pixel", "tracking", "analytics"]):
            continue
        if u not in seen:
            seen.add(u)
            cleaned.append(u)

    return cleaned


# ── Supabase helpers ─────────────────────────────────────────────────────

def supabase_get(path):
    url = f"{SUPABASE_URL}{path}"
    req = urllib.request.Request(url, headers={
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}",
    })
    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            return json.loads(resp.read().decode())
    except Exception as e:
        print(f"DB error: {e}")
        return None


def get_products_needing_images():
    cats = list(SEARCH_QUERIES.keys())
    cat_filter = ",".join(cats)
    path = f"/rest/v1/catalog_products?select=id,name,slug,category,raw_photo_urls&status=eq.PUBLISHED&category=in.({cat_filter})&order=category,sort_order"
    if CATEGORY_FILTER:
        path = f"/rest/v1/catalog_products?select=id,name,slug,category,raw_photo_urls&status=eq.PUBLISHED&category=eq.{CATEGORY_FILTER}&order=sort_order"

    products = supabase_get(path)
    if not products:
        return []
    return [p for p in products if not p.get("raw_photo_urls") or len(p["raw_photo_urls"]) == 0]


def download_image(url):
    try:
        req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
        with urllib.request.urlopen(req, timeout=15) as resp:
            data = resp.read()
            if len(data) < 2000:
                return None
            return data
    except Exception:
        return None


def upload_to_supabase(image_data, slug):
    path = f"/storage/v1/object/{BUCKET}/particle-board/{slug}.jpg"
    url = f"{SUPABASE_URL}{path}"
    req = urllib.request.Request(url, data=image_data, headers={
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}",
        "Content-Type": "image/jpeg",
        "x-upsert": "true",
    }, method="POST")
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            return f"{SUPABASE_URL}/storage/v1/object/public/{BUCKET}/particle-board/{slug}.jpg"
    except urllib.error.HTTPError as e:
        print(f"    Upload err: {e.code}")
        return None
    except Exception as e:
        print(f"    Upload err: {e}")
        return None


def update_product_image(product_id, image_url):
    path = f"/rest/v1/catalog_products?id=eq.{product_id}"
    data = json.dumps({"raw_photo_urls": [image_url], "processed_photo_urls": [image_url]}).encode()
    url = f"{SUPABASE_URL}{path}"
    req = urllib.request.Request(url, data=data, headers={
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}",
        "Content-Type": "application/json",
        "Prefer": "return=minimal",
    }, method="PATCH")
    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            return True
    except Exception:
        return False


# ── Main ─────────────────────────────────────────────────────────────────

def main():
    print("=" * 55)
    print("  Product Image Fetcher (Bing - No API Key)")
    print("=" * 55)
    if DRY_RUN: print("  MODE: DRY RUN")
    if CATEGORY_FILTER: print(f"  CATEGORY: {CATEGORY_FILTER}")
    print()

    print("Fetching products from database...")
    products = get_products_needing_images()
    print(f"  {len(products)} products need images\n")

    if not products:
        print("All products already have images!")
        return

    # Group by category
    by_cat = {}
    for p in products:
        by_cat.setdefault(p["category"], []).append(p)

    total_ok = 0
    total_fail = 0

    for cat in sorted(by_cat.keys()):
        cat_prods = by_cat[cat]
        print(f"\n{'─' * 55}")
        print(f"  {cat} ({len(cat_prods)} products)")
        print(f"{'─' * 55}")

        # Search Bing for images
        queries = SEARCH_QUERIES.get(cat, [f"{cat.lower().replace('_',' ')} furniture modern"])
        all_urls = []
        seen = set()

        for q in queries:
            print(f"  Searching: {q}")
            urls = search_bing_images(q, count=30)
            for u in urls:
                if u not in seen:
                    seen.add(u)
                    all_urls.append(u)
            time.sleep(2)  # Be polite to Bing

        print(f"  Found {len(all_urls)} candidate images\n")

        if not all_urls:
            print(f"  No images found!")
            total_fail += len(cat_prods)
            continue

        for i, product in enumerate(cat_prods):
            prefix = f"  [{i+1}/{len(cat_prods)}]"

            if DRY_RUN:
                url = all_urls[i % len(all_urls)]
                print(f"{prefix} {product['name']}")
                print(f"         <- {url[:70]}...")
                total_ok += 1
                continue

            print(f"{prefix} {product['name']}", end="", flush=True)

            # Try multiple images from pool until one downloads successfully
            downloaded = False
            for attempt in range(min(8, len(all_urls))):
                img_url = all_urls[(i + attempt) % len(all_urls)]
                image_data = download_image(img_url)
                if image_data:
                    public_url = upload_to_supabase(image_data, product["slug"])
                    if public_url and update_product_image(product["id"], public_url):
                        print(f" -> OK ({len(image_data)//1024}KB)")
                        total_ok += 1
                        downloaded = True
                        break

            if not downloaded:
                print(f" -> FAILED")
                total_fail += 1

            time.sleep(0.3)

        # Pause between categories to avoid rate limits
        time.sleep(3)

    print(f"\n{'=' * 55}")
    print(f"  DONE!  Success: {total_ok}  |  Failed: {total_fail}  |  Total: {total_ok + total_fail}")
    print(f"{'=' * 55}")


if __name__ == "__main__":
    main()
