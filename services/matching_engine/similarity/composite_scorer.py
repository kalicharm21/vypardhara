"""Composite scorer — combines the four similarity signals into a single
calibrated probability of being the same entity.

Hard rules (override the weighted score):
- PAN anchor mismatch  → 0.0  (catastrophic to merge)
- PAN anchor match + name >= 0.6  → 0.99
- GSTIN anchor mismatch + PIN mismatch → 0.0
"""
from __future__ import annotations
from dataclasses import dataclass
from .name_signal import name_similarity
from .address_signal import address_similarity
from .pan_gstin_signal import pan_signal, gstin_signal, IdSignal

WEIGHTS = {"name": 0.40, "address": 0.30, "pan": 0.20, "gstin": 0.10}


@dataclass
class Record:
    name_norm: str
    address_norm: str
    pin: str | None
    pan_pseudo: str | None
    gstin_pseudo: str | None
    dept: str


@dataclass
class MatchExplanation:
    score: float
    name: float
    address: float
    pan: IdSignal
    gstin: IdSignal
    intra_dept: bool
    rule_fired: str | None


def score_pair(a: Record, b: Record, *, use_embeddings: bool = False) -> MatchExplanation:
    name = name_similarity(a.name_norm, b.name_norm, use_embeddings=use_embeddings)
    addr = address_similarity(a.address_norm, b.address_norm, a.pin, b.pin)
    pan = pan_signal(a.pan_pseudo, b.pan_pseudo)
    gst = gstin_signal(a.gstin_pseudo, b.gstin_pseudo)
    intra = a.dept == b.dept

    # Hard rules first.
    if pan.is_anchor and pan.score == 0.0:
        return MatchExplanation(0.0, name, addr, pan, gst, intra, "pan-mismatch")
    if pan.is_anchor and pan.score == 1.0 and name >= 0.6:
        return MatchExplanation(0.99, name, addr, pan, gst, intra, "pan-match+name")
    if gst.is_anchor and gst.score == 0.0 and a.pin and b.pin and a.pin != b.pin:
        return MatchExplanation(0.0, name, addr, pan, gst, intra, "gstin+pin-mismatch")

    raw = (
        WEIGHTS["name"] * name
        + WEIGHTS["address"] * addr
        + WEIGHTS["pan"] * pan.score
        + WEIGHTS["gstin"] * gst.score
    )
    # Light penalty for intra-dept (records inside one dept are usually distinct).
    if intra:
        raw *= 0.92
    return MatchExplanation(round(raw, 4), name, addr, pan, gst, intra, None)
