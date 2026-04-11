#!/usr/bin/env python3
"""
Reprocess Mc Donalds PC chair images using Gemini image editing API.
Pipeline: raw photo → remove polythene + white bg → lifestyle background → square → upload
"""

import json
import time
import base64
import urllib.request
from io import BytesIO
from PIL import Image

GEMINI_API_KEY = "AIzaSyBbE7JGDKzMdnarDMUUVFZ7_QR2q80criA"
SUPABASE_URL = "https://kwxkapanfkviibxjhgps.supabase.co"
SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt3eGthcGFuZmt2aWlieGpoZ3BzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzEyMDYwMywiZXhwIjoyMDg4Njk2NjAzfQ.K4qLj9niaFNHgfURLIGbTVEsrBuRt8LmH5bbg6M_pv0"

# Gemini models to try (flash first for speed, pro as fallback)
GEMINI_MODELS = [
    "gemini-3.1-flash-image-preview",
    "gemini-3-pro-image-preview",
    "gemini-2.5-flash-image",
]

# Raw photos: pick 3 best angles — front(01), side(02), back(03)
RAW_URLS = [
    ("01", "https://kwxkapanfkviibxjhgps.supabase.co/storage/v1/object/public/catalog/raw/89/01.jpg"),  # front
    ("02", "https://kwxkapanfkviibxjhgps.supabase.co/storage/v1/object/public/catalog/raw/89/02.jpg"),  # side
    ("03", "https://kwxkapanfkviibxjhgps.supabase.co/storage/v1/object/public/catalog/raw/89/03.jpg"),  # back
]

STEP1_PROMPT = """You are an IMAGE EDITOR. Edit this photo of a metal cafeteria chair.

TASK: Remove ALL packaging (plastic wrap, polythene, tape) from the chair AND replace the background with PURE WHITE (#FFFFFF).

★★★ PRESERVE THE EXACT CAMERA ANGLE ★★★
• Output MUST show the chair from the EXACT SAME viewing angle as the input
• Do NOT rotate, flip, or change the viewing direction

ABOUT THIS CHAIR:
• Simple metal ladder-back cafeteria chair (NOT an office chair)
• Black powder-coated steel frame with horizontal ladder-back bars
• Round padded seat cushion with patterned fabric (dark blue/gray with small dots)
• 4 straight legs (NOT a 5-star base, NOT chrome — plain black steel legs)
• Silver/aluminum tips (caps) at bottom of each leg
• Round footrest ring connecting the legs

CRITICAL - DO NOT CHANGE:
• Keep it as a simple 4-legged chair — do NOT add a 5-star base or chrome spider base
• Keep the legs BLACK powder-coated steel — do NOT make them chrome/silver
• Keep the seat cushion fabric pattern and color exactly as-is
• Keep the ladder-back design exactly as-is

REMOVE:
• All plastic wrapping, polythene, bubble wrap, tape
• All background — replace with pure white

OUTPUT: Clean chair on pure white background, same angle, same proportions, all packaging removed."""

STEP2_PROMPT = """You are an IMAGE EDITOR. Replace ONLY the white background with a lifestyle scene. Do NOT modify the chair.

★★★ PRESERVE THE EXACT CAMERA ANGLE ★★★
• The chair is shown from a specific angle. Keep the EXACT SAME angle.
• Do NOT rotate or reposition the chair.

★★★ DO NOT MODIFY THE CHAIR ★★★
• This is a simple black steel 4-legged cafeteria chair — keep it exactly as-is
• Do NOT add a 5-star base, do NOT add chrome legs, do NOT change any part of the chair
• Keep the black powder-coated steel frame, ladder-back, padded seat — UNCHANGED

BACKGROUND SCENE:
A stylish modern cafe or restaurant setting:
• Walls: exposed brick wall OR white subway tile backsplash — trendy cafe vibe
• Floor: polished concrete or dark tile floor
• Counter: sleek bar counter or high table edge visible nearby (wood or stone top)
• Lighting: warm pendant lights or Edison bulbs from above
• Accessories: maybe a coffee machine edge, small potted plant
• Overall mood: TRENDY, WARM, INVITING — a hip urban cafe

BACKGROUND RULES:
• Background goes BEHIND the chair only — never overlaps it
• Natural soft shadow underneath — realistic
• Chair must look grounded on the floor

REALISM:
• Must look like a real photo taken in a real cafe — NOT AI-generated
• Simple, understated — like a showroom photo
• AVOID: perfectly symmetrical backgrounds, golden tones, bokeh

FRAMING: Center with ~15% margin. Full chair visible.

OUTPUT: Same angle. Cafe lifestyle background. Chair completely unchanged."""


