from flask import Blueprint, current_app, jsonify

bp = Blueprint("api", __name__, url_prefix="/api")

@bp.get("/totals")
def totals():
    return jsonify(
        raised=current_app.config.get("RAISED_AMOUNT", 0),
        goal=current_app.config.get("GOAL_AMOUNT", 10_000),
    )
