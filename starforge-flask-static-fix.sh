#!/usr/bin/env bash
# starforge-flask-static-fix.sh
# Recursively update all HTML/Jinja templates to use Flask's url_for static path

ROOT_DIR="${1:-.}"

# Update all src/href paths that are local images, scripts, css, etc
find "$ROOT_DIR" -type f -name '*.html' -o -name '*.j2' | while read -r file; do
  echo "Patching: $file"
  # Replace src="/static/xyz.png" or src="img/foo.png" etc
  sed -i -E '
    s#src="(\/?static\/([^"]+))"#src="{{ url_for('\''static'\'', filename='\2') }}"#g
    s#src="(img\/([^"]+))"#src="{{ url_for('\''static'\'', filename='\1') }}"#g
    s#href="(\/?static\/([^"]+))"#href="{{ url_for('\''static'\'', filename='\2') }}"#g
    s#href="(css\/([^"]+))"#href="{{ url_for('\''static'\'', filename='\1') }}"#g
  ' "$file"
done

echo "✅ Starforge Flask Static Fix: All template asset paths patched!"
