#!/usr/bin/env bash
set -euo pipefail
IFS=$'\n\t'

echo "⚒️  Starting CSS ForgeMaster patch..."

# Paths
CSS_BASE_DIR="./connect_atx_elite/static/css"
PARTIALS_DIR="$CSS_BASE_DIR/partials"
TIERS_DIR="$CSS_BASE_DIR/tiers_v2"
MAIN_CSS_FILE="$CSS_BASE_DIR/index.css"
TAILWIND_CONFIG="tailwind.config.js"

# Step 1: Clean old backup imports & consolidate
echo "🧹 Cleaning old backup partial CSS files..."
BACKUP_DIR="$PARTIALS_DIR/backup"
if [ -d "$BACKUP_DIR" ]; then
  echo "   → Moving backup partials to archive folder"
  mkdir -p "$CSS_BASE_DIR/backup_archive"
  mv "$BACKUP_DIR"/*.css "$CSS_BASE_DIR/backup_archive" || true
  rmdir "$BACKUP_DIR" || true
fi

# Step 2: Create main entry CSS file with @tailwind and imports
echo "📁 Creating consolidated main CSS entry: $MAIN_CSS_FILE"
cat > "$MAIN_CSS_FILE" << EOF
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Partial CSS imports */
@import './partials/hero.css';
@import './partials/tiers.css';
@import './partials/footer.css';
@import './partials/header.css';
@import './partials/cta.css';
@import './partials/testimonials.css';
@import './partials/donation_modal.css';

/* Tier variants */
@import './tiers_v2/basic.css';
@import './tiers_v2/premium.css';
@import './tiers_v2/vip.css';

/* Add additional partials as needed */
EOF

echo "✅ Main CSS entry created."

# Step 3: Ensure Tailwind config includes relevant content paths
echo "🔧 Validating $TAILWIND_CONFIG content paths..."
if ! grep -q "connect_atx_elite/static/css" "$TAILWIND_CONFIG"; then
  echo "   → Adding static CSS path to tailwind.config.js content array"
  # Simple sed insert (assumes content: [ ... ] block on one line)
  sed -i "/content:/ s/\(\[.*\)\]/\1, '.\/connect_atx_elite\/static\/css\/**\/*.css']/g" "$TAILWIND_CONFIG"
fi

echo "✅ Tailwind config paths validated."

# Step 4: Run Tailwind CSS build (production/minified)
echo "⚙️  Building Tailwind CSS..."
npx tailwindcss -i "$MAIN_CSS_FILE" -o "$CSS_BASE_DIR/tailwind.min.css" --minify

echo "✅ Tailwind CSS built at $CSS_BASE_DIR/tailwind.min.css"

# Step 5: Post-build cleanup & summary
echo "🧹 Cleanup & summary:"
echo " - Make sure your HTML references 'css/tailwind.min.css'"
echo " - Start replacing inline styles and legacy CSS with Tailwind utility classes"
echo " - Gradually migrate partial CSS rules to Tailwind @apply"

echo "🎉 CSS ForgeMaster patch complete!"
