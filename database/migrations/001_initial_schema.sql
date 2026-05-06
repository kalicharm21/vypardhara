-- Initial schema: shadow records + raw records.
CREATE TABLE IF NOT EXISTS raw_records (
  id SERIAL PRIMARY KEY,
  dept VARCHAR(64) NOT NULL,
  source_record_id VARCHAR(128) NOT NULL,
  payload JSONB NOT NULL,
  fetched_at TIMESTAMP NOT NULL DEFAULT NOW(),
  UNIQUE (dept, source_record_id)
);
CREATE TABLE IF NOT EXISTS shadow_records (
  id SERIAL PRIMARY KEY,
  raw_record_id INT NOT NULL REFERENCES raw_records(id) ON DELETE CASCADE,
  dept VARCHAR(64) NOT NULL,
  legal_name_norm VARCHAR(255),
  trade_name_norm VARCHAR(255),
  address_norm VARCHAR(512),
  pin VARCHAR(16),
  pan_pseudo VARCHAR(128),
  gstin_pseudo VARCHAR(128),
  extra JSONB,
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS ix_shadow_pin ON shadow_records(pin);
CREATE INDEX IF NOT EXISTS ix_shadow_pan ON shadow_records(pan_pseudo);
