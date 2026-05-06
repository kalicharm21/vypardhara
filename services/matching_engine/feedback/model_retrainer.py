"""Logistic regression on accumulated reviewer feedback.

Inputs: per-pair signal vector [name, address, pan, gstin, intra_dept].
Output: re-fitted model + recommended thresholds.
"""
from __future__ import annotations
from dataclasses import dataclass
import numpy as np
from sklearn.linear_model import LogisticRegression
from .feedback_store import FeedbackStore
from ..thresholds.calibrator import calibrate, Thresholds


@dataclass
class TrainResult:
    coefficients: list[float]
    intercept: float
    thresholds: Thresholds


def train(features: np.ndarray, labels: np.ndarray) -> TrainResult:
    """features: (n, 5)  labels: (n,) in {0,1}"""
    if len(features) < 20:
        raise ValueError("not enough labelled pairs to retrain (need ≥ 20)")
    clf = LogisticRegression(class_weight="balanced", max_iter=1000)
    clf.fit(features, labels)
    probs = clf.predict_proba(features)[:, 1]
    thr = calibrate(probs.tolist(), labels.tolist())
    return TrainResult(
        coefficients=clf.coef_[0].round(4).tolist(),
        intercept=float(round(clf.intercept_[0], 4)),
        thresholds=thr,
    )


def retrain_from_store(store: FeedbackStore, signal_lookup) -> TrainResult:
    """`signal_lookup(a, b)` returns the 5-vector for a pair."""
    rows = [r for r in store.all() if r.decision in ("merge", "reject")]
    if not rows:
        raise ValueError("no feedback rows yet")
    X = np.array([signal_lookup(r.a, r.b) for r in rows], dtype=float)
    y = np.array([1 if r.decision == "merge" else 0 for r in rows], dtype=int)
    return train(X, y)
