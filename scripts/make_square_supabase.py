#!/usr/bin/env python3
"""
Download processed product images from Supabase Storage,
make them square (extend background width), and re-upload.
"""

import os
import sys
import json
import tempfile
import urllib.request
from PIL import Image
from io import BytesIO

SUPABASE_URL = "https://kwxkapanfkviibxjhgps.supabase.co"
SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt3eGthcGFuZmt2aWlieGpoZ3BzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzEyMDYwMywiZXhwIjoyMDg4Njk2NjAzfQ.K4qLj9niaFNHgfURLIGbTVEsrBuRt8LmH5bbg6M_pv0"
ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt3eGthcGFuZmt2aWlieGpoZ3BzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMxMjA2MDMsImV4cCI6MjA4ODY5NjYwM30.b5f4RCZYNJ5jimPH51gOW9J-xAPau6hYtSuHcKRY-dE"


def download_image(url: str) -> Image.Image:
    """Download image from URL and return PIL Image."""
    req = urllib.request.Request(url)
    with urllib.request.urlopen(req) as resp:
        data = resp.read()
    return Image.open(BytesIO(data))


def make_square(img: Image.Image) -> Image.Image:
    """Make image square by extending width, keeping content centered."""
    w, h = img.size
    if w >= h:
        return img  # Already square or landscape

    new_size = h
    has_alpha = img.mode == "RGBA" or img.mode == "PA"

    if has_alpha:
        canvas = Image.new("RGBA", (new_size, new_size), (0, 0, 0, 0))
        x_offset = (new_size - w) // 2
        canvas.paste(img, (x_offset, 0), img)
    else:
        img_rgb = img.convert("RGB")
        canvas = Image.new("RGB", (new_size, new_size), (0, 0, 0))
        x_offset = (new_size - w) // 2
        canvas.paste(img_rgb, (x_offset, 0))

        # Extend edge pixels per row
        pixels = canvas.load()
        orig_pixels = img_rgb.load()
        for y in range(h):
            left_color = orig_pixels[0, y]
            right_color = orig_pixels[w - 1, y]
            for x in range(x_offset):
                pixels[x, y] = left_color
            for x in range(x_offset + w, new_size):
                pixels[x, y] = right_color

    return canvas


def upload_to_supabase(img: Image.Image, storage_path: str):
    """Upload image to Supabase Storage, overwriting existing file."""
    # Save to bytes
    buf = BytesIO()
    if img.mode == "RGBA":
        img.save(buf, "WEBP", quality=90, lossless=False)
    else:
        img.save(buf, "WEBP", quality=90)
    buf.seek(0)
    data = buf.read()

    # Upload via Supabase Storage API (upsert)
    # storage_path is like: catalog/processed/17/01.webp
    bucket = storage_path.split("/")[0]  # "catalog"
    object_path = "/".join(storage_path.split("/")[1:])  # "processed/17/01.webp"

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


def fetch_products(categories: list[str]) -> list[dict]:
    """Fetch published products for given categories."""
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


def extract_storage_path(public_url: str) -> str:
    """Extract storage path from public URL.
    e.g. https://xxx.supabase.co/storage/v1/object/public/catalog/processed/17/01.webp
    -> catalog/processed/17/01.webp
    """
    marker = "/object/public/"
    idx = public_url.index(marker) + len(marker)
    return public_url[idx:]


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

            # Download
            try:
                img = download_image(url)
            except Exception as e:
                print(f"    Download failed: {e}")
                continue

            w, h = img.size
            print(f"    Original: {w}x{h} ({img.mode})")

            if w >= h:
                print(f"    Already square/landscape, skipping")
                continue

            # Make square
            squared = make_square(img)
            sw, sh = squared.size
            print(f"    Squared:  {sw}x{sh}")

            # Upload
            storage_path = extract_storage_path(url)
            print(f"    Uploading to: {storage_path}")
            status = upload_to_supabase(squared, storage_path)
            print(f"    Upload status: {status}")

    print(f"\n\nDone! Processed {len(products)} products.")


if __name__ == "__main__":
    main()
