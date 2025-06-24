#!/usr/bin/env bash
# css_static_audit.sh — CSS audit-lint-bundle helper (Stylelint 16 line)
set -euo pipefail

# ── Vars ──────────────────────────────────────────────────────────────────
PROJECT_ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
TIMESTAMP="$(date +%Y%m%d-%H%M%S)"
MODE="${1:-full}"
REPORT_DIR="$PROJECT_ROOT/reports/$TIMESTAMP"
mkdir -p "$REPORT_DIR"

header() { printf "\n\033[1;36m▶ %s\033[0m\n" "$*"; }
ensure() { npx --yes --no --package "$1" -c "echo ok" >/dev/null 2>&1 \
           || npm i -D "$1"; }

# ── Dependency bootstrap (Stylelint 16 stack) ────────────────────────────
header "Bootstrapping deps"
ensure stylelint@^16
ensure stylelint-config-standard@^35
ensure stylelint-config-tailwindcss
ensure stylelint-order@^7
ensure prettier@^3
ensure cssstats-cli
ensure lightningcss-cli
ensure cssnano-cli
ensure @fullhuman/postcss-purgecss

# ── .stylelintrc root — ignore generated bundles ────────────────────────
cat >"$PROJECT_ROOT/.stylelintrc.json" <<'JSON'
{
  "extends": [
    "stylelint-config-standard",
    "stylelint-config-tailwindcss"
  ],
  "plugins": ["stylelint-order"],
  "rules": {
    "order/properties-alphabetical-order": null
  },
  "ignoreFiles": ["**/tailwind*.css", "**/*.min.css"]
}
JSON

# ── Project-specific paths ───────────────────────────────────────────────
STYLE_DIR="$PROJECT_ROOT/app/static/css"
TEMPLATE_DIR="$PROJECT_ROOT/app/templates"

SRC_CSS=$(find "$STYLE_DIR" -name "*.css" ! -name "tailwind*.css" \
          ! -name "*.min.css")
TEMPLATE_GLOBS=("$TEMPLATE_DIR/**/*.html" "$TEMPLATE_DIR/**/*.jinja")

# ── Functions ────────────────────────────────────────────────────────────
run_lint() {
  header "Stylelint + Prettier"
  npx stylelint --fix $SRC_CSS || true
  npx prettier  --write $SRC_CSS || true
}

run_audit() {
  header "css-stats JSON"
  for f in $SRC_CSS; do
    npx cssstats-cli "$f" --json >"$REPORT_DIR/$(basename "${f%.css}").json" || true
  done

  header "PurgeCSS (unused selectors)"
  npx purgecss --css $SRC_CSS --content ${TEMPLATE_GLOBS[*]} \
               --output "$REPORT_DIR/unused" --rejected \
               --safelist ":global,html,body,#__next" || true

  header "Minify bundles"
  for f in $SRC_CSS; do
    out="$REPORT_DIR/$(basename "${f%.css}.min.css")"
    if npx --yes lightningcss-cli -v >/dev/null 2>&1; then
      npx lightningcss-cli "$f" --minify -o "$out" || true
    else
      npx cssnano-cli "$f" "$out" || true
    fi
  done
}

run_ci() { run_lint; git diff --quiet || { echo "❌ CSS issues"; exit 1; }; }

case "$MODE" in
  lint)  run_lint ;;
  audit) run_lint; run_audit ;;
  fix)   run_lint; run_audit ;;
  ci)    run_ci ;;
  full)  run_lint; run_audit ;;
  *)     echo "usage: $0 [lint|audit|fix|ci|full]"; exit 1 ;;
esac

header "Reports ➜ $REPORT_DIR"
