"""Labour Department adapter.

Fields of interest: estab_id, employer_name, factory_address, pan, gstin,
last_return_date. Schemas vary by district so we coerce defensively.
"""
from __future__ import annotations
from typing import Any
from ..normalizer import normalise_name, normalise_address, name_signature, extract_pin
from ..pseudonymizer import pseudonymise_pan, pseudonymise_gstin

DEPT = "labour"


def transform(raw: dict[str, Any]) -> dict[str, Any]:
    name = raw.get("employer_name") or raw.get("name") or ""
    addr = raw.get("factory_address") or raw.get("address") or ""
    return {
        "dept": DEPT,
        "source_record_id": str(raw.get("estab_id") or raw.get("id")),
        "legal_name_norm": normalise_name(name),
        "trade_name_norm": name_signature(name),
        "address_norm": normalise_address(addr),
        "pin": extract_pin(addr),
        "pan_pseudo": pseudonymise_pan(raw.get("pan")),
        "gstin_pseudo": pseudonymise_gstin(raw.get("gstin")),
        "extra": {"last_return_date": raw.get("last_return_date")},
    }


async def run() -> int:
    """Polled by the scheduler. In production this calls the dept HTTPS API.
    Returns the number of records ingested this cycle."""
    return 0
