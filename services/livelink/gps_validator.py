"""Validates that the live stream's GPS readings are inside the registered
premises radius — and stay there. Drift outside the radius for more than
N seconds is treated as a session integrity failure."""
from __future__ import annotations
from dataclasses import dataclass, field
from math import asin, cos, radians, sin, sqrt


def _haversine_m(a: tuple[float, float], b: tuple[float, float]) -> float:
    lat1, lon1 = map(radians, a); lat2, lon2 = map(radians, b)
    dlat, dlon = lat2 - lat1, lon2 - lon1
    h = sin(dlat/2)**2 + cos(lat1)*cos(lat2)*sin(dlon/2)**2
    return 2 * 6_371_000 * asin(sqrt(h))


@dataclass
class GPSValidator:
    registered: tuple[float, float]
    tolerance_m: float = 150.0
    drift_grace_s: int = 30
    _drift_started_ts: float | None = field(default=None, init=False)
    integrity_breach: bool = field(default=False, init=False)

    def update(self, lat: float, lng: float, ts: float) -> dict:
        dist = _haversine_m((lat, lng), self.registered)
        in_range = dist <= self.tolerance_m
        if in_range:
            self._drift_started_ts = None
        else:
            if self._drift_started_ts is None:
                self._drift_started_ts = ts
            elif ts - self._drift_started_ts > self.drift_grace_s:
                self.integrity_breach = True
        return {
            "distance_m": round(dist, 1),
            "in_range": in_range,
            "integrity_breach": self.integrity_breach,
        }
