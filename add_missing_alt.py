import os
from bs4 import BeautifulSoup

# Directory containing partial HTML templates
PARTIALS_DIR = 'app/templates/partials'

# Default alt text to insert if missing
DEFAULT_ALT_TEXT = "Decorative image"

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    soup = BeautifulSoup(content, 'html.parser')
    imgs = soup.find_all('img')

    changed = False
    for img in imgs:
        # If no alt attribute or empty alt
        if not img.has_attr('alt') or not img['alt'].strip():
            # Try to infer alt from filename
            src = img.get('src', '')
            if src:
                inferred_alt = os.path.basename(src).replace('-', ' ').replace('_', ' ').split('.')[0]
                alt_text = inferred_alt.capitalize() + " image"
            else:
                alt_text = DEFAULT_ALT_TEXT

            img['alt'] = alt_text
            changed = True
            print(f'Added alt="{alt_text}" to {filepath}')

    if changed:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(str(soup))

def main():
    for root, _, files in os.walk(PARTIALS_DIR):
        for file in files:
            if file.endswith('.html'):
                process_file(os.path.join(root, file))

if __name__ == '__main__':
    main()
