"""ECDSA (P-256) signing utilities used by VyaparCard and LiveLink.

Keys are loaded from PEM files referenced in the environment. In dev the
setup.sh script generates a keypair under ./secrets/.
"""
from __future__ import annotations
import os
from functools import lru_cache
from cryptography.hazmat.primitives import hashes, serialization
from cryptography.hazmat.primitives.asymmetric import ec
from cryptography.exceptions import InvalidSignature


@lru_cache(maxsize=1)
def _private_key() -> ec.EllipticCurvePrivateKey:
    path = os.environ.get("ECDSA_PRIVATE_KEY_PATH", "secrets/ec_private.pem")
    with open(path, "rb") as f:
        return serialization.load_pem_private_key(f.read(), password=None)  # type: ignore[return-value]


@lru_cache(maxsize=1)
def _public_key() -> ec.EllipticCurvePublicKey:
    return _private_key().public_key()


def sign(payload: bytes) -> bytes:
    return _private_key().sign(payload, ec.ECDSA(hashes.SHA256()))


def verify(payload: bytes, signature: bytes) -> bool:
    try:
        _public_key().verify(signature, payload, ec.ECDSA(hashes.SHA256()))
        return True
    except InvalidSignature:
        return False
