"""Name similarity signal — Jaro-Winkler + (optional) MiniLM embeddings.

Returns a value in [0, 1]. The embedding model is loaded lazily so unit
tests that only need the lexical signal don't pay the import cost.
"""
from __future__ import annotations
from functools import lru_cache
import jellyfish

_MODEL = None  # lazy
_EMBED_WEIGHT = 0.4
_LEXICAL_WEIGHT = 0.6


def _lexical(a: str, b: str) -> float:
    if not a or not b:
        return 0.0
    return float(jellyfish.jaro_winkler_similarity(a, b))


@lru_cache(maxsize=1)
def _model():
    global _MODEL
    from sentence_transformers import SentenceTransformer
    _MODEL = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2")
    return _MODEL


def _semantic(a: str, b: str) -> float:
    try:
        m = _model()
        import numpy as np
        v = m.encode([a, b], normalize_embeddings=True)
        return float(np.clip(v[0] @ v[1], 0.0, 1.0))
    except Exception:
        # If model isn't available (e.g. CI without weights), fall back.
        return _lexical(a, b)


def name_similarity(a: str, b: str, *, use_embeddings: bool = False) -> float:
    """Combined name similarity. Lexical-only by default for determinism."""
    lex = _lexical(a, b)
    if not use_embeddings:
        return lex
    sem = _semantic(a, b)
    return _LEXICAL_WEIGHT * lex + _EMBED_WEIGHT * sem
