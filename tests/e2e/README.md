# End-to-end tests (planned)

Playwright (or similar) journeys should cover:

1. `/research` streaming happy path against a running `agent-api`.
2. `/uploads` manifest append + visibility on `/research` query.

CI wiring is intentionally deferred; keep smoke coverage in `pnpm test` for packages and services.
