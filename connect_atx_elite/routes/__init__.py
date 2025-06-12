"""Bundle all blueprints in this package and re-export one master `bp`."""

from flask import Blueprint
bp = Blueprint("main", __name__)

# pull in the individual route modules so their @bp.* endpoints register
from . import api          # noqa: E402  (add , main, sms, etc. if they exist)
