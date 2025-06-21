from flask import Blueprint, render_template, request, current_app, url_for, flash, session
from datetime import datetime

# Blueprint for main site pages
bp = Blueprint("main", __name__)

@bp.route("/", methods=["GET"])
def index():
    """
    Homepage route.
    Renders the main index page with fundraising progress and additional context.
    """
    # In production, fetch these from your database or config
    raised = 7900
    goal = 10000
    deadline = "2024-12-31T23:59:59Z"

    user = session.get("user")  # None if not logged in
    page_title = "Connect ATX Elite – Home"
    donate_url = url_for("main.index") + "#donate"
    year = datetime.now().year

    # Optional: Welcome message demo
    if request.args.get("welcome"):
        flash("Welcome to Connect ATX Elite!", "success")

    context = {
        "raised": raised,
        "goal": goal,
        "deadline": deadline,
        "user": user,
        "page_title": page_title,
        "donate_url": donate_url,
        "year": year,
    }

    return render_template("index.html", **context)

