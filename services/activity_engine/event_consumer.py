"""Joins department event streams to UBIDs."""
from __future__ import annotations
from dataclasses import dataclass
from datetime import datetime


@dataclass
class DeptEvent:
    dept: str
    record_id: str        # source-system id; resolved to UBID by lookup
    event_type: str       # key into signal_taxonomy.TAXONOMY
    occurred_at: datetime
    payload: dict


def to_activity_event(ev: DeptEvent, ubid_lookup) -> dict | None:
    """`ubid_lookup(dept, record_id)` returns a UBID or None.
    Returns None when the source record isn't yet linked to a UBID."""
    ubid = ubid_lookup(ev.dept, ev.record_id)
    if not ubid:
        return None
    return {
        "ubid": ubid, "dept": ev.dept, "event_type": ev.event_type,
        "occurred_at": ev.occurred_at.isoformat(), "payload": ev.payload,
    }
