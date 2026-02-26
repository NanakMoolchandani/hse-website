"""
Process ALL extracted product images:
1. Collect all images per series from raw page extractions
2. Remove backgrounds using rembg
3. Save as PNG (transparent) into per-series folders
4. Name by size/view order (view-1.png, view-2.png, etc.)
"""
import os
import glob
from PIL import Image
from rembg import remove

PRODUCTS_DIR = "/Users/nanakmoolchandani/Hari Shewa Project/hse-3d-website/public/products"

# Page number → series name mapping (from catalogue)
SERIES_MAP = {
    2: "freedom",
    3: "lifestyle",
    4: "aeris",
    5: "ultra",
    6: "matrix",
    7: "5-star",
    8: "rio-ecco",
    9: "spider-vertigo",
    10: "maze-space",
    11: "t-bar-vision",
    12: "decker",
    13: "backpack-swivel",
    14: "pears-messy",
    15: "attire-visit",
    16: "steller",
}

MIN_SIZE = 200  # Minimum dimension to include (skip tiny icons)

total_processed = 0

for page_num, series_name in SERIES_MAP.items():
    series_dir = os.path.join(PRODUCTS_DIR, series_name)
    os.makedirs(series_dir, exist_ok=True)

    # Find all images for this page
    pattern = os.path.join(PRODUCTS_DIR, f"page{page_num:02d}_*.jpeg")
    page_images = sorted(glob.glob(pattern))

    if not page_images:
        print(f"  {series_name}: No images found for page {page_num}")
        continue

    # Filter by minimum size and sort by area (largest first)
    sized_images = []
    for path in page_images:
        try:
            img = Image.open(path)
            w, h = img.size
            if w >= MIN_SIZE and h >= MIN_SIZE:
                sized_images.append((path, w, h, w * h))
            img.close()
        except Exception:
            pass

    # Sort by area descending (best/largest images first)
    sized_images.sort(key=lambda x: x[3], reverse=True)

    print(f"\n{series_name} (page {page_num}): {len(sized_images)} images")

    for idx, (filepath, w, h, area) in enumerate(sized_images):
        view_name = f"view-{idx + 1}.png"
        output_path = os.path.join(series_dir, view_name)

        print(f"  Processing {os.path.basename(filepath)} ({w}x{h}) → {view_name}...", end=" ", flush=True)

        try:
            with open(filepath, "rb") as f:
                input_data = f.read()

            output_data = remove(input_data)

            # Save as PNG with transparency
            with open(output_path, "wb") as f:
                f.write(output_data)

            total_processed += 1
            print("OK")
        except Exception as e:
            print(f"FAILED: {e}")

print(f"\n{'='*50}")
print(f"Total images processed: {total_processed}")
print(f"Series folders: {len(SERIES_MAP)}")
print(f"\nImages saved as transparent PNG in: {PRODUCTS_DIR}/{{series}}/view-N.png")
