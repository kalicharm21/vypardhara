"""LiveLink service — FastAPI + WebSocket.

REST:
  POST /session/start  → create session
  POST /session/end    → finalise + return report
WebSocket:
  /ws/{session_id}     → client streams { frame_b64, lat, lng, ts_ms } messages
"""
from __future__ import annotations
import base64
from datetime import datetime
import json
import time
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException
from pydantic import BaseModel
from .session_manager import SessionManager
from .frame_signer import sign_frame
from .report_generator import SessionReport, decide_outcome

app = FastAPI(title="VyaparDhara LiveLink Service")
SESSIONS = SessionManager()


@app.get("/health")
async def health() -> dict[str, str]:
    return {"status": "ok"}


class StartRequest(BaseModel):
    ubid: str
    officer_id: str
    registered_lat: float
    registered_lng: float


@app.post("/session/start")
async def start(req: StartRequest):
    s = SESSIONS.start(req.ubid, req.officer_id, req.registered_lat, req.registered_lng)
    return {"session_id": s.session_id, "started_at": s.started_at.isoformat()}


class EndRequest(BaseModel):
    session_id: str


@app.post("/session/end")
async def end(req: EndRequest):
    s = SESSIONS.end(req.session_id)
    if not s:
        raise HTTPException(404, "session not found")
    duration = int((s.ended_at - s.started_at).total_seconds()) if s.ended_at else 0
    last_gps = s.gps.update(s.registered_lat, s.registered_lng, ts=time.time())
    outcome = decide_outcome(
        gps_match=last_gps["in_range"] and not s.gps.integrity_breach,
        integrity_breach=s.gps.integrity_breach,
        duration_s=duration,
        screenshots=len(s.screenshots.captured),
    )
    report = SessionReport(
        session_id=s.session_id, ubid=s.ubid, officer_id=s.officer_id,
        started_at=s.started_at, ended_at=s.ended_at or datetime.utcnow(),
        duration_s=duration, gps_match=not s.gps.integrity_breach,
        integrity_breach=s.gps.integrity_breach,
        screenshots=len(s.screenshots.captured), outcome=outcome,
    )
    return report.to_dict()


@app.websocket("/ws/{session_id}")
async def ws(ws_conn: WebSocket, session_id: str):
    await ws_conn.accept()
    s = SESSIONS.sessions.get(session_id)
    if not s:
        await ws_conn.close(code=4404)
        return
    try:
        while True:
            raw = await ws_conn.receive_text()
            msg = json.loads(raw)
            frame_bytes = base64.b64decode(msg["frame_b64"])
            lat, lng, ts_ms = float(msg["lat"]), float(msg["lng"]), int(msg["ts_ms"])
            sig = sign_frame(frame_bytes, lat=lat, lng=lng, ts_ms=ts_ms)
            gps_state = s.gps.update(lat, lng, ts=time.time())
            shot = s.screenshots.maybe_capture(
                now_s=time.time(), lat=lat, lng=lng,
                frame_signature=sig, frame_url=f"sessions/{session_id}/{ts_ms}.jpg",
            )
            await ws_conn.send_json({
                "ack_ts_ms": ts_ms, "signature": sig,
                "gps": gps_state,
                "screenshot_captured": shot is not None,
            })
    except WebSocketDisconnect:
        return
