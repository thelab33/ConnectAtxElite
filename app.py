# Connect ATX Elite – Flask application factory
# Location: ConnectAtxEliteFlask/app.py

from __future__ import annotations
import os
import logging
from datetime import datetime
from flask import Flask, g
from flask_sqlalchemy import SQLAlchemy
from flask_socketio import SocketIO
from dotenv import load_dotenv

# ── Extensions ────────────────────────────────────────────────────────────────
db: SQLAlchemy     = SQLAlchemy()
socketio: SocketIO = SocketIO(cors_allowed_origins="*")


def _inject_now() -> dict[str, datetime]:
    """Expose `now()` helper inside Jinja templates."""
    return {"now": datetime.utcnow}


def create_app() -> Flask:
    """Create and configure the Connect ATX Elite Flask application."""
    # — Load environment variables from .env
    load_dotenv()

    # — Instantiate app
    app = Flask(
        __name__,
        static_folder="static",
        template_folder="templates",
    )

    # — Basic logging
    logging.basicConfig(level=logging.INFO)
    app.logger.info("⚙️  Initializing Connect ATX Elite Flask App")

    # ── Core config ───────────────────────────────────────────────────
    app.config.update(
        SECRET_KEY=os.getenv("SECRET_KEY", "dev-key"),
        SQLALCHEMY_DATABASE_URI=os.getenv("DATABASE_URL", "sqlite:///site.db"),
        SQLALCHEMY_TRACK_MODIFICATIONS=False,

        # ←— your new fundraising totals, override in env or at runtime
        RAISED_AMOUNT=int(os.getenv("RAISED_AMOUNT", 8250)),
        GOAL_AMOUNT=int(os.getenv("GOAL_AMOUNT", 10000)),
    )

    # ── Initialize extensions ────────────────────────────────────────
    db.init_app(app)
    socketio.init_app(app)

    # ── Template helpers ────────────────────────────────────────────
    app.context_processor(_inject_now)

    # ── Blueprints ──────────────────────────────────────────────────
    # lazy‐import so `db` and app context exist first
    from ConnectAtxEliteFlask.routes.main import bp as main_bp
    from ConnectAtxEliteFlask.routes.api  import bp as api_bp
    from ConnectAtxEliteFlask.routes.sms  import bp as sms_bp

    app.register_blueprint(main_bp)
    app.register_blueprint(api_bp,  url_prefix="/api")
    app.register_blueprint(sms_bp,  url_prefix="/sms")

    app.logger.info("🔌  Registered blueprints: main, api, sms")

    return app


if __name__ == "__main__":  # pragma: no cover
    # Use SocketIO if you need websockets; falls back to plain Flask otherwise
    socketio.run(
        create_app(),
        host="0.0.0.0",
        port=int(os.getenv("PORT", 8000)),
        debug=os.getenv("FLASK_DEBUG", "0") == "1",
    )

