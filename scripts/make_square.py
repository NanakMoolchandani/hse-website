#!/usr/bin/env python3
"""
Make chair product images square by extending the background width.
- PNGs (transparent bg): Expand canvas, center the chair
- JPEGs (dark bg): Sample edge pixels per row and extend outward
The chair itself stays the exact same size.
"""

import sys
import os
from PIL import Image
import shutil
from pathlib import Path


def make_square_png(img_path: str, out_path: str):
    """Expand transparent PNG to square by centering on larger canvas."""
    img = Image.open(img_path).convert("RGBA")
    w, h = img.size

    if w >= h:
        print(f"  Already square or landscape ({w}x{h}), skipping")
        shutil.copy2(img_path, out_path)
        return

    # New square canvas (h x h) with transparent background
    new_size = h
    canvas = Image.new("RGBA", (new_size, new_size), (0, 0, 0, 0))

    # Center the original image horizontally
    x_offset = (new_size - w) // 2
    canvas.paste(img, (x_offset, 0), img)

    canvas.save(out_path, "PNG")
    print(f"  {w}x{h} -> {new_size}x{new_size}")


def make_square_jpeg(img_path: str, out_path: str):
    """Expand JPEG to square by extending edge pixels outward per row."""
    img = Image.open(img_path).convert("RGB")
    w, h = img.size

    if w >= h:
        print(f"  Already square or landscape ({w}x{h}), skipping")
        shutil.copy2(img_path, out_path)
        return

    new_size = h
    canvas = Image.new("RGB", (new_size, new_size), (0, 0, 0))

    # Center the original image
    x_offset = (new_size - w) // 2
    canvas.paste(img, (x_offset, 0))

    # For each row, extend edge colors outward
    pixels = canvas.load()
    orig_pixels = img.load()

    for y in range(h):
        # Left edge color from original image
        left_color = orig_pixels[0, y]
        # Right edge color from original image
        right_color = orig_pixels[w - 1, y]

        # Fill left side
        for x in range(x_offset):
            pixels[x, y] = left_color

        # Fill right side
        for x in range(x_offset + w, new_size):
            pixels[x, y] = right_color

    canvas.save(out_path, "JPEG", quality=95)
    print(f"  {w}x{h} -> {new_size}x{new_size}")


def process_product(product_dir: str, backup: bool = True):
    """Process all images in a product directory to make them square."""
    product_dir = Path(product_dir)

    if not product_dir.exists():
        print(f"Directory not found: {product_dir}")
        return

    product_name = product_dir.name
    print(f"\nProcessing: {product_name}")
    print("=" * 40)

    # Create backup
    if backup:
        backup_dir = product_dir.parent / f"{product_name}_original_backup"
        if not backup_dir.exists():
            shutil.copytree(product_dir, backup_dir)
            print(f"Backup created: {backup_dir}")

    for img_file in sorted(product_dir.iterdir()):
        if not img_file.is_file():
            continue

        ext = img_file.suffix.lower()
        print(f"\n  {img_file.name}:")

        if ext == ".png":
            make_square_png(str(img_file), str(img_file))
        elif ext in (".jpg", ".jpeg"):
            make_square_jpeg(str(img_file), str(img_file))
        else:
            print(f"  Skipping unsupported format: {ext}")


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python make_square.py <product_dir> [--no-backup]")
        sys.exit(1)

    product_dir = sys.argv[1]
    backup = "--no-backup" not in sys.argv

    process_product(product_dir, backup=backup)
    print("\nDone!")
