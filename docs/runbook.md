# Runbook

## Local dev

1. `pnpm install`
2. `pnpm build` (or at minimum `pnpm --filter @itrust/shared build && pnpm --filter @itrust/connectors build`)
3. `pnpm dev:agent`
4. `pnpm dev:web`

## Performance budgets (targets)

- First SSE `meta` chunk: \< 500 ms localhost
- Academic fan-out (3 providers): complete within 15 s or surface partial results
- Upload search: \< 200 ms for manifests \< 5 MB

## Failure modes

| Symptom | Check |
|---------|------|
| 502 on `/api/agent/*` | Agent not running or `AGENT_API_URL` wrong |
| Empty academic results | Upstream rate limit; retry with narrower query |
| Uploads not found | `ITRUST_DATA_DIR` path and `manifest.jsonl` permissions |

## Security checklist

- Never log full user upload bodies in production logs.
- Keep outbound fetch allowlists inside connector modules (no arbitrary user URLs).
