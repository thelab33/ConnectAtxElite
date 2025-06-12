from flask import Flask

def create_app():
    app = Flask(__name__)
    app.config.from_mapping(
        SECRET_KEY="dev",
        RAISED_AMOUNT=0,
        GOAL_AMOUNT=10_000,
    )

    from .routes.api import bp as api_bp
    app.register_blueprint(api_bp)

    @app.get("/health")
    def _health():
        return {"status": "ok"}

    return app
