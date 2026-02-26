"""Reorganize product images from flat hero/ folder into per-series folders."""
import os
import shutil

HERO_DIR = "/Users/nanakmoolchandani/Hari Shewa Project/hse-3d-website/public/products/hero"
PRODUCTS_DIR = "/Users/nanakmoolchandani/Hari Shewa Project/hse-3d-website/public/products"

SERIES = [
    "freedom", "lifestyle", "aeris", "ultra", "matrix", "5-star",
    "rio-ecco", "spider-vertigo", "maze-space", "t-bar-vision",
    "decker", "backpack-swivel", "pears-messy", "attire-visit", "steller",
]

for name in SERIES:
    folder = os.path.join(PRODUCTS_DIR, name)
    os.makedirs(folder, exist_ok=True)

    hero = os.path.join(HERO_DIR, f"{name}.jpeg")
    alt = os.path.join(HERO_DIR, f"{name}-alt.jpeg")

    if os.path.exists(hero):
        shutil.copy2(hero, os.path.join(folder, "front.jpeg"))
        print(f"  {name}/front.jpeg")

    if os.path.exists(alt):
        shutil.copy2(alt, os.path.join(folder, "angle.jpeg"))
        print(f"  {name}/angle.jpeg")

print(f"\nOrganized {len(SERIES)} series into per-series folders.")
print("\nNaming convention for future images:")
print("  {series}/front.jpeg   — Front view")
print("  {series}/back.jpeg    — Back view")
print("  {series}/side-l.jpeg  — Left side view")
print("  {series}/side-r.jpeg  — Right side view")
print("  {series}/angle.jpeg   — 45° perspective view")
