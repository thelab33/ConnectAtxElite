from flask import Blueprint, request, Response, current_app
from twilio.twiml.messaging_response import MessagingResponse
import os, stripe

# Re-use your API utilities for consistency
from .api import _validate_amount, _create_payment_link

bp = Blueprint("sms", __name__, url_prefix="/sms")

# Load at runtime
stripe.api_key = os.getenv("STRIPE_SECRET_KEY", "")
STATIC_LINK   = os.getenv("DONATION_LINK")
DEFAULT_DON   = int(os.getenv("DEFAULT_DONATION", 25))


@bp.post("/")
def inbound_sms():
    """
    Twilio SMS webhook.

    Commands:
      ELITE           → default gift (e.g. $25)
      ELITE <amount>  → custom gift ($1–$999)
      anything else   → help prompt
    """
    body = request.values.get("Body", "").strip()
    resp = MessagingResponse()

    parts = body.split()
    if parts and parts[0].lower() == "elite":
        # parse amount or fallback
        amt = DEFAULT_DON
        if len(parts) >= 2 and parts[1].isdigit():
            amt = _validate_amount(int(parts[1]))
        # build the link (static env var preferred)
        link = STATIC_LINK or _create_payment_link(amt)
        resp.message(
            f"🏀 Thanks for supporting Connect ATX Elite!\n"
            f"Your donation: ${amt}\n"
            f"Secure link: {link}"
        )
    else:
        # show help
        resp.message(
            "Welcome to Connect ATX Elite! 🎉\n"
            "Text ELITE <amount> (e.g. ELITE 50) to donate $1–$999.\n"
            "Just ELITE for our default gift.\n"
            "Questions? Reply HELP."
        )

    return Response(str(resp), mimetype="application/xml")

