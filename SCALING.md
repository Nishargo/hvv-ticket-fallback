# Scaling Considerations

Notes on how this system would handle growth from prototype to production scale.

## Current state

Single Railway instance, single PostgreSQL database. Suitable for low traffic and demonstration purposes.

## Database optimization (first priority)

The first bottleneck at scale is always the database. Every validation request queries the tickets table by short_code. Without an index this becomes a full table scan as data grows.

### Indexes planned

Short code lookups on tickets table:
CREATE INDEX idx_tickets_short_code ON tickets(short_code)

Token lookups on export_tokens table:
CREATE INDEX idx_export_tokens_token ON export_tokens(token)

These reduce lookup time from O(n) full table scan to O(log n) index scan. At 100,000 tickets the difference is roughly 50ms vs 0.1ms per query.

## Caching layer (second priority)

Ticket validation is a read heavy operation. The same ticket might be validated many times in a short period, for example at a busy station.

### Redis caching implemented

Validation results are cached for 60 seconds using Redis with ioredis client.

Cache key structure: validate:SHORT_CODE:NAME

Cache hit: Returns immediately without database query.
Cache miss: Queries database, stores result, returns.

At 10,000 validations per minute for the same ticket, caching reduces database load from 10,000 queries per minute to 1 query per minute.

### Tradeoff

If a ticket is deactivated mid-inspection, cached results remain valid for up to 60 seconds.
Acceptable tradeoff for this use case since ticket deactivation is not a real time operation.

## Horizontal scaling (third priority)

Single server has connection and memory limits. At high traffic run multiple app instances behind a load balancer. Railway supports this through
replica configuration.

Stateless design is required for this to work. The app is stateless because session data lives in JWT tokens, not server memory.

## Zero downtime deployment

At scale I can't restart the server to deploy. Railway handles this automatically through rolling deployments where new instances start before
old ones stop.

## Error monitoring

At scale errors happen constantly and silently. This is why Sentry integration captures every production error with full stack trace and context. Alerts when new error types appear.

## What breaks first at scale

1. Database queries without indexes
2. No caching on read heavy endpoints
3. Single server connection limits
4. No error visibility in production
5. Manual deployments causing downtime

## Further reading

Designing Data Intensive Applications - Martin Kleppmann
High Scalability blog - highscalability.com
AWS Architecture blog - aws.amazon.com/blogs/architecture
