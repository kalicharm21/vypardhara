"""PAN/GSTIN equality signal — anchor logic.

A PAN match is the strongest available link between two records. Where both
sides have a (pseudonymised) PAN, equality returns 1.0; mismatch returns 0.0
and the composite scorer treats it as a hard negative.
"""
from __future__ import annotations
from dataclasses import dataclass


@dataclass(frozen=True)
class IdSignal:
    score: float        # 1.0 match, 0.0 mismatch, 0.5 unknown
    is_anchor: bool     # True when both sides had the identifier present


def pan_signal(pan_a: str | None, pan_b: str | None) -> IdSignal:
    if not pan_a or not pan_b:
        return IdSignal(0.5, False)
    return IdSignal(1.0 if pan_a == pan_b else 0.0, True)


def gstin_signal(g_a: str | None, g_b: str | None) -> IdSignal:
    if not g_a or not g_b:
        return IdSignal(0.5, False)
    return IdSignal(1.0 if g_a == g_b else 0.0, True)
