import jwt
from services.vyaparcard.card_generator import issue_card, JWT_ALG


def test_issue_card_returns_decodable_token(monkeypatch, tmp_path):
    # crypto_signer is loaded lazily; bypass real key by stubbing sign.
    import services.vyaparcard.card_generator as cg
    monkeypatch.setattr(cg, "sign", lambda payload: b"\x00" * 16)
    card = issue_card("KA-AAAA-BBBB", "VC-TEST", "secret", valid_days=10)
    claims = jwt.decode(card.token, "secret", algorithms=[JWT_ALG])
    assert claims["ubid"] == "KA-AAAA-BBBB"
    assert card.qr_png_b64.startswith("iVBOR")  # PNG signature in base64
