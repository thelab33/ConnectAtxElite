#!/usr/bin/env bash
# ░▒▓█ STARFORGE TAILWIND CSS INJECTOR █▓▒░
# Injects @tailwind directives at the top of your CSS if missing, then rebuilds CSS.

set -e

CSS="${1:-app/static/globals.css}"
OUT="${2:-app/static/tailwind.min.css}"

echo "🔎 Checking $CSS for Tailwind directives..."

if ! grep -q '@tailwind base;' "$CSS"; then
  echo "🚀 Injecting Tailwind base directives at the top of $CSS..."
  TMP=$(mktemp)
  cat <<'EOF' > "$TMP"
@tailwind base;
@tailwind components;
@tailwind utilities;

EOF
  cat "$CSS" >> "$TMP"
  mv "$TMP" "$CSS"
else
  echo "✅ Tailwind directives already present."
fi

echo "🔨 Building Tailwind CSS..."
tailwindcss -i "$CSS" -o "$OUT" --minify

echo "✨ Starforge Tailwind CSS Injector: Success!"
ls -lh "$OUT"
