"""Per-event-type weights and recency decay constants.

A 'positive' weight pushes the score toward Active. The half-life controls
how quickly a signal stops counting (in days)."""
from __future__ import annotations
from dataclasses import dataclass


@dataclass(frozen=True)
class SignalSpec:
    weight: float
    half_life_days: int
    description: str


# Tuned on Karnataka pilot data — authoritative signals decay slowest.
TAXONOMY: dict[str, SignalSpec] = {
    "livelink_verified":    SignalSpec(1.00, 270, "LiveLink session, outcome=verified"),
    "field_visit_pass":     SignalSpec(0.95, 365, "Officer field visit, premises confirmed"),
    "gst_return_filed":     SignalSpec(0.70, 120, "GSTR filed for the period"),
    "labour_return_filed":  SignalSpec(0.60, 180, "Labour periodic return filed"),
    "kspcb_consent_renewed": SignalSpec(0.55, 540, "KSPCB consent renewed"),
    "shop_estab_renewed":   SignalSpec(0.45, 365, "Shop & Establishment renewed"),
    "card_scanned":         SignalSpec(0.40, 90,  "VyaparCard scanned in the field"),
    "salary_disbursed":     SignalSpec(0.35, 60,  "PF/ESI disbursement detected"),
    "consent_violation":    SignalSpec(-0.40, 365, "KSPCB violation notice"),
    "inspection_failed":    SignalSpec(-0.55, 365, "Inspection outcome failed"),
    "premises_vacant":      SignalSpec(-1.00, 540, "Field visit found premises vacant"),
}
