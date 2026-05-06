"""VyaparCard service — issuance, scan verification, delegate management."""
from __future__ import annotations
import os
import secrets
from datetime import datetime
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import jwt
from .card_generator import issue_card, JWT_ALG
from .delegate_manager import DelegateManager
from .field_verification import FieldVisitLog, FieldVisit, gps_within_premises

app = FastAPI(title="VyaparDhara VyaparCard Service")
DELEGATES = DelegateManager()
FIELD_LOG = FieldVisitLog()
JWT_SECRET = os.environ.get("JWT_SECRET", "dev-secret")


@app.get("/health")
async def health() -> dict[str, str]:
    return {"status": "ok"}


class IssueRequest(BaseModel):
    ubid: str
    valid_days: int = 365


@app.post("/card/issue")
async def card_issue(req: IssueRequest):
    serial = f"VC-{secrets.token_hex(4).upper()}"
    card = issue_card(req.ubid, serial, JWT_SECRET, valid_days=req.valid_days)
    return card.__dict__


class ScanRequest(BaseModel):
    token: str
    lat: float | None = None
    lng: float | None = None
    officer_id: str | None = None


@app.post("/card/scan")
async def card_scan(req: ScanRequest):
    try:
        claims = jwt.decode(req.token, JWT_SECRET, algorithms=[JWT_ALG])
    except jwt.PyJWTError as e:
        raise HTTPException(401, f"invalid token: {e}")
    return {
        "valid": True,
        "ubid": claims["ubid"],
        "serial": claims["serial"],
        "expires_at": datetime.utcfromtimestamp(claims["exp"]).isoformat(),
        "scanned_at": datetime.utcnow().isoformat(),
    }


class DelegateRequest(BaseModel):
    ubid: str
    name: str
    role: str
    scopes: list[str]
    valid_days: int = 30


@app.post("/delegate")
async def delegate_issue(req: DelegateRequest):
    d = DELEGATES.issue(req.ubid, req.name, req.role, req.scopes, valid_days=req.valid_days)
    return {
        "delegate_id": d.delegate_id, "ubid": d.ubid, "name": d.name,
        "role": d.role, "scopes": d.scopes,
        "issued_at": d.issued_at.isoformat(), "expires_at": d.expires_at.isoformat(),
    }


@app.delete("/delegate/{delegate_id}")
async def delegate_revoke(delegate_id: str):
    if not DELEGATES.revoke(delegate_id):
        raise HTTPException(404, "delegate not found or already revoked")
    return {"revoked": delegate_id}


class FieldVisitRequest(BaseModel):
    ubid: str
    officer_id: str
    lat: float
    lng: float
    registered_lat: float
    registered_lng: float
    notes: str = ""
    photo_count: int = 0


@app.post("/field-visit")
async def field_visit(req: FieldVisitRequest):
    visit = FieldVisit(
        visit_id=f"FV-{secrets.token_hex(4).upper()}",
        ubid=req.ubid, officer_id=req.officer_id,
        lat=req.lat, lng=req.lng, captured_at=datetime.utcnow(),
        notes=req.notes, photo_count=req.photo_count,
    )
    FIELD_LOG.record(visit)
    in_range = gps_within_premises((req.lat, req.lng), (req.registered_lat, req.registered_lng))
    return {"visit_id": visit.visit_id, "within_premises": in_range}
