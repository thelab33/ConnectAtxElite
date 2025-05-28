# ConnectAtxEliteFlask/__init__.py

"""
Package entrypoint for ConnectAtxEliteFlask.
Only expose the app factory, database and socketio here.
"""

from .app import create_app, db, socketio

__all__ = ["create_app", "db", "socketio"]

