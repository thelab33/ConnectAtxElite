import os
from pathlib import Path
from datetime import timedelta
from dotenv import load_dotenv

# Load environment variables from .env if present (useful for local dev)
load_dotenv()

# Base directory (project root)
BASEDIR = Path(__file__).parent.resolve().parent

def env_bool(key, default=False):
    """Parse environment variable as boolean."""
    val = os.getenv(key, str(default))
    return val.lower() in ("true", "1", "yes", "on")

def env_int(key, default=0):
    """Parse environment variable as integer."""
    try:
        return int(os.getenv(key, default))
    except (TypeError, ValueError):
        return default

class Config:
    """Base config—shared by all environments."""
    # Security
    SECRET_KEY = os.getenv("SECRET_KEY", "change-me-in-production")
    SESSION_COOKIE_SECURE = env_bool("SESSION_COOKIE_SECURE", True)
    SESSION_COOKIE_HTTPONLY = env_bool("SESSION_COOKIE_HTTPONLY", True)
    SESSION_COOKIE_SAMESITE = os.getenv("SESSION_COOKIE_SAMESITE", "Lax")
    PERMANENT_SESSION_LIFETIME = timedelta(days=3)

    # Database
    SQLALCHEMY_DATABASE_URI = os.getenv(
        "DATABASE_URL", f"sqlite:///{BASEDIR / 'instance' / 'app.db'}"
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # Stripe integration
    STRIPE_SECRET_KEY = os.getenv("STRIPE_SECRET_KEY")
    STRIPE_PUBLISHABLE_KEY = os.getenv("STRIPE_PUBLISHABLE_KEY")
    STRIPE_WEBHOOK_SECRET = os.getenv("STRIPE_WEBHOOK_SECRET")

    # Fundraising / campaign
    BASE_URL = os.getenv("BASE_URL", "http://localhost:5000")
    DONATION_LINK = os.getenv("DONATION_LINK")
    DEFAULT_DONATION = env_int("DEFAULT_DONATION", 25)
    MIN_DONATION = env_int("MIN_DONATION", 1)
    MAX_DONATION = env_int("MAX_DONATION", 999)
    RAISED_AMOUNT = env_int("RAISED_AMOUNT", 0)
    GOAL_AMOUNT = env_int("GOAL_AMOUNT", 10000)
    DEADLINE = os.getenv("DEADLINE", "2024-12-31T23:59:59Z")

    # CORS (simple: allow all for dev, env for prod)
    CORS_ALLOW_ORIGINS = os.getenv("CORS_ALLOW_ORIGINS") if os.getenv("FLASK_ENV") == "production" else "*"

    # Mailer (optional)
    MAIL_SERVER = os.getenv("MAIL_SERVER", "smtp.example.com")
    MAIL_PORT = env_int("MAIL_PORT", 587)
    MAIL_USE_TLS = env_bool("MAIL_USE_TLS", True)
    MAIL_USERNAME = os.getenv("MAIL_USERNAME")
    MAIL_PASSWORD = os.getenv("MAIL_PASSWORD")
    MAIL_DEFAULT_SENDER = os.getenv("MAIL_DEFAULT_SENDER", "no-reply@example.com")

    # Logging (optional)
    LOG_LEVEL = os.getenv("LOG_LEVEL", "INFO")
    LOG_FILE = os.getenv("LOG_FILE", str(BASEDIR / "instance" / "flask.log"))

class DevelopmentConfig(Config):
    """Dev environment config."""
    DEBUG = True
    SQLALCHEMY_ECHO = True

class ProductionConfig(Config):
    """Production config—enforces secure/required settings."""
    DEBUG = False
    # Enforce required secrets for prod
    if not os.getenv("SECRET_KEY"):
        raise RuntimeError("SECRET_KEY is required in production!")
    if not os.getenv("DATABASE_URL"):
        raise RuntimeError("DATABASE_URL is required in production!")
    if Config.SECRET_KEY == "change-me-in-production":
        raise RuntimeError("Do not use the default SECRET_KEY in production!")

class TestingConfig(Config):
    """Testing config—fast in-memory DB, CSRF disabled."""
    TESTING = True
    SQLALCHEMY_DATABASE_URI = "sqlite:///:memory:"
    WTF_CSRF_ENABLED = False

