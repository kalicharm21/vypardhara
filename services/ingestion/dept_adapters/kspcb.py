"""Karnataka State Pollution Control Board adapter."""
from __future__ import annotations
from typing import Any
from ..normalizer import normalise_name, normalise_address, name_signature, extract_pin
from ..pseudonymizer import pseudonymise_pan, pseudonymise_gstin

DEPT = "kspcb"


def transform(raw: dict[str, Any]) -> dict[str, Any]:
    name = raw.get("unit_name") or ""
    addr = raw.get("site_address") or ""
    return {
        "dept": DEPT,
        "source_record_id": str(raw.get("consent_no") or raw.get("id")),
        "legal_name_norm": normalise_name(name),
        "trade_name_norm": name_signature(name),
        "address_norm": normalise_address(addr),
        "pin": extract_pin(addr),
        "pan_pseudo": pseudonymise_pan(raw.get("pan")),
        "gstin_pseudo": pseudonymise_gstin(raw.get("gstin")),
        "extra": {
            "consent_category": raw.get("consent_category"),  # red/orange/green/white
            "consent_valid_till": raw.get("consent_valid_till"),
        },
    }


async def run() -> int:
    return 0
