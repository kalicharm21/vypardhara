# VyaparDhara

> Connecting database truth to physical truth — a unified business identity & live verification platform for government departments.

VyaparDhara is a three-layer intelligence platform built for the **AI for Bharat** challenge (PAN IIT Bangalore, Theme 1 — Karnataka Commerce & Industries):

1. **UBID Engine** — AI-powered entity resolution that links business records across 40+ department systems (Labour, Factories, KSPCB, Shop & Establishment, GST, MCA, etc.) into a single Unified Business ID.
2. **VyaparCard** — A tamper-evident physical + digital identity card issued to every verified business. Required for any government interaction.
3. **LiveLink** — Real-time GPS-stamped video verification protocol. When physical inspection isn't possible, the business streams a live feed of premises to a verifying officer.

---

## Repository Layout

```
vyapardhara/
├── services/
│   ├── ingestion/          # Polls department APIs, normalises + pseudonymises records
│   ├── matching_engine/    # Entity resolution, UBID assignment, graph clustering
│   ├── vyaparcard/         # Physical credential issuance, QR + ECDSA signing
│   ├── livelink/           # Real-time WebSocket video sessions, frame signing
│   ├── activity_engine/    # Active / Dormant / Closed classification
│   └── dashboard/          # Frontend (this repo's React app simulates it)
├── database/               # Migrations, seeds, schema docs
├── notebooks/              # Calibration & analysis notebooks
└── .github/                # CI workflows
```

The frontend in `src/` is a React + TanStack Start prototype of the reviewer dashboard with **500 mock business records**, the ER review queue, LiveLink viewer, query console, and a fully interactive VyaparCard.

---

## Quick start (full stack)

```bash
cp .env.example .env
./setup.sh            # bootstraps Python venvs + node deps
docker-compose up     # starts all 6 services + Postgres + Neo4j
```

# Quick Start (Frontend Prototype)

The hackathon prototype can be run locally with a simple frontend setup.

```bash
npm install
npm run dev
```

The application will start locally at:

```bash
http://localhost:3000
```

This launches the interactive VyaparDhara dashboard prototype containing:
- Business Portal
- Government Reviewer Console
- UBID Review Queue
- LiveLink Verification Viewer
- VyaparCard Interface
- Compliance & Activity Monitoring
.
