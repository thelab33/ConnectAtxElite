import os
from datetime import datetime
from flask import (
    Blueprint, current_app, flash, render_template,
    request, session, url_for
)
from app.models import Sponsor

main_bp = Blueprint("main", __name__, url_prefix="/")

# ---- Config Defaults ----
DEFAULTS = {
    "RAISED_AMOUNT": 0,
    "GOAL_AMOUNT": 10000,
    "DEADLINE": "2024-12-31T23:59:59Z",
    "STAT_PLAYERS": 32,
    "STAT_HONOR_ROLL": 14,
    "STAT_TOURNAMENTS": 11,
    "STAT_YEARS": 4,
}

def get_config(key):
    """
    Returns config value from Flask config, falling back to sensible DEFAULTS.
    """
    return current_app.config.get(key, DEFAULTS.get(key))

@main_bp.route("/", endpoint="home", methods=["GET"])
def index():
    """
    Render the homepage with all stats, sponsors, and fundraising state.
    """
    raised = get_config("RAISED_AMOUNT")
    goal = get_config("GOAL_AMOUNT")
    deadline = get_config("DEADLINE")
    year = datetime.utcnow().year

    stats = {
        "players":      get_config("STAT_PLAYERS"),
        "honor_roll":   get_config("STAT_HONOR_ROLL"),
        "tournaments":  get_config("STAT_TOURNAMENTS"),
        "years":        get_config("STAT_YEARS"),
    }

    # For template personalization
    user = session.get("user")

    # Fetch all active sponsors
    sponsors = Sponsor.query.filter_by(is_active=True).order_by(Sponsor.id).all()
    donate_url = url_for("main.home") + "#donate"

    # Optional: display a flash message after certain actions
    if request.args.get("welcome"):
        flash("Welcome to Connect ATX Elite!", "success")
    if request.args.get("donation") == "success":
        flash("Thank you! Your donation was successful.", "success")

    return render_template(
        "index.html",
        raised=raised,
        goal=goal,
        deadline=deadline,
        stats=stats,
        user=user,
        sponsors=sponsors,
        donate_url=donate_url,
        year=year,
        page_title="Connect ATX Elite – Home"
    )

