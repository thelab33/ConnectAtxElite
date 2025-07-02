import os
import re

# Config: Adjust paths to your project structure here
TEMPLATE_PATH = "app/templates/base.html"  # Main base template file
STATIC_DIR = "app/static"                  # Static files root

def extract_files(pattern, text):
    # Extracts href/src urls ending with .css or .js
    return re.findall(pattern, text)

def check_files_exist(filepaths):
    missing = []
    for f in filepaths:
        full_path = os.path.join(STATIC_DIR, f)
        if not os.path.isfile(full_path):
            missing.append(f)
    return missing

def main():
    if not os.path.isfile(TEMPLATE_PATH):
        print(f"Template file not found: {TEMPLATE_PATH}")
        return

    with open(TEMPLATE_PATH, 'r', encoding='utf-8') as file:
        content = file.read()

    # Find CSS hrefs like href="static/css/style.css"
    css_files = extract_files(r'href="([^"]+\.css)"', content)
    # Remove query strings or hashes if any
    css_files = [re.sub(r'\?.*$', '', f) for f in css_files]

    # Find JS src like src="static/js/app.js"
    js_files = extract_files(r'src="([^"]+\.js)"', content)
    js_files = [re.sub(r'\?.*$', '', f) for f in js_files]

    print("Checking CSS files referenced in template...")
    missing_css = check_files_exist(css_files)
    if missing_css:
        print("Missing CSS files:")
        for f in missing_css:
            print(" -", f)
    else:
        print("All CSS files present.")

    print("\nChecking JS files referenced in template...")
    missing_js = check_files_exist(js_files)
    if missing_js:
        print("Missing JS files:")
        for f in missing_js:
            print(" -", f)
    else:
        print("All JS files present.")

if __name__ == "__main__":
    main()
