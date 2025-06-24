#!/bin/bash
echo "⚡ Cleaning environment..."
rm -rf node_modules package-lock.json

echo "📦 Installing clean deps..."
npm install
npm install --save-dev tailwindcss postcss autoprefixer postcss-cli

echo "🔎 Verifying Tailwind CLI..."
if [ ! -f node_modules/.bin/tailwindcss ]; then
  echo "❌ Tailwind CLI not found after install!"
  exit 1
fi

echo "🏗 Building Tailwind CSS..."
./node_modules/.bin/tailwindcss -c tailwind.config.js -i ./app/static/globals.css -o ./app/static/tailwind.min.css --minify

echo "✅ Build complete!"
