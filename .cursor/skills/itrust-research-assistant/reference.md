# Reference

## Evidence record fields

| Field | Meaning |
|-------|---------|
| `id` | Stable id (`openalex:…`, `crossref:…`, `arxiv:…`, `hn:…`, `wb:…`, `upload:…`) |
| `sourceType` | Provenance channel |
| `claimSnippet` | Short excerpt used in synthesis |
| `citationUrl` | Best-effort link for user verification |
| `relevanceScore` | Relative ranking within a query (0–1) |

## Policy helper

`evaluateCitationPolicy` in `apps/agent-api` requires **≥2** distinct families among `{academic, realworld, upload}` before treating synthesis confidence as high.

## UI tokens

See repository `IPTRUST_design.md`: base `#FFFFFF`, ink `#0A1626`, accent `#A88B52`, 8px rhythm.
