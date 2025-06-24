# run.py — Top-level entry point (next to .env and requirements.txt)
from app import create_app, socketio

# Initialize the Flask app
app = create_app()  # Gunicorn looks for 'app' when running in production

if __name__ == "__main__":
    # For local development: use socketio.run to enable WebSocket support
    socketio.run(
        app,
        host="0.0.0.0",
        port=5000,
        debug=True
    )

