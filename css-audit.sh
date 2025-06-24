#!/bin/bash
# css-audit.sh — Elite CSS Usage Audit & Refactor for Flask/Django/Next.js projects

set -euo pipefail

# ----------- CONFIG — adjust these for your stack -----------
TEMPLATE_DIR="templates"         # Directory containing your HTML templates
CSS_DIR="app/static/css"         # Directory containing your CSS files
MAIN_CSS="$CSS_DIR/globals.css"  # Main CSS file
PARTIALS_CSS="$CSS_DIR/partials" # Section/partial CSS (optional)

# ----------- 1. Find classes used in templates -----------
echo "🔍 Finding all CSS classes used in HTML templates..."
grep -Eo 'class=["'"'"'][^"'"'"']+["'"'"']' $TEMPLATE_DIR/**/*.html | \
  grep -oE '[a-zA-Z0-9\-\_:]+' | \
  sort | uniq > used-classes.txt
echo "→ Saved to used-classes.txt"

# ----------- 2. Find classes defined in CSS -----------
echo "🔎 Finding all classes defined in CSS..."
grep -hEo '\.([a-zA-Z0-9\-\_:]+)' $MAIN_CSS $PARTIALS_CSS/*.css 2>/dev/null | \
  sed 's/^\.//' | sort | uniq > defined-classes.txt
echo "→ Saved to defined-classes.txt"

# ----------- 3. Find unused classes (dead CSS) -----------
comm -23 defined-classes.txt used-classes.txt > unused-classes.txt
echo -e "\n⚠️  UNUSED CSS CLASSES (may delete safely):"
cat unused-classes.txt || echo "(None found)"

# ----------- 4. Find missing classes (not styled!) -----------
comm -13 defined-classes.txt used-classes.txt > missing-classes.txt
echo -e "\n❌ CLASSES USED IN TEMPLATES BUT NOT DEFINED IN CSS:"
cat missing-classes.txt || echo "(None found)"

# ----------- 5. Lint & prettify CSS -----------
if command -v npx &>/dev/null; then
  echo -e "\n🧹 Linting and formatting CSS with Stylelint and Prettier..."
  npx stylelint "$CSS_DIR/**/*.css" --fix || true
  npx prettier --write "$CSS_DIR/**/*.css" || true
else
  echo -e "\n⚠️  npx not found. Skipping lint/format. Install Node.js for advanced linting."
fi

# ----------- 6. Directory structure suggestion -----------
cat <<EOF

📁 Recommended Static Directory Layout:
app/static/
├── css/
│   ├── globals.css
│   ├── partials/
│   │   ├── hero.css
│   │   ├── cta.css
│   │   └── ...
├── js/
├── images/
├── svg/
├── favicon.ico
└── logo.png

Move files for clarity and section-based CSS. Atomic CSS = fewer overlaps!
EOF

echo -e "\n✅ CSS AUDIT COMPLETE! See 'unused-classes.txt' and 'missing-classes.txt' for action."
