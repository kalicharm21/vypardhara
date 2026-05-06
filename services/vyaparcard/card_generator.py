"""Issues a VyaparCard for a UBID — the card is a printable artifact whose
QR code encodes a JWT bearing the UBID + a server signature."""
from __future__ import annotations
import base64
import io
import json
from datetime import datetime, timedelta
from dataclasses import dataclass
import jwt
import qrcode
from .crypto_signer import sign


JWT_ALG = "HS256"  # symmetric for the JWT envelope; the QR payload itself
                   # carries an additional ECDSA signature for offline verification.


@dataclass
class IssuedCard:
    ubid: str
    serial: str
    qr_png_b64: str          # base64 PNG of the QR for direct render
    token: str               # JWT
    signature_b64: str       # ECDSA signature over (ubid|serial|issued_at)
    issued_at: str
    expires_at: str


def issue_card(ubid: str, serial: str, jwt_secret: str, *, valid_days: int = 365) -> IssuedCard:
    issued = datetime.utcnow()
    expires = issued + timedelta(days=valid_days)
    token = jwt.encode(
        {"ubid": ubid, "serial": serial, "iat": int(issued.timestamp()),
         "exp": int(expires.timestamp())},
        jwt_secret, algorithm=JWT_ALG,
    )
    payload = f"{ubid}|{serial}|{int(issued.timestamp())}".encode()
    sig = sign(payload)

    img = qrcode.make(json.dumps({"t": token, "s": base64.b64encode(sig).decode()}))
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    return IssuedCard(
        ubid=ubid,
        serial=serial,
        qr_png_b64=base64.b64encode(buf.getvalue()).decode(),
        token=token,
        signature_b64=base64.b64encode(sig).decode(),
        issued_at=issued.isoformat(),
        expires_at=expires.isoformat(),
    )
