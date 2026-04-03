#!/usr/bin/env python3
"""
Fetch product images via DuckDuckGo Image Search (NO API key needed!)
Downloads images and uploads to Supabase Storage, then updates product records.

Usage:
  python3 scripts/fetch-images-ddg.py
  python3 scripts/fetch-images-ddg.py --category=TV_UNITS
  python3 scripts/fetch-images-ddg.py --dry-run
"""

import os, sys, json, time, hashlib, re, urllib.request, urllib.error
from pathlib import Path

# Suppress rename warning
import warnings
warnings.filterwarnings("ignore", message=".*renamed.*")

from duckduckgo_search import DDGS

# ── Config ────────────────────────────────────────────────────────────────

SUPABASE_URL = "https://kwxkapanfkviibxjhgps.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt3eGthcGFuZmt2aWlieGpoZ3BzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzEyMDYwMywiZXhwIjoyMDg4Njk2NjAzfQ.K4qLj9niaFNHgfURLIGbTVEsrBuRt8LmH5bbg6M_pv0"
BUCKET = "catalog"
DRY_RUN = "--dry-run" in sys.argv
CATEGORY_FILTER = ""
for arg in sys.argv:
    if arg.startswith("--category="):
        CATEGORY_FILTER = arg.split("=", 1)[1]

# ── Search queries per category ──────────────────────────────────────────

SEARCH_QUERIES = {
    "WARDROBES_ALMIRAHS": [
        "modern wooden wardrobe furniture white background",
        "wooden almirah cupboard closet design",
        "sliding door wardrobe modern design",
        "bedroom wardrobe with mirror modern",
    ],
    "TV_UNITS": [
        "modern tv unit stand wooden furniture",
        "tv entertainment center wooden wall unit",
        "wooden tv cabinet living room modern",
        "floating tv unit wall mounted wooden",
    ],
    "STUDY_COMPUTER_TABLES": [
        "wooden study table desk modern design",
        "computer desk with drawers wooden",
        "home office desk wooden modern",
        "writing desk study table contemporary",
    ],
    "BOOKSHELVES_DISPLAY": [
        "modern wooden bookshelf design",
        "display shelf unit wooden furniture",
        "bookcase with doors modern design",
        "wall shelf decorative wooden modern",
    ],
    "SHOE_RACKS": [
        "modern shoe rack cabinet entryway",
        "wooden shoe storage cabinet design",
        "shoe rack with doors modern furniture",
        "entryway shoe cabinet organizer",
    ],
    "KITCHEN_PANTRY": [
        "modular kitchen cabinet wooden modern",
        "kitchen pantry unit storage wooden",
        "kitchen furniture wooden cabinet design",
        "microwave stand kitchen trolley wooden",
    ],
    "BEDROOM_FURNITURE": [
        "modern wooden bed with storage design",
        "bedroom furniture set wooden modern",
        "bed with headboard storage wooden",
        "wooden bed with drawers modern design",
    ],
    "DRESSING_TABLES": [
        "modern dressing table with mirror wooden",
        "vanity table bedroom furniture design",
        "makeup table with drawers wooden",
        "dressing table modern design bedroom",
    ],
    "OFFICE_WORKSTATIONS": [
        "modern office workstation desk furniture",
        "office desk wooden executive design",
        "computer workstation office furniture",
        "L shaped office desk modern wooden",
    ],
    "MODULAR_STORAGE": [
        "modular storage cabinet wooden modern",
        "cube storage unit shelf organizer",
        "storage cabinet modern wooden furniture",
        "wall mounted storage unit modern design",
    ],
}

# ── Helpers ───────────────────────────────────────────────────────────────

def supabase_request(method, path, data=None, content_type="application/json"):
    """Make a raw HTTP request to Supabase REST/Storage API"""
    url = f"{SUPABASE_URL}{path}"
    headers = {
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}",
    }

    if data is not None and content_type == "application/json":
        body = json.dumps(data).encode()
        headers["Content-Type"] = "application/json"
        headers["Prefer"] = "return=minimal"
    elif data is not None:
        body = data
        headers["Content-Type"] = content_type
    else:
        body = None

    req = urllib.request.Request(url, data=body, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            return resp.status, resp.read().decode()
    except urllib.error.HTTPError as e:
        return e.code, e.read().decode()
    except Exception as e:
        return 0, str(e)


def get_products_needing_images():
    """Fetch products that have no images"""
    path = "/rest/v1/catalog_products?select=id,name,slug,category,raw_photo_urls&status=eq.PUBLISHED&order=category,sort_order"

    # Add category filter
    cats = list(SEARCH_QUERIES.keys())
    cat_filter = ",".join(cats)
    path += f"&category=in.({cat_filter})"

    if CATEGORY_FILTER:
        path = f"/rest/v1/catalog_products?select=id,name,slug,category,raw_photo_urls&status=eq.PUBLISHED&category=eq.{CATEGORY_FILTER}&order=sort_order"

    status, body = supabase_request("GET", path)
    if status != 200:
        print(f"Error fetching products: {status} {body[:200]}")
        return []

    products = json.loads(body)
    # Filter to those without images
    return [p for p in products if not p.get("raw_photo_urls") or len(p["raw_photo_urls"]) == 0]


def download_image(url):
    """Download image bytes from URL"""
    try:
        req = urllib.request.Request(url, headers={
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36"
        })
        with urllib.request.urlopen(req, timeout=15) as resp:
            data = resp.read()
            if len(data) < 2000:  # Too small, probably error page
                return None
            return data
    except Exception:
        return None


def upload_to_supabase(image_data, slug):
    """Upload image to Supabase Storage"""
    path = f"/storage/v1/object/{BUCKET}/particle-board/{slug}.jpg"

    # Try upload (upsert)
    headers = {
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}",
        "Content-Type": "image/jpeg",
        "x-upsert": "true",
    }

    url = f"{SUPABASE_URL}{path}"
    req = urllib.request.Request(url, data=image_data, headers=headers, method="POST")
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            public_url = f"{SUPABASE_URL}/storage/v1/object/public/{BUCKET}/particle-board/{slug}.jpg"
            return public_url
    except urllib.error.HTTPError as e:
        print(f"    Upload error: {e.code} {e.read().decode()[:100]}")
        return None
    except Exception as e:
        print(f"    Upload error: {e}")
        return None


