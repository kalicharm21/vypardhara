from datetime import datetime, timedelta
from services.activity_engine.classifier import classify


def _ev(t, days_ago):
    return {"ubid": "U", "dept": "labour", "event_type": t,
            "occurred_at": (datetime.utcnow() - timedelta(days=days_ago)).isoformat()}


def test_recent_livelink_marks_active():
    c = classify([_ev("livelink_verified", 30)])
    assert c.status == "active"


def test_vacant_marks_closed():
    c = classify([_ev("premises_vacant", 60)])
    assert c.status == "closed"


def test_no_events_is_dormant():
    c = classify([])
    assert c.status == "dormant" and c.needs_field_check
