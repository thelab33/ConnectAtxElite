import os
from pathlib import Path
from dotenv import load_dotenv
from flask import Flask, jsonify, render_template
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_socketio import SocketIO
from flask_login import current_user

load_dotenv()

db = SQLAlchemy()
migrate = Migrate()
socketio = SocketIO(cors_allowed_origins="*")

def create_app(config_object=None) -> Flask:
    app = Flask(
        __name__,
        static_folder=os.path.abspath("app/static"),
        template_folder=os.path.abspath("app/templates"),
        instance_relative_config=True,
    )
    os.makedirs(app.instance_path, exist_ok=True)

    if config_object:
        app.config.from_object(config_object)
    else:
        app.config.from_mapping(
            SECRET_KEY=os.getenv("SECRET_KEY", "dev_secret"),
            SQLALCHEMY_DATABASE_URI=os.getenv(
                "DATABASE_URL",
                f"sqlite:///{os.path.join(app.instance_path, 'app.db')}"
            ),
            SQLALCHEMY_TRACK_MODIFICATIONS=False,
            DEFAULT_DONATION=int(os.getenv("DEFAULT_DONATION", 25)),
            RAISED_AMOUNT=int(os.getenv("RAISED_AMOUNT", 0)),
            GOAL_AMOUNT=int(os.getenv("GOAL_AMOUNT", 10000)),
            DEADLINE=os.getenv("DEADLINE", "2024-12-31T23:59:59Z"),
            STRIPE_SECRET_KEY=os.getenv("STRIPE_SECRET_KEY"),
            STRIPE_PUBLISHABLE_KEY=os.getenv("STRIPE_PUBLISHABLE_KEY"),
            STRIPE_WEBHOOK_SECRET=os.getenv("STRIPE_WEBHOOK_SECRET"),
            BASE_URL=os.getenv("BASE_URL", "http://localhost:8000"),
            DONATION_LINK=os.getenv("DONATION_LINK"),
            MAIL_SERVER=os.getenv("MAIL_SERVER", "smtp.example.com"),
            MAIL_PORT=int(os.getenv("MAIL_PORT", 587)),
            MAIL_USE_TLS=os.getenv("MAIL_USE_TLS", "true").lower() in ("true", "1", "yes"),
            MAIL_USERNAME=os.getenv("MAIL_USERNAME"),
            MAIL_PASSWORD=os.getenv("MAIL_PASSWORD"),
            MAIL_DEFAULT_SENDER=os.getenv("MAIL_DEFAULT_SENDER", "no-reply@example.com"),
        )
        extra_config = os.getenv("FLASK_EXTRA_CONFIG")
        if extra_config:
            app.config.from_pyfile(extra_config, silent=True)

    db.init_app(app)
    migrate.init_app(app, db)
    socketio.init_app(app)

    from app.routes.main import main_bp
    from app.routes.api import api_bp
    from app.routes.sms import sms_bp
    app.register_blueprint(main_bp)
    app.register_blueprint(api_bp, url_prefix="/api")
    app.register_blueprint(sms_bp, url_prefix="/sms")

    @app.errorhandler(404)
    def not_found(e):
        return jsonify(error="Not found"), 404

    @app.errorhandler(500)
    def server_error(e):
        return jsonify(error="Server error"), 500

    @app.route("/offline.html")
    def offline():
        return render_template("offline.html"), 200

    @app.shell_context_processor
    def make_shell_context():
        return {"db": db, "socketio": socketio}

    @app.context_processor
    def inject_user():
        return dict(current_user=current_user)

    return app

