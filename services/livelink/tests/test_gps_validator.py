import time
from services.livelink.gps_validator import GPSValidator


def test_gps_in_range_no_breach():
    v = GPSValidator((12.97, 77.59))
    s = v.update(12.9701, 77.5901, time.time())
    assert s["in_range"] and not s["integrity_breach"]


def test_drift_triggers_breach_after_grace():
    v = GPSValidator((12.97, 77.59), drift_grace_s=2)
    t0 = 1000.0
    v.update(13.10, 77.59, t0)            # drift starts
    v.update(13.10, 77.59, t0 + 1)        # within grace
    out = v.update(13.10, 77.59, t0 + 5)  # past grace
    assert out["integrity_breach"]
