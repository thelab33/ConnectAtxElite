# ConnectAtxEliteFlask/models.py
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Sponsor(db.Model):
    __tablename__ = "sponsors"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    logo_url = db.Column(db.String(255), nullable=False)

