import re
import stripe
from flask import Blueprint, current_app, jsonify, request, url_for
from werkzeug.exceptions import BadRequest

api_bp = Blueprint("api", __name__, url_prefix="/api")

# ─── Helpers ────────────────────────────────────────────────

def _validate_amount(
    value,
    *,
    default: int = None,
    min_amt: int = None,
    max_amt: int = None
) -> int:
    """
    Coerce value to int and clamp between min/max.
    If invalid, uses default, and always returns int.
    """
    min_amt = min_amt if min_amt is not None else current_app.config.get("MIN_DONATION", 1)
    max_amt = max_amt if max_amt is not None else current_app.config.get("MAX_DONATION", 999)
    default = default if default is not None else current_app.config.get("DEFAULT_DONATION", 25)
    try:
        amt = int(value)
    except (TypeError, ValueError):
        amt = default
    amt = max(min_amt, min(max_amt, amt))
    return amt

def _error(message: str, status_code: int = 400):
    """Return a standard JSON error."""
    return jsonify(error=message), status_code

def _create_payment_link(amount_usd: int) -> str:
    """
    Create a Stripe Payment Link, or return static link if configured.
    """
    static = current_app.config.get("DONATION_LINK")
    if static:
        return static
    try:
        link = stripe.PaymentLink.create(
            line_items=[{
                "price_data": {
                    "currency": "usd",
                    "unit_amount": amount_usd * 100,
                    "product_data": {"name": "Connect ATX Elite Donation"},
                },
                "quantity": 1,
            }],
            allow_promotion_codes=True,
            metadata={"campaign": "sms", "amount_usd": amount_usd},
        )
        return link.url
    except Exception as e:
        current_app.logger.error(f"Stripe PaymentLink failed: {e}", exc_info=e)
        return static or "/donate"

def _create_checkout_session(amount_usd: int):
    """
    Create a Stripe Checkout Session for web payments.
    """
    domain = current_app.config.get("BASE_URL", "http://localhost:5000").rstrip("/")
    image_url = url_for("static", filename="connect-atx-team.jpg", _external=True)
    try:
        return stripe.checkout.Session.create(
            mode="payment",
            payment_method_types=["card"],
            line_items=[{
                "price_data": {
                    "currency": "usd",
                    "unit_amount": amount_usd * 100,
                    "product_data": {
                        "name": "Connect ATX Elite Donation",
                        "images": [image_url],
                    },
                },
                "quantity": 1,
            }],
            allow_promotion_codes=True,
            metadata={"campaign": "website", "amount_usd": amount_usd},
            success_url=f"{domain}/?donation=success",
            cancel_url=f"{domain}/",
        )
    except Exception as e:
        current_app.logger.error("Stripe checkout session creation failed", exc_info=e)
        raise BadRequest("Payment creation failed")

# ─── Stripe Key Setup ───────────────────────────────────────

@api_bp.before_app_request
def _configure_stripe():
    """Set Stripe API key from Flask config before every request."""
    stripe.api_key = current_app.config.get("STRIPE_SECRET_KEY", "")

# ─── API Endpoints ──────────────────────────────────────────

@api_bp.post("/create-checkout")
def create_checkout():
    """Create a Stripe Checkout session."""
    data = request.get_json(silent=True) or {}
    amt = _validate_amount(data.get("amount"))
    try:
        session = _create_checkout_session(amt)
    except Exception as e:
        current_app.logger.error("Stripe checkout creation failed", exc_info=e)
        return _error("Payment creation failed", 500)
    return jsonify(session_id=session.id)

@api_bp.post("/webhook")
def stripe_webhook():
    """
    Stripe webhook endpoint to process payment events.
    Emits donation updates to connected clients.
    """
    payload = request.get_data(as_text=True)
    sig_header = request.headers.get("stripe-signature", "")
    secret = current_app.config.get("STRIPE_WEBHOOK_SECRET", "")
    try:
        event = stripe.Webhook.construct_event(payload, sig_header, secret)
    except Exception as e:
        current_app.logger.warning("Invalid Stripe webhook: %s", e)
        return _error(f"Webhook error: {e}", 400)

    if event.get("type") == "checkout.session.completed":
        paid = event["data"]["object"]
        amount = int(paid.get("amount_total", 0)) // 100
        current_app.logger.info(f"New donation received: ${amount}")
        # TODO: Update fundraising total in database in production!
        from app import socketio
        new_total = current_app.config.get("RAISED_AMOUNT", 0) + amount
        socketio.emit(
            "donation_update",
            {"total": new_total},
            namespace="/"
        )
    return jsonify({}), 200

@api_bp.get("/totals")
def totals():
    """Return current fundraising totals."""
    return jsonify({
        "raised": current_app.config.get("RAISED_AMOUNT", 0),
        "goal":   current_app.config.get("GOAL_AMOUNT", 10000),
    })

@api_bp.get("/sponsors")
def list_sponsors():
    """Return list of all active sponsors."""
    from app.models import Sponsor
    sponsors = Sponsor.query.filter_by(is_active=True).order_by(Sponsor.id).all()
    return jsonify([s.to_dict() for s in sponsors])

# Export for Blueprint auto-discovery
__all__ = ["api_bp"]

