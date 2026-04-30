# Architecture

## Monorepo layout

| Path | Role |
|------|------|
| `apps/web` | Next.js UI (Tailwind, IPTRUST tokens) |
| `apps/agent-api` | HTTP agent: orchestration, streaming, policy gates |
| `apps/mcp-research` | MCP stdio server: research tools |
| `packages/shared` | Types: evidence schema, API DTOs |
| `packages/connectors` | Source adapters (OpenAlex, Crossref, arXiv, public data, uploads) |
| `packages/data-cache` | In-memory LRU + dedupe for connector calls |

## Request flow

1. Browser → `apps/web` (Next.js) calls `apps/agent-api`.
2. Agent decomposes query → calls MCP tools via MCP client (stdio subprocess to `apps/mcp-research`) **or** in-process tool registry in development.
3. MCP tools use `packages/connectors` → normalized `EvidenceRecord[]` → optional `packages/data-cache`.
4. Agent merges evidence, applies policy (citations required), streams SSE to UI.

## Evidence model

Single normalized type in `packages/shared` (`EvidenceRecord`): source id, title, snippet, URL, published date, publisher, `sourceType`, `trustSignals`, `relevanceScore`.

## Deployment assumptions

- Node 20+.
- `MCP_RESEARCH_COMMAND` env points to `node apps/mcp-research/dist/index.js` (or `tsx` in dev).
- Secrets only via env; never committed.
