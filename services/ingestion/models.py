"""ORM models for ingested raw + shadow records."""
from datetime import datetime
from sqlalchemy import Column, String, DateTime, Integer, JSON, Index
from sqlalchemy.orm import declarative_base

Base = declarative_base()


class RawRecord(Base):
    """A record exactly as it arrived from a department API."""
    __tablename__ = "raw_records"
    id = Column(Integer, primary_key=True)
    dept = Column(String(64), nullable=False, index=True)
    source_record_id = Column(String(128), nullable=False)
    payload = Column(JSON, nullable=False)
    fetched_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    __table_args__ = (Index("ix_raw_dept_src", "dept", "source_record_id", unique=True),)


class ShadowRecord(Base):
    """The normalised, pseudonymised view used by the matching engine."""
    __tablename__ = "shadow_records"
    id = Column(Integer, primary_key=True)
    raw_record_id = Column(Integer, nullable=False, index=True)
    dept = Column(String(64), nullable=False, index=True)
    legal_name_norm = Column(String(255))
    trade_name_norm = Column(String(255))
    address_norm = Column(String(512))
    pin = Column(String(16), index=True)
    pan_pseudo = Column(String(128), index=True)
    gstin_pseudo = Column(String(128), index=True)
    extra = Column(JSON)
    updated_at = Column(DateTime, default=datetime.utcnow, nullable=False)
