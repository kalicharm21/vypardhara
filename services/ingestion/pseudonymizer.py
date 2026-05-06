"""Deterministic pseudonymisation of PII.

PAN/GSTIN/phone/email are hashed with HMAC-SHA256 and a project-wide salt.
The same input always yields the same pseudonym, so equality joins still work
across departments without exposing the raw identifier.
"""
from __future__ import annotations
import hashlib
import hmac
from .config import settings


def _hmac(value: str) -> str:
    return hmac.new(
        settings.pseudonym_salt.encode("utf-8"),
        value.strip().upper().encode("utf-8"),
        hashlib.sha256,
    ).hexdigest()


def pseudonymise(value: str | None) -> str | None:
    if not value:
        return None
    return _hmac(value)[:32]


def pseudonymise_pan(pan: str | None) -> str | None:
    if not pan:
        return None
    pan = pan.strip().upper()
    # Sanity: PAN is 10 alphanum; reject obvious garbage so we don't merge on noise.
    if len(pan) != 10 or not pan.isalnum():
        return None
    return _hmac(pan)[:32]


def pseudonymise_gstin(gstin: str | None) -> str | None:
    if not gstin:
        return None
    gstin = gstin.strip().upper()
    if len(gstin) != 15 or not gstin.isalnum():
        return None
    return _hmac(gstin)[:32]
