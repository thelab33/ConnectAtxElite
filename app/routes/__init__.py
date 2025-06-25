"""
Blueprint aggregator for app.routes
Ensures all blueprints are importable via app.routes.
"""

from .api import api_bp
from .main import main_bp
from .sms import sms_bp

__all__ = [
    "api_bp",
    "main_bp",
    "sms_bp",
]

