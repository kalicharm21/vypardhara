-- UBID registry + cluster membership + audit.
CREATE TABLE IF NOT EXISTS ubid_registry (
  ubid VARCHAR(32) PRIMARY KEY,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  status VARCHAR(16) NOT NULL DEFAULT 'active'
);
CREATE TABLE IF NOT EXISTS ubid_members (
  id SERIAL PRIMARY KEY,
  ubid VARCHAR(32) NOT NULL REFERENCES ubid_registry(ubid),
  shadow_record_id INT NOT NULL REFERENCES shadow_records(id),
  added_at TIMESTAMP NOT NULL DEFAULT NOW(),
  UNIQUE (shadow_record_id)
);
CREATE TABLE IF NOT EXISTS ubid_audit (
  id SERIAL PRIMARY KEY,
  ubid VARCHAR(32) NOT NULL,
  action VARCHAR(16) NOT NULL,
  details JSONB,
  ts TIMESTAMP NOT NULL DEFAULT NOW()
);
