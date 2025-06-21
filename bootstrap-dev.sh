#!/usr/bin/env bash
set -euo pipefail

echo "🚀 Starting Connect ATX Elite Dev Environment Bootstrap..."

# 1. Install npm dependencies
echo "📦 Installing npm dependencies..."
npm install

# 2. Clean previous builds
echo "🧹 Cleaning previous build outputs..."
npm run clean || true

# 3. Build CSS & JS once
echo "⚙️ Building Tailwind CSS & JS bundle..."
npm run build

# 4. Confirm postcss config exists
if [[ ! -f postcss.config.js ]]; then
  echo "⚠️ Warning: postcss.config.js not found. Please add it for TailwindCSS."
fi

echo "✅ Bootstrap complete! Run 'npm run dev' to start development servers."
