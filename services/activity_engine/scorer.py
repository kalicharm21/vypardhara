"""Recency-weighted scorer.

score = sum_i weight_i * 0.5 ** (age_days_i / half_life_i)

Capped to [-1, 1]. Returns the score plus a per-event evidence breakdown
so the dashboard can explain *why* a business is Active or Dormant."""
from __future__ import annotations
from datetime import datetime
from .signal_taxonomy import TAXONOMY


def score_events(events: list[dict], *, now: datetime | None = None
                 ) -> tuple[float, list[dict]]:
    now = now or datetime.utcnow()
    total = 0.0
    breakdown: list[dict] = []
    for ev in events:
        spec = TAXONOMY.get(ev["event_type"])
        if not spec:
            continue
        occurred = datetime.fromisoformat(ev["occurred_at"])
        age_days = max(0.0, (now - occurred).total_seconds() / 86400.0)
        decay = 0.5 ** (age_days / spec.half_life_days)
        contribution = spec.weight * decay
        total += contribution
        breakdown.append({
            "event_type": ev["event_type"], "dept": ev["dept"],
            "age_days": round(age_days, 1),
            "weight": spec.weight, "decay": round(decay, 4),
            "contribution": round(contribution, 4),
        })
    breakdown.sort(key=lambda x: abs(x["contribution"]), reverse=True)
    return max(-1.0, min(1.0, round(total, 4))), breakdown
