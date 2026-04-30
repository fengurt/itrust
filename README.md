# iTRUST Evaluation Model

Monorepo: **web** (Next.js + Tailwind, IPTRUST palette), **agent-api** (Hono + SSE research pipeline), **mcp-research** (MCP stdio tools), and shared **packages** (`shared`, `connectors`, `data-cache`).

## Prerequisites

- Node 20+
- [pnpm](https://pnpm.io) 9+

## Setup

```bash
pnpm install
pnpm build
```

## Run everything (script)

From the repo root:

```bash
chmod +x scripts/run-all.sh   # once
./scripts/run-all.sh ci       # install + build + test
./scripts/run-all.sh dev      # install + build + agent + web (two processes)
./scripts/run-all.sh mcp      # install + build + MCP stdio server
```

Equivalent with pnpm only:

```bash
pnpm run all:ci
pnpm run all:dev
```

## Run locally (separate terminals)

Terminal 1 — agent API (port 3001):

```bash
pnpm dev:agent
```

Terminal 2 — web (port 3000):

```bash
pnpm dev:web
```

Optional — MCP server (stdio, for Cursor / MCP clients):

```bash
pnpm --filter @itrust/mcp-research build
node apps/mcp-research/dist/index.js
```

## Configuration

| Variable | Purpose |
|----------|---------|
| `AGENT_API_URL` | Used by Next rewrites (default `http://127.0.0.1:3001`) |
| `PORT` | Agent API port (default `3001`) |
| `ITRUST_DATA_DIR` | Absolute path for `manifest.jsonl` uploads (default `<cwd>/data/uploads`) |

See [docs/environment-variables.md](docs/environment-variables.md).

## Governance

- [cursor_project_rules/](cursor_project_rules/)
- [implementation-plan.mdc](implementation-plan.mdc)

## Tests

```bash
pnpm test
```
