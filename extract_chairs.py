"""Extract chair images from MVM Aasanam PDF catalogue."""
import fitz  # PyMuPDF
import os
from PIL import Image
import io

PDF_PATH = "/Users/nanakmoolchandani/Downloads/Meshy Mesh Series (MVM Catalogue).pdf"
OUTPUT_DIR = "/Users/nanakmoolchandani/Hari Shewa Project/hse-3d-website/public/products"

os.makedirs(OUTPUT_DIR, exist_ok=True)

doc = fitz.open(PDF_PATH)

print(f"PDF has {len(doc)} pages")

# Extract all images from the PDF
img_count = 0
for page_num in range(len(doc)):
    page = doc[page_num]
    images = page.get_images(full=True)
    print(f"\nPage {page_num}: {len(images)} images")

    for img_idx, img_info in enumerate(images):
        xref = img_info[0]
        base_image = doc.extract_image(xref)
        image_bytes = base_image["image"]
        image_ext = base_image["ext"]
        width = base_image["width"]
        height = base_image["height"]

        # Only save images larger than 100x100 (skip tiny icons)
        if width > 100 and height > 100:
            img_count += 1
            filename = f"page{page_num:02d}_img{img_idx:02d}_{width}x{height}.{image_ext}"
            filepath = os.path.join(OUTPUT_DIR, filename)

            # Save the image
            with open(filepath, "wb") as f:
                f.write(image_bytes)

            print(f"  Saved: {filename} ({width}x{height})")
        else:
            print(f"  Skipped small image: {width}x{height}")

doc.close()
print(f"\nTotal images extracted: {img_count}")