def download_image(url: str) -> bytes:
    req = urllib.request.Request(url)
    with urllib.request.urlopen(req) as resp:
        return resp.read()


def resize_for_api(img_bytes: bytes, max_dim: int = 1024) -> bytes:
    """Resize image to max dimension for cheaper API calls."""
    img = Image.open(BytesIO(img_bytes))
    w, h = img.size
    if max(w, h) <= max_dim:
        # Convert to PNG bytes
        buf = BytesIO()
        img.save(buf, "PNG")
        return buf.getvalue()

    ratio = max_dim / max(w, h)
    new_w, new_h = int(w * ratio), int(h * ratio)
    img = img.resize((new_w, new_h), Image.LANCZOS)
    buf = BytesIO()
    img.save(buf, "PNG")
    return buf.getvalue()


def call_gemini(img_bytes: bytes, prompt: str, step_label: str) -> bytes:
    """Call Gemini image editing API. Returns processed image bytes."""
    # Resize input
    optimized = resize_for_api(img_bytes)
    b64_image = base64.b64encode(optimized).decode()

    request_body = {
        "contents": [{
            "parts": [
                {"text": prompt},
                {"inline_data": {"mime_type": "image/png", "data": b64_image}},
            ],
        }],
        "generationConfig": {
            "responseModalities": ["TEXT", "IMAGE"],
        },
    }

    body_bytes = json.dumps(request_body).encode()

    for model in GEMINI_MODELS:
        url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={GEMINI_API_KEY}"
        print(f"  [{step_label}] Trying {model}...")

        req = urllib.request.Request(url, data=body_bytes, method="POST")
        req.add_header("Content-Type", "application/json")

        try:
            with urllib.request.urlopen(req, timeout=120) as resp:
                data = json.loads(resp.read().decode())
        except urllib.error.HTTPError as e:
            err = e.read().decode()[:200]
            print(f"  [{step_label}] {model} failed ({e.code}): {err}")
            continue
        except Exception as e:
            print(f"  [{step_label}] {model} error: {e}")
            continue

        candidates = data.get("candidates", [])
        if not candidates:
            print(f"  [{step_label}] {model}: no candidates")
            continue

        parts = candidates[0].get("content", {}).get("parts", [])
        for part in parts:
            if "inlineData" in part:
                result = base64.b64decode(part["inlineData"]["data"])
                print(f"  [{step_label}] Success via {model} ({len(result)} bytes)")
                return result

        print(f"  [{step_label}] {model}: no image in response")
        # Print any text response for debugging
        for part in parts:
            if "text" in part:
                print(f"    Text: {part['text'][:200]}")

    raise Exception(f"All Gemini models failed for {step_label}")


def make_square(img_bytes: bytes, target: int = 1200) -> Image.Image:
    """Make image square and resize to target."""
    img = Image.open(BytesIO(img_bytes)).convert("RGB")
    w, h = img.size

    # First make square
    if w != h:
        size = max(w, h)
        canvas = Image.new("RGB", (size, size), (0, 0, 0))
        x_off = (size - w) // 2
        y_off = (size - h) // 2
        canvas.paste(img, (x_off, y_off))

        # Extend edges (same technique as before)
        pixels = canvas.load()
        img_pixels = img.load()

        for y in range(size):
            src_y = min(max(y - y_off, 0), h - 1)
            left_color = img_pixels[0, src_y]
            right_color = img_pixels[w - 1, src_y]

            for x in range(x_off):
                pixels[x, y] = left_color
            for x in range(x_off + w, size):
                pixels[x, y] = right_color

        # Fill top/bottom if needed
        if y_off > 0:
            for y in range(y_off):
                for x in range(size):
                    src_x = min(max(x - x_off, 0), w - 1)
                    pixels[x, y] = img_pixels[src_x, 0]
            for y in range(y_off + h, size):
                for x in range(size):
                    src_x = min(max(x - x_off, 0), w - 1)
                    pixels[x, y] = img_pixels[src_x, h - 1]

        img = canvas

    # Resize to target
    if img.size[0] != target:
        img = img.resize((target, target), Image.LANCZOS)

    return img


