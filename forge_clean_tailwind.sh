#!/bin/bash
echo "⚡ Writing clean globals.css..."
cat <<'EOF' > ./app/static/globals.css
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
  a {
    @apply underline underline-offset-2 text-primary transition-colors;
  }
  body {
    @apply bg-zinc-950 text-white;
  }
}

@layer components {
  .btn {
    @apply bg-primary text-black font-semibold py-2 px-5 rounded-full shadow-lg transition;
  }
  .btn:hover {
    @apply bg-primary-hover;
  }
}

@layer utilities {
  .gold-glow {
    box-shadow: 0 0 36px 0 #facc15cc;
  }
}
EOF
echo "✅ globals.css cleaned."

echo "🏗 Rebuilding..."
npm run build
