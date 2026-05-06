from services.matching_engine.similarity.composite_scorer import score_pair, Record


def _r(name="acme", addr="12 mg road bangalore 560001", pin="560001", pan=None, gstin=None, dept="labour"):
    return Record(name, addr, pin, pan, gstin, dept)


def test_identical_records_score_high():
    e = score_pair(_r(), _r())
    assert e.score > 0.9


def test_pan_match_is_decisive():
    e = score_pair(_r(pan="abc", name="acme industries"), _r(pan="abc", name="acme inds"))
    assert e.rule_fired == "pan-match+name" and e.score >= 0.99


def test_pan_mismatch_zeroes_score():
    e = score_pair(_r(pan="abc"), _r(pan="xyz"))
    assert e.score == 0.0 and e.rule_fired == "pan-mismatch"


def test_pin_mismatch_drops_address_score():
    e = score_pair(_r(pin="560001"), _r(pin="560058"))
    # address signal heavily damped
    assert e.address < 0.4
