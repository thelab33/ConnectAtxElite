import os
from PIL import Image

# Folder to scan and fix
STATIC_DIR = "app/static"

# Missing files found by your previous script
missing_files = [
    "images/social-preview.png",
    "apple-touch-icon.png",
]

def create_blank_png(path, size=(100, 100), color=(255, 255, 255, 0)):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    img = Image.new("RGBA", size, color)
    img.save(path)
    print(f"Created placeholder: {path}")

def scaffold_assets():
    for file_rel in missing_files:
        abs_path = os.path.join(STATIC_DIR, file_rel)
        if not os.path.isfile(abs_path):
            if file_rel.endswith(".png"):
                # Create a transparent 100x100 PNG placeholder
                create_blank_png(abs_path)
            else:
                print(f"Unhandled missing file type: {file_rel}")
        else:
            print(f"Already exists: {abs_path}")

if __name__ == "__main__":
    scaffold_assets()
