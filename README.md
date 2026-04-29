# HVV Ticket Fallback System

A backend system that provides layered fallback mechanisms
for digital transit tickets when the primary device is
unavailable.

## Problem

Digital ticketing apps handle signal loss well. Tickets
are cached locally and display without network access.

The unsolved problem is device failure.

But in case battery dies during inspection or device is broken or fogetten at home, there is no ticket.
available on hand.

Users resort to screenshots, which are insecure, easily
faked, and rejected by most inspection systems.
Cross-device login requires email access and 2FA, which
is not realistic during a 30-second ticket inspection.

No official prepared fallback exists for device failure.

## Observations

Research based on real user complaints across app store
reviews, Reddit, and social media:

- Apps handle offline QR display well through local
  caching, but have no solution for device unavailability
- Cross-device login is too slow for real inspection
  scenarios
- Screenshots are the most common user workaround but
  provide no validation integrity
- No system provides a prepared, identity-bound fallback
  independent of the original device

## Solution

A layered fallback system where every layer remains
backend-verifiable. 

**Layer 1: QR code in app**
Normal case. Cached locally on first load, renders
without network connection.

**Layer 2: Wallet pass**
Normal case. One swipe from the lock screen. No app
needed, no network required.

**Layer 3: PDF export with short code**
Prepared in advance. The PDF contains a unique
identity-bound short code (e.g. HH-4821-XK).
Accessible from any device via email or print.
Inspector verifies the code against the backend.

**Layer 4: Temp share link**
Generated on a working device, opened on a borrowed
one. Expires after 10 minutes to prevent reuse.

**Layer 5: Inspector manual lookup**
Inspector enters the short
code and passenger name into a lookup tool. Backend
confirms validity instantly.

## Key design decisions

**Backend-verifiable fallbacks**
Every fallback layer routes through backend validation.
Short codes are identity-bound and only validate against
the name they were issued to.

**Stable QR over rotating codes**
The QR string remains valid for the ticket duration
rather than rotating periodically. This prioritizes
offline reliability for underground lines with no signal.
Fraud prevention is handled by the backend validation
layer rather than code expiry.

**TTL on export tokens**
Temp share links expire after 10 minutes. This limits
the window for misuse while still providing enough time
for a realistic inspection scenario.

**Defined scope**
This system fills the gap between normal operation and
complete device unavailability. It is not intended to
replace physical backup cards for the extreme edge case
of sudden battery death with no preparation and no
secondary device.

## Tech stack

- Node.js + Express
- PostgreSQL
- pdf-lib (PDF generation)
- JWT authentication

## Getting started

Clone the repo, copy .env.example to .env, fill in your
database URL and JWT secret, then run npm install and
npm run dev.

## Limitations

Truly sudden battery death with no preparation and no
access to a secondary device has no digital solution.
The inspector manual lookup covers this case as a last
resort, consistent with how some existing railway
systems already handle device failure through manual
verification.

The PDF export and temp link require either advance
preparation or access to a secondary device. They
address the majority of real-world failure scenarios
rather than every possible edge case.

## Live demo

Coming soon
