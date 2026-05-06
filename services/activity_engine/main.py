"""Activity Engine — FastAPI."""
from __future__ import annotations
from datetime import datetime
from fastapi import FastAPI
from pydantic import BaseModel
from .classifier import classify
from .checkin_scheduler import CheckInScheduler

app = FastAPI(title="VyaparDhara Activity Engine")
SCHEDULER = CheckInScheduler()


@app.get("/health")
async def health() -> dict[str, str]:
    return {"status": "ok"}


class EventIn(BaseModel):
    ubid: str
    dept: str
    event_type: str
    occurred_at: str
    payload: dict = {}


class ClassifyRequest(BaseModel):
    events: list[EventIn]


@app.post("/classify")
async def classify_endpoint(req: ClassifyRequest):
    c = classify([e.model_dump() for e in req.events])
    return {
        "status": c.status, "confidence": round(c.confidence, 4),
        "score": c.score, "evidence_chain": c.evidence_chain,
        "needs_field_check": c.needs_field_check,
    }


@app.get("/activity/events/{ubid}/overdue-check")
async def overdue_check(ubid: str):
    s = SCHEDULER.by_ubid.get(ubid)
    if not s:
        return {"ubid": ubid, "registered": False}
    return {
        "ubid": ubid, "registered": True,
        "last_verified_at": s.last_verified_at.isoformat() if s.last_verified_at else None,
        "due_at": s.due_at.isoformat(),
        "is_overdue": s.due_at <= datetime.utcnow(),
    }


class RegisterRequest(BaseModel):
    ubid: str
    last_verified_at: str | None = None


@app.post("/activity/events/register")
async def register(req: RegisterRequest):
    last = datetime.fromisoformat(req.last_verified_at) if req.last_verified_at else None
    c = SCHEDULER.register(req.ubid, last)
    return {"ubid": req.ubid, "due_at": c.due_at.isoformat()}
