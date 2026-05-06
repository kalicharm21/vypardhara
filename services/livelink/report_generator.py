"""Generates the post-session verification report."""
from __future__ import annotations
from dataclasses import dataclass
from datetime import datetime


@dataclass
class SessionReport:
    session_id: str
    ubid: str
    officer_id: str
    started_at: datetime
    ended_at: datetime
    duration_s: int
    gps_match: bool
    integrity_breach: bool
    screenshots: int
    outcome: str            # 'verified' | 'partial' | 'failed'

    def to_dict(self) -> dict:
        return {
            "session_id": self.session_id, "ubid": self.ubid,
            "officer_id": self.officer_id,
            "started_at": self.started_at.isoformat(),
            "ended_at": self.ended_at.isoformat(),
            "duration_s": self.duration_s,
            "gps_match": self.gps_match,
            "integrity_breach": self.integrity_breach,
            "screenshots": self.screenshots,
            "outcome": self.outcome,
        }


def decide_outcome(*, gps_match: bool, integrity_breach: bool,
                   duration_s: int, screenshots: int) -> str:
    if integrity_breach or not gps_match:
        return "failed"
    if duration_s < 60 or screenshots < 3:
        return "partial"
    return "verified"
