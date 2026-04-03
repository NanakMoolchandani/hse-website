#!/usr/bin/env python3
"""
Two-phase image fetcher that works even with unstable internet.

Phase 1: Search Bing + download images to local disk (needs Bing only)
Phase 2: Upload local images to Supabase + update DB (needs Supabase only)

Usage:
  python3 scripts/fetch-images-offline.py search    # Phase 1: search + download
  python3 scripts/fetch-images-offline.py upload    # Phase 2: upload to Supabase
  python3 scripts/fetch-images-offline.py           # Both phases
"""

import os, sys, json, time, re, html
import urllib.request, urllib.error, urllib.parse
from pathlib import Path

# ── Config ────────────────────────────────────────────────────────────────

SUPABASE_URL = "https://kwxkapanfkviibxjhgps.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt3eGthcGFuZmt2aWlieGpoZ3BzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzEyMDYwMywiZXhwIjoyMDg4Njk2NjAzfQ.K4qLj9niaFNHgfURLIGbTVEsrBuRt8LmH5bbg6M_pv0"
BUCKET = "catalog"
LOCAL_DIR = Path(__file__).parent.parent / "temp-images"
MANIFEST = LOCAL_DIR / "manifest.json"
USER_AGENT = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"

# Products that already have images (from DDG run)
SKIP_CATEGORIES = set()  # Will auto-detect from DB or manifest

SEARCH_QUERIES = {
    "WARDROBES_ALMIRAHS": [
        "modern wooden wardrobe furniture design",
        "wooden almirah cupboard modern",
        "sliding door wardrobe bedroom",
    ],
    "TV_UNITS": [
        "modern tv unit stand wooden",
        "tv entertainment center wooden",
        "wall mounted tv unit modern",
    ],
    "STUDY_COMPUTER_TABLES": [
        "wooden study table desk modern",
        "computer desk with drawers modern",
        "home office desk wooden",
    ],
    "BOOKSHELVES_DISPLAY": [
        "modern wooden bookshelf design",
        "display shelf unit modern wooden",
        "bookcase modern wooden interior",
    ],
    "SHOE_RACKS": [
        "modern shoe rack cabinet wooden",
        "shoe storage cabinet entryway",
        "shoe cabinet doors modern wooden",
    ],
    "KITCHEN_PANTRY": [
        "modular kitchen cabinet wooden modern",
        "kitchen pantry storage unit wooden",
        "kitchen trolley microwave stand",
    ],
    "BEDROOM_FURNITURE": [
        "modern wooden bed storage design",
        "bedroom furniture set wooden",
        "bed headboard storage modern",
    ],
    "DRESSING_TABLES": [
        "modern dressing table mirror wooden",
        "vanity table bedroom modern",
        "makeup table drawers modern",
    ],
    "OFFICE_WORKSTATIONS": [
        "modern office desk workstation wooden",
        "executive office desk modern",
        "L shaped desk office wooden",
    ],
    "MODULAR_STORAGE": [
        "modular storage cabinet modern wooden",
        "cube storage shelf organizer",
        "wall storage unit modern furniture",
    ],
}

