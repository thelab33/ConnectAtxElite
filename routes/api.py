"""
routes/api.py
────────────────────────────────────────────────────────────────────────────
Stripe Checkout + SMS donation endpoints for Connect ATX Elite,
plus live-update webhook to broadcast new donations via Socket.IO.
────────────────────────────────────────────────────────────────────────────
"""

from __future__ import annotations
import os
import re
import stripe
from flask import Blueprint, request, Response
from twilio.twiml.messaging_response import MessagingResponse
from werkzeug.exceptions import BadRequest
from extensions import socketio  # <— Use absolute import!

# ... rest of your code ...


# ─── Configuration ────────────────────────────────────────────────────────
bp = Blueprint("api", __name__, url_prefix="/api")

stripe.api_key: str = os.getenv("STRIPE_SECRET_KEY", "")
DOMAIN: str = os.getenv("BASE_URL", "http://localhost:8000").rstrip("/")
DEFAULT_DONATION: int = 25          # USD
MIN_DONATION: int = 1
MAX_DONATION: int = 999
# Optional static link (fallback if Stripe Payment Links are restricted)
STATIC_DONATION_LINK: str | None = os.getenv("DONATION_LINK")

# ─── Utilities ────────────────────────────────────────────────────────────
_AMOUNT_RE = re.compile(r"^elite\s+(\d+)", re.I)


def _validate_amount(dollars: int) -> int:
    """Clamp & return a safe donation amount in dollars."""
    return max(MIN_DONATION, min(MAX_DONATION, dollars))


def _error(message: str, code: int = 400) -> tuple[dict[str, str], int]:
    """Helper to return JSON API errors."""
    return {"error": message}, code


def _create_checkout_session(amount_usd: int) -> stripe.checkout.Session:
    """Create a Stripe Checkout Session and return it."""
    return stripe.checkout.Session.create(
        mode="payment",
        payment_method_types=["card"],  # Apple & Google Pay auto-enabled
        line_items=[
            {
                "price_data": {
                    "currency": "usd",
                    "unit_amount": amount_usd * 100,  # dollars → cents
                    "product_data": {
                        "name": "Connect ATX Elite Donation",
                        "images": [f"{DOMAIN}/static/connect-atx-team.jpg"],
                    },
                },
                "quantity": 1,
            }
        ],
        allow_promotion_codes=True,
        metadata={"campaign": "website_cta", "amount_usd": amount_usd},
        success_url=f"{DOMAIN}/?donation=success",
        cancel_url=f"{DOMAIN}/",
    )


def _create_payment_link(amount_usd: int) -> str:
    """Return a hosted Stripe Payment Link for one-time donation."""
    if STATIC_DONATION_LINK:
        return STATIC_DONATION_LINK

    link = stripe.PaymentLink.create(
        line_items=[
            {
                "price_data": {
                    "currency": "usd",
                    "unit_amount": amount_usd * 100,
                    "product_data": {"name": "Connect ATX Elite Donation"},
                },
                "quantity": 1,
            }
        ],
        allow_promotion_codes=True,
        metadata={"campaign": "sms", "amount_usd": amount_usd},
    )
    return link.url


# ─── HTTP JSON endpoint ───────────────────────────────────────────────────
@bp.post("/create-checkout")
def create_checkout() -> tuple[dict[str, str], int]:
    """
    POST /api/create-checkout
    Body (JSON): { "amount": <int dollars, optional> }

    Returns: { "session_id": "<Stripe Session ID>" }
    """
    try:
        data = request.get_json(silent=True) or {}
        dollars = _validate_amount(int(data.get("amount", DEFAULT_DONATION)))
    except (ValueError, TypeError):
        raise BadRequest("Invalid amount payload")

    try:
        session = _create_checkout_session(dollars)
    except Exception as exc:  # noqa: BLE001
        return _error(str(exc), 500)

    return {"session_id": session.id}, 200


# ─── Stripe Webhook → live-update via Socket.IO ──────────────────────────
@bp.post("/webhook")
def stripe_webhook() -> tuple[dict, int]:
    """
    POST /api/webhook
    Stripe webhook for checkout.session.completed events.

    On each successful payment, emits:
      socketio.emit("donation", {"amount": <USD>}, to="donors")
    """
    payload    = request.get_data(as_text=True)
    sig_header = request.headers.get("stripe-signature", "")
    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, os.getenv("STRIPE_WEBHOOK_SECRET", "")
        )
    except Exception as e:
        return _error(f"Webhook error: {e}", 400)

    # Only handle completed payments
    if event["type"] == "checkout.session.completed":
        paid = event["data"]["object"]
        amount_usd = int(paid.get("amount_total", 0)) // 100
        # Broadcast to all subscribers in the "donors" room
        socketio.emit("donation", {"amount": amount_usd}, to="donors")

    return {}, 200


# ─── Twilio SMS webhook ───────────────────────────────────────────────────
@bp.post("/sms")
def sms_webhook() -> Response:
    """
    Twilio POST webhook for incoming SMS.

    Expected body example:
        Body="ELITE 50"
    """
    body: str = request.values.get("Body", "")
    match = _AMOUNT_RE.match(body.strip())

    dollars = _validate_amount(int(match.group(1))) if match else DEFAULT_DONATION
    link = _create_payment_link(dollars)

    resp = MessagingResponse()
    resp.message(
        f"🏀  Thanks for supporting Connect ATX Elite!\n"
        f"Donate ${dollars} securely here: {link}"
    )
    return Response(str(resp), mimetype="application/xml")



@bp.get("/totals")
def totals():
    """Return {'raised':…, 'goal':…} for the frontend."""
    from flask import current_app, jsonify
    return jsonify({
        "raised": current_app.config.get("RAISED_AMOUNT", 0),
        "goal":   current_app.config.get("GOAL_AMOUNT", 10000)
    })
