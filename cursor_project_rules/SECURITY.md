# Security

## Threat model (concise)

| Threat | Mitigation |
|--------|------------|
| SSRF via user URLs | Allowlist hosts per connector; block private IPs; timeout + size caps |
| Malicious uploads | Size limit; MIME sniff; PDF text extraction in sandboxed worker pattern (phase: stream parse only, no exec) |
| Secret leakage | Env-only; no logs of API keys; redact request headers in traces |
| Prompt injection | Treat retrieved text as untrusted data; policy gate blocks uncited claims |

## Upload policy

- Max upload size enforced in agent API (config constant).
- Stored files under `data/uploads/` (gitignored) with UUID filenames; metadata in memory/JSON for MVP.

## MCP / agent boundary

- MCP tools accept structured JSON only; validate with Zod before external fetch.
- Rate limits: per-connector token bucket in `packages/data-cache`.

## Dependencies

- Pin ranges in workspace; run `pnpm audit` in CI (documented in Phase 7).
