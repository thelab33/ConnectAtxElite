#!/usr/bin/env bash
# nextjs_to_flask_detox.sh <file>
set -e
file="${1:-index.html}"

# Remove Next.js injected stuff
sed -i '
  /<script[^>]*type="module"/d;
  /<script[^>]*id="__NEXT_DATA__"/d;
  /<script[^>]*crossorigin/d;
  /<script[^>]*nonce=/d;
  /<script[^>]*src="\/_next/d;
  /<script[^>]*id="__NEXT_FONT/d;
  /<script[^>]*data-next-font/d;
  /<link[^>]*rel="preload"/d;
  /<link[^>]*rel="modulepreload"/d;
  /<link[^>]*rel="prefetch"/d;
  /<link[^>]*rel="stylesheet"[^>]*href="\/_next/d;
  /<meta[^>]*name="next-head-count"/d;
  /<meta[^>]*property="og:locale:alternate"/d;
  /data-next-hide-fouc/d;
  /<noscript[^>]*id="__next_css__/d;
  /<style[^>]*data-next-hide-fouc/d;
  /<div[^>]*id="__next"/d;
  /<!--\s*end\s*#__next\s*-->/d;
  /<style[^>]*data-nextjs-internal/d;
  /data-nextjs-scroll-focus-boundary/d;
  /__N_SSP/d;
  /__N_SSG/d;
' "$file"

# Fix static asset paths for Flask
sed -i "s#\(src\|href\)=\"/\([^\"]\+\.\(css\|js\|png\|jpg\|jpeg\|svg\|webp\|gif\|avif\|ico\|woff2\?\|ttf\|eot\|otf\)\)\"#\1=\"{{ url_for('static', filename='\2') }}\"#g" "$file"

echo "✅ Detox and pathfix complete for $file"

