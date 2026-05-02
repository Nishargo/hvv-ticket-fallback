# Post Mortem 001: Export tokens not expiring correctly

## Date
Simulated incident - system design exercise

## Summary
Export tokens were not expiring at the correct time
causing tokens to remain valid significantly longer
than the intended 10 minute window.

## Impact
Tokens generated in certain timezones remained valid
for up to 70 minutes instead of 10 minutes creating
an unacceptable fraud window.

## Root cause
The expires_at timestamp was generated using
local server time rather than UTC. When the server
timezone differed from the database timezone the
expiry calculation was incorrect.

## Detection
Identified during code review before deployment
when reviewing token validation logic.

## Resolution
All timestamps standardized to UTC throughout
the application. Database configured to store
timestamps in UTC. Application generates all
expiry times using UTC explicitly.

## Changes made
All Date.now() calls replaced with explicit UTC
generation. Added timezone configuration to
database connection. Added test cases for token
expiry across multiple timezone scenarios.

## Lessons learned
Always use UTC for all timestamp generation and
storage. Never rely on server local time for
any time sensitive security logic. Test time
based logic explicitly as part of code review.