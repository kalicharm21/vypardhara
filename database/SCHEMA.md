# Database Schema

```
raw_records ──► shadow_records ──► ubid_members ──► ubid_registry
                                          │
                                          ├─► vyapar_cards
                                          ├─► delegates
                                          ├─► field_visits
                                          ├─► activity_events ──► classifications
                                          ├─► checkin_schedules
                                          └─► livelink_sessions ──► session_reports
```

Source records arrive in `raw_records` exactly as the department API returned
them. The ingestion service produces a normalised, pseudonymised projection
into `shadow_records`. The matching engine groups shadow records into UBIDs
via `ubid_members`. Every downstream artifact (cards, sessions, classifications)
keys off the UBID — so source systems are never modified.
