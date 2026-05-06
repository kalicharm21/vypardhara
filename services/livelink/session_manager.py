"""Tracks active LiveLink sessions in memory + Postgres."""
from __future__ import annotations
from dataclasses import dataclass, field
from datetime import datetime
import secrets
from .gps_validator import GPSValidator
from .screenshot_capturer import ScreenshotCapturer


@dataclass
class Session:
    session_id: str
    ubid: str
    officer_id: str
    started_at: datetime
    registered_lat: float
    registered_lng: float
    gps: GPSValidator
    screenshots: ScreenshotCapturer = field(default_factory=ScreenshotCapturer)
    ended_at: datetime | None = None
    participants: set[str] = field(default_factory=set)


@dataclass
class SessionManager:
    sessions: dict[str, Session] = field(default_factory=dict)

    def start(self, ubid: str, officer_id: str,
              registered_lat: float, registered_lng: float) -> Session:
        s = Session(
            session_id=f"LL-{secrets.token_hex(4).upper()}",
            ubid=ubid, officer_id=officer_id,
            started_at=datetime.utcnow(),
            registered_lat=registered_lat, registered_lng=registered_lng,
            gps=GPSValidator((registered_lat, registered_lng)),
        )
        s.participants.add(officer_id)
        self.sessions[s.session_id] = s
        return s

    def end(self, session_id: str) -> Session | None:
        s = self.sessions.get(session_id)
        if not s or s.ended_at:
            return None
        s.ended_at = datetime.utcnow()
        return s
