#!/usr/bin/env bash
set -euo pipefail

css="app/static/globals.css"
out="app/static/tailwind.min.css"

echo "🔨  Starforge: patching Tailwind @apply statements"
[[ -f "$css" ]] || { echo "❌ $css not found"; exit 1; }

# 1️⃣  Backup
backup="${css}.bak.$(date +%s)"
cp "$css" "$backup"
echo "📦  Backup created → $backup"

# 2️⃣  Add layer(utilities) to @apply lines that still need it
tmp="$(mktemp)"
#  • only touch lines that contain '@apply' AND do NOT yet have 'layer('
perl -pe '
  if(/@apply/ && !/layer\(/){
     s/@apply\s+([^;]+);/@apply $1 layer(utilities);/;
  }
' "$css" > "$tmp"
mv "$tmp" "$css"
echo "✅  Patched $css"

# 3️⃣  Clean previous build
rm -f "$out"

# 4️⃣  Re-build with the global Tailwind CLI (installed via `npm i -g tailwindcss`)
echo "🏗️   Building CSS → $out"
tailwindcss -c tailwind.config.js \
            -i "$css" \
            -o "$out" \
            --minify

size="$(du -h "$out" | cut -f1)"
echo "🎉  Build succeeded — $out ($size)"

echo "🚀  Restart Flask (ctrl-c then \`python run.py\`) and your site will pick up the new CSS."
