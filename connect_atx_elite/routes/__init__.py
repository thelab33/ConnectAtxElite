from flask import Blueprint
bp = Blueprint('main', __name__)

"""routes package."""

# ─── serve /sw.js so the SW controls the whole origin ─────────────
@bp.get('/sw.js')
def service_worker():
    """Return the root-scope service-worker JS."""
    from flask import current_app
    return current_app.send_static_file('sw.js')
# ------------------------------------------------------------------
