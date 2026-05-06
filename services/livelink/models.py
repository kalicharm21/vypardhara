"""ORM models for LiveLink service."""
from datetime import datetime
from sqlalchemy import Column, String, DateTime, Integer, Boolean, Float, JSON
from sqlalchemy.orm import declarative_base

Base = declarative_base()


class LiveLinkSession(Base):
    __tablename__ = "livelink_sessions"
    id = Column(Integer, primary_key=True)
    session_id = Column(String(32), unique=True, nullable=False)
    ubid = Column(String(32), nullable=False, index=True)
    officer_id = Column(String(64), nullable=False)
    started_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    ended_at = Column(DateTime, nullable=True)
    registered_lat = Column(Float, nullable=False)
    registered_lng = Column(Float, nullable=False)
    integrity_breach = Column(Boolean, default=False)


class SessionReport(Base):
    __tablename__ = "session_reports"
    id = Column(Integer, primary_key=True)
    session_id = Column(String(32), nullable=False, index=True)
    payload = Column(JSON, nullable=False)
    generated_at = Column(DateTime, default=datetime.utcnow, nullable=False)
