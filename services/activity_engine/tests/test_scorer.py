from datetime import datetime, timedelta
from services.activity_engine.scorer import score_events


def _ev(t, days_ago, dept="labour"):
    return {"ubid": "U", "dept": dept, "event_type": t,
            "occurred_at": (datetime.utcnow() - timedelta(days=days_ago)).isoformat(),
            "payload": {}}


def test_recent_strong_signal_dominates():
    score, _ = score_events([_ev("livelink_verified", 30)])
    assert score > 0.7


def test_negative_signals_pull_score_down():
    score, _ = score_events([_ev("premises_vacant", 30)])
    assert score < -0.5


def test_unknown_event_ignored():
    s1, _ = score_events([_ev("unknown_event", 1)])
    s2, _ = score_events([])
    assert s1 == s2 == 0.0
