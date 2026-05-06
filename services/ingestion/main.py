"""FastAPI entrypoint — Ingestion service."""
from __future__ import annotations
import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from pydantic import BaseModel
from .poller import build_scheduler
from .dept_adapters import labour, factories, kspcb, shop_estab

logging.basicConfig(level=logging.INFO)
log = logging.getLogger("ingestion")

ADAPTERS = {a.DEPT: a for a in (labour, factories, kspcb, shop_estab)}


@asynccontextmanager
async def lifespan(_: FastAPI):
    sched = build_scheduler()
    sched.start()
    log.info("ingestion service started")
    try:
        yield
    finally:
        sched.shutdown(wait=False)


app = FastAPI(title="VyaparDhara Ingestion", lifespan=lifespan)


@app.get("/health")
async def health() -> dict[str, str]:
    return {"status": "ok"}


class IngestRequest(BaseModel):
    dept: str


@app.post("/ingest")
async def ingest(req: IngestRequest) -> dict[str, int | str]:
    """Manually trigger an ingestion cycle for a single department."""
    adapter = ADAPTERS.get(req.dept)
    if not adapter:
        return {"error": f"unknown dept '{req.dept}'"}
    n = await adapter.run()
    return {"dept": req.dept, "ingested": n}
