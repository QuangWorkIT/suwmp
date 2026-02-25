---
trigger: always_on
---

Antigravity Backend Job Execution Rule (ABJER)

1. Pre-Execution Validation (Fail Fast)

Before any job logic runs, Antigravity must validate:

+ Application context is fully initialized

+ Required environment variables exist (DB, Redis, JWT secret, AWS creds)

+ Job parameters are syntactically and semantically valid

+ Abort immediately on missing or invalid configuration

Rule: Never start business logic if configuration integrity is not guaranteed.

2. Security & Identity Context

Run jobs under a dedicated system identity (not a user JWT)

Do not reuse request-scoped security contexts

Explicitly disable unnecessary filters (e.g., JWT auth filter)

Rule: Jobs must be authenticated as system-level actors with minimal privileges.

3. Transaction Boundaries (JPA Discipline)

Each job step must define clear transactional scope

Prefer:

@Transactional(readOnly = true) for read jobs

Short-lived write transactions for mutations

Never mix long-running logic inside a single transaction

Rule: Transactions must be short, explicit, and purpose-scoped.

4. Idempotency Guarantee

Every backend job must be safe to re-run:

Use unique job keys (jobName + executionDate)

Check execution history (DB or Redis)

Prevent duplicate side effects (emails, S3 uploads, writes)

Rule: A job re-execution must not corrupt state.

5. Controlled Resource Usage

Limit:

DB batch size

Redis key TTL

S3 upload size per execution

Stream large datasets (never load fully into memory)

Rule: Jobs must scale linearly and predictably.

6. Error Classification & Handling

Errors must be categorized:

Recoverable (timeouts, temporary network issues) → retry

Non-recoverable (invalid data, schema mismatch) → abort

Security-related → log + alert immediately

Retries:

Max retries: 3

Backoff: exponential

Rule: Never retry blindly; retry only when recovery is plausible.

7. Observability & Auditability

Each job execution must emit:

Job ID

Start / End time

Execution status

Affected entities count

Failure reason (if any)

Use:

Logs → structured (JSON if possible)

Actuator → health indicators

Metrics → success/failure counters

Rule: If a job ran, it must be provable.

8. Isolation from Request Lifecycle

No dependency on:

HTTP session

Request headers

User cookies

Jobs must run identically whether triggered by:

Scheduler

Event

Manual admin trigger

Rule: Backend jobs are environment-agnostic.

9. External System Safety (Mail, Redis, S3)

Validate payloads before sending

Use timeout + circuit breaker patterns

Never block the main job thread on external services

Rule: External failures must degrade gracefully, not cascade.

10. Post-Execution Cleanup

Release resources

Clear thread-local or security context

Update execution status atomically

Rule: Every job must leave the system cleaner than it found it.