# ADR 002: TTL based export tokens

## Status
Accepted

## Context
Users need a way to share ticket access with a
borrowed device when their own device is unavailable.
Any sharing mechanism creates fraud risk if tokens
can be reused indefinitely.

## Decision
Generate single use tokens with a 10 minute TTL
stored in the database. Token is marked as used
after first access.

## Consequences
Positive: Severely limits fraud window.
Token is useless after 10 minutes or first use.
Realistic time window for a real inspection scenario.

Negative: User must generate a new token if
the first one expires before inspection.

## Alternatives considered
Longer TTL of 1 hour for more convenience.
Rejected because longer windows increase fraud risk
significantly with minimal usability benefit.

No expiry with single use only.
Rejected because a token intercepted before use
could be used by anyone indefinitely.