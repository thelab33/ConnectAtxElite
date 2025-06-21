from flask import Flask
from flask_socketio import SocketIO
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()
socketio = SocketIO()


def create_app():
    app = Flask(__name__)
    app.config.from_pyfile("config.py", silent=True)

    db.init_app(app)
    socketio.init_app(app)

    from app.routes import api_bp, main_bp, sms_bp

    app.register_blueprint(main_bp)
    app.register_blueprint(api_bp)
    app.register_blueprint(sms_bp)

    # Optional: error handlers
    @app.errorhandler(404)
    def not_found(e):
        return {"error": "Not found"}, 404

    @app.errorhandler(500)
    def server_error(e):
        return {"error": "Server error"}, 500

    # Optional: shell context for flask shell
    @app.shell_context_processor
    def make_shell_context():
        return dict(db=db)

    return app

