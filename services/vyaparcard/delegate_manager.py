"""Sub-credentials issued to delegates (e.g. site managers, auditors).
Each delegate gets a short-lived child token bound to the master UBID and
revocable by the business owner from the dashboard."""
from __future__ import annotations
from dataclasses import dataclass, field
from datetime import datetime, timedelta
import secrets
from typing import Iterable


@dataclass
class Delegate:
    delegate_id: str
    ubid: str
    name: str
    role: str                # 'site-manager' | 'auditor' | 'signatory'
    scopes: list[str]        # e.g. ['livelink:start', 'submit:return']
    issued_at: datetime
    expires_at: datetime
    revoked_at: datetime | None = None

    @property
    def is_active(self) -> bool:
        now = datetime.utcnow()
        return self.revoked_at is None and self.issued_at <= now <= self.expires_at


@dataclass
class DelegateManager:
    by_id: dict[str, Delegate] = field(default_factory=dict)

    def issue(self, ubid: str, name: str, role: str,
              scopes: Iterable[str], *, valid_days: int = 30) -> Delegate:
        d = Delegate(
            delegate_id=f"DLG-{secrets.token_hex(4).upper()}",
            ubid=ubid, name=name, role=role, scopes=list(scopes),
            issued_at=datetime.utcnow(),
            expires_at=datetime.utcnow() + timedelta(days=valid_days),
        )
        self.by_id[d.delegate_id] = d
        return d

    def revoke(self, delegate_id: str) -> bool:
        d = self.by_id.get(delegate_id)
        if not d or d.revoked_at:
            return False
        d.revoked_at = datetime.utcnow()
        return True

    def for_ubid(self, ubid: str) -> list[Delegate]:
        return [d for d in self.by_id.values() if d.ubid == ubid]