# Product names per category (must match DB exactly)
PRODUCTS_BY_CATEGORY = {
    "WARDROBES_ALMIRAHS": [
        "Single Door Wardrobe", "Double Door Wardrobe", "Triple Door Wardrobe",
        "Sliding Door Wardrobe 2-Panel", "Wardrobe with Mirror Door",
        "Wardrobe with Loft Storage", "Corner Wardrobe L-Shape", "Wardrobe with External Drawers",
        "Wardrobe with Locker Safe", "2-Door Almirah Classic", "3-Door Almirah Large",
        "Multipurpose Cupboard Small", "Walk-In Closet Module Set", "Open Wardrobe System",
        "Wardrobe with Sliding Mirror", "Wardrobe with Internal Chest", "Kids Wardrobe Colorful",
        "Wardrobe with Shoe Rack Base", "Slim Wardrobe for Small Rooms", "Wardrobe with Tie & Belt Organizer",
    ],
    "TV_UNITS": [
        "Floor Standing TV Unit 4ft", "Wall-Mounted TV Panel", "TV Unit with Drawers & Shelves",
        "Corner TV Unit Compact", "TV Unit with Display Showcase", "Floating TV Unit Minimal",
        "TV Entertainment Wall Unit", "TV Unit with LED Backlight Panel", "TV Unit with Speaker Shelf",
        "TV Unit with Book Rack Side", "Modular TV Unit Set", "TV Unit with Sliding Doors",
        "TV Unit with Glass Door Display", "Low Profile TV Console", "TV Unit with Cable Management",
        "Tall TV Armoire with Doors", "TV Unit with Fireplace Shelf", "Curved Front TV Unit",
        "Industrial Style TV Unit", "TV Unit with Gaming Console Storage",
    ],
    "STUDY_COMPUTER_TABLES": [
        "Simple Study Table with Drawer", "Computer Table with Keyboard Tray",
        "Study Table with Bookshelf", "Corner Study Table L-Shape", "Wall-Mounted Folding Study Table",
        "Standing Desk Converter", "Laptop Table Portable", "Writing Desk Classic",
        "Computer Table with CPU Stand", "Study Table with Hutch", "Adjustable Height Study Table",
        "Dual Monitor Desk Wide", "Study Table with Pin Board", "Kids Study Table with Shelf",
        "Executive Writing Desk", "Study Table with Drawer Pedestal", "Compact Study Table for Small Space",
        "Study Table with Charging Dock", "Drafting Table with Tilt Top", "Study Table with Side Return",
    ],
    "BOOKSHELVES_DISPLAY": [
        "Open Bookshelf 5-Tier", "Bookshelf with Glass Doors", "Corner Bookshelf Tall",
        "Ladder Bookshelf A-Frame", "Cube Grid Bookshelf 9-Box", "Wall-Mounted Floating Shelf Set",
        "Bookshelf with Lower Cabinets", "Zigzag Wall Shelf Decorative", "Display Unit with LED Lights",
        "Room Divider Bookshelf", "Magazine Rack Stand", "Hexagonal Wall Shelf Set",
        "Kids Bookshelf Colorful", "Revolving Bookshelf Tower", "Bookshelf with Drawer Base",
        "Glass Display Cabinet", "Photo Display Ledge Shelf", "Narrow Tall Bookshelf",
        "Step Bookshelf Asymmetric", "Bookshelf with Wine Rack Section",
    ],
    "SHOE_RACKS": [
        "Open Shoe Rack 4-Tier", "Shoe Cabinet with Flip Doors", "Shoe Rack with Seat Bench",
        "Wall-Mounted Shoe Rack", "Pull-Out Shoe Rack Slim", "Shoe Cabinet with Mirror Door",
        "Shoe Rack with Umbrella Stand", "Tall Shoe Cabinet 5-Tier", "Shoe Rack with Drawer Top",
        "Stackable Shoe Rack Modular", "Rotating Shoe Rack Tower", "Shoe Cabinet with Key Hooks",
        "Shoe Rack Entryway Organizer", "Shoe Cabinet with Ventilation", "Shoe Bench with Storage Cubbies",
        "Corner Shoe Rack Compact", "Shoe Cabinet with Lock", "Shoe Rack with Boot Compartment",
        "Under-Stair Shoe Storage", "Shoe Display Rack Open Shelf",
    ],
    "KITCHEN_PANTRY": [
        "Kitchen Base Cabinet with Shelf", "Wall-Mounted Kitchen Upper Cabinet",
        "Kitchen Corner Cabinet L-Shape", "Microwave Stand with Storage", "Kitchen Trolley Rolling Cart",
        "Crockery Unit with Glass Doors", "Tall Pantry Unit Pull-Out", "Kitchen Plate Rack Unit",
        "Under-Counter Kitchen Cabinet", "Grain Storage Unit Traditional", "Kitchen Island with Shelves",
        "Modular Kitchen Set Basic", "Kitchen Shelf Unit 4-Tier", "Spice Rack Wall-Mounted",
        "Sink Cabinet with Doors", "Kitchen Drawer Organizer Unit", "Breakfast Bar Counter",
        "Kitchen Cabinet with Wine Rack", "Vegetable Rack Trolley", "Kitchen Wall Shelf with Hooks",
    ],
    "BEDROOM_FURNITURE": [
        "Queen Bed with Hydraulic Storage", "Bedside Table with Drawer",
        "Chest of Drawers 4-Tier", "Diwan Bed with Storage", "King Size Bed with Box Storage",
        "Single Bed with Side Drawers", "Bunk Bed with Storage Steps", "Bedside Table with 2 Drawers",
        "Blanket Box Storage Ottoman", "Bed with Headboard Shelves", "Platform Bed Minimalist",
        "Trundle Bed Pull-Out", "Loft Bed with Desk Below", "Under-Bed Storage Drawer Set",
        "Bedroom Wall Unit Combo", "Low Platform Bed with Side Tables", "Murphy Wall Bed Fold-Up",
        "Kids Bed with Guard Rail", "Bed with Upholstered Headboard", "Bed with Foot Storage Bench",
    ],
    "DRESSING_TABLES": [
        "Dressing Table with Mirror & Drawers", "Wall-Mounted Dressing Unit",
        "Dressing Table with Side Shelves", "Dressing Table with Stool",
        "Compact Corner Dressing Table", "Dressing Table with LED Mirror",
        "Full-Length Mirror Dressing Unit", "Dressing Table with Jewelry Organizer",
        "Minimalist Floating Vanity", "Dressing Table with Tri-Fold Mirror",
        "Dressing Table with Lighted Hollywood Mirror", "Kids Dressing Table with Mirror",
        "Dressing Table with Ottoman Storage Stool", "Narrow Space Dressing Table",
        "Dressing Table with Glass Top", "Wall Console Dressing Unit",
        "Dressing Table with Side Cabinet", "Men's Grooming Station",
        "Double Vanity Dressing Table", "Dressing Table with Towel Rack",
    ],
    "OFFICE_WORKSTATIONS": [
        "Executive Desk with Drawers", "L-Shaped Workstation", "Single-Seater Office Workstation",
        "4-Seater Cluster Workstation", "Reception Counter Desk", "Computer Table with Hutch",
        "Standing Desk Adjustable", "U-Shaped Manager Desk", "Conference Table 8-Seater",
        "Office Credenza Side Unit", "File Cabinet 3-Drawer", "Office Bookcase with Doors",
        "Mobile Pedestal Unit", "Cubicle Partition Workstation", "Writing Table Slim",
        "Cash Counter Desk", "Teacher's Desk with Drawers", "Office Locker Unit 6-Door",
        "Discussion Table Round", "Pigeon-Hole Mail Sorter",
    ],
    "MODULAR_STORAGE": [
        "Multipurpose Storage Cabinet 2-Door", "Cube Organizer 6-Box",
        "Wall-Mounted Cabinet with Doors", "Linen Cabinet Tall", "Storage Cabinet with Lock",
        "Stacking Storage Boxes Set", "Open Shelf Unit 5-Tier", "Filing Cabinet Lateral",
        "Chest of Drawers 5-Tier", "Bar Cabinet with Glass Holder",
        "Pooja Unit Wall-Mounted", "Laundry Hamper Cabinet", "Broom Closet Slim",
        "Medicine Cabinet Wall-Mounted", "Toy Storage Unit Colorful",
        "Record Storage Shelf Vinyl", "Craft Supply Organizer", "Garage Storage Cabinet",
        "Bathroom Vanity Cabinet", "Key Holder Cabinet Wall-Mounted",
    ],
}


