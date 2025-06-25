# ──────────────────────────────────────────────────────────────────────────────
# 1 ▶ Full tree + language/LOC overview  (cloc + exa)
# ──────────────────────────────────────────────────────────────────────────────
RDIR=reports/collector-$(date +%y%m%d-%H%M%S) && mkdir -p "$RDIR" && \
exa -Ta --git-ignore --color=never >"$RDIR/tree.txt" && \
npx --yes cloc . --md --by-file --quiet >>"$RDIR/tree.txt"

# ──────────────────────────────────────────────────────────────────────────────
# 2 ▶ Dependency snapshots  (Python + Node + system pkgs)
# ──────────────────────────────────────────────────────────────────────────────
pip freeze     >"$RDIR/requirements.lock" 2>/dev/null || true && \
npm ls --all   >"$RDIR/npm-tree.txt"      || true && \
dpkg -l | awk 'NR>5 {print $2,$3}' >"$RDIR/dpkg.txt" 2>/dev/null || true

# ──────────────────────────────────────────────────────────────────────────────
# 3 ▶ Static-analysis pack  (Flake-8, Bandit, ESLint, Stylelint)
# ──────────────────────────────────────────────────────────────────────────────
( flake8       >"$RDIR/flake8.txt"   2>&1 || true ) & \
( bandit -r .  >"$RDIR/bandit.txt"   2>&1 || true ) & \
( npx eslint . -f table >"$RDIR/eslint.txt" || true ) & \
( npx stylelint "**/*.css" >"$RDIR/stylelint.txt" || true ) ; wait

# ──────────────────────────────────────────────────────────────────────────────
# 4 ▶ Flask routes + SQLAlchemy schema dump
# ──────────────────────────────────────────────────────────────────────────────
python - <<'PY' >"$RDIR/flask_routes_and_models.txt"
from app import app, db
print("### Flask Routes ###")
with app.test_request_context():
    rules = sorted(app.url_map.iter_rules(), key=lambda r: r.rule)
    for r in rules:
        print(f"{r.methods:20}  {r.rule}")
print("\n### SQLAlchemy Tables ###")
for t in db.metadata.sorted_tables:
    print(t, "(" + ", ".join(c.name for c in t.columns) + ")")
PY

# ──────────────────────────────────────────────────────────────────────────────
# 5 ▶ Broken/static-asset finder  (looks for 404s & missing files)
# ──────────────────────────────────────────────────────────────────────────────
grep -RhoP "(?<=src=['\"])/?static/[^'\" >]+" app/templates | \
  sort -u >"$RDIR/static_refs.txt" && \
while read p; do [ -e ".$p" ] || echo "$p"; done <"$RDIR/static_refs.txt" \
  >"$RDIR/static_missing.txt"

# ──────────────────────────────────────────────────────────────────────────────
# 6 ▶ Live site crawl (Pa11y a11y + link check) – local port 5000 assumed
# ──────────────────────────────────────────────────────────────────────────────
pa11y http://127.0.0.1:5000/ --json >"$RDIR/pa11y.json" || true && \
npx linkinator "http://127.0.0.1:5000" --silent \
  --format csv >"$RDIR/linkinator.csv" || true

# ──────────────────────────────────────────────────────────────────────────────
# 7 ▶ Git intelligence snapshot  (quick histograms & last-change heat-map)
# ──────────────────────────────────────────────────────────────────────────────
git log --since="3 months ago" --numstat --pretty="%H" | \
  awk 'NF==3{adds+=$1;dels+=$2} END{print "Adds",adds,"Dels",dels}' \
  >"$RDIR/git_stats.txt" && \
git ls-files | xargs -I{} bash -c \
  'echo -n "{} "; git log -1 --format="%cr" -- {}; ' \
  | sort -k3,3 >"$RDIR/git_last_touch.txt"

# ──────────────────────────────────────────────────────────────────────────────
# 8 ▶ Global env + runtime context (dotenv + current venv/node/etc)
# ──────────────────────────────────────────────────────────────────────────────
( set -o posix ; set | grep -vE "^[a-zA-Z0-9_]+=.*\x00" ) >"$RDIR/env.txt" && \
python - <<'PY' >>"$RDIR/env.txt"
import platform, sys, flask, sqlalchemy, json, subprocess, os
print("\n### Versions ###")
print(json.dumps({
  "python": sys.version.split()[0],
  "flask": flask.__version__,
  "sqlalchemy": sqlalchemy.__version__,
  "node": subprocess.check_output(["node","-v"]).strip().decode(),
  "npm":  subprocess.check_output(["npm","-v"]).strip().decode(),
}, indent=2))
PY
