"""
Initialize and expose all Flask blueprints for the Connect ATX Elite app.

Usage in app/__init__.py:
    from app.routes import api_bp, main_bp, sms_bp
    app.register_blueprint(main_bp)
    app.register_blueprint(api_bp)
    app.register_blueprint(sms_bp)
"""

from app.routes.api import bp as api_bp
from app.routes.main import bp as main_bp
from app.routes.sms import bp as sms_bp

__all__ = ["api_bp", "main_bp", "sms_bp"]