# ── Bing Search ──────────────────────────────────────────────────────────

def search_bing_images(query, count=30):
    encoded = urllib.parse.quote_plus(query)
    url = f"https://www.bing.com/images/search?q={encoded}&first=1&count={count}"
    req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
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
        if any(ext in u.lower() for ext in [".svg", ".gif", ".bmp"]):
            continue
        if any(bad in u.lower() for bad in ["logo", "icon", "favicon", "tracking"]):
            continue
        if u not in seen:
            seen.add(u)
            cleaned.append(u)
    return cleaned


def download_image(url, filepath):
    try:
        req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
        with urllib.request.urlopen(req, timeout=15) as resp:
            data = resp.read()
            if len(data) < 2000:
                return False
            with open(filepath, "wb") as f:
                f.write(data)
            return True
    except Exception:
        return False


# ── Phase 1: Search + Download ───────────────────────────────────────────

def phase_search():
    print("\n  PHASE 1: Search Bing + Download to disk\n")
    LOCAL_DIR.mkdir(exist_ok=True)

    manifest = {}
    if MANIFEST.exists():
        manifest = json.loads(MANIFEST.read_text())

    for cat in sorted(SEARCH_QUERIES.keys()):
        products = PRODUCTS_BY_CATEGORY.get(cat, [])
        # Skip products already in manifest
        remaining = [p for p in products if p not in manifest]
        if not remaining:
            print(f"  {cat}: all {len(products)} already downloaded, skipping")
            continue

        print(f"\n{'─' * 55}")
        print(f"  {cat} ({len(remaining)} to download)")
        print(f"{'─' * 55}")

        # Search
        queries = SEARCH_QUERIES[cat]
        all_urls = []
        seen = set()
        for q in queries:
            print(f"  Searching: {q}")
            urls = search_bing_images(q)
            for u in urls:
                if u not in seen:
                    seen.add(u)
                    all_urls.append(u)
            time.sleep(2)

        print(f"  Found {len(all_urls)} candidate images\n")
        if not all_urls:
            print("  No images found!")
            continue

        cat_dir = LOCAL_DIR / cat.lower()
        cat_dir.mkdir(exist_ok=True)

        for i, product_name in enumerate(remaining):
            slug = re.sub(r'[^a-z0-9]+', '-', product_name.lower()).strip('-')
            filepath = cat_dir / f"{slug}.jpg"
            prefix = f"  [{i+1}/{len(remaining)}]"

            print(f"{prefix} {product_name}", end="", flush=True)

            downloaded = False
            for attempt in range(min(8, len(all_urls))):
                img_url = all_urls[(i + attempt) % len(all_urls)]
                if download_image(img_url, filepath):
                    size_kb = filepath.stat().st_size // 1024
                    print(f" -> {size_kb}KB")
                    manifest[product_name] = {
                        "category": cat,
                        "slug": slug,
                        "local_path": str(filepath),
                        "source_url": img_url,
                    }
                    downloaded = True
                    break

            if not downloaded:
                print(f" -> FAILED")

            time.sleep(0.3)

        # Save manifest after each category
        MANIFEST.write_text(json.dumps(manifest, indent=2))
        time.sleep(3)

    MANIFEST.write_text(json.dumps(manifest, indent=2))
    print(f"\n  Phase 1 complete: {len(manifest)} images downloaded to {LOCAL_DIR}")


