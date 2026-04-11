#!/usr/bin/env python3
"""
Enhance particle board product images using Google Imagen 4.0.
Generates premium lifestyle photography for each product and uploads to Supabase.

Usage:
  python3 scripts/enhance-images-gemini.py                    # All categories
  python3 scripts/enhance-images-gemini.py SHOE_RACKS         # Single category
  python3 scripts/enhance-images-gemini.py KITCHEN_PANTRY BEDROOM_FURNITURE  # Multiple
  python3 scripts/enhance-images-gemini.py --skip 5           # Skip first 5 products (resume)
"""

import json, sys, time, urllib.request, urllib.error, warnings, os

warnings.filterwarnings("ignore")

from google import genai
from google.genai import types

# ── Config ───────────────────────────────────────────────────────────
GEMINI_API_KEY = "AIzaSyBbE7JGDKzMdnarDMUUVFZ7_QR2q80criA"
SUPABASE_URL = "https://kwxkapanfkviibxjhgps.supabase.co"
SUPABASE_SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt3eGthcGFuZmt2aWlieGpoZ3BzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzEyMDYwMywiZXhwIjoyMDg4Njk2NjAzfQ.K4qLj9niaFNHgfURLIGbTVEsrBuRt8LmH5bbg6M_pv0"
BUCKET = "catalog"
ENHANCED_PREFIX = "particle-board-enhanced"

# ── Lifestyle prompts per category ───────────────────────────────────
# Each prompt generates a premium lifestyle photo for the product type
CATEGORY_PROMPTS = {
    "WARDROBES_ALMIRAHS": {
        "setting": "modern spacious bedroom with warm natural lighting, wooden flooring",
        "style": "pre-laminated particle board wardrobe with elegant wood grain finish",
    },
    "TV_UNITS": {
        "setting": "contemporary living room with soft ambient lighting, minimalist decor",
        "style": "sleek particle board TV unit with laminate finish and cable management",
    },
    "STUDY_COMPUTER_TABLES": {
        "setting": "well-lit home office or study room with large windows, organized workspace",
        "style": "sturdy particle board desk with laminate finish",
    },
    "BOOKSHELVES_DISPLAY": {
        "setting": "cozy living room or reading nook with warm lighting, decorated shelves",
        "style": "elegant particle board bookshelf/display unit with laminate finish",
    },
    "SHOE_RACKS": {
        "setting": "clean modern entryway or foyer with tiled floor, well-organized",
        "style": "practical particle board shoe rack/cabinet with laminate finish",
    },
    "KITCHEN_PANTRY": {
        "setting": "bright modern kitchen with clean countertops, organized cooking space",
        "style": "functional particle board kitchen unit with laminate finish",
    },
    "BEDROOM_FURNITURE": {
        "setting": "serene modern bedroom with soft bedding, warm ambient lighting",
        "style": "quality particle board bedroom furniture with elegant laminate finish",
    },
    "DRESSING_TABLES": {
        "setting": "elegant bedroom corner with soft lighting, feminine decor touches",
        "style": "stylish particle board dressing table/vanity with mirror and laminate finish",
    },
    "OFFICE_WORKSTATIONS": {
        "setting": "professional modern office space with good lighting, clean lines",
        "style": "professional particle board office furniture with durable laminate finish",
    },
    "MODULAR_STORAGE": {
        "setting": "organized modern home interior with clean aesthetics, smart storage",
        "style": "versatile particle board storage unit with laminate finish",
    },
}

ALL_CATEGORIES = list(CATEGORY_PROMPTS.keys())

client = genai.Client(api_key=GEMINI_API_KEY)


def get_products(categories):
    """Fetch products from Supabase for given categories."""
    cats = ",".join(categories)
    url = (
        f"{SUPABASE_URL}/rest/v1/catalog_products"
        f"?select=id,name,slug,category"
        f"&status=eq.PUBLISHED"
        f"&category=in.({cats})"
        f"&order=category,sort_order"
    )
    req = urllib.request.Request(url, headers={
        "apikey": SUPABASE_SERVICE_KEY,
        "Authorization": f"Bearer {SUPABASE_SERVICE_KEY}",
    })
    with urllib.request.urlopen(req, timeout=15) as resp:
        return json.loads(resp.read().decode())


