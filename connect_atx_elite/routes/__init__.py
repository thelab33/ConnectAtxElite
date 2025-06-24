from flask import Blueprint, current_app

bp = Blueprint("main", __name__)

@bp.get("/sw.js")
def service_worker():
    """Return the service-worker with root scope."""
    return current_app.send_static_file("sw.js")

