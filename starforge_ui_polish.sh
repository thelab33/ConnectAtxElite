# ─────────────────── 2. globals.css tweaks ──────────────────
echo "› Patching app/static/globals.css"

patch --silent -p0 <<'EOF'
--- a/app/static/globals.css
+++ b/app/static/globals.css
@@
 @layer utilities {
   .gold-glow { box-shadow: 0 0 36px 0 #facc15cc }
+  /* Frosted glass used on hero */
+  .hero-glass { @apply bg-black/45 backdrop-blur-md rounded-xl }
 }
+
+# Scroll-snap for every main section
+html       { scroll-snap-type: y proximity }
+section[id]{ scroll-snap-align: start; scroll-margin-top: 6rem }
+
+# Donor ticker keyframes
+@keyframes ticker {
+  from { transform: translateX(0) }
+  to   { transform: translateX(-50%) }
+}
EOF
