"""Matching Engine — FastAPI entrypoint."""
from __future__ import annotations
from fastapi import FastAPI
from pydantic import BaseModel, Field
from .similarity.composite_scorer import score_pair, Record
from .graph.graph_builder import GraphBuilder, Edge
from .graph.cluster_resolver import resolve_clusters
from .graph.ubid_registry import UbidRegistry
from .thresholds.calibrator import load_config

app = FastAPI(title="VyaparDhara Matching Engine")
THRESHOLDS = load_config("thresholds/threshold_config.json")
REGISTRY = UbidRegistry()


class RecordIn(BaseModel):
    record_id: str
    name_norm: str
    address_norm: str
    pin: str | None = None
    pan_pseudo: str | None = None
    gstin_pseudo: str | None = None
    dept: str


class MatchRequest(BaseModel):
    a: RecordIn
    b: RecordIn
    use_embeddings: bool = False


@app.get("/health")
async def health() -> dict[str, object]:
    return {"status": "ok", "thresholds": THRESHOLDS.__dict__}


@app.post("/match")
async def match(req: MatchRequest):
    expl = score_pair(
        Record(req.a.name_norm, req.a.address_norm, req.a.pin, req.a.pan_pseudo, req.a.gstin_pseudo, req.a.dept),
        Record(req.b.name_norm, req.b.address_norm, req.b.pin, req.b.pan_pseudo, req.b.gstin_pseudo, req.b.dept),
        use_embeddings=req.use_embeddings,
    )
    decision = (
        "auto-merge" if expl.score >= THRESHOLDS.auto_merge
        else "review" if expl.score >= THRESHOLDS.review
        else "reject"
    )
    return {
        "score": expl.score,
        "decision": decision,
        "signals": {
            "name": expl.name, "address": expl.address,
            "pan": expl.pan.score, "pan_anchor": expl.pan.is_anchor,
            "gstin": expl.gstin.score, "gstin_anchor": expl.gstin.is_anchor,
            "intra_dept": expl.intra_dept,
        },
        "rule_fired": expl.rule_fired,
    }


class ClusterRequest(BaseModel):
    records: list[RecordIn] = Field(min_length=2)


@app.post("/ubid/assign")
async def assign(req: ClusterRequest):
    """Score all pairs, build the graph, return cluster → UBID assignments."""
    g = GraphBuilder()
    for r in req.records:
        g.add_record(r.record_id, dept=r.dept, name=r.name_norm)
    for i, a in enumerate(req.records):
        for b in req.records[i + 1:]:
            ex = score_pair(
                Record(a.name_norm, a.address_norm, a.pin, a.pan_pseudo, a.gstin_pseudo, a.dept),
                Record(b.name_norm, b.address_norm, b.pin, b.pan_pseudo, b.gstin_pseudo, b.dept),
            )
            if ex.score >= THRESHOLDS.review:
                g.add_edge(Edge(a.record_id, b.record_id, ex.score, ex.rule_fired))
    clusters = resolve_clusters(g, THRESHOLDS.auto_merge)
    out = []
    for c in clusters:
        if len(c) <= 1:
            continue
        ubid = REGISTRY.assign(c)
        out.append({"ubid": ubid, "members": sorted(c)})
    return {"clusters": out, "graph": g.to_dict()}
