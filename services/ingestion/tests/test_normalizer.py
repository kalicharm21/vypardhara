from services.ingestion.normalizer import (
    normalise_name, name_signature, normalise_address, extract_pin,
)


def test_normalise_name_lowers_and_strips_punct():
    assert normalise_name("M/s. Acme Pvt. Ltd.") == "m s acme private limited"


def test_name_signature_drops_legal_tokens():
    assert name_signature("Acme Industries Pvt Ltd") == "acme"


def test_normalise_address_expands_abbr():
    out = normalise_address("12, MG Rd., Blr - 560001")
    assert "road" in out and "bangalore" in out


def test_extract_pin():
    assert extract_pin("Hosur Rd, Bangalore 560029") == "560029"
    assert extract_pin("no pin here") is None
