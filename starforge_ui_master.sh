#!/usr/bin/env bash
# ------------------------------------------------------------
# Starforge “master-upscale”: externalises header CSS, adds
# colour palette, & compiles a fresh Tailwind bundle.
# ------------------------------------------------------------
set -euo pipefail
cd "$(dirname "$0")"

echo "▸ 1. Ensure Tailwind companion plugins are present…"
pnpm add -D @tailwindcss/forms @tailwindcss/typography @tailwindcss/aspect-ratio >/dev/null

echo "▸ 2. Move inline-CSS into globals.css (only first run)…"
patch --silent --forward app/static/globals.css <<'PATCH_EOC' || true
@@
 /* ───────────────────────────────────────
    Glass header & misc helpers (ex-inline)
    ───────────────────────────────────── */
 @layer utilities {
   /* Sticky “glass” header backdrop */
   .glass-header {
     @apply backdrop-blur bg-secondary/95 border-b border-primary/20 shadow-lg;
     backdrop-filter: blur(8px) saturate(1.35);
     transition: background .3s cubic-bezier(.4,0,.2,1),
                 box-shadow  .2s cubic-bezier(.4,0,.2,1);
   }

   /* gold ring + glow around logo */
   .shadow-gold-glow {
     box-shadow: 0 0 0 3px #facc1577, 0 2px 12px #0008;
   }

   /* slide-over for mobile nav */
   .mobile-nav {
     transform: translateX(-100%);
     transition: transform .33s cubic-bezier(.4,0,.2,1);
   }
   .mobile-nav.open { transform: translateX(0); }

   /* a11y utility that pairs with sr-only */
   .focus-not-sr-only:focus:not(:focus-visible) {
     position: static !important;
     width: auto !important;
     height: auto !important;
     margin: 0 !important;
     overflow: visible !important;
     clip: auto !important;
   }
 }
PATCH_EOC

echo "▸ 3. Strip the old <style> tag from the header template…"
patch --silent --forward app/templates/partials/header.html <<'PATCH_EOC' || true
@@
-<!-- ⬇︎  ONLY the handful of custom rules Tailwind can’t cover  -->
-<style>[^<]*?</style>
PATCH_EOC

echo "▸ 4. Extend Tailwind theme with secondary / foreground…"
patch --silent --forward tailwind.config.js <<'PATCH_EOC' || true
@@
   theme: {
     extend: {
+      colors: {
+        secondary:  '#18181b',   // glass backdrops
+        foreground: '#f4f4f5',   // default light text
+      },
     },
   },
PATCH_EOC

echo "▸ 5. Rebuild Tailwind bundle…"
npx tailwindcss \
  -c tailwind.config.js \
  -i app/static/globals.css \
  -o app/static/tailwind.min.css --minify

echo "▸ 6. Restarting Flask dev server (comment out if undesired)…"
pkill -f 'python run.py' 2>/dev/null || true
python run.py &>/dev/null & disown
echo "✅  All done – header styles are now managed by Tailwind!"
