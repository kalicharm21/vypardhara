"""Generates 500+ noisy synthetic business records spread across four
Karnataka departments, with intentional variations (abbreviations,
typos, partial PAN drops) so the matching engine has something to chew on.

Run:  python database/seeds/generate_synthetic_data.py > seed.json
"""
from __future__ import annotations
import json
import random
import string
from typing import Any

random.seed(42)

DEPTS = ["labour", "factories", "kspcb", "shop_estab"]
LEGAL_FORMS = ["Pvt Ltd", "Industries", "Enterprises", "& Co", "LLP"]
NAME_BASES = [
    "Sapthagiri", "Nandi", "Vidya", "Ganesha", "Karnataka Steel", "Bharat Tex",
    "Mysore Foods", "Hubli Polymers", "Bangalore Bio", "Tumkur Agro",
]
PIN_POOL = ["560001", "560058", "560029", "560100", "560040", "580020", "570001"]
ROADS = ["MG Road", "Hosur Road", "Brigade Road", "Outer Ring Rd", "Industrial Estate"]


def _pan() -> str:
    return "".join(random.choices(string.ascii_uppercase, k=5)) + \
           "".join(random.choices(string.digits, k=4)) + \
           random.choice(string.ascii_uppercase)


def _gstin(pan: str) -> str:
    return f"29{pan}1Z5"


def _noise(s: str) -> str:
    if random.random() < 0.3:
        s = s.replace("Pvt Ltd", "Pvt. Ltd.")
    if random.random() < 0.2:
        s = s.replace("Road", "Rd.")
    if random.random() < 0.1 and len(s) > 5:
        i = random.randint(0, len(s) - 2)
        s = s[:i] + s[i+1] + s[i] + s[i+2:]    # transpose two letters
    return s


def make_business(idx: int) -> list[dict[str, Any]]:
    base = f"{random.choice(NAME_BASES)} {random.choice(NAME_BASES)} {random.choice(LEGAL_FORMS)}"
    pin = random.choice(PIN_POOL)
    addr = f"{random.randint(1,400)}, {random.choice(ROADS)}, Bangalore {pin}"
    pan = _pan()
    gstin = _gstin(pan)
    n_depts = random.choices([1, 2, 3, 4], weights=[20, 35, 30, 15])[0]
    chosen = random.sample(DEPTS, n_depts)
    out = []
    for dept in chosen:
        # Drop PAN/GSTIN ~25% of the time per dept to simulate real noise.
        rec_pan = pan if random.random() > 0.25 else None
        rec_gst = gstin if random.random() > 0.30 else None
        out.append({
            "dept": dept, "id": f"{dept[:3].upper()}-{idx:05d}",
            "name": _noise(base), "address": _noise(addr),
            "pan": rec_pan, "gstin": rec_gst,
        })
    return out


def main(n_business: int = 500) -> None:
    rows: list[dict] = []
    for i in range(n_business):
        rows.extend(make_business(i))
    print(json.dumps(rows, indent=2))


if __name__ == "__main__":
    main()
