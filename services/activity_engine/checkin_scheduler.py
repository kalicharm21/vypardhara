"""Schedules a periodic LiveLink check-in (default every 9 months) for each
UBID. The classifier consumes the 'livelink_verified' event the next day,
which keeps low-traffic businesses from being mis-classified as dormant."""
from __future__ import annotations
from dataclasses import dataclass, field
from datetime import datetime, timedelta


@dataclass
class CheckIn:
    ubid: str
    last_verified_at: datetime | None
    due_at: datetime
    interval_days: int = 270


@dataclass
class CheckInScheduler:
    interval_days: int = 270
    by_ubid: dict[str, CheckIn] = field(default_factory=dict)

    def register(self, ubid: str, last_verified_at: datetime | None = None) -> CheckIn:
        anchor = last_verified_at or datetime.utcnow()
        c = CheckIn(
            ubid=ubid, last_verified_at=last_verified_at,
            due_at=anchor + timedelta(days=self.interval_days),
            interval_days=self.interval_days,
        )
        self.by_ubid[ubid] = c
        return c

    def mark_verified(self, ubid: str, at: datetime) -> CheckIn | None:
        c = self.by_ubid.get(ubid)
        if not c:
            return None
        c.last_verified_at = at
        c.due_at = at + timedelta(days=self.interval_days)
        return c

    def overdue(self, *, as_of: datetime | None = None) -> list[CheckIn]:
        now = as_of or datetime.utcnow()
        return [c for c in self.by_ubid.values() if c.due_at <= now]
