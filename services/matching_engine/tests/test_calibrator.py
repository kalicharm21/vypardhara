from services.matching_engine.thresholds.calibrator import calibrate


def test_calibrator_returns_high_precision_threshold():
    # 20 matches at high scores, 20 non-matches at low scores
    scores = [0.95, 0.92, 0.91, 0.90, 0.88] * 4 + [0.40, 0.35, 0.30, 0.25, 0.20] * 4
    labels = [1] * 20 + [0] * 20
    t = calibrate(scores, labels, target_precision=0.99)
    assert t.precision_at_auto >= 0.99
    assert t.auto_merge >= t.review
