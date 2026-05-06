"""Active / Dormant / Closed classifier.

Rules:
  score >=  0.55                       → Active
  -0.10 <= score < 0.55                → Dormant
  score < -0.10  OR  premises_vacant   → Closed (with manual confirmation flag)

The 'evidence_chain' is the same structured breakdown returned by the
scorer; the dashboard renders it inline next to the badge."""
from __future__ import annotations
from dataclasses import dataclass
from .scorer import score_events


@dataclass
class Classification:
    status: str              # 'active' | 'dormant' | 'closed'
    confidence: float        # 0..1
    score: float             # raw activity score
    evidence_chain: list[dict]
    needs_field_check: bool


def classify(events: list[dict]) -> Classification:
    score, breakdown = score_events(events)

    has_vacant = any(b["event_type"] == "premises_vacant" for b in breakdown)
    if has_vacant or score < -0.10:
        return Classification(
            status="closed",
            confidence=min(1.0, abs(score) + 0.4),
            score=score, evidence_chain=breakdown,
            needs_field_check=not has_vacant,
        )
    if score >= 0.55:
        return Classification(
            status="active", confidence=min(1.0, score),
            score=score, evidence_chain=breakdown, needs_field_check=False,
        )
    return Classification(
        status="dormant",
        confidence=min(1.0, 0.5 + (0.55 - score)),
        score=score, evidence_chain=breakdown,
        needs_field_check=score < 0.20,
    )
