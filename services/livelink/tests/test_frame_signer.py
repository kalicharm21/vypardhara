from cryptography.hazmat.primitives.asymmetric import ec
from services.livelink.frame_signer import sign_frame, frame_digest


def test_frame_digest_changes_with_gps():
    a = frame_digest(b"frame", lat=12.97, lng=77.59, ts_ms=1)
    b = frame_digest(b"frame", lat=12.98, lng=77.59, ts_ms=1)
    assert a != b


def test_sign_frame_with_inline_key_returns_b64():
    sk = ec.generate_private_key(ec.SECP256R1())
    sig = sign_frame(b"frame", lat=12.97, lng=77.59, ts_ms=1, key=sk)
    assert isinstance(sig, str) and len(sig) > 40
