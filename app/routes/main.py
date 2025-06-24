import os
from datetime import datetime
from flask import (
    Blueprint, current_app, flash, render_template,
    request, session, url_for
)
from app.models import Sponsor

main_bp = Blueprint("main", __name__)

@main_bp.route("/", methods=["GET"])
def index():
    """
    Render the homepage with fundraising totals, stats, sponsors, and deadline.
    All variables are safely provided to the template.
    """
    # Fundraising progress & goal
    raised = current_app.config.get("RAISED_AMOUNT", 0)
    goal = current_app.config.get("GOAL_AMOUNT", 10000)
    deadline = current_app.config.get("DEADLINE", "2024-12-31T23:59:59Z")
    year = datetime.utcnow().year

    # "Stats" block for homepage (use DB or config)
    stats = {
        "players":      current_app.config.get("STAT_PLAYERS", 32),
        "honor_roll":   current_app.config.get("STAT_HONOR_ROLL", 14),
        "tournaments":  current_app.config.get("STAT_TOURNAMENTS", 11),
        "years":        current_app.config.get("STAT_YEARS", 4),
    }

    user = session.get("user")
    sponsors = Sponsor.query.filter_by(is_active=True).order_by(Sponsor.id).all()
    donate_url = url_for("main.index") + "#donate"

    # User-friendly flash messages
    if request.args.get("welcome"):
        flash("Welcome to Connect ATX Elite!", "success")
    if request.args.get("donation") == "success":
        flash("Thank you! Your donation was successful.", "success")

    # Render homepage with all key values (never missing 'stats')
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

