"""Seeds activity events for every UBID so the classifier has data to score."""
from __future__ import annotations
import json
import random
from datetime import datetime, timedelta

random.seed(7)

EVENT_TYPES = [
    "livelink_verified", "field_visit_pass", "gst_return_filed",
    "labour_return_filed", "kspcb_consent_renewed", "shop_estab_renewed",
    "card_scanned", "salary_disbursed",
]


def make(ubid: str) -> list[dict]:
    n = random.randint(1, 8)
    out = []
    for _ in range(n):
        days_ago = random.randint(7, 540)
        out.append({
            "ubid": ubid,
            "dept": random.choice(["labour", "factories", "kspcb", "shop_estab"]),
            "event_type": random.choice(EVENT_TYPES),
            "occurred_at": (datetime.utcnow() - timedelta(days=days_ago)).isoformat(),
            "payload": {},
        })
    return out


if __name__ == "__main__":
    sample = [f"KA-{i:04X}-{i*7:04X}" for i in range(1, 501)]
    rows: list[dict] = []
    for u in sample:
        rows.extend(make(u))
    print(json.dumps(rows, indent=2))