def upload_to_supabase(img: Image.Image, storage_path: str) -> int:
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
        print(f"  Upload error {e.code}: {e.read().decode()[:200]}")
        return e.code


def update_product_urls(product_id: int, urls: list[str]):
    """Update processed_photo_urls in the database."""
    url = f"{SUPABASE_URL}/rest/v1/catalog_products?id=eq.{product_id}"
    body = json.dumps({"processed_photo_urls": urls}).encode()

    req = urllib.request.Request(url, data=body, method="PATCH")
    req.add_header("apikey", SERVICE_KEY)
    req.add_header("Authorization", f"Bearer {SERVICE_KEY}")
    req.add_header("Content-Type", "application/json")
    req.add_header("Prefer", "return=minimal")

    with urllib.request.urlopen(req) as resp:
        return resp.status


def main():
    product_id = 9
    processed_urls = []

    for idx, (num, raw_url) in enumerate(RAW_URLS):
        print(f"\n{'='*50}")
        print(f"Processing image {num} ({idx+1}/3)")
        print(f"{'='*50}")

        # Download raw
        print(f"  Downloading raw photo...")
        raw_bytes = download_image(raw_url)
        print(f"  Downloaded: {len(raw_bytes)} bytes")

        # Step 1: Remove polythene + white background
        print(f"\n  Step 1: Polythene removal + white background...")
        white_bg_bytes = call_gemini(raw_bytes, STEP1_PROMPT, f"img{num}-step1")

        # Save intermediate for inspection
        Image.open(BytesIO(white_bg_bytes)).save(f"/tmp/mcdonalds-{num}-whitebg.png")
        print(f"  Saved intermediate: /tmp/mcdonalds-{num}-whitebg.png")

        # Brief pause to avoid rate limiting
        time.sleep(3)

        # Step 2: Add lifestyle background
        print(f"\n  Step 2: Lifestyle background...")
        lifestyle_bytes = call_gemini(white_bg_bytes, STEP2_PROMPT, f"img{num}-step2")

        # Save intermediate
        Image.open(BytesIO(lifestyle_bytes)).save(f"/tmp/mcdonalds-{num}-lifestyle.png")
        print(f"  Saved intermediate: /tmp/mcdonalds-{num}-lifestyle.png")

        # Make square (1200x1200)
        print(f"\n  Making square (1200x1200)...")
        squared = make_square(lifestyle_bytes, 1200)
        squared.save(f"/tmp/mcdonalds-{num}-final.png")
        print(f"  Final size: {squared.size}")

        # Upload to Supabase
        storage_path = f"catalog/processed/{product_id}/0{idx+1}.webp"
        print(f"\n  Uploading to: {storage_path}")
        status = upload_to_supabase(squared, storage_path)
        print(f"  Upload status: {status}")

        processed_urls.append(
            f"{SUPABASE_URL}/storage/v1/object/public/{storage_path}"
        )

        # Rate limit pause between images
        if idx < len(RAW_URLS) - 1:
            print(f"\n  Waiting 5s before next image...")
            time.sleep(5)

    # Update database with new URLs
    print(f"\n{'='*50}")
    print(f"Updating database with {len(processed_urls)} new URLs...")
    status = update_product_urls(product_id, processed_urls)
    print(f"Database update status: {status}")
    print(f"\nNew URLs:")
    for u in processed_urls:
        print(f"  {u}")

    print(f"\nDone!")


if __name__ == "__main__":
    main()
