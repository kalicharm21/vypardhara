"""Address similarity — PIN code anchored, then RapidFuzz token-set ratio."""
from __future__ import annotations
from rapidfuzz import fuzz


def address_similarity(addr_a: str, addr_b: str, pin_a: str | None, pin_b: str | None) -> float:
    if not addr_a or not addr_b:
        return 0.0
    # PIN mismatch is a strong negative signal.
    if pin_a and pin_b and pin_a != pin_b:
        return 0.15 * (fuzz.token_set_ratio(addr_a, addr_b) / 100.0)
    base = fuzz.token_set_ratio(addr_a, addr_b) / 100.0
    if pin_a and pin_b and pin_a == pin_b:
        # Same PIN: boost.
        return min(1.0, 0.5 + 0.5 * base)
    return base
