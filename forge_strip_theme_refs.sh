#!/usr/bin/env bash
set -euo pipefail

echo "🔧  Removing theme() colour calls from globals.css …"
cp app/static/globals.css app/static/globals.css.bak.$(date +%s)

sed -E -i '
  s/theme\(colors\.primary-hover\)/#e0b511/g;
  s/theme\(colors\.primary\)/#facc15/g;
  s/theme\(colors\.text-light\)/#fffbe7/g;
  s/theme\(colors\.text-muted\)/rgba\(255,255,255,0\.7\)/g;
' app/static/globals.css

echo "🏗  Re-building with new config …"
tailwindcss -c tailwind.config.js \
           -i app/static/globals.css \
           -o app/static/tailwind.min.css \
           --minify

echo "✅  Build succeeded — theme() refs gone."
