from flask import Blueprint, render_template, current_app, request

bp = Blueprint("main", __name__)

@bp.get("/")
def index():
    """
    Renders the homepage.

    Query Params:
      ?donation=success  →  triggers a "Thank you" banner.

    Context:
      raised, goal       →  fundraising totals from config
      donation_success   →  whether to show success banner
    """
    # Did we just come from a successful checkout?
    donation_success = request.args.get("donation") == "success"

    # Pull in your live totals from app config (or fallback values)
    raised = current_app.config.get("RAISED_AMOUNT", 8250)
    goal   = current_app.config.get("GOAL_AMOUNT", 10000)

    return render_template(
        "index.html",
        raised=raised,
        goal=goal,
        donation_success=donation_success,
    )

