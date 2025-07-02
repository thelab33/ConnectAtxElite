import os
import re

# Adjust to your project root and static folder path
PROJECT_ROOT = os.path.abspath(os.path.dirname(__file__))
TEMPLATE_DIR = os.path.join(PROJECT_ROOT, "app", "templates")
STATIC_DIR = os.path.join(PROJECT_ROOT, "app", "static")

# Regex to find static file references in templates
STATIC_FILE_REGEX = re.compile(
    r"""url_for\(\s*['"]static['"]\s*,\s*filename\s*=\s*['"]([^'"]+)['"]\s*\)"""  # Flask url_for static
    + r"|src=[\"'](/?static/[^\"']+)[\"']"  # src="/static/..."
    + r"|href=[\"'](/?static/[^\"']+)[\"']"  # href="/static/..."
)

# File extensions by type
CSS_EXTS = {".css"}
JS_EXTS = {".js"}
IMG_EXTS = {".png", ".jpg", ".jpeg", ".gif", ".svg", ".webp", ".ico"}
VIDEO_EXTS = {".mp4", ".webm", ".ogg"}

def find_static_files_in_file(filepath):
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()
    matches = STATIC_FILE_REGEX.findall(content)
    # Flatten matches from regex groups, filter empty strings
    files = []
    for m in matches:
        for part in m:
            if part:
                # Strip leading slash if any
                fpath = part.lstrip("/")
                files.append(fpath)
    return list(set(files))  # Unique

def gather_all_static_references(template_dir):
    static_files = set()
    for root, _, files in os.walk(template_dir):
        for file in files:
            if file.endswith((".html", ".htm", ".jinja", ".jinja2")):
                path = os.path.join(root, file)
                refs = find_static_files_in_file(path)
                static_files.update(refs)
    return static_files

def check_static_files(static_dir, static_files):
    missing = []
    existing = []
    for sf in static_files:
        full_path = os.path.join(static_dir, sf)
        if not os.path.isfile(full_path):
            missing.append(sf)
        else:
            existing.append((sf, os.path.getsize(full_path)))
    return missing, existing

def categorize_files(files):
    css = []
    js = []
    img = []
    video = []
    other = []
    for f in files:
        ext = os.path.splitext(f[0])[1].lower()
        if ext in CSS_EXTS:
            css.append(f)
        elif ext in JS_EXTS:
            js.append(f)
        elif ext in IMG_EXTS:
            img.append(f)
        elif ext in VIDEO_EXTS:
            video.append(f)
        else:
            other.append(f)
    return css, js, img, video, other

def human_readable_size(size):
    for unit in ['B','KB','MB','GB']:
        if size < 1024:
            return f"{size:.1f}{unit}"
        size /= 1024
    return f"{size:.1f}TB"

def main():
    print("Scanning templates for static assets...")
    static_refs = gather_all_static_references(TEMPLATE_DIR)
    print(f"Found {len(static_refs)} unique static file references.\n")

    missing, existing = check_static_files(STATIC_DIR, static_refs)
    print(f"Missing static files: {len(missing)}")
    for m in missing:
        print(f"  - {m}")
    print()

    print(f"Existing static files: {len(existing)}")
    css, js, img, video, other = categorize_files(existing)

    def print_category(name, files):
        print(f"{name} ({len(files)} files):")
        for f, size in sorted(files):
            print(f"  - {f} [{human_readable_size(size)}]")
        print()

    print_category("CSS", css)
    print_category("JavaScript", js)
    print_category("Images", img)
    print_category("Videos", video)
    if other:
        print_category("Other files", other)

if __name__ == "__main__":
    main()