def generate_lifestyle_image(product_name, category):
    """Generate a premium lifestyle image using Imagen 4.0."""
    cat_info = CATEGORY_PROMPTS.get(category, {
        "setting": "modern home interior with warm lighting",
        "style": "quality particle board furniture with laminate finish",
    })

    prompt = (
        f"A premium {product_name.lower()} made of {cat_info['style']}, "
        f"beautifully placed in a {cat_info['setting']}. "
        f"Professional interior design photography, 4K ultra-realistic, "
        f"warm natural lighting, high-end furniture catalog style, "
        f"clean composition, no text or watermarks, photorealistic"
    )

    # Try primary model, fall back to fast model if quota exceeded
    model = os.environ.get('IMAGEN_MODEL', 'imagen-4.0-fast-generate-001')
    result = client.models.generate_images(
        model=model,
        prompt=prompt,
        config=types.GenerateImagesConfig(
            number_of_images=1,
            output_mime_type='image/jpeg',
        )
    )

    if result.generated_images:
        return result.generated_images[0].image.image_bytes
    return None


def upload_to_supabase(img_data, slug):
    """Upload enhanced image to Supabase storage."""
    path = f"{ENHANCED_PREFIX}/{slug}.jpg"
    url = f"{SUPABASE_URL}/storage/v1/object/{BUCKET}/{path}"
    req = urllib.request.Request(url, data=img_data, headers={
        "apikey": SUPABASE_SERVICE_KEY,
        "Authorization": f"Bearer {SUPABASE_SERVICE_KEY}",
        "Content-Type": "image/jpeg",
        "x-upsert": "true",
    }, method="POST")
    try:
        with urllib.request.urlopen(req, timeout=30):
            return f"{SUPABASE_URL}/storage/v1/object/public/{BUCKET}/{path}"
    except urllib.error.HTTPError as e:
        print(f"  Upload error: {e.code} {e.read().decode()[:200]}")
        return None


def update_product_urls(product_id, enhanced_url):
    """Update processed_photo_urls in the database."""
    data = json.dumps({
        "processed_photo_urls": [enhanced_url],
    }).encode()
    req = urllib.request.Request(
        f"{SUPABASE_URL}/rest/v1/catalog_products?id=eq.{product_id}",
        data=data,
        headers={
            "apikey": SUPABASE_SERVICE_KEY,
            "Authorization": f"Bearer {SUPABASE_SERVICE_KEY}",
            "Content-Type": "application/json",
            "Prefer": "return=minimal",
        },
        method="PATCH",
    )
    try:
        with urllib.request.urlopen(req, timeout=15):
            return True
    except Exception as e:
        print(f"  DB update error: {e}")
        return False


def main():
    # Parse args
    args = sys.argv[1:]
    skip = 0
    categories = []

    i = 0
    while i < len(args):
        if args[i] == "--skip":
            skip = int(args[i + 1])
            i += 2
        else:
            categories.append(args[i])
            i += 1

    if not categories:
        categories = ALL_CATEGORIES

    # Validate categories
    for cat in categories:
        if cat not in CATEGORY_PROMPTS:
            print(f"Unknown category: {cat}")
            print(f"Valid: {', '.join(ALL_CATEGORIES)}")
            sys.exit(1)

    print("=" * 65)
    print("  Enhance Product Images with Imagen 4.0")
    print(f"  Categories: {', '.join(categories)}")
    if skip:
        print(f"  Skipping first {skip} products")
    print("=" * 65)

    products = get_products(categories)
    print(f"\n  Total products: {len(products)}")

    if skip:
        products = products[skip:]
        print(f"  After skip: {len(products)}")

    ok = fail = 0
    current_cat = None

    for idx, p in enumerate(products):
        cat = p["category"]
        if cat != current_cat:
            current_cat = cat
            cat_products = [x for x in products if x["category"] == cat]
            print(f"\n--- {cat} ({len(cat_products)} products) ---")

        product_num = idx + 1 + skip
        print(f"  [{product_num}/{len(products) + skip}] {p['name']}", end="", flush=True)

        try:
            # Generate enhanced image
            img_data = generate_lifestyle_image(p["name"], cat)
            if not img_data:
                print(" -> FAILED (no image generated)")
                fail += 1
                continue

            # Upload to Supabase
            pub_url = upload_to_supabase(img_data, p["slug"])
            if not pub_url:
                print(" -> FAILED (upload error)")
                fail += 1
                continue

            # Update database
            if update_product_urls(p["id"], pub_url):
                print(f" -> OK ({len(img_data) // 1024}KB)")
                ok += 1
            else:
                print(" -> FAILED (db update)")
                fail += 1

        except Exception as e:
            print(f" -> ERROR: {e}")
            fail += 1

        # Rate limit: ~10 requests/min for Imagen
        time.sleep(6)

    print(f"\n{'=' * 65}")
    print(f"  DONE!  OK: {ok}  |  Failed: {fail}  |  Total: {ok + fail}")
    print(f"{'=' * 65}")


if __name__ == "__main__":
    main()
