from flask import Blueprint, Response, current_app, request
from twilio.twiml.messaging_response import MessagingResponse

from app.routes.api import _create_payment_link, _validate_amount

sms_bp = Blueprint("sms", __name__, url_prefix="/sms")

@sms_bp.post("/")
def inbound_sms():
    """
    Twilio POST webhook for inbound SMS donations.
    Commands:
      - ELITE             → default donation ($25)
      - ELITE <amount>    → custom donation ($1–$999)
      - Anything else     → help prompt
    """
    body = (request.values.get("Body", "") or "").strip()
    resp = MessagingResponse()
    parts = body.split()

    # Only accept ELITE [amount] pattern (case-insensitive)
    if parts and parts[0].lower() == "elite":
        default = current_app.config.get("DEFAULT_DONATION", 25)
        amt = default
        # Validate amount if given
        if len(parts) > 1 and parts[1].isdigit():
            try:
                amt = _validate_amount(parts[1])
            except Exception:
                amt = default
        link = _create_payment_link(amt)
        resp.message(
            f"🏀 Thanks for supporting Connect ATX Elite!\n"
            f"Your donation: ${amt}\n"
            f"Secure link: {link}"
        )
    else:
        resp.message(
            "Welcome! 📲\n"
            "Text ELITE <amount> to donate $1–$999 (e.g. ELITE 50),\n"
            "or just ELITE for $25.\n"
            "Questions? Reply HELP."
        )

    return Response(str(resp), mimetype="application/xml")

# Export for Blueprint auto-discovery
__all__ = ["sms_bp"]

