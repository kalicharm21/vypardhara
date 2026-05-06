"""Captures GPS-stamped screenshots at random intervals during a LiveLink
session — random so the participant can't anticipate and reposition."""
from __future__ import annotations
import random
from dataclasses import dataclass, field
from datetime import datetime


@dataclass
class Screenshot:
    ts: datetime
    lat: float
    lng: float
    frame_signature: str
    frame_url: str


@dataclass
class ScreenshotCapturer:
    min_interval_s: int = 20
    max_interval_s: int = 60
    captured: list[Screenshot] = field(default_factory=list)
    _next_at: float = field(default=0.0, init=False)

    def maybe_capture(self, *, now_s: float, lat: float, lng: float,
                      frame_signature: str, frame_url: str) -> Screenshot | None:
        if now_s < self._next_at:
            return None
        shot = Screenshot(datetime.utcnow(), lat, lng, frame_signature, frame_url)
        self.captured.append(shot)
        self._next_at = now_s + random.uniform(self.min_interval_s, self.max_interval_s)
        return shot
