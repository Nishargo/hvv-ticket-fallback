# HVV Ticket Fallback System

## Problem
Digital ticketing systems fail under real-world conditions.
When a phone battery dies during inspection, users have no
official fallback. Common workarounds like screenshots are
insecure and often rejected by inspectors.

## Observations
- Existing apps rely entirely on device availability
- Cross-device login exists but is too slow under
  time pressure during inspection
- No official export mechanism exists in most systems

## Solution
A layered fallback system where every layer remains
backend-verifiable:

1. QR code in app (normal case)
2. Wallet pass (low battery)
3. Signed PDF with short code (no device)
4. Inspector manual lookup by short code + name

## Key design decision
Every fallback method routes through backend validation.
No static tokens that can be shared or reused.
Export links expire after 10 minutes (TTL).

## Tech stack
- Node.js + Express
- PostgreSQL
- pdf-lib (PDF generation)
- JWT auth

## Running locally
cp .env.example .env
npm install
psql -f src/db/schema.sql
npm run dev

## Live demo
[Railway/Render link coming soon]