def update_product_image(product_id, image_url):
    """Update product record with image URL"""
    path = f"/rest/v1/catalog_products?id=eq.{product_id}"
    data = {
        "raw_photo_urls": [image_url],
        "processed_photo_urls": [image_url],
    }
    status, body = supabase_request("PATCH", path, data)
    return status in (200, 204)


def search_images_for_category(category, count=25):
    """Search DuckDuckGo for images matching a category"""
    queries = SEARCH_QUERIES.get(category, [f"{category.lower().replace('_', ' ')} furniture"])
    all_images = []
    seen_urls = set()

    ddgs = DDGS()

    for query in queries:
        try:
            results = ddgs.images(query, max_results=15)
            for r in results:
                img_url = r.get("image", "")
                # Skip tiny thumbnails, SVGs, gifs, and branded/logo images
                if not img_url or img_url in seen_urls:
                    continue
                if any(ext in img_url.lower() for ext in [".svg", ".gif", ".webp"]):
                    continue
                # Skip known branded sources
                if any(brand in img_url.lower() for brand in ["logo", "brand", "icon", "favicon"]):
                    continue
                seen_urls.add(img_url)
                all_images.append(img_url)

            time.sleep(4)  # Rate limit respect — DDG limits heavily
        except Exception as e:
            print(f"  Search error for '{query}': {e}")
            time.sleep(15)  # Wait longer on errors

    return all_images[:count]


# ── Main ─────────────────────────────────────────────────────────────────

def main():
    print("=" * 55)
    print("  Product Image Fetcher (DuckDuckGo - No API Key)")
    print("=" * 55)
    print()

    if DRY_RUN:
        print("  MODE: DRY RUN (no downloads or uploads)")
    if CATEGORY_FILTER:
        print(f"  CATEGORY: {CATEGORY_FILTER}")
    print()

    # 1. Get products needing images
    print("Fetching products from database...")
    products = get_products_needing_images()
    print(f"  Found {len(products)} products needing images\n")

    if not products:
        print("All products already have images!")
        return

    # 2. Group by category
    by_category = {}
    for p in products:
        cat = p["category"]
        if cat not in by_category:
            by_category[cat] = []
        by_category[cat].append(p)

    # 3. For each category, search and assign images
    total_success = 0
    total_failed = 0

    for cat in sorted(by_category.keys()):
        cat_products = by_category[cat]
        print(f"\n{'─' * 55}")
        print(f"  {cat} ({len(cat_products)} products)")
        print(f"{'─' * 55}")

        # Search for images
        print(f"  Searching DuckDuckGo for images...")
        image_urls = search_images_for_category(cat, count=len(cat_products) + 10)
        print(f"  Found {len(image_urls)} candidate images\n")

        if not image_urls:
            print(f"  No images found for {cat}!")
            total_failed += len(cat_products)
            continue

        # Assign and download images
        for i, product in enumerate(cat_products):
            img_url = image_urls[i % len(image_urls)]
            prefix = f"  [{i+1}/{len(cat_products)}]"

            if DRY_RUN:
                print(f"{prefix} {product['name']}")
                print(f"         <- {img_url[:70]}...")
                total_success += 1
                continue

            print(f"{prefix} {product['name']}")

            # Download
            image_data = download_image(img_url)
            if not image_data:
                # Try next image in pool
                for alt_idx in range(1, min(5, len(image_urls))):
                    alt_url = image_urls[(i + alt_idx) % len(image_urls)]
                    image_data = download_image(alt_url)
                    if image_data:
                        img_url = alt_url
                        break

            if not image_data:
                print(f"       FAILED to download")
                total_failed += 1
                continue

            # Upload to Supabase
            public_url = upload_to_supabase(image_data, product["slug"])
            if not public_url:
                total_failed += 1
                continue

            # Update DB record
            if update_product_image(product["id"], public_url):
                print(f"       OK ({len(image_data)//1024}KB)")
                total_success += 1
            else:
                print(f"       DB update failed")
                total_failed += 1

            time.sleep(0.3)

    # Summary
    print(f"\n{'=' * 55}")
    print(f"  DONE!")
    print(f"  Success: {total_success}")
    print(f"  Failed:  {total_failed}")
    print(f"  Total:   {total_success + total_failed}")
    print(f"{'=' * 55}")


if __name__ == "__main__":
    main()
