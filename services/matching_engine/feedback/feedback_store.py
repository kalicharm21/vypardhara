"""Persists labelled (record_a, record_b, decision) tuples from reviewers.
This is the training set the calibrator and retrainer consume."""
from __future__ import annotations
from dataclasses import dataclass, asdict
from datetime import datetime
import json
from pathlib import Path


@dataclass
class FeedbackRow:
    a: str
    b: str
    score: float
    decision: str  # 'merge' | 'reject' | 'split'
    reviewer: str
    ts: str


class FeedbackStore:
    def __init__(self, path: str | Path = "feedback.jsonl") -> None:
        self.path = Path(path)
        self.path.touch(exist_ok=True)

    def append(self, row: FeedbackRow) -> None:
        with self.path.open("a") as f:
            f.write(json.dumps(asdict(row)) + "\n")

    def all(self) -> list[FeedbackRow]:
        if not self.path.exists():
            return []
        out: list[FeedbackRow] = []
        for line in self.path.read_text().splitlines():
            if not line.strip():
                continue
            out.append(FeedbackRow(**json.loads(line)))
        return out

    @staticmethod
    def make(a: str, b: str, score: float, decision: str, reviewer: str) -> FeedbackRow:
        return FeedbackRow(a=a, b=b, score=score, decision=decision,
                           reviewer=reviewer, ts=datetime.utcnow().isoformat())
