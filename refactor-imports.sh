#!/bin/bash

echo "🚀 Starforge Flask Refactor: Begin"

# 1. Replace 'from extensions' → 'from app'
find ./app -type f -name "*.py" -exec sed -i 's/from extensions/from app/g' {} +

# 2. Replace 'ConnectAtxEliteFlask' → 'app'
find ./app -type f -name "*.py" -exec sed -i 's/from ConnectAtxEliteFlask/from app/g' {} +

# 3. Show lines that still have non-absolute imports
echo "🔍 Scanning for non-absolute imports (relative/sibling)..."
grep -rn --include="*.py" -E "^from [^a\.]" app/

# 4. Warn about root __init__.py if it exists
if [ -f "./__init__.py" ]; then
    echo "⚠️  Warning: Found top-level __init__.py — consider deleting it to avoid circular imports"
    read -p "❓ Delete root __init__.py now? [y/N] " confirm
    if [[ $confirm == [yY] ]]; then
        rm ./__init__.py
        echo "✅ Deleted root __init__.py"
    else
        echo "⏭️  Skipped deleting __init__.py"
    fi
else
    echo "✅ No top-level __init__.py found — good!"
fi

echo "✅ All import fixes applied. You're ready for prod!"
