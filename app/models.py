from datetime import datetime
from slugify import slugify
from sqlalchemy import event, select
from sqlalchemy.orm import validates

from app import db  # your Flask-SQLAlchemy db instance

def json_default():
    """Safely returns an empty list for default JSON fields."""
    return []

class SponsorTier(db.Model):
    """Sponsor tier/category (Platinum, Gold, etc.)."""
    __tablename__ = 'sponsor_tiers'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), unique=True, nullable=False)
    priority = db.Column(db.Integer, default=0, nullable=False)
    benefits = db.Column(db.JSON, nullable=False, default=json_default)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(
        db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False
    )

    sponsors = db.relationship('Sponsor', back_populates='tier', cascade="all, delete")

    def __repr__(self):
        return f"<SponsorTier name={self.name!r} priority={self.priority}>"

    def to_dict(self) -> dict:
        return {
            'id': self.id,
            'name': self.name,
            'priority': self.priority,
            'benefits': self.benefits,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat(),
        }


class Sponsor(db.Model):
    """An individual sponsor (company/person) and their info."""
    __tablename__ = "sponsors"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    slug = db.Column(db.String(140), unique=True, nullable=False)
    logo_url = db.Column(db.String(255), nullable=False)
    website = db.Column(db.String(255), nullable=True)
    is_active = db.Column(db.Boolean, default=True, nullable=False)

    tier_id = db.Column(db.Integer, db.ForeignKey('sponsor_tiers.id'), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(
        db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False
    )

    tier = db.relationship('SponsorTier', back_populates='sponsors')

    def __repr__(self):
        return f"<Sponsor id={self.id} name={self.name!r} tier={self.tier.name if self.tier else None!r}>"

    @validates('website', 'logo_url')
    def validate_url(self, key, url):
        """Ensure all URLs are valid and absolute."""
        if url and not url.startswith(('http://', 'https://')):
            raise ValueError(f"{key} must start with http:// or https://")
        return url

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "name": self.name,
            "slug": self.slug,
            "logo_url": self.logo_url,
            "website": self.website,
            "is_active": self.is_active,
            "tier": self.tier.to_dict() if self.tier else None,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat(),
        }


# ── Automatic unique slug generation on insert/update ── #
@event.listens_for(Sponsor, 'before_insert')
@event.listens_for(Sponsor, 'before_update')
def _generate_slug(mapper, connection, target):
    """Generate a unique slug for the sponsor, based on its name."""
    if target.name:
        candidate = slugify(target.name)
        slug = candidate
        count = 1
        # Uniqueness check (works for both new/updates)
        while connection.execute(
            select(Sponsor).where(Sponsor.slug == slug, Sponsor.id != target.id if target.id else True)
        ).first():
            count += 1
            slug = f"{candidate}-{count}"
        target.slug = slug


