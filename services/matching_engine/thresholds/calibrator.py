"""Threshold calibrator — derives auto-merge / review / reject thresholds
from a labelled set of (score, is_match) pairs by maximising precision
subject to a recall floor.

This is the safety brain of the matching engine. Run nightly against the
accumulated reviewer feedback (see feedback/model_retrainer.py)."""
from __future__ import annotations
from dataclasses import dataclass, asdict
import json
from pathlib import Path
import numpy as np


@dataclass
class Thresholds:
    auto_merge: float       # >= ⇒ auto-link
    review: float           # >= ⇒ goes to human queue
    # < review ⇒ rejected
    precision_at_auto: float
    recall_at_auto: float
    n_pairs: int


def calibrate(scores: list[float], labels: list[int],
              *, target_precision: float = 0.99,
              review_recall_floor: float = 0.85) -> Thresholds:
    if len(scores) != len(labels) or not scores:
        raise ValueError("scores and labels must be non-empty equal length")

    s = np.asarray(scores, dtype=float)
    y = np.asarray(labels, dtype=int)
    order = np.argsort(-s)
    s, y = s[order], y[order]

    tp = np.cumsum(y == 1)
    fp = np.cumsum(y == 0)
    total_pos = max(int(y.sum()), 1)
    precision = tp / np.maximum(tp + fp, 1)
    recall = tp / total_pos

    # auto_merge: lowest threshold where precision >= target
    eligible = np.where(precision >= target_precision)[0]
    auto_idx = int(eligible[-1]) if len(eligible) else 0
    auto_t = float(s[auto_idx])

    # review: lowest threshold where recall >= floor
    rev_eligible = np.where(recall >= review_recall_floor)[0]
    rev_idx = int(rev_eligible[0]) if len(rev_eligible) else len(s) - 1
    review_t = float(min(auto_t, s[rev_idx]))

    return Thresholds(
        auto_merge=round(auto_t, 4),
        review=round(review_t, 4),
        precision_at_auto=round(float(precision[auto_idx]), 4),
        recall_at_auto=round(float(recall[auto_idx]), 4),
        n_pairs=len(s),
    )


def write_config(t: Thresholds, path: str | Path) -> None:
    Path(path).write_text(json.dumps(asdict(t), indent=2))


def load_config(path: str | Path) -> Thresholds:
    data = json.loads(Path(path).read_text())
    return Thresholds(**data)
