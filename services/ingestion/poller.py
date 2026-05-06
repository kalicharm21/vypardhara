"""Background poller — fetches department APIs on a schedule and pushes
records into the shadow schema."""
from __future__ import annotations
import logging
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from .config import settings
from .dept_adapters import labour, factories, kspcb, shop_estab

log = logging.getLogger("poller")

ADAPTERS = [
    (labour, settings.poll_interval_labour),
    (factories, settings.poll_interval_factories),
    (kspcb, settings.poll_interval_kspcb),
    (shop_estab, settings.poll_interval_shop_estab),
]


def build_scheduler() -> AsyncIOScheduler:
    sched = AsyncIOScheduler()
    for adapter, interval in ADAPTERS:
        sched.add_job(
            adapter.run, "interval",
            seconds=interval, id=adapter.DEPT, max_instances=1, coalesce=True,
        )
        log.info("scheduled %s every %ss", adapter.DEPT, interval)
    return sched
