#!/bin/bash
echo "🔧 Patching globals.css..."
cat << 'EOF' > ./app/static/globals.css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  h1 {
    @apply font-bold tracking-tight text-4xl text-primary;
  }
  h2 {
    @apply font-bold tracking-tight text-3xl text-primary;
  }
  h3 {
    @apply font-bold tracking-tight text-2xl text-primary;
  }
}
EOF
echo "✅ globals.css patched."
echo "🏗️ Rebuilding..."
npm run build
