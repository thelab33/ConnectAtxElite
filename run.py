# run.py — Top-level entry point for Connect ATX Elite Flask app

from app import create_app, socketio

# Create the Flask app using the application factory pattern
app = create_app()  # Gunicorn/Uvicorn looks for 'app'

if __name__ == "__main__":
    # For local development ONLY: enables debug, reloader, and WebSocket support.
    # Use Gunicorn or similar for production: `gunicorn -k eventlet -w 1 run:app`
    print(" * Starting Connect ATX Elite Flask app (development mode)")
    socketio.run(
        app,
        host="0.0.0.0",
        port=5000,
        debug=True,  # Set to False to mimic production
        use_reloader=True,
        allow_unsafe_werkzeug=True,  # For recent Flask-SocketIO/Flask versions
    )

