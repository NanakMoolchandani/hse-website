#!/usr/bin/env python3
"""
Fix cafeteria & visitor/reception product images:
- Strip black padding borders
- Extend the lifestyle background outward to make truly square
- Re-upload to Supabase Storage
"""

import json
import urllib.request
from PIL import Image, ImageFilter
from io import BytesIO

SUPABASE_URL = "https://kwxkapanfkviibxjhgps.supabase.co"
SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt3eGthcGFuZmt2aWlieGpoZ3BzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzEyMDYwMywiZXhwIjoyMDg4Njk2NjAzfQ.K4qLj9niaFNHgfURLIGbTVEsrBuRt8LmH5bbg6M_pv0"
ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt3eGthcGFuZmt2aWlieGpoZ3BzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMxMjA2MDMsImV4cCI6MjA4ODY5NjYwM30.b5f4RCZYNJ5jimPH51gOW9J-xAPau6hYtSuHcKRY-dE"


def download_image(url: str) -> Image.Image:
    req = urllib.request.Request(url)
    with urllib.request.urlopen(req) as resp:
        data = resp.read()
    return Image.open(BytesIO(data))


def find_content_bounds(img: Image.Image, threshold=15) -> tuple[int, int]:
    """Find left and right content boundaries (non-black columns)."""
    w, h = img.size
    pixels = img.load()

    def is_black_col(x):
        black_count = 0
        for y in range(h):
            p = pixels[x, y]
            r, g, b = p[0], p[1], p[2]
            a = p[3] if len(p) == 4 else 255
            if a < 10 or (r < threshold and g < threshold and b < threshold):
                black_count += 1
        return black_count > h * 0.9

    left = 0
    for x in range(w):
        if is_black_col(x):
            left = x + 1
        else:
            break

    right = w
    for x in range(w - 1, -1, -1):
        if is_black_col(x):
            right = x
        else:
            break

    return left, right


def extend_background(img: Image.Image, target_size: int) -> Image.Image:
    """Extend the lifestyle background on both sides using edge pixel stretching
    with a smooth gradient blend for a natural look."""
    w, h = img.size

    if w >= target_size:
        return img

    # Work in RGB for the extension
    img_rgb = img.convert("RGB")
    canvas = Image.new("RGB", (target_size, h), (0, 0, 0))

    x_offset = (target_size - w) // 2
    canvas.paste(img_rgb, (x_offset, 0))

    pixels = canvas.load()
    orig_pixels = img_rgb.load()

    # For each row, sample a strip near the edge (average of ~5px) for smoother extension
    strip_width = min(5, w // 4)

    for y in range(h):
        # Left edge: average of first few pixels
        lr, lg, lb = 0, 0, 0
        for sx in range(strip_width):
            r, g, b = orig_pixels[sx, y]
            lr += r; lg += g; lb += b
        lr //= strip_width; lg //= strip_width; lb //= strip_width

        # Right edge: average of last few pixels
        rr, rg, rb = 0, 0, 0
        for sx in range(w - strip_width, w):
            r, g, b = orig_pixels[sx, y]
            rr += r; rg += g; rb += b
        rr //= strip_width; rg //= strip_width; rb //= strip_width

        # Fill left side
        for x in range(x_offset):
            pixels[x, y] = (lr, lg, lb)

        # Fill right side
        for x in range(x_offset + w, target_size):
            pixels[x, y] = (rr, rg, rb)

    # Apply a slight blur to the extension boundaries for smoother blending
    canvas = canvas.filter(ImageFilter.GaussianBlur(radius=0.5))
    # Paste the sharp original back on top
    canvas.paste(img_rgb, (x_offset, 0))

    return canvas


def upload_to_supabase(img: Image.Image, storage_path: str):
    buf = BytesIO()
    img.save(buf, "WEBP", quality=90)
    buf.seek(0)
    data = buf.read()

    bucket = storage_path.split("/")[0]
    object_path = "/".join(storage_path.split("/")[1:])
    url = f"{SUPABASE_URL}/storage/v1/object/{bucket}/{object_path}"

    req = urllib.request.Request(url, data=data, method="PUT")
    req.add_header("Authorization", f"Bearer {SERVICE_KEY}")
    req.add_header("Content-Type", "image/webp")
    req.add_header("x-upsert", "true")

    try:
        with urllib.request.urlopen(req) as resp:
            return resp.status
    except urllib.error.HTTPError as e:
        print(f"    Upload error {e.code}: {e.read().decode()}")
        return e.code


def extract_storage_path(public_url: str) -> str:
    marker = "/object/public/"
    idx = public_url.index(marker) + len(marker)
    return public_url[idx:]


def fetch_products(categories: list[str]) -> list[dict]:
    cat_filter = ",".join(categories)
    url = (
        f"{SUPABASE_URL}/rest/v1/catalog_products"
        f"?category=in.({cat_filter})"
        f"&status=eq.PUBLISHED"
        f"&select=id,name,slug,category,processed_photo_urls"
    )
    req = urllib.request.Request(url)
    req.add_header("apikey", ANON_KEY)
    req.add_header("Authorization", f"Bearer {ANON_KEY}")

    with urllib.request.urlopen(req) as resp:
        return json.loads(resp.read().decode())


def main():
    categories = ["CAFETERIA_FURNITURE", "VISITOR_RECEPTION"]
    products = fetch_products(categories)

    print(f"Found {len(products)} products to process\n")

    for product in products:
        name = product["name"]
        pid = product["id"]
        cat = product["category"]
        urls = product.get("processed_photo_urls") or []

        print(f"\n{'='*50}")
        print(f"{name} (ID:{pid}, {cat}) — {len(urls)} images")
        print(f"{'='*50}")

        for i, url in enumerate(urls):
            print(f"\n  Image {i+1}: {url.split('/')[-1]}")

            try:
                img = download_image(url)
            except Exception as e:
                print(f"    Download failed: {e}")
                continue

            w, h = img.size
            print(f"    Size: {w}x{h} ({img.mode})")

            # Find actual content (strip black borders)
            img_check = img.convert("RGBA") if img.mode != "RGBA" else img
            left, right = find_content_bounds(img_check)

            if left == 0 and right == w:
                print(f"    No black borders detected, skipping")
                continue

            content_w = right - left
            print(f"    Black borders: left={left}px, right={w - right}px → content={content_w}x{h}")

            # Crop to content
            content = img.crop((left, 0, right, h))

            # Extend lifestyle background to target size
            target = max(w, h)  # Keep same overall size (1200)
            result = extend_background(content, target)
            rw, rh = result.size
            print(f"    Extended: {rw}x{rh}")

            # Upload
            storage_path = extract_storage_path(url)
            print(f"    Uploading: {storage_path}")
            status = upload_to_supabase(result, storage_path)
            print(f"    Status: {status}")

    print(f"\n\nDone!")


if __name__ == "__main__":
    main()
