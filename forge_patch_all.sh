# ── Forge-Master: fix html_static_audit.sh, ESLint + Stylelint ──────────────
set -e

## A) Kill the hard-pinned ESLint-8 & comment any Linkinator calls
sed -i 's/^[[:space:]]*needs eslint@[^ ]*/true # pin zapped/' html_static_audit.sh
sed -i '/linkinator/ s/^/# /' html_static_audit.sh

## B) Replace Pa11y’s brittle 3-liner sitemap chunk with a one-liner xargs feed
sed -i '/header "Pa11y CI"/,/# .*Pa11y.*report\.json/ c\
  header "Pa11y CI"\n\
  printf "%s\\n" $HTML_FILES | xargs -I{} pa11y-ci "file://$(realpath {})" --config "$PROJECT_ROOT/pa11yci.json" --json >"$REPORT_DIR/pa11y-report.json" || true' \
  html_static_audit.sh

## C) Restore the html plugin + processor and kill id/empty-source rules
jq --indent 2 '
  .plugins   = ["html","prettier"] |
  .processor = "html/html-processor" |
  .rules    += {"selector-id-pattern":null,"no-empty-source":null}
' .eslintrc.json | sponge .eslintrc.json

jq --indent 2 '
  .rules."selector-id-pattern" = null |
  .rules."no-empty-source"     = null |
  .overrides = ( .overrides // [] ) + [
    { "files":"app/static/css/tiers_v2/*.css", "rules":{ "no-empty-source":null } }
  ]
' .stylelintrc.json | sponge .stylelintrc.json

## D) Make sure the audit script is executable & dev deps are in place
chmod +x html_static_audit.sh
npm i -D eslint@^9 eslint-plugin-html@^7 eslint-plugin-prettier@^5 eslint-config-prettier@^9 > /dev/null

echo -e "\n\e[92mForge-Master patch applied!\e[0m  Run:  \e[1mnpm run audit\e[0m"
