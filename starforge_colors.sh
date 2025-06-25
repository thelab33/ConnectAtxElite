#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"    # run from repo root

echo "› Ensuring custom palette exists in tailwind.config.js …"
patch --silent --forward tailwind.config.js <<'PATCH_EOC' || true
@@
 module.exports = {
   theme: {
     extend: {
+      /* ---------- Custom palette used across the UI ---------- */
+      colors: {
+        /* near-black glass backdrop used for sticky header / slide-over */
+        secondary:  '#18181b',
+        /* default light text when sitting on secondary */
+        foreground: '#f4f4f5',
+      },
     },
   },
   plugins: [
PATCH_EOC

echo "› Adding subtle saturation boost to glass header …"
patch --silent --forward app/static/globals.css <<'PATCH_EOC' || true
@@
 header.sticky {
   backdrop-filter: blur(8px);
+  /* make blurred hero colours pop slightly */
+  backdrop-filter: blur(8px) saturate(1.4);
@@
 }
PATCH_EOC

echo "› Re-building Tailwind stylesheet …"
npx tailwindcss -c tailwind.config.js                       \
  -i app/static/globals.css                                 \
  -o app/static/tailwind.min.css --minify

echo "✅  Colour config done!  Restart Flask to pick up the fresh CSS."
