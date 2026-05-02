# ADR 003: Human readable short code for manual lookup

## Status
Accepted

## Context
Complete device failure with no preparation and no
secondary device has no digital solution. Inspectors
need a last resort verification method that works
without any technology on the passenger side.

## Decision
Generate a human readable short code for every ticket
in the format HH-4821-XK. Inspector enters code and
passenger name into a lookup tool. Backend confirms
validity instantly.

## Consequences
Positive: Works even when passenger has no device
at all. Mirrors how some existing railway systems
already handle device failure. Formalizes an informal
process that currently has no standard solution.

Negative: Relies on passenger remembering or having
written down their short code in advance. Inspector
requires access to lookup tool.

## Alternatives considered
Inspector phoning a verification hotline.
Rejected as too slow and operationally complex.

Passenger showing printed confirmation email only.
Rejected because email may not contain
verifiable information without backend check.