# ── Phase 2: Upload to Supabase ──────────────────────────────────────────

def phase_upload():
    print("\n  PHASE 2: Upload to Supabase + Update DB\n")

    if not MANIFEST.exists():
        print("  No manifest found. Run 'search' phase first.")
        return

    manifest = json.loads(MANIFEST.read_text())

    # Test Supabase connectivity
    try:
        req = urllib.request.Request(
            f"{SUPABASE_URL}/rest/v1/catalog_products?select=id,name,slug,category,raw_photo_urls&status=eq.PUBLISHED&limit=1",
            headers={"apikey": SUPABASE_KEY, "Authorization": f"Bearer {SUPABASE_KEY}"}
        )
        with urllib.request.urlopen(req, timeout=10) as resp:
            test = json.loads(resp.read().decode())
            print(f"  Supabase connected OK\n")
    except Exception as e:
        print(f"  Cannot reach Supabase: {e}")
        print(f"  Try again when internet is stable.")
        return

    # Get all products needing images
    cats = ",".join(SEARCH_QUERIES.keys())
    path = f"/rest/v1/catalog_products?select=id,name,slug,category,raw_photo_urls&status=eq.PUBLISHED&category=in.({cats})&order=category,sort_order"
    req = urllib.request.Request(
        f"{SUPABASE_URL}{path}",
        headers={"apikey": SUPABASE_KEY, "Authorization": f"Bearer {SUPABASE_KEY}"}
    )
    with urllib.request.urlopen(req, timeout=15) as resp:
        products = json.loads(resp.read().decode())

    need_upload = [p for p in products if not p.get("raw_photo_urls") or len(p["raw_photo_urls"]) == 0]
    print(f"  {len(need_upload)} products need images in DB")
    print(f"  {len(manifest)} images available locally\n")

    ok = 0
    fail = 0
    for p in need_upload:
        info = manifest.get(p["name"])
        if not info:
            continue

        local_path = Path(info["local_path"])
        if not local_path.exists():
            continue

        print(f"  Uploading: {p['name']}", end="", flush=True)

        image_data = local_path.read_bytes()
        slug = p["slug"]

        # Upload to storage
        storage_path = f"/storage/v1/object/{BUCKET}/particle-board/{slug}.jpg"
        try:
            req = urllib.request.Request(
                f"{SUPABASE_URL}{storage_path}",
                data=image_data,
                headers={
                    "apikey": SUPABASE_KEY,
                    "Authorization": f"Bearer {SUPABASE_KEY}",
                    "Content-Type": "image/jpeg",
                    "x-upsert": "true",
                },
                method="POST"
            )
            with urllib.request.urlopen(req, timeout=30):
                pass
        except Exception as e:
            print(f" -> Upload FAILED: {e}")
            fail += 1
            continue

        public_url = f"{SUPABASE_URL}/storage/v1/object/public/{BUCKET}/particle-board/{slug}.jpg"

        # Update DB
        try:
            data = json.dumps({"raw_photo_urls": [public_url], "processed_photo_urls": [public_url]}).encode()
            req = urllib.request.Request(
                f"{SUPABASE_URL}/rest/v1/catalog_products?id=eq.{p['id']}",
                data=data,
                headers={
                    "apikey": SUPABASE_KEY,
                    "Authorization": f"Bearer {SUPABASE_KEY}",
                    "Content-Type": "application/json",
                    "Prefer": "return=minimal",
                },
                method="PATCH"
            )
            with urllib.request.urlopen(req, timeout=15):
                pass
            print(f" -> OK")
            ok += 1
        except Exception as e:
            print(f" -> DB update FAILED: {e}")
            fail += 1

        time.sleep(0.2)

    print(f"\n  Phase 2 complete: {ok} uploaded, {fail} failed")


# ── Entry ────────────────────────────────────────────────────────────────

def main():
    print("=" * 55)
    print("  Offline Image Fetcher (Bing -> Local -> Supabase)")
    print("=" * 55)

    mode = sys.argv[1] if len(sys.argv) > 1 else "both"

    if mode in ("search", "both"):
        phase_search()
    if mode in ("upload", "both"):
        phase_upload()

if __name__ == "__main__":
    main()
