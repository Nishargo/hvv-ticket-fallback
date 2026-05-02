# ADR 001: Stable QR over rotating codes

## Status
Accepted

## Context
The QR code must work offline on underground lines
with no signal. Rotating codes require backend
validation on every scan which fails without internet.
Hamburg U-Bahn lines frequently have no signal in
tunnels making this a real world constraint not a
theoretical one.

## Decision
Use a stable QR string valid for the full ticket
duration rather than rotating every 30 seconds.

## Consequences
Positive: Works completely offline without any
network connection. Simpler implementation.
No dependency on live backend for basic display.

Negative: Fraud prevention relies entirely on
backend validation rather than code expiry.
A copied QR remains valid until ticket expires.

## Alternatives considered
Rotating codes with 5 minute offline grace period.
Rejected because grace periods create exploitable
windows and add complexity without solving the
core offline problem.