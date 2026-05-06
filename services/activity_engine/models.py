"""ORM models for Activity Engine."""
from datetime import datetime
from sqlalchemy import Column, String, DateTime, Integer, Float, JSON
from sqlalchemy.orm import declarative_base

Base = declarative_base()


class ActivityEvent(Base):
    __tablename__ = "activity_events"
    id = Column(Integer, primary_key=True)
    ubid = Column(String(32), nullable=False, index=True)
    dept = Column(String(64), nullable=False)
    event_type = Column(String(64), nullable=False)
    occurred_at = Column(DateTime, nullable=False)
    payload = Column(JSON)


class Classification(Base):
    __tablename__ = "classifications"
    id = Column(Integer, primary_key=True)
    ubid = Column(String(32), nullable=False, index=True)
    status = Column(String(16), nullable=False)
    confidence = Column(Float, nullable=False)
    score = Column(Float, nullable=False)
    evidence = Column(JSON, nullable=False)
    classified_at = Column(DateTime, default=datetime.utcnow, nullable=False)


class CheckInSchedule(Base):
    __tablename__ = "checkin_schedules"
    id = Column(Integer, primary_key=True)
    ubid = Column(String(32), unique=True, nullable=False)
    last_verified_at = Column(DateTime, nullable=True)
    due_at = Column(DateTime, nullable=False)
    interval_days = Column(Integer, default=270, nullable=False)
