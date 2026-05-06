# Architecture

## Three-layer model

```
   ┌──────────────────────────────────────────────────────────────┐
   │ Layer 3 — LiveLink         Real-time video + GPS verification│
   ├──────────────────────────────────────────────────────────────┤
   │ Layer 2 — VyaparCard       Tamper-evident physical identity  │
   ├──────────────────────────────────────────────────────────────┤
   │ Layer 1 — UBID Engine      Entity resolution across 40+ depts│
   └──────────────────────────────────────────────────────────────┘
                               │
                ┌──────────────┴──────────────┐
                │     Activity Engine         │
                │ Active / Dormant / Closed   │
                └─────────────────────────────┘
```

## Data flow

1. **Ingestion** polls department APIs on a schedule. Each record is normalised
   (name/address cleaning, abbreviation expansion) and PII fields are
   pseudonymised before storage in the shadow schema.
2. **Matching Engine** computes a **four-signal similarity score**:
   - Name similarity (Jaro-Winkler + MiniLM embeddings)
   - Address similarity (PIN code anchoring + RapidFuzz)
   - PAN/GSTIN exact match (anchor signals)
   - Intra-department signature
   A weighted composite is calibrated against held-out labelled pairs to
   produce **auto-merge**, **review**, and **reject** thresholds.
3. **Graph Builder** writes nodes/edges to Neo4j; connected components
   become **UBID clusters**. The **UBID Registry** assigns stable IDs and
   handles merge/split operations.
4. **VyaparCard Service** issues a signed credential (QR + ECDSA) for each
   confirmed UBID. Scans are logged to the audit trail.
5. **LiveLink Service** runs WebSocket video sessions with per-frame ECDSA
   signing and GPS binding. Sessions auto-generate verification reports.
6. **Activity Engine** consumes events from all departments, scores them
   with a recency-weighted decay function, and classifies businesses as
   Active / Dormant / Closed. Schedules a 9-month periodic LiveLink check.

## Precision-first ER

A wrong merge destroys trust. Thresholds are tuned for **>99% precision**
even at the cost of recall — borderline pairs go to the human review queue.
Reviewer decisions feed back into a logistic-regression model that
re-calibrates thresholds nightly.

## Privacy

- PII is pseudonymised at the ingestion boundary.
- Source systems are **never modified** — VyaparDhara maintains a parallel
  shadow schema.
- Every read/write is logged to an immutable audit trail.
