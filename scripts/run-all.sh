#!/usr/bin/env bash
# Run from repo root: ./scripts/run-all.sh [ci|dev|mcp]
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

usage() {
  echo "Usage: $0 <command>"
  echo "  ci   — pnpm install, build all packages, run tests (default)"
  echo "  dev  — install, build once, then agent-api + web dev servers together"
  echo "  mcp  — install, build workspace + start MCP stdio server (blocks; Ctrl+C to stop)"
  exit 1
}

CMD="${1:-ci}"
case "$CMD" in
  ci)
    pnpm install
    pnpm run build
    pnpm run test
    echo "run-all: ci finished OK"
    ;;
  dev)
    pnpm install
    pnpm run build
    pnpm run all:dev
    ;;
  mcp)
    pnpm install
    pnpm run build
    echo "run-all: starting MCP (stdio). Configure Cursor per docs/cursor-mcp.md"
    node apps/mcp-research/dist/index.js
    ;;
  -h|--help|help)
    usage
    ;;
  *)
    usage
    ;;
esac
