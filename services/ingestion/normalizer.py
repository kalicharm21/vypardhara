"""Name and address normalisation.

Cleans whitespace, expands common Indian business abbreviations, removes
legal-form noise so two records that *look* different but refer to the same
entity have the highest chance of producing a matchable signature.
"""
from __future__ import annotations
import re
from typing import Final

_WS = re.compile(r"\s+")
_PUNCT = re.compile(r"[^\w\s/&-]")

# Common abbreviations seen across Karnataka department filings.
ABBR: Final[dict[str, str]] = {
    "pvt": "private",
    "pvt.": "private",
    "ltd": "limited",
    "ltd.": "limited",
    "co": "company",
    "co.": "company",
    "corp": "corporation",
    "mfg": "manufacturing",
    "indl": "industrial",
    "inds": "industries",
    "ent": "enterprises",
    "bros": "brothers",
    "bldg": "building",
    "rd": "road",
    "rd.": "road",
    "st": "street",
    "blr": "bangalore",
    "bglr": "bangalore",
    "bengaluru": "bangalore",
    "k.a": "karnataka",
    "ka": "karnataka",
}

# Legal-form tokens dropped from name signatures (kept on the shadow record
# but excluded from the matching key).
LEGAL_TOKENS: Final[set[str]] = {
    "private", "limited", "llp", "company", "corporation", "inc",
    "industries", "enterprises", "trust", "society", "partners",
}


def normalise_name(raw: str) -> str:
    s = (raw or "").lower().strip()
    s = _PUNCT.sub(" ", s)
    s = _WS.sub(" ", s)
    tokens = [ABBR.get(t, t) for t in s.split()]
    return " ".join(tokens).strip()


def name_signature(raw: str) -> str:
    """Name with legal-form noise removed — used as a coarse blocking key."""
    norm = normalise_name(raw)
    return " ".join(t for t in norm.split() if t not in LEGAL_TOKENS)


def normalise_address(raw: str) -> str:
    s = (raw or "").lower().strip()
    s = _PUNCT.sub(" ", s)
    s = _WS.sub(" ", s)
    tokens = [ABBR.get(t, t) for t in s.split()]
    return " ".join(tokens).strip()


_PIN_RE = re.compile(r"\b([1-9]\d{5})\b")


def extract_pin(addr: str) -> str | None:
    m = _PIN_RE.search(addr or "")
    return m.group(1) if m else None
