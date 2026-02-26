"""Pick the best hero image for each MVM chair series and organize them."""
import os
import shutil
from PIL import Image

SRC = "/Users/nanakmoolchandani/Hari Shewa Project/hse-3d-website/public/products"
DST = "/Users/nanakmoolchandani/Hari Shewa Project/hse-3d-website/public/products/hero"

os.makedirs(DST, exist_ok=True)

# Mapping: page number → series name + pick the tallest image (usually the hero shot)
series_pages = {
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

for page_num, series_name in series_pages.items():
    page_prefix = f"page{page_num:02d}_"
    # Find all images for this page
    page_images = []
    for f in os.listdir(SRC):
        if f.startswith(page_prefix) and os.path.isfile(os.path.join(SRC, f)):
            filepath = os.path.join(SRC, f)
            try:
                img = Image.open(filepath)
                w, h = img.size
                # Prefer tall images (portrait = chair hero shots)
                # Score: height * 1.5 + width for portrait preference
                score = h * 1.5 + w
                page_images.append((filepath, f, w, h, score))
                img.close()
            except Exception:
                pass

    if page_images:
        # Sort by score (prefer tall/large)
        page_images.sort(key=lambda x: x[4], reverse=True)
        best = page_images[0]
        src_path = best[0]
        ext = os.path.splitext(best[1])[1]

        # Also save second-best as alternate view
        dst_path = os.path.join(DST, f"{series_name}{ext}")
        shutil.copy2(src_path, dst_path)
        print(f"{series_name}: {best[1]} ({best[2]}x{best[3]}) → {series_name}{ext}")

        # Save second image too if available
        if len(page_images) > 1:
            second = page_images[1]
            ext2 = os.path.splitext(second[1])[1]
            dst2 = os.path.join(DST, f"{series_name}-alt{ext2}")
            shutil.copy2(second[0], dst2)
            print(f"  alt: {second[1]} ({second[2]}x{second[3]})")

print(f"\nHero images saved to: {DST}")
print(f"Total series: {len(series_pages)}")
