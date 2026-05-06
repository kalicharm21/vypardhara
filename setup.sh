#!/usr/bin/env bash
set -euo pipefail

echo "▸ VyaparDhara bootstrap"

if [ ! -f .env ]; then
  cp .env.example .env
  echo "  • created .env from .env.example"
fi

mkdir -p secrets
if [ ! -f secrets/ec_private.pem ]; then
  openssl ecparam -name prime256v1 -genkey -noout -out secrets/ec_private.pem
  openssl ec -in secrets/ec_private.pem -pubout -out secrets/ec_public.pem 2>/dev/null
  echo "  • generated ECDSA keypair"
fi

for svc in ingestion matching_engine vyaparcard livelink activity_engine; do
  echo "  • setting up services/${svc}"
  (cd "services/${svc}" && python -m venv .venv && .venv/bin/pip install -q -r requirements.txt) || true
done

echo "  • installing dashboard deps"
(cd services/dashboard && npm install --silent) || true

echo "✓ Bootstrap complete. Run: docker-compose up"
