"""
Twilio SMS donation webhook for Connect ATX Elite.
Handles ELITE <amount> SMS commands, returns Stripe payment link, and fallback help.
"""

import os
import stripe
from flask import Blueprint, Response, request
from twilio.twiml.messaging_response import MessagingResponse

# Re-use validated helpers from the API module for DRYness
from .api import _create_payment_link, _validate_amount

bp = Blueprint("sms", __name__, url_prefix="/sms")

# Stripe + SMS config (loaded at runtime)
stripe.api_key = os.getenv("STRIPE_SECRET_KEY", "")
STATIC_LINK = os.getenv("DONATION_LINK")
DEFAULT_DON = int(os.getenv("DEFAULT_DONATION", 25))
MIN_DON = 1
MAX_DON = 999

@bp.post("/")
def inbound_sms():
    """
    Twilio POST webhook for inbound SMS donations.
    - ELITE            → default donation ($25)
    - ELITE <amount>   → custom ($1–$999)
    - anything else    → help prompt
    """
    body = (request.values.get("Body") or "").strip()
    resp = MessagingResponse()
    amount = DEFAULT_DON
    show_help = True

    # Basic parsing: look for ELITE <amount>
    parts = body.split()
    if parts and parts[0].lower() == "elite":
        show_help = False
        if len(parts) > 1 and parts[1].isdigit():
            amount = _validate_amount(int(parts[1]))
        else:
            amount = DEFAULT_DON
        link = STATIC_LINK or _create_payment_link(amount)
        resp.message(
            f"🏀 Thanks for supporting Connect ATX Elite!\n"
            f"Your donation: ${amount}\n"
            f"Secure link: {link}"
        )
    if show_help:
        resp.message(
            "Welcome to Connect ATX Elite! 🎉\n"
            "Text ELITE <amount> (e.g. ELITE 50) to donate $1–$999.\n"
            "Or just text ELITE for the default gift.\n"
            "Questions? Reply HELP."
        )

    return Response(str(resp), mimetype="application/xml")

