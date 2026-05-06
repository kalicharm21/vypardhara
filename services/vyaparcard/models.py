"""ORM models for VyaparCard service."""
from datetime import datetime
from sqlalchemy import Column, String, DateTime, Integer, Float, JSON, Boolean
from sqlalchemy.orm import declarative_base

Base = declarative_base()


class VyaparCard(Base):
    __tablename__ = "vyapar_cards"
    id = Column(Integer, primary_key=True)
    ubid = Column(String(32), nullable=False, index=True)
    serial = Column(String(32), nullable=False, unique=True)
    issued_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    expires_at = Column(DateTime, nullable=False)
    revoked_at = Column(DateTime, nullable=True)
    qr_payload = Column(JSON)


class Delegate(Base):
    __tablename__ = "delegates"
    id = Column(Integer, primary_key=True)
    delegate_id = Column(String(32), unique=True, nullable=False)
    ubid = Column(String(32), nullable=False, index=True)
    name = Column(String(255), nullable=False)
    role = Column(String(64), nullable=False)
    scopes = Column(JSON, nullable=False)
    issued_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    expires_at = Column(DateTime, nullable=False)
    revoked_at = Column(DateTime, nullable=True)


class FieldVisit(Base):
    __tablename__ = "field_visits"
    id = Column(Integer, primary_key=True)
    visit_id = Column(String(32), unique=True, nullable=False)
    ubid = Column(String(32), nullable=False, index=True)
    officer_id = Column(String(64), nullable=False)
    lat = Column(Float, nullable=False)
    lng = Column(Float, nullable=False)
    captured_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    within_premises = Column(Boolean, nullable=False, default=False)
    notes = Column(String(1024), default="")
    photo_count = Column(Integer, default=0)
