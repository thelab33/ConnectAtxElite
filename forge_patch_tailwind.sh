#!/bin/bash

echo "🛠️ Patching globals.css..."
cat << 'EOF' > ./app/static/globals.css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  h1 {
    @apply font-bold text-4xl tracking-tight text-primary;
  }
  h2 {
    @apply font-bold text-3xl tracking-tight text-primary;
  }
  h3 {
    @apply font-bold text-2xl tracking-tight text-primary;
  }
}

@layer components {
  .btn {
    @apply bg-yellow-400 text-black font-semibold py-2 px-4 rounded-full shadow transition;
  }
  .btn:hover {
    @apply bg-yellow-500;
  }
}
EOF

echo "✅ globals.css patched."

echo "🧹 Cleaning old build..."
rm -f ./app/static/tailwind.min.css

echo "🏗️ Rebuilding with Tailwind CLI..."
tailwindcss -c tailwind.config.js -i ./app/static/globals.css -o ./app/static/tailwind.min.css --minify

if [ $? -eq 0 ]; then
  echo "🎉 Build successful!"
else
  echo "❌ Build failed. Check output above."
fi
