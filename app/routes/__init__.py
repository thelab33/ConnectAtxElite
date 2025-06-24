# app/routes/__init__.py

from .api import api_bp
from .main import main_bp
from .sms import sms_bp

__all__ = [
    "api_bp",
    "main_bp",
    "sms_bp",
]
