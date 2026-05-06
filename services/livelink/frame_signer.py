"""Per-frame ECDSA signing.

Each video frame coming through the WebSocket is hashed together with the
GPS reading of that moment; the signature lets the dashboard prove the
frame came from this session and was not edited or relocated post-hoc.
"""
from __future__ import annotations
import base64
import hashlib
import os
from cryptography.hazmat.primitives import hashes, serialization
from cryptography.hazmat.primitives.asymmetric import ec


def _load_private() -> ec.EllipticCurvePrivateKey:
    path = os.environ.get("ECDSA_PRIVATE_KEY_PATH", "secrets/ec_private.pem")
    with open(path, "rb") as f:
        return serialization.load_pem_private_key(f.read(), password=None)  # type: ignore[return-value]


def frame_digest(frame_bytes: bytes, *, lat: float, lng: float, ts_ms: int) -> bytes:
    h = hashlib.sha256()
    h.update(frame_bytes)
    h.update(f"|{lat:.6f}|{lng:.6f}|{ts_ms}".encode())
    return h.digest()


def sign_frame(frame_bytes: bytes, *, lat: float, lng: float, ts_ms: int,
               key: ec.EllipticCurvePrivateKey | None = None) -> str:
    """Returns base64-encoded ECDSA signature."""
    digest = frame_digest(frame_bytes, lat=lat, lng=lng, ts_ms=ts_ms)
    sk = key or _load_private()
    sig = sk.sign(digest, ec.ECDSA(hashes.SHA256()))
    return base64.b64encode(sig).decode()
