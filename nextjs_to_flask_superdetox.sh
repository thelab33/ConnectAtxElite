#!/usr/bin/env bash
# nextjs_to_flask_superdetox.sh <file>
set -e
file="${1:-index.html}"

# 1. Remove Next.js/React/SSR injected stuff
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

# 2. Fix static asset paths for Flask
sed -i "s#\(src\|href\)=\"/\([^\"]\+\.\(css\|js\|png\|jpg\|jpeg\|svg\|webp\|gif\|avif\|ico\|woff2\?\|ttf\|eot\|otf\)\)\"#\1=\"{{ url_for('static', filename='\2') }}\"#g" "$file"

# 3. React/JSX-ism cleanup
sed -i '
  s/className="/class="/g;
  s/htmlFor="/for="/g;
  s/tabIndex=/tabindex=/g;
  s/data-nextjs-[a-zA-Z0-9\-]\+=\"[^\"]*\"//g;
  s/data-next-[a-zA-Z0-9\-]\+=\"[^\"]*\"//g;
  s/dangerouslySetInnerHTML={{.*}}//g;
' "$file"

# 4. Remove onClick, onChange, etc. (JSX event handlers)
sed -i -E 's/on[A-Z][a-zA-Z]*=\{[^}]*\}//g' "$file"

# 5. Convert React comments {/* ... */} to HTML comments
perl -i -pe 's/\{\s*\/\*\s*(.*?)\s*\*\/\s*\}/<!-- $1 -->/g' "$file"

# 6. Remove or warn about inline JS style blocks
if grep -q 'style={{' "$file"; then
  echo "⚠️  Found inline React style={{ ... }} blocks in $file. Please manually convert them to HTML style=\"\"."
  sed -i 's/style={{[^}]*}}//g' "$file"
fi

# 7. Remove any leftover empty attributes from above
sed -i 's/  \+\/>/ \/>/g' "$file"
sed -i 's/ \+>/\>/g' "$file"

echo "✅ Superdetox and JSX-to-HTML conversion complete for $file"

