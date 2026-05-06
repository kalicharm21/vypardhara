from services.vyaparcard.field_verification import gps_within_premises, haversine_m


def test_haversine_zero():
    assert haversine_m((12.97, 77.59), (12.97, 77.59)) < 1e-3


def test_within_premises_tolerance():
    a = (12.9716, 77.5946)        # MG Road, Bangalore
    b = (12.9718, 77.5947)        # ~25 m away
    assert gps_within_premises(a, b, tolerance_m=150)
    far = (12.9800, 77.6100)
    assert not gps_within_premises(a, far, tolerance_m=150)
