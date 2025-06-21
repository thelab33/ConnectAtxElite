#!/usr/bin/env bash
set -euo pipefail

PKG="connect_atx_elite"
INIT_FILE="$PKG/__init__.py"

if [[ -f "$INIT_FILE" ]]; then
  echo "✅ $INIT_FILE already exists – nothing to patch."
  exit 0
fi

echo "🛠  Creating $INIT_FILE …"

cat > "$INIT_FILE" <<'PY'
from flask import Flask
from .routes import bp as main_bp          # assumes you already have routes/bp

def create_app():
    app = Flask(__name__)

    # ---- default config ---------------------------------------------------
    app.config.from_mapping(
        SECRET_KEY="dev",          # change for prod
        RAISED_AMOUNT=0,
        GOAL_AMOUNT=10_000,
    )
    # -----------------------------------------------------------------------

    app.register_blueprint(main_bp)

    @app.get("/health")
    def _health():
        return {"status": "ok"}

    return app
PY

echo "📄  $INIT_FILE written."
echo "------------------------------------------------------"
echo "Next steps:"
echo "  export FLASK_APP=${PKG}:create_app"
echo "  flask --debug run -p 5001"
echo "------------------------------------------------------"
