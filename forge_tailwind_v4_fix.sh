#!/usr/bin/env bash
set -euo pipefail
# forge_fix_tailwind_v4.sh
# -----------------------------------------------
# 1. Back-up globals.css
stamp=$(date +%s)
cp app/static/globals.css "app/static/globals.css.bak.$stamp"

echo "🔧  Moving every custom rule into the *utilities* layer…"

# 2. Delete any existing @layer blocks we added before,
#    then wrap ALL custom rules in a single @layer utilities{}
awk '
BEGIN{print "@layer utilities {"}
# skip the @layer wrappers we experimented with earlier:
!/^[[:space:]]*@layer (base|components|utilities)[[:space:]]*\{/{
  print
}
END{print "}"}
' "app/static/globals.css.bak.$stamp" > app/static/globals.css

echo "✅  globals.css rewritten → now every @apply runs *within* the utilities layer, \
so no layer() hint is needed."

# 3. (Optional) strip any lingering layer(utilities) hints we sprinkled around:
sed -E -i 's/[[:space:]]+layer\(utilities\)//g' app/static/globals.css

# 4. Re-build with whatever Tailwind CLI is on PATH
echo "🏗  Building fresh CSS bundle…"
tailwindcss -c tailwind.config.js \
            -i app/static/globals.css \
            -o app/static/tailwind.min.css \
            --minify

echo "🎉  Success!  Look for app/static/tailwind.min.css – no more unknown-utility errors."
