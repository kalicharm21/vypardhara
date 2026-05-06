"""UBID Registry — assigns, looks up, merges and splits Unified Business IDs.

The registry is the system of record for the cluster→UBID mapping. Every
mutation is appended to an audit log."""
from __future__ import annotations
from dataclasses import dataclass, field
from datetime import datetime
import secrets
from typing import Iterable


def _new_ubid() -> str:
    # Format: KA-XXXX-XXXX  (Karnataka prefix)
    a = secrets.token_hex(2).upper()
    b = secrets.token_hex(2).upper()
    return f"KA-{a}-{b}"


@dataclass
class Audit:
    ts: datetime
    action: str          # 'assign' | 'merge' | 'split' | 'add'
    ubid: str
    details: dict


@dataclass
class UbidRegistry:
    record_to_ubid: dict[str, str] = field(default_factory=dict)
    ubid_to_records: dict[str, set[str]] = field(default_factory=dict)
    audit: list[Audit] = field(default_factory=list)

    def assign(self, records: Iterable[str]) -> str:
        ubid = _new_ubid()
        bag = set(records)
        self.ubid_to_records[ubid] = bag
        for r in bag:
            self.record_to_ubid[r] = ubid
        self.audit.append(Audit(datetime.utcnow(), "assign", ubid, {"records": sorted(bag)}))
        return ubid

    def lookup(self, record_id: str) -> str | None:
        return self.record_to_ubid.get(record_id)

    def add_record(self, ubid: str, record_id: str) -> None:
        if ubid not in self.ubid_to_records:
            raise KeyError(ubid)
        self.ubid_to_records[ubid].add(record_id)
        self.record_to_ubid[record_id] = ubid
        self.audit.append(Audit(datetime.utcnow(), "add", ubid, {"record": record_id}))

    def merge(self, keep: str, drop: str) -> str:
        if keep == drop or drop not in self.ubid_to_records:
            return keep
        moved = self.ubid_to_records.pop(drop)
        self.ubid_to_records[keep].update(moved)
        for r in moved:
            self.record_to_ubid[r] = keep
        self.audit.append(Audit(datetime.utcnow(), "merge", keep,
                                {"absorbed": drop, "records_moved": sorted(moved)}))
        return keep

    def split(self, ubid: str, records_to_extract: Iterable[str]) -> str:
        bag = self.ubid_to_records.get(ubid, set())
        extract = set(records_to_extract) & bag
        if not extract:
            return ubid
        self.ubid_to_records[ubid] = bag - extract
        new_ubid = self.assign(extract)
        self.audit.append(Audit(datetime.utcnow(), "split", ubid,
                                {"new_ubid": new_ubid, "records": sorted(extract)}))
        return new_ubid
