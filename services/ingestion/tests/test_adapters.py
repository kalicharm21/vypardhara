from services.ingestion.dept_adapters import labour, factories, kspcb, shop_estab


def test_labour_transform_minimal():
    r = labour.transform({"estab_id": "L-1", "employer_name": "Acme Pvt Ltd",
                          "factory_address": "12 MG Rd, Bangalore 560001", "pan": "ABCDE1234F"})
    assert r["dept"] == "labour" and r["pin"] == "560001"
    assert r["pan_pseudo"] is not None and len(r["pan_pseudo"]) == 32


def test_factories_invalid_pan_is_none():
    r = factories.transform({"license_no": "F-9", "factory_name": "X", "premises_address": "y", "pan": "junk"})
    assert r["pan_pseudo"] is None


def test_kspcb_carries_consent_category():
    r = kspcb.transform({"consent_no": "K-1", "unit_name": "Z", "site_address": "addr 560058",
                         "consent_category": "orange"})
    assert r["extra"]["consent_category"] == "orange"


def test_shop_estab_basic():
    r = shop_estab.transform({"registration_no": "S-1", "trade_name": "Q",
                              "shop_address": "addr 560040", "employee_count": 4})
    assert r["dept"] == "shop_estab" and r["extra"]["employee_count"] == 4
