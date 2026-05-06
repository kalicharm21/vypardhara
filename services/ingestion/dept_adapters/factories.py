"""Factories Department adapter."""
from __future__ import annotations
from typing import Any
from ..normalizer import normalise_name, normalise_address, name_signature, extract_pin
from ..pseudonymizer import pseudonymise_pan, pseudonymise_gstin

DEPT = "factories"


def transform(raw: dict[str, Any]) -> dict[str, Any]:
    name = raw.get("factory_name") or raw.get("occupier") or ""
    addr = raw.get("premises_address") or ""
    return {
        "dept": DEPT,
        "source_record_id": str(raw.get("license_no") or raw.get("id")),
        "legal_name_norm": normalise_name(name),
        "trade_name_norm": name_signature(name),
        "address_norm": normalise_address(addr),
        "pin": extract_pin(addr),
        "pan_pseudo": pseudonymise_pan(raw.get("pan")),
        "gstin_pseudo": pseudonymise_gstin(raw.get("gstin")),
        "extra": {
            "license_class": raw.get("license_class"),
            "last_inspection": raw.get("last_inspection"),
        },
    }


async def run() -> int:
    return 0
