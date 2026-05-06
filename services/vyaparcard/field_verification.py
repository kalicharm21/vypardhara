"""GPS-stamped field visit logging."""
from __future__ import annotations
from dataclasses import dataclass, field
from datetime import datetime
from math import asin, cos, radians, sin, sqrt


@dataclass
class FieldVisit:
    visit_id: str
    ubid: str
    officer_id: str
    lat: float
    lng: float
    captured_at: datetime
    notes: str = ""
    photo_count: int = 0


def haversine_m(a: tuple[float, float], b: tuple[float, float]) -> float:
    lat1, lon1 = map(radians, a)
    lat2, lon2 = map(radians, b)
    dlat = lat2 - lat1
    dlon = lon2 - lon1
    h = sin(dlat / 2) ** 2 + cos(lat1) * cos(lat2) * sin(dlon / 2) ** 2
    return 2 * 6_371_000 * asin(sqrt(h))


def gps_within_premises(visit: tuple[float, float],
                        registered: tuple[float, float],
                        *, tolerance_m: float = 150.0) -> bool:
    return haversine_m(visit, registered) <= tolerance_m


@dataclass
class FieldVisitLog:
    visits: list[FieldVisit] = field(default_factory=list)

    def record(self, v: FieldVisit) -> FieldVisit:
        self.visits.append(v)
        return v

    def for_ubid(self, ubid: str) -> list[FieldVisit]:
        return [v for v in self.visits if v.ubid == ubid]
